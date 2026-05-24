def test_login_success(client, admin_user):
    response = client.post(
        "/api/auth/login",
        json={"email": "admin@test.com", "password": "TestPassword123"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "admin@test.com"
    assert "access_token" in response.cookies
    assert "refresh_token" in response.cookies


def test_login_wrong_password(client, admin_user):
    response = client.post(
        "/api/auth/login",
        json={"email": "admin@test.com", "password": "WrongPassword"},
    )
    assert response.status_code == 401


def test_login_nonexistent_user(client):
    response = client.post(
        "/api/auth/login",
        json={"email": "nobody@test.com", "password": "TestPassword123"},
    )
    assert response.status_code == 401


def test_get_me_authenticated(authenticated_client):
    response = authenticated_client.get("/api/auth/me")
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "admin@test.com"


def test_get_me_unauthenticated(client):
    response = client.get("/api/auth/me")
    assert response.status_code == 401


def test_logout(authenticated_client):
    response = authenticated_client.post("/api/auth/logout")
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Logged out successfully"


def test_refresh_token(authenticated_client):
    response = authenticated_client.post("/api/auth/refresh")
    assert response.status_code == 200
    assert "access_token" in response.cookies
