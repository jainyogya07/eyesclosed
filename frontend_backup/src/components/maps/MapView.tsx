import React, { useState, useEffect, useRef } from 'react';
import {
  Thermometer,
  CloudRain,
  Wind,
  AlertTriangle,
  Droplets,
  Layers,
  Sparkles,
  Info,
  ChevronRight,
  ShieldCheck,
  Maximize2
} from 'lucide-react';
import { ScientificDrawer } from '../common/ScientificDrawer';

export interface GridCell {
  id: string;
  x: number;
  y: number;
  elevation_m: number;
  temp_c: number;
  rain_mm: number;
  rain_prob_pct: number;
  wind_kmh: number;
  soil_vwc: number;
  flood_risk: string;
  advisory: string;
}

// Deterministic 8x6 Grid Cells representing 1km x 1km cells in Lucknow / Malihabad cluster
const CELLS: GridCell[] = [];
for (let r = 0; r < 6; r++) {
  for (let c = 0; c < 8; c++) {
    const elev = 120 + Math.round(Math.sin(r * 0.8) * 6 + Math.cos(c * 0.8) * 8);
    const temp = +(28.8 - (elev - 120) * 0.0065 - (r === 2 && c === 3 ? 0.8 : 0)).toFixed(1);
    const distToCenter = Math.hypot(r - 2.5, c - 3.5);
    const rain = distToCenter < 1.8 ? +(12.4 - distToCenter * 3.8).toFixed(1) : +(0.4 + (r % 2) * 0.3).toFixed(1);
    const rainProb = distToCenter < 1.8 ? Math.round(84 - distToCenter * 10) : Math.round(15 + (r + c) * 3);
    const wind = Math.round(12 + Math.sin(c * 0.5) * 5 + r * 1.2);
    const soil = +(24 + rain * 0.7 + (elev < 122 ? 5 : 0)).toFixed(1);
    const isFlood = elev < 122 && rain > 6.0;

    CELLS.push({
      id: `UTM44N_${440 + c}_${2965 + r}`,
      x: c,
      y: r,
      elevation_m: elev,
      temp_c: temp,
      rain_mm: rain,
      rain_prob_pct: rainProb,
      wind_kmh: wind,
      soil_vwc: soil,
      flood_risk: isFlood ? 'HIGH' : rain > 5 ? 'MODERATE' : 'LOW',
      advisory: isFlood ? 'जलभराव जोखिम — जल निकासी मार्ग खोलें' : rain > 5 ? 'सिंचाई रोकें — पर्याप्त वर्षा' : 'सामान्य कृषि कार्य उपयुक्त'
    });
  }
}

export type MapMetricMode = 'temp' | 'rain' | 'wind' | 'risk';

interface MapViewProps {
  activeMetric?: MapMetricMode;
  onSelectMetric?: (mode: MapMetricMode) => void;
  selectedHorizon?: string;
}

export const MapView: React.FC<MapViewProps> = ({
  activeMetric: propActiveMetric,
  onSelectMetric,
  selectedHorizon = 'Now'
}) => {
  const [internalMetric, setInternalMetric] = useState<MapMetricMode>('temp');
  const activeMetric = propActiveMetric || internalMetric;
  const handleSelectMetric = onSelectMetric || setInternalMetric;

  const [selectedCell, setSelectedCell] = useState<GridCell | null>(CELLS[19]); // Center default cell
  const [hoveredCell, setHoveredCell] = useState<GridCell | null>(null);

  const getCellColor = (cell: GridCell): string => {
    switch (activeMetric) {
      case 'temp': {
        const ratio = Math.max(0, Math.min(1, (cell.temp_c - 27.5) / 2.0));
        return `hsl(${220 - ratio * 180}, 85%, 62%)`;
      }
      case 'rain': {
        if (cell.rain_mm < 0.5) return 'rgba(226, 232, 240, 0.55)';
        const intensity = Math.min(1, cell.rain_mm / 14);
        return `rgba(2, 132, 199, ${0.4 + intensity * 0.55})`;
      }
      case 'wind': {
        const intensity = Math.min(1, cell.wind_kmh / 25);
        return `rgba(56, 189, 248, ${0.35 + intensity * 0.6})`;
      }
      case 'risk': {
        if (cell.flood_risk === 'HIGH') return 'rgba(220, 38, 38, 0.85)';
        if (cell.flood_risk === 'MODERATE') return 'rgba(217, 119, 6, 0.75)';
        return 'rgba(16, 185, 129, 0.4)';
      }
    }
  };

  const inspected = hoveredCell || selectedCell;

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Map Viewport Box with Holographic Overlays */}
      <div
        className="cinematic-glass-elevated"
        style={{
          position: 'relative',
          minHeight: '70vh',
          borderRadius: 'var(--radius-xl)',
          border: '2px solid rgba(255, 255, 255, 0.85)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px -15px rgba(0,0,0,0.3)',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.92) 100%)',
          color: 'white'
        }}
      >
        {/* Subtle satellite scanline backdrop */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url(/assets/cinematic/satellite_grid.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.18,
            pointerEvents: 'none'
          }}
        />

        {/* Floating Minimal Controls (Top Overlay) */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            padding: '18px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(12px)'
          }}
        >
          {/* Metric Selector Pills */}
          <div
            style={{
              display: 'flex',
              gap: '6px',
              padding: '4px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--radius-full)',
              border: '1px solid rgba(255, 255, 255, 0.15)'
            }}
          >
            <button
              onClick={() => handleSelectMetric('temp')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                background: activeMetric === 'temp' ? 'var(--color-atmosphere-blue)' : 'transparent',
                color: 'white',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Thermometer size={16} />
              <span>तापमान (Temp)</span>
            </button>

            <button
              onClick={() => handleSelectMetric('rain')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                background: activeMetric === 'rain' ? 'var(--color-atmosphere-blue)' : 'transparent',
                color: 'white',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <CloudRain size={16} />
              <span>वर्षा (Rain)</span>
            </button>

            <button
              onClick={() => handleSelectMetric('wind')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                background: activeMetric === 'wind' ? 'var(--color-atmosphere-blue)' : 'transparent',
                color: 'white',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Wind size={16} />
              <span>हवा (Wind)</span>
            </button>

            <button
              onClick={() => handleSelectMetric('risk')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                background: activeMetric === 'risk' ? 'var(--color-hazard-crimson)' : 'transparent',
                color: 'white',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <AlertTriangle size={16} />
              <span>जोखिम (Risk)</span>
            </button>
          </div>

          {/* Grid Metadata Chip */}
          <div
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              fontSize: '0.78rem',
              fontFamily: 'var(--font-mono)',
              color: '#38bdf8'
            }}
          >
            GRID: 1000m × 1000m • UTM 44N • TIME: {selectedHorizon}
          </div>
        </div>

        {/* 1-km Precision Grid Stage */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem 1.5rem',
            position: 'relative'
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(8, 1fr)',
              gap: '10px',
              width: '100%',
              maxWidth: '860px',
              aspectRatio: '8/6',
              position: 'relative',
              zIndex: 2
            }}
          >
            {CELLS.map((cell) => {
              const isSelected = selectedCell?.id === cell.id;
              const isHovered = hoveredCell?.id === cell.id;

              return (
                <div
                  key={cell.id}
                  onClick={() => setSelectedCell(cell)}
                  onMouseEnter={() => setHoveredCell(cell)}
                  onMouseLeave={() => setHoveredCell(null)}
                  style={{
                    position: 'relative',
                    aspectRatio: '1/1',
                    background: getCellColor(cell),
                    borderRadius: 'var(--radius-md)',
                    border: isSelected
                      ? '3px solid #38bdf8'
                      : isHovered
                      ? '2px solid white'
                      : '1px solid rgba(255,255,255,0.4)',
                    cursor: 'pointer',
                    boxShadow: isSelected
                      ? '0 0 25px rgba(56, 189, 248, 0.8)'
                      : isHovered
                      ? '0 0 15px rgba(255,255,255,0.5)'
                      : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease',
                    transform: isSelected || isHovered ? 'scale(1.08)' : 'scale(1)',
                    zIndex: isSelected ? 5 : isHovered ? 4 : 1
                  }}
                >
                  <span
                    style={{
                      fontSize: 'clamp(0.72rem, 1.2vw, 0.95rem)',
                      fontWeight: 800,
                      color: '#ffffff',
                      textShadow: '0 1px 4px rgba(0,0,0,0.8)'
                    }}
                  >
                    {activeMetric === 'temp' && `${cell.temp_c}°`}
                    {activeMetric === 'rain' && `${cell.rain_mm}m`}
                    {activeMetric === 'wind' && `${cell.wind_kmh}k`}
                    {activeMetric === 'risk' && (cell.flood_risk === 'HIGH' ? '⚠️' : '✓')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* DRAWER / DETAILS PANEL (Opens when user clicks/inspects a cell) */}
      {inspected && (
        <div
          className="cinematic-glass-elevated"
          style={{
            marginTop: '2rem',
            padding: '28px',
            borderRadius: 'var(--radius-xl)',
            border: '2px solid rgba(255, 255, 255, 0.9)',
            boxShadow: '0 25px 60px -15px rgba(0,0,0,0.2)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="badge badge-frozen">चयनित 1-किमी सेल (SELECTED CELL)</span>
              <span style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                {inspected.id} • ऊँचाई: {inspected.elevation_m}m MSL
              </span>
            </div>

            <span style={{ fontSize: '0.82rem', color: 'var(--color-earth-deep)', fontWeight: 800 }}>
              FORECAST HORIZON: {selectedHorizon}
            </span>
          </div>

          {/* 4 Data Cards for this Cell */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
            <div className="card-hover-tilt" style={{ padding: '16px', borderRadius: 'var(--radius-lg)', background: 'var(--color-atmosphere-subtle)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>तापमान</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-atmosphere-blue)' }}>
                {inspected.temp_c}°C
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Model 1 Downscaled</div>
            </div>

            <div className="card-hover-tilt" style={{ padding: '16px', borderRadius: 'var(--radius-lg)', background: 'var(--color-atmosphere-subtle)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>वर्षा संभावना</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-atmosphere-blue)' }}>
                {inspected.rain_prob_pct}%
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>M3 Hurdle Occurrence</div>
            </div>

            <div className="card-hover-tilt" style={{ padding: '16px', borderRadius: 'var(--radius-lg)', background: 'var(--bg-surface-subtle)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>अनुमानित वर्षा</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {inspected.rain_mm} mm
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>अनिश्चितता: ±1.2 mm</div>
            </div>

            <div className="card-hover-tilt" style={{ padding: '16px', borderRadius: 'var(--radius-lg)', background: inspected.flood_risk === 'HIGH' ? 'var(--color-hazard-subtle)' : 'var(--color-earth-subtle)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>जोखिम स्तर</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: inspected.flood_risk === 'HIGH' ? 'var(--color-hazard-crimson)' : 'var(--color-earth-emerald)' }}>
                {inspected.flood_risk}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{inspected.advisory}</div>
            </div>
          </div>

          {/* Progressive Disclosure Drawer */}
          <ScientificDrawer
            title="इस ग्रिड सेल का पूर्वानुमान कैसे तैयार हुआ? (Why this forecast?)"
            whyExplanation={
              <div>
                यह सेल मलिहाबाद फल पट्टी में स्थित है। डिजिटल भूभाग मॉडल (DEM) के अनुसार इसकी ऊंचाई 124m है। 
                मॉडल 1 (M1) ने सतही तापमान पर ऊंचाई व स्थानीय ढलान का भौतिक लैप्स-रेट (Lapse Rate) प्रभाव लागू किया है, 
                जबकि मॉडल 3 (M3) ने वर्षा के लिए टू-स्टेज हर्डल फॉर्मूलेशन का उपयोग किया है।
              </div>
            }
            evidenceContent={
              <div>
                IMD AWS LKO 05 स्टेशन के साथ परीक्षण में मॉडल 1 का MAE 0.4083°C प्राप्त हुआ (कच्चे NWP की तुलना में 39.89% सुधार)। 
                हर्डल वर्षा मॉडल का RMSE 0.9725 है।
              </div>
            }
            scientificDetails={{
              modelProvenance: 'Model 1 (UTM 44N Downscaling) + Model 3 (Expected Hurdle Precipitation)',
              uncertainty: 'Conformal interval [3.6 mm, 6.0 mm] at 90% coverage level',
              stationValidation: 'Locked AWS_LKO_05 pilot data',
              metrics: {
                'M1 MAE': '0.4083°C',
                'M3 RMSE': '0.9725',
                'Raw NWP RMSE': '1.1438'
              }
            }}
          />
        </div>
      )}
    </div>
  );
};
