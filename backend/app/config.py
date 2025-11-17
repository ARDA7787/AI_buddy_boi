"""Application configuration."""
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings."""

    # App
    APP_NAME: str = "AI Travel Buddy"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    # Database
    DATABASE_URL: str = "postgresql://travel_user:travel_pass@localhost:5432/travel_buddy"

    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production-min-32-chars-long"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # OpenAI
    OPENAI_API_KEY: Optional[str] = None
    OPENAI_MODEL: str = "gpt-4-turbo-preview"

    # External APIs
    OPENWEATHER_API_KEY: Optional[str] = None
    GOOGLE_MAPS_API_KEY: Optional[str] = None

    # CORS
    BACKEND_CORS_ORIGINS: list = ["*"]

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
