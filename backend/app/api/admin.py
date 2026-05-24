from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.db.session import get_db
from app.core.deps import get_current_user
from app.schemas.post import PostListItem, PostResponse, DashboardStats
from app.schemas.common import PaginatedResponse
from app.services.post import PostService
from app.models.user import User

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/posts/{post_id}", response_model=PostResponse)
def get_post_by_id(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a single post by ID (admin only, includes drafts)."""
    return PostService.get_post_by_id(db, post_id)


@router.get("/posts", response_model=PaginatedResponse[PostListItem])
def list_all_posts(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=50),
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    sort_by: str = Query("created_at"),
    sort_order: str = Query("desc", pattern="^(asc|desc)$"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List all posts (drafts + published) for admin with filtering and sorting."""
    return PostService.get_all_posts(
        db,
        page=page,
        page_size=page_size,
        status_filter=status,
        search=search,
        sort_by=sort_by,
        sort_order=sort_order,
    )


@router.get("/dashboard", response_model=DashboardStats)
def get_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get dashboard statistics (admin only)."""
    return PostService.get_dashboard_stats(db)
