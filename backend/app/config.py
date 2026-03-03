from __future__ import annotations

from functools import lru_cache
from typing import List, Literal

from pydantic import AnyHttpUrl, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Environment
    ENV: Literal["development", "production"] = "production"
    DEBUG: bool = False

    # Server
    PORT: int = 8000

    # GitHub API
    GITHUB_TOKEN: str | None = None
    GITHUB_API_BASE_URL: AnyHttpUrl = "https://api.github.com"
    HTTP_TIMEOUT_SECONDS: float = 15.0

    # Security
    TRUST_PROXY_HEADERS: bool = True
    RATE_LIMIT_REQUESTS_PER_MINUTE: int = Field(default=60, ge=1, le=10_000)
    CORS_ALLOW_ORIGINS: str = "http://localhost:3000"

    # App behavior
    MAX_REPOS_TO_ANALYZE: int = Field(default=20, ge=1, le=200)
    ACTIVE_DAYS_THRESHOLD: int = Field(default=30, ge=1, le=3650)

    # Scoring
    SCORING_WEIGHTS: dict[str, float] = {
        "documentation": 0.25,
        "code_quality": 0.25,
        "consistency": 0.20,
        "impact": 0.20,
        "depth": 0.10,
    }

    # Thresholds
    MINIMUM_REPOS_FOR_SCORE: int = 1
    GOOD_README_LENGTH: int = 100  # characters

    def cors_allow_origins_list(self) -> List[str]:
        origins = [o.strip() for o in (self.CORS_ALLOW_ORIGINS or "").split(",")]
        cleaned = [o for o in origins if o]
        if self.ENV == "production" and ("*" in cleaned or any(o == "*" for o in cleaned)):
            raise ValueError("CORS_ALLOW_ORIGINS cannot include '*' in production")
        return cleaned


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()


# Backwards-compatible alias for existing imports.
Config = Settings