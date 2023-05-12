from fastapi import APIRouter

router = APIRouter()


@router.get("/notes")
async def get_all_notes():
    return {"message": "Hello World"}


@router.get("/notes/{note_id}")
async def get_note(note_id: int):
    return {"message": "Hello World"}


@router.post("/notes")
async def add_new_note():
    return {"message": "Hello World"}
