from fastapi import FastAPI, Depends, HTTPException, status, Header
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from datetime import timedelta
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, EmailStr
import fitz 
from werkzeug.utils import secure_filename

# Create FastAPI app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to DL-Gen API. Please use /docs for API documentation"}

@app.get("/healthcheck")
async def healthcheck():
    return {"status": "all is ok"}

@app.route("/pdfHasPassword", methods=["POST"])
def pdfHasPassword():
    file = request.files["file"]
    filename = secure_filename(file.filename)
    file_path = f"/tmp/{filename}"
    file.save(file_path)

    try:
        doc = fitz.open(file_path)
        return jsonify(hasPassword=False)
    except RuntimeError as e:
        if "password" in str(e).lower():
            return jsonify(hasPassword=True)
        return jsonify(error="Unknown error"), 500
    finally:
        import os
        os.remove(file_path)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)