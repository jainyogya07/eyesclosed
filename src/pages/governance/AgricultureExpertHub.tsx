import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wheat,
  CloudSun,
  Droplets,
  Layers,
  Sparkles,
  Sliders,
  CheckCircle2,
  FileCheck,
  Send,
  Info,
  Activity,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Beaker,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { useRole } from '../../contexts/RoleContext';
import { useApp } from '../../contexts/AppContext';
import {
  UNIFIED_SOIL_DATA,
  UNIFIED_CROP_SUITABILITY,
  UNIFIED_IRRIGATION_DATA,
  UNIFIED_WEATHER_IMPACT,
  CropSuitabilityRecord,
  INITIAL_ADVISORIES,
  AdvisoryItem
} from '../../services/governanceIntelligenceService';

interface AgricultureExpertHubProps {
  initialTab?: string;
}

export const AgricultureExpertHub: React.FC<AgricultureExpertHubProps> = ({ initialTab = 'dashboard' }) => {
  const { scope, activePanchayat } = useRole();
  const { language } = useApp();
  const en = language === 'en';

  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [showScientificDetails, setShowScientificDetails] = useState<boolean>(false);

  // Climate Scenario Simulator state
  const [scenarioRainfallDelta, setScenarioRainfallDelta] = useState<number>(0); // -40% to +40%
  const [scenarioTempDelta, setScenarioTempDelta] = useState<number>(0); // 0 to +2°C

  // Expert Advisory Studio state
  const [advisoryTopic, setAdvisoryTopic] = useState('Prophylactic Fungicide & Nitrogen Withholding in Flowering Paddy');
  const [advisoryCrop, setAdvisoryCrop] = useState('Paddy (Basmati / CSR-30)');
  const [advisoryEvidence, setAdvisoryEvidence] = useState(
    'Microclimate RH > 78% for > 16h with canopy temperature 27–31°C creates high virulence window for Rhizoctonia solani (Sheath Blight).'
  );
  const [expertSigned, setExpertSigned] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const tabs = [
    { id: 'dashboard', labelEn: 'Dashboard', labelHi: 'डैशबोर्ड', icon: Layers },
    { id: 'crop-intelligence', labelEn: 'Crop Intelligence', labelHi: 'फसल विश्लेषण', icon: Wheat },
    { id: 'soil', labelEn: 'Soil Intelligence', labelHi: 'मृदा विश्लेषण', icon: Activity },
    { id: 'crop-suitability', labelEn: 'Crop Suitability Matrix', labelHi: 'फसल उपयुक्तता मैट्रिक्स', icon: TrendingUp },
    { id: 'irrigation', labelEn: 'Irrigation & ETc', labelHi: 'सिंचाई व वाष्पोत्सर्जन', icon: Droplets },
    { id: 'weather-impact', labelEn: 'Weather Impact Chain', labelHi: 'मौसम-फसल प्रभाव श्रृंखला', icon: CloudSun },
    { id: 'climate-scenarios', labelEn: 'Climate Scenarios', labelHi: 'जलवायु परिदृश्य लैब', icon: Sliders },
    { id: 'advisory-studio', labelEn: 'Advisory Studio', labelHi: 'विशेषज्ञ परामर्श केंद्र', icon: FileCheck }
  ];

  const handleSignAndPublish = () => {
    setExpertSigned(true);
    setToastMessage(en ? 'Scientific advisory signed and registered into Agro-Advisory Bulletin!' : 'वैज्ञानिक सलाह पर हस्ताक्षर कर बुलेटिन में दर्ज कर दिया गया!');
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '20px 16px 80px' }}>
      {/* Scope Header Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, #065f46 0%, #047857 50%, #0f766e 100%)',
          borderRadius: '20px',
          padding: '24px 28px',
          color: '#ffffff',
          boxShadow: '0 12px 32px rgba(6, 95, 70, 0.2)',
          marginBottom: '20px'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase'
                }}
              >
                👨‍🔬 {en ? 'Agronomic & Crop Science Intelligence' : 'कृषि विज्ञान व फसल अनुसंधान'}
              </span>
              <span style={{ fontSize: '0.74rem', opacity: 0.85 }}>
                {en ? 'Jurisdiction: Central UP Agro-Climatic Plain' : 'अधिकार क्षेत्र: मध्य उत्तर प्रदेश कृषि-जलवायु क्षेत्र'}
              </span>
            </div>

            <h1 style={{ fontSize: '1.75rem', fontWeight: 900, margin: '0 0 6px', letterSpacing: '-0.02em' }}>
              {en ? 'Agriculture Expert Station' : 'कृषि विशेषज्ञ विश्लेषणात्मक केंद्र'}
            </h1>
            <p style={{ margin: 0, opacity: 0.9, fontSize: '0.86rem' }}>
              <strong>{en ? 'Guiding Principle:' : 'वैज्ञानिक सिद्धांत:'}</strong>{' '}
              {en
                ? 'Every recommendation must be justified by phenological stage, soil physics, ETc water balance, and weather telemetry.'
                : 'प्रत्येक सलाह फसल अवस्था, मृदा भौतिकी, जल संतुलन और मौसम टेलीमेट्री पर आधारित होनी चाहिए।'}
            </p>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '10px 16px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              textAlign: 'right'
            }}
          >
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', opacity: 0.8, fontWeight: 700 }}>
              {en ? 'Target Agricultural Reference' : 'सक्रिय संदर्भ क्षेत्र'}
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 900 }}>
              {activePanchayat.name} ({activePanchayat.cropMetrics.paddyAreaHa} ha Paddy)
            </div>
          </div>
        </div>
      </div>

      {/* Active Module Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {en ? 'Active Module' : 'सक्रिय मॉड्यूल'}:
          </span>
          <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#047857' }}>
            {tabs.find((t) => t.id === activeTab)?.[en ? 'labelEn' : 'labelHi'] || 'Dashboard'}
          </span>
        </div>
      </div>

      {/* Toast */}
      {toastMessage && (
        <div
          style={{
            background: '#ecfdf5',
            border: '1px solid #10b981',
            borderRadius: '10px',
            padding: '12px 18px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#065f46',
            fontWeight: 700,
            fontSize: '0.86rem'
          }}
        >
          <CheckCircle2 size={18} color="#10b981" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TAB 1: DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Top Banner: Agricultural Attention Areas */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '24px',
              border: '1.5px solid #a7f3d0',
              boxShadow: '0 8px 24px rgba(5, 150, 105, 0.08)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span
                  style={{
                    background: '#ecfdf5',
                    color: '#065f46',
                    padding: '4px 10px',
                    borderRadius: '999px',
                    fontSize: '0.72rem',
                    fontWeight: 900,
                    textTransform: 'uppercase'
                  }}
                >
                  🌾 {en ? 'Agricultural Attention Areas' : 'कृषि वैज्ञानिक प्राथमिकताएं'}
                </span>
                <span style={{ fontSize: '0.76rem', color: '#64748b' }}>
                  {en ? 'Live biophysical status for active crop canopy' : 'फसल छत्रक की सक्रिय जैव-भौतिकीय स्थिति'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('weather-impact')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#059669',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '6px 14px',
                  fontSize: '0.76rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                <span>{en ? 'Inspect Weather-Crop Chain' : 'फसल-मौसम श्रृंखला जांचें'}</span>
                <ArrowRight size={14} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                  🌾 Crop Phenology
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: '4px 0' }}>
                  Paddy: Flowering / Anthesis
                </div>
                <div style={{ fontSize: '0.76rem', color: '#059669', fontWeight: 700 }}>
                  High vulnerability to excessive pollen wash-off
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                  🌧️ Rainfall Exposure
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0284c7', margin: '4px 0' }}>
                  14.8 mm (Elevated)
                </div>
                <div style={{ fontSize: '0.76rem', color: '#0284c7', fontWeight: 700 }}>
                  84% probability; canopy wetness duration &gt; 12h
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                  💧 Soil Moisture & ETc
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#d97706', margin: '4px 0' }}>
                  32.4% (Near Saturation)
                </div>
                <div style={{ fontSize: '0.76rem', color: '#d97706', fontWeight: 700 }}>
                  ETc: 4.83 mm/d • Net surplus water: +9.97 mm
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                  ⚠️ Pathological Risk
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#b91c1c', margin: '4px 0' }}>
                  Rhizoctonia (Sheath Blight)
                </div>
                <div style={{ fontSize: '0.76rem', color: '#b91c1c', fontWeight: 700 }}>
                  Withhold urea top-dressing immediately
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CROP INTELLIGENCE & INDICES */}
      {activeTab === 'crop-intelligence' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
              {en ? 'Field Crop Phenology & Satellite Telemetry' : 'फसल फेनोलॉजी व उपग्रह टेलीमेट्री'}
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '20px' }}>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>VEGETATION INDEX (NDVI)</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#059669', margin: '4px 0' }}>0.76</div>
                <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700 }}>Dense, healthy green canopy</div>
              </div>

              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>CHLOROPHYLL INDEX (NDRE)</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f766e', margin: '4px 0' }}>0.64</div>
                <div style={{ fontSize: '0.72rem', color: '#0f766e', fontWeight: 700 }}>Active nitrogen assimilation</div>
              </div>

              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>ENHANCED VEG (EVI)</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0284c7', margin: '4px 0' }}>0.58</div>
                <div style={{ fontSize: '0.72rem', color: '#0284c7', fontWeight: 700 }}>No atmospheric interference</div>
              </div>

              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>GROWING DEGREE DAYS (GDD)</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#d97706', margin: '4px 0' }}>1,420 °C·d</div>
                <div style={{ fontSize: '0.72rem', color: '#d97706', fontWeight: 700 }}>Flowering requirement met (1400)</div>
              </div>
            </div>

            {/* Scientific Details Toggle */}
            <button
              type="button"
              onClick={() => setShowScientificDetails(!showScientificDetails)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'transparent',
                border: '1.5px solid #059669',
                color: '#059669',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              <Cpu size={16} />
              <span>{showScientificDetails ? 'Hide Scientific Formulae' : 'Show Scientific Details & Formulae'}</span>
            </button>

            {showScientificDetails && (
              <div style={{ marginTop: '16px', background: '#f0fdf4', padding: '16px', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                <strong style={{ fontSize: '0.82rem', color: '#065f46' }}>Scientific Derivation:</strong>
                <pre style={{ margin: '8px 0 0', fontSize: '0.74rem', color: '#047857', fontFamily: 'monospace' }}>
{`• NDVI = (NIR - RED) / (NIR + RED) = (0.74 - 0.10) / (0.74 + 0.10) = 0.762
• NDRE = (NIR - RedEdge) / (NIR + RedEdge) = (0.74 - 0.16) / (0.74 + 0.16) = 0.644
• GDD = Σ [ (Tmax + Tmin) / 2 - Tbase ] where Tbase = 10.0°C for Oryza sativa
• Current cumulative heat units: 1,420.4 °C-days (Phenological Heading Synchrony: 96.2%)`}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: SOIL INTELLIGENCE */}
      {activeTab === 'soil' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
              {en ? 'Soil Physics & Nutrient Constraints' : 'मृदा भौतिकी व पोषक तत्व विश्लेषण'}
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '20px' }}>
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>SOIL REACTION (pH)</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', margin: '4px 0' }}>
                  {UNIFIED_SOIL_DATA.ph}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700 }}>Neutral to slightly alkaline</div>
              </div>

              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>ORGANIC CARBON (OC)</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#d97706', margin: '4px 0' }}>
                  {UNIFIED_SOIL_DATA.organicCarbonPct}%
                </div>
                <div style={{ fontSize: '0.72rem', color: '#d97706', fontWeight: 700 }}>Moderately Low (&lt;0.75%)</div>
              </div>

              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>NPK BALANCE (kg/ha)</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', margin: '4px 0' }}>
                  182 : 24 : 210
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>Low N • Med P • High K</div>
              </div>

              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>WATER HOLDING CAP.</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0284c7', margin: '4px 0' }}>
                  {UNIFIED_SOIL_DATA.waterHoldingCapacityPct}%
                </div>
                <div style={{ fontSize: '0.72rem', color: '#0284c7', fontWeight: 700 }}>High water retention (Alluvial)</div>
              </div>
            </div>

            {/* Agronomic Interpretation */}
            <div style={{ background: '#ecfdf5', padding: '18px 20px', borderRadius: '14px', border: '1.5px solid #a7f3d0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Sparkles size={18} color="#059669" />
                <strong style={{ fontSize: '0.9rem', color: '#065f46' }}>
                  {en ? 'AGRONOMIC INTERPRETATION (Why this matters)' : 'कृषि वैज्ञानिक व्याख्या (इसका क्या महत्व है)'}
                </strong>
              </div>
              <p style={{ margin: 0, fontSize: '0.84rem', color: '#064e3b', lineHeight: 1.6 }}>
                {en ? UNIFIED_SOIL_DATA.agronomicInterpretationEn : UNIFIED_SOIL_DATA.agronomicInterpretationHi}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CROP SUITABILITY MATRIX WITH "WHY" */}
      {activeTab === 'crop-suitability' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ margin: '0 0 6px', fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                {en ? 'Crop Suitability Evaluation Matrix' : 'फसल उपयुक्तता मूल्यांकन मैट्रिक्स'}
              </h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                {en
                  ? 'Scientific rationale for candidate crops based on soil retention, seasonal rainfall, and thermal windows.'
                  : 'मृदा जल धारण क्षमता, मानसूनी वर्षा और तापीय परिस्थितियों के आधार पर फसलों की उपयुक्तता।' }
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {UNIFIED_CROP_SUITABILITY.map((crop) => (
                <div
                  key={crop.cropName}
                  style={{
                    padding: '18px 20px',
                    borderRadius: '14px',
                    border: '1px solid #cbd5e1',
                    background: '#f8fafc'
                  }}
                >
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span
                        style={{
                          padding: '3px 10px',
                          borderRadius: '999px',
                          fontSize: '0.72rem',
                          fontWeight: 900,
                          background: crop.suitabilityLevel === 'HIGH' ? '#dcfce7' : '#fef3c7',
                          color: crop.suitabilityLevel === 'HIGH' ? '#15803d' : '#b45309'
                        }}
                      >
                        {crop.suitabilityLevel} SUITABILITY ({crop.suitabilityScore}/100)
                      </span>
                      <strong style={{ fontSize: '1rem', color: '#0f172a' }}>
                        {en ? crop.cropName : crop.cropNameHi}
                      </strong>
                    </div>

                    <div style={{ display: 'flex', gap: '14px', fontSize: '0.78rem', color: '#475569' }}>
                      <span><strong>Water Req:</strong> {crop.waterRequirementMm} mm</span>
                      <span><strong>Est. Return:</strong> {crop.economicReturnPerHa}</span>
                    </div>
                  </div>

                  {/* Explicit "WHY?" Section */}
                  <div style={{ background: '#ffffff', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.74rem', fontWeight: 900, color: '#059669', textTransform: 'uppercase' }}>
                        {en ? 'Scientific Justification (WHY?):' : 'वैज्ञानिक कारण (क्यों उपयुक्त?):'}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: '#334155', lineHeight: 1.5 }}>
                      {en ? crop.whyExplanationEn : crop.whyExplanationHi}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: IRRIGATION & ETc */}
      {activeTab === 'irrigation' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
              {en ? 'ETc Water Balance & Scientific Irrigation Budget' : 'वाष्पोत्सर्जन (ETc) व सिंचाई जल संतुलन'}
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '20px' }}>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>REF EVAPOTRANSPIRATION (ET0)</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', margin: '4px 0' }}>
                  {UNIFIED_IRRIGATION_DATA.et0MmDay} mm/day
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Penman-Monteith method</div>
              </div>

              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>CROP COEFFICIENT (Kc)</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#059669', margin: '4px 0' }}>
                  {UNIFIED_IRRIGATION_DATA.kc}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700 }}>Flowering stage peak</div>
              </div>

              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>ACTUAL WATER LOSS (ETc)</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0284c7', margin: '4px 0' }}>
                  {UNIFIED_IRRIGATION_DATA.etcMmDay} mm/day
                </div>
                <div style={{ fontSize: '0.72rem', color: '#0284c7' }}>ET0 × Kc (4.2 × 1.15)</div>
              </div>

              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>NET IRRIGATION DEFICIT</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#059669', margin: '4px 0' }}>
                  0.0 mm
                </div>
                <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700 }}>Surplus from 14.8mm rain</div>
              </div>
            </div>

            {/* Farmer-Readable Recommendation Card */}
            <div style={{ background: '#f0fdf4', padding: '18px', borderRadius: '14px', border: '1.5px solid #a7f3d0' }}>
              <strong style={{ fontSize: '0.84rem', color: '#065f46', display: 'block', marginBottom: '6px' }}>
                📢 {en ? 'Farmer-Readable Irrigation Protocol:' : 'किसानों के लिए सरल सिंचाई निर्देश:'}
              </strong>
              <p style={{ margin: 0, fontSize: '0.86rem', color: '#064e3b', fontWeight: 600 }}>
                {en ? UNIFIED_IRRIGATION_DATA.recommendedWindowFarmer : UNIFIED_IRRIGATION_DATA.recommendedWindowFarmerHi}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: WEATHER IMPACT CHAIN */}
      {activeTab === 'weather-impact' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
              {en ? 'Cause & Effect: Weather → Crop Response → Agronomic Action' : 'कारण व प्रभाव: मौसम → फसल प्रतिक्रिया → संस्तुत कार्रवाई'}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {UNIFIED_WEATHER_IMPACT.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '20px',
                    borderRadius: '14px',
                    border: '1.5px solid #cbd5e1',
                    background: '#f8fafc'
                  }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                    <div>
                      <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase' }}>
                        1. WEATHER TELEMETRY
                      </span>
                      <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                        {item.weatherEvent}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{item.weatherMetric}</div>
                    </div>

                    <div>
                      <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#d97706', textTransform: 'uppercase' }}>
                        2. CROP CANOPY RESPONSE
                      </span>
                      <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                        {item.cropStage}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#475569' }}>{item.cropResponse}</div>
                    </div>

                    <div>
                      <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase' }}>
                        3. AGRONOMIC INTERVENTION
                      </span>
                      <div style={{ fontSize: '0.82rem', color: '#064e3b', fontWeight: 700, marginTop: '2px' }}>
                        {item.recommendedIntervention}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: CLIMATE SCENARIOS */}
      {activeTab === 'climate-scenarios' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
              {en ? 'Interactive Climate Scenario Simulation' : 'जलवायु परिदृश्य सिमुलेटर'}
            </h3>

            {/* Controls */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  <span>{en ? 'Rainfall Shift (%)' : 'वर्षा विचलन (%)'}</span>
                  <span style={{ color: '#059669', fontWeight: 800 }}>{scenarioRainfallDelta > 0 ? `+${scenarioRainfallDelta}%` : `${scenarioRainfallDelta}%`}</span>
                </label>
                <input
                  type="range"
                  min="-40"
                  max="40"
                  step="10"
                  value={scenarioRainfallDelta}
                  onChange={(e) => setScenarioRainfallDelta(Number(e.target.value))}
                  style={{ width: '100%', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#94a3b8' }}>
                  <span>-40% (Drought)</span>
                  <span>Normal (0%)</span>
                  <span>+40% (Flood)</span>
                </div>
              </div>

              <div>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  <span>{en ? 'Temperature Shift (°C)' : 'तापमान वृद्धि (°C)'}</span>
                  <span style={{ color: '#ea580c', fontWeight: 800 }}>+{scenarioTempDelta}°C</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.5"
                  value={scenarioTempDelta}
                  onChange={(e) => setScenarioTempDelta(Number(e.target.value))}
                  style={{ width: '100%', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#94a3b8' }}>
                  <span>Normal (+0°C)</span>
                  <span>+1.0°C</span>
                  <span>+2.0°C (IPCC SSP2-4.5)</span>
                </div>
              </div>
            </div>

            {/* Simulation Comparison Matrix */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ padding: '16px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #cbd5e1' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b' }}>BASELINE / CURRENT</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>
                  Paddy Basmati (CSR-30)
                </div>
                <div style={{ fontSize: '0.78rem', color: '#475569' }}>
                  Suitability: <strong>89/100 (HIGH)</strong> • Seasonal Water: 1,100 mm • Yield: 4.2 t/ha
                </div>
              </div>

              <div style={{ padding: '16px', borderRadius: '12px', background: '#ecfdf5', border: '1.5px solid #059669' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#059669' }}>
                  SIMULATED SCENARIO ({scenarioRainfallDelta}% Rain, +{scenarioTempDelta}°C)
                </span>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#065f46', margin: '4px 0' }}>
                  {scenarioRainfallDelta < -20 ? 'Bajra / Moong Shift Recommended' : 'Paddy Basmati with Controlled Drainage'}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#064e3b' }}>
                  {scenarioRainfallDelta < -20
                    ? 'Paddy suitability drops to 54/100 due to tubewell aquifer depletion. Bajra suitability jumps to 95/100.'
                    : `Suitability adjusts to ${Math.max(60, 89 + scenarioRainfallDelta / 4 - scenarioTempDelta * 5)}/100.`}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: ADVISORY STUDIO */}
      {activeTab === 'advisory-studio' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', border: '1.5px solid #cbd5e1' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
              {en ? 'Scientific Advisory Studio & Peer Sign-Off' : 'वैज्ञानिक परामर्श निर्माण व विशेषज्ञ हस्ताक्षर'}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                  Advisory Subject
                </label>
                <input
                  type="text"
                  value={advisoryTopic}
                  onChange={(e) => setAdvisoryTopic(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.84rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                  Scientific Evidence & Citations
                </label>
                <textarea
                  rows={3}
                  value={advisoryEvidence}
                  onChange={(e) => setAdvisoryEvidence(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.84rem', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={handleSignAndPublish}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 22px',
                    borderRadius: '10px',
                    background: '#059669',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 800,
                    fontSize: '0.84rem',
                    cursor: 'pointer'
                  }}
                >
                  <FileCheck size={16} />
                  <span>{en ? 'Sign & Publish as Reviewed Advisory' : 'हस्ताक्षर करें व बुलेटिन जारी करें'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
