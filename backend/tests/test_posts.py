import pytest


@pytest.fixture
def category_id(authenticated_client):
    resp = authenticated_client.post("/api/categories", json={"name": "Technology"})
    return resp.json()["id"]


@pytest.fixture
def tag_ids(authenticated_client):
    resp1 = authenticated_client.post("/api/tags", json={"name": "Python"})
    resp2 = authenticated_client.post("/api/tags", json={"name": "FastAPI"})
    return [resp1.json()["id"], resp2.json()["id"]]


def test_create_post(authenticated_client, category_id, tag_ids):
    response = authenticated_client.post(
        "/api/posts",
        json={
            "title": "Getting Started with FastAPI",
            "excerpt": "A comprehensive guide to building APIs with FastAPI",
            "body": "# FastAPI Guide\n\nFastAPI is a modern web framework for building APIs with Python.",
            "category_id": category_id,
            "tag_ids": tag_ids,
            "status": "draft",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Getting Started with FastAPI"
    assert data["slug"] == "getting-started-with-fastapi"
    assert data["status"] == "draft"
    assert len(data["tags"]) == 2


def test_create_post_published(authenticated_client, category_id):
    response = authenticated_client.post(
        "/api/posts",
        json={
            "title": "Published Post",
            "body": "This is a published post.",
            "category_id": category_id,
            "status": "published",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["status"] == "published"
    assert data["published_at"] is not None


def test_list_published_posts(authenticated_client, category_id):
    # Create a draft and a published post
    authenticated_client.post(
        "/api/posts",
        json={"title": "Draft Post", "body": "Draft content.", "status": "draft"},
    )
    authenticated_client.post(
        "/api/posts",
        json={"title": "Published Post", "body": "Published content.", "status": "published"},
    )

    response = authenticated_client.get("/api/posts")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert data["items"][0]["title"] == "Published Post"


def test_get_post_by_slug(authenticated_client):
    authenticated_client.post(
        "/api/posts",
        json={"title": "My First Blog", "body": "Hello World!", "status": "published"},
    )

    response = authenticated_client.get("/api/posts/my-first-blog")
    assert response.status_code == 200
    assert response.json()["title"] == "My First Blog"


def test_get_draft_post_by_slug_returns_404(authenticated_client):
    authenticated_client.post(
        "/api/posts",
        json={"title": "Hidden Draft", "body": "Not visible.", "status": "draft"},
    )

    response = authenticated_client.get("/api/posts/hidden-draft")
    assert response.status_code == 404


def test_update_post(authenticated_client, category_id):
    create_resp = authenticated_client.post(
        "/api/posts",
        json={"title": "Original Title", "body": "Original body.", "status": "draft"},
    )
    post_id = create_resp.json()["id"]

    response = authenticated_client.put(
        f"/api/posts/{post_id}",
        json={"title": "Updated Title", "status": "published"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Updated Title"
    assert data["slug"] == "updated-title"
    assert data["status"] == "published"
    assert data["published_at"] is not None


def test_delete_post(authenticated_client):
    create_resp = authenticated_client.post(
        "/api/posts",
        json={"title": "To Delete", "body": "Will be deleted.", "status": "draft"},
    )
    post_id = create_resp.json()["id"]

    response = authenticated_client.delete(f"/api/posts/{post_id}")
    assert response.status_code == 200
    assert response.json()["message"] == "Post deleted successfully"


def test_search_posts(authenticated_client):
    authenticated_client.post(
        "/api/posts",
        json={"title": "Python Web Development", "body": "Django and FastAPI.", "status": "published"},
    )
    authenticated_client.post(
        "/api/posts",
        json={"title": "JavaScript Basics", "body": "React and Node.js.", "status": "published"},
    )

    response = authenticated_client.get("/api/search?q=Python")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert data["items"][0]["title"] == "Python Web Development"


def test_admin_list_all_posts(authenticated_client):
    authenticated_client.post(
        "/api/posts",
        json={"title": "Draft Post", "body": "Draft.", "status": "draft"},
    )
    authenticated_client.post(
        "/api/posts",
        json={"title": "Published Post", "body": "Published.", "status": "published"},
    )

    response = authenticated_client.get("/api/admin/posts")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 2


def test_admin_dashboard(authenticated_client):
    authenticated_client.post(
        "/api/posts",
        json={"title": "Draft", "body": "D.", "status": "draft"},
    )
    authenticated_client.post(
        "/api/posts",
        json={"title": "Published", "body": "P.", "status": "published"},
    )

    response = authenticated_client.get("/api/admin/dashboard")
    assert response.status_code == 200
    data = response.json()
    assert data["total_posts"] == 2
    assert data["published_posts"] == 1
    assert data["draft_posts"] == 1


def test_duplicate_slug_handling(authenticated_client):
    authenticated_client.post(
        "/api/posts",
        json={"title": "My Post", "body": "First.", "status": "draft"},
    )
    resp2 = authenticated_client.post(
        "/api/posts",
        json={"title": "My Post", "body": "Second.", "status": "draft"},
    )
    assert resp2.status_code == 201
    assert resp2.json()["slug"] == "my-post-1"


def test_create_post_unauthenticated(client):
    response = client.post(
        "/api/posts",
        json={"title": "Unauthorized", "body": "Should fail."},
    )
    assert response.status_code == 401


def test_pagination(authenticated_client):
    for i in range(15):
        authenticated_client.post(
            "/api/posts",
            json={"title": f"Post Number {i}", "body": f"Content {i}.", "status": "published"},
        )

    response = authenticated_client.get("/api/posts?page=1&page_size=5")
    data = response.json()
    assert data["total"] == 15
    assert data["page"] == 1
    assert data["page_size"] == 5
    assert data["total_pages"] == 3
    assert len(data["items"]) == 5

    response2 = authenticated_client.get("/api/posts?page=3&page_size=5")
    data2 = response2.json()
    assert len(data2["items"]) == 5
