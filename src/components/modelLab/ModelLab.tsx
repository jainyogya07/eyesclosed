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
  const [expandedModelId, setExpandedModelId] = useState<string | null>('M01');
  const [filterQuery, setFilterQuery] = useState('');

  useEffect(() => {
    async function loadModels() {
      setLoading(true);
      const data = await predictionProvider.getModelCatalog();
      setModels(data);
      setLoading(false);
    }
    loadModels();
  }, []);

  const filteredModels = models.filter(
    (m) =>
      m.model_id.toLowerCase().includes(filterQuery.toLowerCase()) ||
      m.full_name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      m.code_name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      m.status.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const getStatusVariant = (status: string): StatusVariant => {
    switch (status) {
      case 'FROZEN':
        return 'frozen';
      case 'PILOT':
      case 'VALIDATING':
        return 'pilot';
      case 'PRODUCTION':
        return 'live';
      default:
        return 'prototype';
    }
  };

  return (
    <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '2.5rem 1.5rem 6rem 1.5rem', backgroundColor: 'var(--farmora-dark)', minHeight: 'calc(100vh - 120px)' }}>
      {/* Top Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <StatusBadge status="frozen" label="RESEARCH BENCHMARK & REGISTRY" />
          <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--farmora-wheat)' }}>
            10-MODEL HYPERLOCAL STACK
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2.6rem', fontWeight: 800, color: 'var(--farmora-light)', letterSpacing: '-0.025em', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Cpu size={32} color="var(--farmora-lime)" />
              Intelligence Stack (M1–M10 Registry)
            </h1>
            <p style={{ color: 'var(--farmora-platinum)', fontSize: '1.02rem', maxWidth: '720px' }}>
              Cryptographic integrity records, locked pilot verification metrics, and architectural specifications for every layer of the cascade.
            </p>
          </div>

          {/* Search Box */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(251, 251, 251, 0.05)',
              border: '1px solid rgba(182, 178, 67, 0.25)',
              width: '240px'
            }}
          >
            <Search size={16} color="var(--farmora-platinum)" />
            <input
              type="text"
              placeholder="Filter M1–M10..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--farmora-light)',
                fontSize: '0.85rem',
                outline: 'none',
                width: '100%'
              }}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--farmora-platinum)' }}>
          Loading cryptographic model registry...
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filteredModels.map((model) => {
            const isExpanded = expandedModelId === model.model_id;
            const spec = MODEL_SPECS[model.model_id];

            return (
              <div
                key={model.model_id}
                className="farmora-glass-elevated"
                style={{
                  borderRadius: 'var(--radius-xl)',
                  overflow: 'hidden',
                  border: isExpanded ? '1.5px solid var(--farmora-lime)' : '1px solid rgba(182, 178, 67, 0.25)',
                  boxShadow: isExpanded ? '0 0 25px rgba(182, 178, 67, 0.15)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                {/* Header Bar */}
                <div
                  onClick={() => setExpandedModelId(isExpanded ? null : model.model_id)}
                  style={{
                    padding: '20px 24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    background: isExpanded ? 'rgba(182, 178, 67, 0.08)' : 'transparent'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div
                      style={{
                        padding: '6px 14px',
                        borderRadius: 'var(--radius-md)',
                        background: 'rgba(12, 13, 5, 0.8)',
                        border: '1.5px solid var(--farmora-lime)',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 900,
                        fontSize: '1.05rem',
                        color: 'var(--farmora-lime)'
                      }}
                    >
                      {model.model_id}
                    </div>

                    <div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--farmora-light)' }}>
                        {model.full_name}
                      </h3>
                      <div style={{ fontSize: '0.78rem', color: 'var(--farmora-platinum)', fontFamily: 'var(--font-mono)' }}>
                        CODE: {model.code_name} • VER: {model.version} • HASH: {model.checksum_sha256 ? `${model.checksum_sha256.substring(0, 12)}...` : 'LOCKED'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <StatusBadge
                      status={getStatusVariant(model.status)}
                      label={model.status}
                    />
                    {isExpanded ? <ChevronUp size={20} color="var(--farmora-lime)" /> : <ChevronDown size={20} color="var(--farmora-platinum)" />}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div style={{ padding: '0 24px 24px 24px', borderTop: '1px solid rgba(182, 178, 67, 0.15)' }}>
                    {spec && (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginTop: '1.25rem' }}>
                        <div style={{ background: 'rgba(12, 13, 5, 0.8)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(182, 178, 67, 0.2)' }}>
                          <div style={{ fontSize: '0.72rem', color: 'var(--farmora-wheat)', fontWeight: 800, textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
                            CORE PURPOSE
                          </div>
                          <p style={{ fontSize: '0.85rem', color: 'var(--farmora-platinum)', lineHeight: 1.5 }}>
                            {spec.purpose}
                          </p>
                        </div>

                        <div style={{ background: 'rgba(12, 13, 5, 0.8)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(182, 178, 67, 0.2)' }}>
                          <div style={{ fontSize: '0.72rem', color: 'var(--farmora-wheat)', fontWeight: 800, textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
                            TRAINING & INGESTION DATA
                          </div>
                          <p style={{ fontSize: '0.85rem', color: 'var(--farmora-platinum)', lineHeight: 1.5 }}>
                            {spec.data}
                          </p>
                        </div>

                        <div style={{ background: 'rgba(12, 13, 5, 0.8)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(182, 178, 67, 0.2)' }}>
                          <div style={{ fontSize: '0.72rem', color: 'var(--farmora-wheat)', fontWeight: 800, textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
                            MATHEMATICAL / ML FORMULATION
                          </div>
                          <p style={{ fontSize: '0.85rem', color: 'var(--farmora-platinum)', lineHeight: 1.5 }}>
                            {spec.method}
                          </p>
                        </div>

                        <div style={{ background: 'rgba(12, 13, 5, 0.8)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(182, 178, 67, 0.3)' }}>
                          <div style={{ fontSize: '0.72rem', color: 'var(--farmora-lime)', fontWeight: 800, textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
                            VERIFIED VALIDATION BASE
                          </div>
                          <p style={{ fontSize: '0.85rem', color: 'var(--farmora-light)', lineHeight: 1.5, fontWeight: 600 }}>
                            {spec.validation}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Scientific Metric from ModelStatus */}
                    {model.benchmark_metric && (
                      <div style={{ marginTop: '1.25rem' }}>
                        <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--farmora-wheat)', fontWeight: 800, marginBottom: '8px' }}>
                          LOCKED BENCHMARK METRIC:
                        </div>
                        <div
                          style={{
                            display: 'inline-block',
                            padding: '10px 18px',
                            background: 'rgba(22, 24, 10, 0.95)',
                            borderRadius: '8px',
                            border: '1px solid rgba(182, 178, 67, 0.4)'
                          }}
                        >
                          <div style={{ fontSize: '0.7rem', color: 'var(--farmora-platinum)' }}>{model.benchmark_metric.name}</div>
                          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--farmora-lime)', marginTop: '2px' }}>
                            {model.benchmark_metric.value}
                          </div>
                          <div style={{ fontSize: '0.68rem', color: model.benchmark_metric.verified ? '#10b981' : '#f59e0b', marginTop: '4px' }}>
                            {model.benchmark_metric.verified ? '✓ Verified on Locked Test Split' : 'Pending Verification'}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
