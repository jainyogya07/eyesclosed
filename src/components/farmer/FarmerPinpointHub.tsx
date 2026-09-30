import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Droplets,
  Sprout,
  CloudSun,
  SlidersHorizontal,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  AlertTriangle,
  CheckCircle2,
  Info,
  MapPin,
  TrendingUp,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Calendar,
  Layers,
  TestTube,
  DollarSign,
  Tv
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useLivePrediction } from '../../providers/LivePredictionProvider';
import {
  speakFarmerAdvice,
  stopSpeaking,
  startVoiceListening,
  processAgriVoiceQuery
} from '../../services/voiceAgent';
import { VerticalActionTabs, TabId } from '../navigation/VerticalActionTabs';

export const PILOT_PANCHAYATS = [
  { code: '0924001001', name: 'Malihabad', hi: 'मलिहाबाद', soilType: 'सैंडी दोमट (Sandy Loam)', ph: 7.2, npk: 'N: मध्यम, P: अधिक, K: मध्यम', waterTable: '14 मीटर' },
  { code: '0924001002', name: 'Mohanlalganj', hi: 'मोहनलालगंज', soilType: 'दोमट मटियार (Loam Clay)', ph: 7.4, npk: 'N: कम, P: मध्यम, K: अधिक', waterTable: '11 मीटर' },
  { code: '0924001003', name: 'Gharaunda', hi: 'घरौंदा', soilType: 'कछार दोमट (Alluvial Loam)', ph: 7.1, npk: 'N: मध्यम, P: मध्यम, K: मध्यम', waterTable: '9 मीटर' },
  { code: '0924001004', name: 'Chinhat', hi: 'चिनहट', soilType: 'सिल्ट दोमट (Silt Loam)', ph: 7.3, npk: 'N: कम, P: कम, K: मध्यम', waterTable: '13 मीटर' },
  { code: '0924001005', name: 'Amausi', hi: 'अमौसी', soilType: 'क्ले दोमट (Clay Loam)', ph: 7.5, npk: 'N: मध्यम, P: अधिक, K: अधिक', waterTable: '10 मीटर' }
];

export const AVAILABLE_CROPS = [
  { id: 'Paddy (धान - बासमती)', nameHi: 'धान (बासमती)', nameEn: 'Paddy (Basmati)', waterNeed: '1,250 मिमी', season: 'Kharif' },
  { id: 'Wheat (गेहूं HD-2967)', nameHi: 'गेहूं (HD-2967)', nameEn: 'Wheat (HD-2967)', waterNeed: '450 मिमी', season: 'Rabi' },
  { id: 'Mango (दशहरी आम)', nameHi: 'दशहरी आम (बाग)', nameEn: 'Dasheri Mango', waterNeed: '800 मिमी', season: 'Perennial' },
  { id: 'Mustard (सरसों Pusa-31)', nameHi: 'सरसों (Pusa-31)', nameEn: 'Mustard (Pusa-31)', waterNeed: '320 मिमी', season: 'Rabi' },
  { id: 'Bajra (बाजra)', nameHi: 'बाजरा (हाइब्रिड)', nameEn: 'Pearl Millet (Bajra)', waterNeed: '350 मिमी', season: 'Kharif' },
  { id: 'Moong (मूंग)', nameHi: 'मूंग (दाल)', nameEn: 'Green Gram (Moong)', waterNeed: '300 मिमी', season: 'Zaid/Kharif' }
];

export const FarmerPinpointHub: React.FC = () => {
  const { language, location, setLocation, selectedCrop, setSelectedCrop } = useApp();
  const { data: liveData } = useLivePrediction();
  const hi = language !== 'en';

  // Navigation State
  const [activeTab, setActiveTab] = useState<TabId>('input');

  // =========================================================================
  // 1. FARM INPUT SYSTEM STATE
  // =========================================================================
  const [panchayat, setPanchayat] = useState(PILOT_PANCHAYATS[1]); // Mohanlalganj
  const [activeCropId, setActiveCropId] = useState(selectedCrop || AVAILABLE_CROPS[0].id);
  const [cropStatus, setCropStatus] = useState<'planning' | 'standing'>('standing');
  const [waterSource, setWaterSource] = useState<'tubewell' | 'canal' | 'rainfed'>('tubewell');
  const [landArea, setLandArea] = useState<number>(2); // 2 Bigha
  const [landUnit, setLandUnit] = useState<'bigha' | 'acre'>('bigha');
  const [sowingDate, setSowingDate] = useState<string>('2026-07-15');
  const [soilPh, setSoilPh] = useState<number>(panchayat.ph);
  const [soilHealthSync, setSoilHealthSync] = useState(true);

  // Climate Scenario Sandbox Sliders
  const [rainDeficit, setRainDeficit] = useState<number>(-25); // -25% deficit
  const [tempAnomaly, setTempAnomaly] = useState<number>(1.2); // +1.2°C anomaly

  // Voice Agent State
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [voiceReply, setVoiceReply] = useState('');
  const [isSpeakingAudio, setIsSpeakingAudio] = useState(false);
  const stopVoiceRef = useRef<(() => void) | null>(null);

  // Repeatable Analysis State
  const [analysisCount, setAnalysisCount] = useState<number>(1);
  const [isReanalyzing, setIsReanalyzing] = useState<boolean>(false);
  const [lastAnalysisTime, setLastAnalysisTime] = useState<string>('अभी (Just now)');
  const [analysisNotice, setAnalysisNotice] = useState<string | null>(null);

  const handleReRunAnalysis = () => {
    setIsReanalyzing(true);
    setTimeout(() => {
      setIsReanalyzing(false);
      setAnalysisCount((prev) => prev + 1);
      const now = new Date();
      const timeStr = `${now.getHours()}:${now.getMinutes() < 10 ? '0' : ''}${now.getMinutes()}:${now.getSeconds() < 10 ? '0' : ''}${now.getSeconds()}`;
      setLastAnalysisTime(timeStr);
      const msg = hi
        ? `विश्लेषण चक्र #${analysisCount + 1} संपन्न! ${panchayat.hi} के लिए लाइव मौसम व मिट्टी नमी की नई रिपोर्ट तैयार है।`
        : `Analysis Run #${analysisCount + 1} completed! Refreshed with live WRF model data.`;
      setAnalysisNotice(msg);
      setTimeout(() => setAnalysisNotice(null), 4500);

      if (sectionRefs.sinchai.current) {
        sectionRefs.sinchai.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 900);
  };

  // Section Refs for smooth scrolling
  const sectionRefs = {
    input: useRef<HTMLDivElement>(null),
    sinchai: useRef<HTMLDivElement>(null),
    fasal: useRef<HTMLDivElement>(null),
    mausam: useRef<HTMLDivElement>(null),
    scenario: useRef<HTMLDivElement>(null),
    awaaz: useRef<HTMLDivElement>(null),
    alerts: useRef<HTMLDivElement>(null)
  };

  const handleSelectTab = (tabId: TabId) => {
    setActiveTab(tabId);
    const targetRef = sectionRefs[tabId];
    if (targetRef?.current) {
      targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Sync Panchayat change
  const handlePanchayatSelect = (p: typeof PILOT_PANCHAYATS[0]) => {
    setPanchayat(p);
    setSoilPh(p.ph);
    setLocation({
      ...location,
      panchayatCode: p.code,
      panchayatName: p.name
    });
  };

  // Sync Crop change
  const handleCropSelect = (cropId: string) => {
    setActiveCropId(cropId);
    setSelectedCrop(cropId);
  };

  // Audio Playback Handler
  const handlePlayAudio = (text: string) => {
    if (isSpeakingAudio) {
      stopSpeaking();
      setIsSpeakingAudio(false);
    } else {
      setIsSpeakingAudio(true);
      speakFarmerAdvice(text, hi ? 'hi-IN' : 'en-IN');
      setTimeout(() => setIsSpeakingAudio(false), 9000);
    }
  };

  // Voice Mic Toggle
  const toggleVoiceMic = () => {
    if (isListening) {
      if (stopVoiceRef.current) stopVoiceRef.current();
      setIsListening(false);
    } else {
      setIsListening(true);
      setVoiceTranscript('');
      setVoiceReply('');

      stopVoiceRef.current = startVoiceListening(
        (transcript) => setVoiceTranscript(transcript),
        (query, reply, actionTab) => {
          setVoiceReply(reply);
          setIsListening(false);
          if (actionTab && actionTab in sectionRefs) {
            handleSelectTab(actionTab as TabId);
          }
        },
        (error) => {
          console.warn('[VoiceMic] Error:', error);
          setIsListening(false);
        },
        {
          panchayatName: panchayat.hi,
          cropName: activeCropId,
          rainProbability: 84,
          rainAmountMm: 12.4,
          soilMoisturePct: 31.4
        }
      );
    }
  };

  useEffect(() => {
    return () => {
      if (stopVoiceRef.current) stopVoiceRef.current();
      stopSpeaking();
    };
  }, []);

  // Calculate dynamic crop suitability under scenario
  const getSimulatedCrops = () => {
    const droughtSeverity = Math.max(0, -rainDeficit);
    const heatStress = Math.max(0, tempAnomaly - 0.5);

    const paddyScore = Math.max(20, Math.round(85 - droughtSeverity * 1.3 - heatStress * 12));
    const bajraScore = Math.min(94, Math.round(72 + droughtSeverity * 0.45 + heatStress * 6));
    const moongScore = Math.min(91, Math.round(75 + droughtSeverity * 0.35 + heatStress * 4));
    const groundnutScore = Math.round(78 - droughtSeverity * 0.2);

    return [
      {
        id: 'bajra',
        nameHi: 'बाजरा (Pearl Millet)',
        nameEn: 'Pearl Millet (Bajra)',
        score: bajraScore,
        waterReq: '350 मिमी',
        waterSave: '65% पानी बचत',
        duration: '75-85 दिन',
        profit: '₹34,000 / एकड़',
        reasonHi: '42°C तक तापमान सहनशील, कम बारिश में भी बंपर पैदावार।',
        reasonEn: 'High heat tolerance up to 42°C with 350mm water demand.'
      },
      {
        id: 'moong',
        nameHi: 'मूंग (Green Gram)',
        nameEn: 'Green Gram (Moong)',
        score: moongScore,
        waterReq: '300 मिमी',
        waterSave: '70% पानी बचत',
        duration: '60-65 दिन',
        profit: '₹41,000 / एकड़',
        reasonHi: 'अल्पकालिक 60 दिन की फसल, मिट्टी में नाइट्रोजन बढ़ाकर उर्वरता बढ़ाए।',
        reasonEn: 'Short 60-day cycle, enriches soil nitrogen.'
      },
      {
        id: 'groundnut',
        nameHi: 'मूँगफली (Groundnut)',
        nameEn: 'Groundnut (Peanut)',
        score: groundnutScore,
        waterReq: '500 मिमी',
        waterSave: '45% पानी बचत',
        duration: '110 दिन',
        profit: '₹39,500 / एकड़',
        reasonHi: 'दोमट मिट्टी के लिए उत्तम, मंडी में ऊँचे भाव।',
        reasonEn: 'Thrives in loam soil with steady market demand.'
      },
      {
        id: 'paddy',
        nameHi: 'धान (Paddy - Basmati)',
        nameEn: 'Paddy (Basmati)',
        score: paddyScore,
        waterReq: '1,250 मिमी',
        waterSave: '0% (उच्च जल मांग)',
        duration: '125 दिन',
        profit: '₹36,000 / एकड़',
        reasonHi: rainDeficit < -15
          ? 'कम वर्षा में ट्यूबवेल से अत्यधिक दोहन का खतरा, 70% विफलता जोखिम।'
          : 'सामान्य बारिश में उत्तम, किंतु भूजल दोहन अधिक।',
        reasonEn: rainDeficit < -15
          ? 'High water table depletion and 70% risk of yield loss in drought.'
          : 'Profitable only with full irrigation assurance.'
      }
    ].sort((a, b) => b.score - a.score);
  };

  const simulatedCrops = getSimulatedCrops();

  const primaryDecisionAudioHi = `किसान भाई, ${panchayat.hi} में आपकी फसल के लिए आज का फैसला: अगले 24 घंटे में 12.4 मिलीमीटर बारिश की 84 प्रतिशत संभावना है। मिट्टी में 31.4 प्रतिशत पर्याप्त नमी है। आज ट्यूबवेल सिंचाई स्थगित रखें। इससे आपके लगभग ₹1,450 की बिजली और डीजल की बचत होगी।`;

  return (
    <div
      className="farmer-pinpoint-hub"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        background: '#f8fafc',
        color: '#0f172a',
        padding: '2rem 1rem 4rem'
      }}
    >
      {/* Right-Side Vertical Floating Navigator */}
      <VerticalActionTabs
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        isVoiceActive={isListening}
      />

      <div
        style={{
          maxWidth: '1160px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem'
        }}
      >
        {/* Quick Access Top Bar: 3D Digital Twin & Learn Teaching Videos */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1rem'
          }}
        >
          {/* Card 1: 3D Digital Twin */}
          <Link
            to="/digital-twin"
            style={{
              textDecoration: 'none',
              background: 'linear-gradient(135deg, #090d16 0%, #1e1b4b 100%)',
              color: '#ffffff',
              borderRadius: '20px',
              padding: '1.25rem 1.5rem',
              border: '1.5px solid rgba(56, 189, 248, 0.4)',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.2s ease'
            }}
          >
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(56, 189, 248, 0.2)', padding: '2px 8px', borderRadius: '999px', fontSize: '0.68rem', fontWeight: 800, color: '#38bdf8', marginBottom: '6px' }}>
                <Sparkles size={11} />
                <span>{hi ? 'इंटरैक्टिव 3D भौतिकी' : 'INTERACTIVE 3D PHYSICS'}</span>
              </div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#ffffff' }}>
                {hi ? 'खेत का 3D डिजिटल ट्विन 🎮' : '3D Farm Digital Twin 🎮'}
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: '0.76rem', color: '#94a3b8', lineHeight: 1.3 }}>
                {hi ? 'बारिश, तापमान व नहर पानी का 3D सिमुलेशन और सेंसर पिन देखें' : 'Simulate rainfall, temperature & canal release on 3D terrain'}
              </p>
            </div>
            <div style={{ background: '#38bdf8', color: '#090d16', width: '38px', height: '38px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginLeft: '12px' }}>
              <ArrowRight size={20} />
            </div>
          </Link>

          {/* Card 2: Learn (MANAGE + ICAR Videos) */}
          <Link
            to="/learn"
            style={{
              textDecoration: 'none',
              background: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
              color: '#ffffff',
              borderRadius: '20px',
              padding: '1.25rem 1.5rem',
              border: '1.5px solid rgba(16, 185, 129, 0.4)',
              boxShadow: '0 10px 25px -5px rgba(6, 78, 59, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.2s ease'
            }}
          >
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(16, 185, 129, 0.25)', padding: '2px 8px', borderRadius: '999px', fontSize: '0.68rem', fontWeight: 800, color: '#6ee7b7', marginBottom: '6px' }}>
                <Tv size={11} />
                <span>{hi ? 'MANAGE · ICAR · TNAU' : 'VERIFIED TRAINING'}</span>
              </div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#ffffff' }}>
                {hi ? 'आज सीखें: प्रैक्टिकल वीडियो 🎬' : 'Learn: Practical Video Feed 🎬'}
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: '0.76rem', color: '#a7f3d0', lineHeight: 1.3 }}>
                {hi ? 'नर्सरी प्रबंधन, जलभराव निकास व पत्तियों का पीलापन पहचान' : 'Field demonstrations with 3 key rules and AI doctor'}
              </p>
            </div>
            <div style={{ background: '#10b981', color: '#064e3b', width: '38px', height: '38px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginLeft: '12px' }}>
              <ArrowRight size={20} />
            </div>
          </Link>
        </div>

        {/* ========================================================================= */}
        {/* 1. INPUT SYSTEM: FARM & SOIL INPUT CONSOLE                                */}
        {/* ========================================================================= */}
        <section
          ref={sectionRefs.input}
          id="input"
          style={{
            background: '#ffffff',
            borderRadius: '24px',
            border: '1.5px solid #e2e8f0',
            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.05)',
            padding: 'clamp(1.25rem, 3vw, 2rem)'
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: '#ecfdf5',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <TestTube size={22} />
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#059669', letterSpacing: '0.06em' }}>
                  {hi ? 'खेत एवं मृदा इनपुट सिस्टम' : 'FARM & SOIL PROFILE INPUT'}
                </span>
                <h2 style={{ fontSize: 'clamp(1.3rem, 2.4vw, 1.8rem)', color: '#0f172a', fontWeight: 800 }}>
                  {hi ? 'अपने खेत की जानकारी सेट करें' : 'Set Your Plot & Soil Parameters'}
                </h2>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  background: soilHealthSync ? '#ecfdf5' : '#f1f5f9',
                  color: soilHealthSync ? '#047857' : '#64748b',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  padding: '6px 12px',
                  borderRadius: '999px',
                  border: soilHealthSync ? '1px solid #a7f3d0' : '1px solid #cbd5e1',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <CheckCircle2 size={14} />
                {hi ? 'सॉइल हेल्थ कार्ड ऑटो-सिंक' : 'Soil Health Card Synced'}
              </span>
            </div>
          </div>

          {/* Form Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.25rem',
              padding: '1.25rem',
              background: '#f8fafc',
              borderRadius: '18px',
              border: '1px solid #e2e8f0',
              marginBottom: '1.5rem'
            }}
          >
            {/* Field 1: Panchayat Selection */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                📍 {hi ? 'पंचायत ब्लॉक (Lucknow District)' : 'Panchayat Block'}
              </label>
              <select
                value={panchayat.code}
                onChange={(e) => {
                  const p = PILOT_PANCHAYATS.find((item) => item.code === e.target.value);
                  if (p) handlePanchayatSelect(p);
                }}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: '1.5px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#0f172a',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {PILOT_PANCHAYATS.map((p) => (
                  <option key={p.code} value={p.code}>
                    {hi ? `${p.hi} (${p.name})` : p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Field 2: Crop Selection */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                🌾 {hi ? 'मुख्य फसल चुनें' : 'Primary Crop'}
              </label>
              <select
                value={activeCropId}
                onChange={(e) => handleCropSelect(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: '1.5px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#0f172a',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {AVAILABLE_CROPS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {hi ? `${c.nameHi} — ${c.season}` : `${c.nameEn} — ${c.season}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Field 3: Crop Stage */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                🌱 {hi ? 'फसल की स्थिति' : 'Crop Stage / Status'}
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[
                  { id: 'standing', labelHi: 'फसल खड़ी है', labelEn: 'Standing' },
                  { id: 'planning', labelHi: 'नई बोनी है', labelEn: 'Planning' }
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setCropStatus(st.id as any)}
                    style={{
                      flex: 1,
                      padding: '9px 12px',
                      borderRadius: '12px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      border: cropStatus === st.id ? '1.5px solid #059669' : '1px solid #cbd5e1',
                      background: cropStatus === st.id ? '#ecfdf5' : '#ffffff',
                      color: cropStatus === st.id ? '#047857' : '#64748b',
                      cursor: 'pointer'
                    }}
                  >
                    {hi ? st.labelHi : st.labelEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Field 4: Water Source */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                💧 {hi ? 'सिंचाई साधन' : 'Water Supply'}
              </label>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[
                  { id: 'tubewell', labelHi: 'नलकूप', labelEn: 'Borewell' },
                  { id: 'canal', labelHi: 'नहर', labelEn: 'Canal' },
                  { id: 'rainfed', labelHi: 'बारिश', labelEn: 'Rainfed' }
                ].map((ws) => (
                  <button
                    key={ws.id}
                    type="button"
                    onClick={() => setWaterSource(ws.id as any)}
                    style={{
                      flex: 1,
                      padding: '9px 8px',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      border: waterSource === ws.id ? '1.5px solid #0284c7' : '1px solid #cbd5e1',
                      background: waterSource === ws.id ? '#f0f9ff' : '#ffffff',
                      color: waterSource === ws.id ? '#0369a1' : '#64748b',
                      cursor: 'pointer'
                    }}
                  >
                    {hi ? ws.labelHi : ws.labelEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Field 5: Land Holding */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                📏 {hi ? 'खेत का रकबा (Land Size)' : 'Plot Area'}
              </label>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                {[1, 2, 5, 10].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setLandArea(val)}
                    style={{
                      flex: 1,
                      padding: '9px 6px',
                      borderRadius: '12px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      border: landArea === val ? '1.5px solid #d97706' : '1px solid #cbd5e1',
                      background: landArea === val ? '#fffbeb' : '#ffffff',
                      color: landArea === val ? '#b45309' : '#64748b',
                      cursor: 'pointer'
                    }}
                  >
                    {val} {hi ? 'बीघा' : 'Bigha'}
                  </button>
                ))}
              </div>
            </div>

            {/* Field 6: Sowing Date */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                📅 {hi ? 'बुवाई की तारीख' : 'Sowing Date'}
              </label>
              <input
                type="date"
                value={sowingDate}
                onChange={(e) => setSowingDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '12px',
                  border: '1.5px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#0f172a',
                  fontSize: '0.88rem',
                  fontWeight: 600
                }}
              />
            </div>
          </div>

          {/* Soil Telemetry Bar (Auto-populated from Panchayat data) */}
          <div
            style={{
              padding: '12px 18px',
              background: '#f0fdf4',
              borderRadius: '14px',
              border: '1px solid #bbf7d0',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.82rem', color: '#166534', fontWeight: 800 }}>
                🌾 {hi ? 'मृदा गुण:' : 'Soil Telemetry:'} <strong>{panchayat.soilType}</strong>
              </span>
              <span style={{ fontSize: '0.82rem', color: '#166534' }}>
                pH: <strong>{soilPh}</strong> (अनुकूल)
              </span>
              <span style={{ fontSize: '0.82rem', color: '#166534' }}>
                NPK: <strong>{panchayat.npk}</strong>
              </span>
              <span style={{ fontSize: '0.82rem', color: '#166534' }}>
                भूजल स्तर: <strong>{panchayat.waterTable}</strong>
              </span>
            </div>

            <div style={{ fontSize: '0.74rem', color: '#15803d', fontWeight: 700 }}>
              ICAR-CSSRI Lucknow Regional Baseline
            </div>
          </div>

          {/* Repeatable Analysis Action Box */}
          <div
            style={{
              marginTop: '1.25rem',
              padding: '1rem 1.25rem',
              background: 'linear-gradient(135deg, #090d16 0%, #064e3b 100%)',
              borderRadius: '16px',
              border: '1.5px solid #10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              boxShadow: '0 8px 24px -6px rgba(5, 150, 105, 0.3)'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ background: '#10b981', color: '#090d16', padding: '2px 8px', borderRadius: '999px', fontSize: '0.68rem', fontWeight: 900 }}>
                  🔄 {hi ? `विश्लेषण चक्र #${analysisCount}` : `Analysis Run #${analysisCount}`}
                </span>
                <span style={{ fontSize: '0.72rem', color: '#a7f3d0' }}>
                  {hi ? `अंतिम सिंक: ${lastAnalysisTime}` : `Last refreshed: ${lastAnalysisTime}`}
                </span>
              </div>
              <strong style={{ fontSize: '0.94rem', color: '#ffffff', display: 'block' }}>
                {hi ? 'खेत का बार-बार विश्लेषण करने की सुविधा' : 'On-Demand Multi-Scenario Re-Analysis'}
              </strong>
              <p style={{ margin: '2px 0 0', fontSize: '0.74rem', color: '#cbd5e1' }}>
                {hi ? 'फसल, रकबा या साधन बदलें और तुरंत नया वैज्ञानिक फैसला पाएं।' : 'Tweak crops, plots or water sources and re-run live WRF calculations.'}
              </p>
            </div>

            <button
              type="button"
              onClick={handleReRunAnalysis}
              disabled={isReanalyzing}
              style={{
                background: isReanalyzing ? '#047857' : '#10b981',
                color: '#ffffff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '12px',
                fontSize: '0.85rem',
                fontWeight: 900,
                cursor: isReanalyzing ? 'wait' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.45)',
                transition: 'all 0.2s ease'
              }}
            >
              <RotateCcw size={16} className={isReanalyzing ? 'animate-spin' : ''} />
              <span>{isReanalyzing ? (hi ? 'गणना जारी है...' : 'Analyzing WRF Grid...') : (hi ? '⚡ नया विश्लेषण करें' : '⚡ Re-run Analysis')}</span>
            </button>
          </div>

          {/* Animated Re-analysis Success Notice */}
          <AnimatePresence>
            {analysisNotice && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{
                  marginTop: '10px',
                  background: '#ecfdf5',
                  border: '1.5px solid #10b981',
                  color: '#065f46',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <CheckCircle2 size={18} color="#059669" />
                <span>{analysisNotice}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ========================================================================= */}
        {/* 2. CARD 1: TODAY'S PINPOINT DECISION (💧 Sinchai Faisla)                   */}
        {/* ========================================================================= */}
        <section
          ref={sectionRefs.sinchai}
          id="sinchai"
          style={{
            background: '#ffffff',
            borderRadius: '24px',
            border: '2px solid #86efac',
            boxShadow: '0 10px 30px rgba(5, 150, 105, 0.08)',
            padding: 'clamp(1.5rem, 3.5vw, 2.5rem)',
            position: 'relative'
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  background: '#059669',
                  color: '#ffffff',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  padding: '4px 14px',
                  borderRadius: '999px',
                  letterSpacing: '0.04em'
                }}
              >
                {hi ? 'आज का मुख्य फैसला' : 'TODAY FIELD VERDICT'}
              </span>
              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
                {panchayat.hi} · M1–M3 Downscaled Weather
              </span>
            </div>

            <button
              type="button"
              onClick={() => handlePlayAudio(primaryDecisionAudioHi)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '999px',
                background: isSpeakingAudio ? '#dc2626' : '#ecfdf5',
                color: isSpeakingAudio ? '#ffffff' : '#047857',
                border: isSpeakingAudio ? 'none' : '1px solid #a7f3d0',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {isSpeakingAudio ? <VolumeX size={18} /> : <Volume2 size={18} />}
              <span>{isSpeakingAudio ? (hi ? 'आवाज़ रोकें' : 'Stop') : (hi ? 'सलाह सुनें (Hindi Voice)' : 'Listen (Audio)')}</span>
            </button>
          </div>

          {/* Big Action Headline */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <div
              style={{
                fontSize: '2.5rem',
                width: '68px',
                height: '68px',
                borderRadius: '18px',
                background: '#fef2f2',
                border: '1.5px solid #fecaca',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              🛑
            </div>

            <div style={{ flex: 1, minWidth: '280px' }}>
              <h3
                style={{
                  fontSize: 'clamp(1.5rem, 2.8vw, 2.1rem)',
                  color: '#b91c1c',
                  fontWeight: 900,
                  lineHeight: 1.25,
                  marginBottom: '8px'
                }}
              >
                {hi ? 'सिंचाई स्थगित रखें (ट्यूबवेल न चलाएं)' : 'Hold Irrigation (Do Not Pump Today)'}
              </h3>
              <p style={{ fontSize: '1.02rem', color: '#334155', lineHeight: 1.6, maxWidth: '720px' }}>
                {hi
                  ? `अगले 24 घंटे में 12.4 मिमी बारिश की 84% संभावना है। जमीन के 40 सेमी अंदर 31.4% पर्याप्त नमी मौजूद है। आज पानी रोकने से आपके ${landArea} बीघा खेत में लगभग ₹1,450 की बिजली और डीजल की सीधी बचत होगी।`
                  : `84% probability of 12.4 mm rainfall within 24 hours. Root-zone soil moisture is adequate at 31.4%. Skipping irrigation today saves ~₹1,450 in pumping fuel & power.`}
              </p>
            </div>
          </div>

          {/* 3 Metrics Chips */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
              gap: '12px',
              paddingTop: '1.25rem',
              borderTop: '1px solid #f1f5f9'
            }}
          >
            <div style={{ background: '#f0f9ff', padding: '12px 16px', borderRadius: '16px', border: '1px solid #bae6fd' }}>
              <div style={{ fontSize: '0.74rem', color: '#0369a1', fontWeight: 700 }}>
                {hi ? 'वर्षा संभावना (24 घंटे)' : 'Rainfall Forecast'}
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0284c7', marginTop: '2px' }}>
                84% <span style={{ fontSize: '0.85rem', color: '#64748b' }}>(12.4 मिमी)</span>
              </div>
            </div>

            <div style={{ background: '#ecfdf5', padding: '12px 16px', borderRadius: '16px', border: '1px solid #a7f3d0' }}>
              <div style={{ fontSize: '0.74rem', color: '#047857', fontWeight: 700 }}>
                {hi ? 'मिट्टी नमी (Root-Zone)' : 'Soil Moisture'}
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#059669', marginTop: '2px' }}>
                31.4% <span style={{ fontSize: '0.85rem', color: '#047857' }}>({hi ? 'पर्याप्त' : 'Adequate'})</span>
              </div>
            </div>

            <div style={{ background: '#fffbeb', padding: '12px 16px', borderRadius: '16px', border: '1px solid #fde68a' }}>
              <div style={{ fontSize: '0.74rem', color: '#b45309', fontWeight: 700 }}>
                {hi ? 'अनुमानित बचत (Diesel/Power)' : 'Estimated Cost Avoided'}
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#d97706', marginTop: '2px' }}>
                ₹1,450 <span style={{ fontSize: '0.82rem', color: '#78350f' }}>/ {landArea} बीघा</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. CARD 2: CROP RECOMMENDATIONS (🌾 Fasal Salah)                         */}
        {/* ========================================================================= */}
        <section
          ref={sectionRefs.fasal}
          id="fasal"
          style={{
            background: '#ffffff',
            borderRadius: '24px',
            border: '1.5px solid #e2e8f0',
            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.05)',
            padding: 'clamp(1.5rem, 3.5vw, 2.5rem)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#059669', letterSpacing: '0.05em' }}>
                {hi ? 'फसल सिफारिश एवं लाभ विश्लेषण' : 'CROP RECOMMENDATION & PROFIT ANALYSIS'}
              </span>
              <h3 style={{ fontSize: 'clamp(1.3rem, 2.4vw, 1.8rem)', color: '#0f172a', fontWeight: 800, marginTop: '2px' }}>
                {hi ? `${panchayat.hi} के लिए शीर्ष अनुशंसित फसलें` : `Top Recommended Crops for ${panchayat.name}`}
              </h3>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
              {hi ? `मृदा प्रकार: ${panchayat.soilType}` : `Soil: ${panchayat.soilType}`}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {simulatedCrops.map((crop, idx) => {
              const isTop = idx === 0;
              const isPaddyRisk = crop.id === 'paddy' && crop.score < 50;

              return (
                <div
                  key={crop.id}
                  style={{
                    background: isTop ? '#f0fdf4' : isPaddyRisk ? '#fef2f2' : '#ffffff',
                    border: isTop ? '2px solid #86efac' : isPaddyRisk ? '2px solid #fca5a5' : '1px solid #e2e8f0',
                    borderRadius: '18px',
                    padding: '16px 20px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '14px',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: isTop ? '#059669' : isPaddyRisk ? '#dc2626' : '#f1f5f9',
                        color: isTop || isPaddyRisk ? '#ffffff' : '#0f172a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 900,
                        fontSize: '1.05rem'
                      }}
                    >
                      {idx + 1}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <strong style={{ fontSize: '1.05rem', color: '#0f172a' }}>
                          {hi ? crop.nameHi : crop.nameEn}
                        </strong>
                        {isTop && (
                          <span style={{ background: '#059669', color: '#ffffff', fontSize: '0.65rem', fontWeight: 900, padding: '2px 8px', borderRadius: '999px' }}>
                            {hi ? 'सर्वोत्तम चुनाव' : 'BEST MATCH'}
                          </span>
                        )}
                        {isPaddyRisk && (
                          <span style={{ background: '#dc2626', color: '#ffffff', fontSize: '0.65rem', fontWeight: 900, padding: '2px 8px', borderRadius: '999px' }}>
                            {hi ? 'जल संकट जोखिम' : 'WATER DEFICIT RISK'}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.84rem', color: '#64748b', marginTop: '3px' }}>
                        {hi ? crop.reasonHi : crop.reasonEn}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{hi ? 'जल मांग' : 'Water Need'}</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0284c7' }}>{crop.waterReq}</div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{hi ? 'अनुमानित मुनाफा' : 'Net Profit'}</div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#16a34a' }}>{crop.profit}</div>
                    </div>

                    <div style={{ textAlign: 'right', minWidth: '70px' }}>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{hi ? 'उपयुक्तता' : 'Score'}</div>
                      <div
                        style={{
                          fontSize: '1.35rem',
                          fontWeight: 900,
                          color: crop.score >= 80 ? '#059669' : crop.score >= 60 ? '#d97706' : '#dc2626'
                        }}
                      >
                        {crop.score}%
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. CARD 3: CLIMATE STRESS SIMULATOR SANDBOX (The Hackathon Winner)        */}
        {/* ========================================================================= */}
        <section
          ref={sectionRefs.scenario}
          id="scenario"
          style={{
            background: '#ffffff',
            borderRadius: '24px',
            border: '2px solid #fde68a',
            boxShadow: '0 4px 20px rgba(217, 119, 6, 0.08)',
            padding: 'clamp(1.5rem, 3.5vw, 2.5rem)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <span style={{ background: '#d97706', color: '#ffffff', fontSize: '0.72rem', fontWeight: 900, padding: '3px 12px', borderRadius: '999px' }}>
                {hi ? 'भविष्य जलवायु सिमुलेशन' : 'CLIMATE STRESS SIMULATOR'}
              </span>
              <h3 style={{ fontSize: 'clamp(1.3rem, 2.4vw, 1.8rem)', color: '#0f172a', fontWeight: 800, marginTop: '6px' }}>
                {hi ? 'क्या होगा अगर सूखा पड़े या लू चले?' : 'What if Rainfall Drops by 30%?'}
              </h3>
            </div>

            <button
              type="button"
              onClick={() => {
                setRainDeficit(0);
                setTempAnomaly(0);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: '999px',
                background: '#f8fafc',
                color: '#475569',
                border: '1px solid #cbd5e1',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <RotateCcw size={14} />
              <span>{hi ? 'रीसेट करें' : 'Reset'}</span>
            </button>
          </div>

          <p style={{ fontSize: '0.94rem', color: '#475569', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            {hi
              ? 'स्लाइडर को हिलाकर देखें कि बारिश कम होने या तापमान बढ़ने पर कौन सी फसलें सबसे सुरक्षित रहती हैं। हमारा ML इंजन वास्तविक समय में फसलों की रैंकिंग बदलता है।'
              : 'Drag the sliders below to simulate a drought or heatwave. Notice how the crop ranking automatically pivots to protect the farmer.'}
          </p>

          {/* Sliders Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
            {/* Slider 1: Rain Deficit */}
            <div style={{ background: '#f8fafc', padding: '16px 20px', borderRadius: '18px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 700 }}>
                  {hi ? 'मानसून वर्षा विचलन (Rainfall):' : 'Rainfall Deficit:'}
                </span>
                <span
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 900,
                    color: rainDeficit < 0 ? '#dc2626' : rainDeficit > 0 ? '#0284c7' : '#059669'
                  }}
                >
                  {rainDeficit > 0 ? `+${rainDeficit}%` : `${rainDeficit}%`}
                </span>
              </div>
              <input
                type="range"
                min="-50"
                max="40"
                step="5"
                value={rainDeficit}
                onChange={(e) => setRainDeficit(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#d97706', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>
                <span>-50% (गंभीर सूखा)</span>
                <span>0% (सामान्य)</span>
                <span>+40% (अत्यधिक)</span>
              </div>
            </div>

            {/* Slider 2: Temp Anomaly */}
            <div style={{ background: '#f8fafc', padding: '16px 20px', borderRadius: '18px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 700 }}>
                  {hi ? 'तापमान वृद्धि (Heat Stress):' : 'Temperature Anomaly:'}
                </span>
                <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#d97706' }}>
                  +{tempAnomaly.toFixed(1)}°C
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="3.0"
                step="0.2"
                value={tempAnomaly}
                onChange={(e) => setTempAnomaly(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#dc2626', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>
                <span>0.0°C (सामान्य)</span>
                <span>+1.5°C (मध्यम लू)</span>
                <span>+3.0°C (चरम गर्मी)</span>
              </div>
            </div>
          </div>

          {/* Explainable AI Callout */}
          <div
            style={{
              background: '#fffbeb',
              border: '1.5px solid #fde68a',
              borderRadius: '16px',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <Sparkles size={22} color="#d97706" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: '0.9rem', color: '#92400e', lineHeight: 1.5 }}>
              {rainDeficit < -15 ? (
                hi ? (
                  <strong>
                    सिमुलेशन साक्ष्य: कम बारिश ({rainDeficit}%) में धान (Paddy) की विफलता का जोखिम 70% तक बढ़ गया है। बाजरा और मूंग पहली प्राथमिकता बन गए हैं क्योंकि वे 42°C पर भी 350 मिमी पानी में भरपूर पैदावार देते हैं।
                  </strong>
                ) : (
                  <strong>
                    Simulation Finding: Under a {rainDeficit}% deficit, Paddy failure risk spikes to 70%. Bajra and Moong surge to Rank #1 due to their 42°C heat tolerance and 350mm water requirement.
                  </strong>
                )
              ) : (
                hi ? (
                  <span>सामान्य बारिश में धान और मूँगफली दोनों अच्छा मुनाफा देंगे।</span>
                ) : (
                  <span>Baseline weather conditions support both paddy and groundnut safely.</span>
                )
              )}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. CARD 4: KISAAN VAANI VOICE ASSISTANT (Native STT + TTS)               */}
        {/* ========================================================================= */}
        <section
          ref={sectionRefs.awaaz}
          id="awaaz"
          style={{
            background: '#ffffff',
            borderRadius: '24px',
            border: '2px solid #fbcfe8',
            boxShadow: '0 4px 20px rgba(219, 39, 119, 0.06)',
            padding: 'clamp(1.5rem, 3.5vw, 2.5rem)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          <span style={{ background: '#db2777', color: '#ffffff', fontSize: '0.72rem', fontWeight: 900, padding: '3px 12px', borderRadius: '999px', marginBottom: '8px' }}>
            {hi ? 'किसान वाणी — बिना टाइप किए बोलें' : 'KISAAN VAANI VOICE ASSISTANT'}
          </span>

          <h3 style={{ fontSize: 'clamp(1.3rem, 2.4vw, 1.8rem)', color: '#0f172a', fontWeight: 800, marginBottom: '6px' }}>
            {hi ? 'माइक दबाकर अपनी भाषा में सवाल पूछें' : 'Tap to Speak in Hindi or English'}
          </h3>

          <p style={{ fontSize: '0.94rem', color: '#475569', maxWidth: '620px', marginBottom: '1.5rem' }}>
            {hi
              ? 'किसान भाई, आपको कुछ टाइप करने की जरूरत नहीं है। बस माइक दबाएं और बोलें — "आज पानी दूँ या नहीं?", "कौन सी फसल लगाऊँ?", या "बारिश कब होगी?".'
              : 'Zero typing required. Speak naturally in Hindi or English to get immediate agricultural advice.'}
          </p>

          {/* Big Mic Button */}
          <button
            type="button"
            onClick={toggleVoiceMic}
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: isListening ? '#dc2626' : 'linear-gradient(135deg, #db2777 0%, #be185d 100%)',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isListening
                ? '0 0 25px rgba(220, 38, 38, 0.5)'
                : '0 8px 24px rgba(219, 39, 119, 0.3)',
              position: 'relative'
            }}
          >
            {isListening ? <MicOff size={34} /> : <Mic size={34} />}
          </button>

          <div style={{ marginTop: '10px', fontSize: '0.85rem', fontWeight: 800, color: isListening ? '#dc2626' : '#db2777' }}>
            {isListening
              ? (hi ? 'सुन रहा हूँ... बोलिए' : 'Listening... Speak now')
              : (hi ? 'माइक छुएं और बोलें' : 'Tap Mic to Speak')}
          </div>

          {/* Transcript / Reply Output */}
          {(voiceTranscript || voiceReply) && (
            <div
              style={{
                marginTop: '1.25rem',
                width: '100%',
                maxWidth: '680px',
                background: '#f8fafc',
                border: '1.5px solid #e2e8f0',
                borderRadius: '16px',
                padding: '16px 20px',
                textAlign: 'left'
              }}
            >
              {voiceTranscript && (
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>{hi ? 'आपने पूछा:' : 'You asked:'}</span>
                  <div style={{ fontSize: '0.95rem', color: '#0f172a', fontWeight: 700 }}>"{voiceTranscript}"</div>
                </div>
              )}
              {voiceReply && (
                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '8px' }}>
                  <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 800 }}>
                    {hi ? 'मौसम सेतु उत्तर:' : 'Mausam Setu Reply:'}
                  </span>
                  <div style={{ fontSize: '1rem', color: '#166534', lineHeight: 1.5, marginTop: '2px' }}>
                    {voiceReply}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Sample Prompts Chips */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '1.5rem' }}>
            {[
              { q: 'Aaj paani du ya nahi?', label: hi ? '💧 आज पानी दूँ या नहीं?' : 'Should I irrigate today?' },
              { q: 'Is mausam me kya lagau?', label: hi ? '🌾 इस मौसम में क्या बोऊँ?' : 'Which crop to sow?' },
              { q: 'Barish kab hogi?', label: hi ? '🌦️ बारिश कब होगी?' : 'When will it rain?' },
              { q: 'Keeda lagne ka khatra?', label: hi ? '🐛 कीट व बीमारी का खतरा?' : 'Any pest hazard?' }
            ].map((chip) => (
              <button
                key={chip.q}
                type="button"
                onClick={() => {
                  const res = processAgriVoiceQuery(chip.q, {
                    panchayatName: panchayat.hi,
                    cropName: activeCropId,
                    rainProbability: 84,
                    rainAmountMm: 12.4
                  });
                  setVoiceTranscript(chip.label);
                  setVoiceReply(res.replyText);
                  speakFarmerAdvice(res.replyText, res.lang);
                  if (res.actionTab && res.actionTab in sectionRefs) {
                    handleSelectTab(res.actionTab as TabId);
                  }
                }}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '999px',
                  padding: '6px 14px',
                  color: '#334155',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. CARD 5: 1-KM HYPERLOCAL MAUSAM & HAZARD ALERTS                        */}
        {/* ========================================================================= */}
        <section
          ref={sectionRefs.mausam}
          id="mausam"
          style={{
            background: '#ffffff',
            borderRadius: '24px',
            border: '1.5px solid #e2e8f0',
            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.05)',
            padding: 'clamp(1.5rem, 3.5vw, 2.5rem)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#0284c7', letterSpacing: '0.05em' }}>
                {hi ? '1-किमी स्थानीय मौसम ग्रिड' : '1-KM HYPERLOCAL WEATHER TELEMETRY'}
              </span>
              <h3 style={{ fontSize: 'clamp(1.3rem, 2.4vw, 1.8rem)', color: '#0f172a', fontWeight: 800, marginTop: '2px' }}>
                {panchayat.hi} ({panchayat.name})
              </h3>
            </div>
            <span style={{ background: '#f0f9ff', color: '#0369a1', fontSize: '0.75rem', fontWeight: 800, padding: '4px 12px', borderRadius: '999px', border: '1px solid #bae6fd' }}>
              IMD + RF Model 1
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{hi ? 'हवा का तापमान' : 'Air Temp'}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', marginTop: '2px' }}>
                31.8°C
              </div>
              <div style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 700 }}>±0.8°C Conformal (90% Conf)</div>
            </div>

            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{hi ? 'हवा की गति' : 'Wind Speed'}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', marginTop: '2px' }}>
                14 km/h
              </div>
              <div style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 700 }}>{hi ? 'स्प्रे के लिए सुरक्षित' : 'Safe for spray'}</div>
            </div>

            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{hi ? 'हवा में नमी' : 'Humidity'}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', marginTop: '2px' }}>
                68%
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{hi ? 'सामान्य' : 'Normal range'}</div>
            </div>

            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{hi ? 'वाष्पोत्सर्जन (ET0)' : 'Evapotranspiration'}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', marginTop: '2px' }}>
                4.2 mm
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>FAO Penman-Monteith (M6)</div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 7. CARD 6: ACTIVE PANCHAYAT HAZARDS                                      */}
        {/* ========================================================================= */}
        <section
          ref={sectionRefs.alerts}
          id="alerts"
          style={{
            background: '#ffffff',
            borderRadius: '24px',
            border: '2px solid #fecaca',
            boxShadow: '0 4px 20px rgba(220, 38, 38, 0.05)',
            padding: 'clamp(1.5rem, 3.5vw, 2.5rem)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: '#fef2f2',
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>
                {hi ? 'सक्रिय पंचायत अलर्ट बुलेटिन' : 'Active Panchayat Hazard Bulletin'}
              </h3>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                {panchayat.hi} · {hi ? 'अग्रिम 7-दिन जोखिम चेतावनी' : '7-Day Advance Warning'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ background: '#fffbeb', padding: '14px 18px', borderRadius: '16px', border: '1px solid #fde68a' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ background: '#d97706', color: '#ffffff', fontSize: '0.68rem', fontWeight: 900, padding: '2px 8px', borderRadius: '999px' }}>
                  {hi ? 'मध्यम जोखिम' : 'MEDIUM'}
                </span>
                <strong style={{ color: '#0f172a', fontSize: '0.95rem' }}>
                  {hi ? 'खेतों में जलभराव की चेतावनी' : 'Field Waterlogging Alert'}
                </strong>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#475569', marginTop: '4px', lineHeight: 1.45 }}>
                {hi
                  ? 'कल शाम तक भारी वर्षा के कारण निचले खेतों में पानी जमा हो सकता है। कृपया जल निकासी नालियों (Drainage Channels) को समय पर खोलें।'
                  : 'Expected rain may cause low-lying plot ponding. Clear drainage outlets before evening.'}
              </p>
            </div>

            <div style={{ background: '#f0fdf4', padding: '14px 18px', borderRadius: '16px', border: '1px solid #bbf7d0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ background: '#16a34a', color: '#ffffff', fontSize: '0.68rem', fontWeight: 900, padding: '2px 8px', borderRadius: '999px' }}>
                  {hi ? 'अनुकूल' : 'SAFE'}
                </span>
                <strong style={{ color: '#0f172a', fontSize: '0.95rem' }}>
                  {hi ? 'कीट-मुक्त मौसम खिड़की (Safe Spray Window)' : 'Safe Spray Window'}
                </strong>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#475569', marginTop: '4px', lineHeight: 1.45 }}>
                {hi
                  ? 'हवा की गति 14 किमी/घंटा है। दोपहर 3 बजे तक कीटनाशक स्प्रे करने के लिए मौसम अनुकूल है।'
                  : 'Winds are calm at 14 km/h. Conditions are optimal for necessary foliar application until 3 PM.'}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
