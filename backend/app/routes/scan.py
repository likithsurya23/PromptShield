import logging
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Request, status

from app.db.database import db_manager
from app.schemas import BatchScanRequest, ScanRequest, ScanResponse
from app.security.auth import get_optional_user
from app.security.scanner import PromptScanner

logger = logging.getLogger(__name__)

router = APIRouter(tags=["Security Scanner"])


def get_scanner(request: Request) -> PromptScanner:
    scanner = getattr(request.app.state, "scanner", None)
    if scanner is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="PromptShield security engine is not initialized yet."
        )
    return scanner


@router.post(
    "/scan",
    response_model=ScanResponse,
    summary="Scan Single Prompt",
    description="Analyze a single prompt through PromptShield's multi-layered security engine (DistilBERT V2 + Rule Detector + Risk Engine) and asynchronously persist to MongoDB audit logs."
)
async def scan_prompt(
    request: ScanRequest,
    req: Request,
    current_user: Optional[Dict[str, Any]] = Depends(get_optional_user)
) -> ScanResponse:
    scanner = get_scanner(req)
    try:
        result = scanner.scan(
            prompt=request.prompt,
            allow_threshold=request.allow_threshold,
            block_threshold=request.block_threshold,
            ml_detection=request.ml_detection if request.ml_detection is not None else True,
            rule_detection=request.rule_detection if request.rule_detection is not None else True,
            auto_block_high_risk=request.auto_block_high_risk if request.auto_block_high_risk is not None else True,
        )

        # Asynchronously log scan into MongoDB if connected
        user_id = current_user.get("sub") if current_user else None
        scan_record = {**result, "prompt": request.prompt}
        log_id = await db_manager.log_scan(scan_record, user_id=user_id)

        result["log_id"] = log_id
        return ScanResponse(**result)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error scanning prompt: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Inference error occurred while evaluating prompt security."
        )


@router.post(
    "/batch-scan",
    response_model=List[ScanResponse],
    summary="Scan Multiple Prompts",
    description="Analyze a batch of prompts through PromptShield's security engine and persist audit records."
)
async def batch_scan_prompts(
    request: BatchScanRequest,
    req: Request,
    current_user: Optional[Dict[str, Any]] = Depends(get_optional_user)
) -> List[ScanResponse]:
    scanner = get_scanner(req)
    try:
        results = scanner.scan_batch(request.prompts)
        user_id = current_user.get("sub") if current_user else None

        responses = []
        for prompt, res in zip(request.prompts, results):
            scan_record = {**res, "prompt": prompt}
            log_id = await db_manager.log_scan(scan_record, user_id=user_id)
            res["log_id"] = log_id
            responses.append(ScanResponse(**res))

        return responses
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error batch scanning prompts: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Inference error occurred while evaluating batch prompts."
        )