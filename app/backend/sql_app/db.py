import os

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

user = os.getenv("POSTGRES_USER", "postgres")
password = os.getenv("POSTGRES_PASSWORD", "postgres")
server = os.getenv("POSTGRES_SERVER", "db")
db = os.getenv("POSTGRES_DB", "test_db")
SQLALCHEMY_DATABASE_URL = f"postgresql://{user}:{password}@{server}:5432/{db}"
# SQLALCHEMY_DATABASE_URL = f"postgresql://postgres:postgres@db:5432/test_db"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
