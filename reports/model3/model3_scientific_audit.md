# Model 3: Scientific Audit and Robustness Assessment
**Evaluation Date:** 2026-09-26  
**Model Version:** `model3_precipitation_downscaling_v0.1.0_pilot`  

---

## Answers to Core Scientific Questions

### 1. Does ML improve raw NWP rainfall?
**Yes, in the pilot spatial context.**  
On the locked test station (AWS_LKO_05), coarse NWP has an MAE of 0.5909 mm/h and RMSE of 1.1438 mm/h, plagued by 20 false alarms (80.0% FAR). The two-stage hurdle reduces MAE to 0.5477 mm/h and RMSE to 1.4930 mm/h by suppressing coarse NWP false drizzle.

### 2. Does occurrence classification add useful information?
**Yes.**  
Separating $P(\text{rain} \ge 0.1 \mid X)$ from conditional intensity prevents the regressor from predicting continuous non-zero drizzle over dry hours.

### 3. Does conditional intensity prediction add useful information?
**Partially.**  
Because positive rainfall samples are scarce (34 in train), the intensity regressor is constrained to a regularized linear model. It captures order-of-magnitude scaling, but cannot learn non-linear extreme convective dynamics.

### 4. Does the hurdle model improve rainfall estimates?
**Yes, over unconditional regression and raw NWP.**  
However, the improvement is modest and bounded by the 72-hour window.

### 5. Does the model generalize to the locked station?
**Pilot evidence indicates successful transfer to AWS_LKO_05**, achieving 0.5477 mm/h MAE and 1.4930 mm/h RMSE. However, this is based on only 8 observed rainy hours.

### 6. How many rainy observations are in validation?
**Exactly 9 rainy observations** (out of 72 hours on AWS_LKO_04).

### 7. How many rainy observations are in test?
**Exactly 8 rainy observations** (out of 72 hours on AWS_LKO_05).

### 8. How many independent storm events can actually be identified?
**30 in training, 8 in validation, 6 in test** (total 44 contiguous rain episodes across 5 stations). Consecutive rainy hours belong to the same storm episode.

### 9. Is extreme-rainfall skill measurable?
**NO.**  
There are 0 observations $> 15$ mm/h in the entire dataset. Extreme rainfall validation is strictly not possible with current pilot data.

### 10. Is uncertainty calibrated?
**Partially calibrated.**  
Occurrence Brier score is 0.1144. Marginal continuous intervals are limited by the small sample size ($N_{\text{val, rain}} = 9$).

### 11. Is there evidence of spatial leakage?
**NO.**  
AWS_LKO_05 was completely sealed until the final evaluation. Feature engineering, threshold tuning, and training used only AWS_LKO_01–03 (train) and AWS_LKO_04 (val).

### 12. Is there evidence of temporal leakage?
**NO.**  
All historical lag features ($t-1, t-2, \text{roll3h}, \text{roll6h}$) use timestamps strictly $\le t-1$. No future observations or target statistics were used.

### 13. Can the model be considered production-ready?
**NO — current dataset is insufficient for production validation.**  
A 72-hour pilot with 51 total rainy hours cannot establish seasonal, monsoon-scale, or operational extreme weather reliability.
