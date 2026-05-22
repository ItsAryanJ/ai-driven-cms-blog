from sqlalchemy.orm import Session
from sqlalchemy import or_
from fastapi import HTTPException, status
from typing import Optional
from datetime import datetime, timezone
import math

from app.models.post import Post, PostStatus
from app.models.tag import Tag
from app.models.category import Category
from app.schemas.post import PostCreate, PostUpdate
from app.utils.slug import generate_slug, ensure_unique_slug


class PostService:
    @staticmethod
    def get_published_posts(
        db: Session,
        page: int = 1,
        page_size: int = 10,
        category_slug: Optional[str] = None,
        tag_slug: Optional[str] = None,
    ) -> dict:
        query = db.query(Post).filter(Post.status == PostStatus.PUBLISHED)

        if category_slug:
            category = db.query(Category).filter(Category.slug == category_slug).first()
            if category:
                query = query.filter(Post.category_id == category.id)
            else:
                return {"items": [], "total": 0, "page": page, "page_size": page_size, "total_pages": 0}

        if tag_slug:
            tag = db.query(Tag).filter(Tag.slug == tag_slug).first()
            if tag:
                query = query.filter(Post.tags.any(Tag.id == tag.id))
            else:
                return {"items": [], "total": 0, "page": page, "page_size": page_size, "total_pages": 0}

        total = query.count()
        total_pages = math.ceil(total / page_size) if total > 0 else 0
        offset = (page - 1) * page_size

        posts = query.order_by(Post.published_at.desc()).offset(offset).limit(page_size).all()

        return {
            "items": posts,
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": total_pages,
        }

    @staticmethod
    def get_all_posts(
        db: Session,
        page: int = 1,
        page_size: int = 10,
        status_filter: Optional[str] = None,
        search: Optional[str] = None,
        sort_by: str = "created_at",
        sort_order: str = "desc",
    ) -> dict:
        query = db.query(Post)

        if status_filter and status_filter in ["draft", "published"]:
            query = query.filter(Post.status == PostStatus(status_filter))

        if search:
            search_term = f"%{search}%"
            query = query.filter(
                or_(
                    Post.title.ilike(search_term),
                    Post.excerpt.ilike(search_term),
                    Post.body.ilike(search_term),
                )
            )

        # Sorting
        sort_column = getattr(Post, sort_by, Post.created_at)
        if sort_order == "asc":
            query = query.order_by(sort_column.asc())
        else:
            query = query.order_by(sort_column.desc())

        total = query.count()
        total_pages = math.ceil(total / page_size) if total > 0 else 0
        offset = (page - 1) * page_size

        posts = query.offset(offset).limit(page_size).all()

        return {
            "items": posts,
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": total_pages,
        }

    @staticmethod
    def get_post_by_slug(db: Session, slug: str) -> Post:
        post = db.query(Post).filter(Post.slug == slug).first()
        if not post:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Post not found",
            )
        return post

    @staticmethod
    def get_post_by_id(db: Session, post_id: int) -> Post:
        post = db.query(Post).filter(Post.id == post_id).first()
        if not post:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Post not found",
            )
        return post

    @staticmethod
    def create_post(db: Session, post_data: PostCreate, author_id: int) -> Post:
        slug = generate_slug(post_data.title)
        slug = ensure_unique_slug(db, Post, slug)

        # Validate category if provided
        if post_data.category_id:
            category = db.query(Category).filter(Category.id == post_data.category_id).first()
            if not category:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Category not found",
                )

        # Validate and fetch tags
        tags = []
        if post_data.tag_ids:
            tags = db.query(Tag).filter(Tag.id.in_(post_data.tag_ids)).all()
            if len(tags) != len(post_data.tag_ids):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="One or more tags not found",
                )

        published_at = None
        if post_data.status == "published":
            published_at = datetime.now(timezone.utc)

        post = Post(
            title=post_data.title,
            slug=slug,
            excerpt=post_data.excerpt,
            body=post_data.body,
            author_id=author_id,
            category_id=post_data.category_id,
            status=PostStatus(post_data.status),
            published_at=published_at,
        )
        post.tags = tags

        db.add(post)
        db.commit()
        db.refresh(post)
        return post

    @staticmethod
    def update_post(db: Session, post_id: int, post_data: PostUpdate) -> Post:
        post = db.query(Post).filter(Post.id == post_id).first()
        if not post:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Post not found",
            )

        update_data = post_data.model_dump(exclude_unset=True)

        if "title" in update_data and update_data["title"]:
            slug = generate_slug(update_data["title"])
            slug = ensure_unique_slug(db, Post, slug, exclude_id=post_id)
            post.title = update_data["title"]
            post.slug = slug

        if "excerpt" in update_data:
            post.excerpt = update_data["excerpt"]

        if "body" in update_data and update_data["body"]:
            post.body = update_data["body"]

        if "category_id" in update_data:
            if update_data["category_id"] is not None:
                category = db.query(Category).filter(Category.id == update_data["category_id"]).first()
                if not category:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Category not found",
                    )
            post.category_id = update_data["category_id"]

        if "tag_ids" in update_data and update_data["tag_ids"] is not None:
            tags = db.query(Tag).filter(Tag.id.in_(update_data["tag_ids"])).all()
            if len(tags) != len(update_data["tag_ids"]):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="One or more tags not found",
                )
            post.tags = tags

        if "status" in update_data and update_data["status"]:
            new_status = PostStatus(update_data["status"])
            if new_status == PostStatus.PUBLISHED and post.status != PostStatus.PUBLISHED:
                post.published_at = datetime.now(timezone.utc)
            elif new_status == PostStatus.DRAFT:
                post.published_at = None
            post.status = new_status

        db.commit()
        db.refresh(post)
        return post

    @staticmethod
    def delete_post(db: Session, post_id: int) -> None:
        post = db.query(Post).filter(Post.id == post_id).first()
        if not post:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Post not found",
            )
        db.delete(post)
        db.commit()

    @staticmethod
    def search_posts(db: Session, query_str: str, page: int = 1, page_size: int = 10) -> dict:
        search_term = f"%{query_str}%"
        query = db.query(Post).filter(
            Post.status == PostStatus.PUBLISHED,
            or_(
                Post.title.ilike(search_term),
                Post.excerpt.ilike(search_term),
                Post.body.ilike(search_term),
            ),
        )

        total = query.count()
        total_pages = math.ceil(total / page_size) if total > 0 else 0
        offset = (page - 1) * page_size

        posts = query.order_by(Post.published_at.desc()).offset(offset).limit(page_size).all()

        return {
            "items": posts,
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": total_pages,
        }

    @staticmethod
    def get_dashboard_stats(db: Session) -> dict:
        total_posts = db.query(Post).count()
        published_posts = db.query(Post).filter(Post.status == PostStatus.PUBLISHED).count()
        draft_posts = db.query(Post).filter(Post.status == PostStatus.DRAFT).count()
        total_categories = db.query(Category).count()
        total_tags = db.query(Tag).count()

        return {
            "total_posts": total_posts,
            "published_posts": published_posts,
            "draft_posts": draft_posts,
            "total_categories": total_categories,
            "total_tags": total_tags,
        }
