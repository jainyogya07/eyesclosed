"""
Data Loader and Immutability Verification for Model 3: Precipitation Downscaling.
Enforces upstream frozen model verification, spatial holdout isolation, and explicit joins.
"""
import os
import hashlib
import numpy as np
import pandas as pd
import joblib
from typing import Tuple, Dict, Any

from src.models.model3_precipitation_downscaling.config import (
    MODEL1_ARTIFACT_PATH,
    MODEL1_CHECKSUM_SHA256,
    MODEL2_ARTIFACT_PATH,
    MODEL2_CHECKSUM_SHA256,
    AWS_FILE,
    NWP_FILE,
    TERRAIN_FILE,
    BASE_TIMESTAMP_UTC,
    TRAIN_STATIONS,
    VAL_STATIONS,
    TEST_STATIONS
)
from src.models.model3_precipitation_downscaling.feature_engineering import (
    compute_causal_rainfall_lags
)


def verify_upstream_models() -> Tuple[Any, str, str]:
    """
    Verifies that frozen Model 1 and Model 2 artifacts are intact and match recorded SHA-256 hashes.
    Returns loaded Model 1 object and hashes.
    """
    if not os.path.exists(MODEL1_ARTIFACT_PATH):
        raise FileNotFoundError(f"[FATAL] Model 1 artifact missing: {MODEL1_ARTIFACT_PATH}")
    if not os.path.exists(MODEL2_ARTIFACT_PATH):
        raise FileNotFoundError(f"[FATAL] Model 2 artifact missing: {MODEL2_ARTIFACT_PATH}")

    # Verify Model 1
    with open(MODEL1_ARTIFACT_PATH, "rb") as f:
        m1_hash = hashlib.sha256(f.read()).hexdigest()
    if m1_hash != MODEL1_CHECKSUM_SHA256:
        raise ValueError(
            f"[FATAL CHECKSUM MISMATCH] Model 1 was illegally modified!\n"
            f"Expected: {MODEL1_CHECKSUM_SHA256}\n"
            f"Actual:   {m1_hash}"
        )

    # Verify Model 2
    with open(MODEL2_ARTIFACT_PATH, "rb") as f:
        m2_hash = hashlib.sha256(f.read()).hexdigest()
    if m2_hash != MODEL2_CHECKSUM_SHA256:
        raise ValueError(
            f"[FATAL CHECKSUM MISMATCH] Model 2 was illegally modified!\n"
            f"Expected: {MODEL2_CHECKSUM_SHA256}\n"
            f"Actual:   {m2_hash}"
        )

    bundle1 = joblib.load(MODEL1_ARTIFACT_PATH)
    m1_model = bundle1["model"]
    return m1_model, m1_hash, m2_hash


def load_and_align_model3_dataset() -> Tuple[pd.DataFrame, Dict[str, Any]]:
    """
    Loads raw pilot data, applies explicit spatiotemporal joins, extracts Model 1 temperature,
    computes causal lag features, and returns clean verified DataFrame.
    """
    m1_model, m1_hash, m2_hash = verify_upstream_models()

    terrain = np.load(TERRAIN_FILE)
    elevation = terrain["elevation"]
    slope = terrain["slope"]
    aspect = terrain["aspect"]
    cropland_frac = terrain["cropland_fraction"]

    nwp = np.load(NWP_FILE)
    coarse_t2m = nwp["t2m"]
    coarse_rh = nwp["rh2m"]
    coarse_sp = nwp["sp"]
    coarse_precip = nwp["precip"]

    df_aws = pd.read_csv(AWS_FILE)
    base_time = pd.to_datetime(BASE_TIMESTAMP_UTC).tz_localize(None)

    # Integrity audit
    n_dupes = df_aws.duplicated(subset=["station_id", "timestamp_utc"]).sum()
    if n_dupes > 0:
        raise ValueError(f"[DATA INTEGRITY ERROR] Found {n_dupes} duplicate station-timestamp records in AWS data!")

    records = []
    timestamp_mismatches = 0
    spatial_mismatches = 0

    for _, row in df_aws.iterrows():
        dt = pd.to_datetime(row["timestamp_utc"]).tz_localize(None)
        t_delta_sec = (dt - base_time).total_seconds()
        if t_delta_sec < 0 or t_delta_sec % 3600 != 0:
            timestamp_mismatches += 1
            continue

        t_idx = int(t_delta_sec // 3600)
        if t_idx < 0 or t_idx >= len(coarse_t2m):
            timestamp_mismatches += 1
            continue

        gx = int(row["grid_x"])
        gy = int(row["grid_y"])
        if gx < 0 or gx >= 10 or gy < 0 or gy >= 10:
            spatial_mismatches += 1
            continue

        cx = min(1, int(gx / 5))
        cy = min(1, int(gy / 5))
        h = dt.hour

        # Physical predictors
        m_t = float(coarse_t2m[t_idx, cy, cx])
        m_rh = float(coarse_rh[t_idx, cy, cx])
        m_sp = float(coarse_sp[t_idx, cy, cx])
        m_pr = float(coarse_precip[t_idx, cy, cx])

        elev = float(elevation[gy, gx])
        slp = float(slope[gy, gx])
        asp = float(aspect[gy, gx])
        asp_rad = np.radians(asp)
        cf = float(cropland_frac[gy, gx])

        # Model 1 upstream temperature prediction (strict 8-feature contract)
        m1_feat = np.array([[
            m_t, m_rh, elev, slp,
            np.sin(asp_rad), np.cos(asp_rad),
            np.sin(2.0 * np.pi * h / 24.0), np.cos(2.0 * np.pi * h / 24.0)
        ]], dtype=np.float32)
        m1_pred = float(m1_model.predict(m1_feat)[0])

        records.append({
            "station_id": row["station_id"],
            "station_name": row["station_name"],
            "timestamp_utc": row["timestamp_utc"],
            "t_idx": t_idx,
            "hour": h,
            "lat": float(row["lat"]),
            "lon": float(row["lon"]),
            "grid_x": gx,
            "grid_y": gy,
            "coarse_cell_x": cx,
            "coarse_cell_y": cy,
            "rainfall_mm": float(row["rainfall_mm"]),
            "temperature_c": float(row["temperature_c"]),
            "relative_humidity_pct": float(row["relative_humidity_pct"]),
            "coarse_precip": m_pr,
            "coarse_t2m": m_t,
            "coarse_rh": m_rh,
            "coarse_sp": m_sp,
            "elevation_m": elev,
            "slope_deg": slp,
            "aspect_sin": float(np.sin(asp_rad)),
            "aspect_cos": float(np.cos(asp_rad)),
            "cropland_fraction": cf,
            "model1_pred_c": m1_pred
        })

    if timestamp_mismatches > 0 or spatial_mismatches > 0:
        raise ValueError(
            f"[JOIN AUDIT FAILED] timestamp_mismatches={timestamp_mismatches}, spatial_mismatches={spatial_mismatches}"
        )

    df_dataset = pd.DataFrame(records)
    # Compute strictly causal historical precipitation lags
    df_dataset = compute_causal_rainfall_lags(df_dataset)

    audit_info = {
        "total_records": len(df_dataset),
        "unique_stations": df_dataset["station_id"].nunique(),
        "total_rainy_obs": int((df_dataset["rainfall_mm"] >= 0.1).sum()),
        "total_dry_obs": int((df_dataset["rainfall_mm"] < 0.1).sum()),
        "m1_hash": m1_hash,
        "m2_hash": m2_hash,
        "join_status": "EXPLICIT_SPATIOTEMPORAL_PASS"
    }

    return df_dataset, audit_info


def get_spatial_splits(df: pd.DataFrame) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    """
    Returns train, validation, and locked test DataFrames strictly isolated by station.
    """
    train_df = df[df["station_id"].isin(TRAIN_STATIONS)].copy().reset_index(drop=True)
    val_df = df[df["station_id"].isin(VAL_STATIONS)].copy().reset_index(drop=True)
    test_df = df[df["station_id"].isin(TEST_STATIONS)].copy().reset_index(drop=True)

    if len(train_df) == 0 or len(val_df) == 0 or len(test_df) == 0:
        raise ValueError(
            f"[SPLIT ERROR] One or more splits empty: train={len(train_df)}, val={len(val_df)}, test={len(test_df)}"
        )

    return train_df, val_df, test_df
