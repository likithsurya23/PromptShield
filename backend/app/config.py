from pathlib import Path
from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "PromptShield"
    APP_VERSION: str = "1.0.0"

    MODEL_PATH: str = "ml/models/promptshield-distilbert-v2"

    RISK_ALLOW_THRESHOLD: float = 30.0
    RISK_BLOCK_THRESHOLD: float = 70.0

    FRONTEND_URL: str = "http://localhost:5173"

    # MongoDB Atlas or local connection (Loaded from .env)
    MONGODB_URI: Optional[str] = None
    MONGODB_DB_NAME: str = "promptshield"

    # JWT Authentication
    JWT_SECRET: str = "promptshield-dev-secret-key-replace-in-production-min32char"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    def get_resolved_model_path(self) -> str:
        """Resolve the model directory whether running from backend/ or project root."""
        p = Path(self.MODEL_PATH)
        if p.exists():
            return str(p)

        backend_dir = Path(__file__).resolve().parent.parent
        candidates = [
            backend_dir / self.MODEL_PATH,
            backend_dir / "ml" / "models" / "promptshield-distilbert-v2",
            backend_dir.parent / "backend" / "ml" / "models" / "promptshield-distilbert-v2",
            backend_dir.parent / "ml" / "models" / "promptshield-distilbert-v2",
        ]
        for candidate in candidates:
            if candidate.exists():
                return str(candidate.resolve())

        return self.MODEL_PATH


settings = Settings()