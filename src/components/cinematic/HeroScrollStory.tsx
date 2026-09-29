import React, { useState } from 'react';
import {
  Globe,
  MapPin,
  Satellite,
  CloudRain,
  Droplet,
  Sprout,
  Cpu,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Layers
} from 'lucide-react';

interface SceneStep {
  id: number;
  stageNameHi: string;
  stageNameEn: string;
  headlineHi: string;
  headlineEn: string;
  captionHi: string;
  captionEn: string;
  scaleKm: string;
  imageBg: string;
  dataPoint: string;
}

const SCENES: SceneStep[] = [
  {
    id: 1,
    stageNameHi: 'दृश्य 1: अंतरिक्ष एवं भारत',
    stageNameEn: 'SCENE 1: Global & India',
    headlineHi: 'अंतरिक्ष से देखा गया भारत',
    headlineEn: 'Synoptic Earth Observation',
    captionHi: 'INSAT-3DR एवं ECMWF वैश्विक जलवायु मॉडल भारत के वायुमंडल को 25 किमी के पैमाने पर देखते हैं।',
    captionEn: 'Global synoptic models see India at a coarse 25 km grid cell scale.',
    scaleKm: '25,000 km',
    imageBg: '/assets/cinematic/satellite_grid.jpg',
    dataPoint: 'ECMWF IFS / GFS 0.25° Synoptic Grid'
  },
  {
    id: 2,
    stageNameHi: 'दृश्य 2: राज्य व जलवायु क्षेत्र',
    stageNameEn: 'SCENE 2: Gangetic Plain',
    headlineHi: 'उत्तर प्रदेश गंगा का मैदानी भाग',
    headlineEn: 'Indo-Gangetic Agro-Climatic Zone',
    captionHi: 'मानसून की शाखाएं उत्तर भारत के मैदानी भूभाग में प्रवेश करती हैं।',
    captionEn: 'Regional monsoon trough entering the Central Gangetic plains.',
    scaleKm: '500 km',
    imageBg: '/assets/cinematic/monsoon_clouds.jpg',
    dataPoint: 'Agro-Ecological Region 9.2'
  },
  {
    id: 3,
    stageNameHi: 'दृश्य 3: मलिहाबाद क्लस्टर',
    stageNameEn: 'SCENE 3: Malihabad Panchayat',
    headlineHi: 'मलिहाबाद ब्लॉक व पंचायतें',
    headlineEn: 'Malihabad Panchayat Cluster',
    captionHi: 'आम के बागान और धान के खेतों का विशिष्ट सूक्ष्म-मौसम क्षेत्र (Microclimate)।',
    captionEn: 'Unique micro-climate boundary shaped by mango orchards and paddy belts.',
    scaleKm: '10 km',
    imageBg: '/assets/cinematic/farm_golden_hour.jpg',
    dataPoint: 'Panchayat Code 0924001001'
  },
  {
    id: 4,
    stageNameHi: 'दृश्य 4: 1-किमी हाइपरलोकल ग्रिड',
    stageNameEn: 'SCENE 4: 1-km Precision Grid',
    headlineHi: '1000m × 1000m स्थानिक संकल्प',
    headlineEn: 'Metric UTM 44N 1-km Grid',
    captionHi: 'मॉडल 1 (M1) भू-आकृति, ढलान और ऊंचाई के आधार पर मौसम को 1 किमी ग्रिड में बदलता है।',
    captionEn: 'Model 1 (M1) downscales weather conditioning on SRTM elevation and topography.',
    scaleKm: '1 km²',
    imageBg: '/assets/cinematic/satellite_grid.jpg',
    dataPoint: 'M1 Downscaled MAE: 0.4083°C (39.89% error reduction)'
  },
  {
    id: 5,
    stageNameHi: 'दृश्य 5: किसान का खेत',
    stageNameEn: 'SCENE 5: Individual Farm Plot',
    headlineHi: 'आपका विशिष्ट खेत (The Plot)',
    headlineEn: 'Farmer’s Specific Field Boundary',
    captionHi: 'जमीन की ऊंचाई 124 मीटर, पूर्व-पश्चिम दिशा, नहर के किनारे की अवस्थिति।',
    captionEn: '124m elevation, canal proximity, loamy alluvial soil texture.',
    scaleKm: '0.2 km',
    imageBg: '/assets/cinematic/farm_golden_hour.jpg',
    dataPoint: 'Plot Elevation: 124.2m MSL'
  },
  {
    id: 6,
    stageNameHi: 'दृश्य 6: वर्षा डाउनस्केलिंग मॉडल 3',
    stageNameEn: 'SCENE 6: Precipitation Hurdle (M3)',
    headlineHi: 'हाइपरलोकल वर्षा सम्भावना',
    headlineEn: 'Model 3 Hurdle Precipitation',
    captionHi: 'अगले 18 घंटे में 12.4 मिमी बारिश का अनुमान (84% संभावना)।',
    captionEn: 'Two-stage hurdle model forecasts 12.4 mm rainfall event with 84% probability.',
    scaleKm: 'Forecast',
    imageBg: '/assets/cinematic/monsoon_clouds.jpg',
    dataPoint: 'Expected Rain: 12.4mm ± 1.2mm (RMSE 0.9725)'
  },
  {
    id: 7,
    stageNameHi: 'दृश्य 7: मिट्टी व जड़ क्षेत्र',
    stageNameEn: 'SCENE 7: Root-Zone Moisture',
    headlineHi: 'जड़ क्षेत्र नमी: 31% (VWC)',
    headlineEn: 'Optimum Root-Zone Moisture',
    captionHi: 'धान की फसल पुष्पन अवस्था में है, जहां अत्यधिक जलभराव हानिकारक हो सकता है।',
    captionEn: 'Paddy is in critical flowering phase; over-saturation triggers fungal collar rot.',
    scaleKm: '0–30 cm',
    imageBg: '/assets/cinematic/farm_golden_hour.jpg',
    dataPoint: 'Soil VWC: 31.2% (Adequate)'
  },
  {
    id: 8,
    stageNameHi: 'दृश्य 8: अंतिम स्पष्ट निर्णय',
    stageNameEn: 'SCENE 8: The Clear Action',
    headlineHi: '“आज सिंचाई रोकें”',
    headlineEn: '“Hold Irrigation Today”',
    captionHi: 'इतनी सारी जटिल वैज्ञानिक गणनाएं। किसान के लिए एक सीधा, स्पष्ट और पैसे बचाने वाला फैसला।',
    captionEn: 'Trillions of calculations condensed into one crisp, money-saving action.',
    scaleKm: 'Action',
    imageBg: '/assets/cinematic/farm_golden_hour.jpg',
    dataPoint: 'Direct Savings: ₹350–₹400 / Acre'
  }
];

export const HeroScrollStory: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const currentScene = SCENES[activeStep];

  return (
    <div
      className="farmora-glass-elevated"
      style={{
        position: 'relative',
        borderRadius: 'var(--radius-xl)',
        padding: '2.5rem 2rem',
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <span className="badge badge-frozen" style={{ marginBottom: '12px' }}>
          EARTH TO FIELD CASCADE
        </span>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: 'var(--farmora-light)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '8px' }}>
          अंतरिक्ष से किसान के खेत तक
        </h2>
        <p style={{ color: 'var(--farmora-platinum)', fontSize: '1.05rem', maxWidth: '640px', margin: '0 auto' }}>
          देखिए कैसे उपग्रह और 10-मॉडल प्रेडिक्शन मिलकर आपके खेत के लिए एक आसान, सही फैसला बनाते हैं।
        </p>
      </div>

      {/* Main Interactive Stage */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(300px, 1.2fr) minmax(280px, 1fr)',
          gap: '2.5rem',
          alignItems: 'center',
          marginBottom: '2rem'
        }}
      >
        {/* Left: High-Impact Visual Screen with Photographic Background & Animated Radar Overlay */}
        <div
          style={{
            position: 'relative',
            aspectRatio: '16/10',
            width: '100%',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            boxShadow: '0 20px 50px -10px rgba(0,0,0,0.7)',
            border: '1.5px solid rgba(182, 178, 67, 0.4)'
          }}
        >
          {/* Background Photographic Image */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${currentScene.imageBg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transition: 'background-image 0.5s ease-in-out',
              filter: 'contrast(115%) saturate(120%) brightness(0.7)'
            }}
          />

          {/* Radar Scanline & Laser Grid Effect */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at center, transparent 30%, rgba(12, 13, 5, 0.75) 100%)'
            }}
          />

          {/* Rotating Laser Reticle */}
          <div
            style={{
              position: 'absolute',
              inset: '12%',
              border: '1px dashed rgba(182, 178, 67, 0.45)',
              borderRadius: '50%',
              animation: 'radarSweepScan 20s linear infinite'
            }}
          />

          {/* Top HUD Badge on Image */}
          <div
            style={{
              position: 'absolute',
              top: '14px',
              left: '14px',
              background: 'rgba(12, 13, 5, 0.85)',
              backdropFilter: 'blur(10px)',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              color: 'var(--farmora-light)',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: '1px solid rgba(182, 178, 67, 0.3)'
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#B6B243', boxShadow: '0 0 8px #B6B243' }} />
            <span>OBSERVATION SCALE: {currentScene.scaleKm}</span>
          </div>

          {/* Bottom Telemetry Chip on Image */}
          <div
            style={{
              position: 'absolute',
              bottom: '14px',
              left: '14px',
              right: '14px',
              background: 'rgba(22, 24, 10, 0.9)',
              backdropFilter: 'blur(12px)',
              padding: '10px 16px',
              borderRadius: 'var(--radius-md)',
              color: 'var(--farmora-light)',
              fontSize: '0.78rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              border: '1px solid rgba(182, 178, 67, 0.3)'
            }}
          >
            <span style={{ color: 'var(--farmora-wheat)' }}>{currentScene.dataPoint}</span>
            <span style={{ color: 'var(--farmora-lime)' }}>LOCKED TELEMETRY</span>
          </div>
        </div>

        {/* Right: Narrative Insight & Step Controls */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--farmora-lime)', fontFamily: 'var(--font-mono)' }}>
              STEP {activeStep + 1} OF {SCENES.length}
            </span>
            <span style={{ color: 'var(--farmora-platinum)' }}>•</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--farmora-platinum)', fontFamily: 'var(--font-mono)' }}>
              {currentScene.stageNameEn}
            </span>
          </div>

          <h3 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, color: 'var(--farmora-light)', lineHeight: 1.2, marginBottom: '14px' }}>
            {currentScene.headlineHi}
          </h3>

          <p style={{ fontSize: '1.1rem', color: 'var(--farmora-platinum)', lineHeight: 1.6, marginBottom: '1.75rem' }}>
            {currentScene.captionHi}
          </p>

          {/* Step Navigation Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
              disabled={activeStep === 0}
              className="farmora-btn-secondary"
              style={{
                padding: '10px 18px',
                fontSize: '0.85rem',
                opacity: activeStep === 0 ? 0.4 : 1,
                cursor: activeStep === 0 ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <ChevronLeft size={16} />
              <span>Previous</span>
            </button>

            <button
              onClick={() => setActiveStep((activeStep + 1) % SCENES.length)}
              className="farmora-btn-primary"
              style={{
                padding: '10px 24px',
                fontSize: '0.9rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>{activeStep === SCENES.length - 1 ? 'Start Over' : 'Next Step'}</span>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Step Pills */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '8px',
          scrollbarWidth: 'none'
        }}
      >
        {SCENES.map((scene, idx) => (
          <button
            key={scene.id}
            onClick={() => setActiveStep(idx)}
            style={{
              flex: '1 0 auto',
              padding: '8px 14px',
              borderRadius: 'var(--radius-full)',
              border: activeStep === idx ? '1.5px solid var(--farmora-lime)' : '1px solid rgba(182, 178, 67, 0.2)',
              background: activeStep === idx ? 'var(--farmora-lime)' : 'rgba(251, 251, 251, 0.05)',
              color: activeStep === idx ? 'var(--farmora-dark)' : 'var(--farmora-platinum)',
              fontSize: '0.78rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: activeStep === idx ? 800 : 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease'
            }}
          >
            {idx + 1}. {scene.stageNameEn.split(':')[1]?.trim() || scene.stageNameEn}
          </button>
        ))}
      </div>
    </div>
  );
};
