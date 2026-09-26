# Model 3: Feature Importance Analysis

## Ranked Features (Occurrence Classifier vs Conditional Intensity)
| Rank | Feature | Occurrence Coefficient (Logit) | Intensity Coefficient (Ridge) | Physical Role |
| :---: | :--- | :---: | :---: | :--- |
| 1 | `rolling_3h_rainfall` | -0.2055 | +0.0581 | Causal Predictor |
| 2 | `rainfall_lag_1h` | -0.1891 | +0.1315 | Causal Predictor |
| 3 | `coarse_t2m` | +0.1784 | -0.0772 | Causal Predictor |
| 4 | `slope_deg` | +0.1486 | -0.0325 | Causal Predictor |
| 5 | `model1_pred_c` | -0.1335 | +0.0063 | Causal Predictor |
| 6 | `coarse_precip` | +0.1139 | +0.0591 | Causal Predictor |
| 7 | `aspect_cos` | +0.0987 | -0.0305 | Causal Predictor |
| 8 | `rolling_6h_rainfall` | +0.0834 | -0.0203 | Causal Predictor |
| 9 | `coarse_sp` | -0.0794 | -0.0431 | Causal Predictor |
| 10 | `aspect_sin` | -0.0791 | +0.0280 | Causal Predictor |
| 11 | `cropland_fraction` | +0.0683 | -0.0265 | Causal Predictor |
| 12 | `rainfall_lag_2h` | +0.0661 | +0.0247 | Causal Predictor |
| 13 | `elevation_m` | -0.0228 | -0.0108 | Causal Predictor |
| 14 | `coarse_rh` | +0.0163 | +0.0501 | Causal Predictor |
