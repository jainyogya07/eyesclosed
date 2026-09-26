# Model Card: Model 1 — Hyperlocal Weather Downscaler

## Model Overview
- **Model Name:** `kisaan-downscaler-t2m-1km-rf`
- **Version:** `1.0.0-FROZEN`
- **Model Type:** Topographic Random Forest Regressor with Conformal Uncertainty Calibration
- **Target Variable:** 2-Meter Ambient Air Temperature (`temperature_c`)
- **Spatial Resolution:** 1 km x 1 km ($1000\mathrm{ m} \times 1000\mathrm{ m}$ cells)
- **Spatial CRS:** `EPSG:32644` (UTM Zone 44N)
- **Release Date:** 2026-09-26
- **Maintainers:** Kisaan Ki Yash ML & Climate Intelligence Team

## Intended Use
- Downscaling coarse Numerical Weather Prediction (NWP / NCMRWF / ERA5-Land ~12–25 km) to field-level 1-km grids for agricultural advisory systems.
- Driving downstream models: Pest & Disease Outbreak Risk (Model 2), Evapotranspiration & Irrigation Scheduling (Model 6), and Heat Stress Intelligence (Model 9).

## Inputs & Predictors
1. `coarse_t2m`: Coarse NWP 2m Temperature (°C)
2. `coarse_rh`: Coarse NWP 2m Relative Humidity (%)
3. `elevation_m`: Copernicus GLO-30 Digital Elevation Model resampled to 1-km metric grid (m)
4. `slope_deg`: Topographic terrain slope derived from 1-km DEM (degrees)
5. `aspect_sin`: Sine of terrain aspect angle ($\sin(\mathrm{rad})$)
6. `aspect_cos`: Cosine of terrain aspect angle ($\cos(\mathrm{rad})$)
7. `hour_sin`: Sine cyclical diurnal component ($\sin(2\pi h / 24)$)
8. `hour_cos`: Cosine cyclical diurnal component ($\cos(2\pi h / 24)$)

## Independent Benchmark Performance (Station AWS_LKO_05: Malihabad Mango Belt)
- **MAE:** 0.4083°C (vs. 0.6793°C Raw NWP -> **39.9% Error Reduction**)
- **RMSE:** 0.5233°C (vs. 0.8385°C Raw NWP -> **37.6% Error Reduction**)
- **R²:** 0.9827
- **Conformal Residual Threshold ($q_{conformal}$):** $\pm 0.7374^\circ\mathrm{C}$
- **Empirical Coverage (PICP, $\alpha=0.10$):** 80.6%

## Limitations & Non-Intended Use
- NOT calibrated for complex mountainous terrain (Himalayan or Western Ghats regions) without local retraining.
- NOT designed for hurricane/cyclonic landfall dynamics without extreme event ensemble assimilation.
- Requires valid coarse NWP atmospheric fields; cannot extrapolate in the absence of numerical boundary conditions.
