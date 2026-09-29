import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { TubesBackground } from '../components/cinematic/TubesBackground';
import { KisanIntelligenceCore } from '../components/ai/KisanIntelligenceCore';
import { HeroScrollStory } from '../components/cinematic/HeroScrollStory';
import { Landscape3DScene } from '../components/digitalTwin/Landscape3DScene';
import { StatusBadge } from '../components/common/StatusBadge';
import { ScientificDrawer } from '../components/common/ScientificDrawer';
import {
  CloudSun,
  Droplet,
  Sprout,
  Satellite,
  Compass,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  CheckCircle2,
  TrendingDown,
  Volume2,
  AlertTriangle,
  Play,
  Sparkles,
  Radio,
  Wind,
  BellRing,
  MousePointer2
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { language, speakText, isSpeaking } = useApp();
  const [activeDataStream, setActiveDataStream] = useState<number>(0);

  const dataStreams = [
    {
      id: 0,
      titleHi: '1. मौसम भौतिकी (Atmospheric Physics)',
      titleEn: '1-km Weather Downscaling',
      icon: <CloudSun size={26} color="#B6B243" />,
      tag: 'M1 & M3 Operational',
      imageBg: '/assets/cinematic/monsoon_clouds.jpg',
      descHi: 'सतह तापमान (T2m), आर्द्रता, सौर विकिरण व हवा की गति को 1 किमी सटीकता में गणना करना।',
      descEn: 'High-resolution surface air temperature, vapor pressure deficit, and shortwave solar irradiance downscaled to 1-km grid.'
    },
    {
      id: 1,
      titleHi: '2. उपग्रह रडार (Satellite SAR)',
      titleEn: 'Microwave Radar Observation',
      icon: <Satellite size={26} color="#38bdf8" />,
      tag: 'Sentinel-1 Constellation',
      imageBg: '/assets/cinematic/satellite_grid.jpg',
      descHi: 'बादलों के पार देखने वाला सिंथेटिक एपर्चर रडार (SAR) जो मिट्टी की नमी का सटीक अवलोकन करता है।',
      descEn: 'Cloud-penetrating Synthetic Aperture Radar (SAR) backscatter sensitive to dielectric soil properties.'
    },
    {
      id: 2,
      titleHi: '3. भू-आकृति एवं ढलान (DEM Terrain)',
      titleEn: 'Micro-Topography & Aspect',
      icon: <Layers size={26} color="#D7CE93" />,
      tag: 'Copernicus 30m GLO',
      imageBg: '/assets/cinematic/farm_golden_hour.jpg',
      descHi: '30 मीटर भूभाग ऊंचाई मॉडल से पानी के बहाव, ढलान और प्राकृतिक जलभराव क्षेत्रों की पहचान।',
      descEn: 'High-resolution digital elevation modeling computing topographic wetness index and slope aspect.'
    },
    {
      id: 3,
      titleHi: '4. जड़ क्षेत्र नमी (Root-Zone Soil)',
      titleEn: '0–30 cm Soil Moisture (VWC)',
      icon: <Droplet size={26} color="#658665" />,
      tag: 'Soil Hydrology Model',
      imageBg: '/assets/cinematic/farm_golden_hour.jpg',
      descHi: 'खेत की सतह से लेकर पौधों की जड़ों तक मौजूद पानी का सटीक प्रतिशत (VWC %)।',
      descEn: 'Dynamic soil moisture depth profiling tracking volumetric water content against crop wilting points.'
    },
    {
      id: 4,
      titleHi: '5. फसल स्थिति (Crop Phenology)',
      titleEn: 'Vegetation & Physiological Stage',
      icon: <Sprout size={26} color="#B6B243" />,
      tag: 'Growing Degree Days (GDD)',
      imageBg: '/assets/cinematic/monsoon_clouds.jpg',
      descHi: 'बुवाई की तारीख, विकास अवस्था (वानस्पतिक, पुष्पन, परिपक्वता) और जल तनाव संवेदनशीलता।',
      descEn: 'Thermal-time phenology models tracking critical crop water stress susceptibility windows.'
    }
  ];

  return (
    <div style={{ position: 'relative', overflowX: 'hidden', backgroundColor: 'var(--farmora-dark)' }}>
      {/* ==============================================================
          SECTION 1: 3D INTERACTIVE TUBES CURSOR HERO (Farmora Agritech)
          ============================================================== */}
      <section style={{ position: 'relative', minHeight: '94vh', overflow: 'hidden' }}>
        <TubesBackground minHeight="94vh" className="w-full">
          <div
            style={{
              maxWidth: '1000px',
              margin: '0 auto',
              padding: '6rem 1.5rem 3rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              minHeight: '85vh',
              pointerEvents: 'auto'
            }}
          >
            {/* Top Live Sensor Status Chip */}
            <div
              className="farmora-glass"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '7px 18px',
                borderRadius: 'var(--radius-full)',
                marginBottom: '1.75rem',
                border: '1px solid rgba(182, 178, 67, 0.4)',
                boxShadow: '0 0 20px rgba(182, 178, 67, 0.25)'
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#B6B243',
                  boxShadow: '0 0 8px #B6B243',
                  animation: 'kisanPulse 2s infinite'
                }}
              />
              <span style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--farmora-lime)', letterSpacing: '0.05em' }}>
                LIVE CLIMATE CASCADE • LUCKNOW 1-KM GRID ACTIVE
              </span>
            </div>

            {/* Living SVG Kisan Intelligence Core */}
            <div style={{ marginBottom: '1.75rem', filter: 'drop-shadow(0 0 25px rgba(182, 178, 67, 0.5))' }}>
              <KisanIntelligenceCore size="hero" state="FORECASTING" showLabel={true} />
            </div>

            {/* Main Title */}
            <h1
              style={{
                fontSize: 'clamp(2.8rem, 6.5vw, 5.2rem)',
                fontWeight: 900,
                color: 'var(--farmora-light)',
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
                marginBottom: '1rem',
                textShadow: '0 4px 30px rgba(0, 0, 0, 0.9)'
              }}
            >
              Kisaan Ki Yash
              <span
                style={{
                  display: 'block',
                  fontSize: 'clamp(2rem, 4.8vw, 3.4rem)',
                  fontWeight: 800,
                  color: 'var(--farmora-lime)',
                  marginTop: '6px',
                  textShadow: '0 0 30px var(--farmora-lime-glow)'
                }}
              >
                किसान की यश
              </span>
            </h1>

            {/* Hero Subtitle */}
            <p
              style={{
                fontSize: 'clamp(1.15rem, 2.3vw, 1.4rem)',
                color: 'var(--farmora-platinum)',
                maxWidth: '740px',
                margin: '0 auto 2.25rem auto',
                lineHeight: 1.6,
                fontWeight: 500,
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)'
              }}
            >
              {language === 'hi' ? (
                <>
                  अंतरिक्ष से मिट्टी की जड़ों तक।
                  <br />
                  <strong style={{ color: 'var(--farmora-wheat)' }}>
                    हर 1 किमी खेत के लिए सटीक भौतिक मौसम और सही कृषि निर्णय।
                  </strong>
                </>
              ) : (
                <>
                  From synoptic orbit down to individual root zones.
                  <br />
                  <strong style={{ color: 'var(--farmora-wheat)' }}>
                    Precision agricultural climate intelligence & actionable farmer decisions.
                  </strong>
                </>
              )}
            </p>

            {/* CTA Button Row */}
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2.5rem' }}>
              <button
                onClick={() => navigate('/my-farm')}
                className="farmora-btn-primary"
                style={{
                  padding: '14px 32px',
                  fontSize: '1rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <span>{language === 'hi' ? 'खेत का निर्णय देखें (My Farm)' : 'Open Field Cockpit'}</span>
                <ArrowRight size={18} />
              </button>

              <button
                onClick={() => navigate('/digital-twin')}
                className="farmora-btn-secondary"
                style={{
                  padding: '14px 28px',
                  fontSize: '0.98rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Layers size={18} color="var(--farmora-lime)" />
                <span>3D Digital Twin</span>
              </button>
            </div>

            {/* Interactive Tubes Hint */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: 'rgba(215, 206, 147, 0.8)',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                animation: 'pulseGlowLime 3s infinite'
              }}
            >
              <MousePointer2 size={14} />
              <span>Interactive 3D Tubes: Move cursor to steer • Click anywhere to cycle color palettes</span>
            </div>
          </div>
        </TubesBackground>
      </section>

      {/* ==============================================================
          SECTION 2: REAL FARMER DECISION HIGHLIGHT BANNER
          ============================================================== */}
      <section style={{ maxWidth: '1240px', margin: '-2rem auto 4rem auto', padding: '0 1.5rem', position: 'relative', zIndex: 10 }}>
        <div
          className="farmora-glass-elevated"
          style={{
            padding: '2.5rem',
            borderRadius: 'var(--radius-xl)',
            border: '2px solid rgba(182, 178, 67, 0.45)',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="badge badge-frozen">REAL VERIFIED ADVISORY</span>
              <span style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--farmora-wheat)' }}>
                LOCATION: LUCKNOW MOHANLALGANJ (UTM 44N)
              </span>
            </div>

            <button
              onClick={() =>
                speakText(
                  language === 'hi'
                    ? 'किसान भाई, आज दोपहर दो बजे से शाम छह बजे के बीच बारिश की प्रबल संभावना है। सिंचाई रोकें, इससे चार सौ रुपये की बिजली और जल की बचत होगी।'
                    : 'Farmer advisory: Hold irrigation today between 2 PM and 6 PM. Heavy convective showers expected, saving fuel and water.'
                )
              }
              className="farmora-btn-secondary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 18px',
                fontSize: '0.84rem'
              }}
            >
              <Volume2 size={16} color="var(--farmora-lime)" />
              <span>{isSpeaking ? 'Listening...' : 'Play Voice Audio'}</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1.6fr) minmax(240px, 1fr)', gap: '2rem', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '1.15rem', color: '#38bdf8', fontWeight: 700, marginBottom: '6px' }}>
                🌧️ आज 14:00 से 18:00 के बीच वर्षा संभावित (84% Probability)
              </div>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)', color: 'var(--farmora-lime)', fontWeight: 900, lineHeight: 1.2, marginBottom: '10px' }}>
                “आज सिंचाई स्थगित रखें — ट्यूबवेल न चलाएं”
              </h2>
              <p style={{ fontSize: '1.05rem', color: 'var(--farmora-platinum)', lineHeight: 1.6 }}>
                जड़ों के पास 31% नमी विद्यमान है। आज ट्यूबवेल रोकने से 40% भूमिगत जल और लगभग ₹350 प्रति एकड़ की बिजली/डीजल लागत बचेगी।
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ background: 'rgba(12, 13, 5, 0.75)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(182, 178, 67, 0.25)' }}>
                <div style={{ color: 'var(--farmora-platinum)', fontSize: '0.75rem', fontWeight: 700 }}>VERIFIED REDUCTION</div>
                <div style={{ color: 'var(--farmora-lime)', fontSize: '1.8rem', fontWeight: 900, marginTop: '2px' }}>39.89%</div>
                <div style={{ color: 'var(--farmora-wheat)', fontSize: '0.72rem' }}>vs Raw NWP Grid</div>
              </div>

              <div style={{ background: 'rgba(12, 13, 5, 0.75)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(182, 178, 67, 0.25)' }}>
                <div style={{ color: 'var(--farmora-platinum)', fontSize: '0.75rem', fontWeight: 700 }}>HURDLE RAIN RMSE</div>
                <div style={{ color: '#38bdf8', fontSize: '1.8rem', fontWeight: 900, marginTop: '2px' }}>0.9725</div>
                <div style={{ color: 'var(--farmora-wheat)', fontSize: '0.72rem' }}>M3 Two-Stage Model</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==============================================================
          SECTION 3: SIGNATURE EARTH TO FIELD NARRATIVE
          ============================================================== */}
      <section style={{ maxWidth: '1240px', margin: '0 auto 5rem auto', padding: '0 1.5rem' }}>
        <HeroScrollStory />
      </section>

      {/* ==============================================================
          SECTION 4: 5-LAYER MULTIMODAL SYNOPTIC VIEWER
          ============================================================== */}
      <section style={{ maxWidth: '1240px', margin: '0 auto 5rem auto', padding: '0 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span className="badge badge-pilot" style={{ marginBottom: '10px' }}>
            5-TIER SCIENTIFIC INTELLIGENCE
          </span>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', color: 'var(--farmora-light)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '8px' }}>
            पांच स्तरीय अवलोकन संरचना (5-Layer Cascade)
          </h2>
          <p style={{ color: 'var(--farmora-platinum)', fontSize: '1.05rem', maxWidth: '680px', margin: '0 auto' }}>
            मौसम केवल बादलों का नाम नहीं है। यह सौर ऊर्जा, उपग्रह रडार, भू-आकृति, और मिट्टी का संयुक्त भौतिक तंत्र है।
          </p>
        </div>

        {/* 5 Layer Clickable Tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '2rem' }}>
          {dataStreams.map((stream, idx) => (
            <button
              key={stream.id}
              onClick={() => setActiveDataStream(idx)}
              className="card-hover-tilt"
              style={{
                padding: '16px',
                borderRadius: 'var(--radius-lg)',
                background: activeDataStream === idx ? 'rgba(182, 178, 67, 0.15)' : 'rgba(22, 24, 10, 0.85)',
                border: activeDataStream === idx ? '2px solid var(--farmora-lime)' : '1px solid rgba(182, 178, 67, 0.25)',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                boxShadow: activeDataStream === idx ? '0 0 25px rgba(182, 178, 67, 0.3)' : 'none'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {stream.icon}
                <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--farmora-wheat)', fontWeight: 700 }}>
                  {stream.tag}
                </span>
              </div>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: activeDataStream === idx ? 'var(--farmora-lime)' : 'var(--farmora-light)' }}>
                {stream.titleHi}
              </div>
            </button>
          ))}
        </div>

        {/* Selected Layer Visual Screen */}
        <div
          className="farmora-glass-elevated"
          style={{
            borderRadius: 'var(--radius-xl)',
            padding: '2.5rem',
            display: 'grid',
            gridTemplateColumns: 'minmax(280px, 1.2fr) minmax(260px, 1fr)',
            gap: '2.5rem',
            alignItems: 'center'
          }}
        >
          <div
            style={{
              position: 'relative',
              aspectRatio: '16/10',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              border: '1.5px solid rgba(182, 178, 67, 0.35)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)'
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url(${dataStreams[activeDataStream].imageBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'brightness(0.7) contrast(115%)'
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle at center, transparent 30%, rgba(12, 13, 5, 0.8) 100%)'
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '14px',
                left: '14px',
                right: '14px',
                background: 'rgba(12, 13, 5, 0.85)',
                backdropFilter: 'blur(10px)',
                padding: '8px 14px',
                borderRadius: '8px',
                color: 'var(--farmora-wheat)',
                fontSize: '0.78rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                border: '1px solid rgba(182, 178, 67, 0.3)'
              }}
            >
              ACTIVE SENSOR STREAM: {dataStreams[activeDataStream].tag}
            </div>
          </div>

          <div>
            <span className="badge badge-frozen" style={{ marginBottom: '12px' }}>
              CASCADE LAYER 0{activeDataStream + 1}
            </span>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--farmora-light)', marginBottom: '12px' }}>
              {dataStreams[activeDataStream].titleHi}
            </h3>
            <p style={{ fontSize: '1.05rem', color: 'var(--farmora-platinum)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              {dataStreams[activeDataStream].descHi}
            </p>
            <p style={{ fontSize: '0.88rem', color: 'var(--farmora-wheat)', lineHeight: 1.5, fontFamily: 'var(--font-mono)' }}>
              {dataStreams[activeDataStream].descEn}
            </p>
          </div>
        </div>
      </section>

      {/* ==============================================================
          SECTION 5: FERTILIZER ALARMING SYSTEM (Farmer Economic Impact)
          ============================================================== */}
      <section style={{ maxWidth: '1240px', margin: '0 auto 5rem auto', padding: '0 1.5rem' }}>
        <div
          className="farmora-glass-elevated"
          style={{
            padding: '2.5rem',
            borderRadius: 'var(--radius-xl)',
            background: 'linear-gradient(135deg, rgba(22, 24, 10, 0.9) 0%, rgba(35, 30, 15, 0.85) 100%)',
            border: '2px solid rgba(215, 206, 147, 0.4)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: 'rgba(182, 178, 67, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--farmora-lime)'
              }}
            >
              <BellRing size={22} color="var(--farmora-lime)" />
            </div>
            <div>
              <span className="badge badge-pilot">NEW FARMER PROTECTION FEATURE</span>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--farmora-light)', marginTop: '2px' }}>
                उर्वरक अलार्मिंग प्रणाली (Fertilizer Alarming System)
              </h3>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1.4fr) minmax(240px, 1fr)', gap: '2rem', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '1.02rem', color: 'var(--farmora-platinum)', lineHeight: 1.6, marginBottom: '1rem' }}>
                बारिश से ठीक पहले यूरिया या डीएपी डालने से सारा खाद बह जाता है। हमारा सिस्टम किसान को <strong>1 सप्ताह पहले</strong> आगाह करता है:
                <em style={{ color: 'var(--farmora-wheat)', display: 'block', marginTop: '6px' }}>
                  “आपके क्षेत्र में 6 दिन बाद 35mm वर्षा संभावित है — अभी खाद न डालें, खाद बहने से ₹800 प्रति बीघा की हानि होगी।”
                </em>
              </p>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Link
                  to="/advice"
                  className="farmora-btn-primary"
                  style={{
                    padding: '10px 22px',
                    fontSize: '0.88rem',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>अलर्ट सिस्टम देखें</span>
                  <ArrowRight size={16} />
                </Link>
                <span style={{ fontSize: '0.78rem', color: 'var(--farmora-wheat)', fontFamily: 'var(--font-mono)' }}>
                  MINIMAL COST HIGH-IMPACT ALERT
                </span>
              </div>
            </div>

            <div style={{ background: 'rgba(12, 13, 5, 0.8)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(182, 178, 67, 0.3)' }}>
              <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--farmora-wheat)', marginBottom: '8px' }}>
                SAVINGS SIMULATION (1 ACRE WHEAT)
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--farmora-platinum)' }}>यूरिया क्षति बचत:</span>
                <strong style={{ color: 'var(--farmora-lime)' }}>₹650</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--farmora-platinum)' }}>भूजल प्रदूषण रोकथाम:</span>
                <strong style={{ color: '#38bdf8' }}>100% Nitrate Retention</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--farmora-platinum)' }}>सेवा लागत:</span>
                <strong style={{ color: 'var(--farmora-wheat)' }}>₹59 – ₹89 / season</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==============================================================
          SECTION 6: 3D DIGITAL TWIN SANDBOX PREVIEW
          ============================================================== */}
      <section style={{ maxWidth: '1240px', margin: '0 auto 5rem auto', padding: '0 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span className="badge badge-frozen" style={{ marginBottom: '10px' }}>
            WHAT-IF DIGITAL TWIN SANDBOX
          </span>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', color: 'var(--farmora-light)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '8px' }}>
            खेत का 3D डिजिटल प्रतिरूप
          </h2>
          <p style={{ color: 'var(--farmora-platinum)', fontSize: '1.05rem', maxWidth: '640px', margin: '0 auto' }}>
            खेत में कोई भी निर्णय लेने से पहले 3D सिमुलेशन में देखिए कि बारिश और नहर का पानी आपकी मिट्टी पर क्या असर डालेगा।
          </p>
        </div>

        <div
          className="farmora-glass-elevated"
          style={{
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)'
          }}
        >
          <div style={{ height: '420px', width: '100%', position: 'relative' }}>
            <Landscape3DScene rainfall={15} temperature={0.5} canalHours={6} />
            <div
              style={{
                position: 'absolute',
                bottom: '20px',
                left: '20px',
                right: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px',
                background: 'rgba(12, 13, 5, 0.85)',
                backdropFilter: 'blur(12px)',
                padding: '12px 20px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid rgba(182, 178, 67, 0.3)'
              }}
            >
              <div style={{ fontSize: '0.85rem', color: 'var(--farmora-light)', fontWeight: 600 }}>
                🎮 Interactive 3D Physics: Drag to orbit landscape • Click below to open complete What-If sandbox
              </div>
              <button
                onClick={() => navigate('/digital-twin')}
                className="farmora-btn-primary"
                style={{ padding: '8px 20px', fontSize: '0.85rem' }}
              >
                Launch Full Sandbox
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ==============================================================
          SECTION 7: SCIENTIFIC RIGOR & JURY PROVENANCE
          ============================================================== */}
      <section style={{ maxWidth: '1240px', margin: '0 auto 6rem auto', padding: '0 1.5rem' }}>
        <div
          className="farmora-glass-elevated"
          style={{
            padding: '2.5rem',
            borderRadius: 'var(--radius-xl)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <span className="badge badge-pilot">SCIENTIFIC VERIFICATION & AUDIT</span>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--farmora-light)', marginTop: '4px' }}>
                72-Hour Locked Pilot Verification (AWS_LKO_05)
              </h3>
            </div>
            <Link
              to="/validation"
              className="farmora-btn-secondary"
              style={{
                padding: '8px 18px',
                fontSize: '0.84rem',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>View Full Validation Report</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <p style={{ color: 'var(--farmora-platinum)', fontSize: '0.98rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Kisaan Ki Yash is not a black-box LLM hallucinating weather. Every inference is backed by deterministic physical lapse-rates, two-stage precipitation hurdle distributions, and locked ground-truth AWS validation.
          </p>

          <ScientificDrawer
            title="सम्पूर्ण भौतिक सत्यापन एवं मॉडल मीट्रिक्स (Full Jury Audit)"
            whyExplanation={
              <div>
                लखनऊ मलिहाबाद पायलट स्टेशन (AWS_LKO_05) पर 72 घंटे के परीक्षण में मॉडल 1 (M1) ने सतही तापमान का MAE 0.4083°C प्राप्त किया, 
                जबकि कच्चे NWP का MAE 0.6793°C था (39.89% त्रुटि कटौती)।
              </div>
            }
            evidenceContent={
              <div>
                वर्षा अनुमान के लिए मॉडल 3 (M3) ने शून्य-वर्षा सम्भावना और वर्षा परिमाण को स्वतंत्र रूप से मॉडल किया, जिससे अपेक्षित हर्डल RMSE 0.9725 रहा (NWP 1.1438 के मुकाबले 15% सुधार)।
              </div>
            }
            scientificDetails={{
              modelProvenance: 'Model 1 (UTM 44N Downscaling) + Model 3 (Expected Hurdle Precipitation)',
              uncertainty: 'Conformal interval [3.6 mm, 6.0 mm] at 90% coverage level',
              stationValidation: 'Locked AWS_LKO_05 pilot data (72-hour continuous telemetry)',
              metrics: {
                'M1 Test MAE': '0.4083°C',
                'Raw NWP MAE': '0.6793°C',
                'Error Reduction': '39.89%',
                'M3 Hurdle RMSE': '0.9725',
                'M2 Test MAE': '0.4113°C (Did not beat M1)'
              }
            }}
          />
        </div>
      </section>
    </div>
  );
};
