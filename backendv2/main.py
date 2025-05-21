
import os
import sys
import tempfile
from typing import Any, Dict

from fastapi import FastAPI, HTTPException, Query, UploadFile, File, Body
from fastapi.responses import PlainTextResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from dotenv import load_dotenv
from redis.asyncio import Redis 

from marker.converters.pdf import PdfConverter
from marker.models import create_model_dict
from marker.output import text_from_rendered
from routers.templates import router as template_router

load_dotenv()

r: Redis = Redis(
    host=os.getenv("REDIS_HOST", "localhost"),
    port=int(os.getenv("REDIS_PORT", "6379")),
    decode_responses=True,
    username=os.getenv("REDIS_USER", "default"),
    password=os.getenv("REDIS_PASSWORD", ""),
)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(template_router)

converter = PdfConverter(artifact_dict=create_model_dict())

@app.get("/")
async def root() -> Dict[str, Any]:
    return {"message": "Not found"}

@app.get("/healthz")
async def healthz() -> Dict[str, str]:
    return {"status": "ok"}

app.patch(
    "/healthz", summary="Health check")
async def healthz_put() -> Dict[str, str]:
    return {"status": "ok"}

@app.get("/redis-health", summary="Redis connectivity check")
async def redis_health():
    if r is None:
        raise HTTPException(status_code=503, detail="Redis not configured")

    try:
        ok: bool = await r.ping()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Redis ping failed: {e}")

    if not ok:
        raise HTTPException(status_code=500, detail="Redis ping returned False")

    return {"redis": "ok"}

#markdown
@app.post(
    "/markdown",
    response_class=PlainTextResponse,
    summary="Convert PDF → Markdown and cache"
)
async def post_markdown(
    fileId: str = Query(..., description="ID документа для ключа кешу"),
    file: UploadFile = File(...),
) -> str:
    key = f"md:{fileId}"

    content = await file.read()
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(content)
        tmp_path = tmp.name

    try:
        rendered = converter(tmp_path)
        markdown, _, _ = text_from_rendered(rendered)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Conversion error: {e}")
    finally:
        os.remove(tmp_path)

    if r:
        try:
            await r.set(key, markdown, ex=int(os.getenv("CACHE_TTL", "86400")))
        except Exception as e:
            print(f"⚠️ Redis set failed: {e}", file=sys.stderr)

    return markdown

@app.get(
    "/markdown",
    summary="Get cached Markdown"
)
async def get_markdown(fileId: str = Query(..., description="ID of the document")):
    if not r:
        raise HTTPException(status_code=503, detail="Redis not configured")

    key = f"md:{fileId}"
    try:
        md = await r.get(key)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Redis error: {e}")

    if md is None:
        raise HTTPException(status_code=404, detail="Not cached")
    return JSONResponse({"markdown": md, "cached": True})

@app.put(
    "/markdown",
    summary="Update cached Markdown",
)
async def update_markdown(
    fileId: str = Query(..., description="ID of the document for cache key"),
    new_md: str = Body(..., media_type="text/plain")
):
    if not r:
        raise HTTPException(status_code=503, detail="Redis not configured")
    if not new_md:
        raise HTTPException(status_code=400, detail="Empty markdown")
    if len(new_md) > 1000000:
        raise HTTPException(status_code=400, detail="Markdown too long")
    if not fileId:
        raise HTTPException(status_code=400, detail="Empty fileId")
    
    try:
        await r.set(f"md:{fileId}", new_md, ex=int(os.getenv("CACHE_TTL", "86400")))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Redis set failed: {e}")
    return JSONResponse({"cached": True})

@app.delete(
    "/markdown",
    summary="Delete cached Markdown"
)
async def delete_markdown(fileId: str = Query(..., description="ID of the document")):
    if not r:
        raise HTTPException(status_code=503, detail="Redis not configured")

    key = f"md:{fileId}"
    try:
        await r.delete(key)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Redis delete failed: {e}")

    return JSONResponse({"deleted": True})

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8000"))
    reload = os.getenv("RELOAD", "false").lower() == "true"
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=reload)
