# Model 2: High-Resolution Temperature Refinement — Error Analysis

**Status:** **PILOT VERIFICATION ONLY**  
**Locked Test Station:** `AWS_LKO_05` (Malihabad Mango Belt)  
**Sample Count:** 72 hourly observations  

---

## 1. Residual Diagnostics
- **Mean Absolute Error:** 0.4113°C
- **Root Mean Squared Error:** 0.5293°C
- **Mean Bias Error:** -0.0911°C
- **Residual Standard Deviation:** 0.5213°C
- **Max Positive Residual (Overestimate):** +1.7222°C
- **Max Negative Residual (Underestimate):** -1.0152°C

---

## 2. Root Cause Analysis of Malihabad Residuals
Just as observed in the Model 1 audit, residuals peak during morning transition hours (06:00 - 12:00 UTC) because Malihabad is a dense perennial fruit tree orchard microclimate. Because satellite LST and multi-class tree canopy fractions are absent in this Level 0 pilot, Model 2 cannot resolve the canopy shading delay. Real ESA WorldCover tree canopy fractions and MODIS LST are required to resolve this microclimate divergence.
