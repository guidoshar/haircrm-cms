from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    DATABASE_URL: str = "postgresql+psycopg://siyman:siyman_pwd_2026@siyman-postgres:5432/siyman_menu"
    API_SECRET_KEY: str = "change-me-please-32-bytes-secret"
    API_JWT_ALG: str = "HS256"
    API_JWT_EXPIRE_MIN: int = 720

    MINIO_ENDPOINT: str = "hair-crm-minio:9000"
    MINIO_PUBLIC_BASE: str = "/cdn"
    MINIO_ACCESS_KEY: str = "sipimo-admin"
    MINIO_SECRET_KEY: str = "Sipimo123456!"
    MINIO_BUCKET: str = "siyman-menu"
    MINIO_USE_SSL: bool = False

    ADMIN_USERNAME: str = "admin"
    ADMIN_PASSWORD: str = "admin@2025"

    SEED_XLSX_PATH: str = "/seed/price.xlsx"
    SEED_IMG_DIR: str = "/seed/img_store"


settings = Settings()
