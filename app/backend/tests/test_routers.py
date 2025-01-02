import datetime as dt
import os
from datetime import timezone

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.backend.main import app
from app.backend.sql_app import Base
from app.backend.sql_app.main import get_db

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(
    autocommit=False, autoflush=False, bind=engine
)


def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


@pytest.fixture()
def test_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


def test_health(test_db):
    response = client.get("api/v1/health")
    assert response.status_code == 200
    assert response.content == b'{"status":"It works!"}'


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


def test_create_new_event(test_db):
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
    # {'title': 'Event title', 'date': '2024-06-24T15:25:23+02:00'}
    data = {
        "title": "Event title",
        "date": dt.datetime.now(timezone.utc)
        .replace(microsecond=0)
        .astimezone()
        .isoformat(),
    }

    response = client.post(
        "api/v1/events",
        json=data,
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    assert "date" in response.json()
    assert response.json()["event_id"] == 1
    assert response.json()["title"] == "Event title"
    assert response.json()["happened"] is False
    assert "user_id" in response.json()
