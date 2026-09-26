"""
Inference engine and Output Contract enforcement for Model 2.
"""
from typing import Dict, Any, List
import numpy as np
import pandas as pd
from src.models.model2_temperature_refinement.config import (
    MODEL2_ID,
    MODEL2_VERSION,
    UPSTREAM_MODEL_ID,
    UPSTREAM_MODEL_VERSION,
    LST_AVAILABLE,
    ERA5_LAND_AVAILABLE
)
from src.models.model2_temperature_refinement.ood import Model2OODDetector


class Model2Predictor:
    def __init__(self, model, feature_names: List[str], q_conformal: float):
        self.model = model
        self.feature_names = feature_names
        self.q_conformal = q_conformal
        self.ood_detector = Model2OODDetector()

    def predict_sample(self, row_dict: Dict[str, Any]) -> Dict[str, Any]:
        """
        Executes inference for a single input record and returns the strict Model 2 contract.
        """
        # Feature array
        X_sample = np.array([[row_dict[f] for f in self.feature_names]])
        pred_c = float(self.model.predict(X_sample)[0])
        lower_c = float(pred_c - self.q_conformal)
        upper_c = float(pred_c + self.q_conformal)

        # OOD & QA assessment
        ood_status, quality_status, confidence = self.ood_detector.check_sample(row_dict)

        # Fallback handling if severe OOD
        if quality_status == "ABSTAIN":
            pred_c = float(row_dict.get("model1_pred_c", pred_c))
            confidence = 0.20

        station_or_grid = str(row_dict.get("station_id", f"grid_{row_dict.get('grid_x', 0)}_{row_dict.get('grid_y', 0)}"))

        return {
            "model_id": MODEL2_ID,
            "model_version": MODEL2_VERSION,
            "upstream_model_id": UPSTREAM_MODEL_ID,
            "upstream_model_version": UPSTREAM_MODEL_VERSION,
            "timestamp_utc": str(row_dict.get("timestamp_utc", "")),
            "station_id_or_grid_cell": station_or_grid,
            "temperature_prediction_c": round(pred_c, 4),
            "lower_bound_c": round(lower_c, 4),
            "upper_bound_c": round(upper_c, 4),
            "uncertainty_c": round(float(self.q_conformal), 4),
            "confidence": round(confidence, 2),
            "ood_status": ood_status,
            "quality_status": quality_status,
            "lst_available": LST_AVAILABLE,
            "era5_land_available": ERA5_LAND_AVAILABLE
        }

    def predict_batch(self, df: pd.DataFrame) -> List[Dict[str, Any]]:
        """
        Executes batch inference over a DataFrame.
        """
        results = []
        for _, row in df.iterrows():
            results.append(self.predict_sample(row.to_dict()))
        return results
