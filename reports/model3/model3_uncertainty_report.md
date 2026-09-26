# Model 3: Uncertainty & Calibration Report

## 1. Distributional Differences from Temperature
- Unlike Model 1 and Model 2 (temperature Gaussian/Laplacian residual distributions), precipitation is zero-inflated and highly asymmetric.
- Blindly applying temperature conformal prediction intervals is mathematically unsound.

## 2. Implemented Uncertainty Structure
- **Occurrence Uncertainty:** Bernoulli variance $\sigma^2 = p(1-p)$.
- **Conditional Residual Spread:** Calibrated on positive validation events ($N=9$).
- **Sample Size Caveat:** With only 9 positive validation samples, conformal coverage guarantee cannot be established to 90% confidence.
- Explicit status logged: `Uncertainty calibration is limited by small rainy-sample count.`
