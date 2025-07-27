import os

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.backend.core import Base
from app.backend.core.main import get_db
from app.backend.main import app

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


@pytest.fixture(scope="function", autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture()
def test_db():
    """Provide a fresh database session for a test."""
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.rollback()  # rollback any changes after test
        db.close()


@pytest.fixture()
def client(test_db):
    """Create a TestClient that uses the test_db session."""
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
