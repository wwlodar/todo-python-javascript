import httpx
import pytest
from fastapi.testclient import TestClient
from httpx import AsyncClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.backend.main import app
from app.backend.sql_app import Base
from app.backend.sql_app.main import get_db

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

url = "http://0.0.0.0:8000/"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


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


@pytest.fixture
async def async_app_client():
    async with AsyncClient(app=app, base_url=url) as client:
        return client


@pytest.mark.asyncio
def test_read_main():
    url = url
    response = httpx.get(url)
    assert response.status_code == 200


@pytest.mark.asyncio
def test_health():
    url = url + "/health"
    response = httpx.get(url)
    assert response.status_code == 200
    assert response.content == {"status": "It works!"}
