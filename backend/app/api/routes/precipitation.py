"""
Precipitation Downscaling API Routes (Model 3 Hurdle Model).
"""
from fastapi import APIRouter, HTTPException, Query, status
from typing import Optional
from backend.app.schemas.prediction import (
    StandardPredictionEnvelope,
    PredictionRequest,
    PrecipitationPredictionPayload
)
from backend.app.services.prediction_service import prediction_service
from backend.app.api.routes.grid import PILOT_CELLS

router = APIRouter(tags=["Precipitation Downscaling"])

@router.get("/precipitation", response_model=StandardPredictionEnvelope[PrecipitationPredictionPayload])
def get_precipitation(
    lat: float = Query(..., ge=-90.0, le=90.0),
    lon: float = Query(..., ge=-180.0, le=180.0),
    timestamp: Optional[str] = None,
    grid_cell_id: Optional[str] = None
):
    req = PredictionRequest(
        latitude=lat,
        longitude=lon,
        timestamp_utc=timestamp,
        grid_cell_id=grid_cell_id
    )
    return prediction_service.predict_precipitation(req)

@router.post("/precipitation/predict", response_model=StandardPredictionEnvelope[PrecipitationPredictionPayload])
def predict_precipitation(req: PredictionRequest):
    return prediction_service.predict_precipitation(req)

@router.get("/precipitation/grid/{cell_id}", response_model=StandardPredictionEnvelope[PrecipitationPredictionPayload])
def get_precipitation_by_grid_cell(cell_id: str, timestamp: Optional[str] = None):
    cell = PILOT_CELLS.get(cell_id.upper())
    if not cell:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Grid cell '{cell_id}' not found."
        )
    req = PredictionRequest(
        latitude=cell.center_latitude,
        longitude=cell.center_longitude,
        timestamp_utc=timestamp,
        grid_cell_id=cell.cell_id,
        elevation_m=cell.elevation_m,
        cropland_fraction=cell.cropland_fraction
    )
    return prediction_service.predict_precipitation(req)
