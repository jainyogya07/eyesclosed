"""
Generic Prediction Envelope Dispatch API Routes.
"""
from fastapi import APIRouter, HTTPException, status
from typing import Any
from backend.app.schemas.prediction import PredictionRequest, StandardPredictionEnvelope
from backend.app.services.prediction_service import (
    prediction_service,
    ModelNotFoundException,
    ModelUnavailableException
)

router = APIRouter(tags=["Predictions"])

@router.post("/predictions/{model_id}", response_model=StandardPredictionEnvelope[Any])
def dispatch_prediction(model_id: str, req: PredictionRequest):
    try:
        return prediction_service.predict(model_id.upper(), req)
    except ModelNotFoundException as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except ModelUnavailableException as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(e)
        )
