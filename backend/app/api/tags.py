from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.core.deps import get_current_user
from app.schemas.tag import TagCreate, TagUpdate, TagResponse, TagWithCount
from app.schemas.common import MessageResponse
from app.services.tag import TagService
from app.models.user import User

router = APIRouter(prefix="/tags", tags=["tags"])


@router.get("", response_model=List[TagWithCount])
def list_tags(db: Session = Depends(get_db)):
    """List all tags with post counts."""
    return TagService.get_all_with_counts(db)


@router.post("", response_model=TagResponse, status_code=201)
def create_tag(
    data: TagCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new tag (admin only)."""
    return TagService.create(db, data)


@router.put("/{tag_id}", response_model=TagResponse)
def update_tag(
    tag_id: int,
    data: TagUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update a tag (admin only)."""
    return TagService.update(db, tag_id, data)


@router.delete("/{tag_id}", response_model=MessageResponse)
def delete_tag(
    tag_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a tag (admin only)."""
    TagService.delete(db, tag_id)
    return {"message": "Tag deleted successfully"}
