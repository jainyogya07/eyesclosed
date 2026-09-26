"""
Weather and Downscaled Meteorological API Routes (Model 1 & Model 2).
"""
from fastapi import APIRouter, HTTPException, Query, status
from typing import Optional
from backend.app.schemas.prediction import (
    StandardPredictionEnvelope,
    PredictionRequest,
    WeatherPredictionPayload
)
from backend.app.services.prediction_service import prediction_service
from backend.app.api.routes.grid import PILOT_CELLS

router = APIRouter(tags=["Weather Downscaling"])

@router.get("/weather", response_model=StandardPredictionEnvelope[WeatherPredictionPayload])
@router.get("/weather/point", response_model=StandardPredictionEnvelope[WeatherPredictionPayload])
def get_weather(
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
    return prediction_service.predict_weather(req)

@router.get("/weather/precipitation")
def get_weather_precipitation(
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

@router.post("/weather/predict", response_model=StandardPredictionEnvelope[WeatherPredictionPayload])
def predict_weather(req: PredictionRequest):
    return prediction_service.predict_weather(req)

@router.get("/weather/grid/{cell_id}", response_model=StandardPredictionEnvelope[WeatherPredictionPayload])
def get_weather_by_grid_cell(cell_id: str, timestamp: Optional[str] = None):
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
    return prediction_service.predict_weather(req)

@router.get("/weather/refined", response_model=StandardPredictionEnvelope[WeatherPredictionPayload])
def get_refined_weather(
    lat: float = Query(..., ge=-90.0, le=90.0),
    lon: float = Query(..., ge=-180.0, le=180.0),
    timestamp: Optional[str] = None
):
    req = PredictionRequest(
        latitude=lat,
        longitude=lon,
        timestamp_utc=timestamp
    )
    return prediction_service.predict_refined_weather(req)

@router.post("/weather/refined/predict", response_model=StandardPredictionEnvelope[WeatherPredictionPayload])
def predict_refined_weather(req: PredictionRequest):
    return prediction_service.predict_refined_weather(req)
