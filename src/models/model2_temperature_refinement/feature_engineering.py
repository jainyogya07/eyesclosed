"""
Feature engineering functions for Model 2: High-Resolution Temperature Refinement.
Computes astronomical solar geometry, causal lagged states, and upstream Model 1 features.
"""
import numpy as np
import pandas as pd


def calculate_astronomical_solar_geometry(dt_utc: pd.Timestamp, lat: float, lon: float) -> dict:
    """
    Computes solar zenith angle and elevation using standard astronomical ephemeris equations.
    Dynamically captures day-of-year solar declination shifts across seasons.
    """
    doy = dt_utc.timetuple().tm_yday
    gamma = 2.0 * np.pi / 365.0 * (doy - 1 + (dt_utc.hour - 12) / 24.0)

    # Equation of time in minutes
    eot = 229.18 * (
        0.000075 + 0.001868 * np.cos(gamma) - 0.032077 * np.sin(gamma)
        - 0.014615 * np.cos(2.0 * gamma) - 0.040849 * np.sin(2.0 * gamma)
    )

    # Solar declination in radians
    decl = (
        0.006918 - 0.399912 * np.cos(gamma) + 0.070257 * np.sin(gamma)
        - 0.006758 * np.cos(2.0 * gamma) + 0.000907 * np.sin(2.0 * gamma)
    )

    # Local True Solar Time in minutes
    time_offset = eot + 4.0 * lon
    tst_minutes = dt_utc.hour * 60.0 + dt_utc.minute + dt_utc.second / 60.0 + time_offset

    # Solar hour angle in degrees
    ha_deg = (tst_minutes / 4.0) - 180.0
    ha_rad = np.radians(ha_deg)
    lat_rad = np.radians(lat)

    # Cosine of Solar Zenith Angle
    cos_sza = np.sin(lat_rad) * np.sin(decl) + np.cos(lat_rad) * np.cos(decl) * np.cos(ha_rad)
    cos_sza = float(np.clip(cos_sza, -1.0, 1.0))
    sza_deg = float(np.degrees(np.arccos(cos_sza)))
    solar_elev_deg = float(90.0 - sza_deg)

    return {
        "cos_solar_zenith": cos_sza,
        "solar_elevation_deg": solar_elev_deg,
        "is_daylight": float(solar_elev_deg > 0.0)
    }


def compute_causal_lag_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Computes strict causal lag features (previous hour observation T_{t-1}).
    Never uses future information. For initial timestep, falls back to coarse NWP temperature.
    """
    df_sorted = df.sort_values(by=["station_id", "timestamp_utc"]).copy()
    
    # Lag 1-hour within each station
    df_sorted["lag_1h_temp"] = df_sorted.groupby("station_id")["target_temp_c"].shift(1)
    
    # Where lag is NaN (first timestep of station), use coarse NWP as non-leaking fallback
    df_sorted["lag_1h_temp"] = df_sorted["lag_1h_temp"].fillna(df_sorted["coarse_t2m"])
    
    return df_sorted
