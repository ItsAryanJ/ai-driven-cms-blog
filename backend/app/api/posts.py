from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.db.session import get_db
from app.core.deps import get_current_user
from app.schemas.post import PostCreate, PostUpdate, PostResponse, PostListItem
from app.schemas.common import PaginatedResponse, MessageResponse
from app.services.post import PostService
from app.models.user import User

router = APIRouter(prefix="/posts", tags=["posts"])


@router.get("", response_model=PaginatedResponse[PostListItem])
def list_published_posts(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=50),
    category: Optional[str] = Query(None),
    tag: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    """List published posts with optional category/tag filtering."""
    result = PostService.get_published_posts(
        db, page=page, page_size=page_size, category_slug=category, tag_slug=tag
    )
    return result


@router.get("/{slug}", response_model=PostResponse)
def get_post(slug: str, db: Session = Depends(get_db)):
    """Get a single post by slug (public, published only)."""
    post = PostService.get_post_by_slug(db, slug)
    if post.status.value != "published":
        from fastapi import HTTPException, status
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    return post


@router.post("", response_model=PostResponse, status_code=201)
def create_post(
    post_data: PostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new post (admin only)."""
    return PostService.create_post(db, post_data, current_user.id)


@router.put("/{post_id}", response_model=PostResponse)
def update_post(
    post_id: int,
    post_data: PostUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update an existing post (admin only)."""
    return PostService.update_post(db, post_id, post_data)


@router.delete("/{post_id}", response_model=MessageResponse)
def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a post (admin only)."""
    PostService.delete_post(db, post_id)
    return {"message": "Post deleted successfully"}
