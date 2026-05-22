from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.category import Category
from app.models.post import Post
from app.schemas.category import CategoryCreate, CategoryUpdate
from app.utils.slug import generate_slug, ensure_unique_slug


class CategoryService:
    @staticmethod
    def get_all(db: Session) -> list:
        return db.query(Category).order_by(Category.name.asc()).all()

    @staticmethod
    def get_all_with_counts(db: Session) -> list:
        categories = db.query(Category).order_by(Category.name.asc()).all()
        result = []
        for cat in categories:
            post_count = db.query(Post).filter(Post.category_id == cat.id).count()
            result.append({
                "id": cat.id,
                "name": cat.name,
                "slug": cat.slug,
                "post_count": post_count,
            })
        return result

    @staticmethod
    def get_by_slug(db: Session, slug: str) -> Category:
        category = db.query(Category).filter(Category.slug == slug).first()
        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Category not found",
            )
        return category

    @staticmethod
    def get_by_id(db: Session, category_id: int) -> Category:
        category = db.query(Category).filter(Category.id == category_id).first()
        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Category not found",
            )
        return category

    @staticmethod
    def create(db: Session, data: CategoryCreate) -> Category:
        existing = db.query(Category).filter(Category.name == data.name).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Category with this name already exists",
            )

        slug = generate_slug(data.name)
        slug = ensure_unique_slug(db, Category, slug)

        category = Category(name=data.name, slug=slug)
        db.add(category)
        db.commit()
        db.refresh(category)
        return category

    @staticmethod
    def update(db: Session, category_id: int, data: CategoryUpdate) -> Category:
        category = db.query(Category).filter(Category.id == category_id).first()
        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Category not found",
            )

        if data.name and data.name != category.name:
            existing = db.query(Category).filter(Category.name == data.name, Category.id != category_id).first()
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Category with this name already exists",
                )
            category.name = data.name
            slug = generate_slug(data.name)
            category.slug = ensure_unique_slug(db, Category, slug, exclude_id=category_id)

        db.commit()
        db.refresh(category)
        return category

    @staticmethod
    def delete(db: Session, category_id: int) -> None:
        category = db.query(Category).filter(Category.id == category_id).first()
        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Category not found",
            )
        db.delete(category)
        db.commit()
