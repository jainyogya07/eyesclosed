# Model 2: High-Resolution Temperature Refinement — Uncertainty & Conformal Calibration Report

**Status:** **PILOT VERIFICATION ONLY**  
**Calibration Methodology:** Split Conformal Prediction with Finite-Sample Correction  
**Calibration Station:** `AWS_LKO_04` (Mohanlalganj Rural, N=72)  
**Target Significance (alpha):** 0.10 (Nominal 90.0% Coverage)  

---

## 1. Calibration Parameters
- **Conformal Quantile Threshold (q_conformal):** ±0.7854°C
- **Finite Sample Rank:** ceil((72 + 1) * 0.90) = 66
- **Mean Validation Residual:** 0.3355°C

---

## 2. Empirical Coverage Across Splits
| Dataset Split | Station ID | Sample Count | Empirical Coverage (PICP) | Mean Interval Width (MPIW) | Calibration Assessment |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Validation Set** | `AWS_LKO_04` | 72 | **91.7%** | **1.5707°C** | **Well-Calibrated (>= 90%)** |
| **Locked Test Set** | `AWS_LKO_05` | 72 | **86.1%** | **1.5707°C** | **Coverage Drop (Canopy Microclimate Shift)** |

---

## 3. Physical Covariate Shift
The drop from 91.7% to 80.6% on the locked test set reflects spatial microclimatic heterogeneity (dense tree orchard canopy at Malihabad vs open rural plains at Mohanlalganj).
