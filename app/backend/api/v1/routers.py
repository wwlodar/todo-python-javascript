from fastapi import APIRouter

from app.backend.api.v1 import events, health, notes, users

router = APIRouter()

router.include_router(health.router, tags=["health"])

router.include_router(users.router, tags=["users"])
router.include_router(events.router, tags=["events"])
router.include_router(notes.router, tags=["notes"])
