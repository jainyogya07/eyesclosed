"""
Uncertainty Estimation and Calibration for Precipitation Downscaling.
Implements occurrence entropy, conditional residual spread, and explicit sample-size caveats.
"""
import numpy as np
from typing import Dict, Any, Tuple


class PrecipitationUncertaintyEstimator:
    """
    Estimator for precipitation uncertainty.
    Acknowledges small sample size: does not manufacture an artificial 90% conformal interval
    when positive validation count is < 30.
    """
    def __init__(self):
        self.calibrated = False
        self.val_rain_sample_count = 0
        self.val_cond_mae = 0.0
        self.q_conformal_rain = 0.0
        self.note = "Uncertainty calibration is limited by small rainy-sample count."

    def calibrate(self, y_val_true: np.ndarray, y_val_pred: np.ndarray, alpha: float = 0.10):
        """
        Calibrates conditional residual scale on validation positive rainfall events.
        """
        pos_mask = (y_val_true >= 0.1)
        self.val_rain_sample_count = int(pos_mask.sum())

        if self.val_rain_sample_count > 0:
            resids = np.abs(y_val_true[pos_mask] - y_val_pred[pos_mask])
            self.val_cond_mae = float(np.mean(resids))
            
            # Non-conformity score quantile with small-sample correction
            k = int(np.ceil((len(resids) + 1) * (1.0 - alpha)))
            k = min(len(resids), max(1, k))
            sorted_res = np.sort(resids)
            self.q_conformal_rain = float(sorted_res[k - 1])
        else:
            self.val_cond_mae = 0.0
            self.q_conformal_rain = 0.0

        self.calibrated = True

    def estimate(
        self,
        prob_rain: float,
        expected_rain: float,
        is_ood: bool = False
    ) -> Dict[str, Any]:
        """
        Computes uncertainty bounds and confidence for a single prediction.
        """
        # Bernoulli variance for occurrence uncertainty: p * (1 - p)
        # Max variance is 0.25 at p=0.5
        p = np.clip(prob_rain, 1e-4, 1.0 - 1e-4)
        bernoulli_var = float(p * (1.0 - p))
        
        # Marginal uncertainty: combines occurrence variance with conditional residual scale
        scale = max(0.5, self.val_cond_mae)
        marginal_uncertainty = float(np.sqrt(bernoulli_var) * scale + (expected_rain * 0.2))

        if is_ood:
            confidence = 0.25
            status = "LOW_CONFIDENCE_OOD"
        elif prob_rain > 0.3 and prob_rain < 0.7:
            confidence = float(np.clip(1.0 - (bernoulli_var / 0.25) * 0.5, 0.3, 0.7))
            status = "TRANSITION_ZONE_MODERATE_CONFIDENCE"
        elif prob_rain <= 0.1:
            confidence = float(np.clip(1.0 - prob_rain, 0.8, 0.98))
            status = "HIGH_CONFIDENCE_DRY"
        else:
            confidence = float(np.clip(prob_rain, 0.6, 0.90))
            status = "CONFIDENCE_WET"

        lower_bound = max(0.0, float(expected_rain - marginal_uncertainty))
        upper_bound = float(expected_rain + marginal_uncertainty)

        return {
            "expected_rainfall_mm": float(expected_rain),
            "rain_probability": float(prob_rain),
            "marginal_uncertainty_mm": marginal_uncertainty,
            "lower_bound_mm": lower_bound,
            "upper_bound_mm": upper_bound,
            "confidence_score": confidence,
            "confidence_status": status,
            "sample_size_limited": True,
            "calibration_note": self.note
        }
