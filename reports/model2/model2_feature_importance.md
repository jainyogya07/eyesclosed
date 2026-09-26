# Model 2: High-Resolution Temperature Refinement — Feature Importance Report

**Status:** **PILOT VERIFICATION ONLY**  
**Method:** Permutation Feature Importance (10 repeats on validation set)  

---

## 1. Permutation Importance Ranking

| Rank | Feature Name | Mean Importance (Delta MAE) | Standard Deviation | Interpretation |
| :--- | :--- | :--- | :--- | :--- |
| 1 | `model1_pred_c` | **+4.142770** | 0.218790 | Refinement Predictor |
| 2 | `solar_elevation_deg` | **+0.000050** | 0.001030 | Refinement Predictor |
| 3 | `elevation_m` | **+0.000000** | 0.000000 | Refinement Predictor |
| 4 | `slope_deg` | **+0.000000** | 0.000000 | Refinement Predictor |
| 5 | `aspect_sin` | **+0.000000** | 0.000000 | Refinement Predictor |
| 6 | `aspect_cos` | **+0.000000** | 0.000000 | Refinement Predictor |
| 7 | `cropland_fraction` | **+0.000000** | 0.000000 | Refinement Predictor |
| 8 | `cos_solar_zenith` | **-0.000130** | 0.000720 | Refinement Predictor |
| 9 | `is_daylight` | **-0.000440** | 0.000500 | Refinement Predictor |

---

## 2. Interpretation
`model1_pred_c` dominates permutation importance completely. The auxiliary land-surface features (`cropland_fraction`, `elevation_m`, `slope_deg`, `cos_solar_zenith`) contribute near-zero incremental permutation error because the underlying physical dataset in Lucknow lacks topographical elevation gradients (Delta z < 3.6m) and multi-class canopy vegetation classifications.
