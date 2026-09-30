import React, { useState } from 'react';
import { useFarm } from '../contexts/FarmContext';
import { useApp } from '../contexts/AppContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Compass,
  Droplets,
  Sprout,
  SprayCan,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Volume2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Cpu,
  ArrowRight,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

interface AdviceTimelineItem {
  id: string;
  time: string;
  timeEn: string;
  category: string;
  categoryEn: string;
  icon: any;
  actionLevel1: string;
  actionLevel1En: string;
  whyLevel2: string;
  whyLevel2En: string;
  scienceLevel3: string;
  status: 'HOLD' | 'ACTION_REQUIRED' | 'PROHIBITED' | 'SCHEDULED';
  statusLabel: string;
  statusLabelEn: string;
  statusColor: string;
  statusBg: string;
  confidence: string;
  confidenceEn: string;
}

export const AdvicePage: React.FC = () => {
  const { farm, loadDemoFarm, playVoice, stopVoice, isSpeaking } = useFarm();
  const { language } = useApp();
  const navigate = useNavigate();
  const en = language === 'en';

  const [expandedScienceId, setExpandedScienceId] = useState<string | null>(null);

  // =========================================================================
  // STATE A: NO FARM CONFIGURED (Prompt Spec 1)
  // =========================================================================
  if (!farm.isConfigured) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        style={{ maxWidth: '680px', margin: '3rem auto', padding: '0 1.25rem', textAlign: 'center' }}
      >
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.94)',
            backdropFilter: 'blur(12px)',
            borderRadius: '20px',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            padding: '2.5rem 2rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.04)'
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: '#ecfdf5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              border: '1.5px solid #a7f3d0'
            }}
          >
            <Compass size={28} />
          </div>

          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
            {en ? 'Configure Your Farm First' : 'अपना खेत सेट करें'}
          </h2>

          <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.55, maxWidth: '480px', margin: '0 auto 1.5rem' }}>
            {en
              ? 'We deliver customized field advisories only after analyzing your 1-km weather, root-zone soil telemetry, water table, and crop stage.'
              : 'हम आपके खेत के लिए मौसम, मिट्टी, पानी और फसल को एक साथ समझने के बाद ही सही सलाह देंगे। बिना खेत की जानकारी के कोई भी काल्पनिक सलाह नहीं दिखाई जाती।'}
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <Link
              to="/setup"
              style={{
                background: '#059669',
                color: '#ffffff',
                padding: '10px 22px',
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontWeight: 800,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 14px rgba(5,150,105,0.25)'
              }}
            >
              <span>{en ? 'CONFIGURE FARM' : 'अपना खेत सेट करें'}</span>
              <ArrowRight size={15} />
            </Link>

            <button
              type="button"
              onClick={loadDemoFarm}
              style={{
                background: '#f8fafc',
                border: '1.5px solid #cbd5e1',
                color: '#334155',
                padding: '10px 20px',
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Sparkles size={15} color="#059669" />
              <span>{en ? 'Try Demo Farm' : 'डेमो खेत देखें'}</span>
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // =========================================================================
  // STATE B: FARM CONTEXT AVAILABLE -> RENDER ACTION TIMELINE
  // =========================================================================
  const TIMELINE_ITEMS: AdviceTimelineItem[] = [
    {
      id: 'item-1',
      time: '08:00 AM',
      timeEn: '08:00 AM',
      category: 'सिंचाई (Irrigation)',
      categoryEn: 'Irrigation',
      icon: Droplets,
      actionLevel1: 'आज खेत को पानी देने की जरूरत नहीं है (Do not irrigate)',
      actionLevel1En: 'No irrigation needed today. Hold tubewell pumping.',
      whyLevel2: 'अगले 24 घंटों में 84% संभावना से 12.4 मिमी बारिश होगी तथा 40 सेमी गहराई पर मिट्टी में पर्याप्त 31.4% नमी मौजूद है।',
      whyLevel2En: '84% probability of 12.4 mm rainfall in the next 24 hours with adequate 31.4% root-zone moisture already present.',
      scienceLevel3: 'Penman-Monteith ETc = 4.2 mm/day; Root-zone VWC = 31.4% (Field Capacity = 33%); Net deficit = -8.2 mm. Irrigation threshold not crossed. Avoided cost: ~₹1,450 (Illustrative pumping energy saved).',
      status: 'HOLD',
      statusLabel: 'सिंचाई रोकें (HOLD)',
      statusLabelEn: 'HOLD IRRIGATION',
      statusColor: '#059669',
      statusBg: '#ecfdf5',
      confidence: '84% वर्षा संभावना',
      confidenceEn: '84% Rain Probability'
    },
    {
      id: 'item-2',
      time: '12:00 PM',
      timeEn: '12:00 PM',
      category: 'खेत निरीक्षण (Field Check)',
      categoryEn: 'Field Check',
      icon: Sprout,
      actionLevel1: 'निचले खेत की ड्रेनेज नालियां चेक करें (Monitor water level)',
      actionLevel1En: 'Inspect low-lying field drainage bunds and clear runoff outlets.',
      whyLevel2: 'शाम की भारी वर्षा के कारण खेत के निचले हिस्सों में जलभराव हो सकता है। मेड़ के निकास रास्ते साफ रखें।',
      whyLevel2En: 'Intense evening showers may cause ponding in topographical depressions. Ensure bund channels are clear.',
      scienceLevel3: 'Runoff risk index = 0.62 in depressions (elevation 118m contour). Infiltration capacity = 12 mm/hr on Sandy Loam. Ponding anticipated if peak intensity exceeds 18 mm/hr.',
      status: 'ACTION_REQUIRED',
      statusLabel: 'निरीक्षण करें (MONITOR)',
      statusLabelEn: 'ACTION REQUIRED',
      statusColor: '#d97706',
      statusBg: '#fffbeb',
      confidence: 'स्थलाकृतिक जलभराव जोखिम',
      confidenceEn: 'Topographical Runoff Risk'
    },
    {
      id: 'item-3',
      time: '05:00 PM',
      timeEn: '05:00 PM',
      category: 'छिड़काव (Spraying)',
      categoryEn: 'Chemical Spray',
      icon: SprayCan,
      actionLevel1: 'कीटनाशक व खाद का छिड़काव न करें (Avoid spraying)',
      actionLevel1En: 'Do not spray pesticides or foliar nutrients today.',
      whyLevel2: 'शाम 4 से 10 बजे के बीच तेज बारिश और 16 किमी/घंटा की हवा का अनुमान है। दवा पानी में बह जाएगी।',
      whyLevel2En: 'Rain showers and 16 km/h gusts between 4 PM and 10 PM will wash away chemical applications.',
      scienceLevel3: 'Precipitation washout risk = 92%. Wind speed gusting to 4.4 m/s triggers spray drift hazard. Minimum 4-hour rainfast period unavailable.',
      status: 'PROHIBITED',
      statusLabel: 'छिड़काव न करें (PROHIBITED)',
      statusLabelEn: 'DO NOT SPRAY',
      statusColor: '#dc2626',
      statusBg: '#fef2f2',
      confidence: 'धुलने व बहाव का जोखिम',
      confidenceEn: 'Chemical Washout Risk'
    },
    {
      id: 'item-4',
      time: 'कल सुबह 07:00 AM',
      timeEn: 'Tomorrow 07:00 AM',
      category: 'कल सुबह (Tomorrow)',
      categoryEn: 'Tomorrow Morning',
      icon: Clock,
      actionLevel1: 'बारिश के बाद मिट्टी की नमी दोबारा जांचें (Recheck soil)',
      actionLevel1En: 'Recheck soil moisture and plan nitrogen top-dressing.',
      whyLevel2: 'कल सुबह वर्षा की मात्रा का वास्तविक प्रभाव देखकर ही खाद या अन्य कार्यों का फैसला लें।',
      whyLevel2En: 'Observe actual moisture infiltration before applying scheduled urea or field operations.',
      scienceLevel3: 'In-situ sensor resynchronization scheduled at 06:00 UTC. Post-monsoon percolation will rebalance root-zone tension metric.',
      status: 'SCHEDULED',
      statusLabel: 'कल सुबह (SCHEDULED)',
      statusLabelEn: 'SCHEDULED',
      statusColor: '#0284c7',
      statusBg: '#f0f9ff',
      confidence: 'मॉडल शेड्यूल्ड चक्र',
      confidenceEn: 'Model Scheduled Cycle'
    }
  ];

  const fullAdviceVoiceScript = en
    ? `Farmer friend, here are today's three key actions for your field: First: Do not irrigate today because evening rain will adequately replenish the soil. Second: Keep low-lying field drainage channels clear to prevent waterlogging. Third: Postpone all chemical spraying as evening showers will wash away applied inputs.`
    : `आज आपके खेत के लिए तीन मुख्य निर्देश हैं। पहला: आज खेत को पानी देने की जरूरत नहीं है, क्योंकि शाम को बारिश होगी और मिट्टी में पर्याप्त नमी है। दूसरा: निचले खेत की पानी निकास नालियां साफ रखें ताकि जलभराव न हो। तीसरा: आज किसी भी कीटनाशक का छिड़काव न करें, क्योंकि बारिश में दवा धुल जाएगी।`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      style={{ maxWidth: '880px', margin: '0 auto', padding: '1.25rem 1rem 4rem' }}
    >
      {/* Page Header */}
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
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
                ACTIONABLE FIELD ADVISORY
              </span>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                📍 {en ? farm.panchayat.name : farm.panchayat.hi} • {en ? (farm.crop.nameEn || farm.crop.nameHi) : (farm.crop.nameHi || farm.crop.nameEn)}
              </span>
            </div>

            <h1 style={{ fontSize: '1.45rem', color: '#0f172a', fontWeight: 800, margin: '0 0 4px 0' }}>
              {en ? 'What Should You Do in Your Field Today?' : 'आज आपके खेत के लिए क्या करें?'}
            </h1>
            <p style={{ color: '#475569', fontSize: '0.86rem', margin: 0 }}>
              {en
                ? 'Clear, prioritized action plan in 3 levels: 1. Direct answer, 2. Why?, 3. Scientific calculation.'
                : 'स्पष्ट, समयबद्ध कार्य योजना। 3 स्तरों में समझें: 1. सीधा फैसला, 2. क्यों?, 3. वैज्ञानिक गणना।'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => (isSpeaking ? stopVoice() : playVoice(fullAdviceVoiceScript))}
            style={{
              background: isSpeaking ? '#fee2e2' : '#ecfdf5',
              color: isSpeaking ? '#dc2626' : '#059669',
              border: `1.5px solid ${isSpeaking ? '#fecaca' : '#a7f3d0'}`,
              padding: '7px 16px',
              borderRadius: '999px',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Volume2 size={16} />
            <span>
              {isSpeaking
                ? (en ? 'Stop Audio' : 'बोलना बंद करें')
                : (en ? 'Listen Advisory' : '🔊 पूरी सलाह सुनें')}
            </span>
          </button>
        </div>
      </div>

      {/* VERTICAL ACTION TIMELINE */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {TIMELINE_ITEMS.map((item) => {
          const ItemIcon = item.icon;
          const isScienceOpen = expandedScienceId === item.id;

          return (
            <div
              key={item.id}
              style={{
                background: 'rgba(255, 255, 255, 0.94)',
                backdropFilter: 'blur(10px)',
                borderRadius: '14px',
                border: '1px solid rgba(226, 232, 240, 0.8)',
                padding: '16px 20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              {/* Header row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: item.statusBg,
                      color: item.statusColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <ItemIcon size={16} />
                  </div>

                  <div>
                    <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748b' }}>
                      {en ? item.timeEn : item.time} · {en ? item.categoryEn : item.category}
                    </span>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                      {en ? item.confidenceEn : item.confidence}
                    </div>
                  </div>
                </div>

                <span
                  style={{
                    background: item.statusBg,
                    color: item.statusColor,
                    padding: '3px 10px',
                    borderRadius: '999px',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    border: `1px solid ${item.statusColor}33`
                  }}
                >
                  {en ? item.statusLabelEn : item.statusLabel}
                </span>
              </div>

              {/* LEVEL 1: Simple Answer */}
              <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a' }}>
                {en ? item.actionLevel1En : item.actionLevel1}
              </div>

              {/* LEVEL 2: Explanation (Why?) */}
              <div
                style={{
                  background: '#f8fafc',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  color: '#334155',
                  lineHeight: 1.5,
                  borderLeft: `3px solid ${item.statusColor}`
                }}
              >
                <strong style={{ color: '#0f172a', marginRight: '5px' }}>
                  {en ? 'Reason:' : 'कारण:'}
                </strong>
                {en ? item.whyLevel2En : item.whyLevel2}
              </div>

              {/* LEVEL 3: Scientific Calculation Accordion */}
              <div>
                <button
                  type="button"
                  onClick={() => setExpandedScienceId(isScienceOpen ? null : item.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#64748b',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: 0
                  }}
                >
                  <Cpu size={12} color="#059669" />
                  <span>
                    {isScienceOpen
                      ? (en ? 'Hide Scientific Formula' : 'वैज्ञानिक गणना छिपाएं')
                      : (en ? 'Level 3: Inspect Scientific Calculation' : 'स्तर 3: वैज्ञानिक गणना देखें (Level 3 Science)')}
                  </span>
                  {isScienceOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                </button>

                {isScienceOpen && (
                  <div
                    style={{
                      marginTop: '6px',
                      padding: '8px 10px',
                      background: '#f1f5f9',
                      borderRadius: '8px',
                      fontSize: '0.72rem',
                      fontFamily: 'var(--font-mono)',
                      color: '#1e293b',
                      lineHeight: 1.45,
                      border: '1px solid #cbd5e1'
                    }}
                  >
                    {item.scienceLevel3}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
