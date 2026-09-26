# Model 3: Precipitation Downscaling — Comprehensive Dataset Inventory Report

**Audit Date:** 2026-09-26  
**Auditor:** Principal ML Engineer & Geospatial Climate Scientist  
**Model 3 Target:** 1-km Hyperlocal Precipitation Estimation ($1000\text{ m} \times 1000\text{ m}$ Grid, `EPSG:32644`)  
**Frozen Upstream Dependencies:**
- **Model 1:** `models/model1/model1_random_forest.joblib` (SHA-256: `30c22d4c7f69a48149a7f844cef62398566ddc1ed4acf00d9f536e72a68803ea` — **VERIFIED & UNCHANGED**)
- **Model 2:** `models/model2/model2_pilot.joblib` (SHA-256: `a471a59a58df354d7c5fb6942604c5b1a5b7a48806fb5d1fa5d5b7237390e3e8` — **VERIFIED & UNCHANGED**)

---

## 1. Inventory of Precipitation Datasets in Repository

A complete recursive scan was performed across the entire repository for all tabular, raster, and tensor formats (`.csv`, `.nc`, `.grib`, `.tif`, `.npz`, `.parquet`, `.zarr`, `.json`, `.geojson`).

| Dataset Description | Exact File Path | Format | Nature | Variables | Units | Temporal Coverage | Resolution | Missing Rate |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **AWS Rain Gauge Observations** | `data/datasets/tiny/model1/aws_ground_truth_72h.csv` | CSV | **Real In-Situ** | `rainfall_mm` | mm/hour | 2025-07-15 to 2025-07-17 | Discrete station point | **0.00%** |
| **Coarse NWP Precipitation** | `data/datasets/tiny/model1/coarse_nwp_timeseries.npz` | NPZ | **Macro NWP** | `precip` | mm/hour (grid mean) | 72 hourly timesteps | ~10 km ($2 \times 2$ grid) | **0.00%** |
| **High-Res Terrain Tensor** | `data/datasets/tiny/model1/terrain_features_1km.npz` | NPZ | **Topographic** | `elevation`, `slope`, `aspect` | m, deg, rad | Static | $1000\text{ m}$ metric grid | **0.00%** |
| **Satellite GPM IMERG** | None found | None | **Satellite** | `precipitationCal` | mm/hour | — | 0.1° (~10 km) | **100% (MISSING)** |
| **ERA5-Land Total Precip** | None found | None | **Reanalysis**| `tp` | m / hour | — | 0.1° (~9 km) | **100% (MISSING)** |
| **DWR Radar Reflectivity** | None found | None | **Radar** | $Z$ (dBZ), Rain Rate | mm/hour | — | 250m–1km polar | **100% (MISSING)** |

---

## 2. Primary Ground Truth Target Audit

### Target Variable: `rainfall_mm` (AWS Rain Gauge)
- **Hierarchy Rank:** **1 (Highest Quality In-Situ Ground Observation)**.
- **Physical Sensor:** Tipping-bucket rain gauge with $0.1\text{ mm}$ resolution.
- **Sample Count:** 360 observations across 5 meteorological stations in Lucknow district.
- **Temporal Duration:** 72 continuous hours (July 15–17, 2025).
- **Physical Bounds Check:**
  - Minimum: $0.0000\text{ mm}$ (no negative rain artifacts).
  - Maximum: $13.4100\text{ mm/h}$ (physically realistic moderate/heavy convective shower).
  - Mean: $0.5747\text{ mm/h}$, Standard Deviation: $1.9130\text{ mm/h}$.
- **Zero-Rain Inflation:**
  - Dry Hours ($= 0.0\text{ mm}$): **309 / 360 (85.83%)**
  - Rainy Hours ($> 0.0\text{ mm}$): **51 / 360 (14.17%)**
  - Measurable Rain ($\ge 0.1\text{ mm}$): **51 / 360 (14.17%)**

### Station-Level Precipitation Distribution
| Station ID | Station Name | Rainy Hours ($>0\text{mm}$) | Dry Hours ($0\text{mm}$) | Rain Frequency (%) | Max Intensity (mm/h) | Total 72h Accumulation (mm) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`AWS_LKO_01`** | Amausi Airport | 7 | 65 | 9.7% | 13.17 mm/h | 40.45 mm |
| **`AWS_LKO_02`** | Bakshi Ka Talab | 13 | 59 | 18.1% | 12.49 mm/h | 48.61 mm |
| **`AWS_LKO_03`** | Chinhat Agri Block | 14 | 58 | 19.4% | 12.66 mm/h | 55.18 mm |
| **`AWS_LKO_04`** | Mohanlalganj Rural | 9 | 63 | 12.5% | 13.41 mm/h | 42.15 mm |
| **`AWS_LKO_05`** | Malihabad Mango Belt | 8 | 64 | 11.1% | 4.80 mm/h | 20.51 mm |

---

## 3. Coarse NWP Atmospheric Precipitation Audit

### Predictor Variable: `precip` (`coarse_nwp_timeseries.npz`)
- **Dimensions:** $(72\text{ hours}, 2\text{ y-cells}, 2\text{ x-cells})$ spanning $10\text{ km} \times 10\text{ km}$.
- **Zero-Rain Fraction:** **61.81%**
- **Intensity Range:** $0.0000\text{ mm/h}$ to $4.1183\text{ mm/h}$ ($\mu = 0.4393\text{ mm/h}$).
- **Percentiles:** $P_{50} = 0.0000\text{ mm}$, $P_{90} = 1.5791\text{ mm}$, $P_{95} = 2.1335\text{ mm}$.

### The Areal Smoothing Effect (NWP vs. Gauge Physics):
Notice the profound physical discrepancy between coarse NWP and in-situ gauge records:
1. **Peak Intensity Truncation:** NWP max is **$4.12\text{ mm/h}$**, whereas AWS gauge max is **$13.41\text{ mm/h}$** (a $3.25\times$ difference!).
2. **Frequency Smearing:** NWP predicts rain in $38.19\%$ of grid cells, whereas AWS gauges detect rain in only $14.17\%$ of hours.
- *Physical Cause:* A coarse $10\text{ km} \times 10\text{ km}$ numerical model cell covers $100\text{ km}^2$. Localized convective rain shafts ($1 - 3\text{ km}$ diameter) are averaged over the entire cell, smearing out peak intensities and artificially inflating wet area coverage.
- *Downscaling Goal for Model 3:* Recover sub-grid spatial heterogeneity and peak convective amounts from spatially smeared coarse NWP forcing.

---

## 4. Missing Datasets Summary
1. **GPM IMERG Final Run v07:** Missing from repository. (Required as auxiliary multi-satellite cross-check).
2. **ERA5-Land Hourly Precipitation (`tp`):** Missing from repository.
3. **IMD Gridded Daily Rainfall (0.25°):** Missing from repository.
4. **Multi-Season / Extreme Weather Archive:** Missing (pilot contains zero cloudburst $>25\text{ mm/h}$ or tropical depression events).
