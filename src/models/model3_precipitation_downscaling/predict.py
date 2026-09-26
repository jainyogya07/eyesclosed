"""
Inference API and Output Contract for Model 3: Precipitation Downscaling.
Output contract matches the formal specification:
{
    model_id,
    model_version,
    timestamp_utc,
    station_id_or_grid_cell,
    rain_probability,
    rain_occurrence,
    conditional_rainfall_mm,
    expected_rainfall_mm,
    uncertainty,
    confidence,
    ood_status,
    quality_status
}
"""
import os
import joblib
import numpy as np
import pandas as pd
from typing import Dict, Any, Union

from src.models.model3_precipitation_downscaling.config import (
    MODEL3_SAVE_PATH,
    MODEL3_ID,
    MODEL3_VERSION,
    ALL_FEATURE_COLUMNS
)


class PrecipitationPredictor:
    """
    Production-grade inference interface for Model 3 pilot bundle.
    """
    def __init__(self, bundle_path: str = MODEL3_SAVE_PATH):
        if not os.path.exists(bundle_path):
            raise FileNotFoundError(f"Model 3 bundle not found at {bundle_path}")
        
        self.bundle = joblib.load(bundle_path)
        self.hurdle_model = self.bundle["hurdle_model"]
        self.uncertainty_estimator = self.bundle["uncertainty_estimator"]
        self.ood_detector = self.bundle["ood_detector"]
        self.metadata = self.bundle.get("metadata", {})

    def predict_single(
        self,
        features: Union[Dict[str, float], np.ndarray],
        timestamp_utc: str,
        station_id_or_grid_cell: str
    ) -> Dict[str, Any]:
        """
        Executes inference for a single spatiotemporal observation.
        """
        if isinstance(features, dict):
            feat_vec = np.array([float(features[c]) for c in ALL_FEATURE_COLUMNS], dtype=np.float32)
        else:
            feat_vec = np.asarray(features, dtype=np.float32).flatten()

        X = feat_vec.reshape(1, -1)

        # OOD assessment
        ood_res = self.ood_detector.check_sample(feat_vec)
        ood_status = ood_res["ood_status"]

        if ood_status == "ABSTAIN":
            return {
                "model_id": "M3",
                "model_version": "0.1.0-pilot",
                "timestamp_utc": timestamp_utc,
                "station_id_or_grid_cell": station_id_or_grid_cell,
                "prediction": {
                    "expected_rainfall_mm": 0.0,
                    "rain_probability": 0.0,
                    "conditional_rainfall_mm": 0.0,
                    "hurdle_gated_rainfall_mm": 0.0
                },
                "uncertainty": {
                    "status": "ABSTAINED",
                    "lower": None,
                    "upper": None,
                    "marginal_uncertainty_mm": None,
                    "note": "Prediction abstained due to unphysical atmospheric conditions or extreme anomaly."
                },
                "quality": {
                    "ood_status": "ABSTAIN",
                    "prediction_status": "ABSTAINED",
                    "data_quality": "REJECTED_UNPHYSICAL",
                    "confidence_score": 0.0
                },
                "provenance": {
                    "nwp": "coarse_nwp_72h",
                    "aws_reference": "aws_ground_truth_72h",
                    "model": "model3_precipitation_downscaling_v0.1.0_pilot"
                }
            }

        # Hurdle components
        components = self.hurdle_model.predict_components(X)
        p_rain = float(components["rain_probability"][0])
        occ = int(components["rain_occurrence"][0])
        cond_mm = float(components["conditional_rainfall_mm"][0])
        exp_mm = float(components["expected_rainfall_mm"][0])
        gated_mm = float(components.get("hurdle_gated_rainfall_mm", [exp_mm])[0])

        # Uncertainty estimation
        unc_res = self.uncertainty_estimator.estimate(
            prob_rain=p_rain,
            expected_rain=exp_mm,
            is_ood=(ood_status in ["OOD", "OOD_MARGINAL"])
        )

        final_conf = float(unc_res["confidence_score"] * ood_res["confidence_multiplier"])

        # Per scientific audit: Do NOT expose a fake numerical prediction interval (e.g. 90% CQR)
        # when positive validation event sample size is inadequate (N=9).
        return {
            "model_id": "M3",
            "model_version": "0.1.0-pilot",
            "timestamp_utc": timestamp_utc,
            "station_id_or_grid_cell": station_id_or_grid_cell,
            "prediction": {
                "expected_rainfall_mm": round(exp_mm, 2),
                "rain_probability": round(p_rain, 2),
                "conditional_rainfall_mm": round(cond_mm, 2),
                "hurdle_gated_rainfall_mm": round(gated_mm, 2),
                "rain_occurrence": occ
            },
            "uncertainty": {
                "status": "LIMITED_CALIBRATION",
                "lower": None,  # Suppressed per scientific policy: sample size insufficient for robust coverage
                "upper": None,
                "marginal_uncertainty_mm": round(unc_res["marginal_uncertainty_mm"], 2),
                "note": "Uncertainty calibration is limited by small rainy-sample count."
            },
            "quality": {
                "ood_status": ood_status,
                "prediction_status": "PILOT",
                "data_quality": "LIMITED",
                "confidence_score": round(final_conf, 2)
            },
            "provenance": {
                "nwp": "coarse_nwp_72h",
                "aws_reference": "aws_ground_truth_72h",
                "model": "model3_precipitation_downscaling_v0.1.0_pilot"
            }
        }
