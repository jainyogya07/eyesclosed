# Model 2: High-Resolution Temperature Refinement — Training Report

**Status:** **PILOT VERIFICATION ONLY**  
**Model ID:** `model2_temperature_refinement`  
**Version:** `model2_temperature_refinement_v0.1.0_pilot`  
**Selected Architecture:** `ridge_regularized_linear`  
**Upstream Model 1 Status:** **FROZEN & VERIFIED** (SHA-256: `30c22d4c7f69a48149a7f844cef62398566ddc1ed4acf00d9f536e72a68803ea`)  
**Training Date:** 2026-09-26 16:14:38 UTC  

---

## 1. Candidate Architecture Comparison (Validation Station AWS_LKO_04)

| Candidate Model | MAE (°C) | RMSE (°C) | R² Score | Mean Bias (°C) | Selection Verdict |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Ridge Regularized Linear** | **0.3355** | **0.4276** | **0.9882** | **-0.1028** | **SELECTED (Optimal generalization on 360 samples)** |
| **Random Forest Refiner** | 0.3604 | 0.4507 | 0.9869 | -0.0624 | Slight variance penalty |
| **HistGradientBoosting** | 0.3759 | 0.4641 | 0.9861 | -0.0533 | Overfits small pilot sample |

---

## 2. Benchmark Performance vs. Baselines (Locked Test Station AWS_LKO_05)

| Model Benchmark | Test MAE (°C) | Test RMSE (°C) | Test R² | Test Bias (°C) | Difference vs. Model 1 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Baseline 1: Raw Coarse NWP** | 0.6793 | 0.8385 | 0.9557 | -0.2531 | -0.2710°C |
| **Baseline 3: Frozen Model 1** | 0.4083 | 0.5233 | 0.9827 | -0.0504 | Reference (0.0000°C) |
| **Model 2 Pilot (Ours)** | **0.4113** | **0.5293** | **0.9823** | **-0.0911** | **-0.0030°C (-0.73%)** |

---

## 3. Scientific Finding
Under the current 72-hour pilot dataset in flat alluvial terrain, Model 2 performs **identically/within statistical noise of Model 1** (0.4113°C vs 0.4083°C). The high-resolution terrain and cropland fraction did not demonstrate measurable incremental skill because:
1. Elevation relief is only 3.6m across Lucknow stations (Delta T_topo < 0.024°C).
2. LST is currently missing.
3. Multi-class land cover (tree canopy fraction) is missing.
