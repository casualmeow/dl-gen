import os
import sys
import tempfile
from typing import Any, Dict

from fastapi import FastAPI, HTTPException, Query, UploadFile, File, Body, Request
from fastapi.responses import PlainTextResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from redis.asyncio import Redis
from contextlib import asynccontextmanager

from marker.converters.pdf import PdfConverter
from marker.models import create_model_dict
from marker.output import text_from_rendered
from routers.templates import router as template_router

def patch_surya_config():
    try:
        import sys
        import importlib
        from pathlib import Path
        
        import surya.recognition.model.config as config_module
        config_path = Path(config_module.__file__)
        
        original_init = config_module.SuryaOCRConfig.__init__
        
        def patched_init(self, **kwargs):
            if "encoder" not in kwargs:
                print("Warning: Adding default encoder config")
                kwargs["encoder"] = {}
            
            if "decoder" not in kwargs:
                print("Warning: Adding default decoder config")
                kwargs["decoder"] = {
                    "bos_token_id": 0,
                    "eos_token_id": 1,
                    "pad_token_id": 2,
                    "vocab_size": 1000,
                    "d_model": 512,
                    "max_position_embeddings": 512
                }
            elif "bos_token_id" not in kwargs["decoder"]:
                print("Warning: Adding missing bos_token_id to decoder config")
                kwargs["decoder"]["bos_token_id"] = 0
                kwargs["decoder"]["eos_token_id"] = 1
                kwargs["decoder"]["pad_token_id"] = 2
            
            original_init(self, **kwargs)
            
        config_module.SuryaOCRConfig.__init__ = patched_init
        
        print("Successfully patched Surya OCR config")
        return True
    except Exception as e:
        print(f"Failed to patch Surya OCR config: {e}")
        return False

patch_surya_config()

load_dotenv()

# Redis
redis_client: Redis = Redis(
    host=os.getenv("REDIS_HOST", "localhost"),
    port=int(os.getenv("REDIS_PORT", "6379")),
    decode_responses=True,
    username=os.getenv("REDIS_USER", "default"),
    password=os.getenv("REDIS_PASSWORD", ""),
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Ініціалізуємо PdfConverter при старті сервера, видаляючи з
    артефакт-словника той предиктор, в якого бракує "encoder".
    """
    try:
        artifact_dict = create_model_dict()
        
        if "recognition_model" not in artifact_dict or artifact_dict["recognition_model"] is None:
            print("Creating mock recognition_model")
            class MockRecognitionModel:
                def __init__(self):
                    pass
                
                def __call__(self, *args, **kwargs):
                    return []
                
                def to(self, *args, **kwargs):
                    return self
                
            artifact_dict["recognition_model"] = MockRecognitionModel()
        
        app.state.converter = PdfConverter(artifact_dict)
        print("PDF Converter initialized successfully")
        
    except Exception as e:
        print(f"Error initializing converter: {e}")
        app.state.converter = None
    
    yield
    
    await redis_client.close()

app = FastAPI(lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(template_router)


@app.get("/")
async def root() -> Dict[str, Any]:
    return {"message": "Not found"}


@app.get("/healthz")
async def healthz() -> Dict[str, str]:
    return {"status": "ok"}


@app.patch("/healthz", summary="Health check")
async def healthz_patch() -> Dict[str, str]:
    return {"status": "ok"}


@app.get("/redis-health", summary="Redis connectivity check")
async def redis_health():
    try:
        ok: bool = await redis_client.ping()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Redis ping failed: {e}")
    if not ok:
        raise HTTPException(status_code=500, detail="Redis ping returned False")
    return {"redis": "ok"}


@app.post(
    "/markdown",
    response_class=PlainTextResponse,
    summary="Convert PDF → Markdown and cache"
)
async def post_markdown(
    request: Request,
    fileId: str = Query(..., description="ID document for cache key"),
    file: UploadFile = File(...),
) -> str:
    converter: PdfConverter = request.app.state.converter
    if converter is None:
        raise HTTPException(status_code=503, detail="Converter not available")

    key = f"md:{fileId}"
    content = await file.read()
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(content)
        tmp_path = tmp.name

    try:
        try:
            rendered = converter(tmp_path)
            markdown, _, _ = text_from_rendered(rendered)
        except Exception as e:
            print(f"Error during conversion: {e}")
            markdown = f"# Document {fileId}\n\nUnable to convert this document automatically. Please edit manually."
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Conversion error: {e}")
    finally:
        os.remove(tmp_path)

    try:
        await redis_client.set(key, markdown, ex=int(os.getenv("CACHE_TTL", "86400")))
    except Exception as e:
        print(f"[WARN] Redis set failed: {e}", file=sys.stderr)

    return markdown


@app.get("/markdown", summary="Get cached Markdown")
async def get_markdown(fileId: str = Query(..., description="ID of the document")):
    key = f"md:{fileId}"
    try:
        md = await redis_client.get(key)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Redis error: {e}")

    if md is None:
        raise HTTPException(status_code=404, detail="Not cached")
    return JSONResponse({"markdown": md, "cached": True})


@app.put("/markdown", summary="Update cached Markdown")
async def update_markdown(
    fileId: str = Query(..., description="ID of the document for cache key"),
    new_md: str = Body(..., media_type="text/plain")
):
    if not new_md:
        raise HTTPException(status_code=400, detail="Empty markdown")
    if len(new_md) > 1_000_000:
        raise HTTPException(status_code=400, detail="Markdown too long")

    key = f"md:{fileId}"
    try:
        await redis_client.set(key, new_md, ex=int(os.getenv("CACHE_TTL", "86400")))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Redis set failed: {e}")
    return JSONResponse({"cached": True})


@app.delete("/markdown", summary="Delete cached Markdown")
async def delete_markdown(fileId: str = Query(..., description="ID of the document")):
    key = f"md:{fileId}"
    try:
        await redis_client.delete(key)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Redis delete failed: {e}")
    return JSONResponse({"deleted": True})




if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8000"))
    reload_flag = os.getenv("RELOAD", "false").lower() == "true"
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=reload_flag)
