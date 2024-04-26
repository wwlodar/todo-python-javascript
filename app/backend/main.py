from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.backend.api.v1.routers import router

app = FastAPI(debug=True)
app.include_router(router, prefix="/api/v1")


origins = ["http://0.0.0.0:3000", "localhost:3000", "http://0.0.0.0:3000/"]


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
