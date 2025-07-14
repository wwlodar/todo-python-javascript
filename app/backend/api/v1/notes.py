from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.backend.api.v1.auth import get_current_user
from app.backend.sql_app.crud import create_note, get_note, get_user_notes
from app.backend.sql_app.main import get_db
from app.backend.sql_app.models import Note as NoteModel
from app.backend.sql_app.schemas import NoteCreate, NoteResponse, NoteUpdate, User

router = APIRouter()


@router.get("/notes", response_model=List[NoteResponse])
async def get_user_notes_from_db(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_user_notes(db=db, user_id=current_user.user_id)


@router.put("/notes/{note_id}", response_model=NoteResponse)
async def update_note(note_id: int, note: NoteUpdate, db: Session = Depends(get_db)):
    existing_note = get_note(db=db, note_id=note_id)
    if existing_note:
        existing_note.done = note.done
        db.commit()
        db.refresh(existing_note)
        return existing_note
    else:
        return "Note not found"


@router.delete("/notes/{note_id}", response_model=str)
async def delete_note(note_id: int, db: Session = Depends(get_db)):
    note = get_note(db=db, note_id=note_id)
    if note:
        db.delete(note)
        db.commit()
        return "Note deleted successfully"
    else:
        return "Note not found"


@router.get("/note/{note_id}", response_model=NoteResponse)
async def retrieve_note(note_id: int, db: Session = Depends(get_db)):
    note = get_note(db=db, note_id=note_id)
    if note:
        return note
    else:
        return "None"


@router.post("/notes", response_model=NoteResponse)
async def add_new_note(
    note: NoteCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    note = NoteModel(
        title=note.title,
        note_id=note.note_id,
        done=note.done,
        user_id=current_user.user_id,
    )
    note = create_note(db=db, note=note)
    return note
