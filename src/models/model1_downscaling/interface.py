"""
Interface definitions and Pydantic schemas for Model 1: Hyperlocal Weather Downscaling.
"""
from datetime import datetime
from typing import List, Tuple, Literal
from pydantic import BaseModel, Field

class WeatherDownscalingInput(BaseModel):
    timestamp_utc: datetime
    crs: str = "EPSG:32644"
    coarse_t2m: List[List[float]]
    coarse_rh: List[List[float]]
    coarse_sp: List[List[float]]
    elevation_1km: List[List[float]]
    slope_1km: List[List[float]]
    aspect_1km: List[List[float]]

class WeatherGridRasterOutput(BaseModel):
    timestamp_utc: datetime
    crs: str = "EPSG:32644"
    resolution_meters: float = 1000.0
    height_cells: int
    width_cells: int
    temperature_2m_c: List[List[float]]
    relative_humidity_pct: List[List[float]]
    surface_pressure_hpa: List[List[float]]
    temp_lower_bound_90: List[List[float]]
    temp_upper_bound_90: List[List[float]]
    is_simulated: bool = False

class StationObservation(BaseModel):
    station_id: str
    station_name: str
    timestamp_utc: datetime
    latitude: float
    longitude: float
    grid_x: int
    grid_y: int
    elevation_m: float
    temperature_c: float
    relative_humidity_pct: float
    wind_speed_ms: float
    rainfall_mm: float
