# main.py
import os
import tempfile

from fastapi import FastAPI, HTTPException, Query, UploadFile, File
from fastapi.responses import PlainTextResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware

import httpx
import fitz  

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

# initialize once
converter = PdfConverter(artifact_dict=create_model_dict())

@app.get("/")
async def root():
    return {"message": "Welcome to DL-Gen API. See /docs"}

@app.get("/healthz")
async def healthz():
    return {"status": "ok"}

@app.get(
    "/api/convert",
    response_class=PlainTextResponse,
    summary="Convert remote PDF → Markdown",
)
async def convert_pdf_to_md(
    fileUrl: str = Query(..., description="Fully-qualified URL of the PDF")
):
    # 1) download
    async with httpx.AsyncClient(timeout=60.0) as client:
        resp = await client.get(fileUrl)
    if resp.status_code != 200:
        raise HTTPException(resp.status_code, f"Download failed: {fileUrl}")

    # 2) write to temp file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(resp.content)
        tmp_path = tmp.name

    try:
        # 3) convert via Marker
        rendered = converter(tmp_path)
        markdown, _, _ = text_from_rendered(rendered)
    except Exception as e:
        raise HTTPException(500, f"Conversion error: {e}")
    finally:
        os.remove(tmp_path)

    return markdown

@app.post(
    "/api/pdf-has-password",
    summary="Check if an uploaded PDF is password-protected",
)
async def pdf_has_password(file: UploadFile = File(...)):
    content = await file.read()
    try:
        # PyMuPDF can open from bytes directly
        with fitz.open(stream=content, filetype="pdf") as doc:
            return {"hasPassword": False}
    except RuntimeError as e:
        if "password" in str(e).lower():
            return {"hasPassword": True}
        # unknown error
        return JSONResponse({"error": "Unknown PDF error"}, status_code=500)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
