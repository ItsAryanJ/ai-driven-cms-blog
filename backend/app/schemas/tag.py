from pydantic import BaseModel, Field
from typing import Optional


class TagCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)


class TagUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)


class TagResponse(BaseModel):
    id: int
    name: str
    slug: str

    class Config:
        from_attributes = True


class TagWithCount(TagResponse):
    post_count: int = 0
