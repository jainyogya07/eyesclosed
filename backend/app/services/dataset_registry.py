"""
Dataset Registry Service for Kisaan Ki Yash.
Maintains data manifests, provenance records, and readiness audit states for physical earth observation datasets.
"""
from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field
import os
from backend.app.config import settings
from backend.app.infrastructure.logging import log_audit_event

class DatasetManifest(BaseModel):
    dataset_id: str
    name: str
    description: str
    version: str
    data_type: str  # IN_SITU_STATION, NWP_GRID, SATELLITE_RASTER, STATIC_TERRAIN
    spatial_coverage: str
    temporal_coverage: str
    file_path: Optional[str] = None
    sample_count: int
    variables: List[str]
    audit_status: str  # AUDITED_VERIFIED, PENDING_AUDIT, INSUFFICIENT
    sha256_checksum: Optional[str] = None

class DatasetRegistryService:
    def __init__(self):
        self._datasets: Dict[str, DatasetManifest] = {}
        self._initialize_catalog()

    def _initialize_catalog(self):
        catalog = [
            DatasetManifest(
                dataset_id="DS_LKO_AWS_PILOT_72H",
                name="Lucknow AWS Ground Truth 72-Hour Pilot",
                description="High-frequency calibrated AWS station data from 5 locations in Lucknow.",
                version="1.0.0-pilot",
                data_type="IN_SITU_STATION",
                spatial_coverage="Lucknow District, UP (26.6°N - 27.1°N, 80.7°E - 81.1°E)",
                temporal_coverage="2025-07-15T00:00:00Z to 2025-07-17T23:00:00Z (72 hours)",
                file_path="data/datasets/tiny/model1/aws_ground_truth_72h.csv",
                sample_count=360,
                variables=["temperature_c", "relative_humidity_pct", "wind_speed_ms", "rainfall_mm", "elevation_m"],
                audit_status="AUDITED_VERIFIED"
            ),
            DatasetManifest(
                dataset_id="DS_COARSE_NWP_72H",
                name="Coarse NWP Atmospheric Timeseries",
                description="0.25-degree numerical weather prediction forecasts aligned to Lucknow extent.",
                version="1.0.0-pilot",
                data_type="NWP_GRID",
                spatial_coverage="Lucknow 2x2 coarse grid",
                temporal_coverage="2025-07-15T00:00:00Z to 2025-07-17T23:00:00Z",
                file_path="data/datasets/tiny/model1/coarse_nwp_timeseries.npz",
                sample_count=72,
                variables=["t2m_coarse", "rh_coarse", "sp_coarse", "tp_coarse"],
                audit_status="AUDITED_VERIFIED"
            ),
            DatasetManifest(
                dataset_id="DS_DEM_TERRAIN_1KM",
                name="SRTM 1-km Terrain Features Grid",
                description="Metric projected 1-km digital elevation, slope, and aspect features.",
                version="1.0.0-pilot",
                data_type="STATIC_TERRAIN",
                spatial_coverage="EPSG:32644 (UTM Zone 44N) 10x10 km bounding box",
                temporal_coverage="Static baseline",
                file_path="data/datasets/tiny/model1/terrain_features_1km.npz",
                sample_count=100,
                variables=["elevation_1km", "slope_1km", "aspect_1km", "cropland_fraction_1km"],
                audit_status="AUDITED_VERIFIED"
            ),
            DatasetManifest(
                dataset_id="DS_SENTINEL_SAR_M4",
                name="Sentinel-1 SAR Backscatter (M4 Candidate)",
                description="Sentinel-1 C-band VV and VH backscatter data for root-zone moisture.",
                version="0.1.0-draft",
                data_type="SATELLITE_RASTER",
                spatial_coverage="Lucknow Panchayat grids",
                temporal_coverage="Pending acquisition",
                file_path=None,
                sample_count=0,
                variables=["VV_sigma0", "VH_sigma0", "local_incidence_angle"],
                audit_status="PENDING_AUDIT"
            ),
            DatasetManifest(
                dataset_id="DS_SOILGRIDS_250M",
                name="ISRIC SoilGrids 250m Properties",
                description="Global gridded soil information (clay, sand, silt, organic carbon, pH).",
                version="2020.1",
                data_type="STATIC_SOIL",
                spatial_coverage="India Regional Subset",
                temporal_coverage="Static baseline",
                file_path=None,
                sample_count=0,
                variables=["clay_pct", "sand_pct", "bulk_density_cg_cm3", "soc_dg_kg"],
                audit_status="PENDING_AUDIT"
            )
        ]
        for ds in catalog:
            self._datasets[ds.dataset_id] = ds

    def get_dataset(self, dataset_id: str) -> Optional[DatasetManifest]:
        return self._datasets.get(dataset_id)

    def list_datasets(self) -> List[DatasetManifest]:
        return list(self._datasets.values())

dataset_registry = DatasetRegistryService()
