"""
Out-of-Distribution (OOD) and Quality Assurance Engine for Model 2.
Detects physical, atmospheric, and topographic anomalies and triggers abstention / fallback.
"""
from typing import Dict, Any, Tuple


class Model2OODDetector:
    def __init__(self):
        # Operational bounds derived from training domain + meteorological limits
        self.bounds = {
            "coarse_t2m": (10.0, 48.0),
            "coarse_rh": (10.0, 100.0),
            "elevation_m": (50.0, 300.0),
            "cropland_fraction": (0.0, 1.0),
            "max_model1_spread": 6.0  # max expected difference between coarse and Model 1
        }

    def check_sample(self, sample: Dict[str, Any]) -> Tuple[str, str, float]:
        """
        Evaluates input sample and returns (ood_status, quality_status, confidence_score).
        """
        violations = []

        # Atmospheric checks
        t = sample.get("coarse_t2m", 25.0)
        if t < self.bounds["coarse_t2m"][0] or t > self.bounds["coarse_t2m"][1]:
            violations.append(f"Temperature {t:.1f}°C out of atmospheric bounds")

        rh = sample.get("coarse_rh", 70.0)
        if rh < self.bounds["coarse_rh"][0] or rh > self.bounds["coarse_rh"][1]:
            violations.append(f"Relative humidity {rh:.1f}% out of bounds")

        # Topographic check
        elev = sample.get("elevation_m", 120.0)
        if elev < self.bounds["elevation_m"][0] or elev > self.bounds["elevation_m"][1]:
            violations.append(f"Elevation {elev:.1f}m outside Gangetic plain bounds")

        # Land cover check
        cf = sample.get("cropland_fraction", 0.7)
        if cf < self.bounds["cropland_fraction"][0] or cf > self.bounds["cropland_fraction"][1]:
            violations.append(f"Cropland fraction {cf:.2f} invalid")

        # Consistency between Model 1 and coarse NWP
        m1_t = sample.get("model1_pred_c", t)
        if abs(m1_t - t) > self.bounds["max_model1_spread"]:
            violations.append(f"Large discrepancy between Model 1 ({m1_t:.1f}°C) and NWP ({t:.1f}°C)")

        # Determine OOD and Quality Status
        if len(violations) == 0:
            return "IN_DOMAIN", "HIGH", 0.95
        elif len(violations) == 1:
            return "OOD_MARGINAL", "MEDIUM", 0.70
        elif len(violations) == 2:
            return "OOD", "LOW", 0.40
        else:
            return "OOD_SEVERE", "ABSTAIN", 0.10
