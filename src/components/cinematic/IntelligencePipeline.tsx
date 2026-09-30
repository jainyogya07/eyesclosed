import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import {
  Satellite,
  Layers,
  Thermometer,
  CloudRain,
  Droplets,
  Sprout,
  Cpu,
  AlertTriangle,
  CheckCircle2,
  Info,
  X
} from 'lucide-react';

interface PipelineNode {
  id: string;
  nameEn: string;
  nameHi: string;
  source: string;
  model: string;
  status: 'FROZEN PILOT' | 'PILOT' | 'NOT AVAILABLE' | 'PHYSICS ENGINE' | 'DECISION ENGINE';
  resolution: string;
  description: string;
  icon: React.ReactNode;
}

const NODES: PipelineNode[] = [
  {
    id: 'nwp',
    nameEn: 'NWP Coarse Grid',
    nameHi: 'मौसम पूर्वानुमान ग्रिड',
    source: 'NCMRWF GFS / IMD (12km)',
    model: 'Coarse boundary conditions',
    status: 'FROZEN PILOT',
    resolution: '12 km atmospheric tensor',
    description: 'Ingests numerical weather prediction atmospheric fields (temperature, geopotential height, humidity, pressure).',
    icon: <Thermometer size={18} color="var(--color-atmosphere-blue)" />
  },
  {
    id: 'satellite',
    nameEn: 'Earth Observation',
    nameHi: 'उपग्रह रडार व ऑप्टिकल',
    source: 'Sentinel-1 SAR & Sentinel-2 L2A',
    model: 'Raw backscatter & reflectance',
    status: 'FROZEN PILOT',
    resolution: '10m–20m space telemetry',
    description: 'Extracts cloud-penetrating C-Band radar backscatter and high-resolution optical surface bands.',
    icon: <Satellite size={18} color="var(--color-atmosphere-blue)" />
  },
  {
    id: 'terrain',
    nameEn: 'Copernicus DEM',
    nameHi: 'सतह स्थलाकृति (ऊंचाई/ढलान)',
    source: 'Copernicus GLO-30 / SRTM 30m',
    model: 'Topographic terrain extraction',
    status: 'FROZEN PILOT',
    resolution: '30m resampled to 1km UTM',
    description: 'Derives elevation, slope, aspect, Topographic Wetness Index (TWI) and micro-catchment water channels.',
    icon: <Layers size={18} color="var(--color-earth-emerald)" />
  },
  {
    id: 'm1_m3',
    nameEn: '1-km Downscaler (M1–M3)',
    nameHi: '1-किमी डाउनस्केलिंग',
    source: 'M1 Random Forest + M3 Hurdle',
    model: 'Model 1, Model 2, Model 3',
    status: 'FROZEN PILOT',
    resolution: '1000m × 1000m (EPSG:32644)',
    description: 'Downscales 12km NWP to 1-km field micro-climate with certified 90% conformal intervals.',
    icon: <CloudRain size={18} color="var(--color-atmosphere-blue)" />
  },
  {
    id: 'soil',
    nameEn: 'Soil Moisture (M4)',
    nameHi: 'जमीन की नमी (40cm)',
    source: 'Sentinel-1 SAR + SoilGrids',
    model: 'Model 4 (Soil Hydrology)',
    status: 'NOT AVAILABLE',
    resolution: '1 km / Root zone (40cm)',
    description: 'Retrieves root-zone volumetric water content (0-5cm and 5-40cm) without ground hardware sensors.',
    icon: <Droplets size={18} color="var(--color-earth-emerald)" />
  },
  {
    id: 'crop',
    nameEn: 'Crop State (M5)',
    nameHi: 'फसल बढ़त व स्वास्थ्य',
    source: 'Sentinel-2 NDVI/NDRE + GDD',
    model: 'Model 5 (Phenology Tracker)',
    status: 'NOT AVAILABLE',
    resolution: 'Field parcel scale',
    description: 'Tracks accumulated Growing Degree Days, vegetative vigor, and dynamic crop coefficient (Kc).',
    icon: <Sprout size={18} color="var(--color-earth-emerald)" />
  },
  {
    id: 'ai_engine',
    nameEn: 'Physical ET & Risk (M6–M9)',
    nameHi: 'सिंचाई व आपदा जोखिम',
    source: 'FAO-56 PM & Catchment Hydro',
    model: 'Model 6, Model 8, Model 9',
    status: 'PHYSICS ENGINE',
    resolution: '1 km / Micro-watershed',
    description: 'Computes physical evapotranspiration deficit, micro-topographic waterlogging runoff, and climatological hazards.',
    icon: <Cpu size={18} color="var(--color-quantum-violet)" />
  },
  {
    id: 'decision',
    nameEn: 'Decision Engine (M10)',
    nameHi: 'कृषि निर्णय व सलाह',
    source: 'Multi-Criteria Expected Loss',
    model: 'Model 10 (Decision Engine)',
    status: 'DECISION ENGINE',
    resolution: 'Panchayat & Farmer Parcel',
    description: 'Synthesizes all upstream models into binary action cards (Spray, Irrigate, Harvest) in vernacular Hindi.',
    icon: <CheckCircle2 size={18} color="var(--color-earth-emerald)" />
  }
];

export const IntelligencePipeline: React.FC = () => {
  const { language } = useApp();
  const [selectedNode, setSelectedNode] = useState<PipelineNode | null>(null);

  return (
    <div
      className="glass-panel"
      style={{
        padding: '2rem',
        background: 'white',
        borderRadius: 'var(--radius-xl)',
        marginBottom: '3rem'
      }}
    >
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <span className="badge badge-frozen" style={{ marginBottom: '6px' }}>
            CAUSAL INTELLIGENCE ARCHITECTURE
          </span>
          <h3 style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>
            {language !== 'en' ? 'डेटा से निर्णय तक का सफर (Intelligence Pipeline)' : 'From Raw Telemetry to Farmer Action (Data Flow)'}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Click on any node to inspect data sources, models, resolution, and current readiness status.
          </p>
        </div>
      </div>

      {/* Nodes Flow Diagram */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '12px',
          alignItems: 'stretch'
        }}
      >
        {NODES.map((node, index) => {
          const isSelected = selectedNode?.id === node.id;
          const isFrozen = node.status === 'FROZEN PILOT';
          const isUnavailable = node.status === 'NOT AVAILABLE';

          return (
            <div
              key={node.id}
              onClick={() => setSelectedNode(node)}
              style={{
                background: isSelected ? 'var(--color-atmosphere-subtle)' : 'var(--bg-surface-subtle)',
                border: isSelected ? '2px solid var(--color-atmosphere-blue)' : '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 10px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                position: 'relative',
                transition: 'all 0.15s ease',
                opacity: isUnavailable ? 0.75 : 1
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--shadow-sm)',
                  marginBottom: '8px'
                }}
              >
                {node.icon}
              </div>

              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px', lineHeight: 1.2 }}>
                {language !== 'en' ? node.nameHi : node.nameEn}
              </div>

              <div
                style={{
                  fontSize: '0.65rem',
                  fontFamily: 'var(--font-mono)',
                  color: isFrozen ? 'var(--color-earth-emerald)' : isUnavailable ? 'var(--text-muted)' : 'var(--color-atmosphere-blue)',
                  fontWeight: 600
                }}
              >
                {node.status}
              </div>
            </div>
          );
        })}
      </div>

      {/* Node Inspector Modal/Drawer */}
      {selectedNode && (
        <div
          style={{
            marginTop: '1.5rem',
            background: 'var(--bg-surface-subtle)',
            borderRadius: 'var(--radius-md)',
            border: '1.5px solid var(--border-card)',
            padding: '18px 24px',
            position: 'relative'
          }}
        >
          <button
            onClick={() => setSelectedNode(null)}
            style={{
              position: 'absolute',
              top: '14px',
              right: '14px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)'
            }}
          >
            <X size={18} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge badge-frozen">{selectedNode.status}</span>
            <span style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              RESOLUTION: {selectedNode.resolution}
            </span>
          </div>

          <h4 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '6px' }}>
            {selectedNode.nameEn} ({selectedNode.nameHi})
          </h4>

          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '10px' }}>
            {selectedNode.description}
          </p>

          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
            <div><strong>Source:</strong> {selectedNode.source}</div>
            <div><strong>Engine:</strong> {selectedNode.model}</div>
          </div>
        </div>
      )}
    </div>
  );
};
