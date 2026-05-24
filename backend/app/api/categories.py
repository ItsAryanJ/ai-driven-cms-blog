from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.core.deps import get_current_user
from app.schemas.category import CategoryCreate, CategoryUpdate, CategoryResponse, CategoryWithCount
from app.schemas.common import MessageResponse
from app.services.category import CategoryService
from app.models.user import User

router = APIRouter(prefix="/categories", tags=["categories"])


@router.get("", response_model=List[CategoryWithCount])
def list_categories(db: Session = Depends(get_db)):
    """List all categories with post counts."""
    return CategoryService.get_all_with_counts(db)


@router.post("", response_model=CategoryResponse, status_code=201)
def create_category(
    data: CategoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new category (admin only)."""
    return CategoryService.create(db, data)


@router.put("/{category_id}", response_model=CategoryResponse)
def update_category(
    category_id: int,
    data: CategoryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update a category (admin only)."""
    return CategoryService.update(db, category_id, data)


@router.delete("/{category_id}", response_model=MessageResponse)
def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a category (admin only)."""
    CategoryService.delete(db, category_id)
    return {"message": "Category deleted successfully"}
