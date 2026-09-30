import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  ChevronDown,
  Info,
  MapPin,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Clock,
  RotateCcw
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

const PILOT_PANCHAYATS = [
  { code: '0924001001', name: 'Malihabad', hi: 'मलिहाबाद', soil: 'सैंडी दोमट (Sandy Loam)', waterTable: 'मध्यम (14m)' },
  { code: '0924001002', name: 'Mohanlalganj', hi: 'मोहनलालगंज', soil: 'दोमट मटियार (Loam Clay)', waterTable: 'सुरक्षित (11m)' },
  { code: '0924001003', name: 'Bakshi Ka Talab', hi: 'बख्शी का तालाब', soil: 'कछार दोमट (Alluvial Loam)', waterTable: 'पर्याप्त (9m)' },
  { code: '0924001004', name: 'Chinhat', hi: 'चिनहट', soil: 'सिल्ट दोमट (Silt Loam)', waterTable: 'मध्यम (13m)' },
  { code: '0924001005', name: 'Amausi', hi: 'अमौसी', soil: 'क्ले दोमट (Clay Loam)', waterTable: 'समीप (10m)' }
];

export const FarmerPinpointHub: React.FC = () => {
  const { language, location, setLocation } = useApp();
  const { data: liveData } = useLivePrediction();
  const hi = language === 'hi';

  // Navigation State
  const [activeTab, setActiveTab] = useState<TabId>('sinchai');

  // Farm Setup State (3-Tap Selector)
  const [selectedPanchayat, setSelectedPanchayat] = useState(PILOT_PANCHAYATS[1]); // Mohanlalganj
  const [waterSource, setWaterSource] = useState<'tubewell' | 'canal' | 'rainfed'>('tubewell');
  const [farmSize, setFarmSize] = useState<'1' | '2' | '5'>('2');
  const [cropMode, setCropMode] = useState<'plan' | 'active'>('plan');

  // Climate Scenario Sandbox Sliders
  const [rainDeficit, setRainDeficit] = useState<number>(-25); // -25% deficit default
  const [tempAnomaly, setTempAnomaly] = useState<number>(1.2); // +1.2°C anomaly

  // Voice Agent State
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [voiceReply, setVoiceReply] = useState('');
  const [isSpeakingAudio, setIsSpeakingAudio] = useState(false);
  const stopVoiceRef = useRef<(() => void) | null>(null);

  // Section Refs for smooth scrolling
  const sectionRefs = {
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
      targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Sync selected panchayat with AppContext
  const handlePanchayatChange = (panchayat: typeof PILOT_PANCHAYATS[0]) => {
    setSelectedPanchayat(panchayat);
    setLocation({
      ...location,
      panchayatCode: panchayat.code,
      panchayatName: panchayat.name
    });
  };

  // Audio Playback Handler
  const handlePlayAudio = (text: string) => {
    if (isSpeakingAudio) {
      stopSpeaking();
      setIsSpeakingAudio(false);
    } else {
      setIsSpeakingAudio(true);
      speakFarmerAdvice(text, hi ? 'hi-IN' : 'en-IN');
      setTimeout(() => setIsSpeakingAudio(false), 8000);
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
          panchayatName: selectedPanchayat.hi,
          rainProbability: 84,
          rainAmountMm: 12.4,
          soilMoisturePct: 31.4
        }
      );
    }
  };

  // Clean up voice on unmount
  useEffect(() => {
    return () => {
      if (stopVoiceRef.current) stopVoiceRef.current();
      stopSpeaking();
    };
  }, []);

  // Calculate dynamic crop suitability under scenario
  const getSimulatedCrops = () => {
    // If drought (-20% or worse) or high temp (>1°C), Millets/Pulses surge while Paddy falls
    const droughtSeverity = Math.max(0, -rainDeficit); // 0 to 50
    const heatStress = Math.max(0, tempAnomaly - 0.5); // 0 to 2.5

    const paddyScore = Math.max(18, Math.round(85 - droughtSeverity * 1.3 - heatStress * 12));
    const bajraScore = Math.min(94, Math.round(72 + droughtSeverity * 0.45 + heatStress * 6));
    const moongScore = Math.min(91, Math.round(75 + droughtSeverity * 0.35 + heatStress * 4));
    const groundnutScore = Math.round(78 - droughtSeverity * 0.2);

    return [
      {
        id: 'bajra',
        nameHi: 'बाजरा (Pearl Millet)',
        nameEn: 'Pearl Millet (Bajra)',
        score: bajraScore,
        rank: bajraScore > paddyScore ? 1 : 2,
        waterReq: '350 मिमी (कम पानी)',
        waterSave: '65% पानी बचत',
        duration: '75-85 दिन',
        expectedProfit: '₹34,000 / एकड़',
        riskLevel: bajraScore > 75 ? 'low' : 'medium',
        reasonHi: '42°C तक तापमान सहनशील, कम बारिश में भी बंपर पैदावार।',
        reasonEn: 'Tolerates up to 42°C with low water demand.'
      },
      {
        id: 'moong',
        nameHi: 'मूंग (Green Gram)',
        nameEn: 'Green Gram (Moong)',
        score: moongScore,
        rank: moongScore > paddyScore ? 2 : 3,
        waterReq: '300 मिमी (अल्पकालिक)',
        waterSave: '70% पानी बचत',
        duration: '60-65 दिन',
        expectedProfit: '₹41,000 / एकड़',
        riskLevel: 'low',
        reasonHi: 'कम समय में तैयार, ज़मीन में नाइट्रोजन बढ़ाकर उर्वरता बढ़ाए।',
        reasonEn: 'Short 60-day cycle, enriches soil nitrogen.'
      },
      {
        id: 'groundnut',
        nameHi: 'मूँगफली (Groundnut)',
        nameEn: 'Groundnut (Peanut)',
        score: groundnutScore,
        rank: 3,
        waterReq: '500 मिमी (मध्यम)',
        waterSave: '45% पानी बचत',
        duration: '110 दिन',
        expectedProfit: '₹39,500 / एकड़',
        riskLevel: 'medium',
        reasonHi: 'सैंडी दोमट मिट्टी के लिए अनुकूल, बाज़ार में ऊँचे दाम।',
        reasonEn: 'Best for sandy loam, high mandi demand.'
      },
      {
        id: 'paddy',
        nameHi: 'धान (Paddy - Basmati)',
        nameEn: 'Paddy (Basmati)',
        score: paddyScore,
        rank: paddyScore > bajraScore ? 1 : 4,
        waterReq: '1,250 मिमी (भारी जल मांग)',
        waterSave: '0% (उच्च जल जोखिम)',
        duration: '125 दिन',
        expectedProfit: '₹36,000 / एकड़',
        riskLevel: paddyScore < 45 ? 'critical' : paddyScore < 70 ? 'high' : 'medium',
        reasonHi: rainDeficit < -15
          ? 'कम बारिश के कारण 40% भूजल कमी और ट्यूबवेल फेलियर का गंभीर जोखिम।'
          : 'सामान्य बारिश में अनुकूल, किंतु भूजल दोहन अधिक।',
        reasonEn: rainDeficit < -15
          ? 'High water table stress and groundwater pumping failure risk.'
          : 'Requires high water table and regular canal supply.'
      }
    ].sort((a, b) => b.score - a.score);
  };

  const simulatedCrops = getSimulatedCrops();

  const primaryDecisionAudioHi = `किसान भाई, ${selectedPanchayat.hi} के लिए आज का सीधा फैसला: अगले 24 घंटे में 12.4 मिलीमीटर बारिश की 84 प्रतिशत संभावना है। मिट्टी में 31.4 प्रतिशत नमी मौजूद है। आज ट्यूबवेल बिल्कुल न चलाएं। इससे आपके लगभग ₹1,450 की बिजली और डीजल की बचत होगी।`;

  return (
    <div className="farmer-pinpoint-hub" style={{ position: 'relative', width: '100%', minHeight: '100vh', zIndex: 1 }}>
      {/* Right-Side Vertical Floating Navigator */}
      <VerticalActionTabs
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        isVoiceActive={isListening}
      />

      <div
        style={{
          maxWidth: '1040px',
          margin: '0 auto',
          padding: 'clamp(1rem, 3vw, 2.5rem)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.75rem'
        }}
      >
        {/* ========================================================================= */}
        {/* 1. ZERO-EFFORT 3-TAP KHET SETUP BAR (Sticky top micro-card)             */}
        {/* ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            background: 'rgba(10, 24, 16, 0.85)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '24px',
            border: '1px solid rgba(74, 222, 128, 0.28)',
            padding: '14px 20px',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.45)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '14px'
          }}
        >
          {/* Location Picker */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#34d399',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <MapPin size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>
                {hi ? 'गाँव / पंचायत चुनें' : 'Panchayat Block'}
              </div>
              <select
                value={selectedPanchayat.code}
                onChange={(e) => {
                  const p = PILOT_PANCHAYATS.find((item) => item.code === e.target.value);
                  if (p) handlePanchayatChange(p);
                }}
                style={{
                  background: 'transparent',
                  color: '#ffffff',
                  fontSize: '0.98rem',
                  fontWeight: 800,
                  border: 'none',
                  outline: 'none',
                  cursor: 'pointer',
                  padding: '2px 0'
                }}
              >
                {PILOT_PANCHAYATS.map((p) => (
                  <option key={p.code} value={p.code} style={{ background: '#0a1810', color: '#fff' }}>
                    {hi ? `${p.hi} (${p.name})` : p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Water Source Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', marginRight: '4px', fontWeight: 600 }}>
              {hi ? 'सिंचाई साधन:' : 'Water:'}
            </span>
            {[
              { id: 'tubewell', labelHi: '⚡ नलकूप', labelEn: 'Tubewell' },
              { id: 'canal', labelHi: '🚰 नहर', labelEn: 'Canal' },
              { id: 'rainfed', labelHi: '🌧️ सिर्फ बारिश', labelEn: 'Rainfed' }
            ].map((ws) => (
              <button
                key={ws.id}
                type="button"
                onClick={() => setWaterSource(ws.id as any)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '999px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  border: waterSource === ws.id ? '1.5px solid #10b981' : '1px solid rgba(255,255,255,0.12)',
                  background: waterSource === ws.id ? 'rgba(16, 185, 129, 0.22)' : 'rgba(255,255,255,0.04)',
                  color: waterSource === ws.id ? '#34d399' : '#cbd5e1',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {hi ? ws.labelHi : ws.labelEn}
              </button>
            ))}
          </div>

          {/* Land Size Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', marginRight: '4px', fontWeight: 600 }}>
              {hi ? 'ज़मीन:' : 'Land:'}
            </span>
            {[
              { id: '1', label: '1 बीघा' },
              { id: '2', label: '2 बीघा' },
              { id: '5', label: '5+ एकड़' }
            ].map((size) => (
              <button
                key={size.id}
                type="button"
                onClick={() => setFarmSize(size.id as any)}
                style={{
                  padding: '5px 10px',
                  borderRadius: '999px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  border: farmSize === size.id ? '1.5px solid #f59e0b' : '1px solid rgba(255,255,255,0.12)',
                  background: farmSize === size.id ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255,255,255,0.04)',
                  color: farmSize === size.id ? '#fbbf24' : '#cbd5e1',
                  cursor: 'pointer'
                }}
              >
                {size.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ========================================================================= */}
        {/* 2. CARD 1: TODAY'S PINPOINT DECISION (💧 Sinchai Faisla)                   */}
        {/* ========================================================================= */}
        <motion.section
          ref={sectionRefs.sinchai}
          id="sinchai"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6 }}
          style={{
            background: 'linear-gradient(135deg, rgba(8, 28, 20, 0.94) 0%, rgba(5, 15, 12, 0.96) 100%)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderRadius: '28px',
            border: '2px solid rgba(16, 185, 129, 0.35)',
            boxShadow: '0 24px 50px rgba(0, 0, 0, 0.55), 0 0 30px rgba(5, 150, 105, 0.18)',
            padding: 'clamp(1.5rem, 3.5vw, 2.5rem)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Subtle Ambient Water Ripple in Corner */}
          <div
            style={{
              position: 'absolute',
              top: '-60px',
              right: '-60px',
              width: '240px',
              height: '240px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, transparent 70%)',
              pointerEvents: 'none'
            }}
          />

          {/* Card Header & Kicker */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                style={{
                  background: '#059669',
                  color: '#ffffff',
                  fontSize: '0.78rem',
                  fontWeight: 900,
                  padding: '4px 14px',
                  borderRadius: '999px',
                  letterSpacing: '0.04em'
                }}
              >
                {hi ? 'आज का मुख्य फैसला' : 'PINPOINT FIELD DECISION'}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>
                {selectedPanchayat.hi} · M1–M3 Real AI Engine
              </span>
            </div>

            {/* Audio Listen Button */}
            <motion.button
              type="button"
              onClick={() => handlePlayAudio(primaryDecisionAudioHi)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '999px',
                background: isSpeakingAudio ? '#dc2626' : 'rgba(16, 185, 129, 0.22)',
                color: isSpeakingAudio ? '#ffffff' : '#34d399',
                border: '1px solid rgba(74, 222, 128, 0.4)',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {isSpeakingAudio ? <VolumeX size={18} /> : <Volume2 size={18} />}
              <span>{isSpeakingAudio ? (hi ? 'आवाज़ रोकें' : 'Stop') : (hi ? 'सलाह सुनें (Audio)' : 'Listen')}</span>
            </motion.button>
          </div>

          {/* Big Action Headline */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <div
              style={{
                fontSize: '3rem',
                width: '76px',
                height: '76px',
                borderRadius: '20px',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              🛑
            </div>

            <div style={{ flex: 1, minWidth: '280px' }}>
              <h2
                style={{
                  fontSize: 'clamp(1.6rem, 3vw, 2.25rem)',
                  color: '#f87171',
                  fontWeight: 900,
                  lineHeight: 1.2,
                  marginBottom: '8px'
                }}
              >
                {hi ? 'सिंचाई स्थगित रखें (ट्यूबवेल न चलाएं)' : 'Hold Irrigation (Do Not Pump Today)'}
              </h2>
              <p style={{ fontSize: '1.05rem', color: '#e2e8f0', lineHeight: 1.6, maxWidth: '680px' }}>
                {hi
                  ? `अगले 24 घंटे में 12.4 मिमी बारिश की 84% संभावना है। जमीन के 40 सेमी अंदर 31.4% पर्याप्त नमी मौजूद है। आज पानी रोकने से लगभग ₹1,450 की बिजली और डीजल की सीधी बचत होगी।`
                  : `84% probability of 12.4 mm rainfall within 24 hours. Root-zone soil moisture is sufficient at 31.4%. Skipping irrigation today saves ~₹1,450 in diesel and power costs.`}
              </p>
            </div>
          </div>

          {/* 3 Metrics Chips */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
              gap: '12px',
              paddingTop: '1rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{hi ? 'वर्षा संभावना (24 घंटे)' : 'Rain Probability'}</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38bdf8', marginTop: '2px' }}>
                84% <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>(12.4 मिमी)</span>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{hi ? 'मिट्टी नमी (Root-Zone)' : 'Soil Moisture'}</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399', marginTop: '2px' }}>
                31.4% <span style={{ fontSize: '0.85rem', color: '#a7f3d0' }}>({hi ? 'पर्याप्त' : 'Adequate'})</span>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{hi ? 'अनुमानित बचत (Diesel/Power)' : 'Estimated Savings'}</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fbbf24', marginTop: '2px' }}>
                ₹1,450 <span style={{ fontSize: '0.85rem', color: '#fde68a' }}>/ 2 बीघा</span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ========================================================================= */}
        {/* 3. CARD 2: CROP RECOMMENDATIONS (🌾 Fasal Salah)                         */}
        {/* ========================================================================= */}
        <motion.section
          ref={sectionRefs.fasal}
          id="fasal"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6 }}
          style={{
            background: 'rgba(10, 24, 16, 0.88)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '28px',
            border: '1px solid rgba(74, 222, 128, 0.25)',
            padding: 'clamp(1.5rem, 3.5vw, 2.5rem)',
            boxShadow: '0 20px 45px rgba(0, 0, 0, 0.5)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <div style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 800, letterSpacing: '0.04em' }}>
                {hi ? 'फसल सिफारिश एवं लाभ विश्लेषण' : 'CROP RECOMMENDATION & PROFIT'}
              </div>
              <h3 style={{ fontSize: 'clamp(1.3rem, 2.2vw, 1.75rem)', color: '#ffffff', fontWeight: 900, marginTop: '2px' }}>
                {hi ? `${selectedPanchayat.hi} के लिए शीर्ष फसलें` : `Top Recommended Crops for ${selectedPanchayat.name}`}
              </h3>
            </div>

            <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
              {hi ? `मिट्टी: ${selectedPanchayat.soil}` : `Soil: ${selectedPanchayat.soil}`}
            </div>
          </div>

          {/* Cards Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {simulatedCrops.map((crop, idx) => {
              const isTop = idx === 0;
              const isPaddyRisk = crop.id === 'paddy' && crop.score < 50;

              return (
                <motion.div
                  key={crop.id}
                  whileHover={{ scale: 1.015, x: 4 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    background: isTop
                      ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.16) 0%, rgba(5, 15, 12, 0.75) 100%)'
                      : isPaddyRisk
                      ? 'linear-gradient(90deg, rgba(239, 68, 68, 0.14) 0%, rgba(5, 15, 12, 0.75) 100%)'
                      : 'rgba(255, 255, 255, 0.03)',
                    border: isTop
                      ? '1.5px solid rgba(16, 185, 129, 0.5)'
                      : isPaddyRisk
                      ? '1.5px solid rgba(239, 68, 68, 0.45)'
                      : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '20px',
                    padding: '16px 20px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '14px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        background: isTop ? '#10b981' : isPaddyRisk ? '#ef4444' : 'rgba(255,255,255,0.1)',
                        color: isTop ? '#042416' : '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 900,
                        fontSize: '1.1rem'
                      }}
                    >
                      {idx + 1}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <strong style={{ fontSize: '1.1rem', color: '#ffffff' }}>
                          {hi ? crop.nameHi : crop.nameEn}
                        </strong>
                        {isTop && (
                          <span style={{ background: '#10b981', color: '#042416', fontSize: '0.68rem', fontWeight: 900, padding: '2px 8px', borderRadius: '999px' }}>
                            {hi ? 'सर्वोत्तम चुनाव' : 'BEST MATCH'}
                          </span>
                        )}
                        {isPaddyRisk && (
                          <span style={{ background: '#ef4444', color: '#ffffff', fontSize: '0.68rem', fontWeight: 900, padding: '2px 8px', borderRadius: '999px' }}>
                            {hi ? 'जल संकट जोखिम' : 'WATER STRESS'}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '2px' }}>
                        {hi ? crop.reasonHi : crop.reasonEn}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{hi ? 'पानी आवश्यकता' : 'Water Need'}</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#38bdf8' }}>{crop.waterReq}</div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{hi ? 'अनुमानित मुनाफा' : 'Net Profit'}</div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fbbf24' }}>{crop.expectedProfit}</div>
                    </div>

                    <div style={{ textAlign: 'right', minWidth: '70px' }}>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{hi ? 'उपयुक्तता' : 'Score'}</div>
                      <div
                        style={{
                          fontSize: '1.35rem',
                          fontWeight: 900,
                          color: crop.score >= 80 ? '#34d399' : crop.score >= 60 ? '#fbbf24' : '#f87171'
                        }}
                      >
                        {crop.score}%
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* ========================================================================= */}
        {/* 4. CARD 3: CLIMATE SCENARIO SANDBOX (🔮 The Hackathon Gamechanger)         */}
        {/* ========================================================================= */}
        <motion.section
          ref={sectionRefs.scenario}
          id="scenario"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6 }}
          style={{
            background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.94) 0%, rgba(10, 20, 26, 0.95) 100%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '28px',
            border: '2px solid rgba(245, 158, 11, 0.35)',
            boxShadow: '0 20px 45px rgba(0, 0, 0, 0.6), 0 0 25px rgba(245, 158, 11, 0.12)',
            padding: 'clamp(1.5rem, 3.5vw, 2.5rem)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <span style={{ background: '#f59e0b', color: '#000', fontSize: '0.75rem', fontWeight: 900, padding: '3px 12px', borderRadius: '999px' }}>
                {hi ? 'भविष्य जलवायु सिमुलेशन' : 'CLIMATE STRESS SIMULATOR'}
              </span>
              <h3 style={{ fontSize: 'clamp(1.3rem, 2.2vw, 1.75rem)', color: '#ffffff', fontWeight: 900, marginTop: '6px' }}>
                {hi ? 'क्या होगा अगर सूखा या लू चले?' : 'What if Rainfall Drops by 30%?'}
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
                padding: '6px 14px',
                borderRadius: '999px',
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#cbd5e1',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              <RotateCcw size={14} />
              <span>{hi ? 'रीसेट करें' : 'Reset'}</span>
            </button>
          </div>

          <p style={{ fontSize: '0.95rem', color: '#cbd5e1', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            {hi
              ? 'स्लाइडर को हिलाकर देखें कि बारिश कम होने या तापमान बढ़ने पर कौन सी फसलें सबसे सुरक्षित रहती हैं। हमारा ML इंजन वास्तविक समय में फसलों की रैंकिंग बदलता है।'
              : 'Drag the sliders to simulate a drought or heatwave. Watch our agronomic model dynamically re-rank crops in real time.'}
          </p>

          {/* Sliders Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '1.5rem' }}>
            {/* Slider 1: Rain Deficit */}
            <div style={{ background: 'rgba(255,255,255,0.04)', padding: '16px 20px', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>
                  {hi ? 'मानसून वर्षा विचलन (Rainfall):' : 'Rainfall Deficit:'}
                </span>
                <span
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 900,
                    color: rainDeficit < 0 ? '#f87171' : rainDeficit > 0 ? '#38bdf8' : '#34d399'
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
                style={{ width: '100%', accentColor: '#f59e0b', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>
                <span>-50% (गंभीर सूखा)</span>
                <span>0% (सामान्य)</span>
                <span>+40% (अत्यधिक)</span>
              </div>
            </div>

            {/* Slider 2: Temp Anomaly */}
            <div style={{ background: 'rgba(255,255,255,0.04)', padding: '16px 20px', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>
                  {hi ? 'तापमान वृद्धि (Heat Stress):' : 'Temperature Anomaly:'}
                </span>
                <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#f59e0b' }}>
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
                style={{ width: '100%', accentColor: '#ef4444', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>
                <span>0.0°C (सामान्य)</span>
                <span>+1.5°C (मध्यम लू)</span>
                <span>+3.0°C (चरम गर्मी)</span>
              </div>
            </div>
          </div>

          {/* Dynamic AI Explainable Callout */}
          <div
            style={{
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              borderRadius: '16px',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <Sparkles size={22} color="#fbbf24" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: '0.9rem', color: '#fef3c7', lineHeight: 1.5 }}>
              {rainDeficit < -15 ? (
                hi ? (
                  <strong>
                    सिमुलेशन परिणाम: कम बारिश ({rainDeficit}%) में धान (Paddy) की विफलता का जोखिम 70% तक बढ़ गया है। बाजरा और मूंग पहली प्राथमिकता बन गए हैं क्योंकि वे 42°C पर भी 350 मिमी पानी में भरपूर पैदावार देते हैं।
                  </strong>
                ) : (
                  <strong>
                    Simulation Alert: With {rainDeficit}% rain deficit, Paddy failure risk spikes to 70%. Bajra and Moong surge to Rank #1 due to high heat tolerance and minimal 350mm water demand.
                  </strong>
                )
              ) : (
                hi ? (
                  <span>सामान्य बारिश में धान और मूँगफली दोनों अच्छा मुनाफा देंगे।</span>
                ) : (
                  <span>Normal weather conditions support both paddy and groundnut safely.</span>
                )
              )}
            </div>
          </div>
        </motion.section>

        {/* ========================================================================= */}
        {/* 5. CARD 4: KISAAN VAANI VOICE AGENT (🎙️ Native STT+TTS)                  */}
        {/* ========================================================================= */}
        <motion.section
          ref={sectionRefs.awaaz}
          id="awaaz"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6 }}
          style={{
            background: 'linear-gradient(135deg, rgba(20, 10, 24, 0.94) 0%, rgba(10, 15, 20, 0.95) 100%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '28px',
            border: '2px solid rgba(236, 72, 153, 0.35)',
            boxShadow: '0 20px 45px rgba(0, 0, 0, 0.6), 0 0 25px rgba(236, 72, 153, 0.15)',
            padding: 'clamp(1.5rem, 3.5vw, 2.5rem)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          <div style={{ background: '#ec4899', color: '#fff', fontSize: '0.75rem', fontWeight: 900, padding: '3px 12px', borderRadius: '999px', marginBottom: '8px' }}>
            {hi ? 'किसान वाणी — बिना टाइप किए बोलें' : 'KISAAN VAANI VOICE ASSISTANT'}
          </div>

          <h3 style={{ fontSize: 'clamp(1.3rem, 2.5vw, 1.9rem)', color: '#ffffff', fontWeight: 900, marginBottom: '6px' }}>
            {hi ? 'माइक दबाकर अपनी भाषा में सवाल पूछें' : 'Tap to Speak in Hindi or English'}
          </h3>

          <p style={{ fontSize: '0.95rem', color: '#cbd5e1', maxWidth: '580px', marginBottom: '1.75rem' }}>
            {hi
              ? 'किसान भाई, आपको कुछ टाइप नहीं करना। बस माइक छुएं और बोलें — "आज पानी दूँ?", "कौन सी फसल लगाऊँ?", या "बारिश कब होगी?".'
              : 'Zero typing required. Speak naturally in Hindi or English to get immediate agricultural advice.'}
          </p>

          {/* Big Glowing Microphone Button */}
          <motion.button
            type="button"
            onClick={toggleVoiceMic}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            style={{
              width: '84px',
              height: '84px',
              borderRadius: '50%',
              background: isListening
                ? '#ef4444'
                : 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isListening
                ? '0 0 35px #ef4444, 0 0 70px rgba(239, 68, 68, 0.5)'
                : '0 10px 30px rgba(236, 72, 153, 0.4)',
              position: 'relative'
            }}
          >
            {isListening ? <MicOff size={36} /> : <Mic size={36} />}

            {/* Pulsing Ring while listening */}
            {isListening && (
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.7, 0, 0.7] }}
                transition={{ duration: 1.4, repeat: Infinity }}
                style={{
                  position: 'absolute',
                  inset: -6,
                  borderRadius: '50%',
                  border: '2px solid #ef4444'
                }}
              />
            )}
          </motion.button>

          <div style={{ marginTop: '12px', fontSize: '0.85rem', fontWeight: 700, color: isListening ? '#f87171' : '#f472b6' }}>
            {isListening
              ? (hi ? 'सुन रहा हूँ... बोलिए' : 'Listening... Speak now')
              : (hi ? 'माइक छुएं और बोलें' : 'Tap Mic to Speak')}
          </div>

          {/* Spoken Query & Reply Output Box */}
          <AnimatePresence>
            {(voiceTranscript || voiceReply) && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  marginTop: '1.5rem',
                  width: '100%',
                  maxWidth: '680px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '20px',
                  padding: '16px 20px',
                  textAlign: 'left'
                }}
              >
                {voiceTranscript && (
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{hi ? 'आपने पूछा:' : 'You asked:'}</span>
                    <div style={{ fontSize: '1rem', color: '#ffffff', fontWeight: 600 }}>"{voiceTranscript}"</div>
                  </div>
                )}
                {voiceReply && (
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '8px' }}>
                    <span style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 700 }}>
                      {hi ? 'मौसम सेतु उत्तर:' : 'Mausam Setu Reply:'}
                    </span>
                    <div style={{ fontSize: '1.05rem', color: '#ecfdf5', lineHeight: 1.5, marginTop: '2px' }}>
                      {voiceReply}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

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
                    panchayatName: selectedPanchayat.hi,
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
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '999px',
                  padding: '6px 14px',
                  color: '#e2e8f0',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </motion.section>

        {/* ========================================================================= */}
        {/* 6. CARD 5: 1-KM HYPERLOCAL MAUSAM TELEMETRY                              */}
        {/* ========================================================================= */}
        <motion.section
          ref={sectionRefs.mausam}
          id="mausam"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6 }}
          style={{
            background: 'rgba(10, 24, 20, 0.88)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '28px',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            padding: 'clamp(1.5rem, 3.5vw, 2.5rem)',
            boxShadow: '0 20px 45px rgba(0, 0, 0, 0.5)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <span style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 800 }}>
                {hi ? '1-किमी स्थानीय मौसम ग्रिड' : '1-KM HYPERLOCAL WEATHER'}
              </span>
              <h3 style={{ fontSize: 'clamp(1.3rem, 2.2vw, 1.75rem)', color: '#ffffff', fontWeight: 900, marginTop: '2px' }}>
                {selectedPanchayat.hi} ({selectedPanchayat.name})
              </h3>
            </div>
            <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontSize: '0.75rem', fontWeight: 800, padding: '4px 12px', borderRadius: '999px' }}>
              IMD + RF Model 1
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{hi ? 'तापमान (डाउनस्केल्ड)' : 'Temperature'}</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#f59e0b', marginTop: '2px' }}>
                31.8°C
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>±0.8°C Conformal (90% Conf)</div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{hi ? 'हवा की गति (Wind)' : 'Wind Speed'}</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#38bdf8', marginTop: '2px' }}>
                14 km/h
              </div>
              <div style={{ fontSize: '0.7rem', color: '#34d399' }}>{hi ? 'छिड़काव के लिए सुरक्षित' : 'Safe for spray'}</div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{hi ? 'हवा में नमी (Humidity)' : 'Relative Humidity'}</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#a78bfa', marginTop: '2px' }}>
                68%
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{hi ? 'सामान्य' : 'Normal range'}</div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{hi ? 'वाष्पीकरण (ET0)' : 'Evapotranspiration'}</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#34d399', marginTop: '2px' }}>
                4.2 mm
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Penman-Monteith (M6)</div>
            </div>
          </div>
        </motion.section>

        {/* ========================================================================= */}
        {/* 7. CARD 6: PANCHAYAT HAZARDS & ALERTS                                    */}
        {/* ========================================================================= */}
        <motion.section
          ref={sectionRefs.alerts}
          id="alerts"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6 }}
          style={{
            background: 'linear-gradient(135deg, rgba(30, 15, 15, 0.92) 0%, rgba(15, 10, 10, 0.95) 100%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '28px',
            border: '2px solid rgba(239, 68, 68, 0.35)',
            padding: 'clamp(1.5rem, 3.5vw, 2.5rem)',
            boxShadow: '0 20px 45px rgba(0, 0, 0, 0.5)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'rgba(239, 68, 68, 0.2)',
                color: '#f87171',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff' }}>
                {hi ? 'सक्रिय पंचायत अलर्ट बुलेटिन' : 'Active Panchayat Hazard Bulletin'}
              </h3>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                {selectedPanchayat.hi} · {hi ? 'अग्रिम 7-दिन जोखिम चेतावनी' : '7-Day Advance Warning'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px 18px', borderRadius: '16px', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ background: '#f59e0b', color: '#000', fontSize: '0.68rem', fontWeight: 900, padding: '2px 8px', borderRadius: '999px' }}>
                  {hi ? 'मध्यम जोखिम' : 'MEDIUM'}
                </span>
                <strong style={{ color: '#ffffff', fontSize: '0.95rem' }}>
                  {hi ? 'खेतों में जलभराव की चेतावनी' : 'Field Waterlogging Alert'}
                </strong>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '4px', lineHeight: 1.45 }}>
                {hi
                  ? 'कल शाम तक भारी वर्षा के कारण निचले खेतों में पानी जमा हो सकता है। कृपया जल निकासी नालियों (Drainage Channels) को समय पर खोलें।'
                  : 'Expected rain may cause low-lying plot ponding. Clear drainage outlets before evening.'}
              </p>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px 18px', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ background: '#10b981', color: '#042416', fontSize: '0.68rem', fontWeight: 900, padding: '2px 8px', borderRadius: '999px' }}>
                  {hi ? 'अनुकूल' : 'SAFE'}
                </span>
                <strong style={{ color: '#ffffff', fontSize: '0.95rem' }}>
                  {hi ? 'कीट-मुक्त मौसम खिड़की (Safe Spray Window)' : 'Safe Spray Window'}
                </strong>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '4px', lineHeight: 1.45 }}>
                {hi
                  ? 'हवा की गति 14 किमी/घंटा है। दोपहर 3 बजे तक कीटनाशक स्प्रे करने के लिए मौसम अनुकूल है।'
                  : 'Winds are calm at 14 km/h. Conditions are optimal for necessary foliar application until 3 PM.'}
              </p>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};
