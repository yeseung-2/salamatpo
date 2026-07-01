import logging
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.health import router as health_router
from app.api.v1.prescription import router as prescription_router
from app.api.v1.additional_info import router as additional_info_router

from app.core.database import Base, engine
from app.models import prescription

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s [%(name)s] %(message)s",
)

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SalamatPo API",
    description="Medicine access route recommendation API for the Philippines",
    version="0.1.0",
)

frontend_url = (os.getenv("FRONTEND_URL") or "").rstrip("/")

allow_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://salamatpo.vercel.app",
]

if frontend_url and frontend_url not in allow_origins:
    allow_origins.append(frontend_url)

# Vercel preview deployments + local LAN testing in development
allow_origin_regexes = [
    r"https://.*\.vercel\.app",
]

if os.getenv("ENV", "development") == "development":
    allow_origin_regexes.append(
        r"http://(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+):3000"
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_origin_regex="|".join(allow_origin_regexes),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router, prefix="/api/v1")
app.include_router(prescription_router, prefix="/api/v1")
app.include_router(additional_info_router, prefix="/api/v1")


@app.get("/")
def root():
    return {
        "success": True,
        "data": {
            "service": "SalamatPo API"
        },
        "message": "API server is running"
    }


@app.get("/api/db-health")
def db_health():
    from sqlalchemy import text
    from app.core.database import SessionLocal

    db = SessionLocal()
    try:
        db.execute(text("SELECT 1"))
        return {"status": "ok", "database": "connected"}
    finally:
        db.close()
