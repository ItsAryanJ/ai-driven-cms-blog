from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.post import PostListItem
from app.schemas.common import PaginatedResponse
from app.services.post import PostService

router = APIRouter(prefix="/search", tags=["search"])


@router.get("", response_model=PaginatedResponse[PostListItem])
def search_posts(
    q: str = Query(..., min_length=1, max_length=200),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db),
):
    """Search published posts by title, body, and excerpt."""
    return PostService.search_posts(db, q, page=page, page_size=page_size)
