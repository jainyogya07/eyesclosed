"""
Spatial Grid API Routes (1-km Metric Grid in EPSG:32644).
"""
from fastapi import APIRouter, HTTPException, Query, status
from typing import Optional, Dict
import math
from backend.app.schemas.spatial import GridCellResponse

router = APIRouter(tags=["Spatial Grid"])

# 1-km Pilot Cells for Lucknow
PILOT_CELLS: Dict[str, GridCellResponse] = {
    "CELL_LKO_X02_Y03": GridCellResponse(
        cell_id="CELL_LKO_X02_Y03",
        crs="EPSG:32644",
        resolution_meters=1000,
        easting_min=288000.0,
        northing_min=2961000.0,
        easting_max=289000.0,
        northing_max=2962000.0,
        center_latitude=26.76,
        center_longitude=80.88,
        elevation_m=119.95,
        cropland_fraction=0.15,
        panchayat_code="PC_092801",
        panchayat_name="Amausi"
    ),
    "CELL_LKO_X07_Y02": GridCellResponse(
        cell_id="CELL_LKO_X07_Y02",
        crs="EPSG:32644",
        resolution_meters=1000,
        easting_min=293000.0,
        northing_min=2985000.0,
        easting_max=294000.0,
        northing_max=2986000.0,
        center_latitude=26.98,
        center_longitude=80.93,
        elevation_m=121.50,
        cropland_fraction=0.72,
        panchayat_code="PC_092802",
        panchayat_name="Bakshi Ka Talab"
    ),
    "CELL_LKO_X08_Y07": GridCellResponse(
        cell_id="CELL_LKO_X08_Y07",
        crs="EPSG:32644",
        resolution_meters=1000,
        easting_min=305000.0,
        northing_min=2975000.0,
        easting_max=306000.0,
        northing_max=2976000.0,
        center_latitude=26.89,
        center_longitude=81.05,
        elevation_m=120.37,
        cropland_fraction=0.68,
        panchayat_code="PC_092803",
        panchayat_name="Chinhat Agri Block"
    ),
    "CELL_LKO_X03_Y08": GridCellResponse(
        cell_id="CELL_LKO_X03_Y08",
        crs="EPSG:32644",
        resolution_meters=1000,
        easting_min=298000.0,
        northing_min=2952000.0,
        easting_max=299000.0,
        northing_max=2953000.0,
        center_latitude=26.68,
        center_longitude=80.98,
        elevation_m=117.93,
        cropland_fraction=0.81,
        panchayat_code="PC_092804",
        panchayat_name="Mohanlalganj"
    ),
    "CELL_LKO_X01_Y06": GridCellResponse(
        cell_id="CELL_LKO_X01_Y06",
        crs="EPSG:32644",
        resolution_meters=1000,
        easting_min=272000.0,
        northing_min=2979000.0,
        easting_max=273000.0,
        northing_max=298000.0,
        center_latitude=26.92,
        center_longitude=80.72,
        elevation_m=119.26,
        cropland_fraction=0.88,
        panchayat_code="PC_092805",
        panchayat_name="Malihabad"
    )
}

@router.get("/grid/{cell_id}", response_model=GridCellResponse)
def get_grid_cell(cell_id: str):
    cell = PILOT_CELLS.get(cell_id.upper())
    if not cell:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Grid cell '{cell_id}' not found in 1-km pilot registry."
        )
    return cell

@router.get("/grid", response_model=GridCellResponse)
def query_grid_by_coordinate(
    lat: float = Query(..., ge=-90.0, le=90.0, description="Latitude in WGS 84"),
    lon: float = Query(..., ge=-180.0, le=180.0, description="Longitude in WGS 84")
):
    # Verify bounds within Lucknow pilot domain
    if not (26.50 <= lat <= 27.20 and 80.60 <= lon <= 81.30):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Coordinates ({lat}, {lon}) outside verified Lucknow 1-km pilot grid domain."
        )

    # Find nearest pilot cell
    best_cell = None
    min_dist_sq = float("inf")
    for cell in PILOT_CELLS.values():
        dist_sq = (cell.center_latitude - lat) ** 2 + (cell.center_longitude - lon) ** 2
        if dist_sq < min_dist_sq:
            min_dist_sq = dist_sq
            best_cell = cell

    return best_cell
