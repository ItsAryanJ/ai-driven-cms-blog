import re
import unicodedata
from sqlalchemy.orm import Session


def generate_slug(title: str) -> str:
    """Generate a URL-friendly slug from a title."""
    # Normalize unicode characters
    slug = unicodedata.normalize("NFKD", title)
    slug = slug.encode("ascii", "ignore").decode("ascii")
    # Convert to lowercase
    slug = slug.lower()
    # Replace spaces and special characters with hyphens
    slug = re.sub(r"[^\w\s-]", "", slug)
    slug = re.sub(r"[-\s]+", "-", slug)
    # Strip leading/trailing hyphens
    slug = slug.strip("-")
    return slug


def ensure_unique_slug(db: Session, model: type, slug: str, exclude_id: int | None = None) -> str:
    """Ensure slug is unique by appending a numeric suffix if needed."""
    original_slug = slug
    counter = 1

    while True:
        query = db.query(model).filter(model.slug == slug)
        if exclude_id is not None:
            query = query.filter(model.id != exclude_id)
        existing = query.first()

        if existing is None:
            return slug

        slug = f"{original_slug}-{counter}"
        counter += 1
