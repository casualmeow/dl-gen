# services/templates.py
from typing import List, Any
from fastapi import HTTPException
from utils import supabase
from schemas.template import TemplateCreate, TemplateUpdate, TemplateInDB

TABLE = "templates"

def _ensure_data(resp: Any, expect_single: bool = False) -> List[dict]:
    """
    - If resp.error is set, raise a 500.
    - If expect_single=True and resp.data is empty, raise a 404.
    - Otherwise return resp.data (or empty list).
    """
    err = getattr(resp, "error", None)
    if err:
        detail = getattr(err, "message", repr(err))
        raise HTTPException(status_code=500, detail=detail)

    data = getattr(resp, "data", None)
    if data is None or not isinstance(data, list):
        raise HTTPException(status_code=500, detail="Unexpected response format from Supabase")

    if expect_single and len(data) == 0:
        raise HTTPException(status_code=404, detail="Not found")

    return data

async def list_templates() -> List[TemplateInDB]:
    resp = supabase.table(TABLE).select("*").execute()
    rows = _ensure_data(resp)
    return [TemplateInDB(**row) for row in rows]

async def get_template(template_id: int) -> TemplateInDB:
    resp = supabase.table(TABLE).select("*").eq("id", template_id).execute()
    rows = _ensure_data(resp, expect_single=True)
    return TemplateInDB(**rows[0])

async def create_template(t: TemplateCreate) -> TemplateInDB:
    resp = supabase.table(TABLE).insert(t.model_dump()).execute()
    rows = _ensure_data(resp, expect_single=True)
    return TemplateInDB(**rows[0])

async def update_template(template_id: int, t: TemplateUpdate) -> TemplateInDB:
    resp = (
        supabase
        .table(TABLE)
        .update(t.model_dump(exclude_none=True))
        .eq("id", template_id)
        .execute()
    )
    rows = _ensure_data(resp, expect_single=True)
    return TemplateInDB(**rows[0])

async def delete_template(template_id: int) -> dict:
    resp = supabase.table(TABLE).delete().eq("id", template_id).execute()

    err = getattr(resp, "error", None)
    if err:
        detail = getattr(err, "message", repr(err))
        raise HTTPException(status_code=500, detail=detail)

    data = getattr(resp, "data", None)
    if not data or not isinstance(data, list) or len(data) == 0:
        raise HTTPException(status_code=404, detail=f"Template {template_id} not found or not permitted to delete")

    return {"deleted": True}

