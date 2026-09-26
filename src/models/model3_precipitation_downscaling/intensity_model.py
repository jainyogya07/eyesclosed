"""
Conditional Intensity Regressor for Model 3: Precipitation Downscaling.
Trains on positive rainfall samples (rain >= 0.1 mm/h) using log1p transformation.
"""
import numpy as np
from typing import Dict, Any
from sklearn.linear_model import Ridge
from sklearn.ensemble import RandomForestRegressor, HistGradientBoostingRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline

from src.models.model3_precipitation_downscaling.config import RANDOM_SEED


class PrecipitationIntensityModel:
    """
    Conditional rainfall intensity model estimating E[y | y >= 0.1 mm/h, X].
    Trained strictly on log1p(rainfall) for positive observations.
    """
    def __init__(self, model_type: str = "ridge", alpha: float = 10.0):
        self.model_type = model_type
        self.alpha = alpha
        self.model = None
        self._build_model()

    def _build_model(self):
        if self.model_type == "ridge":
            self.model = Pipeline([
                ("scaler", StandardScaler()),
                ("reg", Ridge(alpha=self.alpha, random_state=RANDOM_SEED))
            ])
        elif self.model_type == "random_forest":
            self.model = RandomForestRegressor(
                n_estimators=50,
                max_depth=3,
                min_samples_split=4,
                random_state=RANDOM_SEED
            )
        elif self.model_type == "hist_gradient_boosting":
            self.model = HistGradientBoostingRegressor(
                max_iter=50,
                max_depth=2,
                min_samples_leaf=3,
                random_state=RANDOM_SEED
            )
        else:
            raise ValueError(f"Unknown intensity model_type: {self.model_type}")

    def fit(self, X_pos: np.ndarray, y_pos: np.ndarray):
        """
        Fits regressor on positive rainfall samples using log1p transform.
        y_pos must contain values >= 0.1 mm/h.
        """
        if len(y_pos) == 0:
            raise ValueError("Cannot fit intensity model on empty positive rainfall array!")
        
        y_log = np.log1p(y_pos)
        self.model.fit(X_pos, y_log)
        return self

    def predict(self, X: np.ndarray) -> np.ndarray:
        """
        Predicts conditional rainfall intensity in physical units (mm/h).
        Inverse transforms log1p predictions via expm1 and clips to >= 0.0.
        """
        y_log_pred = self.model.predict(X)
        y_pred = np.expm1(y_log_pred)
        return np.clip(y_pred, a_min=0.0, a_max=None)
