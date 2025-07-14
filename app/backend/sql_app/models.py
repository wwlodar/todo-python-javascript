import datetime
from datetime import timezone

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.backend.sql_app import Base


class User(Base):
    __tablename__ = "users"

    user_id = Column(String, unique=True, primary_key=True)
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

    user_id = Column(String, ForeignKey("users.user_id"))
    user = relationship("User", back_populates="notes")

    def to_dict(self):
        dt_utc = self.date_added.replace(tzinfo=timezone.utc)
        return {
            "note_id": self.note_id,
            "title": self.title,
            "done": self.done,
            "date_added": dt_utc.isoformat(),
            "user_id": self.user_id,
        }


class Event(Base):
    __tablename__ = "events"

    event_id = Column(Integer, unique=True, primary_key=True)
    title = Column(String)
    date = Column(DateTime)

    user_id = Column(String, ForeignKey("users.user_id"))
    user = relationship("User", back_populates="events")

    def to_dict(self):
        dt_utc = self.date.replace(tzinfo=timezone.utc)
        return {
            "event_id": self.event_id,
            "title": self.title,
            "happened": self.happened,
            "date": dt_utc.isoformat(),
            "user_id": self.user_id,
        }

    @property
    def happened(self):
        return self.date.replace(tzinfo=timezone.utc) <= datetime.datetime.now(
            timezone.utc
        )
