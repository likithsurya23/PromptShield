from fastapi import APIRouter, Request
from app.config import settings
from app.db.database import db_manager
from app.schemas import HealthResponse

router = APIRouter(tags=["Health"])


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Health Check",
    description="Check the health status of PromptShield API, ML model readiness, and database connectivity."
)
async def get_health(request: Request) -> HealthResponse:
    is_connected = await db_manager.ensure_connected()
    model_loaded = getattr(request.app.state, "model_loaded", False)
    return HealthResponse(
        status="ok",
        service=f"{settings.APP_NAME} API",
        model_loaded=model_loaded,
        database_connected=is_connected
    )
