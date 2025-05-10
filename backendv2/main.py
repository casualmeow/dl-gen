# main.py
import os
import tempfile

from fastapi import FastAPI, HTTPException, Query, UploadFile, File
from fastapi.responses import PlainTextResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware

import httpx 

from marker.converters.pdf import PdfConverter
from marker.models import create_model_dict
from marker.output import text_from_rendered

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

converter = PdfConverter(artifact_dict=create_model_dict())

@app.get("/")
async def root():
    return {"message": "Not found"}

@app.get("/healthz")
async def healthz():
    return {"status": "ok"}


@app.post(
    "/convert-file",
    response_class=PlainTextResponse,
    summary="Convert uploaded PDF → Markdown via POST"
)
async def convert_pdf_file(file: UploadFile = File(...)):
    content = await file.read()
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(content)
        tmp_path = tmp.name
    try:
        rendered = converter(tmp_path)
        markdown, _, _ = text_from_rendered(rendered)
    except Exception as e:
        raise HTTPException(500, f"Conversion error: {e}")
    finally:
        os.remove(tmp_path)
    return markdown

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
