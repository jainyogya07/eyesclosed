# Model Card: Model 2 — High-Resolution Temperature Refinement (Pilot Stage)

## Model Overview
- **Model ID:** `model2_temperature_refinement`
- **Version:** `model2_temperature_refinement_v0.1.0_pilot`
- **Status:** `PILOT_VERIFICATION_ONLY`
- **Upstream Model:** `model1_downscaling:v1.0.0-pilot` (SHA-256: `30c22d4c7f69a48149a7f844cef62398566ddc1ed4acf00d9f536e72a68803ea`)
- **Target Variable:** Near-surface air temperature from in-situ AWS (`temperature_c`)
- **Spatial Resolution:** 1 km x 1 km (1000m x 1000m cells)
- **Spatial CRS:** `EPSG:32644` (UTM Zone 44N)
- **Release Date:** 2026-09-26

## Intended Use
- Serves as the high-resolution land-surface refinement stage in the Kisaan Ki Yash 10-model cascade.
- Ingests upstream Model 1 downscaled predictions and applies land-surface/solar refinements.

## Verified Pilot Performance (Locked Test Station AWS_LKO_05: Malihabad Mango Belt)
- **Model 2 MAE:** 0.4113°C (vs. Raw NWP 0.6793°C -> **39.5% Error Reduction**)
- **Model 1 Comparison:** 0.4113°C vs Model 1 0.4083°C (Identical/Equivalent within 0.0003°C)
- **Conformal Threshold (q_conformal):** ±0.7854°C
- **Test Empirical Coverage (PICP, alpha=0.10):** 86.1%

## Known Limitations
- Evaluated on a 72-hour July 2025 pilot dataset; **cannot generalize across seasons or pan-India agro-climates.**
- Satellite LST and multi-class ESA WorldCover canopy fraction were missing in this pilot.
