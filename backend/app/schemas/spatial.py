"""
Spatial reference and coordinate schema representations.
"""
from typing import Optional
from pydantic import BaseModel, Field

class GeoLocation(BaseModel):
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)
    elevation_m: Optional[float] = None

class SpatialReference(BaseModel):
    analysis_crs: str = Field(default="EPSG:32644", description="Metric coordinate reference system")
    grid_resolution_m: int = Field(default=1000, description="Spatial resolution in meters")
    crs: str = Field(default="EPSG:32644", description="Metric coordinate reference system")
    resolution_meters: int = Field(default=1000, description="Spatial resolution in meters")
    grid_cell_id: Optional[str] = None
    location: Optional[GeoLocation] = None
    panchayat_code: Optional[str] = None
    panchayat_name: Optional[str] = None
    district_name: Optional[str] = "Lucknow"
    state_name: Optional[str] = "Uttar Pradesh"

class GridCellResponse(BaseModel):
    cell_id: str
    crs: str = "EPSG:32644"
    resolution_meters: int = 1000
    easting_min: float
    northing_min: float
    easting_max: float
    northing_max: float
    center_latitude: float
    center_longitude: float
    elevation_m: float
    cropland_fraction: float
    panchayat_code: str
    panchayat_name: str
