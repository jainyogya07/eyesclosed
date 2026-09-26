# Model 3: Precipitation Downscaling — Data Readiness Audit Report

**Audit Date:** 2026-09-26  
**Auditor:** Principal ML Engineer & Geospatial Climate Scientist  
**Model 3 Target:** Hyperlocal Precipitation Downscaling ($1000\text{ m} \times 1000\text{ m}$ Grid, `EPSG:32644`)  
**Data Sufficiency Verdict:** **`PILOT ONLY — LIMITED DATA`**  
**Training Executed:** **`NONE`** *(Zero training performed)*  

---

## 1. Upstream Model Verification & Immutability Check

Both upstream models were audited for file presence, loadability, and SHA-256 cryptographic hashes:

| Upstream Model | File Path | SHA-256 Checksum | Model Version | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Model 1** | `models/model1/model1_random_forest.joblib` | `30c22d4c7f69a48149a7f844cef62398566ddc1ed4acf00d9f536e72a68803ea` | `v1.0.0-pilot` | **VERIFIED & UNCHANGED** |
| **Model 2** | `models/model2/model2_pilot.joblib` | `a471a59a58df354d7c5fb6942604c5b1a5b7a48806fb5d1fa5d5b7237390e3e8` | `model2_temperature_refinement_v0.1.0_pilot` | **VERIFIED & UNCHANGED** |

*Rule Enforcement:* Neither Model 1 nor Model 2 has been retrained, overwritten, or modified.

---

## 2. Primary Ground Truth Target Audit

- **Primary Observational Target:** In-situ AWS tipping-bucket rain gauge (`rainfall_mm` in `data/datasets/tiny/model1/aws_ground_truth_72h.csv`).
- **Target Integrity:** Gauge records are independent ground measurements, not satellite or reanalysis estimates.
- **Physical Bounds:** $\min = 0.0000\text{ mm}$, $\max = 13.4100\text{ mm/h}$, $\mu = 0.5747\text{ mm/h}$, $\sigma = 1.9130\text{ mm/h}$.
- **Zero Values:** Exactly $0\text{ negative or invalid values}$.

---

## 3. Precipitation Event Distribution Audit

Precipitation is heavily zero-inflated and non-Gaussian:

| Metric | All Observations ($N=360$) | Conditional on Rain ($N=51$) | WMO Meteorological Classification |
| :--- | :--- | :--- | :--- |
| **Dry Hours ($0.0\text{ mm}$)** | **309 (85.83%)** | — | Non-rainy background state |
| **Rainy Hours ($>0.0\text{ mm}$)** | **51 (14.17%)** | **51 (100.0%)** | Active precipitation events |
| **Measurable Rain ($\ge 0.1\text{ mm}$)**| **51 (14.17%)** | **51 (100.0%)** | Tipping-bucket detection threshold |
| **Median ($P_{50}$)** | **0.0000 mm/h** | **2.8100 mm/h** | Typical convective shower |
| **75th Percentile ($P_{75}$)** | **0.0000 mm/h** | **5.7900 mm/h** | Moderate rain shower |
| **90th Percentile ($P_{90}$)** | **1.9750 mm/h** | **9.4800 mm/h** | Intense shower core |
| **95th Percentile ($P_{95}$)** | **3.9125 mm/h** | **12.5750 mm/h** | Heavy convective band |
| **Maximum Observed Intensity** | **13.4100 mm/h** | **13.4100 mm/h** | Peak convective downpour |

### Event Breakdown by IMD Rainfall Intensity Categories:
1. **Light Rain ($< 2.5\text{ mm/h}$):** **22 hours** (43.1% of rain events)
2. **Moderate Rain ($2.5 - 7.5\text{ mm/h}$):** **19 hours** (37.3% of rain events)
3. **Heavy Rain ($7.5 - 15.0\text{ mm/h}$):** **10 hours** (19.6% of rain events)
4. **Extreme Rain ($> 15.0\text{ mm/h}$ / Very Heavy):** **0 hours (0.0%)**

> **Critical Event Limitation:** The pilot dataset contains **ZERO extreme cloudburst or torrential rainfall events ($> 15\text{ mm/h}$)**. Model 3 cannot learn extreme flood risk downscaling from this dataset alone.

---

## 4. Spatial Partitioning & Rain Event Distribution Across Splits

Preserving the strict **Leave-One-Station-Out** spatial holdout:

| Split Designation | Station ID & Name | Total Hours | Rainy Hours ($>0\text{ mm}$) | Dry Hours ($0\text{ mm}$) | Max Rainfall (mm/h) | Total Accumulation (mm) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Training Set** | `AWS_LKO_01` (Amausi Airport) | 72 | 7 (9.7%) | 65 | 13.17 mm/h | 40.45 mm |
| **Training Set** | `AWS_LKO_02` (Bakshi Ka Talab) | 72 | 13 (18.1%) | 59 | 12.49 mm/h | 48.61 mm |
| **Training Set** | `AWS_LKO_03` (Chinhat Agri Block)| 72 | 14 (19.4%) | 58 | 12.66 mm/h | 55.18 mm |
| **Subtotal (Train)** | **3 Stations** | **216** | **34 (15.7%)** | **182** | **13.17 mm/h** | **144.24 mm** |
| **Validation Set** | `AWS_LKO_04` (Mohanlalganj Rural) | **72** | **9 (12.5%)** | **63** | **13.41 mm/h** | **42.15 mm** |
| **Locked Test Set** | `AWS_LKO_05` (Malihabad Mango Belt)| **72** | **8 (11.1%)** | **64** | **4.80 mm/h** | **20.51 mm** |

### Statistical Sparsity Risk:
- The validation station has **only 9 rainy hours**.
- The locked test station has **only 8 rainy hours** (with maximum rain capped at only $4.80\text{ mm/h}$).
- *Scientific Risk:* In an 8-event test set, a single classification mismatch (e.g. 1 false alarm or 1 missed detection) alters the POD (Probability of Detection) or FAR (False Alarm Rate) by **12.5 percentage points**!
- *Conclusion:* Statistically reliable verification of contingency metrics (CSI, POD, FAR, ETS) requires $\ge 200$ independent rain events.

---

## 5. Coarse NWP Precipitation & The Areal Smoothing Effect

| Dimension | Coarse NWP (`precip`) | In-Situ AWS Gauge (`rainfall_mm`) | Physical Discrepancy |
| :--- | :--- | :--- | :--- |
| **Spatial Resolution** | ~10 km ($100\text{ km}^2$ grid cell) | Point ($0.05\text{ m}^2$ orifice) | $2 \times 10^9$ area ratio |
| **Maximum Rate** | **4.1183 mm/h** | **13.4100 mm/h** | **3.25x peak attenuation in NWP** |
| **Zero-Rain Fraction** | **61.81%** | **85.83%** | **NWP overpredicts wet-area frequency by 24%** |
| **Mean Rainfall** | $0.4393\text{ mm/h}$ | $0.5747\text{ mm/h}$ | Comparable regional water balance |

**Key Downscaling Insight:** Coarse NWP models average convective updrafts across $100\text{ km}^2$, artificially smearing out localized rain cells. Model 3's objective is to reconstruct localized intense rain cells from smeared areal NWP inputs using terrain and thermodynamic triggers.

---

## 6. Satellite & Auxiliary Data Availability

- **GPM IMERG v07 (Early / Late / Final):** **MISSING**. No satellite precipitation grids currently reside in the workspace.
- **ERA5-Land Total Precipitation (`tp`):** **MISSING**.
- **Doppler Weather Radar (DWR) Reflectivity ($Z$):** **MISSING**.

---

## 7. Recommended Model 3 Architecture: Two-Stage Hurdle / Cascade

Because precipitation is $85.8\%$ zero-inflated, standard single-stage regression (e.g. plain MSE Random Forest) suffers from severe attenuation bias (predicting persistent drizzle $0.5 - 1.5\text{ mm}$ everywhere and missing zeroes and peaks).

The recommended scientific architecture for Model 3 is a **Two-Stage Hurdle Framework**:

```
                       Coarse NWP Atmospheric Forcing
                       (Precip, T2m, RH, SP) + Terrain
                                     │
                     ┌───────────────┴───────────────┐
                     ↓                               ↓
         [Stage 1: Rain Occurrence]      [Stage 2: Intensity Core]
            Binary Classifier               Conditional Regressor
          P(Rain >= 0.1mm | X)             E[ln(Rain) | Rain, X]
         (Calibrated Probability)          (Heavy-Tailed Amount)
                     │                               │
                     └───────────────┬───────────────┘
                                     ↓
                    Combined Probabilistic Output:
            Rain Amount = P(Rain >= 0.1) * exp(ln_pred)
```

---

## 8. Leakage & Quality Audit
- **Timestamp Alignment:** Explicit timestamp join verified. Zero temporal misalignment.
- **Row-Order Dependency:** Completely eliminated.
- **Future Leakage:** Zero future observations used.
- **Missing / Duplicate Data:** Zero missing cells ($0.00\%$), zero duplicates.
- **Data Quality:** Gauge readings are physically consistent with Indian summer monsoon thermodynamics.

---

## 9. Data Sufficiency Decision

### **DECISION: `PILOT ONLY — LIMITED DATA`**

- **Ground Truth In-Situ Gauge:** Available ($360$ rows, $51$ rainy hours).
- **Reason Not Ready for Production:** $72$ hours is strictly confined to mid-July 2025; zero extreme rainfall events ($> 15\text{ mm/h}$); only $8$ test rainy events; GPM IMERG and ERA5-Land missing.
- **Permitted Next Step:** Non-production data pipeline construction and pilot two-stage hurdle demonstration, clearly labeled as a **PILOT VERIFICATION ONLY**.
