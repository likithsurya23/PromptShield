import json
import logging
from pathlib import Path
import re
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)


class RuleDetector:
    """
    Pattern and category-based prompt injection rule detector.
    Loads regular expression patterns from external rules.json and performs case-insensitive matching.
    """

    def __init__(self, rules_path: Optional[str] = None):
        if rules_path:
            self.rules_path = Path(rules_path)
        else:
            # backend/rules/rules.json
            backend_dir = Path(__file__).resolve().parent.parent.parent
            self.rules_path = backend_dir / "rules" / "rules.json"

        self.rules: Dict[str, List[str]] = self._load_rules()
        # Precompile regular expressions with re.IGNORECASE
        self.compiled_rules: Dict[str, List[re.Pattern]] = {
            category: [re.compile(pattern, re.IGNORECASE) for pattern in patterns]
            for category, patterns in self.rules.items()
        }

    def _load_rules(self) -> Dict[str, List[str]]:
        try:
            if not self.rules_path.exists():
                logger.warning(f"Rules file not found at {self.rules_path}, using empty ruleset.")
                return {}
            with open(self.rules_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Failed to load rules from {self.rules_path}: {e}")
            return {}

    def detect(self, prompt: str) -> Dict[str, Any]:
        """
        Scan a prompt against all attack categories.
        Returns:
            {
                "attack_categories": ["Direct Injection", ...],
                "matched_rules": ["ignore\\s+(all\\s+)?previous\\s+instructions", ...]
            }
        """
        matched_categories: List[str] = []
        matched_rules: List[str] = []

        text = prompt.strip()

        for category, patterns in self.compiled_rules.items():
            category_matched = False
            for pattern in patterns:
                if pattern.search(text):
                    category_matched = True
                    matched_rules.append(pattern.pattern)
            if category_matched:
                matched_categories.append(category)

        # Maintain deterministic order while ensuring uniqueness
        unique_categories = list(dict.fromkeys(matched_categories))
        unique_rules = list(dict.fromkeys(matched_rules))

        return {
            "attack_categories": unique_categories,
            "matched_rules": unique_rules
        }
