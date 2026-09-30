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
  Layers,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import heroAerial from '../../assets/images/kisaan-aerial-hero.png';
import { AgroWarpBackground } from '../components/cinematic/AgroWarpBackground';
import { FarmerPinpointHub } from '../components/farmer/FarmerPinpointHub';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { language, location } = useApp();
  const hi = language === 'hi';

  const solutionModules = [
    [
      Droplets,
      hi ? 'जल सेतु (Water Intelligence)' : 'Water Intelligence',
      hi ? 'मिट्टी की नमी, वाष्पीकरण और सिंचाई के सही समय की सटीक सलाह।' : 'Root-zone moisture, ET budget, and precision irrigation timing.',
      '/irrigation'
    ],
    [
      Sprout,
      hi ? 'फसल सेतु (Crop Intelligence)' : 'Crop Intelligence',
      hi ? 'सेंटिनल-2 उपग्रह से फसल की अवस्था, स्वास्थ्य व पोषक तत्व मार्गदर्शन।' : 'Sentinel-2 phenology tracking, health index, and nutrient guidance.',
      '/agriculture'
    ],
    [
      ShieldCheck,
      hi ? 'जोखिम सेतु (Risk Intelligence)' : 'Risk Intelligence',
      hi ? 'बाढ़, पाला, लू और सूखे की 7-दिन पहले अग्रिम चेतावनी व बचाव।' : 'Early warnings for flood, frost, heat waves, and waterlogging.',
      '/hazards'
    ],
    [
      Layers,
      hi ? 'डिजिटल ट्विन (Digital Twin 3D)' : 'Digital Twin 3D',
      hi ? 'आपके गांव और खेत का 3D भौतिकी-आधारित सिमुलेशन मॉडल।' : 'Physics-informed 3D simulation of village terrain & microclimates.',
      '/digital-twin'
    ],
  ] as const;

  const steps = [
    [
      '01',
      hi ? 'अपना गांव व खेत चुनें' : 'Select Village & Plot',
      hi ? 'मलिहाबाद या अपनी पंचायत का चयन करें और अपनी मुख्य फसल जोड़ें।' : 'Choose your Panchayat block and add your primary crop.'
    ],
    [
      '02',
      hi ? 'AI खेत के संकेत पढ़ता है' : 'AI Reads Ground Signals',
      hi ? 'स्थानीय AWS मौसम स्टेशन और उपग्रह से मिट्टी-हवा का 1-किमी डेटा प्राप्त होता है।' : '1-km downscaled weather, soil physics, and terrain data sync together.'
    ],
    [
      '03',
      hi ? 'आज का सटीक फैसला पाएं' : 'Get Action Advice Today',
      hi ? 'आज सिंचाई करनी है या नहीं, कब खाद डालना है — साफ़ व स्पष्ट कदम देखें।' : 'Clear, actionable daily instructions: whether to pump, spray, or harvest.'
    ],
  ];

  const features = [
    [
      Brain,
      hi ? 'AI कृषि निर्णय सलाह' : 'AI Farm Decision Support',
      hi ? 'हर सुबह आपके खेत के लिए एक स्पष्ट और प्रमाणित अगला कदम।' : 'One clear, scientifically verified next step for your field every morning.'
    ],
    [
      Droplets,
      hi ? 'स्मार्ट सिंचाई व नमी' : 'Precision Irrigation',
      hi ? 'बारिश से पहले अनावश्यक ट्यूबवेल रोकें, पानी और बिजली का खर्च बचाएं।' : 'Hold groundwater pumping before rain, saving diesel and electricity.'
    ],
    [
      TrendingUp,
      hi ? 'उपज व फसल स्वास्थ्य' : 'Yield Outlook & NDVI',
      hi ? 'उपग्रह वनस्पति सूचकांक से फसल के स्वास्थ्य की वास्तविक निगरानी।' : 'Plan ahead with satellite vegetation indices and growing degree days.'
    ],
    [
      Sprout,
      hi ? 'फसल अवस्था ट्रैकिंग' : 'Crop Stage Tracking',
      hi ? 'फसल की वर्तमान अवस्था (टिलरिंग, फ्लावरिंग) के अनुसार पोषण की सलाह।' : 'Understand phenological stages and exact nutrient demand curves.'
    ],
    [
      Bell,
      hi ? 'समय पर मौसम अलर्ट' : 'Timely Weather Alerts',
      hi ? 'आंधी, भारी वर्षा, पाला और कीट प्रकोप की पहले से सीधी चेतावनी।' : 'Early warnings for cloudbursts, frost, heat stress, and pest windows.'
    ],
    [
      Cloud,
      hi ? '1-किमी स्थानीय पूर्वानुमान' : '1-km Village Weather',
      hi ? 'सामान्य ज़िला पूर्वानुमान नहीं, आपके गांव की स्थलाकृति आधारित मौसम।' : 'Hyperlocal 1-km forecasting calibrated to local elevation and slope.'
    ],
  ] as const;

  return (
    <div className="plantiq-home" style={{ position: 'relative', overflowX: 'hidden' }}>
      {/* 0. LUMA-STYLE AGRO-WARP CINEMATIC BACKGROUND (Golden wheat + emerald chlorophyll + rain cyan rays & bio-spores) */}
      <AgroWarpBackground speedMultiplier={1} rayCount={52} particleCount={90} />

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
          <motion.div
            className="reference-hero-copy"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="reference-kicker">
              <MapPin size={15} /> {location.panchayatName} · {hi ? 'मौसम सेतु कृषि इंटेलिजेंस' : 'Mausam Setu Climate Intelligence'}
            </span>
            <h1>Mausam Setu</h1>
            <p>
              {hi
                ? 'हर खेत के लिए 1-किमी स्थानीय मौसम, उपग्रह मिट्टी व AI से समय पर सटीक खेती के फैसले।'
                : 'Connecting Indian agriculture with 1-km hyperlocal weather, satellite soil telemetry, and predictive AI.'}
            </p>
            <div className="plantiq-hero-actions">
              <a
                href="#farmer-hub"
                className="plantiq-primary"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('farmer-hub')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {hi ? 'आज का सीधा फैसला देखें' : 'Today Field Decision'} <ChevronRight size={19} />
              </a>
              <button onClick={() => navigate('/panchayat')} className="plantiq-secondary">
                {hi ? 'मेरी पंचायत ग्रिड' : 'Panchayat Grid'}
              </button>
              <Link to="/digital-twin" className="plantiq-secondary">
                {hi ? 'डिजिटल ट्विन 3D' : 'Digital Twin 3D'}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. REAL-TIME TICKER BAR */}
      <section className="plantiq-ticker" aria-label="Real-time agricultural updates">
        <div>
          <span>🌾 {hi ? 'धान — अगले 24 घंटे में 12.4 मिमी बारिश की संभावना (84%)' : 'Paddy — 84% probability of 12.4 mm rain in next 24h'} ✅</span>
          <span>💧 {hi ? 'आज ट्यूबवेल सिंचाई रोकें — पानी व डीजल बचाएं' : 'Skip irrigation today — save groundwater and power'} ✅</span>
          <span>🌱 {hi ? 'मलिहाबाद ब्लॉक — 48 सेक्टर 1-किमी ग्रिड सक्रिय' : 'Malihabad Block — 48 Hyperlocal 1-km sectors active'} 📈</span>
          <span>🛡️ {hi ? 'शाम से पहले खेत की जल निकासी नाली साफ करें' : 'Action advice: Clear field drainage outlets before evening'} ⚠️</span>
          <span>🌾 {hi ? 'धान — अगले 24 घंटे में 12.4 मिमी बारिश की संभावना (84%)' : 'Paddy — 84% probability of 12.4 mm rain in next 24h'} ✅</span>
          <span>💧 {hi ? 'आज ट्यूबवेल सिंचाई रोकें — पानी व डीजल बचाएं' : 'Skip irrigation today — save groundwater and power'} ✅</span>
          <span>🌱 {hi ? 'मलिहाबाद ब्लॉक — 48 सेक्टर 1-किमी ग्रिड सक्रिय' : 'Malihabad Block — 48 Hyperlocal 1-km sectors active'} 📈</span>
          <span>🛡️ {hi ? 'शाम से पहले खेत की जल निकासी नाली साफ करें' : 'Action advice: Clear field drainage outlets before evening'} ⚠️</span>
        </div>
      </section>

      {/* 3. PINPOINT FARMER DECISION HUB (Zero-clutter, Animated Cards, Right-side Vertical Tabs) */}
      <section
        id="farmer-hub"
        style={{
          position: 'relative',
          zIndex: 10,
          padding: '2.5rem 0 3.5rem',
          background: 'transparent'
        }}
      >
        <FarmerPinpointHub />
      </section>

      {/* 4. MAUSAM SETU INTELLIGENCE SUITE OVERVIEW */}
      <section className="kisan-intelligence-section" style={{ position: 'relative', zIndex: 10 }}>
        <div className="plantiq-container">
          <motion.header
            className="kisan-intelligence-heading"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55 }}
          >
            <span>{hi ? 'मौसम सेतु इंटेलिजेंस सुइट' : 'Mausam Setu Intelligence Suite'}</span>
            <h2>
              {hi ? (
                <>हर खेत के लिए <em>समय पर सही फैसला</em></>
              ) : (
                <>The right farm decision for <em>every field, on time.</em></>
              )}
            </h2>
            <p>
              {hi
                ? 'मौसम से लेकर सिंचाई, फसल सुरक्षा, डिजिटल ट्विन और जोखिम चेतावनी — सब कुछ एक ही मंच पर।'
                : 'From hyperlocal weather to precision irrigation, crop protection, 3D digital twins, and hazard warnings.'}
            </p>
          </motion.header>

          <div className="kisan-module-grid">
            {solutionModules.map(([Icon, title, detail, linkUrl], idx) => (
              <motion.article
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.45, delay: idx * 0.1 }}
                whileHover={{ y: -8, scale: 1.015 }}
              >
                <span><Icon /></span>
                <h3>{title}</h3>
                <p>{detail}</p>
                <Link to={linkUrl}>
                  {hi ? 'देखें' : 'Open View'} <ChevronRight size={15} />
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SOIL TO SKY FIELD SECTION */}
      <section className="kisan-field-section">
        <div className="plantiq-container">
          <motion.div
            className="kisan-field-copy"
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55 }}
          >
            <span>{hi ? 'ज़मीन से आसमान तक जुड़ाव' : 'Soil to Sky Telemetry'}</span>
            <h2>
              {hi ? (
                <>ज़मीन से <em>आसमान तक</em> खेती की समझ।</>
              ) : (
                <>Farm intelligence from <em>soil to sky.</em></>
              )}
            </h2>
            <p>
              {hi
                ? '1-किमी मौसम मॉडल, सेंटिनल-2 उपग्रह संकेत, मिट्टी के सेंसर और स्थानीय कृषि विज्ञान मिलकर सरल और उपयोगी सलाह बनाते हैं।'
                : '1-km downscaled meteorological models, satellite observations, and soil sensors combine into clear farmer advice.'}
            </p>
          </motion.div>

          <div className="kisan-field-cards">
            <motion.article
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -6 }}
            >
              <span>01</span>
              <h3>{hi ? 'सटीक कृषि निर्णय' : 'Field Operations Guidance'}</h3>
              <p>
                {hi
                  ? 'बारिश, मिट्टी की नमी, सिंचाई, कीटनाशक स्प्रे और कटाई की तैयारी।'
                  : 'Actionable timing for irrigation pumping, spray windows, and harvesting.'}
              </p>
              <ul>
                <li>{hi ? '1-किमी स्थानीय बारिश व तापमान' : '1-km hyperlocal precipitation'}</li>
                <li>{hi ? 'फसल सुरक्षा व जोखिम अलर्ट' : 'Crop protection & hazard warnings'}</li>
                <li>{hi ? 'सिंचाई व यूरिया/डीएपी पोषण सलाह' : 'Irrigation & nutrient timing advice'}</li>
              </ul>
            </motion.article>

            <motion.article
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: 0.15 }}
              whileHover={{ y: -6 }}
            >
              <span>02</span>
              <h3>{hi ? 'जलवायु जोखिम सुरक्षा' : 'Climate Risk Resilience'}</h3>
              <p>
                {hi
                  ? 'मौसम की चरम घटनाओं से पहले सतर्क रहकर अपनी फसल का नुकसान बचाएं।'
                  : 'Early detection of flood, unseasonal rain, frost, and heatwaves.'}
              </p>
              <ul>
                <li>{hi ? 'जलभराव व बाढ़ की पूर्व चेतावनी' : 'Waterlogging & flood early warnings'}</li>
                <li>{hi ? 'पाला व अत्यधिक गर्मी का अलर्ट' : 'Frost and heatwave advisory'}</li>
                <li>{hi ? 'फसल बीमा हेतु मौसम साक्ष्य' : 'Parametric insurance evidence telemetry'}</li>
              </ul>
            </motion.article>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS (3 SIMPLE STEPS) */}
      <section className="plantiq-dark-section">
        <div className="plantiq-container">
          <motion.header
            className="plantiq-section-header"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55 }}
          >
            <h2>
              {hi ? (
                <>यह कैसे <em>काम करता है</em></>
              ) : (
                <>How <em>Mausam Setu</em> works</>
              )}
            </h2>
            <p>
              {hi
                ? 'तीन आसान चरणों में अपने खेत के लिए सटीक व वैज्ञानिक मार्गदर्शन प्राप्त करें।'
                : 'Get daily actionable farm intelligence in three simple steps.'}
            </p>
          </motion.header>

          <div className="plantiq-steps">
            {steps.map(([number, title, detail], idx) => (
              <motion.article
                key={number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.45, delay: idx * 0.12 }}
                whileHover={{ y: -9 }}
              >
                <b>{number}</b>
                <h3>{title}</h3>
                <p>{detail}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* 6. POWERFUL FEATURES GRID */}
      <section className="plantiq-feature-section">
        <div className="plantiq-container">
          <motion.header
            className="plantiq-section-header"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55 }}
          >
            <h2>
              {hi ? (
                <><em>शक्तिशाली</em> सुविधाएं</>
              ) : (
                <><em>Powerful</em> features</>
              )}
            </h2>
            <p>
              {hi
                ? 'भारतीय किसानों के लिए बनाया गया सबसे सहज व वैज्ञानिक इंटरफ़ेस।'
                : 'State-of-the-art climate intelligence made simple for farmers and scientists alike.'}
            </p>
          </motion.header>

          <div className="plantiq-feature-grid">
            {features.map(([Icon, title, detail], idx) => (
              <motion.article
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.45, delay: (idx % 3) * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <span><Icon /></span>
                <h3>{title}</h3>
                <p>{detail}</p>
              </motion.article>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Link to="/features" className="plantiq-all-features">
              {hi ? 'सभी 32 वैज्ञानिक फीचर देखें' : 'View all 32 platform features'} <ChevronRight size={17} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 7. CALL TO ACTION */}
      <section className="plantiq-cta">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <Leaf size={38} />
          <h2>{hi ? 'मौसम सेतु के साथ सुरक्षित खेती शुरू करें' : 'Start Resilient Farming with Mausam Setu'}</h2>
          <p>
            {hi
              ? 'अपने गांव की पंचायत ग्रिड, उपग्रह मिट्टी नमी व मौसम अलर्ट का सीधा लाभ उठाएं।'
              : 'Access hyperlocal Panchayat weather grids, satellite root-zone moisture, and AI crop advice.'}
          </p>
          <button onClick={() => navigate('/panchayat')}>
            {hi ? 'अपनी पंचायत देखें' : 'Open Panchayat View'} <ChevronRight size={18} />
          </button>
        </motion.div>
      </section>
    </div>
  );
};
