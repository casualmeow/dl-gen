from fastapi import APIRouter, Depends, Path
from typing import List
from schemas.template import TemplateCreate, TemplateUpdate, TemplateInDB
import services.templates as svc

router = APIRouter(prefix="/templates", tags=["templates"])

@router.get("/", response_model=List[TemplateInDB])
async def read_templates():
    return await svc.list_templates()

@router.get("/{template_id}", response_model=TemplateInDB)
async def read_template(template_id: int = Path(..., gt=0)):
    return await svc.get_template(template_id)

@router.post("/", response_model=TemplateInDB)
async def create_template(t: TemplateCreate):
    return await svc.create_template(t)

@router.put("/{template_id}", response_model=TemplateInDB)
async def update_template(template_id: int, t: TemplateUpdate):
    return await svc.update_template(template_id, t)

@router.delete("/{template_id}", response_model=dict)
async def delete_template(template_id: int):
    return await svc.delete_template(template_id)
