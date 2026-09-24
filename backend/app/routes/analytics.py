from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Query

from app.db.database import db_manager
from app.schemas import AnalyticsSummaryResponse

router = APIRouter(tags=["Analytics & Audit Logs"])


@router.get(
    "/scans",
    summary="Query Scan Audit Logs",
    description="Retrieve paginated scan records logged to MongoDB. Filter by enforcement action."
)
async def get_scan_logs(
    limit: int = Query(50, ge=1, le=200, description="Number of records to return"),
    skip: int = Query(0, ge=0, description="Offset count for pagination"),
    action: Optional[str] = Query(None, description="Filter by action: ALLOW, WARN, BLOCK")
) -> List[Dict[str, Any]]:
    logs = await db_manager.get_recent_scans(limit=limit, skip=skip, action=action)
    return logs


@router.delete(
    "/scans",
    summary="Clear Scan Audit Logs",
    description="Purge all audit logs from memory and database."
)
async def clear_scan_logs() -> Dict[str, Any]:
    count = await db_manager.clear_scans()
    return {"message": "Scan history cleared successfully", "cleared_count": count}


@router.get(
    "/analytics/summary",
    response_model=AnalyticsSummaryResponse,
    summary="Security Analytics Summary",
    description="Retrieve aggregate metrics: total scans, breakdown by decision (ALLOW, WARN, BLOCK), and attack category distribution."
)
async def get_analytics_summary() -> AnalyticsSummaryResponse:
    summary = await db_manager.get_analytics_summary()
    return AnalyticsSummaryResponse(
        total_scans=summary.get("total_scans", 0),
        allowed=summary.get("allowed", 0),
        warned=summary.get("warned", 0),
        blocked=summary.get("blocked", 0),
        top_attack_categories=summary.get("top_attack_categories", {}),
        database_connected=summary.get("database_connected", False)
    )
