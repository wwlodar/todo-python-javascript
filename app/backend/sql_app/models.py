from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.backend.sql_app.db import Base


class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, unique=True, primary_key=True)
    username = Column(String)
    email = Column(String)
    hashed_password = Column(String)

    notes = relationship("Note", back_populates="user")
    events = relationship("Event", back_populates="user")


class Note(Base):
    __tablename__ = "notes"

    note_id = Column(Integer, unique=True, primary_key=True)
    title = Column(String)
    done = Column(Boolean, default=False)
    date_added = Column(DateTime)

    user_id = Column(Integer, ForeignKey("users.user_id"))
    user = relationship("User", back_populates="notes")


class Event(Base):
    __tablename__ = "events"

    event_id = Column(Integer, unique=True, primary_key=True)
    title = Column(String)
    happened = Column(Boolean, default=False)
    date_added = Column(DateTime)

    user_id = Column(Integer, ForeignKey("users.user_id"))
    user = relationship("User", back_populates="events")
