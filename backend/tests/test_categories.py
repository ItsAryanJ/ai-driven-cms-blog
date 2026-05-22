def test_create_category(authenticated_client):
    response = authenticated_client.post(
        "/api/categories",
        json={"name": "Technology"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Technology"
    assert data["slug"] == "technology"


def test_create_duplicate_category(authenticated_client):
    authenticated_client.post("/api/categories", json={"name": "Technology"})
    response = authenticated_client.post("/api/categories", json={"name": "Technology"})
    assert response.status_code == 409


def test_list_categories(authenticated_client):
    authenticated_client.post("/api/categories", json={"name": "Technology"})
    authenticated_client.post("/api/categories", json={"name": "Science"})
    response = authenticated_client.get("/api/categories")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2


def test_update_category(authenticated_client):
    create_resp = authenticated_client.post("/api/categories", json={"name": "Technology"})
    cat_id = create_resp.json()["id"]
    response = authenticated_client.put(
        f"/api/categories/{cat_id}",
        json={"name": "Tech"},
    )
    assert response.status_code == 200
    assert response.json()["name"] == "Tech"
    assert response.json()["slug"] == "tech"


def test_delete_category(authenticated_client):
    create_resp = authenticated_client.post("/api/categories", json={"name": "Technology"})
    cat_id = create_resp.json()["id"]
    response = authenticated_client.delete(f"/api/categories/{cat_id}")
    assert response.status_code == 200

    list_resp = authenticated_client.get("/api/categories")
    assert len(list_resp.json()) == 0


def test_create_category_unauthenticated(client):
    response = client.post("/api/categories", json={"name": "Technology"})
    assert response.status_code == 401
