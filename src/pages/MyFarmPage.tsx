import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  MapPin,
  Sprout,
  Droplets,
  CloudRain,
  Thermometer,
  ArrowRight,
  Sparkles,
  Volume2,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Info,
  Calendar,
  Layers,
  Ruler,
  ShieldCheck,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { useFarm } from '../contexts/FarmContext';
import { useApp } from '../contexts/AppContext';

export const MyFarmPage: React.FC = () => {
  const { farm, loadDemoFarm, playVoice, stopVoice, isSpeaking } = useFarm();
  const { language } = useApp();
  const navigate = useNavigate();

  const en = language === 'en';
  const [showWhy, setShowWhy] = useState(false);
  const [showWhatTodo, setShowWhatTodo] = useState(false);

  // =========================================================================
  // STATE A — BEFORE INPUT (NO FARM CONTEXT CONFIGURED)
  // =========================================================================
  if (!farm.isConfigured) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          maxWidth: '680px',
          margin: '3rem auto',
          padding: '0 1.25rem',
          textAlign: 'center'
        }}
      >
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(12px)',
            borderRadius: '20px',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            padding: '2.5rem 2rem',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)'
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
            <Sprout size={28} />
          </div>

          <span
            style={{
              background: '#ecfdf5',
              color: '#047857',
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '3px 12px',
              borderRadius: '999px',
              border: '1px solid #bbf7d0',
              letterSpacing: '0.04em'
            }}
          >
            MAUSAM SETU PERSONAL ASSISTANT
          </span>

          <h2
            style={{
              fontSize: '1.5rem',
              color: '#0f172a',
              fontWeight: 800,
              margin: '12px 0 8px'
            }}
          >
            {en ? 'Configure Your Farm' : 'अपना खेत सेट करें'}
          </h2>

          <p
            style={{
              fontSize: '0.9rem',
              color: '#475569',
              lineHeight: 1.55,
              maxWidth: '480px',
              margin: '0 auto 1.5rem'
            }}
          >
            {en
              ? 'We generate accurate farm advisories only after understanding your 1-km hyperlocal weather, root-zone soil moisture, water access, and crop stage together.'
              : 'हम आपके खेत के लिए 1-किमी स्थानीय मौसम, मिट्टी की नमी, पानी की उपलब्धता और फसल अवस्था को एक साथ समझने के बाद ही सटीक सलाह देंगे।'}
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => navigate('/setup')}
              style={{
                padding: '10px 22px',
                borderRadius: '10px',
                background: '#059669',
                color: '#ffffff',
                border: 'none',
                fontSize: '0.85rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 14px rgba(5, 150, 105, 0.25)'
              }}
            >
              <span>{en ? 'CONFIGURE MY FARM' : 'अपना खेत सेट करें'}</span>
              <ArrowRight size={15} />
            </button>

            <button
              type="button"
              onClick={loadDemoFarm}
              style={{
                padding: '10px 20px',
                borderRadius: '10px',
                background: '#ffffff',
                color: '#334155',
                border: '1.5px solid #cbd5e1',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Sparkles size={15} color="#059669" />
              <span>{en ? 'TRY DEMO FARM (Malihabad)' : 'डेमो खेत देखें (मलिहाबाद)'}</span>
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // =========================================================================
  // STATE B — AFTER INPUT (FARM CONFIGURED)
  // =========================================================================
  const audioText = en
    ? `Farmer friend, for your ${farm.crop.nameEn || farm.crop.nameHi} crop in ${farm.panchayat.name}: Today's primary verdict is: No irrigation needed today. There is an 84% probability of 12.4 millimeters rainfall in the next 24 hours, and root-zone soil moisture is already adequate at 31.4 percent.`
    : `किसान भाई, ${farm.panchayat.hi} में आपकी फसल ${farm.crop.nameHi} के लिए आज का मुख्य फैसला: आज खेत को पानी देने की जरूरत नहीं है। अगले 24 घंटों में 12.4 मिलीमीटर बारिश की संभावना है और मिट्टी में 31.4 प्रतिशत पर्याप्त नमी मौजूद है।`;

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.07 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{
        maxWidth: '920px',
        margin: '0 auto',
        padding: '1.25rem 1rem 4rem'
      }}
    >
      {/* Top Greeting */}
      <motion.div variants={itemVariants} style={{ marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {en ? 'NAMASTE • GOOD MORNING' : 'नमस्ते • शुभ प्रभात'}
        </div>
        <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: '2px 0 4px' }}>
          {en ? "Your Farm's Status Today" : 'यह आपके खेत का आज का हाल है'}
        </h1>
        <div style={{ fontSize: '0.82rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span>{en ? farm.panchayat.name : farm.panchayat.hi}</span>
          <span>•</span>
          <span>{en ? (farm.crop.nameEn || farm.crop.nameHi) : (farm.crop.nameHi || farm.crop.nameEn)}</span>
          <span>•</span>
          <span>{farm.landArea} {farm.landUnit === 'bigha' ? (en ? 'Bigha' : 'बीघा') : (en ? 'Acre' : 'एकड़')}</span>
          <span>•</span>
          <span style={{ color: '#059669', fontWeight: 700 }}>
            {farm.crop.stage || 'Vegetative'}
          </span>
        </div>
      </motion.div>

      {/* PRIMARY DECISION HERO */}
      <motion.div
        variants={itemVariants}
        whileHover={{ translateY: -2 }}
        style={{
          background: 'rgba(255, 255, 255, 0.94)',
          backdropFilter: 'blur(12px)',
          borderRadius: '18px',
          border: '1.5px solid #86efac',
          boxShadow: '0 8px 24px rgba(5, 150, 105, 0.06)',
          padding: '1.5rem 1.75rem',
          marginBottom: '1.5rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <span style={{ background: '#059669', color: '#ffffff', fontSize: '0.7rem', fontWeight: 800, padding: '2px 10px', borderRadius: '999px' }}>
            {en ? "TODAY'S VERDICT" : 'आज का मुख्य फैसला'}
          </span>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
            1-km Root-Zone Hydro-Meteorological Model
          </span>
        </div>

        <h2
          style={{
            fontSize: '1.35rem',
            color: '#065f46',
            fontWeight: 900,
            lineHeight: 1.3,
            marginBottom: '8px'
          }}
        >
          {en ? 'No Irrigation Needed Today.' : 'आज खेत को पानी देने की ज़रूरत नहीं है।'}
        </h2>

        <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.55, marginBottom: '1.25rem', maxWidth: '720px' }}>
          {en
            ? '84% probability of 12.4 mm rainfall in the next 24 hours with adequate 31.4% root-zone moisture already present. Hold pumping to avoid unnecessary groundwater extraction and save energy (Estimated savings ~₹1,450 · Illustrative avoided cost).'
            : 'अगले 24 घंटों में 12.4 मिमी बारिश की 84% संभावना है और मिट्टी में जड़ों के पास 31.4% पर्याप्त नमी मौजूद है। सिंचाई रोककर अनावश्यक भूजल दोहन और बिजली/डीजल लागत बचाएं (अनुमानित बचत ~₹1,450 · Illustrative avoided cost)।'}
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => setShowWhy(!showWhy)}
            style={{
              padding: '7px 16px',
              borderRadius: '999px',
              border: '1.5px solid #cbd5e1',
              background: showWhy ? '#f1f5f9' : '#ffffff',
              color: '#0f172a',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <span>{en ? 'Why?' : 'क्यों?'}</span>
            {showWhy ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          <button
            type="button"
            onClick={() => setShowWhatTodo(!showWhatTodo)}
            style={{
              padding: '7px 16px',
              borderRadius: '999px',
              border: '1.5px solid #cbd5e1',
              background: showWhatTodo ? '#f1f5f9' : '#ffffff',
              color: '#0f172a',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <span>{en ? 'Next Steps' : 'क्या करें?'}</span>
            {showWhatTodo ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          <button
            type="button"
            onClick={() => (isSpeaking ? stopVoice() : playVoice(audioText))}
            style={{
              padding: '7px 16px',
              borderRadius: '999px',
              border: '1.5px solid #a7f3d0',
              background: isSpeaking ? '#fee2e2' : '#ecfdf5',
              color: isSpeaking ? '#dc2626' : '#059669',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <Volume2 size={15} />
            <span>
              {isSpeaking
                ? (en ? 'Stop Audio' : 'बंद करें')
                : (en ? 'Listen Audio' : 'सलाह सुनें')}
            </span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/learn')}
            style={{
              padding: '7px 16px',
              borderRadius: '999px',
              border: '1.5px solid #f43f5e',
              background: '#fff1f2',
              color: '#e11d48',
              fontSize: '0.8rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <span>🎬</span>
            <span>{en ? 'Watch Kisan Shorts' : 'सीखें (रील्स)'}</span>
          </button>
        </div>

        {/* Expandable Why Drawer */}
        <AnimatePresence>
          {showWhy && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              style={{
                marginTop: '14px',
                paddingTop: '12px',
                borderTop: '1px solid #e2e8f0',
                fontSize: '0.82rem',
                color: '#334155',
                overflow: 'hidden'
              }}
            >
              <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                {en ? 'Scientific Reasons Behind Today’s Verdict:' : 'इस निर्णय के वैज्ञानिक कारण:'}
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li>
                  {en
                    ? '1. Rainfall Forecast: 12.4 mm expected between 4:00 PM and 10:00 PM (84% probability). Infiltration will replenish root zone without pumping.'
                    : '1. वर्षा का अनुमान: आज शाम 4 से 10 बजे के बीच 12.4 मिमी बारिश की 84% संभावना है, जिससे जड़-क्षेत्र में प्राकृतिक पानी मिलेगा।'}
                </li>
                <li>
                  {en
                    ? '2. Root-Zone Moisture: Currently 31.4% VWC at 40cm depth, optimal for vegetative/flowering stage.'
                    : '2. मिट्टी की नमी: 40 सेमी गहराई पर 31.4% नमी मौजूद है, जो पौधे की जड़ के लिए पूरी तरह अनुकूल है।'}
                </li>
                <li>
                  {en
                    ? '3. Soil Retention: Sandy Loam retains 45mm available water; rainfall will keep moisture within field capacity.'
                    : '3. मृदा जल-धारण: बलुई दोमट मिट्टी में 45 मिमी जल भण्डारण क्षमता है; वर्षा के बाद नमी फील्ड कैपेसिटी में रहेगी।'}
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Expandable What To Do Drawer */}
        <AnimatePresence>
          {showWhatTodo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              style={{
                marginTop: '14px',
                paddingTop: '12px',
                borderTop: '1px solid #e2e8f0',
                fontSize: '0.82rem',
                color: '#334155',
                overflow: 'hidden'
              }}
            >
              <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                {en ? 'Recommended Farmer Actions:' : 'किसान भाइयों के लिए तुरंत करने योग्य कार्य:'}
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li>
                  {en
                    ? '1. Keep tubewell pump off today. Avoid wasting groundwater and electricity/diesel.'
                    : '1. आज नलकूप या पंपसेट बिल्कुल न चलाएं।'}
                </li>
                <li>
                  {en
                    ? '2. Inspect field bund drainage outlets to prevent waterlogging during evening showers.'
                    : '2. खेत की मेड़ के जल निकासी रास्ते साफ रखें ताकि शाम की बारिश का पानी जमा न हो।'}
                </li>
                <li>
                  {en
                    ? '3. Postpone pesticide/fertilizer spraying until rainfall passes to avoid chemical washout.'
                    : '3. कीटनाशक या यूरिया का छिड़काव आज टालें, बारिश में दवा बहने का जोखिम है।'}
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* TODAY SNAPSHOT (4 CORE METRICS) */}
      <motion.div variants={itemVariants} style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', letterSpacing: '0.04em', marginBottom: '8px' }}>
          {en ? "TODAY'S FIELD SNAPSHOT (4 CORE SIGNALS)" : 'खेत की वर्तमान स्थिति (TODAY SNAPSHOT)'}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
          {/* Metric 1: Rain */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(10px)',
              padding: '14px 16px',
              borderRadius: '14px',
              border: '1px solid rgba(226, 232, 240, 0.8)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#0284c7', fontWeight: 700, marginBottom: '4px' }}>
              <CloudRain size={16} />
              <span>{en ? 'Rainfall' : 'वर्षा (Rain)'}</span>
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', lineHeight: 1.1 }}>
              84% <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>(12.4 mm)</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#0284c7', marginTop: '4px', fontWeight: 600 }}>
              {en ? 'Expected 4 PM - 10 PM' : 'शाम 4 से 10 बजे संभावना'}
            </div>
          </div>

          {/* Metric 2: Temperature */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(10px)',
              padding: '14px 16px',
              borderRadius: '14px',
              border: '1px solid rgba(226, 232, 240, 0.8)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#ea580c', fontWeight: 700, marginBottom: '4px' }}>
              <Thermometer size={16} />
              <span>{en ? 'Air Temp' : 'तापमान (Temp)'}</span>
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', lineHeight: 1.1 }}>
              28–34°C
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>
              {en ? 'Within normal range' : 'सामान्य तापमान सीमा'}
            </div>
          </div>

          {/* Metric 3: Soil Moisture */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(10px)',
              padding: '14px 16px',
              borderRadius: '14px',
              border: '1px solid rgba(226, 232, 240, 0.8)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#059669', fontWeight: 700, marginBottom: '4px' }}>
              <Droplets size={16} />
              <span>{en ? 'Soil Moisture' : 'मिट्टी नमी (Soil)'}</span>
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', lineHeight: 1.1 }}>
              31.4% <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#059669' }}>({en ? 'Optimal' : 'पर्याप्त'})</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>
              {en ? '40cm root-zone depth' : '40 सेमी रूट-ज़ोन गहराई'}
            </div>
          </div>

          {/* Metric 4: Crop Status */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(10px)',
              padding: '14px 16px',
              borderRadius: '14px',
              border: '1px solid rgba(226, 232, 240, 0.8)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#16a34a', fontWeight: 700, marginBottom: '4px' }}>
              <Sprout size={16} />
              <span>{en ? 'Crop Stage' : 'फसल अवस्था (Crop)'}</span>
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', lineHeight: 1.1 }}>
              {farm.crop.stage || 'Vegetative'}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#16a34a', marginTop: '4px', fontWeight: 600 }}>
              {en ? 'Healthy biomass vigor' : 'स्वस्थ वनस्पति वृद्धि'}
            </div>
          </div>
        </div>
      </motion.div>

      {/* NEXT 3 ACTIONS */}
      <motion.div variants={itemVariants} style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', letterSpacing: '0.04em', marginBottom: '8px' }}>
          {en ? 'NEXT 3 ACTIONS FOR YOUR FIELD' : 'अगले 3 मुख्य कदम (NEXT 3 ACTIONS)'}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* Action 1 */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(10px)',
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1px solid rgba(226, 232, 240, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: '#ecfdf5',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Droplets size={16} />
              </div>
              <div>
                <strong style={{ fontSize: '0.85rem', color: '#0f172a', display: 'block' }}>
                  {en ? '1. Irrigation: Hold today' : '1. सिंचाई: आज रोकें (Hold today)'}
                </strong>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  {en ? 'Rainfall will cover soil deficit without pumping' : 'आगामी वर्षा मिट्टी की नमी पूरा करेगी, पंप न चलाएं'}
                </span>
              </div>
            </div>
            <span style={{ background: '#ecfdf5', color: '#059669', fontSize: '0.7rem', fontWeight: 800, padding: '3px 10px', borderRadius: '999px' }}>
              {en ? 'RECOMMENDED' : 'स्वीकृत'}
            </span>
          </div>

          {/* Action 2 */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(10px)',
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1px solid rgba(226, 232, 240, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: '#f0fdf4',
                  color: '#16a34a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Sprout size={16} />
              </div>
              <div>
                <strong style={{ fontSize: '0.85rem', color: '#0f172a', display: 'block' }}>
                  {en ? '2. Nutrients: Review after rainfall' : '2. खाद प्रबंधन: बारिश के बाद समीक्षा करें'}
                </strong>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  {en ? 'Wait for post-monsoon soil percolation before top dressing' : 'बारिश के पानी के अवशोषण के बाद ही यूरिया की खुराक दें'}
                </span>
              </div>
            </div>
            <span style={{ background: '#f8fafc', color: '#64748b', fontSize: '0.7rem', fontWeight: 800, padding: '3px 10px', borderRadius: '999px' }}>
              {en ? 'POST-RAIN' : 'बाद में'}
            </span>
          </div>

          {/* Action 3 */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(10px)',
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1px solid rgba(226, 232, 240, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: '#fffbeb',
                  color: '#d97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <CloudRain size={16} />
              </div>
              <div>
                <strong style={{ fontSize: '0.85rem', color: '#0f172a', display: 'block' }}>
                  {en ? '3. Drainage: Check low-lying bund outlets' : '3. जल निकासी: निचले खेत की नालियां चेक करें'}
                </strong>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  {en ? 'Keep channels clear to prevent water accumulation' : 'जलभराव से बचाव हेतु मेड़ के निकास खुले रखें'}
                </span>
              </div>
            </div>
            <span style={{ background: '#fffbeb', color: '#d97706', fontSize: '0.7rem', fontWeight: 800, padding: '3px 10px', borderRadius: '999px' }}>
              {en ? 'ACTION' : 'जरूरी'}
            </span>
          </div>
        </div>
      </motion.div>

      {/* 3-DAY TIMELINE */}
      <motion.div variants={itemVariants}>
        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', letterSpacing: '0.04em', marginBottom: '8px' }}>
          {en ? '3-DAY AGRICULTURAL TIMELINE' : '3-दिन का कृषि चक्र (3-DAY TIMELINE)'}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(10px)',
              padding: '14px',
              borderRadius: '12px',
              border: '1px solid rgba(226, 232, 240, 0.8)'
            }}
          >
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#059669', marginBottom: '3px' }}>
              {en ? 'TODAY' : 'आज'}
            </div>
            <strong style={{ fontSize: '0.88rem', color: '#0f172a', display: 'block', marginBottom: '2px' }}>
              {en ? 'Evening Rain (12.4mm)' : 'शाम को वर्षा (12.4 मिमी)'}
            </strong>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              {en ? 'Hold irrigation; inspect drainage outlets' : 'सिंचाई बंद रखें; नालियों की निकासी चेक करें'}
            </span>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(10px)',
              padding: '14px',
              borderRadius: '12px',
              border: '1px solid rgba(226, 232, 240, 0.8)'
            }}
          >
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0284c7', marginBottom: '3px' }}>
              {en ? 'TOMORROW' : 'कल'}
            </div>
            <strong style={{ fontSize: '0.88rem', color: '#0f172a', display: 'block', marginBottom: '2px' }}>
              {en ? 'Optimal Soil Moisture' : 'अनुकूल मृदा नमी'}
            </strong>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              {en ? 'Roots absorb moisture; suitable for weeding' : 'जड़ें नमी सोखेंगी; खरपतवार निराई हेतु अनुकूल'}
            </span>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(10px)',
              padding: '14px',
              borderRadius: '12px',
              border: '1px solid rgba(226, 232, 240, 0.8)'
            }}
          >
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', marginBottom: '3px' }}>
              {en ? 'DAY AFTER' : 'परसों'}
            </div>
            <strong style={{ fontSize: '0.88rem', color: '#0f172a', display: 'block', marginBottom: '2px' }}>
              {en ? 'Clear & Sunny' : 'खुला व साफ मौसम'}
            </strong>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              {en ? 'Foliar spray and field operations permitted' : 'पोषक तत्वों का स्प्रे व सामान्य खेत कार्य करें'}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
