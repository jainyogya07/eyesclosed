"""
Evaluation metrics for precipitation downscaling.
Includes contingency table metrics, probabilistic calibration, continuous error,
and zero-inflation diagnostics with explicit pilot caveats.
"""
import numpy as np
import pandas as pd
from typing import Dict, Any, Tuple
from sklearn.metrics import (
    roc_auc_score,
    average_precision_score,
    brier_score_loss,
    balanced_accuracy_score
)

from src.models.model3_precipitation_downscaling.config import (
    RAIN_THRESHOLD_MM,
    EXTREME_THRESHOLD_MM
)


def compute_contingency_metrics(
    y_true_binary: np.ndarray,
    y_pred_binary: np.ndarray,
    y_pred_prob: np.ndarray = None
) -> Dict[str, Any]:
    """
    Computes standard meteorological contingency metrics.
    All metrics are explicitly flagged as 'pilot descriptive estimates'
    due to small sample sizes in the pilot dataset.
    """
    y_true = np.asarray(y_true_binary, dtype=int)
    y_pred = np.asarray(y_pred_binary, dtype=int)

    hits = int(((y_pred == 1) & (y_true == 1)).sum())
    misses = int(((y_pred == 0) & (y_true == 1)).sum())
    false_alarms = int(((y_pred == 1) & (y_true == 0)).sum())
    correct_negs = int(((y_pred == 0) & (y_true == 0)).sum())

    total = len(y_true)
    n_rainy = hits + misses
    n_dry = false_alarms + correct_negs

    pod = hits / n_rainy if n_rainy > 0 else 0.0
    far = false_alarms / (hits + false_alarms) if (hits + false_alarms) > 0 else 0.0
    csi = hits / (hits + misses + false_alarms) if (hits + misses + false_alarms) > 0 else 0.0
    precision = hits / (hits + false_alarms) if (hits + false_alarms) > 0 else 0.0
    recall = pod
    f1 = 2 * hits / (2 * hits + misses + false_alarms) if (2 * hits + misses + false_alarms) > 0 else 0.0
    
    balanced_acc = float(balanced_accuracy_score(y_true, y_pred)) if n_rainy > 0 and n_dry > 0 else 0.0

    brier = float(brier_score_loss(y_true, y_pred_prob)) if y_pred_prob is not None else float(brier_score_loss(y_true, y_pred))

    roc_auc = None
    pr_auc = None
    if y_pred_prob is not None and n_rainy > 0 and n_dry > 0:
        try:
            roc_auc = float(roc_auc_score(y_true, y_pred_prob))
        except Exception:
            roc_auc = None
        try:
            pr_auc = float(average_precision_score(y_true, y_pred_prob))
        except Exception:
            pr_auc = None

    return {
        "total_obs": total,
        "rainy_obs": n_rainy,
        "dry_obs": n_dry,
        "hits": hits,
        "misses": misses,
        "false_alarms": false_alarms,
        "correct_negatives": correct_negs,
        "pod": float(pod),
        "far": float(far),
        "csi": float(csi),
        "precision": float(precision),
        "recall": float(recall),
        "f1": float(f1),
        "balanced_accuracy": balanced_acc,
        "brier_score": float(brier),
        "roc_auc": roc_auc,
        "pr_auc": pr_auc,
        "metric_status": "PILOT_DESCRIPTIVE_ESTIMATE"
    }


def compute_continuous_metrics(
    y_true: np.ndarray,
    y_pred: np.ndarray
) -> Dict[str, Any]:
    """
    Computes continuous regression metrics on rainfall amount (mm/h).
    """
    y_true = np.asarray(y_true, dtype=float)
    y_pred = np.asarray(y_pred, dtype=float)

    errors = y_pred - y_true
    mae = float(np.mean(np.abs(errors)))
    rmse = float(np.sqrt(np.mean(errors ** 2)))
    bias = float(np.mean(errors))

    # Pearson correlation
    if np.std(y_pred) > 1e-8 and np.std(y_true) > 1e-8:
        corr = float(np.corrcoef(y_pred, y_true)[0, 1])
    else:
        corr = 0.0

    # Conditional metrics on true positive rain
    rain_mask = (y_true >= RAIN_THRESHOLD_MM)
    if rain_mask.sum() > 0:
        cond_errors = y_pred[rain_mask] - y_true[rain_mask]
        cond_mae = float(np.mean(np.abs(cond_errors)))
        cond_rmse = float(np.sqrt(np.mean(cond_errors ** 2)))
        cond_bias = float(np.mean(cond_errors))
    else:
        cond_mae = 0.0
        cond_rmse = 0.0
        cond_bias = 0.0

    return {
        "mae": mae,
        "rmse": rmse,
        "bias": bias,
        "correlation": corr,
        "conditional_mae": cond_mae,
        "conditional_rmse": cond_rmse,
        "conditional_bias": cond_bias
    }


def compute_zero_inflation_analysis(
    y_true: np.ndarray,
    y_pred: np.ndarray
) -> Dict[str, Any]:
    """
    Diagnoses zero-inflation fidelity: wet fractions, false wet, false dry, and distributions.
    """
    y_true = np.asarray(y_true, dtype=float)
    y_pred = np.asarray(y_pred, dtype=float)

    obs_wet = (y_true >= RAIN_THRESHOLD_MM)
    pred_wet = (y_pred >= RAIN_THRESHOLD_MM)

    n = len(y_true)
    obs_wet_frac = float(obs_wet.sum() / n) if n > 0 else 0.0
    pred_wet_frac = float(pred_wet.sum() / n) if n > 0 else 0.0

    false_wet = int((pred_wet & (~obs_wet)).sum())
    false_dry = int(((~pred_wet) & obs_wet).sum())

    p90_obs = float(np.percentile(y_true, 90)) if n > 0 else 0.0
    p95_obs = float(np.percentile(y_true, 95)) if n > 0 else 0.0
    p90_pred = float(np.percentile(y_pred, 90)) if n > 0 else 0.0
    p95_pred = float(np.percentile(y_pred, 95)) if n > 0 else 0.0

    return {
        "observed_wet_fraction": obs_wet_frac,
        "predicted_wet_fraction": pred_wet_frac,
        "false_wet_count": false_wet,
        "false_wet_pct": float(false_wet / n * 100.0) if n > 0 else 0.0,
        "false_dry_count": false_dry,
        "false_dry_pct": float(false_dry / n * 100.0) if n > 0 else 0.0,
        "mean_observed_mm": float(np.mean(y_true)),
        "mean_predicted_mm": float(np.mean(y_pred)),
        "p90_observed_mm": p90_obs,
        "p90_predicted_mm": p90_pred,
        "p95_observed_mm": p95_obs,
        "p95_predicted_mm": p95_pred
    }


def identify_storm_events(df: pd.DataFrame) -> Dict[str, Any]:
    """
    Identifies contiguous storm events (runs of consecutive hours with rain >= 0.1 mm/h).
    """
    event_counts = {}
    total_events = 0
    df_sorted = df.sort_values(by=["station_id", "timestamp_utc"]).reset_index(drop=True)

    for st, group in df_sorted.groupby("station_id", sort=False):
        is_rain = (group["rainfall_mm"] >= RAIN_THRESHOLD_MM).astype(int).values
        # Detect rising edges
        diff = np.diff(np.pad(is_rain, (1, 0), "constant", constant_values=0))
        n_events = int((diff == 1).sum())
        event_counts[st] = n_events
        total_events += n_events

    return {
        "station_storm_events": event_counts,
        "total_independent_storm_events": total_events
    }
