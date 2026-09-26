"""
Out-of-Distribution (OOD) Detector for Model 3: Precipitation Downscaling.
Evaluates physical bounds on NWP variables, terrain, and lagged precipitation.
Returns IN_DOMAIN, OOD, or ABSTAIN.
"""
import numpy as np
from typing import Dict, Any, List

from src.models.model3_precipitation_downscaling.config import (
    ALL_FEATURE_COLUMNS,
    ATMOSPHERIC_FEATURES,
    EXTREME_THRESHOLD_MM
)


class PrecipitationOODDetector:
    """
    Monitors input feature distributions against pilot training bounds.
    """
    def __init__(self, tolerance: float = 0.15):
        self.tolerance = tolerance
        self.feature_names = ALL_FEATURE_COLUMNS
        self.bounds = {}
        self.is_fitted = False

    def fit(self, X_train: np.ndarray):
        """Calculates min, max, mean, std from training feature matrix."""
        for idx, feat_name in enumerate(self.feature_names):
            vals = X_train[:, idx]
            f_min = float(np.min(vals))
            f_max = float(np.max(vals))
            f_rng = max(1e-4, f_max - f_min)
            
            self.bounds[feat_name] = {
                "min": f_min,
                "max": f_max,
                "allowable_min": f_min - self.tolerance * f_rng,
                "allowable_max": f_max + self.tolerance * f_rng
            }
        self.is_fitted = True
        return self

    def check_sample(self, feature_vector: np.ndarray) -> Dict[str, Any]:
        """
        Assesses a single feature vector for OOD and severe anomalies.
        """
        if not self.is_fitted:
            raise RuntimeError("OOD Detector must be fitted before checking samples!")

        violations = []
        critical_violations = []

        for idx, feat_name in enumerate(self.feature_names):
            val = float(feature_vector[idx])
            b = self.bounds[feat_name]

            if val < b["allowable_min"] or val > b["allowable_max"]:
                violations.append({
                    "feature": feat_name,
                    "value": val,
                    "allowable_range": [b["allowable_min"], b["allowable_max"]]
                })

            # Critical anomaly: e.g. severe extreme rainfall or physically unviable atmospheric pressure (hPa)
            if feat_name == "coarse_precip" and val > EXTREME_THRESHOLD_MM:
                critical_violations.append(f"Unprecedented coarse precipitation: {val:.2f} mm/h")
            if feat_name == "coarse_sp" and (val < 800.0 or val > 1100.0):
                critical_violations.append(f"Physically unviable surface pressure: {val:.1f} hPa")
            if feat_name == "coarse_t2m" and (val < 0.0 or val > 55.0):
                critical_violations.append(f"Extreme unphysical temperature: {val:.1f} C")

        if len(critical_violations) > 0:
            status = "ABSTAIN"
            confidence_multiplier = 0.0
        elif len(violations) > 2:
            status = "OOD"
            confidence_multiplier = 0.5
        elif len(violations) > 0:
            status = "OOD_MARGINAL"
            confidence_multiplier = 0.8
        else:
            status = "IN_DOMAIN"
            confidence_multiplier = 1.0

        return {
            "ood_status": status,
            "confidence_multiplier": confidence_multiplier,
            "violation_count": len(violations),
            "violations": violations,
            "critical_violations": critical_violations
        }
