import React, { useState } from 'react';
import {
  Layers,
  Thermometer,
  CloudRain,
  Droplets,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Info
} from 'lucide-react';

interface GridCell {
  id: string;
  x: number;
  y: number;
  elevation_m: number;
  temp_c: number;
  rain_mm: number;
  soil_vwc: number;
  flood_risk: string;
  advisory: string;
}

// Deterministic 8x6 Grid Cells representing 1km x 1km cells in Lucknow / Malihabad belt
const CELLS: GridCell[] = [];
for (let r = 0; r < 6; r++) {
  for (let c = 0; c < 8; c++) {
    const elev = 120 + Math.round(Math.sin(r * 0.8) * 6 + Math.cos(c * 0.8) * 8);
    // Lapse rate effect: higher elevation has slightly lower temperature
    const temp = +(28.8 - (elev - 120) * 0.0065 - (r === 2 && c === 3 ? 0.8 : 0)).toFixed(2);
    // Localized rainfall hotspot in sectors (2,3) and (3,4)
    const distToCenter = Math.hypot(r - 2.5, c - 3.5);
    const rain = distToCenter < 1.8 ? +(14.2 - distToCenter * 4.5).toFixed(1) : +(0.2 + (r % 2) * 0.4).toFixed(1);
    const soil = +(24 + rain * 0.8 + (elev < 122 ? 5 : 0)).toFixed(1);
    const isFlood = elev < 122 && rain > 8.0;

    CELLS.push({
      id: `UTM44N_${440 + c}_${2965 + r}`,
      x: c,
      y: r,
      elevation_m: elev,
      temp_c: temp,
      rain_mm: rain,
      soil_vwc: soil,
      flood_risk: isFlood ? 'HIGH' : rain > 5 ? 'MODERATE' : 'LOW',
      advisory: isFlood ? 'Clear field drainage outlets' : rain > 5 ? 'Do not spray pesticides' : 'Standard cultivation'
    });
  }
}

type LayerMode = 'temp' | 'rain' | 'soil' | 'flood';

export const MapView: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState<LayerMode>('temp');
  const [selectedCell, setSelectedCell] = useState<GridCell>(CELLS[19]); // Center cell
  const [hoveredCell, setHoveredCell] = useState<GridCell | null>(null);

  const getCellColor = (cell: GridCell): string => {
    switch (activeLayer) {
      case 'temp': {
        // Temperature range 27.5 to 29.5
        const ratio = Math.max(0, Math.min(1, (cell.temp_c - 27.5) / 2.0));
        return `hsl(${220 - ratio * 180}, 85%, 62%)`; // Blue (cool) to Red/Orange (warm)
      }
      case 'rain': {
        // Rain 0 to 15 mm
        if (cell.rain_mm < 0.5) return 'rgba(226, 232, 240, 0.4)';
        const intensity = Math.min(1, cell.rain_mm / 14);
        return `rgba(2, 132, 199, ${0.3 + intensity * 0.65})`;
      }
      case 'soil': {
        // Soil VWC 20 to 38%
        const ratio = Math.max(0, Math.min(1, (cell.soil_vwc - 20) / 18));
        return `hsl(${140 - ratio * 80}, 75%, ${55 - ratio * 15}%)`;
      }
      case 'flood': {
        if (cell.flood_risk === 'HIGH') return 'rgba(220, 38, 38, 0.75)';
        if (cell.flood_risk === 'MODERATE') return 'rgba(217, 119, 6, 0.65)';
        return 'rgba(16, 185, 129, 0.25)';
      }
    }
  };

  const inspected = hoveredCell || selectedCell;

  return (
    <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 2rem' }}>
      {/* Title */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="badge badge-frozen">EPSG:32644 Metric UTM 44N</span>
          <span className="badge badge-pilot">1000m × 1000m Grid Cells</span>
        </div>
        <h2 style={{ fontSize: '2.2rem', color: 'var(--text-primary)' }}>
          1-km Geospatial Analysis Grid (1 किमी स्थानिक विश्लेषण)
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Interactive raster layer inspection across Malihabad Mango & Paddy clusters. Click any cell to inspect micro-elevation and downscaled forecasts.
        </p>
      </div>

      {/* Map Layout: Left Control & Layer Grid, Right Cell Inspector HUD */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 0.8fr',
          gap: '2rem',
          alignItems: 'start'
        }}
      >
        {/* Left Map View Canvas Box */}
        <div
          className="glass-panel-elevated"
          style={{
            padding: '24px',
            background: 'white',
            borderRadius: 'var(--radius-xl)'
          }}
        >
          {/* Top Layer Toggles */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '1rem'
            }}
          >
            <button
              onClick={() => setActiveLayer('temp')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: 'var(--radius-md)',
                border: activeLayer === 'temp' ? '1.5px solid var(--color-atmosphere-blue)' : '1px solid var(--border-card)',
                background: activeLayer === 'temp' ? 'var(--color-atmosphere-subtle)' : 'white',
                color: activeLayer === 'temp' ? 'var(--color-atmosphere-blue)' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              <Thermometer size={16} />
              M1 Temperature (T2m)
            </button>

            <button
              onClick={() => setActiveLayer('rain')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: 'var(--radius-md)',
                border: activeLayer === 'rain' ? '1.5px solid var(--color-atmosphere-blue)' : '1px solid var(--border-card)',
                background: activeLayer === 'rain' ? 'var(--color-atmosphere-subtle)' : 'white',
                color: activeLayer === 'rain' ? 'var(--color-atmosphere-blue)' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              <CloudRain size={16} />
              M3 Precipitation (mm)
            </button>

            <button
              onClick={() => setActiveLayer('soil')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: 'var(--radius-md)',
                border: activeLayer === 'soil' ? '1.5px solid var(--color-earth-emerald)' : '1px solid var(--border-card)',
                background: activeLayer === 'soil' ? 'var(--color-earth-subtle)' : 'white',
                color: activeLayer === 'soil' ? 'var(--color-earth-emerald)' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              <Droplets size={16} />
              M4 Soil Moisture (%)
            </button>

            <button
              onClick={() => setActiveLayer('flood')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: 'var(--radius-md)',
                border: activeLayer === 'flood' ? '1.5px solid var(--color-hazard-crimson)' : '1px solid var(--border-card)',
                background: activeLayer === 'flood' ? 'var(--color-hazard-subtle)' : 'white',
                color: activeLayer === 'flood' ? 'var(--color-hazard-crimson)' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              <AlertTriangle size={16} />
              M8 Inundation Risk
            </button>
          </div>

          {/* 1-km Grid Visualizer Box */}
          <div
            style={{
              position: 'relative',
              background: '#f8fafc',
              border: '1px solid var(--border-card)',
              borderRadius: 'var(--radius-lg)',
              padding: '16px',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(8, 1fr)',
                gap: '6px'
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
                      aspectRatio: '1/1',
                      background: getCellColor(cell),
                      borderRadius: 'var(--radius-sm)',
                      border: isSelected
                        ? '2.5px solid var(--text-primary)'
                        : isHovered
                        ? '2px solid var(--color-atmosphere-blue)'
                        : '1px solid rgba(255,255,255,0.6)',
                      boxShadow: isSelected ? '0 0 10px rgba(0,0,0,0.2)' : 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'transform 0.15s ease, border 0.15s ease',
                      transform: isHovered || isSelected ? 'scale(1.06)' : 'scale(1)',
                      zIndex: isSelected ? 2 : 1
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        color: activeLayer === 'rain' && cell.rain_mm > 8 ? 'white' : 'var(--text-primary)',
                        fontFamily: 'var(--font-mono)'
                      }}
                    >
                      {activeLayer === 'temp'
                        ? `${cell.temp_c}°`
                        : activeLayer === 'rain'
                        ? `${cell.rain_mm}m`
                        : activeLayer === 'soil'
                        ? `${cell.soil_vwc}%`
                        : cell.flood_risk[0]}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Grid Coordinates Stamp */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.68rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)',
                marginTop: '12px'
              }}
            >
              <span>EASTING: 440,000m E</span>
              <span>8 KM × 6 KM ANALYSIS EXTENT</span>
              <span>NORTHING: 2,971,000m N</span>
            </div>
          </div>
        </div>

        {/* Right Cell Inspector HUD */}
        <div
          className="glass-panel-elevated"
          style={{
            padding: '24px',
            background: 'white',
            borderRadius: 'var(--radius-xl)',
            border: '1.5px solid var(--border-card)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
            <div>
              <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--color-atmosphere-blue)', fontWeight: 700 }}>
                1-KM CELL INSPECTOR
              </div>
              <h4 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                {inspected.id}
              </h4>
            </div>
            <span className="badge badge-frozen">UTM Zone 44N</span>
          </div>

          {/* Cell Metric Specs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ background: 'var(--bg-surface-subtle)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                ELEVATION (DEM)
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {inspected.elevation_m} meters
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                Copernicus GLO-30
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface-subtle)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                TEMPERATURE (M1)
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-atmosphere-blue)' }}>
                {inspected.temp_c}°C
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                ±0.74°C Conformal bound
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface-subtle)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                PRECIPITATION (M3)
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-atmosphere-blue)' }}>
                {inspected.rain_mm} mm/h
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                Hurdle Regressor
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface-subtle)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                ROOT ZONE VWC (M4)
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-earth-emerald)' }}>
                {inspected.soil_vwc}%
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                Sentinel-1 SAR C-Band
              </div>
            </div>
          </div>

          {/* Cell Specific Advisory */}
          <div
            style={{
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              background: inspected.flood_risk === 'HIGH' ? 'var(--color-hazard-subtle)' : 'var(--color-earth-subtle)',
              border: `1px solid ${inspected.flood_risk === 'HIGH' ? 'var(--color-hazard-light)' : 'var(--color-earth-light)'}`,
              marginBottom: '1rem'
            }}
          >
            <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: inspected.flood_risk === 'HIGH' ? 'var(--color-hazard-crimson)' : 'var(--color-earth-emerald)', marginBottom: '4px' }}>
              PLOT LEVEL ADVISORY
            </div>
            <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              {inspected.advisory}
            </div>
          </div>

          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Info size={14} />
            Analysis coordinates reprojected on-the-fly to WGS84 EPSG:4326 for interchange.
          </div>
        </div>
      </div>
    </section>
  );
};
