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
import { StatusBadge } from '../components/common/StatusBadge';

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
  }
];

export const DataCenterPage: React.FC = () => {
  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2.5rem 1.5rem 6rem 1.5rem', backgroundColor: 'var(--farmora-dark)', minHeight: 'calc(100vh - 120px)' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <StatusBadge status="frozen" label="DATA INGESTION & PIPELINE STATUS" />
          <span className="badge badge-pilot">MULTIMODAL SATELLITE ECOSYSTEM</span>
        </div>
        <h1 style={{ fontSize: '2.6rem', fontWeight: 800, color: 'var(--farmora-light)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Database size={32} color="var(--farmora-lime)" />
          Multimodal Data Center & Sensor Lineage
        </h1>
        <p style={{ color: 'var(--farmora-platinum)', fontSize: '1.02rem', maxWidth: '780px' }}>
          Real-time catalog of satellite constellations, numerical atmospheric models, and ground in-situ Automatic Weather Stations powering Kisaan Ki Yash.
        </p>
      </div>

      {/* Data Source Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {DATA_SOURCES.map((source) => (
          <div
            key={source.id}
            className="farmora-glass-elevated card-hover-tilt"
            style={{
              padding: '24px',
              borderRadius: 'var(--radius-xl)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '12px' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-full)',
                    background: source.status === 'AVAILABLE' ? 'rgba(182, 178, 67, 0.15)' : 'rgba(152, 105, 36, 0.2)',
                    color: source.status === 'AVAILABLE' ? 'var(--farmora-lime)' : 'var(--farmora-wheat)',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    fontFamily: 'var(--font-mono)'
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: source.status === 'AVAILABLE' ? '#B6B243' : '#986924' }} />
                  {source.status}
                </span>

                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--farmora-wheat)' }}>
                  {source.cadence}
                </span>
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--farmora-light)', marginBottom: '4px' }}>
                {source.name}
              </h3>
              <div style={{ fontSize: '0.78rem', color: 'var(--farmora-lime)', fontFamily: 'var(--font-mono)', marginBottom: '12px' }}>
                {source.agency} • {source.category}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem', marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--farmora-platinum)' }}>Resolution:</span>
                  <strong style={{ color: 'var(--farmora-light)' }}>{source.resolution}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--farmora-platinum)' }}>Coverage:</span>
                  <strong style={{ color: 'var(--farmora-wheat)', textAlign: 'right', maxWidth: '220px' }}>{source.coverage}</strong>
                </div>
              </div>
            </div>

            <div style={{ background: 'rgba(12, 13, 5, 0.75)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(182, 178, 67, 0.2)', fontSize: '0.8rem', color: 'var(--farmora-platinum)', lineHeight: 1.5 }}>
              {source.notes}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
