from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .model_service import DISCLAIMER, FertilityModelService
from .schemas import PredictionRequest, PredictionResponse

app = FastAPI(
    title="AI Fertility Insight ML Service",
    description="Synthetic-model fertility insight scoring with SHAP explainability.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

service = FertilityModelService()


@app.get("/")
def root() -> dict:
    return {
        "name": "AI Fertility Insight ML Service",
        "status": "ok",
        "disclaimer": DISCLAIMER,
    }


@app.get("/health")
def health() -> dict:
    return {"status": "healthy"}


@app.post("/predict", response_model=PredictionResponse)
def predict(payload: PredictionRequest) -> PredictionResponse:
    result = service.predict(payload.model_dump())
    return PredictionResponse(**result)
