import React, { useState, useEffect } from 'react';
import { predictionProvider } from '../../providers';
import { ModelStatus } from '../../types/contracts';
import { StatusBadge, StatusVariant } from '../common/StatusBadge';
import {
  Cpu,
  Lock,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Search,
  Database,
  Sliders,
  Layers,
  FileCode,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

interface ModelDetailSpec {
  purpose: string;
  data: string;
  method: string;
  validation: string;
  limitations: string;
}

const MODEL_SPECS: Record<string, ModelDetailSpec> = {
  M01: {
    purpose: 'Downscale coarse 12-km numerical weather predictions to 1000m x 1000m resolution over complex terrain.',
    data: 'NCMRWF GFS 12km NWP + Copernicus GLO-30 DEM + In-situ IMD AWS ground telemetry (Amausi, BKT, Mohanlalganj).',
    method: 'Topographically-conditioned gradient boosted regression incorporating elevation lapse rates, aspect, and solar irradiance.',
    validation: 'Locked test station AWS_LKO_05: MAE 0.4083°C, RMSE 0.5233°C, R² 0.9827. 39.89% error reduction over raw NWP.',
    limitations: 'Calibrated exclusively on the 72-hour Lucknow July pilot dataset. Not yet validated across high-relief Himalayan or coastal zones.'
  },
  M02: {
    purpose: 'Microclimate surface temperature refinement incorporating canopy density and land cover indices.',
    data: 'M1 predictions + Landsat/Sentinel-2 NDVI/NDRE vegetation proxies + ground AWS telemetry.',
    method: 'Residual refinement tree with spatial regularization and conformal uncertainty bounds.',
    validation: 'Locked test station AWS_LKO_05: MAE 0.4113°C. Did not improve upon M1 baseline (+0.0030°C difference). M1 remains active baseline.',
    limitations: 'Limited canopy variation in the 72h pilot area. Retained as frozen scientific experiment demonstrating zero-leakage honesty.'
  },
  M03: {
    purpose: 'Hyperlocal hourly precipitation downscaling with two-stage occurrence and intensity estimation.',
    data: 'NCMRWF coarse precipitation + IMD AWS tipping bucket ground telemetry + topographic wetness index.',
    method: 'Two-stage Hurdle formulation (Binary logistic occurrence + log-normal / gamma intensity regression).',
    validation: 'Locked test station AWS_LKO_05: Expected Hurdle RMSE 0.9725 mm/h (15.0% error reduction vs raw NWP 1.1438 mm/h). MAE 0.7535 mm/h.',
    limitations: 'Pilot dataset contains only 8 rainy hours in locked test. Defensible for pilot feasibility; requires monsoon expansion before production.'
  },
  M04: {
    purpose: 'Root-zone (0-30cm) soil moisture estimation combining Sentinel-1 SAR and pedological profiles.',
    data: 'Sentinel-1 C-band SAR (VV/VH backscatter) + SoilGrids 250m sand/silt/clay fractions + M3 rainfall.',
    method: 'Water Cloud Model inversion + Random Forest regression estimating Volumetric Water Content (VWC %).',
    validation: 'Architecture specified. Awaiting active training slot.',
    limitations: 'SAR repeat cycle is 12 days; interpolated using physical soil water balance.'
  },
  M05: {
    purpose: 'Crop growth stage (phenology) detection and leaf chlorophyll nitrogen status.',
    data: 'Sentinel-2 Multispectral MSI (RedEdge, NIR) + thermal accumulation (Growing Degree Days).',
    method: 'Time-series curve fitting of NDVI/EVI and thermal GDD tracking against physiological milestones.',
    validation: 'Architecture specified. Awaiting active training slot.',
    limitations: 'Cloud cover during peak monsoon requires SAR backscatter cross-calibration.'
  },
  M06: {
    purpose: 'Hyperlocal evapotranspiration (ET) and net irrigation crop water demand.',
    data: 'FAO-56 Penman-Monteith physical equations driven by M1 temperature, radiation, humidity, and M5 crop coefficients.',
    method: 'Deterministic physical thermodynamic engine calculating reference ETo and crop-adjusted ETc.',
    validation: 'Calibrated against standard FAO-56 irrigation tables for Paddy and Mango.',
    limitations: 'Requires canal scheduling and groundwater pump flow telemetry for closed-loop balance.'
  },
  M07: {
    purpose: 'Mid-season and pre-harvest crop yield estimation at Panchayat cluster resolution.',
    data: 'Integrated seasonal GDD + cumulative ET + Sentinel-2 biophysical vegetation index time-series.',
    method: 'Hybrid biophysical process-guided machine learning (WOFOST-ML bridge).',
    validation: 'Specification stage.',
    limitations: 'Requires multi-year historical crop cutting experiments (CCE) ground truth.'
  },
  M08: {
    purpose: 'Micro-topographic inundation and pluvial flash-flood susceptibility mapping.',
    data: 'Copernicus 30m DEM + Topographic Wetness Index (TWI) + M3 short-duration rainfall shock.',
    method: '2D hydrodynamic shallow-water physical overland flow proxy routing.',
    validation: 'Specification stage.',
    limitations: 'Drainage culvert and localized canal embankment micro-features require centimeter RTK survey.'
  },
  M09: {
    purpose: 'Extreme agricultural climatological hazard early warning (heatwave, frost, convective storm).',
    data: 'Long-term IMD 30-year climatology + downscaled M1/M3 ensemble forecasts.',
    method: 'Extreme Value Theory (EVT) Generalized Pareto Distribution anomaly detection.',
    validation: 'Prototype climatological threshold engine.',
    limitations: 'Extreme events are rare by definition; uncertainty intervals widen at 99th percentile.'
  },
  M10: {
    purpose: 'Master agricultural decision intelligence: converting complex physics into unequivocal vernacular action.',
    data: 'Causal multi-model synthesis combining M1 through M9 outputs + energy & chemical cost models.',
    method: 'Constrained agronomic decision rules with automated Conformal Prediction abstention gate.',
    validation: 'Operational prototype delivering verified vernacular cards (e.g. "Hold Irrigation Today").',
    limitations: 'Advisories are decision-support recommendations; final on-field execution is with the farmer.'
  }
};

export const ModelLab: React.FC = () => {
  const [models, setModels] = useState<ModelStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedModelId, setExpandedModelId] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await predictionProvider.getModelCatalog();
      setModels(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const getStatusType = (status: string, modelId: string): StatusVariant => {
    if (modelId === 'M01' || modelId === 'M02' || modelId === 'M03') return 'frozen';
    if (modelId === 'M06') return 'prototype';
    if (modelId === 'M09' || modelId === 'M10') return 'prototype';
    return 'unavailable';
  };

  const filteredModels = models.filter(
    (m) =>
      m.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.model_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.code_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem 5rem 1.5rem' }}>
      {/* Research Instrument Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <StatusBadge status="frozen" label="RESEARCH INSTRUMENT & REGISTRY" />
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            10-STAGE CASCADE
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Cpu size={28} color="var(--color-atmosphere-blue)" />
              Model Intelligence Lab (M1–M10)
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Cryptographic artifact registry tracking the 10 sequential climate and agronomic decision models.
            </p>
          </div>

          {/* Search Filter */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'white',
              border: '1px solid var(--border-card)',
              borderRadius: 'var(--radius-full)',
              padding: '8px 16px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <Search size={16} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search M1–M10..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                fontFamily: 'var(--font-body)',
                fontSize: '0.85rem',
                color: 'var(--text-primary)',
                width: '160px'
              }}
            />
          </div>
        </div>
      </div>

      {/* Single-Active Training Slot Notice */}
      <div
        className="glass-panel"
        style={{
          padding: '14px 18px',
          background: 'white',
          borderLeft: '4px solid var(--color-earth-emerald)',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShieldCheck size={20} color="var(--color-earth-emerald)" />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Single-Active Training Queue Invariant: Strictly enforced across all 10 stages.
          </span>
        </div>
        <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
          M1–M3: FROZEN PILOT | M4–M10: SPECIFICATION / PROTOTYPE
        </div>
      </div>

      {/* Model List (Instrument Look - Collapsed by Default) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredModels.map((m) => {
          const isExpanded = expandedModelId === m.model_id;
          const statusType = getStatusType(m.status, m.model_id);
          const spec = MODEL_SPECS[m.model_id];

          return (
            <div
              key={m.model_id}
              className="glass-panel"
              style={{
                background: 'white',
                borderRadius: 'var(--radius-lg)',
                border: isExpanded ? '1.5px solid var(--color-atmosphere-blue)' : '1px solid var(--border-subtle)',
                overflow: 'hidden',
                transition: 'all 0.2s ease',
                boxShadow: isExpanded ? 'var(--shadow-md)' : 'var(--shadow-sm)'
              }}
            >
              {/* Row Header (Click to Expand / Collapse) */}
              <div
                onClick={() => setExpandedModelId(isExpanded ? null : m.model_id)}
                style={{
                  padding: '18px 24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.95rem',
                      fontWeight: 800,
                      color: 'var(--color-atmosphere-blue)',
                      minWidth: '42px'
                    }}
                  >
                    {m.model_id}
                  </span>

                  <div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {m.full_name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      STAGE {m.stage_order} • {m.framework} • {m.spatial_resolution}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <StatusBadge status={statusType} />
                  {isExpanded ? <ChevronUp size={18} color="var(--text-muted)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
                </div>
              </div>

              {/* Collapsed by Default -> Expanded Research Instrument View */}
              {isExpanded && (
                <div
                  style={{
                    padding: '0 24px 24px 24px',
                    borderTop: '1px solid var(--border-subtle)',
                    background: 'var(--bg-surface-subtle)'
                  }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', paddingTop: '18px' }}>
                    {/* Purpose */}
                    <div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
                        PURPOSE
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        {spec?.purpose || m.full_name}
                      </p>
                    </div>

                    {/* Data */}
                    <div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
                        INPUT DATA
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        {spec?.data || m.dependencies.join(', ')}
                      </p>
                    </div>

                    {/* Method */}
                    <div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
                        METHODOLOGY & ARCHITECTURE
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        {spec?.method || m.framework}
                      </p>
                    </div>

                    {/* Validation */}
                    <div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
                        VALIDATION STATUS
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-earth-emerald)', fontWeight: 600, lineHeight: 1.5 }}>
                        {spec?.validation || 'Specification defined.'}
                      </p>
                    </div>

                    {/* Limitations */}
                    <div style={{ gridColumn: '1 / -1' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-solar-amber)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
                        KNOWN LIMITATIONS & SCIENTIFIC BOUNDS
                      </div>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        {spec?.limitations || 'Under research protocol.'}
                      </p>
                    </div>
                  </div>

                  {/* SHA-256 Checksum */}
                  {m.checksum_sha256 && (
                    <div
                      style={{
                        marginTop: '16px',
                        padding: '8px 12px',
                        background: 'white',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '0.72rem',
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <FileCode size={14} color="var(--color-quantum-violet)" />
                      <span>CRYPTOGRAPHIC SHA-256 HASH: {m.checksum_sha256}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
