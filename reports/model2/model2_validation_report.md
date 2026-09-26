# Model 2: High-Resolution Temperature Refinement — Validation Report

**Status:** **PILOT VERIFICATION ONLY**  
**Validation Station:** `AWS_LKO_04` (Mohanlalganj Rural)  
**Sample Count:** 72 continuous hourly observations  

---

## 1. Performance Summary
- **MAE:** 0.3355°C
- **RMSE:** 0.4276°C
- **R² Score:** 0.9882
- **Mean Bias:** -0.1028°C
- **Pearson Correlation:** 0.9945

---

## 2. Temporal Holdout Validation (First 48h vs. Last 24h)
- **Training Samples (Hours 0–47):** 192
- **Validation Samples (Hours 48–71):** 96
- **Temporal Test MAE:** 0.1821°C (vs. Raw NWP 0.5598°C and Model 1 0.1743°C)
- **Temporal Limitation:** While stable over 72 hours, seasonal generalization cannot be established.
