def test_create_tag(authenticated_client):
    response = authenticated_client.post(
        "/api/tags",
        json={"name": "Python"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Python"
    assert data["slug"] == "python"


def test_create_duplicate_tag(authenticated_client):
    authenticated_client.post("/api/tags", json={"name": "Python"})
    response = authenticated_client.post("/api/tags", json={"name": "Python"})
    assert response.status_code == 409


def test_list_tags(authenticated_client):
    authenticated_client.post("/api/tags", json={"name": "Python"})
    authenticated_client.post("/api/tags", json={"name": "JavaScript"})
    response = authenticated_client.get("/api/tags")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2


def test_update_tag(authenticated_client):
    create_resp = authenticated_client.post("/api/tags", json={"name": "Python"})
    tag_id = create_resp.json()["id"]
    response = authenticated_client.put(
        f"/api/tags/{tag_id}",
        json={"name": "Python3"},
    )
    assert response.status_code == 200
    assert response.json()["name"] == "Python3"


def test_delete_tag(authenticated_client):
    create_resp = authenticated_client.post("/api/tags", json={"name": "Python"})
    tag_id = create_resp.json()["id"]
    response = authenticated_client.delete(f"/api/tags/{tag_id}")
    assert response.status_code == 200


def test_create_tag_unauthenticated(client):
    response = client.post("/api/tags", json={"name": "Python"})
    assert response.status_code == 401
