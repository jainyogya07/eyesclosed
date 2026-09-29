import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Bell,
  Brain,
  ChevronRight,
  Cloud,
  Droplets,
  Leaf,
  MapPin,
  ShieldCheck,
  Sprout,
  TrendingUp,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import heroAerial from '../../assets/images/kisaan-aerial-hero.png';
import { FarmerOneScreen } from '../components/farmer/FarmerOneScreen';
import { FertilizerAlarmSystem } from '../components/farmer/FertilizerAlarmSystem';
import { ModelCascadeGrid } from '../components/ai/ModelCascadeGrid';
import { DigitalTwinSandbox } from '../components/digitalTwin/DigitalTwinSandbox';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { language, location } = useApp();
  const hi = language === 'hi';

  const features = [
    [Brain, hi ? 'AI कृषि सलाह' : 'AI farm advice', hi ? 'हर दिन आपके खेत के लिए एक साफ़ अगला कदम।' : 'One clear next step for your field, every day.'],
    [Droplets, hi ? 'स्मार्ट सिंचाई' : 'Smart irrigation', hi ? 'बारिश से पहले पानी और पंप खर्च बचाइए।' : 'Save water and pump costs before it rains.'],
    [TrendingUp, hi ? 'उपज का अनुमान' : 'Yield outlook', hi ? 'मौसम और फसल डेटा से बेहतर योजना।' : 'Plan ahead with crop and weather intelligence.'],
    [Sprout, hi ? 'फसल की सेहत' : 'Crop health', hi ? 'विकास चरण और फसल की ज़रूरतें समझें।' : 'Understand crop stage and field needs.'],
    [Bell, hi ? 'समय पर अलर्ट' : 'Timely alerts', hi ? 'बारिश, पाला और जोखिम की पहले चेतावनी।' : 'Early warnings for rain, frost, and risk.'],
    [Cloud, hi ? '1-किमी मौसम' : '1-km weather', hi ? 'आपके गांव के अनुसार स्थानीय पूर्वानुमान।' : 'Local forecasts tailored to your village.'],
  ] as const;

  const steps = [
    ['01', hi ? 'अपना खेत चुनें' : 'Choose your farm', hi ? 'अपना गांव और फसल जोड़ें।' : 'Add your village and crop.'],
    ['02', hi ? 'AI आपका खेत पढ़ता है' : 'AI reads your field', hi ? 'मौसम और मिट्टी के संकेत एक जगह आते हैं।' : 'Weather and soil signals come together.'],
    ['03', hi ? 'साफ़ सलाह पाएं' : 'Get clear advice', hi ? 'आज क्या करना है, वही सबसे पहले देखें।' : 'See what to do today, first.'],
  ];

  const solutionModules = [
    [Droplets, hi ? 'जल पायलट' : 'Water intelligence', hi ? 'मिट्टी की नमी, ET और सिंचाई के सही समय की सलाह।' : 'Soil moisture, ET, and the right time to irrigate.'],
    [Sprout, hi ? 'फसल पायलट' : 'Crop intelligence', hi ? 'फसल की अवस्था, स्वास्थ्य और मौसम से जुड़ी देखभाल।' : 'Crop stage, health, and weather-aware care.'],
    [ShieldCheck, hi ? 'जोखिम पायलट' : 'Risk intelligence', hi ? 'बाढ़, पाला, गर्मी और सूखे के लिए पहले चेतावनी।' : 'Early warnings for flood, frost, heat, and dry spells.'],
    [TrendingUp, hi ? 'बाज़ार पायलट' : 'Farm value', hi ? 'उपज, बीमा और बाज़ार की योजना के लिए निर्णय सहायता।' : 'Decision support for yield, insurance, and market planning.'],
  ] as const;

  return (
    <div className="plantiq-home">
      {/* 1. CINEMATIC HERO WITH VIDEO BACKGROUND */}
      <section className="plantiq-hero kisan-reference-hero" style={{ backgroundImage: `url(${heroAerial})` }}>
        <video
          className="hero-background-video"
          autoPlay
          muted
          loop
          playsInline
          poster={heroAerial}
          aria-hidden="true"
        >
          <source src="https://videos.pexels.com/video-files/7604198/7604198-hd_1920_1080_30fps.mp4" type="video/mp4" />
        </video>
        <div className="plantiq-hero-overlay" />
        <div className="plantiq-hero-content">
          <div className="reference-hero-copy">
            <span className="reference-kicker">
              <MapPin size={15} /> {location.panchayatName} · {hi ? 'कृषि इंटेलिजेंस' : 'Farm intelligence'}
            </span>
            <h1>Kisaan Ki Yash</h1>
            <p>
              {hi
                ? 'हर खेत के लिए स्थानीय मौसम, मिट्टी और AI से बेहतर खेती के फैसले।'
                : 'Growing resilient farms with hyperlocal weather, soil, and AI intelligence.'}
            </p>
            <div className="plantiq-hero-actions">
              <button onClick={() => navigate('/panchayat')} className="plantiq-primary">
                {hi ? 'अपना खेत जोड़ें' : 'Connect your farm'} <ChevronRight size={19} />
              </button>
              <Link to="/features" className="plantiq-secondary">
                {hi ? 'फीचर देखें' : 'Explore features'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. REAL-TIME TICKER BAR */}
      <section className="plantiq-ticker" aria-label="Real-time agricultural updates">
        <div>
          <span>🌾 {hi ? 'धान — अगले 24 घंटे बारिश की संभावना 84%' : 'Paddy — 84% chance of rain in 24 hours'} ✅</span>
          <span>💧 {hi ? 'आज सिंचाई रोकें — पानी और डीजल बचाएं' : 'Skip irrigation today — save water and diesel'} ✅</span>
          <span>🌱 {hi ? 'मलिहाबाद — मौसम अपडेट उपलब्ध' : 'Malihabad — weather update available'} 📈</span>
          <span>🛡️ {hi ? 'महत्वपूर्ण अलर्ट — सलाह देखें' : 'Important alert — view advice'} ⚠️</span>
          <span>🌾 {hi ? 'धान — अगले 24 घंटे बारिश की संभावना 84%' : 'Paddy — 84% chance of rain in 24 hours'} ✅</span>
          <span>💧 {hi ? 'आज सिंचाई रोकें — पानी और डीजल बचाएं' : 'Skip irrigation today — save water and diesel'} ✅</span>
          <span>🌱 {hi ? 'मलिहाबाद — मौसम अपडेट उपलब्ध' : 'Malihabad — weather update available'} 📈</span>
          <span>🛡️ {hi ? 'महत्वपूर्ण अलर्ट — सलाह देखें' : 'Important alert — view advice'} ⚠️</span>
        </div>
      </section>

      {/* 3. TODAY'S FARMER ACTION DECISION & AUDIO SECTION */}
      <section style={{ padding: '3rem clamp(1rem, 4vw, 3rem) 1rem', background: '#f8fafc' }}>
        <div className="plantiq-container">
          <div style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {hi ? 'दैनिक किसान निर्णय सहायता' : 'Daily Farmer Action Decision'}
              </span>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', margin: '2px 0 0' }}>
                {hi ? 'आज आपके खेत में क्या करना है?' : 'What to do in your field today?'}
              </h2>
            </div>
            <Link
              to="/decision-center"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#059669',
                textDecoration: 'none'
              }}
            >
              <span>{hi ? 'विस्तृत सलाह केंद्र' : 'Full Decision Center'}</span>
              <ChevronRight size={16} />
            </Link>
          </div>

          {/* Embedded Single-Screen Farmer Card */}
          <FarmerOneScreen />
        </div>
      </section>

      {/* 4. SAKSHI DIDI'S FERTILIZER ALARMING SYSTEM (1-WEEK ADVANCE WARNING) */}
      <section style={{ padding: '1rem clamp(1rem, 4vw, 3rem)', background: '#f8fafc' }}>
        <div className="plantiq-container">
          <FertilizerAlarmSystem />
        </div>
      </section>

      {/* 5. 10-MODEL SCIENTIFIC INTELLIGENCE CASCADE (M1–M10) */}
      <section style={{ padding: '1rem clamp(1rem, 4vw, 3rem)', background: '#ffffff' }}>
        <ModelCascadeGrid />
      </section>

      {/* 6. WHAT-IF DIGITAL TWIN SCENARIO SIMULATOR SANDBOX */}
      <section style={{ padding: '1rem clamp(1rem, 4vw, 3rem)', background: '#f8fafc' }}>
        <DigitalTwinSandbox />
      </section>

      {/* 7. KISAN INTELLIGENCE SUITE OVERVIEW */}
      <section className="kisan-intelligence-section">
        <div className="plantiq-container">
          <header className="kisan-intelligence-heading">
            <span>{hi ? 'किसान की यश इंटेलिजेंस सूट' : 'Kisaan Ki Yash intelligence suite'}</span>
            <h2>{hi ? <>हर खेत के लिए <em>समय पर सही फैसला</em></> : <>The right decision for <em>every field, on time.</em></>}</h2>
            <p>{hi ? 'मौसम से लेकर सिंचाई, फसल सुरक्षा और बाज़ार तक - एक ही जगह पर पूरी खेती की जानकारी।' : 'From weather to irrigation, crop protection, and market readiness - one connected farm view.'}</p>
          </header>
          <div className="kisan-module-grid">
            {solutionModules.map(([Icon, title, detail]) => (
              <motion.article key={title} whileHover={{ y: -8 }}>
                <span><Icon /></span>
                <h3>{title}</h3>
                <p>{detail}</p>
                <Link to="/features">{hi ? 'जानें' : 'Explore'} <ChevronRight size={15} /></Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* 8. SOIL TO SKY FIELD SECTION */}
      <section className="kisan-field-section">
        <div className="plantiq-container">
          <div className="kisan-field-copy">
            <span>{hi ? 'एक प्लेटफॉर्म, दो शक्तियां' : 'One platform, two strengths'}</span>
            <h2>{hi ? <>ज़मीन से <em>आसमान तक</em> खेती की समझ।</> : <>Farm intelligence from <em>soil to sky.</em></>}</h2>
            <p>{hi ? '1-किमी मौसम मॉडल, उपग्रह संकेत, मिट्टी की जानकारी और स्थानीय कृषि ज्ञान मिलकर आपके लिए सरल सलाह बनाते हैं।' : '1-km weather models, satellite signals, soil data, and local agronomy combine into simple guidance.'}</p>
          </div>
          <div className="kisan-field-cards">
            <article>
              <span>01</span>
              <h3>{hi ? 'खुले खेत की खेती' : 'Open-field farming'}</h3>
              <p>{hi ? 'बारिश, मिट्टी, सिंचाई, स्प्रे और कटाई की तैयारी।' : 'Rain, soil, irrigation, spray timing, and harvest readiness.'}</p>
              <ul>
                <li>{hi ? '1-किमी मौसम और बारिश' : '1-km weather & rain'}</li>
                <li>{hi ? 'फसल और खतरे के अलर्ट' : 'Crop & hazard alerts'}</li>
                <li>{hi ? 'सिंचाई और उर्वरक सलाह' : 'Irrigation & nutrient advice'}</li>
              </ul>
            </article>
            <article>
              <span>02</span>
              <h3>{hi ? 'सुरक्षित कृषि निर्णय' : 'Resilient farm planning'}</h3>
              <p>{hi ? 'मौसम के जोखिम से पहले योजना बनाकर नुकसान कम करें।' : 'Plan before weather risks turn into farm losses.'}</p>
              <ul>
                <li>{hi ? 'पाला, गर्मी और बाढ़ चेतावनी' : 'Frost, heat & flood warning'}</li>
                <li>{hi ? 'बीमा प्रमाण रिपोर्ट' : 'Insurance-ready evidence'}</li>
                <li>{hi ? 'उपज और बाज़ार की तैयारी' : 'Yield & market readiness'}</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* 9. HOW IT WORKS */}
      <section className="plantiq-dark-section">
        <div className="plantiq-container">
          <header className="plantiq-section-header">
            <h2>{hi ? <>यह कैसे <em>काम करता है</em></> : <>How it <em>works</em></>}</h2>
            <p>{hi ? 'तीन आसान कदमों में अपने खेत की रोज़ की सलाह पाएं।' : 'Get daily farm guidance in three simple steps.'}</p>
          </header>
          <div className="plantiq-steps">
            {steps.map(([number, title, detail]) => (
              <motion.article key={number} whileHover={{ y: -9 }}>
                <b>{number}</b>
                <h3>{title}</h3>
                <p>{detail}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* 10. POWERFUL FEATURES GRID */}
      <section className="plantiq-feature-section">
        <div className="plantiq-container">
          <header className="plantiq-section-header">
            <h2>{hi ? <><em>शक्तिशाली</em> फीचर</> : <><em>Powerful</em> features</>}</h2>
            <p>{hi ? 'खेत के हर बड़े फैसले के लिए एक साफ़ UI।' : 'A clear interface for every important farm decision.'}</p>
          </header>
          <div className="plantiq-feature-grid">
            {features.map(([Icon, title, detail]) => (
              <motion.article key={title} whileHover={{ y: -10, scale: 1.02 }}>
                <span><Icon /></span>
                <h3>{title}</h3>
                <p>{detail}</p>
              </motion.article>
            ))}
          </div>
          <Link to="/features" className="plantiq-all-features">
            {hi ? 'सभी फीचर देखें' : 'View all features'} <ChevronRight size={17} />
          </Link>
        </div>
      </section>

      {/* 11. CALL TO ACTION */}
      <section className="plantiq-cta">
        <div>
          <Leaf size={35} />
          <h2>{hi ? 'आज से बेहतर खेती शुरू करें' : 'Start farming smarter today'}</h2>
          <p>{hi ? 'अपने खेत के लिए समय पर सलाह, मौसम की जानकारी और जोखिम अलर्ट पाएं।' : 'Get timely farm advice, weather intelligence, and risk alerts.'}</p>
          <button onClick={() => navigate('/panchayat')}>
            {hi ? 'अपनी पंचायत देखें' : 'Open Panchayat view'} <ChevronRight size={18} />
          </button>
        </div>
      </section>
    </div>
  );
};
