from datetime import datetime, timezone
from typing import List, Union

from pydantic import BaseModel, EmailStr, validator


class NoteBase(BaseModel):
    title: str
    note_id: int
    done: bool
    user_id: str


class NoteCreate(NoteBase):
    date_added = datetime.now().date()


class Note(NoteBase):
    date_added: datetime


class EventBase(BaseModel):
    title: str
    event_id: int
    user_id: str


class EventCreate(BaseModel):
    date: datetime
    title: str


class Event(EventBase):
    date: datetime


class EventResponse(BaseModel):
    event_id: int
    title: str
    date: datetime
    user_id: str
    happened: bool

    class Config:
        orm_mode = True

    @validator("date", pre=True)
    def attach_utc_timezone(cls, v):
        # v can be datetime or string, handle both
        if isinstance(v, datetime):
            if v.tzinfo is None:
                return v.replace(tzinfo=timezone.utc)
            return v
        # if string, parse and set tzinfo, or return as is
        return v

    @validator("happened", always=True)
    def compute_happened(cls, v, values):
        dt = values.get("date")
        if dt:
            now = datetime.now(timezone.utc)
            return dt <= now
        return False


class UserBase(BaseModel):
    email: EmailStr
    username: str
    user_id: str


class UserCreate(BaseModel):
    password: str
    username: str
    email: EmailStr


class UserInDB(UserBase):
    hashed_password: str


class User(UserBase):
    events: List[Event] = []
    notes: List[Note] = []

    class Config:
        orm_mode = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Union[str, None] = None
