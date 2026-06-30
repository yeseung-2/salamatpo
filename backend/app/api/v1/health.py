from fastapi import APIRouter

router = APIRouter(prefix="/health", tags=["health"])


@router.get("")
def health_check():
    return {
        "success": True,
        "data": {
            "status": "ok"
        },
        "message": "SalamatPo API is running"
    }