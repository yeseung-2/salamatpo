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

frontend_url = os.getenv("FRONTEND_URL")

allow_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

if frontend_url:
    allow_origins.append(frontend_url)

cors_kwargs: dict = {
    "allow_credentials": True,
    "allow_methods": ["*"],
    "allow_headers": ["*"],
}

if os.getenv("ENV", "development") == "development":
    # Allow localhost and LAN IPs (e.g. phone testing at 192.168.x.x:3000)
    cors_kwargs["allow_origin_regex"] = (
        r"http://(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+):3000"
    )
else:
    cors_kwargs["allow_origins"] = allow_origins

app.add_middleware(CORSMiddleware, **cors_kwargs)

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