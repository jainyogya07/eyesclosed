import React, { useState } from 'react';
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
  ShieldCheck
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
        if (cell.rain_mm < 0.5) return 'rgba(226, 232, 240, 0.45)';
        const intensity = Math.min(1, cell.rain_mm / 14);
        return `rgba(2, 132, 199, ${0.35 + intensity * 0.6})`;
      }
      case 'wind': {
        const intensity = Math.min(1, cell.wind_kmh / 25);
        return `rgba(56, 189, 248, ${0.25 + intensity * 0.65})`;
      }
      case 'risk': {
        if (cell.flood_risk === 'HIGH') return 'rgba(220, 38, 38, 0.8)';
        if (cell.flood_risk === 'MODERATE') return 'rgba(217, 119, 6, 0.7)';
        return 'rgba(16, 185, 129, 0.35)';
      }
    }
  };

  const inspected = hoveredCell || selectedCell;

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Map Container: ~70vh high-impact viewport */}
      <div
        className="glass-panel-elevated"
        style={{
          position: 'relative',
          minHeight: '68vh',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          borderRadius: 'var(--radius-xl)',
          border: '1.5px solid var(--border-card)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        {/* Floating Minimal Controls (Top Overlay) */}
        <div
          style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            right: '16px',
            zIndex: 10,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px'
          }}
        >
          {/* Metric Selector Pills */}
          <div
            className="glass-panel"
            style={{
              display: 'flex',
              gap: '4px',
              padding: '4px',
              background: 'rgba(255, 255, 255, 0.92)',
              borderRadius: 'var(--radius-full)',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <button
              onClick={() => handleSelectMetric('temp')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                background: activeMetric === 'temp' ? 'var(--color-atmosphere-blue)' : 'transparent',
                color: activeMetric === 'temp' ? 'white' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Thermometer size={15} />
              <span>तापमान (Temp)</span>
            </button>

            <button
              onClick={() => handleSelectMetric('rain')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                background: activeMetric === 'rain' ? 'var(--color-atmosphere-blue)' : 'transparent',
                color: activeMetric === 'rain' ? 'white' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <CloudRain size={15} />
              <span>वर्षा (Rain)</span>
            </button>

            <button
              onClick={() => handleSelectMetric('wind')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                background: activeMetric === 'wind' ? 'var(--color-atmosphere-blue)' : 'transparent',
                color: activeMetric === 'wind' ? 'white' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Wind size={15} />
              <span>हवा (Wind)</span>
            </button>

            <button
              onClick={() => handleSelectMetric('risk')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                background: activeMetric === 'risk' ? 'var(--color-hazard-crimson)' : 'transparent',
                color: activeMetric === 'risk' ? 'white' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <AlertTriangle size={15} />
              <span>जोखिम (Risk)</span>
            </button>
          </div>

          {/* Grid Metadata Chip */}
          <div
            className="glass-panel"
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(255, 255, 255, 0.92)',
              fontSize: '0.74rem',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-secondary)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            GRID: 1000m × 1000m • EPSG:32644 UTM 44N
          </div>
        </div>

        {/* The 1-km Precision Grid Canvas */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '70px 20px 20px 20px',
            position: 'relative'
          }}
        >
          {/* Subtle background terrain contour lines */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0.1,
              backgroundImage: 'radial-gradient(#0f172a 1px, transparent 1px)',
              backgroundSize: '24px 24px',
              pointerEvents: 'none'
            }}
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(8, 1fr)',
              gap: '8px',
              width: '100%',
              maxWidth: '820px',
              aspectRatio: '8/6'
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
                    borderRadius: 'var(--radius-sm)',
                    border: isSelected
                      ? '3px solid #0f172a'
                      : isHovered
                      ? '2px solid var(--color-atmosphere-blue)'
                      : '1px solid rgba(255,255,255,0.7)',
                    cursor: 'pointer',
                    boxShadow: isSelected
                      ? '0 0 16px rgba(2, 132, 199, 0.4)'
                      : isHovered
                      ? '0 2px 8px rgba(0,0,0,0.1)'
                      : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                    transform: isSelected || isHovered ? 'scale(1.05)' : 'scale(1)',
                    zIndex: isSelected ? 5 : isHovered ? 4 : 1
                  }}
                >
                  <span
                    style={{
                      fontSize: 'clamp(0.68rem, 1.2vw, 0.85rem)',
                      fontWeight: 700,
                      color: activeMetric === 'rain' && cell.rain_mm > 5 ? 'white' : '#0f172a'
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

      {/* DRAWER / DETAILS PANEL (Only shown when user clicks/inspects a cell) */}
      {inspected && (
        <div
          className="glass-panel-elevated"
          style={{
            marginTop: '1.5rem',
            padding: '24px',
            background: 'white',
            borderRadius: 'var(--radius-xl)',
            border: '1.5px solid var(--border-card)',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-frozen">चयनित 1-किमी सेल (SELECTED CELL)</span>
              <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                {inspected.id} • ऊँचाई: {inspected.elevation_m}m MSL
              </span>
            </div>

            <span style={{ fontSize: '0.78rem', color: 'var(--color-earth-emerald)', fontWeight: 700 }}>
              समय: {selectedHorizon}
            </span>
          </div>

          {/* Key 4 Data Points in this Selected Cell */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', background: 'var(--color-atmosphere-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>तापमान (Temperature)</div>
              <div style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--color-atmosphere-blue)' }}>
                {inspected.temp_c}°C
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Model 1 Downscaled</div>
            </div>

            <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', background: 'var(--color-atmosphere-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>वर्षा संभावना (Rain Prob)</div>
              <div style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--color-atmosphere-blue)' }}>
                {inspected.rain_prob_pct}%
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>M3 Hurdle Occurrence</div>
            </div>

            <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>अनुमानित मात्रा (Expected)</div>
              <div style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {inspected.rain_mm} mm
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>अनिश्चितता: ±1.2 mm</div>
            </div>

            <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', background: inspected.flood_risk === 'HIGH' ? 'var(--color-hazard-subtle)' : 'var(--color-earth-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>जोखिम स्तर (Risk Level)</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: inspected.flood_risk === 'HIGH' ? 'var(--color-hazard-crimson)' : 'var(--color-earth-emerald)' }}>
                {inspected.flood_risk}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{inspected.advisory}</div>
            </div>
          </div>

          {/* Progressive Disclosure: [Why this forecast?] */}
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
