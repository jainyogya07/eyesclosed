# Model 1: Hyperlocal Weather Downscaling — Feature Importance & Ablation

**Model:** Topographic Random Forest (100 Trees, EPSG:32644 1-km Grid)  

---

## 1. Feature Importance (MDI / Gini Impurity Reduction)

| Rank | Feature Name | Description | Importance Share |
| :--- | :--- | :--- | :--- |
| 1 | `hour_cos` | Topographic / Atmospheric Predictor | **90.07%** |
| 2 | `coarse_t2m` | Topographic / Atmospheric Predictor | **9.32%** |
| 3 | `coarse_rh` | Topographic / Atmospheric Predictor | **0.36%** |
| 4 | `hour_sin` | Topographic / Atmospheric Predictor | **0.12%** |
| 5 | `slope_deg` | Topographic / Atmospheric Predictor | **0.05%** |
| 6 | `aspect_sin` | Topographic / Atmospheric Predictor | **0.03%** |
| 7 | `aspect_cos` | Topographic / Atmospheric Predictor | **0.03%** |
| 8 | `elevation_m` | Topographic / Atmospheric Predictor | **0.02%** |

---

## 2. Incremental Skill Ablation Table

Testing the scientific hypothesis: *Does high-resolution topographic and diurnal forcing provide statistically verifiable skill gain over coarse NWP alone?*

| Experiment Stage | Features Included | Validation MAE (°C) | Validation RMSE (°C) | Validation R² | Incremental Benefit |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Stage 1 (Coarse Only)** | `coarse_t2m`, `coarse_rh` | 0.5588 | 0.7076 | 0.9677 | Baseline reference |
| **Stage 2 (+ Terrain)** | + `elevation`, `slope`, `aspect` | 0.5582 | 0.6919 | 0.9691 | Local lapse rate & radiation capture |
| **Stage 3 (+ Diurnal)** | + `sin(hour)`, `cos(hour)` | 0.3324 | 0.4178 | 0.9887 | **Diurnal cycle micro-alignment (+40.2% gain)** |
