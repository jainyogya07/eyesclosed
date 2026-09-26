"""
Smoke and unit tests for Model 3 precipitation downscaling pilot using standard library unittest.
"""
import unittest
import numpy as np
import pandas as pd

from src.models.model3_precipitation_downscaling.config import (
    MODEL3_VERSION,
    MODEL3_ID,
    ALL_FEATURE_COLUMNS,
    RAIN_THRESHOLD_MM
)
from src.models.model3_precipitation_downscaling.data_loader import (
    verify_upstream_models,
    load_and_align_model3_dataset,
    get_spatial_splits
)
from src.models.model3_precipitation_downscaling.feature_engineering import (
    compute_causal_rainfall_lags,
    prepare_feature_matrix
)
from src.models.model3_precipitation_downscaling.hurdle_model import PrecipitationHurdleModel
from src.models.model3_precipitation_downscaling.uncertainty import PrecipitationUncertaintyEstimator
from src.models.model3_precipitation_downscaling.ood import PrecipitationOODDetector


class TestModel3Pipeline(unittest.TestCase):

    def test_upstream_model_immutability(self):
        m1_model, m1_hash, m2_hash = verify_upstream_models()
        self.assertEqual(len(m1_hash), 64)
        self.assertEqual(len(m2_hash), 64)
        self.assertTrue(hasattr(m1_model, "predict"))

    def test_causal_lags_zero_leakage(self):
        df_test = pd.DataFrame({
            "station_id": ["ST1"] * 5,
            "timestamp_utc": [f"2025-07-15T0{i}:00:00Z" for i in range(5)],
            "rainfall_mm": [0.0, 1.0, 2.0, 5.0, 0.0]
        })
        df_lags = compute_causal_rainfall_lags(df_test)

        # At t=0: lag_1h must be 0.0
        self.assertEqual(df_lags["rainfall_lag_1h"].iloc[0], 0.0)
        # At t=1: lag_1h must be 0.0 (value of t=0)
        self.assertEqual(df_lags["rainfall_lag_1h"].iloc[1], 0.0)
        # At t=2: lag_1h must be 1.0 (value of t=1)
        self.assertEqual(df_lags["rainfall_lag_1h"].iloc[2], 1.0)
        # At t=3: lag_1h must be 2.0 (value of t=2)
        self.assertEqual(df_lags["rainfall_lag_1h"].iloc[3], 2.0)

    def test_spatial_split_isolation(self):
        df, audit = load_and_align_model3_dataset()
        train_df, val_df, test_df = get_spatial_splits(df)

        train_stations = set(train_df["station_id"].unique())
        val_stations = set(val_df["station_id"].unique())
        test_stations = set(test_df["station_id"].unique())

        self.assertTrue(train_stations.isdisjoint(val_stations))
        self.assertTrue(train_stations.isdisjoint(test_stations))
        self.assertTrue(val_stations.isdisjoint(test_stations))
        self.assertEqual(test_stations, {"AWS_LKO_05"})

    def test_hurdle_model_contract(self):
        np.random.seed(42)
        X_dummy = np.random.rand(20, len(ALL_FEATURE_COLUMNS)).astype(np.float32)
        y_binary = np.array([0]*15 + [1]*5)
        y_rain = np.array([0.0]*15 + [1.5, 3.2, 0.8, 4.0, 2.1], dtype=np.float32)

        model = PrecipitationHurdleModel(clf_C=1.0, reg_alpha=5.0)
        model.fit(X_dummy, y_binary, y_rain)

        preds = model.predict(X_dummy)
        self.assertEqual(len(preds), 20)
        self.assertTrue(np.all(preds >= 0.0))

        comp = model.predict_components(X_dummy)
        self.assertIn("rain_probability", comp)
        self.assertIn("rain_occurrence", comp)
        self.assertIn("conditional_rainfall_mm", comp)
        self.assertIn("expected_rainfall_mm", comp)
        self.assertTrue(np.all(comp["rain_probability"] >= 0.0))
        self.assertTrue(np.all(comp["rain_probability"] <= 1.0))

    def test_ood_detector(self):
        # Create realistic baseline vector
        base_vec = np.zeros(len(ALL_FEATURE_COLUMNS), dtype=np.float32)
        # Set realistic atmospheric values
        col_idx = {c: i for i, c in enumerate(ALL_FEATURE_COLUMNS)}
        base_vec[col_idx["coarse_sp"]] = 1000.0
        base_vec[col_idx["coarse_t2m"]] = 30.0
        base_vec[col_idx["coarse_rh"]] = 75.0
        base_vec[col_idx["coarse_precip"]] = 1.0
        
        X_train = np.tile(base_vec, (10, 1))
        ood = PrecipitationOODDetector(tolerance=0.1)
        ood.fit(X_train)

        in_domain = ood.check_sample(base_vec)
        self.assertEqual(in_domain["ood_status"], "IN_DOMAIN")

        out_vec = base_vec.copy()
        out_vec[col_idx["coarse_precip"]] = 50.0  # >15 mm/h extreme precip
        out_domain = ood.check_sample(out_vec)
        self.assertIn(out_domain["ood_status"], ["OOD", "ABSTAIN"])


if __name__ == "__main__":
    unittest.main()
