"""
Occurrence Classifier for Model 3: Precipitation Downscaling.
Predicts P(rain >= 0.1 mm/h | X) using class-weighted probabilistic classification.
"""
import numpy as np
from typing import Dict, Any, Tuple
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, HistGradientBoostingClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline

from src.models.model3_precipitation_downscaling.config import RANDOM_SEED


class PrecipitationOccurrenceModel:
    """
    Occurrence classifier estimating P(rain >= 0.1 mm/h | X).
    Supports LogisticRegression, RandomForest, and HistGradientBoosting.
    """
    def __init__(self, model_type: str = "logistic_regression", C: float = 1.0, threshold: float = 0.5, class_weight: str = None):
        self.model_type = model_type
        self.C = C
        self.threshold = threshold
        self.class_weight = class_weight
        self.model = None
        self._build_model()

    def _build_model(self):
        if self.model_type == "logistic_regression":
            self.model = Pipeline([
                ("scaler", StandardScaler()),
                ("clf", LogisticRegression(
                    C=self.C,
                    class_weight=self.class_weight,
                    random_state=RANDOM_SEED,
                    max_iter=1000
                ))
            ])
        elif self.model_type == "random_forest":
            self.model = RandomForestClassifier(
                n_estimators=100,
                max_depth=4,
                min_samples_split=5,
                class_weight="balanced",
                random_state=RANDOM_SEED
            )
        elif self.model_type == "hist_gradient_boosting":
            self.model = HistGradientBoostingClassifier(
                max_iter=100,
                max_depth=3,
                class_weight="balanced",
                random_state=RANDOM_SEED
            )
        else:
            raise ValueError(f"Unknown model_type: {self.model_type}")

    def fit(self, X: np.ndarray, y_binary: np.ndarray):
        """Fit occurrence classifier on training binary targets."""
        self.model.fit(X, y_binary)
        return self

    def predict_proba(self, X: np.ndarray) -> np.ndarray:
        """Returns P(rain >= 0.1 mm/h | X)."""
        probs = self.model.predict_proba(X)
        if probs.shape[1] == 2:
            return probs[:, 1]
        else:
            # Degenerate case (only 1 class observed in train)
            return np.zeros(len(X), dtype=float)

    def predict(self, X: np.ndarray, threshold: float = None) -> np.ndarray:
        """Returns binary prediction using specified or default threshold."""
        th = self.threshold if threshold is None else threshold
        probs = self.predict_proba(X)
        return (probs >= th).astype(int)

    def tune_threshold_on_val(self, X_val: np.ndarray, y_val_binary: np.ndarray, metric: str = "f1") -> float:
        """
        Tunes classification decision threshold strictly on VALIDATION data.
        Never touches locked test set.
        """
        probs = self.predict_proba(X_val)
        best_th = 0.2
        best_score = -1.0
        candidate_thresholds = np.linspace(0.05, 0.60, 23)

        for th in candidate_thresholds:
            preds = (probs >= th).astype(int)
            hits = int(((preds == 1) & (y_val_binary == 1)).sum())
            misses = int(((preds == 0) & (y_val_binary == 1)).sum())
            false_alarms = int(((preds == 1) & (y_val_binary == 0)).sum())

            if metric == "f1":
                denom = (2 * hits + misses + false_alarms)
                score = (2 * hits / denom) if denom > 0 else 0.0
            elif metric == "csi":
                denom = (hits + misses + false_alarms)
                score = (hits / denom) if denom > 0 else 0.0
            elif metric == "balanced_accuracy":
                sens = hits / (hits + misses) if (hits + misses) > 0 else 0.0
                cn = int(((preds == 0) & (y_val_binary == 0)).sum())
                spec = cn / (cn + false_alarms) if (cn + false_alarms) > 0 else 0.0
                score = 0.5 * (sens + spec)
            else:
                score = 0.0

            if score > best_score:
                best_score = score
                best_th = float(th)

        self.threshold = best_th
        return best_th
