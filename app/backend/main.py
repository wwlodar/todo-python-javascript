from fastapi import FastAPI

from app.backend.api.v1.routers import router

app = FastAPI(debug=True)
app.include_router(router)
