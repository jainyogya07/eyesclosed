# Model 1: Hyperlocal Weather Downscaling — In-Depth Error Analysis

**Analysis Scope:** Residual diagnostics across diurnal cycles, temperature regimes, and microclimates.  
**Station Evaluated:** `AWS_LKO_05` (Malihabad Mango Belt)  
**Sample Count:** 72 hourly observations  

---

## 1. Diurnal Cycle Error Breakdown

| Diurnal Phase | Time Window (UTC) | Sample Count | MAE (°C) | Mean Bias (°C) | Analysis |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Night** | 00:00 - 06:00 | 18 | 0.3721 | -0.0860 | Excellent nocturnal boundary layer capture. |
| **Morning** | 06:00 - 12:00 | 18 | 0.5106 | +0.1187 | Moderate heating phase slope sensitivity. |
| **Afternoon** | 12:00 - 18:00 | 18 | 0.4293 | +0.0143 | Peak solar radiation regime; minor canopy buffering. |
| **Evening** | 18:00 - 24:00 | 18 | 0.3211 | +0.1547 | Radiative cooling transition. |

---

## 2. Temperature Regime Performance

| Regime | Range (°C) | Observations | MAE (°C) | Bias (°C) | Performance Assessment |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Cool Regimes** | < 28.0°C | 26 | 0.3914 | +0.0036 | High precision during high-humidity night conditions. |
| **Moderate Regimes** | 28.0°C - 32.0°C | 17 | 0.3026 | +0.0226 | Dominant operating band; steady error profile. |
| **Extreme Heat** | > 32.0°C | 29 | 0.4854 | +0.1087 | Peak afternoon thermal advection. |

---

## 3. Residual Distribution Characteristics

- **Mean Error (Bias):** +0.0504°C
- **Standard Deviation of Residuals:** 0.5209°C
- **Maximum Overestimation ($y_{pred} - y_{true}$):** +1.6819°C
- **Maximum Underestimation ($y_{pred} - y_{true}$):** -1.0513°C
- **95th Percentile Absolute Error:** 0.8693°C

---

## 4. Out-of-Distribution (OOD) & Abstention Boundaries

Model 1 flags inputs as **OOD / LOW_CONFIDENCE** under the following bounds:
1. Coarse Temperature $T_{coarse} < 5^\circ\mathrm{C}$ or $T_{coarse} > 50^\circ\mathrm{C}$
2. Coarse Relative Humidity $RH < 5\%$ or $RH > 100\%$
3. Grid Elevation $z < 50\mathrm{ m}$ or $z > 400\mathrm{ m}$ (Gangetic Plain domain limits)
4. Prediction Interval Width $MPIW > 3.0^\circ\mathrm{C}$ (indicates abnormal uncertainty)
