import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { KisanIntelligenceCore } from '../components/ai/KisanIntelligenceCore';
import { HeroScrollStory } from '../components/cinematic/HeroScrollStory';
import { StatusBadge } from '../components/common/StatusBadge';
import { AtmosphericBackground } from '../components/common/AtmosphericBackground';
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
  Play
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useApp();
  const [activeDataStream, setActiveDataStream] = useState<number>(0);

  const dataStreams = [
    {
      id: 0,
      titleHi: '1. मौसम (Weather)',
      titleEn: 'Atmospheric Physics',
      icon: <CloudSun size={24} color="#0284c7" />,
      tag: '1-km Downscaled',
      descHi: 'सतह तापमान, आर्द्रता, सौर विकिरण व हवा की गति को 1 किमी सटीकता में गणना करना।',
      descEn: '1-km downscaled surface air temperature, vapor pressure deficit, and shortwave solar irradiance.'
    },
    {
      id: 1,
      titleHi: '2. उपग्रह रडार (Satellite SAR)',
      titleEn: 'Satellite Observation',
      icon: <Satellite size={24} color="#6d28d9" />,
      tag: 'Sentinel-1 & INSAT',
      descHi: 'बादलों के पार देखने वाला सिंथेटिक एपर्चर रडार (SAR) जो मिट्टी की नमी का सटीक अनुमान देता है।',
      descEn: 'Cloud-penetrating Synthetic Aperture Radar (SAR) backscatter sensitive to dielectric soil properties.'
    },
    {
      id: 2,
      titleHi: '3. भू-आकृति (DEM Terrain)',
      titleEn: 'Micro-Topography',
      icon: <Layers size={24} color="#b45309" />,
      tag: 'SRTM 30m Resampled',
      descHi: '30 मीटर भूभाग ऊंचाई मॉडल से पानी के बहाव, ढलान और प्राकृतिक जलभराव क्षेत्रों की पहचान।',
      descEn: 'High-resolution digital elevation modeling computing topographic wetness index and slope aspect.'
    },
    {
      id: 3,
      titleHi: '4. मिट्टी की नमी (Root-Zone Soil)',
      titleEn: 'Root-Zone Moisture',
      icon: <Droplet size={24} color="#059669" />,
      tag: '0–30 cm Profile',
      descHi: 'खेत की सतह से लेकर पौधों की जड़ों तक मौजूद पानी का सटीक प्रतिशत (VWC %)।',
      descEn: 'Dynamic soil moisture depth profiling tracking volumetric water content against crop wilting points.'
    },
    {
      id: 4,
      titleHi: '5. फसल स्थिति (Crop Phenology)',
      titleEn: 'Crop Biological State',
      icon: <Sprout size={24} color="#15803d" />,
      tag: 'Growing Degree Days',
      descHi: 'बुवाई की तारीख, विकास अवस्था (वानस्पतिक, पुष्पन, परिपक्वता) और जल तनाव संवेदनशीलता।',
      descEn: 'Thermal-time phenology models tracking critical crop water stress susceptibility windows.'
    }
  ];

  return (
    <div style={{ position: 'relative', overflowX: 'hidden' }}>
      {/* ==============================================================
          SECTION 1: CINEMATIC OPENING HERO (Full Screen Viewport)
          ============================================================== */}
      <section
        style={{
          position: 'relative',
          minHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '4rem 1.5rem',
          textAlign: 'center',
          background: 'radial-gradient(ellipse at 50% 30%, rgba(224, 242, 254, 0.75) 0%, rgba(240, 253, 244, 0.45) 50%, rgba(252, 251, 249, 1) 85%)',
          borderBottom: '1px solid var(--border-subtle)'
        }}
      >
        <AtmosphericBackground intensity="cinematic" showGrid={true} />

        <div style={{ maxWidth: '860px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          {/* Centered Living Kisan Intelligence Core */}
          <div style={{ marginBottom: '1.75rem' }}>
            <KisanIntelligenceCore size="hero" state="FORECASTING" showLabel={true} />
          </div>

          {/* Institutional / Pilot Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
            <StatusBadge status="frozen" label="M1–M3 FROZEN PILOT • LUCKNOW CLUSTER" />
          </div>

          {/* Main Title */}
          <h1
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.2rem)',
              fontWeight: 800,
              color: 'var(--text-primary)',
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              marginBottom: '1rem'
            }}
          >
            Kisaan Ki Yash
            <span style={{ display: 'block', fontSize: 'clamp(1.8rem, 4.5vw, 3rem)', fontWeight: 700, color: 'var(--color-earth-emerald)', marginTop: '4px' }}>
              किसान की यश
            </span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 'clamp(1.15rem, 2.5vw, 1.45rem)',
              color: 'var(--text-secondary)',
              maxWidth: '640px',
              margin: '0 auto 2.25rem auto',
              lineHeight: 1.5,
              fontWeight: 500
            }}
          >
            {language === 'hi' ? (
              <>
                मौसम को समझें।
                <br />
                <strong>फसल के लिए सही फैसला लें।</strong>
              </>
            ) : (
              <>
                Hyperlocal climate intelligence.
                <br />
                <strong>Actionable agricultural decisions for every Indian farm.</strong>
              </>
            )}
          </p>

          {/* ONE Primary CTA & ONE Secondary CTA */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/my-farm')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px 28px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                background: 'var(--color-earth-emerald)',
                color: 'white',
                fontSize: '1.05rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(21, 128, 61, 0.35)',
                transition: 'transform 0.15s ease'
              }}
            >
              <span>{language === 'hi' ? 'मेरे खेत के लिए देखें' : 'View for My Farm'}</span>
              <ArrowRight size={18} />
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('signature-story');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 24px',
                borderRadius: 'var(--radius-full)',
                border: '1.5px solid var(--border-card)',
                background: 'white',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <Cpu size={18} color="var(--color-atmosphere-blue)" />
              <span>{language === 'hi' ? 'वैज्ञानिक प्रणाली देखें' : 'Explore Scientific Engine'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* ==============================================================
          SECTION 2: "आपके खेत के लिए मौसम सिर्फ तापमान नहीं है"
          ============================================================== */}
      <section style={{ maxWidth: '960px', margin: '0 auto', padding: '6rem 1.5rem 4rem 1.5rem', textAlign: 'center' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-atmosphere-blue)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          THE CLIMATE DILEMMA
        </span>
        <h2
          style={{
            fontSize: 'clamp(2rem, 4vw, 2.8rem)',
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            marginTop: '8px',
            marginBottom: '1.5rem',
            lineHeight: 1.25
          }}
        >
          {language === 'hi'
            ? 'आपके खेत के लिए मौसम सिर्फ तापमान नहीं है।'
            : 'For your farm, weather is not just a temperature number.'}
        </h2>
        <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: '780px', margin: '0 auto 3rem auto' }}>
          {language === 'hi'
            ? 'मोबाइल फोन में दिखने वाला 31°C जिला मुख्यालय का औसत है। लेकिन आपका खेत ढलान पर है, नहर के पास है, और उसमें धान की फसल खड़ी है। मौसम तभी उपयोगी है जब वह यह बताए कि आज ट्यूबवेल चलाना है या नहीं, कीटनाशक डालना है या रुकना है।'
            : 'A generic 31°C weather icon represents a 25-kilometer district average. But your farm sits in a micro-depression near a canal with flowering paddy. Meteorological data only matters when it translates into an unambiguous decision: pump or hold, spray or wait.'}
        </p>

        {/* Minimal Contrast Graphic */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div
            className="glass-panel"
            style={{
              padding: '24px',
              borderRadius: 'var(--radius-xl)',
              background: '#f8fafc',
              border: '1px solid var(--border-subtle)',
              textAlign: 'left'
            }}
          >
            <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
              Standard Phone Weather App
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px' }}>
              “31°C • Partly Sunny”
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Coarse 25km grid. Doesn't know your soil, doesn't know your crop, gives zero actionable guidance to a farmer.
            </p>
          </div>

          <div
            style={{
              padding: '24px',
              borderRadius: 'var(--radius-xl)',
              background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
              border: '2px solid var(--color-earth-light)',
              textAlign: 'left',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <div style={{ color: 'var(--color-earth-emerald)', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
              Kisaan Ki Yash Hyperlocal Engine
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-hazard-crimson)', marginBottom: '8px' }}>
              “आज सिंचाई रोकें (Hold Irrigation)”
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
              1-km downscaling + Sentinel-1 soil moisture + phenology = direct money savings and crop protection.
            </p>
          </div>
        </div>
      </section>

      {/* ==============================================================
          SECTION 3: EARTH → INDIA → PANCHAYAT → FIELD (Scroll Story)
          ============================================================== */}
      <section id="signature-story" style={{ maxWidth: '1100px', margin: '0 auto', padding: '4rem 1.5rem' }}>
        <HeroScrollStory />
      </section>

      {/* ==============================================================
          SECTION 4: "WHAT DOES KISAAN KI YASH SEE?" (5 Data Streams)
          ============================================================== */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '5rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="badge badge-frozen" style={{ marginBottom: '8px' }}>
            MULTISPECTRAL OBSERVATION
          </span>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '8px' }}>
            किसान की यश आपके खेत में क्या देखता है?
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '640px', margin: '0 auto' }}>
            5 स्वतंत्र भौतिक परतों का एक साथ विश्लेषण (Five Synoptic Intelligence Layers)
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) minmax(320px, 1.2fr)', gap: '2rem', alignItems: 'center' }}>
          {/* Stream Selector List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {dataStreams.map((stream) => {
              const isSelected = activeDataStream === stream.id;
              return (
                <div
                  key={stream.id}
                  onClick={() => setActiveDataStream(stream.id)}
                  style={{
                    padding: '16px 20px',
                    borderRadius: 'var(--radius-lg)',
                    border: isSelected ? '2px solid var(--color-earth-emerald)' : '1px solid var(--border-subtle)',
                    background: isSelected ? 'var(--color-earth-subtle)' : 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? 'var(--shadow-sm)' : 'none'
                  }}
                >
                  <div style={{ padding: '8px', borderRadius: 'var(--radius-md)', background: 'white', border: '1px solid var(--border-card)' }}>
                    {stream.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: isSelected ? 'var(--color-earth-emerald)' : 'var(--text-primary)' }}>
                      {language === 'hi' ? stream.titleHi : stream.titleEn}
                    </div>
                    <div style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      {stream.tag}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Stream Detailed Insight Card */}
          <div
            className="glass-panel-elevated"
            style={{
              padding: '2.5rem 2rem',
              borderRadius: 'var(--radius-xl)',
              background: 'white',
              border: '1.5px solid var(--border-card)',
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
              <div style={{ padding: '12px', borderRadius: 'var(--radius-lg)', background: 'var(--bg-surface-subtle)' }}>
                {dataStreams[activeDataStream].icon}
              </div>
              <div>
                <span className="badge badge-pilot">{dataStreams[activeDataStream].tag}</span>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
                  {language === 'hi' ? dataStreams[activeDataStream].titleHi : dataStreams[activeDataStream].titleEn}
                </h3>
              </div>
            </div>

            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {language === 'hi' ? dataStreams[activeDataStream].descHi : dataStreams[activeDataStream].descEn}
            </p>

            <div style={{ padding: '14px 16px', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-primary)' }}>
              <span style={{ color: 'var(--color-earth-emerald)', fontWeight: 700 }}>SYNTHESIS: </span>
              Combined dynamically by Model 10 into verified advisory items without requiring manual user interpretation.
            </div>
          </div>
        </div>
      </section>

      {/* ==============================================================
          SECTION 5: "और फिर क्या?" AI INTELLIGENCE
          ============================================================== */}
      <section style={{ maxWidth: '960px', margin: '0 auto', padding: '4rem 1.5rem', textAlign: 'center' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-quantum-violet)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          CAUSAL SYNTHESIS
        </span>
        <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginTop: '6px', marginBottom: '1rem' }}>
          {language === 'hi' ? 'और फिर क्या? (And Then What?)' : 'From Raw Signals to Farm Actions'}
        </h2>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '720px', margin: '0 auto 2.5rem auto', lineHeight: 1.6 }}>
          {language === 'hi'
            ? 'मौसम केवल देखना काफी नहीं है। हमारी प्रणाली यह गणना करती है कि इस मौसम का आपकी फसल की पत्तियों, मिट्टी और आपकी जेब पर क्या असर पड़ेगा।'
            : 'Observing weather is not enough. Our models compute the exact physical consequence on leaf stomatal conductance, root hydraulic conductivity, and farmer economics.'}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', textAlign: 'left' }}>
          <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-atmosphere-blue)', marginBottom: '6px' }}>1. Physical Downscale</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Coarse NWP grids transformed to 1km resolution using digital terrain elevation & solar aspect.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-earth-emerald)', marginBottom: '6px' }}>2. Hurdle Precipitation</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Two-stage model predicts rain probability first, then expected millimetre intensity with uncertainty bounds.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-quantum-violet)', marginBottom: '6px' }}>3. Decision Engine</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Converts physical thresholds into vernacular advisory cards with estimated economic savings in Rupees.
            </p>
          </div>
        </div>
      </section>

      {/* ==============================================================
          SECTION 6: REAL DECISION INTERACTIVE PREVIEW (Progressive Disclosure)
          ============================================================== */}
      <section style={{ maxWidth: '840px', margin: '0 auto', padding: '4rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span className="badge badge-frozen">DECISION ARCHITECTURE</span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '6px' }}>
            अंतिम फैसला: सरल और पारदर्शी
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            चार स्तरों में जानकारी: सीधा जवाब → कारण → साक्ष्य → वैज्ञानिक आधार
          </p>
        </div>

        <div
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
            border: '2px solid var(--color-earth-light)',
            borderRadius: 'var(--radius-xl)',
            padding: '2.5rem 2rem',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '3.2rem', lineHeight: 1, padding: '12px', background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-card)' }}>
              🌧️
            </div>
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-atmosphere-blue)' }}>
                {language === 'hi' ? 'अगले 18 घंटे में वर्षा अनुमान (84% संभावना)' : 'Rainfall Expected in Next 18h (84% prob)'}
              </div>
              <h3 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-hazard-crimson)', margin: '2px 0 6px 0' }}>
                {language === 'hi' ? 'आज सिंचाई रोकें' : 'Hold Irrigation Today'}
              </h3>
              <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
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
                  <p style={{ marginBottom: '6px' }}>
                    1-किमी वर्षा मॉडल 12.4 मिमी बारिश का अनुमान दे रहा है, और मिट्टी में 31% नमी पहले से है।
                  </p>
                  <p>अनुमानित बचत: ₹350 से ₹400 प्रति एकड़।</p>
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
          SECTION 7: DIGITAL TWIN CINEMATIC PREVIEW
          ============================================================== */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '4rem 1.5rem' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
            color: 'white',
            borderRadius: 'var(--radius-xl)',
            padding: '3.5rem 2.5rem',
            display: 'grid',
            gridTemplateColumns: 'minmax(280px, 1.2fr) minmax(260px, 0.8fr)',
            gap: '2.5rem',
            alignItems: 'center',
            boxShadow: 'var(--shadow-xl)'
          }}
        >
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: 'var(--radius-full)', background: 'rgba(109, 40, 217, 0.3)', border: '1px solid rgba(167, 139, 250, 0.4)', color: '#c4b5fd', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', marginBottom: '1.25rem' }}>
              <Layers size={14} />
              <span>3D PANCHAYAT DIGITAL TWIN</span>
            </div>

            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2, marginBottom: '1rem', color: '#ffffff' }}>
              खेत का 3D डिजिटल ट्विन: क्या होगा अगर...?
            </h2>

            <p style={{ fontSize: '1.05rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '2rem' }}>
              मौसम बदलने से पहले ही सिमुलेशन चलाएं। यदि +40 मिमी अप्रत्याशित बारिश हो जाए या तापमान 3°C बढ़ जाए, तो किन खेतों में जलभराव होगा और नहर का पानी कब छोड़ना चाहिए?
            </p>

            <button
              onClick={() => navigate('/digital-twin')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                background: 'var(--color-quantum-violet)',
                color: 'white',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(109, 40, 217, 0.4)'
              }}
            >
              <span>ओपन 3D डिजिटल ट्विन सिमुलेटर</span>
              <ArrowRight size={18} />
            </button>
          </div>

          <div
            style={{
              padding: '24px',
              borderRadius: 'var(--radius-lg)',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}
          >
            <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: '#94a3b8' }}>
              PRIMARY SIMULATION CONTROLS
            </div>
            <div style={{ padding: '12px', borderRadius: 'var(--radius-sm)', background: 'rgba(255, 255, 255, 0.05)' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>1. वर्षा परिवर्तन (Rainfall Override): +40 mm</div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>बादल घने होते हैं और निचले खेत लाल चिह्नित होते हैं।</div>
            </div>
            <div style={{ padding: '12px', borderRadius: 'var(--radius-sm)', background: 'rgba(255, 255, 255, 0.05)' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>2. तापमान वृद्धि (Heatwave): +3.5°C</div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>वाष्पीकरण (ET) दर 38% बढ़ जाती है।</div>
            </div>
            <div style={{ padding: '12px', borderRadius: 'var(--radius-sm)', background: 'rgba(255, 255, 255, 0.05)' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>3. नहर जल निकासी (Canal Release): 8 घंटे</div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>जलभराव जोखिम 70% से घटकर 18% रह जाता है।</div>
            </div>
          </div>
        </div>
      </section>

      {/* ==============================================================
          SECTION 8: SCIENTIFIC PROOF (M1/M2/M3 Verified Pilot Metrics)
          ============================================================== */}
      <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '5rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span className="badge badge-frozen">VERIFIED SCIENTIFIC PROVENANCE</span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginTop: '6px' }}>
            सत्यनिष्ठ वैज्ञानिक आंकड़े (No Hallucinated Claims)
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            72-घंटे का लखनऊ पायलट एवं सील्ड टेस्ट स्टेशन (AWS_LKO_05) का वास्तविक मूल्यांकन।
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '24px', background: 'white', borderRadius: 'var(--radius-xl)' }}>
            <span className="badge badge-frozen" style={{ marginBottom: '8px' }}>M1 FROZEN PILOT</span>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>Weather Downscaling</h4>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-earth-emerald)', margin: '8px 0' }}>
              0.4083°C <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>MAE</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Raw NWP MAE (0.6793°C) की तुलना में <strong>39.89% त्रुटि कटौती</strong>। R²: 0.9827।
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '24px', background: 'white', borderRadius: 'var(--radius-xl)' }}>
            <span className="badge badge-frozen" style={{ marginBottom: '8px' }}>M2 FROZEN PILOT</span>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>Temperature Refinement</h4>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', margin: '8px 0' }}>
              0.4113°C <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>MAE</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              पारदर्शिता: M2 ने M1 को महत्वपूर्ण रूप से नहीं सुधारा। इसलिए M1 बेसलाइन सक्रिय रखी गई है।
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '24px', background: 'white', borderRadius: 'var(--radius-xl)' }}>
            <span className="badge badge-frozen" style={{ marginBottom: '8px' }}>M3 FROZEN PILOT</span>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>Precipitation Hurdle</h4>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-atmosphere-blue)', margin: '8px 0' }}>
              0.9725 <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>RMSE</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Raw NWP (1.1438) की तुलना में <strong>15.0% RMSE सुधार</strong>। Expected rainfall MAE 0.7535 mm/h।
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button
            onClick={() => navigate('/validation')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-earth-emerald)',
              fontWeight: 700,
              fontSize: '0.9rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>सम्पूर्ण स्टेशन-स्तरीय सत्यापन रिपोर्ट देखें (Full Validation)</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* ==============================================================
          SECTION 9: RESPONSIBLE AI & GUARDRAILS
          ============================================================== */}
      <section style={{ maxWidth: '840px', margin: '0 auto', padding: '3rem 1.5rem', textAlign: 'center' }}>
        <div
          className="glass-panel"
          style={{
            padding: '2rem',
            borderRadius: 'var(--radius-xl)',
            background: 'rgba(255, 255, 255, 0.85)',
            border: '1.5px solid var(--border-subtle)'
          }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--color-earth-emerald)', marginBottom: '10px' }}>
            <ShieldCheck size={24} />
            <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>RESPONSIBLE CLIMATE AI GUARANTEE</span>
          </div>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '640px', margin: '0 auto' }}>
            जब सेंसर खराब हों या मौसम ऐतिहासिक सीमाओं से बाहर (Out-of-Distribution) चला जाए, तो हमारा AI कभी भी अनुमान का दिखावा नहीं करता। ऐसी स्थिति में सिस्टम स्वतः <strong>"ABSTAIN"</strong> घोषित करता है और भारतीय मौसम विभाग (IMD) के आधिकारिक बुलेटिन को प्रस्तुत करता है।
          </p>
        </div>
      </section>

      {/* ==============================================================
          SECTION 10: FINAL INVITATION CTA
          ============================================================== */}
      <section
        style={{
          maxWidth: '960px',
          margin: '3rem auto 6rem auto',
          padding: '4rem 2rem',
          textAlign: 'center',
          borderRadius: 'var(--radius-xl)',
          background: 'radial-gradient(ellipse at 50% 50%, rgba(240, 253, 244, 0.8) 0%, rgba(255, 255, 255, 0.95) 100%)',
          border: '2px solid var(--color-earth-light)',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <span className="badge badge-frozen" style={{ marginBottom: '10px' }}>
          {language === 'hi' ? 'सीधा उपयोग' : 'INSTANT ACCESS'}
        </span>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px' }}>
          {language === 'hi' ? 'अपने खेत की स्थिति अभी देखें' : 'Check Today’s Conditions on Your Farm'}
        </h2>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '580px', margin: '0 auto 2rem auto', lineHeight: 1.5 }}>
          {language === 'hi'
            ? 'केवल गांव और फसल चुनें। 5 सेकंड में जानें कि आज क्या कदम उठाना है।'
            : 'Select your panchayat and crop. Receive clear advisory in 5 seconds.'}
        </p>

        <button
          onClick={() => navigate('/my-farm')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '16px 36px',
            borderRadius: 'var(--radius-full)',
            border: 'none',
            background: 'var(--color-earth-emerald)',
            color: 'white',
            fontSize: '1.1rem',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(21, 128, 61, 0.4)',
            transition: 'transform 0.15s ease'
          }}
        >
          <span>{language === 'hi' ? 'मेरे खेत के लिए शुरू करें' : 'Open My Farm'}</span>
          <ArrowRight size={20} />
        </button>
      </section>
    </div>
  );
};
