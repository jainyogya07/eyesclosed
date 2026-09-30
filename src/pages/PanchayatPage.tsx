import React, { useState } from 'react';
import { useFarm, PILOT_PANCHAYATS_CATALOG } from '../contexts/FarmContext';
import { useApp } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { MapView } from '../components/maps/MapView';
import { motion } from 'framer-motion';
import {
  MapPin,
  Layers,
  Thermometer,
  CloudRain,
  Droplets,
  Sprout,
  AlertTriangle,
  CheckCircle2,
  Info,
  ArrowRight,
  Sparkles,
  Volume2,
  ChevronDown,
  ChevronUp,
  Sliders,
  Wind
} from 'lucide-react';

type MapLayerType = 'weather' | 'rainfall' | 'soil' | 'water' | 'crop' | 'risk';

interface PanchayatCropSuitability {
  id: string;
  nameHi: string;
  nameEn: string;
  suitability: 'HIGH' | 'MODERATE' | 'LOW';
  waterRequirement: string;
  waterRequirementEn: string;
  keyWhy: string;
  keyWhyEn: string;
  watchOut: string;
  watchOutEn: string;
  rainfallFit: string;
  rainfallFitEn: string;
  tempFit: string;
  tempFitEn: string;
  soilFit: string;
  soilFitEn: string;
  stressFactor: string;
  stressFactorEn: string;
  alternativeCrop: string;
  alternativeCropEn: string;
}

const PANCHAYAT_CROPS: PanchayatCropSuitability[] = [
  {
    id: 'bajra',
    nameHi: 'बाजरा (Bajra)',
    nameEn: 'Bajra (Pearl Millet)',
    suitability: 'HIGH',
    waterRequirement: 'कम (350 मिमी)',
    waterRequirementEn: 'Low (350 mm)',
    keyWhy: 'वर्तमान वर्षा रेंज (400–600 मिमी) में पूर्णतः फिट। कम भूजल लागत, उच्च सूखा सहनशीलता और बलुई दोमट मिट्टी से संपूर्ण तालमेल।',
    keyWhyEn: 'Fits within prevailing rainfall range. Minimal groundwater extraction, drought tolerance, and full compatibility with sandy loam soils.',
    watchOut: 'पुष्पन (Flowering) के समय 40°C से ऊपर तापमान होने पर पोलन स्टेरिलिटी का हल्का जोखिम।',
    watchOutEn: 'Mild risk of pollen sterility if temperatures exceed 40°C during flowering.',
    rainfallFit: '95% (कम वर्षा में भी उत्कृष्ट)',
    rainfallFitEn: '95% (Excellent fit under low-to-moderate rain)',
    tempFit: '92% (30–38°C अनुकूल)',
    tempFitEn: '92% (Optimal 30–38°C)',
    soilFit: '90% (बलुई दोमट मिट्टी अनुकूल)',
    soilFitEn: '90% (Sandy loam compatible)',
    stressFactor: 'नगण्य जल तनाव',
    stressFactorEn: 'Negligible water deficit',
    alternativeCrop: 'ज्वार या मक्का',
    alternativeCropEn: 'Sorghum or Maize'
  },
  {
    id: 'moong',
    nameHi: 'मूंग (Moong)',
    nameEn: 'Moong (Green Gram)',
    suitability: 'HIGH',
    waterRequirement: 'कम (400 मिमी)',
    waterRequirementEn: 'Low (400 mm)',
    keyWhy: '65 दिन की अल्प-अवधि दलहनी फसल। वायुमंडलीय नाइट्रोजन फिक्स कर पंचायत की मिट्टी की उर्वरता बढ़ाती है। कम पानी में अधिकतम आर्थिक लाभ।',
    keyWhyEn: '65-day short duration pulse. Fixes atmospheric nitrogen to enrich soil fertility while giving solid economic returns under low water use.',
    watchOut: 'फली पकने के समय अचानक भारी वर्षा होने पर दानों में दाग लगने का अंदेशा।',
    watchOutEn: 'Risk of grain discoloration if sudden torrential rainfall occurs during pod maturity.',
    rainfallFit: '88% (मध्यम वर्षा उपयुक्त)',
    rainfallFitEn: '88% (Moderate rainfall suitable)',
    tempFit: '90% (28–34°C अनुकूल)',
    tempFitEn: '90% (28–34°C optimal)',
    soilFit: '86% (दोमट मिट्टी अनुकूल)',
    soilFitEn: '86% (Loam soil compatible)',
    stressFactor: 'न्यूनतम तनाव',
    stressFactorEn: 'Minimal stress',
    alternativeCrop: 'उड़द',
    alternativeCropEn: 'Black Gram (Urad)'
  },
  {
    id: 'groundnut',
    nameHi: 'मूंगफली (Groundnut)',
    nameEn: 'Groundnut (Peanut)',
    suitability: 'MODERATE',
    waterRequirement: 'मध्यम (550 मिमी)',
    waterRequirementEn: 'Moderate (550 mm)',
    keyWhy: 'पंचायत की हल्की भुरभुरी मिट्टी में फली का फैलाव अच्छा। सीमित सिंचाई के साथ सुरक्षित नकदी विकल्प।',
    keyWhyEn: 'Favorable pegging in friable sandy loam soils. Solid cash-crop return under moderate supplementary irrigation.',
    watchOut: 'पेगिंग (Pegging) के समय 15 दिन का सूखा पड़ने पर पैदावार घट सकती है। जलभराव बिल्कुल बर्दाश्त नहीं करती।',
    watchOutEn: 'Yield drops if prolonged dry spells occur during pegging; cannot tolerate waterlogging.',
    rainfallFit: '78% (समय पर वर्षा आवश्यक)',
    rainfallFitEn: '78% (Timely rainfall required)',
    tempFit: '84% (27–32°C अनुकूल)',
    tempFitEn: '84% (27–32°C optimal)',
    soilFit: '82% (भुरभुरी रेतीली दोमट)',
    soilFitEn: '82% (Friable sandy loam)',
    stressFactor: 'सूखा पड़ने पर मध्यम तनाव',
    stressFactorEn: 'Moderate stress under dry spells',
    alternativeCrop: 'तिल',
    alternativeCropEn: 'Sesame (Til)'
  },
  {
    id: 'paddy_basmati',
    nameHi: 'धान - बासमती (Basmati Paddy)',
    nameEn: 'Basmati Paddy (Rice)',
    suitability: 'LOW',
    waterRequirement: 'अत्यधिक (1250 मिमी)',
    waterRequirementEn: 'High (1,250 mm)',
    keyWhy: 'पारंपरिक फसल होने के बावजूद गिरते भूजल स्तर के कारण अत्यधिक जोखिम। 8-10 सिंचाई नलकूप से करने पर भारी बिजली/डीजल खर्च।',
    keyWhyEn: 'Traditional crop, but represents high climate risk due to depleted groundwater table. Heavy pumping costs and high vulnerability to dry spells.',
    watchOut: 'यदि वर्षा में 20% की भी कमी आई तो नलकूप पंपिंग लागत में 45% उछाल आएगा और भूजल स्तर और नीचे जाएगा।',
    watchOutEn: 'A 20% rainfall deficit increases tubewell energy costs by 45% and severely accelerates groundwater depletion.',
    rainfallFit: '62% (कम वर्षा में भारी नलकूप निर्भरता)',
    rainfallFitEn: '62% (Heavy tubewell dependency)',
    tempFit: '79% (पुष्पन पर उमस जरूरी)',
    tempFitEn: '79% (Humidity needed during flowering)',
    soilFit: '88% (मटियार दोमट अनुकूल)',
    soilFitEn: '88% (Clay loam suitable)',
    stressFactor: 'उच्च जल व ऊर्जा तनाव',
    stressFactorEn: 'High water & energy stress',
    alternativeCrop: 'मूंग या बाजरा',
    alternativeCropEn: 'Moong or Bajra'
  }
];

export const PanchayatPage: React.FC = () => {
  const { farm, playVoice } = useFarm();
  const { language } = useApp();
  const navigate = useNavigate();
  const en = language === 'en';

  const [selectedPanchayatCode, setSelectedPanchayatCode] = useState(
    farm.panchayat?.code || PILOT_PANCHAYATS_CATALOG[0].code
  );
  const [activeLayer, setActiveLayer] = useState<MapLayerType>('weather');
  const [expandedCropId, setExpandedCropId] = useState<string | null>('bajra');

  const currentPanchayat =
    PILOT_PANCHAYATS_CATALOG.find((p) => p.code === selectedPanchayatCode) || PILOT_PANCHAYATS_CATALOG[0];

  const mapLayerOptions: { id: MapLayerType; label: string; icon: any }[] = [
    { id: 'weather', label: en ? 'Weather' : 'मौसम (Weather)', icon: Thermometer },
    { id: 'rainfall', label: en ? 'Rainfall' : 'वर्षा (Rainfall)', icon: CloudRain },
    { id: 'soil', label: en ? 'Soil Moisture' : 'मिट्टी नमी (Soil)', icon: Droplets },
    { id: 'water', label: en ? 'Groundwater' : 'भूजल (Water)', icon: Droplets },
    { id: 'crop', label: en ? 'Crop Cover' : 'फसल आवरण (Crop)', icon: Sprout },
    { id: 'risk', label: en ? 'Risk Grid' : 'जोखिम ग्रिड (Risk)', icon: AlertTriangle }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      style={{ maxWidth: '1240px', margin: '0 auto', padding: '1.25rem 1rem 4rem' }}
    >
      {/* Top Hero Banner */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.94)',
          backdropFilter: 'blur(12px)',
          borderRadius: '16px',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          padding: '20px 24px',
          marginBottom: '1.25rem',
          boxShadow: '0 4px 14px rgba(0,0,0,0.02)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <span
                style={{
                  background: '#ecfdf5',
                  color: '#059669',
                  padding: '2px 10px',
                  borderRadius: '999px',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  letterSpacing: '0.04em'
                }}
              >
                PANCHAYAT CLIMATE INTELLIGENCE
              </span>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                1-km Hyperlocal Decision Engine
              </span>
            </div>

            <h1 style={{ fontSize: '1.45rem', color: '#0f172a', fontWeight: 800, margin: '0 0 4px 0' }}>
              {en ? 'Panchayat Climate & Crop Suitability' : 'पंचायत स्तर जलवायु व फसल उपयुक्तता'}
            </h1>
            <p style={{ color: '#475569', fontSize: '0.86rem', margin: 0, maxWidth: '780px' }}>
              {en
                ? 'Hyperlocal analysis of weather, soil, water availability, and climate scenarios to determine which crops are truly viable.'
                : 'इस पंचायत के मौसम, मिट्टी, जल उपलब्धता और भविष्य के जलवायु परिदृश्यों के आधार पर कौन सी फसल सबसे सही है?'}
            </p>
          </div>

          {/* Panchayat Selector Dropdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b' }}>
              {en ? 'Select Panchayat:' : 'चयनित पंचायत:'}
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <select
                value={selectedPanchayatCode}
                onChange={(e) => setSelectedPanchayatCode(e.target.value)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '9px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: '#0f172a',
                  background: '#ffffff',
                  cursor: 'pointer'
                }}
              >
                {PILOT_PANCHAYATS_CATALOG.map((p) => (
                  <option key={p.code} value={p.code}>
                    📍 {en ? p.name : p.hi} ({p.district})
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() =>
                  playVoice(
                    en
                      ? `In ${currentPanchayat.name} Panchayat, Bajra and Moong have highest suitability because they thrive under current rainfall and save significant groundwater pumping costs.`
                      : `${currentPanchayat.hi} पंचायत में बाजरा और मूंग की उपयुक्तता सर्वाधिक है क्योंकि यहाँ की बलुई दोमट मिट्टी और मौसम में ये फसलें कम पानी में भी स्वस्थ उपज देती हैं।`
                  )
                }
                title="Listen audio explanation"
                style={{
                  background: '#ecfdf5',
                  color: '#059669',
                  border: '1px solid #a7f3d0',
                  borderRadius: '9px',
                  padding: '6px 12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.76rem',
                  fontWeight: 700
                }}
              >
                <Volume2 size={15} />
                <span>{en ? 'Listen' : 'सुनाएं'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* LARGE MAP SECTION OCCUPYING FIRST VIEWPORT (Master Prompt Spec 10) */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.94)',
          backdropFilter: 'blur(12px)',
          borderRadius: '16px',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          overflow: 'hidden',
          marginBottom: '1.5rem',
          boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
        }}
      >
        {/* Layer Selector Bar: Strictly ONE layer active at a time */}
        <div
          style={{
            background: 'rgba(248, 250, 252, 0.95)',
            borderBottom: '1px solid #e2e8f0',
            padding: '8px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '8px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Layers size={15} color="#059669" />
            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#334155' }}>
              {en ? 'ACTIVE GRID LAYER (ONE AT A TIME):' : 'सक्रिय ग्रिड लेयर (ONE LAYER ACTIVE):'}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            {mapLayerOptions.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveLayer(id)}
                style={{
                  padding: '5px 11px',
                  borderRadius: '7px',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: activeLayer === id ? '#059669' : '#ffffff',
                  color: activeLayer === id ? '#ffffff' : '#64748b',
                  border: `1px solid ${activeLayer === id ? '#059669' : '#cbd5e1'}`,
                  boxShadow: activeLayer === id ? '0 2px 6px rgba(5,150,105,0.2)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={12} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Map Canvas */}
        <div style={{ position: 'relative', width: '100%', minHeight: '400px' }}>
          <MapView />
        </div>
      </div>

      {/* PANCHAYAT SNAPSHOT */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.94)',
          backdropFilter: 'blur(12px)',
          borderRadius: '16px',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          padding: '18px 22px',
          marginBottom: '1.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
        }}
      >
        <h3
          style={{
            fontSize: '0.85rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 800,
            color: '#059669',
            letterSpacing: '0.04em',
            margin: '0 0 12px 0'
          }}
        >
          {en
            ? `${currentPanchayat.name.toUpperCase()} PANCHAYAT SNAPSHOT`
            : `${currentPanchayat.hi.toUpperCase()} PANCHAYAT SNAPSHOT (पंचायत वस्तुस्थिति)`}
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '10px'
          }}
        >
          <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '10px' }}>
            <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>
              {en ? '🌧 Rainfall Forecast' : '🌧 वर्षा पूर्वानुमान'}
            </span>
            <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>
              12.4 mm (84% {en ? 'Prob' : 'संभावना'})
            </strong>
          </div>

          <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '10px' }}>
            <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>
              {en ? '💧 Groundwater Level' : '💧 भूजल व जल उपलब्धता'}
            </span>
            <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>
              {currentPanchayat.waterTable} ({en ? 'Tubewell' : 'नलकूप'})
            </strong>
          </div>

          <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '10px' }}>
            <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>
              {en ? '🌡 Temperature Range' : '🌡 तापमान रेंज'}
            </span>
            <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>28°C – 34°C</strong>
          </div>

          <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '10px' }}>
            <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>
              {en ? '🌱 Soil Classification' : '🌱 मिट्टी का प्रकार'}
            </span>
            <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>
              {en ? 'Sandy Loam' : currentPanchayat.soilType}
            </strong>
          </div>

          <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '10px' }}>
            <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>
              {en ? '🌾 Crop Pattern' : '🌾 वर्तमान फसल पैटर्न'}
            </span>
            <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>{currentPanchayat.dominantCrop}</strong>
          </div>
        </div>
      </div>

      {/* CORE DIFFERENTIATOR: "WHAT CAN THIS PANCHAYAT GROW?" */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.94)',
          backdropFilter: 'blur(12px)',
          borderRadius: '16px',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          padding: '22px 24px',
          boxShadow: '0 4px 14px rgba(0,0,0,0.02)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#059669', letterSpacing: '0.04em' }}>
              CORE DECISION DIFFERENTIATOR
            </div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: '2px 0 3px 0' }}>
              {en ? 'What Can This Panchayat Grow?' : 'इस पंचायत में क्या उगाया जा सकता है?'}
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.82rem', margin: 0 }}>
              {en
                ? 'No artificial rankings — scientifically grounded suitability (HIGH / MODERATE / LOW) and actionable reasons.'
                : 'कोई अवास्तविक स्कोर नहीं — केवल वैज्ञानिक उपयुक्तता (HIGH / MODERATE / LOW) और स्पष्ट कारण।'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/scenario')}
            style={{
              background: '#ecfdf5',
              color: '#059669',
              border: '1px solid #a7f3d0',
              padding: '6px 12px',
              borderRadius: '999px',
              fontSize: '0.75rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <Sliders size={13} />
            <span>{en ? 'Test in Scenario Lab →' : 'जलवायु परिदृश्य में टेस्ट करें →'}</span>
          </button>
        </div>

        {/* Crop Comparison List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {PANCHAYAT_CROPS.map((crop) => {
            const isExpanded = expandedCropId === crop.id;

            return (
              <div
                key={crop.id}
                style={{
                  borderRadius: '12px',
                  border: `1px solid ${
                    crop.suitability === 'HIGH'
                      ? '#bbf7d0'
                      : crop.suitability === 'MODERATE'
                      ? '#fde68a'
                      : '#fecaca'
                  }`,
                  background: crop.suitability === 'HIGH' ? '#f0fdf4' : '#ffffff',
                  padding: '14px 18px',
                  transition: 'all 0.15s ease'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '10px',
                    cursor: 'pointer'
                  }}
                  onClick={() => setExpandedCropId(isExpanded ? null : crop.id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: crop.suitability === 'HIGH' ? '#dcfce7' : '#f1f5f9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: crop.suitability === 'HIGH' ? '#059669' : '#64748b'
                      }}
                    >
                      <Sprout size={18} />
                    </div>

                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: '0 0 1px 0' }}>
                        {en ? crop.nameEn : crop.nameHi}
                      </h4>
                      <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                        {en ? 'Water Need:' : 'जल मांग:'} <strong>{en ? crop.waterRequirementEn : crop.waterRequirement}</strong>
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {crop.suitability === 'HIGH' ? (
                      <span
                        style={{
                          background: '#ecfdf5',
                          color: '#065f46',
                          border: '1px solid #a7f3d0',
                          padding: '3px 10px',
                          borderRadius: '999px',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <CheckCircle2 size={12} color="#059669" />
                        {en ? 'HIGH SUITABILITY' : 'HIGH SUITABILITY (उच्च)'}
                      </span>
                    ) : crop.suitability === 'MODERATE' ? (
                      <span
                        style={{
                          background: '#fffbeb',
                          color: '#92400e',
                          border: '1px solid #fde68a',
                          padding: '3px 10px',
                          borderRadius: '999px',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Info size={12} color="#d97706" />
                        {en ? 'MODERATE SUITABILITY' : 'MODERATE (मध्यम)'}
                      </span>
                    ) : (
                      <span
                        style={{
                          background: '#fef2f2',
                          color: '#991b1b',
                          border: '1px solid #fecaca',
                          padding: '3px 10px',
                          borderRadius: '999px',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <AlertTriangle size={12} color="#dc2626" />
                        {en ? 'HIGHER WATER RISK' : 'HIGHER WATER RISK (जोखिम)'}
                      </span>
                    )}

                    <button
                      type="button"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#059669',
                        fontSize: '0.76rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px'
                      }}
                    >
                      <span>{isExpanded ? (en ? 'Hide' : 'कम देखें') : (en ? 'SEE WHY' : 'SEE WHY [देखें क्यों?]')}</span>
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </div>
                </div>

                {/* EXPANDABLE REASONS & ATTRIBUTES */}
                {isExpanded && (
                  <div
                    style={{
                      marginTop: '12px',
                      paddingTop: '10px',
                      borderTop: '1px solid #e2e8f0',
                      fontSize: '0.78rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}
                  >
                    <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <strong style={{ color: '#059669', display: 'block', marginBottom: '2px' }}>
                        ✓ {en ? 'Why is this crop suitable?' : 'क्यों उपयुक्त है? (Why?)'}
                      </strong>
                      <span style={{ color: '#334155' }}>{en ? crop.keyWhyEn : crop.keyWhy}</span>
                    </div>

                    <div style={{ background: '#fffbeb', padding: '10px 12px', borderRadius: '8px', borderLeft: '3px solid #f59e0b' }}>
                      <strong style={{ color: '#b45309', display: 'block', marginBottom: '2px' }}>
                        ⚠ {en ? 'What to watch out for?' : 'क्या ध्यान रखें? (Watch Out)'}
                      </strong>
                      <span style={{ color: '#451a03' }}>{en ? crop.watchOutEn : crop.watchOut}</span>
                    </div>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                        gap: '6px',
                        background: '#f8fafc',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        fontSize: '0.74rem'
                      }}
                    >
                      <div>
                        <span style={{ color: '#64748b' }}>{en ? 'Rain Fit:' : 'वर्षा अनुकूलता:'}</span>{' '}
                        <strong>{en ? crop.rainfallFitEn : crop.rainfallFit}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748b' }}>{en ? 'Temp Fit:' : 'तापमान अनुकूलता:'}</span>{' '}
                        <strong>{en ? crop.tempFitEn : crop.tempFit}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748b' }}>{en ? 'Soil Fit:' : 'मिट्टी अनुकूलता:'}</span>{' '}
                        <strong>{en ? crop.soilFitEn : crop.soilFit}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748b' }}>{en ? 'Alternative:' : 'वैकल्पिक फसल:'}</span>{' '}
                        <strong>{en ? crop.alternativeCropEn : crop.alternativeCrop}</strong>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
