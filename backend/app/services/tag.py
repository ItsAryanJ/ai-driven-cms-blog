from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.tag import Tag, post_tags
from app.schemas.tag import TagCreate, TagUpdate
from app.utils.slug import generate_slug, ensure_unique_slug


class TagService:
    @staticmethod
    def get_all(db: Session) -> list:
        return db.query(Tag).order_by(Tag.name.asc()).all()

    @staticmethod
    def get_all_with_counts(db: Session) -> list:
        tags = db.query(Tag).order_by(Tag.name.asc()).all()
        result = []
        for tag in tags:
            post_count = db.query(post_tags).filter(post_tags.c.tag_id == tag.id).count()
            result.append({
                "id": tag.id,
                "name": tag.name,
                "slug": tag.slug,
                "post_count": post_count,
            })
        return result

    @staticmethod
    def get_by_slug(db: Session, slug: str) -> Tag:
        tag = db.query(Tag).filter(Tag.slug == slug).first()
        if not tag:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tag not found",
            )
        return tag

    @staticmethod
    def get_by_id(db: Session, tag_id: int) -> Tag:
        tag = db.query(Tag).filter(Tag.id == tag_id).first()
        if not tag:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tag not found",
            )
        return tag

    @staticmethod
    def create(db: Session, data: TagCreate) -> Tag:
        existing = db.query(Tag).filter(Tag.name == data.name).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Tag with this name already exists",
            )

        slug = generate_slug(data.name)
        slug = ensure_unique_slug(db, Tag, slug)

        tag = Tag(name=data.name, slug=slug)
        db.add(tag)
        db.commit()
        db.refresh(tag)
        return tag

    @staticmethod
    def update(db: Session, tag_id: int, data: TagUpdate) -> Tag:
        tag = db.query(Tag).filter(Tag.id == tag_id).first()
        if not tag:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tag not found",
            )

        if data.name and data.name != tag.name:
            existing = db.query(Tag).filter(Tag.name == data.name, Tag.id != tag_id).first()
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Tag with this name already exists",
                )
            tag.name = data.name
            slug = generate_slug(data.name)
            tag.slug = ensure_unique_slug(db, Tag, slug, exclude_id=tag_id)

        db.commit()
        db.refresh(tag)
        return tag

    @staticmethod
    def delete(db: Session, tag_id: int) -> None:
        tag = db.query(Tag).filter(Tag.id == tag_id).first()
        if not tag:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tag not found",
            )
        db.delete(tag)
        db.commit()
