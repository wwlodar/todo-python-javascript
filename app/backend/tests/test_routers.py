import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.backend.main import app
from app.backend.sql_app import Base
from app.backend.sql_app.main import get_db

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


def test_health():
    response = client.get("api/v1/health")
    assert response.status_code == 200
    assert response.content == b'{"status":"It works!"}'


def test_register():
    response = client.post(
        "api/v1/register",
        json={
            "password": "Password1234!",
            "username": "foobar",
            "email": "foobar@test.com",
        },
    )

    assert response.content == b'{"status":"It works!"}'
    assert response.status_code == 200
