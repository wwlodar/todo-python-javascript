from app.backend.tests.conftest import client


def test_register(test_db):
    response = client.post(
        "api/v1/register",
        json={
            "password": "Password1234!",
            "username": "foobar",
            "email": "foobar@test.com",
        },
    )

    assert response.content == b'{"status":"User foobar was created"}'
    assert response.status_code == 200


def test_register_user_twice(test_db):
    client.post(
        "api/v1/register",
        json={
            "password": "Password1234!",
            "username": "foobar",
            "email": "foobar@test.com",
        },
    )

    response = client.post(
        "api/v1/register",
        json={
            "password": "Password1234!",
            "username": "foobar",
            "email": "foobar@test.com",
        },
    )

    assert (
        response.content == b'{"detail":"User with this email already exist"}'
    )
    assert response.status_code == 400


def test_login(test_db):
    register = client.post(
        "api/v1/register",
        json={
            "password": "Password1234!",
            "username": "foobar",
            "email": "foobar@test.com",
        },
    )
    assert register.status_code == 200

    response = client.post(
        "api/v1/login",
        data={
            "password": "Password1234!",
            "username": "foobar",
        },
    )
    assert response.status_code == 200
    assert "access_token" in str(response.content)
    assert "refresh_token" in str(response.content)


def test_logout(test_db):
    register = client.post(
        "api/v1/register",
        json={
            "password": "Password1234!",
            "username": "foobar",
            "email": "foobar@test.com",
        },
    )
    assert register.status_code == 200

    login = client.post(
        "api/v1/login",
        data={
            "password": "Password1234!",
            "username": "foobar",
        },
    )

    assert login.status_code == 200
    token = login.json()["access_token"]

    response = client.post(
        "api/v1/logout", headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    assert response.content == b'{"detail":"Access token has been revoked"}'
