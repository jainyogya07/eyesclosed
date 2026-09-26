"""
Training and model selection module for Model 2: High-Resolution Temperature Refinement.
Evaluates candidate architectures on independent validation station AWS_LKO_04 and selects optimal candidate.
"""
from typing import Dict, Any, Tuple
import numpy as np
import pandas as pd
from sklearn.linear_model import Ridge, LinearRegression
from sklearn.ensemble import RandomForestRegressor, HistGradientBoostingRegressor
from src.models.model2_temperature_refinement.evaluation import compute_point_metrics
from src.models.model2_temperature_refinement.config import RANDOM_SEED


class Model2CandidateTrainer:
    def __init__(self, random_state: int = RANDOM_SEED):
        self.random_state = random_state
        self.candidates: Dict[str, Any] = {
            "ridge_regularized_linear": Ridge(alpha=1.0, random_state=random_state),
            "random_forest_refiner": RandomForestRegressor(n_estimators=100, max_depth=8, min_samples_split=2, random_state=random_state),
            "hist_gradient_boosting": HistGradientBoostingRegressor(max_iter=100, max_depth=5, min_samples_leaf=5, random_state=random_state)
        }
        self.best_model_name: str = ""
        self.best_model: Any = None
        self.best_features: list = []
        self.candidate_comparison: Dict[str, Dict[str, float]] = {}

    def fit_and_select_best(
        self,
        train_df: pd.DataFrame,
        val_df: pd.DataFrame,
        feature_list: list
    ) -> Tuple[Any, str, Dict[str, Dict[str, float]]]:
        """
        Trains candidate models on training stations and evaluates strictly on validation station.
        Selects model with lowest validation MAE. If differences are marginal (<0.01C), prefers simpler linear model.
        """
        X_train, y_train = train_df[feature_list].values, train_df["target_temp_c"].values
        X_val, y_val = val_df[feature_list].values, val_df["target_temp_c"].values

        best_mae = float("inf")
        selected_name = ""
        selected_model = None

        for name, model in self.candidates.items():
            model.fit(X_train, y_train)
            val_preds = model.predict(X_val)
            metrics = compute_point_metrics(y_val, val_preds)
            self.candidate_comparison[name] = metrics

            if metrics["mae"] < best_mae:
                best_mae = metrics["mae"]
                selected_name = name
                selected_model = model

        # Simplicity preference rule (Principle 11):
        # If Ridge is within 0.01°C of best complex model, prefer Ridge to avoid overfitting small sample
        ridge_mae = self.candidate_comparison["ridge_regularized_linear"]["mae"]
        if abs(ridge_mae - best_mae) <= 0.01:
            selected_name = "ridge_regularized_linear"
            selected_model = self.candidates["ridge_regularized_linear"]

        self.best_model_name = selected_name
        self.best_model = selected_model
        self.best_features = feature_list

        return self.best_model, self.best_model_name, self.candidate_comparison
