# Model 2: High-Resolution Temperature Refinement — Data Readiness Audit Report

**Audit Date:** 2026-09-26  
**Auditor:** Principal ML Engineer & Geospatial Climate Scientist  
**Model 2 Target:** High-Resolution Temperature Refinement ($1000\text{ m} \times 1000\text{ m}$ Grid, `EPSG:32644`)  
**Upstream Model 1 Status:** **FROZEN & IMMUTABLE** (SHA-256: `30c22d4c7f69a48149a7f844cef62398566ddc1ed4acf00d9f536e72a68803ea`)  
**Audit Scope:** Full scientific inventory and validation of all input streams, target integrity, missing data handling, and non-production pipeline smoke testing.  

---

## 1. Upstream Model 1 Verification & Immutability

Before performing any Model 2 operations, the upstream Model 1 artifact was verified:
- **Artifact Path:** `models/model1/model1_random_forest.joblib`
- **SHA-256 Checksum:** `30c22d4c7f69a48149a7f844cef62398566ddc1ed4acf00d9f536e72a68803ea`
- **Conformal Uncertainty Threshold:** $q_{\text{conformal}} = \pm 0.7374^\circ\text{C}$ ($\alpha = 0.10$, 90% confidence)
- **Role in Model 2:** Model 1 serves strictly as an **upstream frozen predictor** (`model1_pred_c`, `model1_lower_c`, `model1_upper_c`, `model1_uncertainty_c`). It is **NOT** a target, and its weights will **NEVER** be updated or overwritten by Model 2.

---

## 2. Multi-Dataset Inventory Across 10 Categories

| Category | Dataset Name & Path | Status | Format | Temporal Coverage | Spatial Coverage | Resolution | Missing Rate | Nature | Usable for Model 2? |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1. Model 1 Output** | `models/model1/model1_random_forest.joblib` | **AVAILABLE** | Joblib Bundle | 72 hours (synced) | $10\text{ km} \times 10\text{ km}$ Lucknow | $1000\text{ m}$ metric | 0.0% | Derived ML | **YES (Upstream Predictor)** |
| **2. AWS Observations**| `data/datasets/tiny/model1/aws_ground_truth_72h.csv` | **PARTIAL** | CSV Table | 2025-07-15 to 2025-07-17 | 5 Stations (Lucknow District) | In-situ point | 0.0% | Real/Observed | **YES (Primary Ground Truth)** |
| **3. Coarse NWP** | `data/datasets/tiny/model1/coarse_nwp_timeseries.npz` | **PARTIAL** | NPZ Array | 72 hourly timesteps | $2 \times 2$ grid (Lucknow) | ~10 km | 0.0% | Model Forcing | **YES (Macro Boundary Cond.)** |
| **4. DEM / Terrain** | `data/datasets/tiny/model1/terrain_features_1km.npz` | **PARTIAL** | NPZ Tensor | Static | $10 \times 10$ metric grid | $1000\text{ m}$ metric | 0.0% | Topographic | **YES (Slope, Aspect, Elev)** |
| **5. Land Cover** | `terrain_features_1km.npz` (`cropland_fraction`) | **PARTIAL** | NPZ Tensor | Static | $10 \times 10$ metric grid | $1000\text{ m}$ metric | 0.0% | Land Cover | **YES (Cropland Fraction)** |
| **6. Satellite LST** | MODIS / Landsat / Sentinel-3 SLSTR | **MISSING** | — | — | — | — | 100% | Remote Sensing | **NO (Fallback Required)** |
| **7. Solar Geometry** | Astronomical Ephemeris Algorithm | **AVAILABLE** | Runtime Math | Continuous | Global / Lucknow | Exact Point | 0.0% | Physical Law | **YES (Dynamic SZA / Elev)** |
| **8. ERA5-Land** | Hourly Reanalysis (Copernicus CDS) | **MISSING** | — | — | — | ~9 km | 100% | Reanalysis | **NO (Required for Prod)** |
| **9. Historical Data**| Causal Lags ($T_{t-1}, T_{t-2}$) | **PARTIAL** | In-memory Lag | Within 72h window | 5 Stations | Hourly | 0.0% | Derived Causal | **YES (Within-pilot only)** |
| **10. Admin Boundaries**| Panchayat / Block GeoJSON | **MISSING** | — | — | — | Vector | 100% | Administrative | **NO (Required for UI/Prod)** |

---

## 3. Detailed Dataset Profiles & Provenance

### Dataset 1: Upstream Model 1 Predictions
- **File Path:** `models/model1/model1_random_forest.joblib`
- **Variables Provided:** `model1_pred_c`, `model1_lower_c`, `model1_upper_c`, `model1_uncertainty_c`
- **Nature:** Derived frozen ML inference.
- **Scientific Role:** Baseline downscaled state. Model 2 must learn residual spatial variability driven by land-surface processes that Model 1 could not resolve.

### Dataset 2: Automatic Weather Station (AWS) Observations
- **File Path:** `data/datasets/tiny/model1/aws_ground_truth_72h.csv`
- **Station Count:** 5 stations (`AWS_LKO_01` Amausi, `AWS_LKO_02` BKT, `AWS_LKO_03` Chinhat, `AWS_LKO_04` Mohanlalganj, `AWS_LKO_05` Malihabad).
- **Record Count:** 360 observations (72 continuous hours per station).
- **Target Variable:** `temperature_c` (Range: $24.08^\circ\text{C}$ to $36.72^\circ\text{C}$, $\mu = 29.84^\circ\text{C}$, $\sigma = 3.65^\circ\text{C}$).
- **Missing / Duplicate Records:** Zero missing cells, zero duplicates.
- **Limitation:** Strictly confined to 3 days in July 2025. **Multi-season observational data is MISSING.**

### Dataset 3: Coarse NWP Atmospheric Forcing
- **File Path:** `data/datasets/tiny/model1/coarse_nwp_timeseries.npz`
- **Variables:** `t2m` ($24.34^\circ\text{C} - 35.72^\circ\text{C}$), `rh2m` ($63.68\% - 87.08\%$), `sp` ($997.42 - 998.52\text{ hPa}$), `precip` ($0.0 - 4.12\text{ mm}$).
- **Dimensions:** $(72, 2, 2)$ grid cells spanning the $10\text{ km} \times 10\text{ km}$ pilot domain.

### Dataset 4 & 5: High-Resolution Terrain & Land Cover
- **File Path:** `data/datasets/tiny/model1/terrain_features_1km.npz`
- **Coordinate Reference System:** `EPSG:32644` (WGS 84 / UTM Zone 44N Metric Projected Grid).
- **Variables:**
  - `elevation`: $109.52\text{ m}$ to $127.41\text{ m}$ ($\mu = 119.82\text{ m}$)
  - `slope`: $0.035^\circ$ to $3.676^\circ$ ($\mu = 1.04^\circ$)
  - `aspect`: $0.090\text{ rad}$ to $6.132\text{ rad}$ ($5.1^\circ$ to $351.3^\circ$)
  - `cropland_fraction`: $0.5376$ to $0.9690$ ($\mu = 0.7712$, representing agricultural plain intensity)
- **Limitation:** Multi-class ESA WorldCover (tree canopy cover, built-up urban fraction, open water) is **MISSING**. In the Model 1 audit, tree canopy shading was identified as the root cause of the coverage drop at Malihabad.

### Dataset 6: Satellite Land Surface Temperature (LST)
- **Status:** **MISSING — REQUIRED FOR FULL MODEL 2 TRAINING**
- **Non-Fabrication Policy:** We have **NOT fabricated** synthetic thermal imagery.
- **Architectural Solution:** Model 2 data loader implements an explicit boolean mask `lst_available: False` and activates a graceful fallback mode (relying on static land cover and Model 1 predictions).

### Dataset 7: Astronomical Solar Geometry
- **Status:** **AVAILABLE VIA PHYSICAL COMPUTATION**
- **Method:** Dynamically computed at prediction time using standard astronomical ephemeris equations:
  $$\cos(\theta_z) = \sin(\phi)\sin(\delta) + \cos(\phi)\cos(\delta)\cos(\omega)$$
  $$\text{Solar Elevation} = 90^\circ - \theta_z$$
- **Variables Provided:** `cos_solar_zenith`, `solar_elevation_deg`, `is_daylight`.
- **Generalization Advantage:** Unlike static `hour_cos`, astronomical solar geometry dynamically shifts with day-of-year ($DOY$) and solar declination ($\delta$), providing seasonal validity across both winter and summer solstices.

### Dataset 8: ERA5-Land Reanalysis
- **Status:** **MISSING — REQUIRED FOR FULL MODEL 2 TRAINING**
- **Clarification:** ERA5-Land is an upstream atmospheric reanalysis product (~9 km), not station ground truth.

---

## 4. Non-Production Pipeline Smoke Test Results

A non-production data pipeline test was executed via [`test_pipeline_smoke.py`](file:///Users/yogayjain/Downloads/kisaankiyash/src/models/model2_temperature_refinement/test_pipeline_smoke.py):

```
======================================================================
🌾 MODEL 2: NON-PRODUCTION DATA PIPELINE SMOKE TEST
======================================================================
[1/5] Verifying Model 1 artifact integrity & checksum...
      [VERIFIED] Model 1 SHA-256 is immutable: 30c22d4c7f69a481...
      [VERIFIED] Model 1 Conformal threshold: ±0.7374°C

[2/5] Loading physical pilot datasets...
      - Terrain 1-km Tensor: (10, 10) (elev, slope, aspect, cropland_fraction)
      - NWP Coarse Tensor:   (72, 2, 2) (t2m, rh2m, sp, precip)
      - AWS In-situ Table:   (360, 12) (360 rows, 5 stations)

[3/5] Building Model 2 multi-source aligned feature matrix...
      - Assembled Shape: (360, 23) (23 columns)
      - Target Variable: 'target_air_temp_c' (Range: 24.08°C to 36.72°C)
      - Upstream Model 1 Pred Range: 24.31°C to 36.35°C

[4/5] Executing Data Quality & Missing Value checks...
      - Total Missing / NaN Values: 0 (0.00%)
      - Duplicate Spatial-Temporal Records: 0
      - LST Missing Flag: Properly set to False with fallback flag enabled (No fabricated LST data).

[5/5] Testing Split Consistency (Leave-One-Station-Out)...
      - Training Split:   216 samples (Stations 1, 2, 3)
      - Validation Split: 72 samples (Station 4: Mohanlalganj)
      - Locked Test Split:72 samples (Station 5: Malihabad Mango Belt)
      [CONFIRMED] Zero training was executed. Pipeline smoke test passed.
======================================================================
```

---

## 5. Exact Summary Block

```
MODEL 2 DATA READINESS
=======================
AWS:
PARTIAL (Pilot 5 stations x 72h available; 1-year archive missing)
NWP:
PARTIAL (Pilot 72h 2x2 grid available; operational reanalysis missing)
MODEL 1 OUTPUT:
AVAILABLE (Verified frozen artifact v1.0.0-pilot)
DEM:
PARTIAL (Pilot 10x10 km 1-km grid available; regional DEM missing)
LAND COVER:
PARTIAL (Cropland fraction available; full WorldCover classes missing)
LST:
MISSING (Graceful missing-data fallback implemented)
ERA5-LAND:
MISSING (Required for Level 1 historical expansion)
SOLAR GEOMETRY:
AVAILABLE (Dynamically computed via astronomical ephemeris)
MULTI-SEASON DATA:
MISSING (Requires multi-month observational collection)
MODEL 2 TRAINING READINESS:
PILOT ONLY
```
