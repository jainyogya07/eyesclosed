"""
Data Loader and Spatiotemporal Alignment Engine for Model 2.
Enforces explicit timestamp and spatial joins, zero row-order assumptions, and Model 1 verification.
"""
import os
import hashlib
import numpy as np
import pandas as pd
import joblib

from src.models.model2_temperature_refinement.config import (
    MODEL1_ARTIFACT_PATH,
    MODEL1_CHECKSUM_SHA256,
    TERRAIN_FILE,
    NWP_FILE,
    AWS_FILE,
    BASE_TIMESTAMP_UTC,
    LST_AVAILABLE,
    ERA5_LAND_AVAILABLE
)
from src.models.model2_temperature_refinement.feature_engineering import (
    calculate_astronomical_solar_geometry,
    compute_causal_lag_features
)


def verify_model1_integrity() -> tuple:
    """
    Verifies that the frozen Model 1 artifact is intact and matches the recorded SHA-256 hash.
    Returns loaded model object and conformal threshold.
    """
    if not os.path.exists(MODEL1_ARTIFACT_PATH):
        raise FileNotFoundError(f"[FATAL] Model 1 artifact missing: {MODEL1_ARTIFACT_PATH}")
    
    with open(MODEL1_ARTIFACT_PATH, "rb") as f:
        actual_hash = hashlib.sha256(f.read()).hexdigest()
    
    if actual_hash != MODEL1_CHECKSUM_SHA256:
        raise ValueError(
            f"[FATAL CHECKSUM MISMATCH] Model 1 was illegally modified!\n"
            f"Expected: {MODEL1_CHECKSUM_SHA256}\n"
            f"Actual:   {actual_hash}"
        )
    
    bundle = joblib.load(MODEL1_ARTIFACT_PATH)
    return bundle["model"], bundle["q_conformal"], actual_hash


def load_and_align_model2_dataset() -> tuple:
    """
    Loads raw pilot data, applies explicit spatiotemporal joins, extracts Model 1 predictions,
    solar geometry, and returns a verified clean DataFrame and join audit dict.
    """
    m1_model, m1_q, m1_hash = verify_model1_integrity()

    # Load raw arrays
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
    base_time = pd.to_datetime(BASE_TIMESTAMP_UTC)

    # Audit Joins
    n_duplicates = df_aws.duplicated(subset=["station_id", "timestamp_utc"]).sum()
    if n_duplicates > 0:
        raise ValueError(f"[DATA INTEGRITY VIOLATION] Found {n_duplicates} duplicate station-timestamp records!")

    records = []
    timestamp_mismatches = 0
    spatial_mismatches = 0

    for _, row in df_aws.iterrows():
        dt = pd.to_datetime(row["timestamp_utc"])
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

        # Model 1 Upstream Features (Strictly identical to Model 1's trained contract)
        m1_feat = np.array([[
            m_t, m_rh, elev, slp,
            np.sin(asp_rad), np.cos(asp_rad),
            np.sin(2.0 * np.pi * h / 24.0), np.cos(2.0 * np.pi * h / 24.0)
        ]])
        m1_pred = float(m1_model.predict(m1_feat)[0])
        m1_lower = m1_pred - m1_q
        m1_upper = m1_pred + m1_q

        # Astronomical Solar Geometry
        lat, lon = float(row["lat"]), float(row["lon"])
        solar_geom = calculate_astronomical_solar_geometry(dt, lat, lon)

        records.append({
            "station_id": row["station_id"],
            "station_name": row["station_name"],
            "timestamp_utc": row["timestamp_utc"],
            "t_idx": t_idx,
            "lat": lat,
            "lon": lon,
            "grid_x": gx,
            "grid_y": gy,
            "coarse_cell_x": cx,
            "coarse_cell_y": cy,
            "target_temp_c": float(row["temperature_c"]),
            "model1_pred_c": m1_pred,
            "model1_lower_c": m1_lower,
            "model1_upper_c": m1_upper,
            "model1_uncertainty_c": m1_q,
            "coarse_t2m": m_t,
            "coarse_rh": m_rh,
            "coarse_sp": m_sp,
            "coarse_precip": m_pr,
            "elevation_m": elev,
            "slope_deg": slp,
            "aspect_sin": float(np.sin(asp_rad)),
            "aspect_cos": float(np.cos(asp_rad)),
            "cropland_fraction": cf,
            "cos_solar_zenith": solar_geom["cos_solar_zenith"],
            "solar_elevation_deg": solar_geom["solar_elevation_deg"],
            "is_daylight": solar_geom["is_daylight"],
            "hour_sin": float(np.sin(2.0 * np.pi * h / 24.0)),
            "hour_cos": float(np.cos(2.0 * np.pi * h / 24.0)),
            "lst_available": LST_AVAILABLE,
            "era5_land_available": ERA5_LAND_AVAILABLE
        })

    if timestamp_mismatches > 0 or spatial_mismatches > 0:
        raise ValueError(
            f"[JOIN AUDIT FAILED] timestamp_mismatches={timestamp_mismatches}, spatial_mismatches={spatial_mismatches}"
        )

    df_dataset = pd.DataFrame(records)
    # Add strict causal lag features
    df_dataset = compute_causal_lag_features(df_dataset)

    audit_summary = {
        "total_records": len(df_dataset),
        "unique_stations": df_dataset["station_id"].nunique(),
        "timestamps_per_station": 72,
        "timestamp_mismatches": 0,
        "spatial_mismatches": 0,
        "duplicate_records": 0,
        "model1_checksum": m1_hash,
        "model1_conformal_q": m1_q
    }

    return df_dataset, audit_summary
