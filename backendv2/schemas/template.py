# schemas/template.py
from pydantic import BaseModel, Field, model_validator
from datetime import datetime
from typing import Optional

class TemplateBase(BaseModel):
    name: str
    description: Optional[str] = None
    body: str
    tags: Optional[list[str]] = None

    @model_validator(mode="before")
    @classmethod
    def split_tags(cls, values):
        t = values.get("tags")
        if isinstance(t, str):
            values["tags"] = [s.strip() for s in t.split(",") if s.strip()]
        return values

class TemplateCreate(TemplateBase):
    pass

class TemplateUpdate(BaseModel):
    name: Optional[str]
    description: Optional[str] = None
    body: Optional[str]
    tags: Optional[list[str]] = None

    @model_validator(mode="before")
    @classmethod
    def split_tags(cls, values):
        t = values.get("tags")
        if isinstance(t, str):
            values["tags"] = [s.strip() for s in t.split(",") if s.strip()]
        return values

class TemplateInDB(TemplateBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
