from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.health import router as health_router

app = FastAPI(
    title="SalamatPo API",
    description="Medicine access route recommendation API for the Philippines",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router, prefix="/api/v1")


@app.get("/")
def root():
    return {
        "success": True,
        "data": {
            "service": "SalamatPo API"
        },
        "message": "API server is running"
    }