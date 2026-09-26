"""
Evaluation metrics, uncertainty evaluation, and permutation feature importance for Model 2.
"""
from typing import Dict, List
import numpy as np
from scipy.stats import pearsonr
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.inspection import permutation_importance


def compute_point_metrics(y_true: np.ndarray, y_pred: np.ndarray) -> Dict[str, float]:
    """
    Computes regression performance metrics against independent AWS station ground truth.
    """
    mae = float(mean_absolute_error(y_true, y_pred))
    rmse = float(np.sqrt(mean_squared_error(y_true, y_pred)))
    r2 = float(r2_score(y_true, y_pred))
    bias = float(np.mean(y_pred - y_true))
    
    corr, _ = pearsonr(y_true, y_pred) if len(y_true) > 1 else (np.nan, np.nan)

    return {
        "mae": round(mae, 4),
        "rmse": round(rmse, 4),
        "r2": round(r2, 4),
        "bias": round(bias, 4),
        "pearson_corr": round(float(corr), 4)
    }


def compute_conformal_coverage(y_true: np.ndarray, lower_bound: np.ndarray, upper_bound: np.ndarray) -> Dict[str, float]:
    """
    Computes Prediction Interval Coverage Probability (PICP) and Mean Prediction Interval Width (MPIW).
    """
    inside = (y_true >= lower_bound) & (y_true <= upper_bound)
    picp = float(np.mean(inside))
    mpiw = float(np.mean(upper_bound - lower_bound))

    return {
        "picp": round(picp, 4),
        "mpiw": round(mpiw, 4),
        "nominal_coverage": 0.90,
        "coverage_gap": round(picp - 0.90, 4)
    }


def compute_model2_feature_importance(model, X_val: np.ndarray, y_val: np.ndarray, feature_names: List[str]) -> List[Dict]:
    """
    Computes permutation feature importance on unseen validation set.
    """
    r = permutation_importance(model, X_val, y_val, n_repeats=10, random_state=42, scoring="neg_mean_absolute_error")
    
    importance_list = []
    for idx, name in enumerate(feature_names):
        importance_list.append({
            "feature": name,
            "importance_mean": round(float(r.importances_mean[idx]), 5),
            "importance_std": round(float(r.importances_std[idx]), 5)
        })

    # Sort descending by importance
    importance_list.sort(key=lambda x: x["importance_mean"], reverse=True)
    for rank, item in enumerate(importance_list, 1):
        item["rank"] = rank

    return importance_list
