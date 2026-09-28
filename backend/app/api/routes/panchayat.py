"""
Panchayat Metadata and Administrative Hierarchy API Routes.
"""
from fastapi import APIRouter, HTTPException, status
from typing import Dict, List, Optional
from pydantic import BaseModel

router = APIRouter(tags=["Panchayat"])

class PanchayatDetails(BaseModel):
    panchayat_code: str
    panchayat_name: str
    block_name: str
    district_name: str
    state_name: str
    latitude: float
    longitude: float
    primary_grid_cell_id: str
    area_sq_km: float
    major_crops: List[str]

PANCHAYATS: Dict[str, PanchayatDetails] = {
    "PC_092801": PanchayatDetails(
        panchayat_code="PC_092801",
        panchayat_name="Amausi",
        block_name="Sarojini Nagar",
        district_name="Lucknow",
        state_name="Uttar Pradesh",
        latitude=26.76,
        longitude=80.88,
        primary_grid_cell_id="CELL_LKO_X02_Y03",
        area_sq_km=14.2,
        major_crops=["Paddy", "Wheat", "Mustard"]
    ),
    "PC_092802": PanchayatDetails(
        panchayat_code="PC_092802",
        panchayat_name="Bakshi Ka Talab",
        block_name="Bakshi Ka Talab",
        district_name="Lucknow",
        state_name="Uttar Pradesh",
        latitude=26.98,
        longitude=80.93,
        primary_grid_cell_id="CELL_LKO_X07_Y02",
        area_sq_km=22.8,
        major_crops=["Paddy", "Wheat", "Sugarcane", "Potato"]
    ),
    "PC_092803": PanchayatDetails(
        panchayat_code="PC_092803",
        panchayat_name="Chinhat Agri Block",
        block_name="Chinhat",
        district_name="Lucknow",
        state_name="Uttar Pradesh",
        latitude=26.89,
        longitude=81.05,
        primary_grid_cell_id="CELL_LKO_X08_Y07",
        area_sq_km=18.5,
        major_crops=["Vegetables", "Flowers", "Paddy", "Wheat"]
    ),
    "PC_092804": PanchayatDetails(
        panchayat_code="PC_092804",
        panchayat_name="Mohanlalganj",
        block_name="Mohanlalganj",
        district_name="Lucknow",
        state_name="Uttar Pradesh",
        latitude=26.68,
        longitude=80.98,
        primary_grid_cell_id="CELL_LKO_X03_Y08",
        area_sq_km=31.4,
        major_crops=["Paddy", "Pulses", "Wheat", "Mustard"]
    ),
    "PC_092805": PanchayatDetails(
        panchayat_code="PC_092805",
        panchayat_name="Malihabad",
        block_name="Malihabad",
        district_name="Lucknow",
        state_name="Uttar Pradesh",
        latitude=26.92,
        longitude=80.72,
        primary_grid_cell_id="CELL_LKO_X01_Y06",
        area_sq_km=28.1,
        major_crops=["Mango (Dasheri)", "Guava", "Paddy", "Vegetables"]
    )
}

@router.get("/panchayat", response_model=List[PanchayatDetails])
def list_panchayats():
    return list(PANCHAYATS.values())

@router.get("/panchayat/{id}", response_model=PanchayatDetails)
def get_panchayat(id: str):
    p_id = id.upper()
    # Support lookup by code or by direct key
    panchayat = PANCHAYATS.get(p_id)
    if not panchayat:
        for p in PANCHAYATS.values():
            if p.panchayat_name.upper() == p_id:
                return p
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Panchayat '{id}' not found."
        )
    return panchayat

@router.get("/digital-twin/{panchayat_code}")
def get_digital_twin(panchayat_code: str):
    from backend.app.services.intelligence_engine import intelligence_engine
    return intelligence_engine.compute_digital_twin_state(panchayat_code)

