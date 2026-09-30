import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Sprout,
  Clock,
  Calendar,
  Ruler,
  Droplets,
  TestTube,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Check,
  Navigation
} from 'lucide-react';
import {
  useFarm,
  PILOT_PANCHAYATS_CATALOG,
  PanchayatInfo,
  FarmProfile
} from '../contexts/FarmContext';
import { useApp } from '../contexts/AppContext';
import { detectUserLocation } from '../services/geoService';

const CROP_CHOICES = [
  { id: 'paddy', nameHi: 'धान (बासमती)', nameEn: 'Paddy (Basmati)', waterNeedMm: 1250, icon: '🌾' },
  { id: 'wheat', nameHi: 'गेहूं (HD-2967)', nameEn: 'Wheat (HD-2967)', waterNeedMm: 450, icon: '🌾' },
  { id: 'bajra', nameHi: 'बाजरा', nameEn: 'Pearl Millet (Bajra)', waterNeedMm: 350, icon: '🌱' },
  { id: 'moong', nameHi: 'मूंग', nameEn: 'Green Gram (Moong)', waterNeedMm: 300, icon: '🌱' },
  { id: 'mustard', nameHi: 'सरसों (पूसा-31)', nameEn: 'Mustard (Pusa-31)', waterNeedMm: 320, icon: '🌼' },
  { id: 'groundnut', nameHi: 'मूँगफली', nameEn: 'Groundnut (Peanut)', waterNeedMm: 500, icon: '🥜' },
  { id: 'mango', nameHi: 'दशहरी आम', nameEn: 'Dasheri Mango', waterNeedMm: 800, icon: '🥭' }
];

const STAGES = [
  { id: 'Sowing', labelHi: 'बुवाई', labelEn: 'Sowing' },
  { id: 'Vegetative', labelHi: 'वानस्पतिक (कल्ले फूटना)', labelEn: 'Vegetative' },
  { id: 'Flowering', labelHi: 'फूल व बाली आना', labelEn: 'Flowering & Heading' },
  { id: 'Grain Filling', labelHi: 'दाना भरना', labelEn: 'Grain Filling' },
  { id: 'Harvest', labelHi: 'कटाई तैयार', labelEn: 'Harvest Ready' },
  { id: 'Unknown', labelHi: 'सटीक याद नहीं (AI अनुमान लगाए)', labelEn: "Estimate for me (I'm not sure)" }
];

export const FarmSetupPage: React.FC = () => {
  const { configureFarm } = useFarm();
  const { language, setLocation } = useApp();
  const navigate = useNavigate();
  const en = language === 'en';

  const [step, setStep] = useState<number>(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [pipelineStep, setPipelineStep] = useState(0);

  // Form State
  const [selectedPanchayat, setSelectedPanchayat] = useState<PanchayatInfo>(PILOT_PANCHAYATS_CATALOG[0]);
  const [selectedCrop, setSelectedCrop] = useState(CROP_CHOICES[0]);
  const [selectedStage, setSelectedStage] = useState<any>('Flowering');
  const [sowingDate, setSowingDate] = useState('2026-07-15');
  const [dontRememberDate, setDontRememberDate] = useState(false);
  const [landArea, setLandArea] = useState<number>(2);
  const [landUnit, setLandUnit] = useState<'bigha' | 'acre'>('bigha');
  const [waterSource, setWaterSource] = useState<'tubewell' | 'canal' | 'rainfed' | 'mixed'>('tubewell');
  const [hasSoilCard, setHasSoilCard] = useState<boolean>(true);
  const [soilType, setSoilType] = useState<string>('Sandy Loam');

  // GPS State
  const [detectingGps, setDetectingGps] = useState(false);
  const [gpsBanner, setGpsBanner] = useState<string | null>(null);

  const handleGpsDetect = async () => {
    setDetectingGps(true);
    setGpsBanner(en ? 'Detecting your coordinates...' : 'जीपीएस स्थान खोजा जा रहा है...');
    try {
      const res = await detectUserLocation(PILOT_PANCHAYATS_CATALOG);
      if (res.success && res.nearestPanchayat) {
        const p = res.nearestPanchayat;
        setSelectedPanchayat(p);
        setSoilType(p.soilType);
        setGpsBanner(
          en
            ? `📍 Detected: ${res.detectedPlaceName || p.name} (Mapped to nearest agro-zone: ${p.name}, ${res.distanceKm} km)`
            : `📍 स्थान मिला: ${p.hi} (${res.distanceKm} किमी दूर निकटतम पंचायत ग्रिड)`
        );
      } else {
        setGpsBanner(res.errorMessage || (en ? 'Location could not be determined.' : 'स्थान निर्धारित नहीं किया जा सका।'));
      }
    } catch {
      setGpsBanner(en ? 'Failed to access GPS.' : 'जीपीएस एक्सेस विफल रहा।');
    } finally {
      setDetectingGps(false);
    }
  };

  const PIPELINE_NODES = [
    en ? 'LOCATION SYNC (1-km Panchayats)' : 'स्थान समन्वय (1-किमी पंचायत)',
    en ? 'WEATHER DOWNSCALING (IMD / Open-Meteo)' : 'मौसम डाउनस्केलिंग (आईएमडी / ओपन-मेटियो)',
    en ? 'SATELLITE SPECTRAL INDICES (Sentinel-2)' : 'उपग्रह सूचकांक (सेंटिनल-2 एनडीवीआई)',
    en ? 'SOIL HYDROLOGY & NPK PROFILE' : 'मृदा जल संतुलन व एनपीके प्रोफाइल',
    en ? 'CROP WATER BALANCE & STAGE MODEL' : 'फसल जल मांग व विकास मॉडल',
    en ? 'HAZARD & RISK PROBABILITY' : 'आपदा व कीट जोखिम आकलन',
    en ? 'FINAL ACTION ADVISORY' : 'अंतिम कृषि सलाह निर्माण'
  ];

  const handleFinishSetup = () => {
    setIsAnalyzing(true);
    let cur = 0;
    const interval = setInterval(() => {
      cur += 1;
      setPipelineStep(cur);
      if (cur >= PIPELINE_NODES.length) {
        clearInterval(interval);
        setTimeout(() => {
          // Synchronize AppContext location so Navbar and ContextBar never mismatch
          setLocation({
            panchayatCode: selectedPanchayat.code,
            panchayatName: selectedPanchayat.name,
            district: selectedPanchayat.district,
            state: selectedPanchayat.state,
            lat: selectedPanchayat.lat,
            lon: selectedPanchayat.lon
          });

          configureFarm({
            panchayat: selectedPanchayat,
            crop: {
              id: selectedCrop.id,
              nameHi: selectedCrop.nameHi,
              nameEn: selectedCrop.nameEn,
              stage: selectedStage,
              sowingDate: dontRememberDate ? undefined : sowingDate,
              waterNeedMm: selectedCrop.waterNeedMm
            },
            landArea,
            landUnit,
            waterSource,
            soil: {
              type: selectedPanchayat.soilType,
              ph: selectedPanchayat.ph,
              n: 'Medium',
              p: 'High',
              k: 'Medium',
              hasSoilHealthCard: hasSoilCard
            }
          });
          navigate('/my-farm');
        }, 500);
      }
    }, 400);
  };

  if (isAnalyzing) {
    return (
      <div
        style={{
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          textAlign: 'center'
        }}
      >
        <div style={{ maxWidth: '540px', width: '100%' }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              border: '4px solid #bbf7d0',
              borderTopColor: '#059669',
              margin: '0 auto 24px'
            }}
          />

          <h2 style={{ fontSize: '1.6rem', color: '#0f172a', fontWeight: 800, marginBottom: '8px' }}>
            Preparing Your Farm Intelligence...
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '24px' }}>
            Connecting 1-km hyperlocal meteorological physics, satellite telemetry, and agronomic models for {selectedPanchayat.hi}.
          </p>

          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '16px', textAlign: 'left' }}>
            {PIPELINE_NODES.map((node, i) => {
              const isDone = i < pipelineStep;
              const isCurrent = i === pipelineStep;
              return (
                <div
                  key={node}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 0',
                    borderBottom: i < PIPELINE_NODES.length - 1 ? '1px solid #f1f5f9' : 'none',
                    color: isDone ? '#059669' : isCurrent ? '#0284c7' : '#94a3b8',
                    fontSize: '0.82rem',
                    fontWeight: isDone || isCurrent ? 700 : 500
                  }}
                >
                  <div
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      background: isDone ? '#ecfdf5' : isCurrent ? '#e0f2fe' : '#f1f5f9',
                      border: `1.5px solid ${isDone ? '#059669' : isCurrent ? '#0284c7' : '#cbd5e1'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px'
                    }}
                  >
                    {isDone ? '✓' : isCurrent ? '●' : ''}
                  </div>
                  <span>{node}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto', padding: '2rem 1.25rem 5rem' }}>
      {/* Step Indicator Progress Bar */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '0.82rem' }}>
          <span style={{ color: '#059669', fontWeight: 800 }}>STEP {step} OF 8</span>
          <span style={{ color: '#64748b' }}>
            {step === 1 && '📍 Location'}
            {step === 2 && '🌾 Crop'}
            {step === 3 && '🌱 Growth Stage'}
            {step === 4 && '📅 Sowing Date'}
            {step === 5 && '📏 Land Area'}
            {step === 6 && '💧 Water Supply'}
            {step === 7 && '🧪 Soil Telemetry'}
            {step === 8 && '✅ Final Review'}
          </span>
        </div>
        <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
          <motion.div
            style={{ height: '100%', background: '#059669', borderRadius: '999px' }}
            animate={{ width: `${(step / 8) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Step Contents */}
      <AnimatePresence mode="wait">
        {/* STEP 1: LOCATION */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
          >
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
              {en ? 'Where is your farm located?' : 'सबसे पहले अपना खेत बताएं।'}
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.86rem', marginBottom: '1.25rem' }}>
              {en
                ? 'Select your Panchayat so we can sync 1-km topographical weather and soil data.'
                : 'इससे हम आपके क्षेत्र का 1-किमी हाइपरलोकल मौसम और पंचायत की स्थिति समझ पाएंगे।'}
            </p>

            {/* GPS Auto-Detect Button */}
            <button
              type="button"
              onClick={handleGpsDetect}
              disabled={detectingGps}
              style={{
                width: '100%',
                padding: '12px 18px',
                borderRadius: '12px',
                border: '1.5px solid #0284c7',
                background: '#f0f9ff',
                color: '#0369a1',
                fontWeight: 800,
                fontSize: '0.86rem',
                cursor: detectingGps ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginBottom: '1rem',
                boxShadow: '0 2px 6px rgba(2, 132, 199, 0.08)',
                transition: 'all 0.15s ease'
              }}
            >
              <Navigation size={16} />
              <span>
                {detectingGps
                  ? (en ? 'Acquiring GPS location...' : 'जीपीएस स्थान खोजा जा रहा है...')
                  : (en ? '📍 Use My Real Location (Auto-Detect Nearest Panchayat)' : '📍 मेरा सटीक स्थान पहचानें (निकटतम पंचायत ग्रिड)')}
              </span>
            </button>

            {gpsBanner && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: '#ecfdf5',
                  color: '#047857',
                  border: '1px solid #86efac',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  marginBottom: '1rem'
                }}
              >
                {gpsBanner}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.5rem' }}>
              {PILOT_PANCHAYATS_CATALOG.map((p) => {
                const isSelected = selectedPanchayat.code === p.code;
                return (
                  <button
                    key={p.code}
                    type="button"
                    onClick={() => setSelectedPanchayat(p)}
                    style={{
                      padding: '14px 18px',
                      borderRadius: '14px',
                      border: isSelected ? '2px solid #059669' : '1.5px solid #e2e8f0',
                      background: isSelected ? 'rgba(240, 253, 244, 0.95)' : 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a' }}>
                        {en ? p.name : p.hi} ({p.district})
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                        {en ? `Block: ${p.block} • ${p.soilType}` : `ब्लॉक: ${p.block} • ज़िला: ${p.district} • ${p.soilType}`}
                      </div>
                    </div>
                    {isSelected && <Check size={18} color="#059669" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* STEP 2: CROP */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
          >
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
              {en ? 'What crop are you growing?' : 'अब बताएं, खेत में क्या उगा रहे हैं?'}
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.86rem', marginBottom: '1.5rem' }}>
              {en ? 'Select your primary crop to evaluate water requirement and lifecycle.' : 'अपनी मुख्य फसल चुनें जिसका आप प्रबंधन कर रहे हैं।'}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '1.5rem' }}>
              {CROP_CHOICES.map((c) => {
                const isSelected = selectedCrop.id === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCrop(c)}
                    style={{
                      padding: '14px',
                      borderRadius: '14px',
                      border: isSelected ? '2px solid #059669' : '1.5px solid #e2e8f0',
                      background: isSelected ? 'rgba(240, 253, 244, 0.95)' : 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}
                  >
                    <span style={{ fontSize: '1.5rem' }}>{c.icon}</span>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>
                        {en ? c.nameEn : c.nameHi}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        {en ? `${c.waterNeedMm}mm water` : `${c.waterNeedMm} मिमी जल मांग`}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* STEP 3: STAGE */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
          >
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
              {en ? 'What is the current growth stage?' : 'फसल अभी किस अवस्था (Stage) पर है?'}
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.86rem', marginBottom: '1.5rem' }}>
              {en ? 'Crop coefficient and irrigation needs shift with phenology.' : 'पानी और खाद की ज़रूरत फसल के जीवन चक्र पर निर्भर करती है।'}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.5rem' }}>
              {STAGES.map((st) => {
                const isSelected = selectedStage === st.id;
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setSelectedStage(st.id)}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: isSelected ? '2px solid #059669' : '1.5px solid #e2e8f0',
                      background: isSelected ? 'rgba(240, 253, 244, 0.95)' : 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>
                      {en ? st.labelEn : st.labelHi}
                    </span>
                    {isSelected && <Check size={16} color="#059669" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* STEP 4: SOWING DATE */}
        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
          >
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
              {en ? 'When did you sow the crop?' : 'फसल कब बोई थी?'}
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.86rem', marginBottom: '1.5rem' }}>
              {en ? 'Sowing date informs Growing Degree Days (GDD) and yield projection.' : 'बुवाई की तारीख से ग्रोइंग डिग्री डेज़ (GDD) व परिपक्वता का सटीक अनुमान लगता है।'}
            </p>

            <div style={{ background: 'rgba(255, 255, 255, 0.94)', border: '1.5px solid #e2e8f0', borderRadius: '16px', padding: '20px', marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                {en ? 'Estimated Sowing Date:' : 'बुवाई की अनुमानित तारीख:'}
              </label>
              <input
                type="date"
                value={sowingDate}
                disabled={dontRememberDate}
                onChange={(e) => setSowingDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.9rem',
                  color: '#0f172a',
                  marginBottom: '12px'
                }}
              />

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.82rem', color: '#475569' }}>
                <input
                  type="checkbox"
                  checked={dontRememberDate}
                  onChange={(e) => setDontRememberDate(e.target.checked)}
                  style={{ width: '15px', height: '15px', accentColor: '#059669' }}
                />
                <span>{en ? "I don't remember exactly — estimate with weather GDD model" : "मुझे ठीक से याद नहीं है (I don't remember) — मौसम मॉडल से अनुमान लगाएं"}</span>
              </label>
            </div>
          </motion.div>
        )}

        {/* STEP 5: FARM SIZE */}
        {step === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
          >
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
              {en ? 'What is your farm area?' : 'खेत कितना बड़ा है?'}
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.86rem', marginBottom: '1.5rem' }}>
              {en ? 'Calibrates total irrigation pumping volume and input application.' : 'इससे खाद की मात्रा और सिंचाई के पानी की बचत का सटीक हिसाब बनेगा।'}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px', marginBottom: '1.25rem' }}>
              {[1, 2, 5, 10].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setLandArea(val)}
                  style={{
                    padding: '14px 10px',
                    borderRadius: '14px',
                    border: landArea === val ? '2px solid #059669' : '1.5px solid #e2e8f0',
                    background: landArea === val ? 'rgba(240, 253, 244, 0.95)' : 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    fontSize: '1rem',
                    fontWeight: 800,
                    color: landArea === val ? '#059669' : '#0f172a',
                    cursor: 'pointer'
                  }}
                >
                  {val} {landUnit === 'bigha' ? (en ? 'Bigha' : 'बीघा') : (en ? 'Acre' : 'एकड़')}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => setLandUnit('bigha')}
                style={{
                  padding: '5px 12px',
                  borderRadius: '999px',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  border: landUnit === 'bigha' ? '1.5px solid #059669' : '1px solid #cbd5e1',
                  background: landUnit === 'bigha' ? '#ecfdf5' : '#ffffff',
                  color: landUnit === 'bigha' ? '#047857' : '#64748b',
                  cursor: 'pointer'
                }}
              >
                {en ? 'Bigha' : 'बीघा (Bigha)'}
              </button>
              <button
                type="button"
                onClick={() => setLandUnit('acre')}
                style={{
                  padding: '5px 12px',
                  borderRadius: '999px',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  border: landUnit === 'acre' ? '1.5px solid #059669' : '1px solid #cbd5e1',
                  background: landUnit === 'acre' ? '#ecfdf5' : '#ffffff',
                  color: landUnit === 'acre' ? '#047857' : '#64748b',
                  cursor: 'pointer'
                }}
              >
                {en ? 'Acre' : 'एकड़ (Acre)'}
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 6: WATER */}
        {step === 6 && (
          <motion.div
            key="step6"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
          >
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
              {en ? 'How do you get water for your field?' : 'खेत में पानी कहाँ से आता है?'}
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.86rem', marginBottom: '1.5rem' }}>
              {en ? 'Identifies irrigation flexibility and vulnerability to drought.' : 'सिंचाई का साधन जानने से सूखा जोखिम और जल तनाव का सही आकलन होता है।'}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px', marginBottom: '1.5rem' }}>
              {[
                { id: 'tubewell', labelHi: 'नलकूप / बोरवेल', labelEn: 'Tubewell / Borewell', descHi: 'निजी या सरकारी ट्यूबवेल', descEn: 'Electric or diesel borewell', icon: '⚡' },
                { id: 'canal', labelHi: 'नहरी पानी', labelEn: 'Canal Irrigation', descHi: 'नहर या माइनर की सप्लाई', descEn: 'Govt canal / minor system', icon: '🚰' },
                { id: 'rainfed', labelHi: 'सिर्फ बारिश (बारानी)', labelEn: 'Rainfed (Barani)', descHi: 'कोई सिंचाई साधन नहीं', descEn: 'Fully dependent on rain', icon: '🌧️' },
                { id: 'mixed', labelHi: 'मिश्रित साधन', labelEn: 'Mixed Access', descHi: 'नहर + बोरवेल दोनों', descEn: 'Canal + tubewell backup', icon: '🔄' }
              ].map((ws) => {
                const isSelected = waterSource === ws.id;
                return (
                  <button
                    key={ws.id}
                    type="button"
                    onClick={() => setWaterSource(ws.id as any)}
                    style={{
                      padding: '14px',
                      borderRadius: '14px',
                      border: isSelected ? '2px solid #0284c7' : '1.5px solid #e2e8f0',
                      background: isSelected ? 'rgba(240, 249, 255, 0.95)' : 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontSize: '1.4rem', marginBottom: '6px' }}>{ws.icon}</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>
                      {en ? ws.labelEn : ws.labelHi}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                      {en ? ws.descEn : ws.descHi}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* STEP 7: SOIL */}
        {step === 7 && (
          <motion.div
            key="step7"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
          >
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
              {en ? 'What do you know about your soil?' : 'मिट्टी के बारे में क्या जानते हैं?'}
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.86rem', marginBottom: '1.5rem' }}>
              {en ? 'No technical testing required. We integrate your Panchayat baseline automatically.' : 'तकनीकी डेटा जरूरी नहीं है। आपके पंचायत का बेसलाइन डेटा हम अपने आप जोड़ देंगे।'}
            </p>

            <div style={{ background: 'rgba(255, 255, 255, 0.94)', border: '1.5px solid #e2e8f0', borderRadius: '16px', padding: '16px', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>
                  {en ? 'Do you have a Soil Health Card?' : 'सॉइल हेल्थ कार्ड (Soil Health Card) उपलब्ध है?'}
                </span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setHasSoilCard(true)}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '999px',
                      border: hasSoilCard ? '1.5px solid #059669' : '1px solid #cbd5e1',
                      background: hasSoilCard ? '#ecfdf5' : '#ffffff',
                      color: hasSoilCard ? '#047857' : '#64748b',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {en ? 'Yes' : 'हाँ (Yes)'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setHasSoilCard(false)}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '999px',
                      border: !hasSoilCard ? '1.5px solid #059669' : '1px solid #cbd5e1',
                      background: !hasSoilCard ? '#ecfdf5' : '#ffffff',
                      color: !hasSoilCard ? '#047857' : '#64748b',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {en ? 'No' : 'नहीं (No)'}
                  </button>
                </div>
              </div>

              <div style={{ padding: '10px 12px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.78rem', color: '#475569' }}>
                {en ? `Auto-detected soil for ${selectedPanchayat.name}: ` : `${selectedPanchayat.hi} के लिए ऑटो-डिटेक्टेड मृदा: `}
                <strong>{selectedPanchayat.soilType}</strong>, pH: <strong>{selectedPanchayat.ph}</strong>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 8: REVIEW */}
        {step === 8 && (
          <motion.div
            key="step8"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
          >
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
              {en ? 'Review Your Farm Configuration' : 'आपके खेत का सारांश (Farm Review)'}
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.86rem', marginBottom: '1.5rem' }}>
              {en ? 'Verify your details before launching the intelligence pipeline.' : 'सब कुछ सही है? क्लिक करते ही AI मॉडल आपके खेत का सटीक विश्लेषण तैयार करेगा।'}
            </p>

            <div style={{ background: 'rgba(255, 255, 255, 0.94)', border: '1.5px solid #86efac', borderRadius: '16px', padding: '18px 20px', boxShadow: '0 4px 14px rgba(5, 150, 105, 0.06)', marginBottom: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>{en ? '📍 Panchayat' : '📍 पंचायत'}</div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>{en ? selectedPanchayat.name : `${selectedPanchayat.hi} (${selectedPanchayat.name})`}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>{en ? '🌾 Primary Crop' : '🌾 मुख्य फसल'}</div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>{en ? selectedCrop.nameEn : selectedCrop.nameHi}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>{en ? '🌱 Growth Stage' : '🌱 फसल अवस्था'}</div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>{selectedStage}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>{en ? '📏 Land Area' : '📏 खेत रकबा'}</div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>{landArea} {landUnit === 'bigha' ? (en ? 'Bigha' : 'बीघा') : (en ? 'Acre' : 'एकड़')}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>{en ? '💧 Water Access' : '💧 सिंचाई साधन'}</div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>
                    {waterSource === 'tubewell' ? (en ? 'Tubewell' : 'नलकूप / बोरवेल') : waterSource === 'canal' ? (en ? 'Canal' : 'नहर') : (en ? 'Rainfed' : 'बारिश')}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>{en ? '🧪 Soil Type' : '🧪 मृदा प्रकार'}</div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>{selectedPanchayat.soilType}</div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleFinishSetup}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                background: '#059669',
                color: '#ffffff',
                border: 'none',
                fontSize: '0.98rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 6px 20px rgba(5, 150, 105, 0.25)'
              }}
            >
              <Sparkles size={18} />
              <span>{en ? 'ANALYZE MY FARM' : 'खेत का विश्लेषण करें'}</span>
              <ArrowRight size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Buttons */}
      {step < 8 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 18px',
                borderRadius: '12px',
                border: '1.5px solid #cbd5e1',
                background: '#ffffff',
                color: '#475569',
                fontSize: '0.88rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <ArrowLeft size={16} />
              <span>{en ? 'Back' : 'पिछला'}</span>
            </button>
          ) : <div />}

          <button
            type="button"
            onClick={() => setStep(step + 1)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 24px',
              borderRadius: '12px',
              border: 'none',
              background: '#059669',
              color: '#ffffff',
              fontSize: '0.92rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(5, 150, 105, 0.25)'
            }}
          >
            <span>{en ? 'Next Step' : 'अगला कदम'}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};
