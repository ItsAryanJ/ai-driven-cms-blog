from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, func, Enum as SAEnum
from sqlalchemy.orm import relationship
import enum

from app.db.base import Base
from app.models.tag import post_tags


class PostStatus(str, enum.Enum):
    DRAFT = "draft"
    PUBLISHED = "published"


class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(300), nullable=False)
    slug = Column(String(350), unique=True, nullable=False, index=True)
    excerpt = Column(Text, nullable=True)
    body = Column(Text, nullable=False)
    author_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="SET NULL"), nullable=True)
    status = Column(SAEnum(PostStatus), default=PostStatus.DRAFT, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    published_at = Column(DateTime(timezone=True), nullable=True)

    author = relationship("User", back_populates="posts", lazy="selectin")
    category = relationship("Category", back_populates="posts", lazy="selectin")
    tags = relationship("Tag", secondary=post_tags, back_populates="posts", lazy="selectin")

    def __repr__(self) -> str:
        return f"<Post(id={self.id}, title={self.title}, status={self.status})>"
