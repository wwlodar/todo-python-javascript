from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.backend.api.v1.auth import get_current_user
from app.backend.sql_app.crud import create_event, get_event, get_user_events
from app.backend.sql_app.main import get_db
from app.backend.sql_app.schemas import Event, EventCreate, User

router = APIRouter()


@router.get("/events")
async def get_user_events_from_db(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_user_events(db=db, user_id=current_user.user_id)


@router.get("/event/{event_id}")
async def get_one_event(event_id: int, db: Session = Depends(get_db)):
    event = get_event(db=db, event_id=event_id)
    if event:
        return event
    else:
        return "None"


@router.post("/events")
async def add_new_event(
    data: EventCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    db_event = Event(
        title=data.title, date=data.date, user_id=current_user.user_id
    )
    event = create_event(db=db, event=db_event)
    return event
