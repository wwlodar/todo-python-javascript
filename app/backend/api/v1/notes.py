from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.backend.api.v1.auth import get_current_user
from app.backend.sql_app.crud import create_note, get_note, get_user_notes
from app.backend.sql_app.main import get_db
from app.backend.sql_app.schemas import NoteCreate, User

router = APIRouter()


@router.get("/notes")
async def get_user_notes_get_user_notes_from_db(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_user_notes(db=db, user_id=current_user.user_id)


@router.get("/note/{note_id}")
async def get_one_note(note_id: int, db: Session = Depends(get_db)):
    note = get_note(db=db, note_id=note_id)
    if note:
        return note
    else:
        return "None"


@router.post("/notes")
async def add_new_note(
    note: NoteCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    note = create_note(db=db, note=note, user_id=current_user.user_id)
    return note
