from sqlalchemy.orm import Session

from app.backend.sql_app.models import Event, Note, User
from app.backend.sql_app.schemas import EventCreate, NoteCreate


def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()


def create_note(db: Session, note: NoteCreate, user_id: int):
    note = Note(**note.dict(), user_id=user_id)
    db.add(note)
    db.commit()
    db.refresh(note)
    return note


def create_event(db: Session, event: EventCreate, user_id: int):
    event = Event(**event.dict(), user_id=user_id)
    db.add(event)
    db.commit()
    db.refresh(event)
    return event


def get_note(db: Session, note_id: int):
    return db.query(Note).filter(Note.note_id == note_id).first()


def get_event(db: Session, event_id: int):
    return db.query(Event).filter(Event.event_id == event_id).first()


def get_user_events(db: Session, user_id: int):
    return db.query(Event).filter(Event.user_id == user_id).all()


def get_user_notes(db: Session, user_id: int):
    return db.query(Note).filter(Note.user_id == user_id).all()
