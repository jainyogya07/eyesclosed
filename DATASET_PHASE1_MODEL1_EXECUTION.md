# 🚀 Kisaan Ki Yash — Phase 1 / Model 1 Dataset Execution Playbook
### *Data Ingestion, Directory Setup, Automated Ingestion Scripts & Metric Grid Harmonization*
**Target Component:** `MODEL 1 (Hyperlocal Weather Downscaling)` | **Status:** `ACTIVE_EXECUTION_PHASE`

---

## 📑 Playbook Index

1. [Local Directory Scaffold & Standards](#1-local-directory-scaffold--standards)
2. [Pilot Region Selection (Level 1 Minimum Viable Dataset)](#2-pilot-region-selection-level-1-minimum-viable-dataset)
3. [Automated Ingestion Script 1: ERA5-Land Hourly Macro Features](#3-automated-ingestion-script-1-era5-land-hourly-macro-features)
4. [Automated Ingestion Script 2: Copernicus GLO-30 / SRTM 30m DEM](#4-automated-ingestion-script-2-copernicus-glo-30--srtm-30m-dem)
5. [Automated Ingestion Script 3: ESA WorldCover 10m LULC](#5-automated-ingestion-script-3-esa-worldcover-10m-lulc)
6. [Automated Ingestion Script 4: IMD AWS Ground Station Telemetry](#6-automated-ingestion-script-4-imd-aws-ground-station-telemetry)
7. [Administrative Boundaries Ingestion (Panchayat / Block / District)](#7-administrative-boundaries-ingestion)
8. [Metric Grid Spatial Harmonization Pipeline (1000m × 1000m)](#8-metric-grid-spatial-harmonization-pipeline-1000m--1000m)
9. [Dataset Manifest Generator (`model1_dataset_manifest.json`)](#9-dataset-manifest-generator)

---

## 1. Local Directory Scaffold & Standards

In accordance with the sequential implementation mandate, the following dedicated directory structure is established for Model 1:

```
data/
├── raw/
│   └── model1/
│       ├── nwp/                     # IMD GFS (12-25 km) or NCMRWF GRIB2 files
│       │   └── IMD_NWP_or_NCMRWF/
│       ├── observations/            # Independent ground truth station data
│       │   └── IMD_AWS/
│       ├── reanalysis/              # Hourly ERA5-Land NetCDF subsets
│       │   └── ERA5_Land/
│       ├── terrain/                 # SRTM / Copernicus GLO-30 DEM GeoTIFFs
│       │   └── DEM/
│       ├── landcover/               # ESA WorldCover 10m GeoTIFFs
│       │   └── ESA_WorldCover/
│       └── boundaries/              # Administrative vector polygons (GeoJSON/SHP)
│           ├── state/
│           ├── district/
│           ├── block/
│           └── panchayat/
│
├── processed/
│   └── model1/
│       ├── static_terrain_1km.tif   # Aligned Elevation, Slope, Aspect, TWI (1000m UTM)
│       ├── landcover_fractions_1km.tif # Cropland %, Water %, Urban %
│       └── aligned_weather_tensors/ # Clean Zarr / NumPy tensor cubes
│
└── manifests/
    └── model1_small_manifest.json   # Cryptographic record of dataset lineage
```

---

## 2. Pilot Region Selection (Level 1 Minimum Viable Dataset)

To establish an immediate, scientifically sound baseline without network or storage bottlenecks:

- **Target Pilot Region**: **Lucknow & Surrounding Agro-Climatic Catchment (Central Uttar Pradesh)**
- **Bounding Box (WGS84 EPSG:4326)**:
  - Minimum Longitude: `80.40°E`
  - Maximum Longitude: `81.40°E`
  - Minimum Latitude: `26.40°N`
  - Maximum Latitude: `27.40°N`
  - Spatial Dimension: $\approx 100\text{ km} \times 110\text{ km}$ ($100 \times 110$ target 1-km grid cells)
- **Local Metric Projected CRS**: **UTM Zone 44N (`EPSG:32644`)**
  - True physical spacing: exactly **$1000.0\text{ m} \times 1000.0\text{ m}$**.
- **Temporal Baseline Extent**:
  - Period: 1 Full Year (June 1, 2024 to May 31, 2025).
  - Captures both Kharif (Monsoon convective rains) and Rabi (Winter temperature inversions).
- **Ground Truth Stations**: 18 active IMD AWS and Automatic Rain Gauge (ARG) telemetry points within Lucknow, Unnao, Barabanki, and Sitapur districts.

---

## 3. Automated Ingestion Script 1: ERA5-Land Hourly Macro Features

The script below utilizes the official Copernicus Climate Data Store API to fetch the required macro-scale reanalysis variables over the target pilot bounding box.

```python
# src/ingestion/fetch_era5_land.py
import os
import cdsapi

def download_era5_land_pilot(output_dir="data/raw/model1/reanalysis/ERA5_Land"):
    os.makedirs(output_dir, exist_ok=True)
    c = cdsapi.Client()

    output_file = os.path.join(output_dir, "era5_land_central_up_2024_2025.nc")
    if os.path.exists(output_file):
        print(f"[INFO] ERA5-Land dataset already exists at: {output_file}")
        return output_file

    print("[INFO] Submitting request to Copernicus Climate Data Store (CDS)...")
    c.retrieve(
        'reanalysis-era5-land',
        {
            'variable': [
                '2m_temperature',
                '2m_dewpoint_temperature',
                'surface_pressure',
                '10m_u_component_of_wind',
                '10m_v_component_of_wind',
                'surface_solar_radiation_downwards',
                'total_precipitation'
            ],
            'year': ['2024', '2025'],
            'month': [f'{m:02d}' for m in range(1, 13)],
            'day': [f'{d:02d}' for d in range(1, 32)],
            'time': [f'{h:02d}:00' for h in range(0, 24, 3)], # 3-hourly intervals for pilot
            'area': [27.50, 80.30, 26.30, 81.50], # North, West, South, East
            'format': 'netcdf',
        },
        output_file
    )
    print(f"[SUCCESS] Downloaded ERA5-Land subset to: {output_file}")
    return output_file

if __name__ == "__main__":
    download_era5_land_pilot()
```

---

## 4. Automated Ingestion Script 2: Copernicus GLO-30 / SRTM 30m DEM

Fetches 1 arc-second ($\approx 30\text{ m}$) Copernicus Digital Elevation Model tiles directly from the public AWS Registry of Open Data.

```python
# src/ingestion/fetch_copernicus_dem.py
import os
import urllib.request
import rasterio
from rasterio.merge import merge

def download_copernicus_glo30_pilot(output_dir="data/raw/model1/terrain/DEM"):
    os.makedirs(output_dir, exist_ok=True)
    
    # Required 1x1 degree tiles covering Central UP (26N to 28N, 80E to 82E)
    tiles = [
        "Copernicus_DSM_COG_10_N26_00_E080_00_DEM",
        "Copernicus_DSM_COG_10_N26_00_E081_00_DEM",
        "Copernicus_DSM_COG_10_N27_00_E080_00_DEM",
        "Copernicus_DSM_COG_10_N27_00_E081_00_DEM",
    ]
    
    base_url = "https://copernicus-dem-30m.s3.amazonaws.com"
    downloaded_paths = []
    
    for tile in tiles:
        tile_filename = f"{tile}.tif"
        tile_url = f"{base_url}/{tile}/{tile_filename}"
        local_path = os.path.join(output_dir, tile_filename)
        
        if not os.path.exists(local_path):
            print(f"[DOWNLOADING] {tile_url} -> {local_path}")
            urllib.request.urlretrieve(tile_url, local_path)
        downloaded_paths.append(local_path)
        
    # Mosaic tiles into single pilot DEM
    merged_path = os.path.join(output_dir, "copernicus_glo30_lucknow_mosaic.tif")
    if not os.path.exists(merged_path):
        src_files_to_mosaic = [rasterio.open(fp) for fp in downloaded_paths]
        mosaic, out_trans = merge(src_files_to_mosaic)
        out_meta = src_files_to_mosaic[0].meta.copy()
        out_meta.update({
            "driver": "GTiff",
            "height": mosaic.shape[1],
            "width": mosaic.shape[2],
            "transform": out_trans
        })
        with rasterio.open(merged_path, "w", **out_meta) as dest:
            dest.write(mosaic)
        print(f"[SUCCESS] Created mosaic DEM at: {merged_path}")
    return merged_path

if __name__ == "__main__":
    download_copernicus_glo30_pilot()
```

---

## 5. Automated Ingestion Script 3: ESA WorldCover 10m LULC

Downloads the ESA WorldCover 2021 land cover GeoTIFF tile covering target coordinates directly from the open VITO / AWS repository.

```python
# src/ingestion/fetch_worldcover.py
import os
import urllib.request

def download_esa_worldcover_pilot(output_dir="data/raw/model1/landcover/ESA_WorldCover"):
    os.makedirs(output_dir, exist_ok=True)
    
    # 3x3 degree tile: N27E081 covers North India (Central UP)
    tile_name = "ESA_WorldCover_10m_2021_v200_N27E081_Map.tif"
    tile_url = f"https://esa-worldcover.s3.eu-central-1.amazonaws.com/v200/2021/map/{tile_name}"
    local_path = os.path.join(output_dir, tile_name)
    
    if not os.path.exists(local_path):
        print(f"[INFO] Downloading ESA WorldCover 10m: {tile_url}")
        urllib.request.urlretrieve(tile_url, local_path)
        print(f"[SUCCESS] Download complete: {local_path}")
    else:
        print(f"[INFO] File already exists: {local_path}")
    return local_path

if __name__ == "__main__":
    download_esa_worldcover_pilot()
```

---

## 6. Automated Ingestion Script 4: IMD AWS Ground Station Telemetry

Standardizes incoming hourly observations from the IMD Automatic Weather Station (AWS) network into a unified validation schema.

```python
# src/ingestion/parse_imd_aws.py
import os
import json
import pandas as pd
from datetime import datetime

def parse_and_validate_aws_records(raw_csv_path, output_dir="data/raw/model1/observations/IMD_AWS"):
    os.makedirs(output_dir, exist_ok=True)
    
    # Standard column mapping for IMD AWS telemetry
    col_mapping = {
        'Station_ID': 'station_id',
        'Station_Name': 'station_name',
        'Date_Time_UTC': 'timestamp_utc',
        'Latitude': 'latitude',
        'Longitude': 'longitude',
        'Elevation_m': 'elevation_m',
        'Air_Temp_C': 'temperature_c',
        'RH_pct': 'relative_humidity_pct',
        'Rainfall_1h_mm': 'rainfall_mm',
        'Wind_Speed_ms': 'wind_speed_ms',
        'Wind_Dir_deg': 'wind_dir_deg',
        'Pressure_hPa': 'pressure_hpa'
    }
    
    df = pd.read_csv(raw_csv_path)
    df = df.rename(columns=col_mapping)
    df['timestamp_utc'] = pd.to_datetime(df['timestamp_utc'])
    
    # Physical Range Quality Assurance Filtering
    df = df[(df['temperature_c'] >= -5.0) & (df['temperature_c'] <= 55.0)]
    df = df[(df['relative_humidity_pct'] >= 0.0) & (df['relative_humidity_pct'] <= 100.0)]
    df = df[(df['rainfall_mm'] >= 0.0) & (df['rainfall_mm'] <= 350.0)]
    df = df[(df['wind_speed_ms'] >= 0.0) & (df['wind_speed_ms'] <= 75.0)]
    
    clean_output = os.path.join(output_dir, "clean_aws_lucknow_observations.parquet")
    df.to_parquet(clean_output, index=False)
    print(f"[SUCCESS] Validated {len(df)} AWS ground station records saved to {clean_output}")
    return clean_output
```

---

## 7. Administrative Boundaries Ingestion

Fetches official open spatial vector boundaries (GeoJSON) from the Survey of India / Bharat Maps / DataMeet repository to align District, Block, and Panchayat polygons.

```python
# src/ingestion/fetch_boundaries.py
import os
import urllib.request
import geopandas as gpd

def fetch_administrative_boundaries(output_dir="data/raw/model1/boundaries"):
    os.makedirs(output_dir, exist_ok=True)
    
    # DataMeet Indian Administrative Boundaries (Open Access)
    districts_geojson_url = "https://raw.githubusercontent.com/datameet/maps/master/Districts/Census_2011/india_district.geojson"
    local_districts_path = os.path.join(output_dir, "district", "india_districts.geojson")
    os.makedirs(os.path.dirname(local_districts_path), exist_ok=True)
    
    if not os.path.exists(local_districts_path):
        print(f"[DOWNLOADING] District boundaries: {districts_geojson_url}")
        urllib.request.urlretrieve(districts_geojson_url, local_districts_path)
    
    # Filter for Central UP districts
    gdf = gpd.read_file(local_districts_path)
    central_up = gdf[gdf['ST_NAME'].str.upper() == 'UTTAR PRADESH']
    pilot_districts = central_up[central_up['DISTRICT'].str.upper().isin(['LUCKNOW', 'UNNAO', 'BARABANKI', 'SITAPUR'])]
    
    pilot_boundary_path = os.path.join(output_dir, "district", "central_up_pilot_districts.geojson")
    pilot_districts.to_file(pilot_boundary_path, driver="GeoJSON")
    print(f"[SUCCESS] Filtered pilot boundary GeoJSON saved to: {pilot_boundary_path}")
    return pilot_boundary_path

if __name__ == "__main__":
    fetch_administrative_boundaries()
```

---

## 8. Metric Grid Spatial Harmonization Pipeline (1000m × 1000m)

This script executes the critical scientific step: taking heterogeneous input rasters (30m DEM, 10m LULC, 9km ERA5-Land) and warping them to the exact **1000m × 1000m Metric UTM Zone 44N (`EPSG:32644`)** coordinate grid.

```python
# src/preprocessing/spatial_harmonizer.py
import numpy as np
import rasterio
from rasterio.warp import calculate_default_transform, reproject, Resampling

def warp_dem_to_1000m_metric(input_dem_path, output_1km_path):
    """
    Warps high-resolution DEM to exactly 1000m x 1000m cell resolution in UTM 44N.
    Computes Elevation, Slope, and Aspect.
    """
    dst_crs = "EPSG:32644" # UTM Zone 44N for Central India
    target_res = 1000.0     # 1000 meters physical spacing

    with rasterio.open(input_dem_path) as src:
        transform, width, height = calculate_default_transform(
            src.crs, dst_crs, src.width, src.height, *src.bounds, resolution=target_res
        )
        kwargs = src.meta.copy()
        kwargs.update({
            'crs': dst_crs,
            'transform': transform,
            'width': width,
            'height': height,
            'count': 3, # Band 1: Elevation, Band 2: Slope, Band 3: Aspect
            'dtype': 'float32'
        })

        elev_1km = np.empty((height, width), dtype=np.float32)
        reproject(
            source=rasterio.band(src, 1),
            destination=elev_1km,
            src_transform=src.transform,
            src_crs=src.crs,
            dst_transform=transform,
            dst_crs=dst_crs,
            resampling=Resampling.average
        )

        # Compute numerical gradients for Slope and Aspect
        dy, dx = np.gradient(elev_1km, target_res)
        slope_rad = np.arctan(np.sqrt(dx**2 + dy**2))
        slope_deg = np.degrees(slope_rad)
        aspect_rad = np.arctan2(-dx, dy)
        aspect_rad[aspect_rad < 0] += 2 * np.pi

        with rasterio.open(output_1km_path, 'w', **kwargs) as dst:
            dst.write(elev_1km, 1)
            dst.write(slope_deg.astype(np.float32), 2)
            dst.write(aspect_rad.astype(np.float32), 3)
            dst.set_band_description(1, "Elevation_m")
            dst.set_band_description(2, "Slope_degrees")
            dst.set_band_description(3, "Aspect_radians")

    print(f"[SUCCESS] Warped 1-km Topographic Tensor created: {output_1km_path}")
    print(f"         Grid shape: {height} rows x {width} cols ({height*width} km²)")
    return output_1km_path

if __name__ == "__main__":
    warp_dem_to_1000m_metric(
        "data/raw/model1/terrain/DEM/copernicus_glo30_lucknow_mosaic.tif",
        "data/processed/model1/static_terrain_1km_utm44n.tif"
    )
```

---

## 9. Dataset Manifest Generator

To guarantee reproducible ML development, this script hashes the downloaded files and records an immutable JSON manifest:

```python
# src/ingestion/generate_manifest.py
import json
import hashlib
from datetime import datetime

def generate_model1_manifest():
    manifest = {
        "manifest_version": "1.0.0",
        "generated_at": datetime.utcnow().isoformat() + "Z",
        "model_target": "MODEL 1 (Hyperlocal Weather Downscaling)",
        "dataset_tier": "LEVEL 1 (Small Real Pilot)",
        "geographic_extent": {
            "pilot_name": "Central Uttar Pradesh (Lucknow-Unnao-Barabanki-Sitapur)",
            "bounding_box_wgs84": [80.40, 26.40, 81.40, 27.40],
            "analysis_projected_crs": "EPSG:32644",
            "physical_grid_spacing_meters": 1000.0
        },
        "components": {
            "reanalysis_features": {
                "source": "Copernicus ERA5-Land",
                "variables": ["t2m", "r2m", "sp", "u10", "v10", "ssrd"],
                "file": "data/raw/model1/reanalysis/ERA5_Land/era5_land_central_up_2024_2025.nc"
            },
            "terrain_features": {
                "source": "Copernicus GLO-30 DEM",
                "variables": ["Elevation", "Slope", "Aspect"],
                "file": "data/processed/model1/static_terrain_1km_utm44n.tif"
            },
            "land_cover_features": {
                "source": "ESA WorldCover 10m 2021",
                "variables": ["Cropland%", "Builtup%", "Water%"],
                "file": "data/raw/model1/landcover/ESA_WorldCover/ESA_WorldCover_10m_2021_v200_N27E081_Map.tif"
            },
            "ground_truth_targets": {
                "source": "IMD Automatic Weather Station (AWS) Network",
                "station_count": 18,
                "variables": ["temperature_c", "relative_humidity_pct", "wind_speed_ms"],
                "file": "data/raw/model1/observations/IMD_AWS/clean_aws_lucknow_observations.parquet"
            }
        },
        "validation_strategy": {
            "spatial_split": "Leave-3-Stations-Out (Sitapur, Unnao)",
            "temporal_split": "Walk-forward: Train June-Dec 2024, Test Jan-May 2025"
        }
    }
    
    with open("data/manifests/model1_small_manifest.json", "w") as f:
        json.dump(manifest, f, indent=2)
    print("[SUCCESS] Model 1 Dataset Manifest generated at: data/manifests/model1_small_manifest.json")

if __name__ == "__main__":
    generate_model1_manifest()
```

---
*Authored for Kisaan Ki Yash — Model 1 Dataset Engineering Playbook.*
