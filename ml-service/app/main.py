import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.predictor import model_wrapper
from app.schemas import PredictUrlRequest, PredictUrlResponse, HealthResponse

logger = logging.getLogger("phishshield-ml")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing PhishShield ML Service...")
    model_wrapper.load_model()
    yield
    logger.info("Shutting down PhishShield ML Service...")

app = FastAPI(
    title="PhishShield ML Internal Service",
    description="Internal ML inference service for phishing URL classification",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/internal/v1/health", response_model=HealthResponse)
def health_check():
    return HealthResponse(
        status="healthy",
        modelLoaded=model_wrapper.session is not None,
        modelVersion=model_wrapper.version_str
    )

@app.post("/internal/v1/predict/url", response_model=PredictUrlResponse)
def predict_url(req: PredictUrlRequest):
    if not req.url or not req.url.strip():
        raise HTTPException(status_code=400, detail="URL cannot be empty")
    try:
        result = model_wrapper.predict(req.url.strip())
        return PredictUrlResponse(**result)
    except Exception as e:
        logger.error(f"Inference error for URL {req.url}: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.PORT, reload=False)
