import json
import logging
from pathlib import Path
from typing import Any, Dict, List, Optional

from app.config import settings

logger = logging.getLogger(__name__)


class RiskEngine:
    """
    Combines ML classification probabilities and rule-category severity to compute a unified risk score
    and determine enforcement action: ALLOW, WARN, or BLOCK.
    """

    def __init__(self, severity_path: Optional[str] = None):
        if severity_path:
            self.severity_path = Path(severity_path)
        else:
            app_dir = Path(__file__).resolve().parent.parent
            backend_dir = app_dir.parent
            candidates = [
                app_dir / "rules" / "category_severity.json",
                backend_dir / "rules" / "category_severity.json",
            ]
            self.severity_path = candidates[0]
            for candidate in candidates:
                if candidate.exists():
                    self.severity_path = candidate
                    break

        self.category_severity: Dict[str, float] = self._load_severity()

    def _load_severity(self) -> Dict[str, float]:
        default_severity = {
            "Direct Injection": 0.80,
            "Indirect Injection": 0.85,
            "Instruction Override": 0.85,
            "Jailbreak": 0.90,
            "Obfuscation": 0.85,
            "Role Manipulation": 0.80,
            "Safety Bypass": 0.90,
            "System Prompt Extraction": 0.95
        }
        try:
            if not self.severity_path.exists():
                logger.warning(f"Severity file not found at {self.severity_path}, using defaults.")
                return default_severity
            with open(self.severity_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Error loading category severity: {e}, falling back to defaults.")
            return default_severity

    def compute_risk(
        self,
        ml_score: float,
        rule_categories: List[str],
        allow_threshold: Optional[float] = None,
        block_threshold: Optional[float] = None
    ) -> Dict[str, Any]:
        """
        Compute risk score and enforcement decision.
        ml_score: probability of malicious injection (0.0 to 1.0)
        rule_categories: list of matched categories
        """
        if not rule_categories:
            risk = ml_score * 100.0
        else:
            highest_severity = max(
                self.category_severity.get(cat, 0.70)
                for cat in rule_categories
            )
            risk = (
                0.60 * ml_score +
                0.25 * highest_severity +
                0.15
            ) * 100.0

        risk_score = min(round(risk, 2), 100.0)

        # Configurable decision thresholds
        allow_thresh = allow_threshold if allow_threshold is not None else settings.RISK_ALLOW_THRESHOLD
        block_thresh = block_threshold if block_threshold is not None else settings.RISK_BLOCK_THRESHOLD

        if risk_score < allow_thresh:
            action = "ALLOW"
        elif risk_score < block_thresh:
            action = "WARN"
        else:
            action = "BLOCK"

        return {
            "risk_score": risk_score,
            "action": action
        }
