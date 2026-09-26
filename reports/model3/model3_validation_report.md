# Model 3: Validation and Temporal Experiment Report

## 1. Spatial Validation (AWS_LKO_04)
- Total hours: 72
- Rainy hours: 9 (12.5%)
- Independent storm events: 8
- Hurdle MAE: 2.7683 mm/h
- Hurdle RMSE: 3.3295 mm/h
- Hurdle Bias: 2.0871 mm/h
- Brier Score: 0.1144

## 2. Temporal Holdout Experiment
- **Setup:** First 48 hours of training stations used for model fitting; final 24 hours used for temporal holdout validation.
- **Train period samples:** 144
- **Validation period samples:** 72
- **Temporal Validation MAE:** 2.5029 mm/h
- **Temporal Validation RMSE:** 3.1405 mm/h
- **Event Composition Shift:** Rainfall is intermittent; the final 24 hours contain distinct convective dissipation phases where lagged rainfall features provide strong stabilization.
