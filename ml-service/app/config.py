import os
from pydantic import BaseModel

class Settings(BaseModel):
    PORT: int = int(os.getenv("PORT", "8001"))
    HF_REPO_ID: str = os.getenv("HF_REPO_ID", "pirocheto/phishing-url-detection")
    HF_REVISION: str = os.getenv("HF_REVISION", "44f3b19f705b52532e0aadf3d0d15dd892b8a2fb")
    MODEL_FILE: str = os.getenv("MODEL_FILE", "model.onnx")
    DEFAULT_THRESHOLD: float = float(os.getenv("DEFAULT_THRESHOLD", "0.50"))
    MODEL_CACHE_DIR: str = os.getenv("MODEL_CACHE_DIR", "./model_cache")

settings = Settings()
