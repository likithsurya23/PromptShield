from typing import Any, Dict, List, Optional
from app.security.ml_detector import MLDetector
from app.security.risk_engine import RiskEngine
from app.security.rule_detector import RuleDetector


class PromptScanner:
    """
    Unified PromptShield Security Pipeline:
    Prompt -> ML Detector -> Rule Detector -> Risk Engine -> Final Decision
    """

    def __init__(
        self,
        ml_detector: Optional[MLDetector] = None,
        rule_detector: Optional[RuleDetector] = None,
        risk_engine: Optional[RiskEngine] = None
    ):
        self.ml_detector = ml_detector
        self.rule_detector = rule_detector or RuleDetector()
        self.risk_engine = risk_engine or RiskEngine()

    def set_ml_detector(self, ml_detector: MLDetector) -> None:
        """Inject or update the ML detector after startup."""
        self.ml_detector = ml_detector

    def scan(self, prompt: str) -> Dict[str, Any]:
        """
        Execute full security scan for a single prompt.
        """
        if self.ml_detector is None:
            raise RuntimeError("ML Detector is not loaded in PromptScanner.")

        # 1. ML Detector
        ml_result = self.ml_detector.predict(prompt)
        ml_malicious_score = ml_result["malicious_probability"]

        # 2. Rule Detector
        rule_result = self.rule_detector.detect(prompt)
        attack_categories = rule_result["attack_categories"]

        # 3. Risk Engine
        risk_result = self.risk_engine.compute_risk(
            ml_score=ml_malicious_score,
            rule_categories=attack_categories
        )

        # 4. Synthesize Final Security Result
        return {
            "prediction": ml_result["prediction"],
            "ml_confidence": ml_result["confidence"],
            "benign_probability": ml_result["benign_probability"],
            "malicious_probability": ml_result["malicious_probability"],
            "attack_categories": attack_categories,
            "matched_rules": rule_result.get("matched_rules", []),
            "risk_score": risk_result["risk_score"],
            "action": risk_result["action"]
        }

    def scan_batch(self, prompts: List[str]) -> List[Dict[str, Any]]:
        """
        Execute batch security scan efficiently.
        """
        if self.ml_detector is None:
            raise RuntimeError("ML Detector is not loaded in PromptScanner.")

        if not prompts:
            return []

        # 1. Batch ML inference
        ml_results = self.ml_detector.predict_batch(prompts)

        batch_results = []
        for prompt, ml_result in zip(prompts, ml_results):
            # 2. Rule Detector
            rule_result = self.rule_detector.detect(prompt)
            attack_categories = rule_result["attack_categories"]

            # 3. Risk Engine
            risk_result = self.risk_engine.compute_risk(
                ml_score=ml_result["malicious_probability"],
                rule_categories=attack_categories
            )

            batch_results.append({
                "prediction": ml_result["prediction"],
                "ml_confidence": ml_result["confidence"],
                "benign_probability": ml_result["benign_probability"],
                "malicious_probability": ml_result["malicious_probability"],
                "attack_categories": attack_categories,
                "matched_rules": rule_result.get("matched_rules", []),
                "risk_score": risk_result["risk_score"],
                "action": risk_result["action"]
            })

        return batch_results