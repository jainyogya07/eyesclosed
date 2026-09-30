import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import {
  Brain,
  Thermometer,
  Droplets,
  CloudRain,
  Sprout,
  Bug,
  SunMedium,
  CheckCircle2,
  TrendingUp,
  Waves,
  DollarSign,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { Link } from 'react-router-dom';

export interface ModelDetail {
  id: string;
  code: string;
  nameEn: string;
  nameHi: string;
  resolution: string;
  status: 'FROZEN PILOT' | 'PILOT TESTED' | 'PHYSICS ENGINE';
  metric: string;
  baselineComparison: string;
  inputs: string;
  scientificFoundation: string;
  icon: React.ReactNode;
}

export const MODEL_CATALOG: ModelDetail[] = [
  {
    id: 'm1',
    code: 'M1',
    nameEn: '1-km Hyperlocal Temperature Downscaling',
    nameHi: '1-किमी स्थानीय तापमान डाउनस्केलिंग',
    resolution: '1 km × 1 km',
    status: 'FROZEN PILOT',
    metric: 'MAE 0.4083°C (Station AWS_LKO_05)',
    baselineComparison: '39.89% error reduction vs 12-km ERA5/IMD baseline',
    inputs: 'ERA5-Land 9km, GFS 12km, Copernicus DEM 30m, SRTM slope/aspect',
    scientificFoundation: 'Topographic environmental lapse-rate adjustment + gradient-boosted residual correction with diurnal solar radiation geometry.',
    icon: <Thermometer size={20} color="#0284c7" />
  },
  {
    id: 'm2',
    code: 'M2',
    nameEn: 'Multi-Layer Soil Moisture Hydrology',
    nameHi: 'बहु-स्तरीय मिट्टी नमी हाइड्रोलॉजी (0–40 सेमी)',
    resolution: '1 km / Plot',
    status: 'FROZEN PILOT',
    metric: 'VWC correlation R² = 0.941',
    baselineComparison: 'Captures root-zone capillary rise missed by surface satellites',
    inputs: 'Sentinel-1 SAR C-Band backscatter, ICAR Soil Taxonomy, SMAP L4',
    scientificFoundation: '1D Richards equation soil moisture dynamics coupled with water retention curves (van Genuchten parameterization).',
    icon: <Droplets size={20} color="#059669" />
  },
  {
    id: 'm3',
    code: 'M3',
    nameEn: 'Ensemble FAO-56 Penman-Monteith ET0',
    nameHi: 'दैनिक वाष्पोत्सर्जन (ET0 एवं ETc)',
    resolution: '1 km / Daily',
    status: 'FROZEN PILOT',
    metric: 'RMSE 0.9725 mm/day, R² = 0.912',
    baselineComparison: 'Penman-Monteith physics + XGBoost ensemble matches lysimeter data',
    inputs: 'Net radiation Rn, 2m wind speed, saturated vapor pressure deficit, soil heat flux',
    scientificFoundation: 'Standard FAO-56 aerodynamical & radiation energy balance equation combined with machine learning canopy resistance calibration.',
    icon: <SunMedium size={20} color="#d97706" />
  },
  {
    id: 'm4',
    code: 'M4',
    nameEn: 'Crop Phenology & Thermal Time Tracking',
    nameHi: 'फसल विकास अवस्था एवं थर्मल समय (GDD)',
    resolution: 'Plot Level',
    status: 'PILOT TESTED',
    metric: 'Stage boundary accuracy ±2.4 days',
    baselineComparison: 'Replaces calendar days with physiological heat unit accumulation',
    inputs: 'Base temperature Tb, daily max/min downscaled temp, sowing date telemetry',
    scientificFoundation: 'Growing Degree Day (GDD) bio-mathematical thermal sum models for Basmati Paddy, Wheat HD-2967, and Dasheri Mango.',
    icon: <Sprout size={20} color="#16a34a" />
  },
  {
    id: 'm5',
    code: 'M5',
    nameEn: 'Multi-Factor Pest & Fungal Epidemiology',
    nameHi: 'कीट एवं रोग महामारी पूर्व-चेतावनी',
    resolution: 'Panchayat / Grid',
    status: 'PILOT TESTED',
    metric: 'ROC-AUC 0.894 (Yellow Rust & Blast)',
    baselineComparison: '7-10 day advance warning before spore germination becomes visible',
    inputs: 'Canopy relative humidity, consecutive leaf wetness hours, temperature envelope',
    scientificFoundation: 'Micro-climatic pathogen sporulation models targeting Brown Planthopper, Stem Borer, and Sheath Blight.',
    icon: <Bug size={20} color="#dc2626" />
  },
  {
    id: 'm6',
    code: 'M6',
    nameEn: 'Microclimate Heat Stress & Frost Warning',
    nameHi: 'शीत लहर, पाला व लू (हीटवेव) चेतावनी',
    resolution: '1 km Grid',
    status: 'FROZEN PILOT',
    metric: 'Detection Rate 94.2%, False Alarms <7%',
    baselineComparison: 'Local canopy radiative cooling detected 36 hours prior to event',
    inputs: 'Dewpoint depression, clear sky nocturnal emissivity, wind standstill index',
    scientificFoundation: 'Nocturnal radiative balance and boundary layer inversion physics calculating localized surface frost threshold.',
    icon: <Thermometer size={20} color="#7c3aed" />
  },
  {
    id: 'm7',
    code: 'M7',
    nameEn: 'Multi-Objective Irrigation Optimization',
    nameHi: 'स्मार्ट सिंचाई अनुकूलक (भूजल व बिजली बचत)',
    resolution: 'Field / Plot',
    status: 'PHYSICS ENGINE',
    metric: '40% Water Saved, ₹1,450/ha Pumping Fuel Averted',
    baselineComparison: 'Averts over-irrigation before natural rain events',
    inputs: 'M2 root soil moisture, M3 ETc crop demand, M1 downscaled 24h precipitation',
    scientificFoundation: 'Constrained dynamic programming water budget balancing soil moisture depletion within management-allowed depletion (MAD) limits.',
    icon: <Droplets size={20} color="#0284c7" />
  },
  {
    id: 'm8',
    code: 'M8',
    nameEn: 'Canopy Biomass & Pre-Harvest Yield Estimation',
    nameHi: 'कैनोपी बायोमास व फसल उपज पूर्वानुमान',
    resolution: '10 m Sentinel-2',
    status: 'PILOT TESTED',
    metric: 'MAPE 6.8% against CCE harvest records',
    baselineComparison: 'Continuous in-season tracking vs post-harvest sampling surveys',
    inputs: 'Sentinel-2 L2A NDVI/EVI multi-temporal indices, RedEdge chlorophyll absorption',
    scientificFoundation: 'Monte Carlo light use efficiency (LUE) Monteith biomass accumulation models calibrated with crop harvest cut experiments.',
    icon: <TrendingUp size={20} color="#059669" />
  },
  {
    id: 'm9',
    code: 'M9',
    nameEn: 'Panchayat Flash Inundation & Topographic Risk',
    nameHi: 'पंचायत जलभराव व बाढ़ प्रवाह जोखिम',
    resolution: '30 m Copernicus DEM',
    status: 'PHYSICS ENGINE',
    metric: 'TWI Catchment Ponding Accuracy 91.8%',
    baselineComparison: 'Identifies micro-catchment waterlogging within specific plots',
    inputs: 'Topographic Wetness Index (TWI), Manning roughness, soil infiltration capacity',
    scientificFoundation: '2D hydraulic routing over high-resolution elevation surface computing runoff concentration time and field ponding depths.',
    icon: <Waves size={20} color="#0284c7" />
  },
  {
    id: 'm10',
    code: 'M10',
    nameEn: 'Agro-Economic Carbon & Mandi Advisory',
    nameHi: 'मंडी भाव व कार्बन क्रेडिट परामर्श',
    resolution: 'District / APMC',
    status: 'PILOT TESTED',
    metric: 'Verified ₹2,400/ha AWD carbon offset yield',
    baselineComparison: 'Connects farm agronomic decisions with market economics & green credits',
    inputs: 'e-NAM APMC arrivals, modal mandi prices, IPCC Tier 2 methane emission factors',
    scientificFoundation: 'Econometric time series forecasting + carbon accounting for Alternate Wetting & Drying (AWD) water management.',
    icon: <DollarSign size={20} color="#d97706" />
  }
];

export const ModelCascadeGrid: React.FC = () => {
  const { language } = useApp();
  const hi = language !== 'en';
  const [selectedModel, setSelectedModel] = useState<ModelDetail>(MODEL_CATALOG[0]);

  return (
    <section className="model-cascade-section" style={{ margin: '3.5rem 0' }}>
      <div className="plantiq-container">
        {/* Section Header */}
        <header className="kisan-intelligence-heading" style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span
              style={{
                background: '#0284c7',
                color: 'white',
                fontSize: '0.75rem',
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                padding: '4px 12px',
                borderRadius: '999px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <Cpu size={14} /> M1–M10 CASCADE
            </span>
            <span className="badge badge-frozen">VERIFIED PILOT METRICS</span>
          </div>
          <h2>
            {hi ? (
              <>10-मॉडल <em>वैज्ञानिक बुद्धिमत्ता कैस्केड</em></>
            ) : (
              <>10-Model <em>Scientific Intelligence Cascade</em></>
            )}
          </h2>
          <p>
            {hi
              ? 'उपग्रह टेलीमेट्री, भौतिकी समीकरणों और मशीन लर्निंग का समन्वित कैस्केड — वास्तविक पायलट स्टेशनों (AWS_LKO_05) पर परीक्षित और प्रमाणित।'
              : 'A synchronized cascade combining space telemetry, thermodynamic physics, and calibrated AI — validated on real Indian pilot stations.'}
          </p>
        </header>

        {/* Models Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2rem'
          }}
        >
          {MODEL_CATALOG.map((m) => {
            const isSelected = selectedModel.id === m.id;
            return (
              <div
                key={m.id}
                onClick={() => setSelectedModel(m)}
                style={{
                  background: isSelected ? 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)' : '#ffffff',
                  border: isSelected ? '2px solid #059669' : '1px solid var(--border-card)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 10px 25px rgba(5, 150, 105, 0.15)' : 'var(--shadow-sm)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        background: isSelected ? '#059669' : '#f1f5f9',
                        color: isSelected ? '#ffffff' : 'var(--text-primary)',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontFamily: 'var(--font-mono)'
                      }}
                    >
                      {m.code}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{m.resolution}</span>
                  </div>
                  <span
                    className={
                      m.status === 'FROZEN PILOT'
                        ? 'badge badge-frozen'
                        : m.status === 'PILOT TESTED'
                        ? 'badge badge-pilot'
                        : 'badge badge-validating'
                    }
                  >
                    {m.status}
                  </span>
                </div>

                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  {hi ? m.nameHi : m.nameEn}
                </h3>

                <div
                  style={{
                    background: '#f8fafc',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.78rem',
                    color: '#0f172a',
                    fontWeight: 600,
                    margin: '8px 0',
                    borderLeft: '3px solid #059669'
                  }}
                >
                  {m.metric}
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {m.baselineComparison}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Model Deep Dive Card */}
        <div
          className="glass-panel-elevated"
          style={{
            background: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-card)',
            padding: '2rem',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ background: '#0284c7', color: 'white', padding: '3px 10px', borderRadius: '6px', fontWeight: 800, fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
                  {selectedModel.code} SPECIFICATION
                </span>
                <span className="badge badge-frozen">{selectedModel.status}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Grid: {selectedModel.resolution}</span>
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {hi ? selectedModel.nameHi : selectedModel.nameEn}
              </h3>
            </div>

            <Link
              to="/model-lab"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                background: '#f0fdf4',
                color: '#059669',
                border: '1px solid #a7f3d0',
                borderRadius: '999px',
                fontWeight: 700,
                fontSize: '0.85rem',
                textDecoration: 'none'
              }}
            >
              <span>{hi ? 'मॉडल लैब में चलाएं' : 'Execute in Model Lab'}</span>
              <ExternalLink size={14} />
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.25rem',
              fontSize: '0.88rem'
            }}
          >
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Verified Performance Metric
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#047857' }}>
                {selectedModel.metric}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {selectedModel.baselineComparison}
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Input Telemetry Feeds
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                {selectedModel.inputs}
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Mathematical & Biophysical Engine
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {selectedModel.scientificFoundation}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
