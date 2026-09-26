"""
Evaluation metrics for Model 1: Hyperlocal Weather Downscaling.
"""
import numpy as np
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

def compute_point_metrics(y_true: np.ndarray, y_pred: np.ndarray) -> dict:
    """
    Computes standard regression metrics against independent ground truth AWS observations.
    """
    mae = float(mean_absolute_error(y_true, y_pred))
    rmse = float(np.sqrt(mean_squared_error(y_true, y_pred)))
    r2 = float(r2_score(y_true, y_pred))
    bias = float(np.mean(y_pred - y_true))
    
    return {
        "mae": round(mae, 4),
        "rmse": round(rmse, 4),
        "r2": round(r2, 4),
        "bias": round(bias, 4)
    }

def compute_uncertainty_coverage(y_true: np.ndarray, lower_bound: np.ndarray, upper_bound: np.ndarray) -> dict:
    """
    Computes Prediction Interval Coverage Probability (PICP) and Mean Prediction Interval Width (MPIW).
    """
    inside = (y_true >= lower_bound) & (y_true <= upper_bound)
    picp = float(np.mean(inside))
    mpiw = float(np.mean(upper_bound - lower_bound))
    
    return {
        "picp": round(picp, 4),
        "mpiw": round(mpiw, 4),
        "target_coverage": 0.90,
        "is_calibrated": picp >= 0.88
    }
