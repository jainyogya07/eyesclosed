import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { KisanIntelligenceCore } from '../components/ai/KisanIntelligenceCore';
import { HeroScrollStory } from '../components/cinematic/HeroScrollStory';
import { CinematicFarmBackground } from '../components/common/CinematicFarmBackground';
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
  Wind
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useApp();
  const [activeDataStream, setActiveDataStream] = useState<number>(0);

  const dataStreams = [
    {
      id: 0,
      titleHi: '1. मौसम भौतिकी (Atmospheric Physics)',
      titleEn: '1-km Weather Downscaling',
      icon: <CloudSun size={26} color="#0284c7" />,
      tag: 'M1 & M3 Operational',
      imageBg: '/assets/cinematic/monsoon_clouds.jpg',
      descHi: 'सतह तापमान (T2m), आर्द्रता, सौर विकिरण व हवा की गति को 1 किमी सटीकता में गणना करना।',
      descEn: 'High-resolution surface air temperature, vapor pressure deficit, and shortwave solar irradiance downscaled to 1-km grid.'
    },
    {
      id: 1,
      titleHi: '2. उपग्रह रडार (Satellite SAR)',
      titleEn: 'Microwave Radar Observation',
      icon: <Satellite size={26} color="#6d28d9" />,
      tag: 'Sentinel-1 Constellation',
      imageBg: '/assets/cinematic/satellite_grid.jpg',
      descHi: 'बादलों के पार देखने वाला सिंथेटिक एपर्चर रडार (SAR) जो मिट्टी की नमी का सटीक अवलोकन करता है।',
      descEn: 'Cloud-penetrating Synthetic Aperture Radar (SAR) backscatter sensitive to dielectric soil properties.'
    },
    {
      id: 2,
      titleHi: '3. भू-आकृति एवं ढलान (DEM Terrain)',
      titleEn: 'Micro-Topography & Aspect',
      icon: <Layers size={26} color="#b45309" />,
      tag: 'Copernicus 30m GLO',
      imageBg: '/assets/cinematic/farm_golden_hour.jpg',
      descHi: '30 मीटर भूभाग ऊंचाई मॉडल से पानी के बहाव, ढलान और प्राकृतिक जलभराव क्षेत्रों की पहचान।',
      descEn: 'High-resolution digital elevation modeling computing topographic wetness index and slope aspect.'
    },
    {
      id: 3,
      titleHi: '4. जड़ क्षेत्र नमी (Root-Zone Soil)',
      titleEn: '0–30 cm Soil Moisture (VWC)',
      icon: <Droplet size={26} color="#059669" />,
      tag: 'Soil Hydrology Model',
      imageBg: '/assets/cinematic/farm_golden_hour.jpg',
      descHi: 'खेत की सतह से लेकर पौधों की जड़ों तक मौजूद पानी का सटीक प्रतिशत (VWC %)।',
      descEn: 'Dynamic soil moisture depth profiling tracking volumetric water content against crop wilting points.'
    },
    {
      id: 4,
      titleHi: '5. फसल स्थिति (Crop Phenology)',
      titleEn: 'Vegetation & Physiological Stage',
      icon: <Sprout size={26} color="#15803d" />,
      tag: 'Growing Degree Days (GDD)',
      imageBg: '/assets/cinematic/monsoon_clouds.jpg',
      descHi: 'बुवाई की तारीख, विकास अवस्था (वानस्पतिक, पुष्पन, परिपक्वता) और जल तनाव संवेदनशीलता।',
      descEn: 'Thermal-time phenology models tracking critical crop water stress susceptibility windows.'
    }
  ];

  return (
    <div style={{ position: 'relative', overflowX: 'hidden' }}>
      {/* ==============================================================
          SECTION 1: FULLSCREEN CINEMATIC OPENING HERO WITH LIVE FARM VIDEO/BG
          ============================================================== */}
      <section
        style={{
          position: 'relative',
          minHeight: '94vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '4rem 1.5rem',
          textAlign: 'center',
          overflow: 'hidden'
        }}
      >
        {/* Animated Farm Photographic Canvas Background with Sun Particles */}
        <CinematicFarmBackground variant="golden_farm" showParticles={true} />

        {/* Foreground Content */}
        <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          {/* Top Live Sensor Status Chip */}
          <div
            className="cinematic-glass"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '6px 16px',
              borderRadius: 'var(--radius-full)',
              marginBottom: '1.5rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10b981', animation: 'pulseGlowEmerald 2s infinite' }} />
            <span style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-earth-deep)' }}>
              LIVE CLIMATE OBSERVATION • MALIHABAD CLUSTER
            </span>
          </div>

          {/* Centered Living Kisan Intelligence Core */}
          <div style={{ marginBottom: '1.75rem', filter: 'drop-shadow(0 15px 30px rgba(16, 185, 129, 0.35))' }}>
            <KisanIntelligenceCore size="hero" state="FORECASTING" showLabel={true} />
          </div>

          {/* Main Title with Rich Glow */}
          <h1
            style={{
              fontSize: 'clamp(2.8rem, 6.5vw, 4.8rem)',
              fontWeight: 800,
              color: '#0f172a',
              lineHeight: 1.08,
              letterSpacing: '-0.03em',
              marginBottom: '1.25rem',
              textShadow: '0 2px 20px rgba(255, 255, 255, 0.8)'
            }}
          >
            Kisaan Ki Yash
            <span
              style={{
                display: 'block',
                fontSize: 'clamp(2rem, 5vw, 3.4rem)',
                fontWeight: 800,
                color: 'var(--color-earth-deep)',
                marginTop: '4px'
              }}
            >
              किसान की यश
            </span>
          </h1>

          {/* Hero Subtitle */}
          <p
            style={{
              fontSize: 'clamp(1.2rem, 2.5vw, 1.55rem)',
              color: '#1e293b',
              maxWidth: '680px',
              margin: '0 auto 2.5rem auto',
              lineHeight: 1.5,
              fontWeight: 600,
              textShadow: '0 1px 10px rgba(255, 255, 255, 0.9)'
            }}
          >
            {language === 'hi' ? (
              <>
                मौसम को समझें।
                <br />
                <strong style={{ color: 'var(--color-earth-deep)' }}>फसल के लिए सही फैसला लें।</strong>
              </>
            ) : (
              <>
                Hyperlocal Climate Intelligence.
                <br />
                <strong style={{ color: 'var(--color-earth-deep)' }}>Actionable decisions for every Indian farm.</strong>
              </>
            )}
          </p>

          {/* Primary & Secondary Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/my-farm')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '16px 36px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                color: 'white',
                fontSize: '1.1rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(5, 150, 105, 0.45)',
                transition: 'all 0.2s ease'
              }}
              className="card-hover-tilt"
            >
              <span>{language === 'hi' ? 'मेरे खेत के लिए देखें' : 'View for My Farm'}</span>
              <ArrowRight size={20} />
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('signature-story');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="cinematic-glass card-hover-tilt"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '16px 28px',
                borderRadius: 'var(--radius-full)',
                color: 'var(--text-primary)',
                fontSize: '1.05rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Cpu size={20} color="var(--color-atmosphere-blue)" />
              <span>{language === 'hi' ? 'वैज्ञानिक प्रणाली देखें' : 'Scientific Architecture'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* ==============================================================
          SECTION 2: "मौसम सिर्फ तापमान नहीं है" (Contrast Section)
          ============================================================== */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '6rem 1.5rem 4rem 1.5rem', textAlign: 'center' }}>
        <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--color-atmosphere-blue)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          THE CLIMATE OVERLOAD DILEMMA
        </span>
        <h2
          style={{
            fontSize: 'clamp(2.2rem, 4.5vw, 3.2rem)',
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '-0.025em',
            marginTop: '8px',
            marginBottom: '1.5rem',
            lineHeight: 1.2
          }}
        >
          {language === 'hi'
            ? 'आपके खेत के लिए मौसम सिर्फ तापमान नहीं है।'
            : 'For your farm, weather is not just a temperature number.'}
        </h2>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: '820px', margin: '0 auto 3.5rem auto' }}>
          {language === 'hi'
            ? 'फोन स्क्रीन में दिखने वाला "31°C" जिला मुख्यालय का 25 किमी औसत होता है। लेकिन आपका खेत ढलान पर है, नहर के पास है, और उसमें धान की फसल खड़ी है। मौसम विज्ञान का असली मूल्य तभी है जब वह किसान को यह बताए: आज ट्यूबवेल चलाएं या रोकें।'
            : 'Generic weather apps show a coarse 25-kilometer district estimate. But your farm sits in a micro-depression with specific root-zone moisture and flowering paddy. Climate intelligence only creates value when it provides an unequivocal decision.'}
        </p>

        {/* High-Fidelity Comparison Visual */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {/* Generic Phone App */}
          <div
            className="cinematic-glass"
            style={{
              padding: '2.5rem 2rem',
              borderRadius: 'var(--radius-xl)',
              textAlign: 'left',
              opacity: 0.8
            }}
          >
            <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '10px' }}>
              Standard Phone Weather App
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px' }}>
              31°C • Partly Sunny
            </div>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Coarse 25km resolution. Zero soil moisture insight, zero crop awareness. Leaves the farmer guessing whether groundwater pumping will cause waterlogging.
            </p>
          </div>

          {/* Kisaan Ki Yash Hyperlocal Cockpit */}
          <div
            className="cinematic-glass-elevated card-hover-tilt"
            style={{
              padding: '2.5rem 2rem',
              borderRadius: 'var(--radius-xl)',
              textAlign: 'left',
              border: '2px solid var(--color-earth-light)',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(236,253,245,0.9) 100%)',
              boxShadow: '0 25px 50px -10px rgba(5, 150, 105, 0.2)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span className="badge badge-frozen">KISAAN KI YASH 1-KM ENGINE</span>
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-earth-emerald)', fontWeight: 700 }}>
                SAVINGS: ₹350–₹400 / ACRE
              </span>
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-hazard-crimson)', marginBottom: '8px' }}>
              “आज सिंचाई रोकें” (Hold Irrigation)
            </div>
            <p style={{ fontSize: '1rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
              1-km topographic downscaling + Sentinel-1 SAR soil backscatter (31% VWC) + Model 3 rainfall hurdle (12.4mm incoming) = direct diesel savings and zero nitrogen runoff.
            </p>
          </div>
        </div>
      </section>

      {/* ==============================================================
          SECTION 3: EARTH → INDIA → PANCHAYAT → FIELD (Scroll Story)
          ============================================================== */}
      <section id="signature-story" style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 1.5rem' }}>
        <HeroScrollStory />
      </section>

      {/* ==============================================================
          SECTION 4: "WHAT DOES KISAAN KI YASH SEE?" (5 Synoptic Layers)
          ============================================================== */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '5rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="badge badge-frozen" style={{ marginBottom: '8px' }}>
            MULTISPECTRAL SENSING CORE
          </span>
          <h2 style={{ fontSize: 'clamp(2.2rem, 4vw, 3rem)', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.025em', marginBottom: '10px' }}>
            किसान की यश आपके खेत में क्या देखता है?
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', maxWidth: '680px', margin: '0 auto' }}>
            पाँच स्वतंत्र भौतिक परतों का एक साथ वास्तविक समय विश्लेषण (Five Synoptic Intelligence Layers)
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) minmax(360px, 1.3fr)', gap: '2rem', alignItems: 'center' }}>
          {/* Layer Selector Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {dataStreams.map((stream) => {
              const isSelected = activeDataStream === stream.id;
              return (
                <div
                  key={stream.id}
                  onClick={() => setActiveDataStream(stream.id)}
                  className={`card-hover-tilt ${isSelected ? 'cinematic-glass-elevated' : 'cinematic-glass'}`}
                  style={{
                    padding: '18px 22px',
                    borderRadius: 'var(--radius-lg)',
                    border: isSelected ? '2px solid var(--color-earth-emerald)' : '1px solid rgba(255,255,255,0.7)',
                    background: isSelected ? 'rgba(240, 253, 244, 0.95)' : 'rgba(255, 255, 255, 0.75)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px'
                  }}
                >
                  <div
                    style={{
                      padding: '10px',
                      borderRadius: 'var(--radius-md)',
                      background: 'white',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    {stream.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: isSelected ? 'var(--color-earth-emerald)' : 'var(--text-primary)' }}>
                      {language === 'hi' ? stream.titleHi : stream.titleEn}
                    </div>
                    <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      {stream.tag}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Layer Interactive Viewport with Real Photographic Background */}
          <div
            className="cinematic-glass-elevated"
            style={{
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              boxShadow: '0 25px 60px -15px rgba(0,0,0,0.2)',
              border: '2px solid rgba(255, 255, 255, 0.9)'
            }}
          >
            {/* Visual Header Image */}
            <div
              style={{
                position: 'relative',
                height: '220px',
                backgroundImage: `url(${dataStreams[activeDataStream].imageBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transition: 'background-image 0.4s ease'
              }}
            >
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(15, 23, 42, 0.8) 100%)' }} />
              <div style={{ position: 'absolute', bottom: '16px', left: '20px', color: 'white' }}>
                <span className="badge badge-frozen" style={{ marginBottom: '4px' }}>
                  {dataStreams[activeDataStream].tag}
                </span>
                <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                  {dataStreams[activeDataStream].titleEn}
                </div>
              </div>
            </div>

            {/* Description Body */}
            <div style={{ padding: '24px 28px' }}>
              <p style={{ fontSize: '1.15rem', color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                {language === 'hi' ? dataStreams[activeDataStream].descHi : dataStreams[activeDataStream].descEn}
              </p>

              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface-subtle)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Sparkles size={16} color="var(--color-earth-emerald)" />
                <span>Synchronized in Model 10 Agricultural Decision Intelligence Engine</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==============================================================
          SECTION 6: REAL DECISION INTERACTIVE PREVIEW (Progressive Disclosure)
          ============================================================== */}
      <section style={{ maxWidth: '900px', margin: '0 auto', padding: '4rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span className="badge badge-frozen">DECISION ARCHITECTURE</span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '8px' }}>
            अंतिम फैसला: सरल, पारदर्शी, सीधा
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
            चार स्तरों में जानकारी: सीधा जवाब → कारण → साक्ष्य → वैज्ञानिक आधार
          </p>
        </div>

        <div
          className="cinematic-glass-elevated"
          style={{
            borderRadius: 'var(--radius-xl)',
            padding: '2.75rem 2.25rem',
            border: '2px solid var(--color-earth-light)',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(240,253,244,0.9) 100%)',
            boxShadow: '0 25px 60px -10px rgba(5, 150, 105, 0.25)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '1.5rem' }}>
            <div
              style={{
                fontSize: '3.6rem',
                lineHeight: 1,
                padding: '14px',
                background: 'white',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-card)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              🌧️
            </div>
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-atmosphere-blue)' }}>
                {language === 'hi' ? 'अगले 18 घंटे में वर्षा अनुमान (84% संभावना)' : 'Rainfall Expected in Next 18h (84% prob)'}
              </div>
              <h3 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--color-hazard-crimson)', margin: '2px 0 6px 0' }}>
                {language === 'hi' ? 'आज सिंचाई रोकें' : 'Hold Irrigation Today'}
              </h3>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
                {language === 'hi' ? 'ट्यूबवेल न चलाएं। बारिश से पहले पानी देने से खाद बह जाएगी और बिजली/डीजल व्यर्थ होगा।' : 'Do not irrigate today. Preserves energy and prevents nitrogen runoff.'}
              </p>
            </div>
          </div>

          {/* Interactive Progressive Disclosure */}
          <ScientificDrawer
            title={language === 'hi' ? 'यह सलाह क्यों? (कारण व साक्ष्य देखें)' : 'Why this advice? (Click to inspect)'}
            whyExplanation={
              language === 'hi' ? (
                <div>
                  <p style={{ marginBottom: '8px' }}>
                    1-किमी वर्षा मॉडल 12.4 मिमी बारिश का अनुमान दे रहा है, और मिट्टी में 31% नमी पहले से है।
                  </p>
                  <p>अनुमानित बचत: <strong>₹350 से ₹400 प्रति एकड़</strong>।</p>
                </div>
              ) : (
                'Precipitation hurdle model predicts 12.4 mm rain while root-zone moisture is already 31% VWC.'
              )
            }
            evidenceContent={
              <div>IMD AWS Lucknow Telemetry + Model 1 Downscaling (0.4083°C MAE) + Sentinel-1 SAR.</div>
            }
            scientificDetails={{
              modelProvenance: 'Model 1 (Weather Downscaling) + Model 3 (Precipitation Hurdle)',
              uncertainty: 'Conformal bounds [9.6 mm, 14.8 mm] at 90% confidence',
              stationValidation: 'AWS_LKO_05 locked test station',
              metrics: {
                'M1 MAE': '0.4083°C',
                'M3 RMSE': '0.9725',
                'RMSE Reduction': '15.0%',
                'Validation Base': 'Locked 72h Pilot'
              }
            }}
          />
        </div>
      </section>

      {/* ==============================================================
          SECTION 7: 3D DIGITAL TWIN CINEMATIC PREVIEW
          ============================================================== */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 1.5rem' }}>
        <div
          className="cinematic-glass-dark card-hover-tilt"
          style={{
            borderRadius: 'var(--radius-xl)',
            padding: '4rem 3rem',
            display: 'grid',
            gridTemplateColumns: 'minmax(300px, 1.2fr) minmax(280px, 0.8fr)',
            gap: '3rem',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Subtle background satellite grid texture */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'url(/assets/cinematic/satellite_grid.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.15,
              pointerEvents: 'none'
            }}
          />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '5px 14px', borderRadius: 'var(--radius-full)', background: 'rgba(124, 58, 237, 0.35)', border: '1px solid rgba(167, 139, 250, 0.5)', color: '#ddd6fe', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', marginBottom: '1.25rem' }}>
              <Layers size={14} />
              <span>3D CYBER-PHYSICAL DIGITAL TWIN</span>
            </div>

            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: '1.25rem', color: '#ffffff' }}>
              खेत का 3D डिजिटल ट्विन: क्या होगा अगर...?
            </h2>

            <p style={{ fontSize: '1.15rem', color: '#cbd5e1', lineHeight: 1.65, marginBottom: '2.25rem' }}>
              मौसम बदलने से पहले ही सिमुलेशन चलाएं। यदि +40 मिमी अप्रत्याशित वर्षा हो जाए या तापमान 3°C बढ़ जाए, तो किन खेतों में जलभराव होगा और नहर का पानी कब छोड़ना चाहिए?
            </p>

            <button
              onClick={() => navigate('/digital-twin')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px 28px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                color: 'white',
                fontWeight: 800,
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(124, 58, 237, 0.5)'
              }}
            >
              <span>3D डिजिटल ट्विन सिमुलेटर खोलें</span>
              <ArrowRight size={18} />
            </button>
          </div>

          <div
            style={{
              position: 'relative',
              zIndex: 1,
              padding: '24px',
              borderRadius: 'var(--radius-lg)',
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}
          >
            <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: '#94a3b8' }}>
              PRIMARY SIMULATION CONTROLS
            </div>
            <div style={{ padding: '12px 14px', borderRadius: 'var(--radius-md)', background: 'rgba(255, 255, 255, 0.06)' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#38bdf8' }}>1. वर्षा परिवर्तन (Rainfall): +40 mm</div>
              <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: '2px' }}>बादल घने होते हैं और निचले खेत लाल चिह्नित होते हैं।</div>
            </div>
            <div style={{ padding: '12px 14px', borderRadius: 'var(--radius-md)', background: 'rgba(255, 255, 255, 0.06)' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f59e0b' }}>2. तापमान वृद्धि (Heatwave): +3.5°C</div>
              <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: '2px' }}>वाष्पीकरण (ET) दर 38% बढ़ जाती है।</div>
            </div>
            <div style={{ padding: '12px 14px', borderRadius: 'var(--radius-md)', background: 'rgba(255, 255, 255, 0.06)' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#10b981' }}>3. नहर जल निकासी (Canal): 8 घंटे</div>
              <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: '2px' }}>जलभराव जोखिम 70% से घटकर 18% रह जाता है।</div>
            </div>
          </div>
        </div>
      </section>

      {/* ==============================================================
          SECTION 8: SCIENTIFIC PROOF (M1/M2/M3 Locked Metrics)
          ============================================================== */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '5rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="badge badge-frozen">VERIFIED SCIENTIFIC PROVENANCE</span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.025em', marginTop: '8px' }}>
            सत्यनिष्ठ वैज्ञानिक आंकड़े (Grounded Truth)
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
            72-घंटे का लखनऊ पायलट एवं सील्ड टेस्ट स्टेशन (AWS_LKO_05) का वास्तविक मूल्यांकन।
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div className="cinematic-glass-elevated card-hover-tilt" style={{ padding: '28px', borderRadius: 'var(--radius-xl)' }}>
            <span className="badge badge-frozen" style={{ marginBottom: '8px' }}>M1 FROZEN PILOT</span>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '6px' }}>Weather Downscaling</h4>
            <div style={{ fontSize: '2.6rem', fontWeight: 800, color: 'var(--color-earth-emerald)', margin: '8px 0' }}>
              0.4083°C <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>MAE</span>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Raw NWP MAE (0.6793°C) की तुलना में <strong>39.89% त्रुटि कटौती</strong>। R²: 0.9827।
            </p>
          </div>

          <div className="cinematic-glass-elevated card-hover-tilt" style={{ padding: '28px', borderRadius: 'var(--radius-xl)' }}>
            <span className="badge badge-frozen" style={{ marginBottom: '8px' }}>M2 FROZEN PILOT</span>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '6px' }}>Temperature Refinement</h4>
            <div style={{ fontSize: '2.6rem', fontWeight: 800, color: 'var(--text-primary)', margin: '8px 0' }}>
              0.4113°C <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>MAE</span>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              पारदर्शिता: M2 ने M1 को महत्वपूर्ण रूप से नहीं सुधारा। इसलिए M1 बेसलाइन सक्रिय रखी गई है।
            </p>
          </div>

          <div className="cinematic-glass-elevated card-hover-tilt" style={{ padding: '28px', borderRadius: 'var(--radius-xl)' }}>
            <span className="badge badge-frozen" style={{ marginBottom: '8px' }}>M3 FROZEN PILOT</span>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '6px' }}>Precipitation Hurdle</h4>
            <div style={{ fontSize: '2.6rem', fontWeight: 800, color: 'var(--color-atmosphere-blue)', margin: '8px 0' }}>
              0.9725 <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>RMSE</span>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Raw NWP (1.1438) की तुलना में <strong>15.0% RMSE सुधार</strong>। Expected rain MAE 0.7535 mm/h।
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <button
            onClick={() => navigate('/validation')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-earth-emerald)',
              fontWeight: 800,
              fontSize: '1rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>सम्पूर्ण स्टेशन-स्तरीय सत्यापन रिपोर्ट देखें (Full Validation Report)</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* ==============================================================
          SECTION 9: RESPONSIBLE AI GUARANTEE
          ============================================================== */}
      <section style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 1.5rem', textAlign: 'center' }}>
        <div
          className="cinematic-glass-elevated"
          style={{
            padding: '2.5rem',
            borderRadius: 'var(--radius-xl)',
            borderLeft: '5px solid var(--color-earth-emerald)'
          }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--color-earth-emerald)', marginBottom: '12px' }}>
            <ShieldCheck size={26} />
            <span style={{ fontWeight: 800, fontSize: '1.2rem' }}>RESPONSIBLE CLIMATE AI GUARANTEE</span>
          </div>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: '720px', margin: '0 auto' }}>
            जब सेंसर खराब हों या मौसम ऐतिहासिक सीमाओं से बाहर (Out-of-Distribution) चला जाए, तो हमारा AI कभी भी अनुमान का दिखावा नहीं करता। ऐसी स्थिति में सिस्टम स्वतः <strong>"ABSTAIN"</strong> घोषित करता है और भारतीय मौसम विभाग (IMD) के आधिकारिक बुलेटिन को प्रस्तुत करता है।
          </p>
        </div>
      </section>

      {/* ==============================================================
          SECTION 10: FINAL DIRECT CTA
          ============================================================== */}
      <section
        style={{
          maxWidth: '1000px',
          margin: '3rem auto 6rem auto',
          padding: '4.5rem 2rem',
          textAlign: 'center',
          borderRadius: 'var(--radius-xl)',
          background: 'linear-gradient(135deg, rgba(236,253,245,0.95) 0%, rgba(255,255,255,0.98) 100%)',
          border: '2px solid var(--color-earth-light)',
          boxShadow: '0 25px 60px -10px rgba(5, 150, 105, 0.3)'
        }}
      >
        <span className="badge badge-frozen" style={{ marginBottom: '12px' }}>
          {language === 'hi' ? 'सीधा उपयोग' : 'INSTANT ACCESS'}
        </span>
        <h2 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.2rem)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '14px' }}>
          {language === 'hi' ? 'अपने खेत की स्थिति अभी देखें' : 'Check Today’s Conditions on Your Farm'}
        </h2>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 2.25rem auto', lineHeight: 1.6 }}>
          {language === 'hi'
            ? 'केवल गांव और फसल चुनें। 5 सेकंड में जानें कि आज क्या कदम उठाना है।'
            : 'Select your panchayat and crop. Receive clear advisory in 5 seconds.'}
        </p>

        <button
          onClick={() => navigate('/my-farm')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            padding: '18px 42px',
            borderRadius: 'var(--radius-full)',
            border: 'none',
            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
            color: 'white',
            fontSize: '1.15rem',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 10px 30px rgba(5, 150, 105, 0.5)',
            transition: 'transform 0.15s ease'
          }}
          className="card-hover-tilt"
        >
          <span>{language === 'hi' ? 'मेरे खेत के लिए शुरू करें' : 'Open My Farm'}</span>
          <ArrowRight size={22} />
        </button>
      </section>
    </div>
  );
};
