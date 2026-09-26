# Model 3: Precipitation Downscaling — Training Report
**Model Version:** `model3_precipitation_downscaling_v0.1.0_pilot`  
**Model ID:** `M3_PRECIPITATION_DOWNSCALING_PILOT`  
**Upstream Model 1 SHA-256:** `30c22d4c7f69a48149a7f844cef62398566ddc1ed4acf00d9f536e72a68803ea` (FROZEN & VERIFIED)  
**Upstream Model 2 SHA-256:** `a471a59a58df354d7c5fb6942604c5b1a5b7a48806fb5d1fa5d5b7237390e3e8` (FROZEN & VERIFIED)  
**Training Status:** PILOT v0.1.0 COMPLETED — DESCRIPTIVE PILOT METRICS ONLY  

---

## 1. Dataset & Split Summary
- **Total Observations:** 360 (5 stations × 72 hours)
- **Train Split (AWS_LKO_01, 02, 03):** 216 samples (34 rainy, 182 dry)
- **Validation Split (AWS_LKO_04):** 72 samples (9 rainy, 63 dry)
- **Locked Test Split (AWS_LKO_05):** 72 samples (8 rainy, 64 dry)
- **Total Independent Contiguous Storm Events:** 44
- **Extreme Events (>15 mm/h):** 0 (NOT AVAILABLE in current pilot)

---

## 2. Model Architecture
- **Stage 1 (Occurrence Classifier):** Class-weighted regularized Logistic Regression predicting $P(\text{rain} \ge 0.1\text{ mm/h} \mid X)$.
- **Stage 2 (Conditional Intensity Regressor):** Regularized Ridge regressor trained strictly on positive observations (rain $\ge 0.1$ mm/h) using $\ln(1 + y)$ target.
- **Combination:** $\widehat{R}_{\text{expected}} = P(\text{rain} \ge 0.1 \mid X) \times \max(0, \exp(\widehat{y}_{\text{cond}}) - 1)$.
- **Validation-Tuned Occurrence Threshold:** 0.175

---

## 3. Comparative Performance Summary

### A. Validation Set (AWS_LKO_04 — 72 hours, 9 rainy hours)
| Model | MAE (mm/h) | RMSE (mm/h) | Bias (mm/h) | Corr | POD* | FAR* | CSI* | F1* |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Raw Coarse NWP** | 0.9391 | 2.2847 | -0.1487 | -0.0864 | 0.333 | 0.880 | 0.097 | 0.176 |
| **Persistence (lag_1h)** | 1.1311 | 3.0268 | -0.0000 | -0.0524 | 0.111 | 0.889 | 0.059 | 0.111 |
| **Occurrence-Only (Mean Pos)** | 3.1706 | 3.7293 | 2.5963 | 0.0731 | 0.889 | 0.852 | 0.145 | 0.254 |
| **Two-Stage Hurdle (Expected: P*I)** | 1.1608 | 2.1155 | 0.1571 | -0.0999 | - | - | - | - |
| **Two-Stage Hurdle (Gated: I(P>=tau)*I)** | 2.7683 | 3.3295 | 2.0871 | 0.0423 | 0.889 | 0.852 | 0.145 | 0.254 |

\*\*Contingency metrics are pilot descriptive estimates with high sampling uncertainty due to only 9 validation rain events.*

### B. Locked Test Set (AWS_LKO_05 — 72 hours, 8 rainy hours)
| Model | MAE (mm/h) | RMSE (mm/h) | Bias (mm/h) | Corr | POD* | FAR* | CSI* | F1* |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Raw Coarse NWP** | 0.5909 | 1.1438 | 0.1519 | 0.1282 | 0.625 | 0.800 | 0.179 | 0.303 |
| **Persistence (lag_1h)** | 0.3953 | 1.0951 | -0.0000 | 0.3313 | 0.250 | 0.750 | 0.143 | 0.250 |
| **Occurrence-Only (Mean Pos)** | 0.5205 | 1.4063 | -0.0492 | -0.0730 | 0.000 | 1.000 | 0.000 | 0.000 |
| **Two-Stage Hurdle (Expected: P*I)** | 0.7535 | 0.9725 | 0.3228 | 0.2766 | - | - | - | - |
| **Two-Stage Hurdle (Gated: I(P>=tau)*I)** | 0.5477 | 1.4930 | -0.0220 | -0.0727 | 0.000 | 1.000 | 0.000 | 0.000 |

\*\*Contingency metrics are pilot descriptive estimates with high sampling uncertainty due to only 8 test rain events.*
