"""
Two-Stage Hurdle Precipitation Downscaling Model.
Stage 1: P(rain >= 0.1 mm/h | X)
Stage 2: E[rain | rain >= 0.1 mm/h, X]
Expected Rainfall = P(rain) * E[rain | rain]
"""
import numpy as np
from typing import Dict, Any, Tuple

from src.models.model3_precipitation_downscaling.occurrence_model import PrecipitationOccurrenceModel
from src.models.model3_precipitation_downscaling.intensity_model import PrecipitationIntensityModel
from src.models.model3_precipitation_downscaling.config import (
    MODEL3_VERSION,
    MODEL3_ID,
    RAIN_THRESHOLD_MM
)


class PrecipitationHurdleModel:
    """
    Two-stage Hurdle Precipitation Model.
    Decomposes zero-inflated precipitation into occurrence probability and conditional intensity.
    """
    def __init__(
        self,
        occurrence_type: str = "logistic_regression",
        intensity_type: str = "ridge",
        clf_C: float = 1.0,
        reg_alpha: float = 10.0,
        threshold: float = 0.5,
        class_weight: str = None
    ):
        self.model_id = MODEL3_ID
        self.model_version = MODEL3_VERSION
        self.occurrence_type = occurrence_type
        self.intensity_type = intensity_type
        self.threshold = threshold
        self.class_weight = class_weight

        self.occurrence_model = PrecipitationOccurrenceModel(
            model_type=occurrence_type,
            C=clf_C,
            threshold=threshold,
            class_weight=class_weight
        )
        self.intensity_model = PrecipitationIntensityModel(
            model_type=intensity_type,
            alpha=reg_alpha
        )

    def fit(self, X_train: np.ndarray, y_train_binary: np.ndarray, y_train_rain: np.ndarray):
        """
        Fits occurrence model on all training data, and intensity model on positive rain samples.
        """
        # Fit Stage 1: Occurrence
        self.occurrence_model.fit(X_train, y_train_binary)

        # Fit Stage 2: Conditional Intensity (on rain >= RAIN_THRESHOLD_MM)
        pos_mask = (y_train_rain >= RAIN_THRESHOLD_MM)
        if pos_mask.sum() == 0:
            raise ValueError("Zero positive rainfall observations in training set!")

        X_pos = X_train[pos_mask]
        y_pos = y_train_rain[pos_mask]
        self.intensity_model.fit(X_pos, y_pos)
        return self

    def tune_threshold(self, X_val: np.ndarray, y_val_binary: np.ndarray, metric: str = "f1") -> float:
        """
        Tunes decision threshold strictly using validation data.
        """
        tuned_th = self.occurrence_model.tune_threshold_on_val(X_val, y_val_binary, metric=metric)
        self.threshold = tuned_th
        return tuned_th

    def predict_components(self, X: np.ndarray) -> Dict[str, np.ndarray]:
        """
        Generates individual hurdle components:
        - rain_probability: P(rain >= 0.1 mm/h | X)
        - rain_occurrence: binary classification (1 if prob >= threshold else 0)
        - conditional_rainfall_mm: E[rain | rain >= 0.1 mm/h, X]
        - expected_rainfall_mm: P(rain) * E[rain | rain]
        - hurdle_gated_rainfall_mm: I(prob >= threshold) * E[rain | rain]
        """
        prob_rain = self.occurrence_model.predict_proba(X)
        occ_rain = (prob_rain >= self.threshold).astype(int)
        cond_rain = self.intensity_model.predict(X)
        expected_rain = prob_rain * cond_rain
        hurdle_gated_rain = occ_rain * cond_rain

        return {
            "rain_probability": prob_rain,
            "rain_occurrence": occ_rain,
            "conditional_rainfall_mm": cond_rain,
            "expected_rainfall_mm": expected_rain,
            "hurdle_gated_rainfall_mm": hurdle_gated_rain
        }

    def predict(self, X: np.ndarray) -> np.ndarray:
        """Returns the expected rainfall amount in mm/h."""
        components = self.predict_components(X)
        return components["expected_rainfall_mm"]
