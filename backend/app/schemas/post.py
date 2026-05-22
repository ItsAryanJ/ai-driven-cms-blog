from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

from app.schemas.category import CategoryResponse
from app.schemas.tag import TagResponse


class PostCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=300)
    excerpt: Optional[str] = Field(None, max_length=500)
    body: str = Field(..., min_length=1)
    category_id: Optional[int] = None
    tag_ids: List[int] = Field(default_factory=list)
    status: str = Field(default="draft", pattern="^(draft|published)$")


class PostUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=300)
    excerpt: Optional[str] = Field(None, max_length=500)
    body: Optional[str] = Field(None, min_length=1)
    category_id: Optional[int] = None
    tag_ids: Optional[List[int]] = None
    status: Optional[str] = Field(None, pattern="^(draft|published)$")


class PostAuthor(BaseModel):
    id: int
    email: str

    class Config:
        from_attributes = True


class PostResponse(BaseModel):
    id: int
    title: str
    slug: str
    excerpt: Optional[str]
    body: str
    status: str
    author: PostAuthor
    category: Optional[CategoryResponse]
    tags: List[TagResponse]
    created_at: datetime
    updated_at: datetime
    published_at: Optional[datetime]

    class Config:
        from_attributes = True


class PostListItem(BaseModel):
    id: int
    title: str
    slug: str
    excerpt: Optional[str]
    status: str
    author: PostAuthor
    category: Optional[CategoryResponse]
    tags: List[TagResponse]
    created_at: datetime
    updated_at: datetime
    published_at: Optional[datetime]

    class Config:
        from_attributes = True


class DashboardStats(BaseModel):
    total_posts: int
    published_posts: int
    draft_posts: int
    total_categories: int
    total_tags: int
