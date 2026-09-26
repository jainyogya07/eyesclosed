"""
Baseline downscaling model using Topographic Random Forest and Conformalized Residuals.
"""
from typing import Tuple, Dict, Any, Optional
import numpy as np
from sklearn.ensemble import RandomForestRegressor
import joblib

class TopographicDownscalerBaseline:
    def __init__(self, n_estimators: int = 100, max_depth: Optional[int] = None, min_samples_split: int = 2, random_state: int = 42):
        self.params = {
            "n_estimators": n_estimators,
            "max_depth": max_depth,
            "min_samples_split": min_samples_split,
            "random_state": random_state
        }
        self.model = RandomForestRegressor(**self.params)
        self.q_conformal: float = 1.0  # Empirical conformal residual for target coverage (e.g. 90%)
        self.is_fitted: bool = False
        self.is_locked: bool = False
        self.calibration_metadata: Dict[str, Any] = {}

    def fit(self, X: np.ndarray, y: np.ndarray):
        """
        Fits the regressor on training station data.
        """
        if self.is_locked:
            raise RuntimeError("Model is LOCKED. Cannot re-fit a frozen model.")
        self.model.fit(X, y)
        self.is_fitted = True

    def calibrate(self, X_cal: np.ndarray, y_cal: np.ndarray, alpha: float = 0.10):
        """
        Computes conformal nonconformity score on an independent validation/calibration station.
        Finite sample correction: ceil((N + 1) * (1 - alpha)) / N
        """
        if not self.is_fitted:
            raise RuntimeError("Model must be fitted before calibration.")
        cal_preds = self.model.predict(X_cal)
        residuals = np.abs(y_cal - cal_preds)
        n = len(residuals)
        # Finite sample corrected quantile
        k = int(np.ceil((n + 1) * (1 - alpha)))
        k = min(n, max(1, k))
        # 0-indexed in sorted array:
        q_val = float(np.sort(residuals)[k - 1])
        self.q_conformal = q_val
        self.calibration_metadata = {
            "alpha": alpha,
            "target_coverage": 1.0 - alpha,
            "n_calibration_samples": n,
            "q_conformal": q_val,
            "mean_cal_residual": float(np.mean(residuals)),
            "max_cal_residual": float(np.max(residuals))
        }

    def lock(self):
        """
        Freezes the model, hyperparams, and conformal threshold.
        """
        self.is_locked = True

    def predict(self, X: np.ndarray) -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
        if not self.is_fitted:
            raise RuntimeError("Model must be fitted before predict.")
        preds = self.model.predict(X)
        lower = preds - self.q_conformal
        upper = preds + self.q_conformal
        return preds, lower, upper

    def predict_grid(self, macro_temp: float, macro_rh: float, elev_grid: np.ndarray, slope_grid: np.ndarray, aspect_grid: np.ndarray, hour: int = 12):
        """
        Infers 2D spatial grid [H, W] from scalar/coarse atmospheric forcing, 2D terrain grids, and hour.
        """
        H, W = elev_grid.shape
        asp_rad = np.radians(aspect_grid)
        sin_asp = np.sin(asp_rad)
        cos_asp = np.cos(asp_rad)
        sin_h = np.sin(2 * np.pi * hour / 24.0)
        cos_h = np.cos(2 * np.pi * hour / 24.0)

        X_grid = np.column_stack([
            np.full(H * W, macro_temp),
            np.full(H * W, macro_rh),
            elev_grid.ravel(),
            slope_grid.ravel(),
            sin_asp.ravel(),
            cos_asp.ravel(),
            np.full(H * W, sin_h),
            np.full(H * W, cos_h)
        ])
        preds, lower, upper = self.predict(X_grid)
        return preds.reshape(H, W), lower.reshape(H, W), upper.reshape(H, W)

    def get_feature_importances(self, feature_names: list) -> Dict[str, float]:
        if not self.is_fitted:
            raise RuntimeError("Model must be fitted to get feature importances.")
        importances = self.model.feature_importances_
        return {name: float(val) for name, val in zip(feature_names, importances)}

    def save(self, filepath: str):
        joblib.dump({
            "model": self.model,
            "params": self.params,
            "q_conformal": self.q_conformal,
            "is_locked": self.is_locked,
            "calibration_metadata": self.calibration_metadata
        }, filepath)

    def load(self, filepath: str):
        data = joblib.load(filepath)
        self.model = data["model"]
        self.params = data.get("params", {})
        self.q_conformal = data["q_conformal"]
        self.is_locked = data.get("is_locked", True)
        self.calibration_metadata = data.get("calibration_metadata", {})
        self.is_fitted = True
