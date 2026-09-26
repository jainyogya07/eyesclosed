import React from 'react';
import {
  Database,
  Satellite,
  Radio,
  Layers,
  Thermometer,
  Droplets,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock
} from 'lucide-react';

interface DataSourceItem {
  id: string;
  name: string;
  category: string;
  agency: string;
  status: 'AVAILABLE' | 'PARTIAL' | 'MISSING_PLANNED';
  coverage: string;
  cadence: string;
  resolution: string;
  quality: string;
  notes: string;
}

const DATA_SOURCES: DataSourceItem[] = [
  {
    id: 'aws',
    name: 'IMD Automatic Weather Station (AWS) Telemetry',
    category: 'Ground Truth In-Situ',
    agency: 'India Meteorological Department (IMD)',
    status: 'AVAILABLE',
    coverage: 'Lucknow Cluster (5 Stations: Amausi, BKT, Mohanlalganj, Gosainganj, Malihabad)',
    cadence: 'Hourly (72-hour benchmark file)',
    resolution: 'Point sensor coordinates',
    quality: 'High (Calibrated physical tipping bucket & thermistor)',
    notes: 'Primary ground truth target for Model 1 downscaling and Model 3 rainfall verification.'
  },
  {
    id: 'nwp',
    name: 'Numerical Weather Prediction (NCMRWF / IMD GFS)',
    category: 'Atmospheric Boundary Condition',
    agency: 'NCMRWF / MoES',
    status: 'AVAILABLE',
    coverage: '12 km Coarse Grid over Uttar Pradesh',
    cadence: '00Z / 12Z Operational Cycles',
    resolution: '12 km grid cells',
    quality: 'Operational NWP model output',
    notes: 'Provides coarse 2m temp, humidity, surface pressure, and precip boundary conditions.'
  },
  {
    id: 'dem',
    name: 'Copernicus Global DEM (GLO-30) / SRTM',
    category: 'Terrain Topography',
    agency: 'European Space Agency (Copernicus) / NASA',
    status: 'AVAILABLE',
    coverage: 'Pilot extent (Easting 435k–465k, Northing 2960k–2980k)',
    cadence: 'Static / Immutable',
    resolution: '30m resampled to 1000m UTM',
    quality: 'Cleaned, sink-filled topographic rasters',
    notes: 'Used to derive elevation, slope, aspect, Topographic Wetness Index, and flow direction.'
  },
  {
    id: 'sentinel1',
    name: 'Sentinel-1 C-Band Synthetic Aperture Radar (SAR)',
    category: 'Microwave Satellite Observation',
    agency: 'European Space Agency (Copernicus STAC)',
    status: 'PARTIAL',
    coverage: 'Level-1 Ground Range Detected (GRD) Interferometric Wide',
    cadence: '12-day repeat (6-day constellation)',
    resolution: '10m pixel size',
    quality: 'Gamma-0 / Sigma-0 radiometrically calibrated',
    notes: 'Architecture specified for Model 4 soil moisture retrieval. Active STAC downloader pipeline pending.'
  },
  {
    id: 'sentinel2',
    name: 'Sentinel-2 Multispectral Optical Surface Reflectance (L2A)',
    category: 'Optical Vegetation Reflectance',
    agency: 'European Space Agency (Copernicus)',
    status: 'PARTIAL',
    coverage: 'Bottom-Of-Atmosphere (BOA) Reflectance Tile 44N',
    cadence: '5-day revisit',
    resolution: '10m (B2, B3, B4, B8), 20m (B5, B6, B7, B8A, B11, B12)',
    quality: 'Cloud-masked Scene Classification (SCL)',
    notes: 'Specified for Model 5 crop state and mid-season NDRE chlorophyll estimation.'
  },
  {
    id: 'soilgrids',
    name: 'SoilGrids 250m Physical Texture Catalog',
    category: 'Pedological Soil Map',
    agency: 'ISRIC — World Soil Information',
    status: 'PARTIAL',
    coverage: 'Topsoil (0-5cm) & Subsoil (5-15cm, 15-30cm)',
    cadence: 'Static Global Map',
    resolution: '250m spatial resolution',
    quality: 'Machine-learning pedotransfer estimation',
    notes: 'Supplies clay, sand, silt fractions and organic carbon for hydraulic conductivity and field capacity.'
  },
  {
    id: 'lst',
    name: 'Satellite Land Surface Temperature (MODIS / Landsat)',
    category: 'Thermal Infrared',
    agency: 'NASA LP DAAC / USGS',
    status: 'MISSING_PLANNED',
    coverage: 'Pilot study region',
    cadence: 'Daily (MODIS 1km) / 16-day (Landsat 100m)',
    resolution: '100m–1000m thermal',
    quality: 'Flagged LST_AVAILABLE = False in Model 2 Pilot',
    notes: 'Intentionally excluded in July 2025 pilot due to monsoon cloud occlusion; planned for dry season.'
  }
];

export const DataCenterPage: React.FC = () => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return <span className="badge badge-frozen"><CheckCircle2 size={11} /> VERIFIED & INGESTED</span>;
      case 'PARTIAL':
        return <span className="badge badge-validating"><Clock size={11} /> SPECIFIED & IN PIPELINE</span>;
      case 'MISSING_PLANNED':
      default:
        return <span className="badge badge-unavailable">FUTURE PHASE EXTENSION</span>;
    }
  };

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="badge badge-frozen">Data Governance & Honesty</span>
          <span className="badge badge-pilot">Multi-Modal Telemetry Catalog</span>
        </div>
        <h1 style={{ fontSize: '2.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Database size={32} color="var(--color-atmosphere-blue)" />
          Multi-Modal Geospatial & Sensor Data Catalog
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Transparent audit of all ground sensors, satellite missions, and numerical model boundary conditions. Zero fabricated inputs.
        </p>
      </div>

      {/* Data Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
        {DATA_SOURCES.map((ds) => (
          <div
            key={ds.id}
            className="glass-panel"
            style={{
              padding: '24px',
              background: 'white',
              borderRadius: 'var(--radius-xl)',
              border: ds.status === 'AVAILABLE' ? '1.5px solid var(--border-glow-emerald)' : '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '12px' }}>
              <div>
                <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--color-atmosphere-blue)', fontWeight: 700 }}>
                  {ds.category.toUpperCase()} • {ds.agency}
                </div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginTop: '2px' }}>
                  {ds.name}
                </h3>
              </div>
              {getStatusBadge(ds.status)}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', background: 'var(--bg-surface-subtle)', padding: '14px', borderRadius: 'var(--radius-md)', marginBottom: '14px', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
              <div><strong>COVERAGE:</strong> {ds.coverage}</div>
              <div><strong>CADENCE:</strong> {ds.cadence}</div>
              <div><strong>SPATIAL RES:</strong> {ds.resolution}</div>
              <div><strong>DATA QUALITY:</strong> {ds.quality}</div>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              <strong>Operational Role:</strong> {ds.notes}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
