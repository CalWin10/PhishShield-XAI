from typing import Literal
from pydantic import BaseModel, Field

class PredictUrlRequest(BaseModel):
    url: str = Field(..., description="Raw normalized URL string to evaluate", min_length=1)

class PredictUrlResponse(BaseModel):
    phishingProbability: float = Field(..., description="Model estimated probability of phishing (0.0 to 1.0)")
    predictedLabel: Literal["PHISHING", "LEGITIMATE"] = Field(..., description="Binary classification outcome")
    modelVersion: str = Field(..., description="Pinned repository and revision identifier")
    modelType: str = Field(default="LinearSVM", description="Underlying model architecture")
    threshold: float = Field(default=0.50, description="Decision threshold applied")

class HealthResponse(BaseModel):
    status: str
    modelLoaded: bool
    modelVersion: str
