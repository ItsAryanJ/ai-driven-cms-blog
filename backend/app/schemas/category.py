from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class CategoryCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)


class CategoryUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)


class CategoryResponse(BaseModel):
    id: int
    name: str
    slug: str

    class Config:
        from_attributes = True


class CategoryWithCount(CategoryResponse):
    post_count: int = 0
