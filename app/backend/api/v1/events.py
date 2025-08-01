from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.backend.api.v1.auth import get_current_user
from app.backend.core.crud import create_event, get_event, get_user_events
from app.backend.core.main import get_db
from app.backend.core.models import Event as EventModel
from app.backend.core.schemas import (
    EventCreate,
    EventResponse,
    EventUpdate,
    User,
)

router = APIRouter()


@router.get("/events", response_model=List[EventResponse])
async def get_user_events_from_db(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_user_events(db=db, user_id=current_user.user_id)


@router.get("/event/{event_id}", response_model=EventResponse)
async def get_one_event(event_id: int, db: Session = Depends(get_db)):
    event = get_event(db=db, event_id=event_id)
    if event:
        return event
    else:
        return "None"


@router.put("/events/{event_id}", response_model=EventResponse)
async def update_event(
    event_id: int, data: EventUpdate, db: Session = Depends(get_db)
):
    existing_event = get_event(db=db, event_id=event_id)
    if existing_event:
        existing_event.title = data.title
        db.commit()
        db.refresh(existing_event)
        return existing_event
    else:
        raise HTTPException(status_code=404, detail="Event not found")


@router.post("/events", response_model=EventResponse)
async def add_new_event(
    data: EventCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    db_event = EventModel(
        title=data.title,
        date=data.date,
        user_id=current_user.user_id,
    )

    event = create_event(db=db, event=db_event)
    return event
