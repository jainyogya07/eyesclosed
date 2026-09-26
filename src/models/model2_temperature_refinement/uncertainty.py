"""
Conformal uncertainty calibration and prediction interval calculation for Model 2.
"""
from typing import Tuple, Dict, Any
import numpy as np


class Model2ConformalCalibrator:
    def __init__(self, alpha: float = 0.10):
        self.alpha = alpha
        self.q_conformal: float = 1.0
        self.is_calibrated: bool = False
        self.metadata: Dict[str, Any] = {}

    def calibrate(self, y_val: np.ndarray, y_pred_val: np.ndarray) -> float:
        """
        Computes finite-sample corrected conformal quantile on independent validation residuals.
        """
        residuals = np.abs(y_val - y_pred_val)
        n = len(residuals)
        
        # Finite sample correction: ceil((n + 1) * (1 - alpha)) / n
        rank = int(np.ceil((n + 1) * (1.0 - self.alpha)))
        rank = min(n, max(1, rank))
        
        # 0-indexed in sorted residuals
        q_val = float(np.sort(residuals)[rank - 1])
        self.q_conformal = q_val
        self.is_calibrated = True

        self.metadata = {
            "alpha": self.alpha,
            "nominal_coverage": 1.0 - self.alpha,
            "n_calibration_samples": n,
            "q_conformal": q_val,
            "mean_cal_residual": float(np.mean(residuals)),
            "max_cal_residual": float(np.max(residuals))
        }

        return q_val

    def predict_bounds(self, y_pred: np.ndarray) -> Tuple[np.ndarray, np.ndarray, float]:
        """
        Constructs prediction intervals: [y_pred - q, y_pred + q].
        """
        if not self.is_calibrated:
            raise RuntimeError("Calibrator must be calibrated before generating intervals.")
        lower = y_pred - self.q_conformal
        upper = y_pred + self.q_conformal
        return lower, upper, self.q_conformal
