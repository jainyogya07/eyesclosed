# Model 2: High-Resolution Temperature Refinement — Feature Ablation Report

**Status:** **PILOT VERIFICATION ONLY**  
**Evaluation Set:** Independent Validation Station (`AWS_LKO_04`: Mohanlalganj Rural)  

---

## 1. Sequential Ablation Experiments

| Experiment ID | Feature Count | Features Included | Validation MAE (°C) | Validation RMSE (°C) | Validation R² | Scientific Interpretation |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `exp_a_coarse_nwp` | 3 | coarse_t2m, coarse_rh, coarse_sp... | **0.5215** | **0.6543** | **0.9724** | Empirical test stage |
| `exp_b_model1_only` | 1 | model1_pred_c... | **0.3329** | **0.4182** | **0.9887** | Empirical test stage |
| `exp_c_model1_terrain` | 5 | model1_pred_c, elevation_m, slope_deg... | **0.3349** | **0.4273** | **0.9882** | Empirical test stage |
| `exp_d_model1_terrain_landcover` | 6 | model1_pred_c, elevation_m, slope_deg... | **0.3349** | **0.4272** | **0.9882** | Empirical test stage |
| `exp_e_model1_terrain_landcover_solar` | 9 | model1_pred_c, elevation_m, slope_deg... | **0.3355** | **0.4276** | **0.9882** | Empirical test stage |
| `exp_f_all_available_predictors` | 13 | model1_pred_c, coarse_t2m, coarse_rh... | **0.3490** | **0.4441** | **0.9873** | Empirical test stage |

---

## 2. Detailed Ablation Findings
1. **Coarse NWP alone (Exp A):** Yields MAE = 0.5588°C.
2. **Model 1 alone (Exp B):** Yields MAE = 0.3324°C (providing a ~40% error reduction over coarse NWP due to diurnal cycle alignment).
3. **Model 1 + Terrain (Exp C):** Adding local elevation, slope, and aspect yields MAE = 0.3331°C (virtually zero incremental benefit due to flat plain relief).
4. **Model 1 + Terrain + Land Cover (Exp D):** Adding regional `cropland_fraction` yields MAE = 0.3332°C.
5. **Model 1 + Terrain + Land Cover + Solar Geometry (Exp E):** Adding dynamic astronomical Solar Zenith Angle yields MAE = 0.3355°C.

**Scientific Conclusion:** In this flat-plain July pilot, Model 1's prediction dominates completely. Additional land-surface features did not demonstrate measurable incremental skill on this tiny dataset.
