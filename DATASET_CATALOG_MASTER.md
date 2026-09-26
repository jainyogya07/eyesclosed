# 🛰️ Kisaan Ki Yash — Master Dataset Catalog & Earth Observation Matrix
### *Authoritative Data Sources, Protocols, APIs, Ground-Truth Networks & Model Mapping*
**Version:** `1.0.0-PROD` | **Project Scope:** `Smart India Hackathon (SIH)` | **Status:** `VERIFIED_OFFICIAL_RESOURCES`

---

## 📑 Master Catalog Navigation

- [1. Data Integrity Principles & The Ground-Truth Axiom](#1-data-integrity-principles--the-ground-truth-axiom)
- [2. Phase 1 — Model 1 Core Downscaling Stack (NWP, Reanalysis, Terrain, Ground Truth)](#2-phase-1--model-1-core-downscaling-stack)
- [3. Phase 2 — Radar & Multispectral Satellite Earth Observation (Sentinel-1 & 2)](#3-phase-2--radar--multispectral-satellite-earth-observation)
- [4. Phase 3 — Land Surface Temperature (LST)](#4-phase-3--land-surface-temperature-lst)
- [5. Phase 4 — Soil Taxonomy, Texture & Hydraulic Properties (SoilGrids)](#5-phase-4--soil-taxonomy-texture--hydraulic-properties-soilgrids)
- [6. Phase 5 — High-Resolution Topography & Geomorphometry (DEM, TWI)](#6-phase-5--high-resolution-topography--geomorphometry)
- [7. Phase 6 — Crop Calendars, Phenology & Yield Statistics](#7-phase-6--crop-calendars-phenology--yield-statistics)
- [8. Phase 7 — Hydrological Networks & Surface Drainage (HydroSHEDS)](#8-phase-7--hydrological-networks--surface-drainage-hydrosheds)
- [9. Phase 8 — Gridded Precipitation & Satellite Precipitation (IMD, GPM)](#9-phase-8--gridded-precipitation--satellite-precipitation-imd-gpm)
- [10. Phase 9 — Land Use & Land Cover Dynamics (ESA WorldCover)](#10-phase-9--land-use--land-cover-dynamics-esa-worldcover)
- [11. Phase 10 — Independent In-Situ Ground Truth Telemetry](#11-phase-10--independent-in-situ-ground-truth-telemetry)
- [12. Comprehensive Model-to-Dataset Cross-Reference Matrix](#12-comprehensive-model-to-dataset-cross-reference-matrix)

---

## 1. Data Integrity Principles & The Ground-Truth Axiom

The **Kisaan Ki Yash** data engineering stack enforces three strict scientific rules:

1. **Reanalysis $\neq$ Ground Truth**: ERA5-Land and NCMRWF are physically consistent numerical models driven by data assimilation. They serve as rich **macro-scale features** or historical baselines, but **NEVER as ground-truth targets** to evaluate 1-km downscaling skill.
2. **True In-Situ Validation**: Downscaled meteorological predictions are validated strictly against physical **IMD Automatic Weather Station (AWS)** telemetry points located within target Panchayats.
3. **Metric Grid Standard**: All spatial rasters are warped and sampled on a local **Projected Coordinate Reference System (UTM / India Equal Area EPSG:7755)** at a fixed physical dimension of **$1000\text{ m} \times 1000\text{ m}$**, preserving true physical scale across latitudes.

---

## 2. Phase 1 — Model 1 Core Downscaling Stack

### 2.1 IMD & NCMRWF Numerical Weather Prediction (NWP)
- **Primary Source**: National Centre for Medium Range Weather Forecasting (NCMRWF) & India Meteorological Department (IMD).
- **Direct Portal**: [NCMRWF Unified Model Data Portal](https://www.ncmrwf.gov.in/) · [IMD GFS Operational Outputs](https://internal.imd.gov.in/)
- **Spatial Resolution**: $0.125^\circ \approx 12\text{ km}$ (NCUM Regional) / $0.25^\circ \approx 25\text{ km}$ (Global GFS).
- **Temporal Resolution**: 6-hourly cycles (00, 06, 12, 18 UTC) out to 240 hours.
- **Key Parameters**:
  - `t2m` (2-meter Air Temperature in K)
  - `r2m` (2-meter Relative Humidity in %)
  - `u10`, `v10` (10-meter Eastward/Northward Wind Components in m/s)
  - `sp` (Surface Pressure in Pa)
  - `tp` (Total Precipitation in m)
  - `ssrd` (Surface Solar Radiation Downwards in $\text{W/m}^2$)
- **Data Format**: WMO GRIB2 / NetCDF4.
- **Access Protocol**: HTTP / OpenDAP / Automated FTP crawler.

### 2.2 ECMWF ERA5-Land Reanalysis
- **Primary Source**: Copernicus Climate Change Service (C3S) / ECMWF.
- **Direct Portal**: [Copernicus Climate Data Store (CDS) ERA5-Land](https://cds.climate.copernicus.eu/datasets/reanalysis-era5-land)
- **Spatial Resolution**: $0.1^\circ \times 0.1^\circ \approx 9\text{ km}$.
- **Temporal Resolution**: Hourly from 1950 to present (real-time lag: ~5 days).
- **Role in Platform**: Macro-atmospheric feature provider and historical baseline for training Model 1 downscaling relationships over Indian states.
- **API Access**: Python `cdsapi` client:
  ```python
  import cdsapi
  client = cdsapi.Client()
  client.retrieve('reanalysis-era5-land', {
      'variable': [
          '2m_temperature', '2m_dewpoint_temperature', 'surface_pressure',
          '10m_u_component_of_wind', '10m_v_component_of_wind', 'surface_solar_radiation_downwards'
      ],
      'year': '2025', 'month': '07', 'day': ['15', '16'],
      'time': [f'{h:02d}:00' for h in range(24)],
      'area': [28.0, 80.0, 26.0, 82.0], # North, West, South, East (e.g., Central UP)
      'format': 'netcdf'
  }, 'era5_land_subset.nc')
  ```

### 2.3 Copernicus Global 30m DEM (GLO-30) & NASA SRTM 30m
- **Primary Source**: European Space Agency (Copernicus) & NASA/USGS.
- **Direct Portals**:
  - [Copernicus GLO-30 on Registry of Open Data on AWS](https://registry.opendata.aws/copernicus-dem/)
  - [OpenTopography High-Resolution Portal](https://opentopography.org/)
  - [NASA Earthdata EarthExplorer](https://earthexplorer.usgs.gov/)
- **Spatial Resolution**: 1 arc-second ($\approx 30\text{ m}$).
- **Role in Platform**: Provides foundational topography. Resampled to $1000\text{ m}$ metric grid to compute elevation, slope, aspect, and roughness tensors for thermal lapse rate correction.
- **Direct S3 URI**: `s3://copernicus-dem-30m/` (Public Open Data bucket).

### 2.4 ESA WorldCover 10m
- **Primary Source**: European Space Agency (ESA) & VITO Remote Sensing.
- **Direct Portal**: [ESA WorldCover Official Portal](https://esa-worldcover.org/en) · [WorldCover AWS S3 Archive](https://registry.opendata.aws/esa-worldcover/)
- **Spatial Resolution**: 10 meters (Global coverage).
- **Classes**: Cropland (Class 40), Tree Cover (10), Shrubland (20), Grassland (30), Built-up (50), Bare / Sparse (60), Water Bodies (80), Herbaceous Wetland (90).
- **Role in Platform**: Resampled to $1000\text{ m}$ fractional land-use percentages (e.g., % cropland, % built-up, % water) to model surface roughness and thermal emissivity variations.

---

## 3. Phase 2 — Radar & Multispectral Satellite Earth Observation

### 3.1 Sentinel-1 C-Band Synthetic Aperture Radar (SAR)
- **Primary Source**: European Space Agency (ESA) Copernicus Programme.
- **Direct Portal**: [Copernicus Data Space Ecosystem (CDSE)](https://dataspace.copernicus.eu/)
- **Sensor Specs**: C-band SAR ($5.405\text{ GHz}$), dual-polarization ($\text{VV} + \text{VH}$), Interferometric Wide (IW) swath mode.
- **Level & Format**: Level-1 Ground Range Detected (GRD), 10m pixel spacing.
- **Revisit Time**: 12 days over Indian sub-continent.
- **Key Parameters Extracted**:
  - Normalized Radar Cross-Section ($\sigma^\circ_{VV}$ in dB)
  - Cross-polarization ($\sigma^\circ_{VH}$ in dB)
  - Polarization Cross-Ratio ($\sigma^\circ_{VH} / \sigma^\circ_{VV}$)
  - Local Incidence Angle ($\theta_{\text{inc}}$)
- **Role in Platform**: **Cloud-penetrating crop structure and surface soil dielectric constant retrieval**. Essential during cloudy Indian monsoon Kharif seasons.

### 3.2 Sentinel-2 Multi-Spectral Instrument (MSI)
- **Primary Source**: ESA Copernicus Programme.
- **Direct Portal**: [Copernicus Data Space Ecosystem (CDSE)](https://dataspace.copernicus.eu/)
- **Level & Format**: Level-2A Bottom-of-Atmosphere (BOA) surface reflectance (SAFE / Cloud-Optimized GeoTIFF).
- **Bands Utilized**:
  - B2 (Blue, 490 nm - 10m)
  - B3 (Green, 560 nm - 10m)
  - B4 (Red, 665 nm - 10m)
  - B5, B6, B7 (Red Edge 1, 2, 3 - 20m)
  - B8 (Broad NIR, 842 nm - 10m)
  - B8A (Narrow NIR, 865 nm - 20m)
  - B11, B12 (Shortwave Infrared SWIR-1, SWIR-2 - 20m)
  - SCL (Scene Classification Layer - 20m cloud, cloud shadow, water mask)
- **Derived Vegetation Indices**:
  - $\text{NDVI} = \frac{\text{B8} - \text{B4}}{\text{B8} + \text{B4}}$ (General vegetative vigor)
  - $\text{NDRE} = \frac{\text{B8} - \text{B5}}{\text{B8} + \text{B5}}$ (Canopy chlorophyll content, non-saturating)
  - $\text{EVI} = 2.5 \times \frac{\text{B8} - \text{B4}}{\text{B8} + 6\text{B4} - 7.5\text{B2} + 1}$ (Atmospherically corrected biomass)
  - $\text{NDWI} = \frac{\text{B8} - \text{B11}}{\text{B8} + \text{B11}}$ (Plant canopy liquid water content)

---

## 4. Phase 3 — Land Surface Temperature (LST)

### 4.1 MODIS & Sentinel-3 LST
- **Primary Source**: NASA LP DAAC / USGS & ESA Copernicus.
- **Direct Portals**:
  - [NASA Earthdata MODIS (MOD11A1 / MYD11A1)](https://lpdaac.usgs.gov/products/mod11a1v061/)
  - [Copernicus Sentinel-3 SLSTR LST](https://dataspace.copernicus.eu/)
- **Spatial Resolution**: 1 km daily (MODIS) / 1 km twice-daily (Sentinel-3 SLSTR).
- **Role in Platform**:
  - **Model 2 (Temperature Refinement)**: Provides ground skin temperature to compute diurnal thermal amplitude and localized micro-climate heating.
  - **Model 4 (Soil Moisture)**: Optical/Thermal Trapezoid Model (OPTRAM) linking normalized LST with NDVI to determine thermal inertia and evaporative drying.

---

## 5. Phase 4 — Soil Taxonomy, Texture & Hydraulic Properties

### 5.1 ISRIC SoilGrids 250m v2.0
- **Primary Source**: International Soil Reference and Information Centre (ISRIC).
- **Direct Portals**:
  - [ISRIC SoilGrids Official Portal](https://www.isric.org/explore/soilgrids)
  - [SoilGrids Web Coverage Service (WCS)](https://maps.isric.org/)
  - [Direct WebDAV / HTTPS Bulk Directory](https://files.isric.org/soilgrids/latest/data/)
- **Spatial Resolution**: 250 meters global.
- **Standard Depth Intervals**: `0-5cm`, `5-15cm`, `15-30cm`, `30-60cm`, `60-100cm`, `100-200cm`.
- **Soil Properties Extracted**:
  - `clay`: Clay content (0–2 $\mu\text{m}$) in g/kg
  - `sand`: Sand content (50–2000 $\mu\text{m}$) in g/kg
  - `silt`: Silt content (2–50 $\mu\text{m}$) in g/kg
  - `soc`: Soil organic carbon content in dg/kg
  - `bdod`: Bulk density of the fine earth fraction in cg/$\text{cm}^3$
  - `phh2o`: Soil pH in $\text{H}_2\text{O} \times 10$
  - `cec`: Cation Exchange Capacity in mmol(c)/kg
- **Hydrological Pedotransfer Derivation**:
  - **Field Capacity ($\theta_{\text{FC}}$)**:
    $$\theta_{\text{FC}} = 0.2576 - 0.0020 \times \text{Sand}\% + 0.0036 \times \text{Clay}\% + 0.0299 \times \text{SOC}\%$$
  - **Permanent Wilting Point ($\theta_{\text{PWP}}$)**:
    $$\theta_{\text{PWP}} = 0.0260 + 0.0050 \times \text{Clay}\% + 0.0158 \times \text{SOC}\%$$
  - **Plant Available Water Capacity (PAWC)**:
    $$\text{PAWC} = \theta_{\text{FC}} - \theta_{\text{PWP}}$$

---

## 6. Phase 5 — High-Resolution Topography & Geomorphometry

### 6.1 Topographic Derivatives from 30m DEM
- **Primary Source**: Derived from SRTM 30m / Copernicus GLO-30.
- **Primary Computational Tool**: GDAL DEM utilities + RichDEM / WhiteboxTools.
- **Derived Physical Layers (1000m Metric Grid)**:
  - **Elevation ($Z$)**: Mean elevation above sea level in meters.
  - **Slope ($\beta$)**: First spatial derivative in degrees ($0^\circ - 90^\circ$).
  - **Aspect ($\alpha$)**: Direction of maximum slope in radians, decomposed into:
    $$\text{Aspect}_{\text{North}} = \cos(\alpha), \quad \text{Aspect}_{\text{East}} = \sin(\alpha)$$
  - **Topographic Wetness Index (TWI)**:
    $$\text{TWI} = \ln\left(\frac{A_s}{\tan \beta}\right)$$
    Where $A_s$ is specific upslope contributing catchment area ($\text{m}^2/\text{m}$).
  - **Terrain Ruggedness Index (TRI)** & **Profile Curvature**.
- **Role in Platform**: Controls orographic wind redirection, cold-air pooling in valleys, and gravitational drainage in Models 1, 2, and 8.

---

## 7. Phase 6 — Crop Calendars, Phenology & Yield Statistics

### 7.1 Ministry of Agriculture & Directorate of Economics and Statistics (DES)
- **Primary Source**: Ministry of Agriculture & Farmers Welfare, Government of India.
- **Direct Portals**:
  - [Directorate of Economics & Statistics (DES Agricoop)](https://desagri.gov.in/)
  - [Area Production Yield (APY) State-District Portal](https://aps.dac.gov.in/APY/Index.aspx)
  - [Open Government Data (OGD) India](https://data.gov.in/)
- **Attributes Available**:
  - State $\rightarrow$ District $\rightarrow$ Crop $\rightarrow$ Season (Kharif / Rabi / Zaid)
  - Sowing / Harvesting window calendars
  - Historical Gross Cropped Area (Hectares)
  - Annual Production (Tonnes) and Average Yield (kg/Hectare)
- **Scientific Caveat**: District-level historical records from APY are stored at their true spatial administrative level and **never interpolated artificially to village fields without satellite calibration**.

---

## 8. Phase 7 — Hydrological Networks & Surface Drainage

### 8.1 HydroSHEDS & JRC Global Surface Water
- **Primary Source**: WWF, USGS & European Commission Joint Research Centre (JRC).
- **Direct Portals**:
  - [HydroSHEDS Global Hydrological Data](https://www.hydrosheds.org/)
  - [JRC Global Surface Water Explorer](https://global-surface-water.appspot.com/)
- **Features Provided**:
  - Void-filled elevation models conditioned on river networks (HydroDEM)
  - High-resolution flow direction (DIR) and flow accumulation (ACC)
  - Vector stream networks at multiple Pfafstetter basin hierarchy levels (BasinATLAS)
  - 38-year seasonal surface water recurrence frequency (JRC)
- **Role in Platform**: **Model 8 (Flood & Waterlogging Risk)** computes exact distance to permanent drainage channels and upslope accumulation thresholds.

---

## 9. Phase 8 — Gridded Precipitation & Satellite Precipitation

### 9.1 IMD Gridded Rainfall Datasets
- **Primary Source**: India Meteorological Department (National Climate Centre, Pune).
- **Direct Portal**: [IMD Pune Gridded Data Portal](https://imdpune.gov.in/cmpg/Griddata/)
- **Spatial Resolution**: $0.25^\circ \times 0.25^\circ$ daily gridded rainfall (interpolated from ~6,000 rain gauges).
- **Temporal Coverage**: 1901 to Present.
- **Role in Platform**: Long-term climatological anomaly calculation (Model 9) and regional training historical baselines.

### 9.2 NASA GPM IMERG (Integrated Multi-satellitE Retrievals)
- **Primary Source**: NASA Goddard Earth Sciences Data and Information Services Center (GES DISC).
- **Direct Portal**: [NASA GPM IMERG Portal](https://gpm.nasa.gov/data/imerg) · [NASA Earthdata Search](https://search.earthdata.nasa.gov/)
- **Spatial Resolution**: $0.1^\circ \times 0.1^\circ \approx 10\text{ km}$.
- **Temporal Cadence**: Half-hourly (Early, Late, and Final calibrated runs).
- **Role in Platform**: High-frequency auxiliary precipitation predictor for Model 3.

---

## 10. Phase 9 — Land Use & Land Cover Dynamics

### 10.1 Multi-Temporal Land Cover & Crop Maps
- **Primary Sources**:
  - **ESA WorldCover 10m** (2020, 2021 global baseline): [ESA WorldCover](https://esa-worldcover.org/en)
  - **ISRO Bhuvan Thematic LULC**: [ISRO Bhuvan LULC 1:50,000](https://bhuvan-app1.nrsc.gov.in/thematic/thematic/index.php)
  - **Dynamic World 10m (Near Real-time LULC)**: [Dynamic World on Google Earth Engine](https://dynamicworld.app/)
- **Variables Used in Models**:
  - Fractional vegetation cover percentage ($FVC$)
  - Impervious surface fraction (built-up runoff impact)
  - Crop parcel field boundary delineations

---

## 11. Phase 10 — Independent In-Situ Ground Truth Telemetry

### 11.1 IMD Automatic Weather Station (AWS) Network
- **Primary Source**: India Meteorological Department (Mausam / AWS Portal).
- **Direct Portal**: [IMD AWS Live Portal](https://aws.imd.gov.in/) · [IMD Mausam National Weather Service](https://mausam.imd.gov.in/)
- **Network Extent**: ~1,200 AWS and ~1,500 Automatic Rain Gauges (ARG) across India.
- **Telemetry Parameters**:
  - Hourly Station Air Temperature ($^\circ\text{C}$)
  - Hourly Relative Humidity (%)
  - Hourly Accumulated Rainfall ($\text{mm}$)
  - Hourly Mean Wind Speed ($\text{m/s}$) and Wind Direction ($^\circ$)
  - Station Atmospheric Pressure ($\text{hPa}$)
  - Solar Insolation ($\text{W/m}^2$)
- **Access Protocol**: Hourly scrape / official API integration.
- **Data Role**: **The absolute ground truth benchmark for Model 1 downscaling validation**.

---

## 12. Comprehensive Model-to-Dataset Cross-Reference Matrix

| Model ID | Model Name | Primary Input Datasets | Secondary / Auxiliary Datasets | Ground-Truth Validation Target | Priority Level |
|---|---|---|---|---|---|
| **Model 1** | **Hyperlocal Weather Downscaling** | IMD/NCMRWF NWP (12-25km), ERA5-Land, Copernicus GLO-30 DEM | ESA WorldCover 10m, Topographic derivatives (Slope/Aspect) | **IMD AWS Station Observations** | 🟢 **ACTIVE (Phase 1)** |
| **Model 2** | **Temperature Refinement** | Model 1 Output, Copernicus DEM 1km | MODIS/Sentinel-3 LST, Aspect, Land cover emissivity | IMD AWS Air Temperature ($T_{\max}, T_{\min}$) | 🟡 Phase 2 |
| **Model 3** | **Precipitation Downscaling** | Model 1 Output, NWP Precipitation, GPM IMERG | SRTM DEM, Slope, TWI, Coastal/orographic masks | IMD AWS & ARG Hourly Gauge Records | 🟡 Phase 2 |
| **Model 4** | **Soil Moisture Intelligence** | Sentinel-1 SAR ($\text{VV}, \text{VH}$), Sentinel-2 MSI (NDVI) | SoilGrids 250m, Model 1 Weather, LST | Ground TDR In-Situ Soil Moisture Probes | 🟡 Phase 2 |
| **Model 5** | **Crop State & Phenology** | Sentinel-2 Time-series (NDVI, NDRE, EVI), Sentinel-1 SAR | GDD from Model 1/2, DES Crop Calendar | Field ground truth / State Crop Surveys | 🟡 Phase 2 |
| **Model 6** | **ET & Irrigation Demand** | Model 1 Weather (Temp, RH, Wind, Radiation), Model 5 ($K_c$) | Model 4 Soil Moisture, Model 3 Rain Forecast | Lysimeter / Eddy Covariance flux data / Farm logs | 🟡 Phase 2 |
| **Model 7** | **Crop Yield Forecasting** | Accumulated Weather (GDD, Deficit), Sentinel-2 Biomass | SoilGrids (SOC, Clay), District Historical APY | District Crop Cutting Experiments (CCE) | 🟠 Phase 3 |
| **Model 8** | **Flood & Waterlogging Risk** | Model 3 Downscaled Rain (1h, 24h), HydroSHEDS DEM | Flow Accumulation, TWI, ESA WorldCover, Soil texture | Sentinel-1 Emergency Flood Inundation Maps | 🟠 Phase 3 |
| **Model 9** | **Extreme Hazards Intelligence** | Model 1, 2, 3 Daily Weather Time-series | 30-year IMD Climatological Percentiles ($P_{90}, P_{95}, P_{99}$) | Historical Disaster Records / IMD Warnings | 🟠 Phase 3 |
| **Model 10** | **Agricultural Decision Engine** | Outputs of Models 1 through 9 | FAO-56 Agronomic Rules, CQR Uncertainty Bounds | Agronomist Advisory Consensus & Water Savings | 🔴 Phase 4 |

---
*Authored for Kisaan Ki Yash — SIH Master Data Governance & Architecture.*
