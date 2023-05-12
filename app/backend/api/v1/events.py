from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.backend.sql_app.crud import create_event, get_event
from app.backend.sql_app.main import get_db
from app.backend.sql_app.schemas import EventCreate

router = APIRouter()


@router.get("/events")
async def get_all_events():
    return {"message": "Hello World"}


@router.get("/event/{event_id}")
async def get_one_event(event_id: int, db: Session = Depends(get_db)):
    event = get_event(db=db, event_id=event_id)
    if event:
        return event
    else:
        return "None"


@router.post("/events")
async def add_new_event(
    user_id: int, event: EventCreate, db: Session = Depends(get_db)
):
    event = create_event(db=db, event=event, user_id=user_id)
    return event
