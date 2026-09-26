# Model Card: Model 3 — Precipitation Downscaling Pilot v0.1.0

## Model Details
- **Model ID:** `M3_PRECIPITATION_DOWNSCALING_PILOT`
- **Model Version:** `model3_precipitation_downscaling_v0.1.0_pilot`
- **Release Date:** September 2026
- **Architecture:** Two-Stage Hurdle (Logistic Regression Occurrence + Regularized Ridge Conditional Intensity)
- **Primary Target:** AWS Rain Gauge `rainfall_mm` (mm/hour)
- **Status:** PILOT RESEARCH ONLY (NOT FOR OPERATIONAL MONSOON DEPLOYMENT)

## Intended Use
- Spatiotemporal precipitation downscaling from coarse NWP grid to localized 1-km station footprint.
- Proof of concept for two-stage hurdle modeling on zero-inflated rainfall.

## Upstream Dependencies
- **Model 1 (Hyperlocal Weather Downscaling):** Checksum verified: `30c22d4c7f69a48149a7f844cef62398566ddc1ed4acf00d9f536e72a68803ea`
- **Model 2 (High-Resolution Temperature Refinement):** Checksum verified: `a471a59a58df354d7c5fb6942604c5b1a5b7a48806fb5d1fa5d5b7237390e3e8`

## Limitations & Caveats
1. **Pilot Data Only:** 360 hourly samples (July 15–17, 2025).
2. **Extreme Rainfall:** 0 events $>15$ mm/h. Extreme event forecasting skill is NOT measurable.
3. **Small Positive Sample:** Locked test contains only 8 rainy hours; validation contains 9 rainy hours. Contingency metrics are descriptive pilot estimates.
