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
            app_dir = Path(__file__).resolve().parent.parent
            backend_dir = app_dir.parent
            candidates = [
                app_dir / "rules" / "rules.json",
                backend_dir / "rules" / "rules.json",
            ]
            self.rules_path = candidates[0]
            for candidate in candidates:
                if candidate.exists():
                    self.rules_path = candidate
                    break

        self.rules: Dict[str, List[str]] = {}
        self.compiled_rules: Dict[str, List[re.Pattern]] = {}
        self._last_mtime: float = 0
        self._reload_rules_if_modified()

    def _reload_rules_if_modified(self) -> None:
        try:
            if not self.rules_path.exists():
                return
            mtime = self.rules_path.stat().st_mtime
            if mtime > self._last_mtime:
                with open(self.rules_path, "r", encoding="utf-8") as f:
                    self.rules = json.load(f)
                self.compiled_rules = {
                    category: [re.compile(pattern, re.IGNORECASE) for pattern in patterns]
                    for category, patterns in self.rules.items()
                }
                self._last_mtime = mtime
                logger.info(f"Loaded {sum(len(v) for v in self.rules.values())} detection rules across {len(self.rules)} categories.")
        except Exception as e:
            logger.error(f"Failed to load rules from {self.rules_path}: {e}")

    def detect(self, prompt: str) -> Dict[str, Any]:
        """
        Scan a prompt against all attack categories.
        Returns:
            {
                "attack_categories": ["Direct Injection", ...],
                "matched_rules": ["ignore\\s+(all\\s+)?previous\\s+instructions", ...]
            }
        """
        self._reload_rules_if_modified()
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
