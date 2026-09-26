# 🛰️ Kisaan Ki Yash — Satellite Earth Observation, SoilGrids & Hydrology Technical Guide
### *Deep Technical Specifications for Sentinel-1/2, LST, SoilGrids 250m, HydroSHEDS & GPM IMERG*
**Target Components:** `MODELS 4, 5, 6, 7, 8 (Phases 2, 3, 4)` | **Status:** `ARCHITECTURE_READY_DOCUMENTATION`

---

## 📑 Technical Document Index

1. [Sentinel-1 C-Band SAR: Microwave Physics & Preprocessing Pipeline](#1-sentinel-1-c-band-sar-microwave-physics--preprocessing-pipeline)
2. [Sentinel-2 Multi-Spectral Instrument (MSI): Optical Phenology Indices](#2-sentinel-2-multi-spectral-instrument-msi-optical-phenology-indices)
3. [Land Surface Temperature (LST): Sensor Fusion & Evaporative Physics](#3-land-surface-temperature-lst-sensor-fusion--evaporative-physics)
4. [ISRIC SoilGrids 250m: Depth Intervals & Pedotransfer Hydraulic Equations](#4-isric-soilgrids-250m-depth-intervals--pedotransfer-hydraulic-equations)
5. [HydroSHEDS & Surface Hydrology: Flow Accumulation & Topographic Wetness Index (TWI)](#5-hydrosheds--surface-hydrology-flow-accumulation--topographic-wetness-index-twi)
6. [NASA GPM IMERG: High-Frequency Satellite Precipitation](#6-nasa-gpm-imerg-high-frequency-satellite-precipitation)
7. [Copernicus Data Space Ecosystem (CDSE) Python STAC Query Workflow](#7-copernicus-data-space-ecosystem-cdse-python-stac-query-workflow)

---

## 1. Sentinel-1 C-Band SAR: Microwave Physics & Preprocessing Pipeline

### 1.1 Microwave Interaction with Soil and Agricultural Canopies
Synthetic Aperture Radar (SAR) operates in the microwave spectrum, independent of solar illumination and cloud cover:
- **Sensor**: Sentinel-1A / 1C C-band SAR ($f = 5.405\text{ GHz}$, $\lambda \approx 5.55\text{ cm}$).
- **Acquisition Mode**: Interferometric Wide Swath (IW), Ground Range Detected (GRD), 10m spatial resolution.
- **Polarizations**: Dual-polarization $\text{VV}$ (vertical transmit, vertical receive) and $\text{VH}$ (vertical transmit, horizontal receive).
- **Physical Scattering Mechanisms**:
  1. **Surface Roughness & Dielectric Scattering ($\sigma^\circ_{VV}$)**: Sensitive to surface soil moisture in top $0-5\text{ cm}$. Water has a high dielectric constant ($\varepsilon \approx 80$) compared to dry mineral soil ($\varepsilon \approx 3-5$). Higher soil moisture causes higher dielectric permittivity, increasing backscatter reflectivity.
  2. **Volume Scattering ($\sigma^\circ_{VH}$)**: Depolarization occurs within the complex vegetative canopy (stems, leaves, wheat ears). As biomass grows, volume scattering increases.
  3. **Polarization Cross-Ratio ($CR = \sigma^\circ_{VH} / \sigma^\circ_{VV}$)**: Mitigates soil roughness and incidence angle effects, isolating vegetative water content and canopy structure.

### 1.2 ESA SNAP / Python Automated Radiometric Terrain Correction (RTC) Pipeline
Raw GRD products must undergo strict radiometric and geometric processing before feeding into **Model 4 (Soil Moisture)**:
```
[Sentinel-1 GRD Raw SAFE]
         │
         ▼
[1. Precise Orbit Ephemerides Application] (Apply-Orbit-File)
         │
         ▼
[2. Thermal Noise Removal] (Remove instrument background noise floor)
         │
         ▼
[3. Radiometric Calibration] (Compute true radar backscatter: $\sigma^\circ, \gamma^\circ$)
         │
         ▼
[4. Speckle Filtering] (Refined Lee Filter / Multi-temporal spatio-temporal filter, 5x5 window)
         │
         ▼
[5. Range-Doppler Terrain Correction] (Orthorectification with Copernicus 30m DEM)
         │
         ▼
[6. Decibel Conversion] ($\sigma^\circ_{\text{dB}} = 10 \cdot \log_{10}(\sigma^\circ_{\text{linear}})$)
         │
         ▼
[Warp to 1000m Metric Analysis Grid (UTM 44N)]
```

---

## 2. Sentinel-2 Multi-Spectral Instrument (MSI): Optical Phenology Indices

### 2.1 Spectral Bands Specification (Level-2A BOA Surface Reflectance)
Sentinel-2 provides Bottom-Of-Atmosphere (BOA) surface reflectance across 13 spectral bands:

| Band Identifier | Central Wavelength ($\lambda$) | Bandwidth ($\Delta \lambda$) | Spatial Resolution | Agricultural Sensitivity |
|---|---|---|---|---|
| **B02 (Blue)** | $490\text{ nm}$ | $65\text{ nm}$ | $10\text{ m}$ | Atmospheric scattering correction |
| **B03 (Green)** | $560\text{ nm}$ | $35\text{ nm}$ | $10\text{ m}$ | Peak vegetation green reflectance |
| **B04 (Red)** | $665\text{ nm}$ | $30\text{ nm}$ | $10\text{ m}$ | Maximum chlorophyll absorption |
| **B05 (Red Edge 1)** | $705\text{ nm}$ | $15\text{ nm}$ | $20\text{ m}$ | Red-edge boundary shift |
| **B06 (Red Edge 2)** | $740\text{ nm}$ | $15\text{ nm}$ | $20\text{ m}$ | Leaf chlorophyll and nitrogen status |
| **B07 (Red Edge 3)** | $783\text{ nm}$ | $20\text{ nm}$ | $20\text{ m}$ | Canopy structure and biomass |
| **B08 (Broad NIR)** | $842\text{ nm}$ | $115\text{ nm}$ | $10\text{ m}$ | Leaf cell structure reflection |
| **B8A (Narrow NIR)** | $865\text{ nm}$ | $20\text{ nm}$ | $20\text{ m}$ | Biophysical parameter retrieval |
| **B11 (SWIR-1)** | $1610\text{ nm}$ | $90\text{ nm}$ | $20\text{ m}$ | Leaf water absorption, soil moisture |
| **B12 (SWIR-2)** | $2190\text{ nm}$ | $180\text{ nm}$ | $20\text{ m}$ | Soil mineral absorption, moisture |
| **SCL (Scene Class)**| Categorical | N/A | $20\text{ m}$ | Cloud, shadow, vegetation, water mask |

### 2.2 Mathematical Formulation of Core Crop Indices
1. **Normalized Difference Vegetation Index (NDVI)**:
   $$\text{NDVI} = \frac{\rho_{\text{NIR}} - \rho_{\text{Red}}}{\rho_{\text{NIR}} + \rho_{\text{Red}}} = \frac{\text{B8} - \text{B4}}{\text{B8} + \text{B4}}$$
2. **Normalized Difference Red Edge (NDRE)** — *Crucial for non-saturating mid-to-late Kharif crops*:
   $$\text{NDRE} = \frac{\rho_{\text{NIR}} - \rho_{\text{RedEdge1}}}{\rho_{\text{NIR}} + \rho_{\text{RedEdge1}}} = \frac{\text{B8} - \text{B5}}{\text{B8} + \text{B5}}$$
3. **Enhanced Vegetation Index (EVI)** — *Atmospherically resistant high-biomass proxy*:
   $$\text{EVI} = 2.5 \times \frac{\text{B8} - \text{B4}}{\text{B8} + 6\text{B4} - 7.5\text{B2} + 1}$$
4. **Normalized Difference Water Index (NDWI)** — *Canopy water stress*:
   $$\text{NDWI} = \frac{\text{B8} - \text{B11}}{\text{B8} + \text{B11}}$$

---

## 3. Land Surface Temperature (LST): Sensor Fusion & Evaporative Physics

### 3.1 Role of LST in Temperature Refinement and Soil Moisture
Land Surface Temperature represents the skin temperature of the Earth's surface:
- In dry bare soils, solar radiation is converted almost entirely to sensible heat flux ($H$), yielding very high LST ($45^\circ\text{C}-55^\circ\text{C}$).
- In saturated or irrigated soils, latent heat of vaporization ($\lambda E$) dominates, cooling the surface dramatically ($28^\circ\text{C}-34^\circ\text{C}$).
- **Optical Trapezoid Model (OPTRAM)**:
  By plotting shortwave NDVI against LST, a characteristic trapezoid emerges:
  - **Dry Edge**: Maximum temperature at a given NDVI (zero plant-available water).
  - **Wet Edge**: Minimum temperature at a given NDVI (potential evapotranspiration rate).
  - **Soil Moisture Index (SMI)**:
    $$\text{SMI} = \frac{\text{LST}_{\text{dry}}(\text{NDVI}) - \text{LST}_{\text{obs}}}{\text{LST}_{\text{dry}}(\text{NDVI}) - \text{LST}_{\text{wet}}(\text{NDVI})}$$

---

## 4. ISRIC SoilGrids 250m: Depth Intervals & Pedotransfer Hydraulic Equations

SoilGrids v2.0 provides global gridded predictions based on machine learning models trained on 240,000 soil profile points.

### 4.1 Standard Depth Layers:
- Layer 1: `0 - 5 cm` (Surface evaporation zone)
- Layer 2: `5 - 15 cm` (Seedling root zone)
- Layer 3: `15 - 30 cm` (Primary cereal crop root zone)
- Layer 4: `30 - 60 cm` (Deep crop root zone)
- Layer 5: `60 - 100 cm` (Subsoil storage zone)
- Layer 6: `100 - 200 cm` (Deep percolation / water table boundary)

### 4.2 Soil Hydraulic Pedotransfer Functions (Saxton & Rawls Formulation)
To convert raw percentages of Sand, Clay, and Organic Matter into water-holding parameters:

1. **Field Capacity ($\theta_{33}$, matric suction $\psi = -33\text{ kPa}$)**:
   $$\theta_{33} = -0.251 \times S + 0.195 \times C + 0.011 \times \text{OM} + (0.006 \times S \times \text{OM}) - (0.027 \times C \times \text{OM}) + (0.452 \times S \times C) + 0.299$$
   $$\theta_{\text{FC}} = \theta_{33} + [1.283 \times (\theta_{33})^2 - 0.374 \times \theta_{33} - 0.015]$$

2. **Permanent Wilting Point ($\theta_{1500}$, matric suction $\psi = -1500\text{ kPa}$)**:
   $$\theta_{1500} = -0.024 \times S + 0.487 \times C + 0.006 \times \text{OM} + (0.005 \times S \times \text{OM}) - (0.013 \times C \times \text{OM}) + (0.068 \times S \times C) + 0.031$$
   $$\theta_{\text{PWP}} = \theta_{1500} + [0.14 \times \theta_{1500} - 0.02]$$

3. **Total Available Water for Crop (TAW, mm/m depth)**:
   $$\text{TAW} = 1000 \times (\theta_{\text{FC}} - \theta_{\text{PWP}})$$

---

## 5. HydroSHEDS & Surface Hydrology: Flow Accumulation & TWI

### 5.1 Hydrological Routing over Agricultural Catchments
For **Model 8 (Flood & Waterlogging Risk)**, elevation alone is insufficient. Runoff pathways must be mathematically routed:
1. **Flow Direction (D8 Algorithm)**: Determines which of the 8 neighboring cells water will flow to based on the steepest descent vector:
   $$\text{Slope}_i = \frac{Z_0 - Z_i}{d_i}$$
2. **Flow Accumulation ($A$)**: The total count of upstream cells draining into a given cell. High flow accumulation identifies natural streams, depressions, and village drainage channels.
3. **Topographic Wetness Index (TWI)**:
   $$\text{TWI} = \ln\left( \frac{\alpha}{\tan \beta} \right)$$
   Where:
   - $\alpha$ is the specific catchment area (upstream contributing area per unit contour width).
   - $\beta$ is the local slope gradient in radians.
   - High TWI ($> 12$) marks flat, poorly drained low-lying agricultural plots highly prone to waterlogging after monsoon cloudbursts.

---

## 6. NASA GPM IMERG: High-Frequency Satellite Precipitation

### 6.1 GPM Architecture
- **Constellation**: NASA-JAXA Global Precipitation Measurement Core Observatory with multi-satellite microwave and infrared constellation.
- **IMERG Product Suites**:
  - **Early Run** (Latency: ~4 hours): Real-time forward-propagation for disaster alerts.
  - **Late Run** (Latency: ~14 hours): Bidirectional morphing with climatological calibration.
  - **Final Run** (Latency: ~3.5 months): Monthly rain-gauge calibrated research dataset.
- **Physical Caveat**: Satellite precipitation estimates miss localized orographic rain enhancement in mountainous terrain and can misclassify warm-cloud convective drizzle. It is treated as an auxiliary feature, **never ground truth**.

---

## 7. Copernicus Data Space Ecosystem (CDSE) Python STAC Query Workflow

This verified production script demonstrates how to search, filter, and stream Sentinel-1 and Sentinel-2 acquisitions over a target Indian Panchayat without downloading entire 1 GB scenes:

```python
# src/ingestion/cdse_stac_client.py
import requests
import json

def search_sentinel_cdse(
    collection="SENTINEL-2",
    bbox=[80.5, 26.5, 81.3, 27.2],
    start_date="2025-07-01",
    end_date="2025-07-31",
    max_cloud_cover=20
):
    """
    Queries Copernicus Data Space Ecosystem STAC API for optical or radar scenes.
    """
    stac_url = "https://catalogue.dataspace.copernicus.eu/stac/search"
    
    payload = {
        "collections": [collection],
        "bbox": bbox,
        "datetime": f"{start_date}T00:00:00Z/{end_date}T23:59:59Z",
        "limit": 10,
        "query": {
            "cloudCover": {
                "lte": max_cloud_cover
            }
        } if collection == "SENTINEL-2" else {}
    }
    
    headers = {"Content-Type": "application/json"}
    response = requests.post(stac_url, json=payload, headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        features = data.get("features", [])
        print(f"[SUCCESS] Found {len(features)} matching {collection} scenes.")
        for f in features:
            props = f["properties"]
            print(f" - ID: {f['id']} | Date: {props.get('datetime')} | Cloud%: {props.get('cloudCover', 'N/A')}")
        return features
    else:
        print(f"[ERROR] STAC Query failed [{response.status_code}]: {response.text}")
        return []

if __name__ == "__main__":
    search_sentinel_cdse()
```

---
*Authored for Kisaan Ki Yash — Satellite Earth Observation, Soil & Hydrology Architecture.*
