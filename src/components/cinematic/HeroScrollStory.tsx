import React, { useState, useEffect, useRef } from 'react';
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
  Sparkles
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
  visualIcon: React.ReactNode;
  visualColor: string;
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
    visualIcon: <Globe size={48} color="#0284c7" />,
    visualColor: 'rgba(2, 132, 199, 0.1)',
    dataPoint: 'ECMWF IFS / GFS 0.25° Grid'
  },
  {
    id: 2,
    stageNameHi: 'दृश्य 2: राज्य व जलवायु क्षेत्र',
    stageNameEn: 'SCENE 2: State & Agro-Climatic Zone',
    headlineHi: 'उत्तर प्रदेश गंगा का मैदानी भाग',
    headlineEn: 'Indo-Gangetic Agro-Climatic Zone',
    captionHi: 'मानसून की शाखाएं मैदानी भूभाग में प्रवेश करती हैं।',
    captionEn: 'Regional monsoon trough entering the Central Gangetic plains.',
    scaleKm: '500 km',
    visualIcon: <MapPin size={48} color="#059669" />,
    visualColor: 'rgba(5, 150, 105, 0.1)',
    dataPoint: 'Agro-Ecological Region 9.2'
  },
  {
    id: 3,
    stageNameHi: 'दृश्य 3: जिला स्तर',
    stageNameEn: 'SCENE 3: District Scale',
    headlineHi: 'लखनऊ जिला क्लस्टर',
    headlineEn: 'Lucknow District Boundary',
    captionHi: 'पारंपरिक मौसम पूर्वानुमान यहाँ एक ही तापमान का दावा करते हैं, जो गलत साबित होता है।',
    captionEn: 'Conventional forecasts treat the entire district as a single homogenous block.',
    scaleKm: '60 km',
    visualIcon: <MapPin size={48} color="#d97706" />,
    visualColor: 'rgba(217, 119, 6, 0.1)',
    dataPoint: 'District IMD AWS Network'
  },
  {
    id: 4,
    stageNameHi: 'दृश्य 4: ब्लॉक व पंचायत',
    stageNameEn: 'SCENE 4: Panchayat Level',
    headlineHi: 'मलिहाबाद ब्लॉक व पंचायतें',
    headlineEn: 'Malihabad Panchayat Cluster',
    captionHi: 'आम के बागान और धान के खेतों का विशिष्ट सूक्ष्म-मौसम क्षेत्र।',
    captionEn: 'Unique micro-climate boundary shaped by mango orchards and paddy belts.',
    scaleKm: '10 km',
    visualIcon: <Sprout size={48} color="#16a34a" />,
    visualColor: 'rgba(22, 163, 74, 0.1)',
    dataPoint: 'Panchayat Code 0924001001'
  },
  {
    id: 5,
    stageNameHi: 'दृश्य 5: 1-किमी हाइपरलोकल ग्रिड',
    stageNameEn: 'SCENE 5: 1-km Precision Grid',
    headlineHi: '1000m × 1000m स्थानिक संकल्प',
    headlineEn: 'Metric UTM 44N 1-km Grid',
    captionHi: 'मॉडल 1 (M1) भू-आकृति, ढलान और ऊंचाई के आधार पर मौसम को 1 किमी में बदलता है।',
    captionEn: 'Model 1 (M1) downscales weather conditioning on SRTM elevation and topography.',
    scaleKm: '1 km²',
    visualIcon: <Cpu size={48} color="#0284c7" />,
    visualColor: 'rgba(2, 132, 199, 0.15)',
    dataPoint: 'M1 Downscaled MAE: 0.4083°C'
  },
  {
    id: 6,
    stageNameHi: 'दृश्य 6: किसान का खेत',
    stageNameEn: 'SCENE 6: The Individual Farm',
    headlineHi: 'आपका विशिष्ट खेत (The Plot)',
    headlineEn: 'Farmer’s Specific Field Boundary',
    captionHi: 'जमीन की ऊंचाई 124 मीटर, पूर्व-पश्चिम दिशा, नहर के किनारे की अवस्थिति।',
    captionEn: '124m elevation, canal proximity, loamy alluvial soil texture.',
    scaleKm: '0.2 km',
    visualIcon: <Sprout size={48} color="#15803d" />,
    visualColor: 'rgba(21, 128, 61, 0.15)',
    dataPoint: 'Plot Elevation: 124.2m MSL'
  },
  {
    id: 7,
    stageNameHi: 'दृश्य 7: उपग्रह रडार डेटा',
    stageNameEn: 'SCENE 7: Synthetic Aperture Radar',
    headlineHi: 'Sentinel-1 रडार अवलोकन',
    headlineEn: 'SAR Backscatter Soil Moisture Proxy',
    captionHi: 'बादलों के आर-पार देखकर उपग्रह मिट्टी में दबी नमी का मापन करता है।',
    captionEn: 'Radar microwave pulses penetrate clouds to observe root-zone moisture.',
    scaleKm: 'Active',
    visualIcon: <Satellite size={48} color="#6d28d9" />,
    visualColor: 'rgba(109, 40, 217, 0.1)',
    dataPoint: 'Sentinel-1 VV/VH Ratio: -12.4 dB'
  },
  {
    id: 8,
    stageNameHi: 'दृश्य 8: वर्षा डाउनस्केलिंग मॉडल 3',
    stageNameEn: 'SCENE 8: Precipitation Hurdle (M3)',
    headlineHi: 'हाइपरलोकल वर्षा सम्भावना',
    headlineEn: 'Model 3 Hurdle Precipitation',
    captionHi: 'अगले 18 घंटे में 12.4 मिमी बारिश का अनुमान (84% संभावना)।',
    captionEn: 'Two-stage hurdle model forecasts 12.4 mm rainfall event with 84% probability.',
    scaleKm: 'Forecast',
    visualIcon: <CloudRain size={48} color="#0284c7" />,
    visualColor: 'rgba(2, 132, 199, 0.15)',
    dataPoint: 'Expected Rain: 12.4mm ± 1.2mm'
  },
  {
    id: 9,
    stageNameHi: 'दृश्य 9: मिट्टी व फसल स्थिति',
    stageNameEn: 'SCENE 9: Soil & Crop Phenology',
    headlineHi: 'जड़ क्षेत्र नमी: 31% (VWC)',
    headlineEn: 'Optimum Root-Zone Moisture',
    captionHi: 'धान की फसल पुष्पन अवस्था में है, जहां अत्यधिक जलभराव हानिकारक हो सकता है।',
    captionEn: 'Paddy is in critical flowering phase; over-saturation triggers fungal collar rot.',
    scaleKm: 'Root Zone',
    visualIcon: <Droplet size={48} color="#059669" />,
    visualColor: 'rgba(5, 150, 105, 0.15)',
    dataPoint: 'Soil VWC: 31.2% (Adequate)'
  },
  {
    id: 10,
    stageNameHi: 'दृश्य 10: कृत्रिम बुद्धिमत्ता संश्लेषण',
    stageNameEn: 'SCENE 10: Causal AI Synthesis',
    headlineHi: 'किसान इंटेलिजेंस कोर का विश्लेषण',
    headlineEn: 'Kisan Core Multi-Model Inference',
    captionHi: 'मौसम + मिट्टी + फसल + नहर + मूल्य का संयुक्त कॉज़ल समीकरण।',
    captionEn: 'Joint causal inference across weather, soil, phenology, and energy cost.',
    scaleKm: 'AI Core',
    visualIcon: <Cpu size={48} color="#6d28d9" />,
    visualColor: 'rgba(109, 40, 217, 0.15)',
    dataPoint: 'Confidence: 91% Certified'
  },
  {
    id: 11,
    stageNameHi: 'दृश्य 11: जोखिम का पता लगना',
    stageNameEn: 'SCENE 11: Agronomic Hazard Risk',
    headlineHi: 'जलभराव व लीचिंग का खतरा',
    headlineEn: 'Waterlogging & Nitrogen Leaching Risk',
    captionHi: 'यदि आज सिंचाई की जाती है, तो बारिश के कारण पानी भर जाएगा और खाद बह जाएगी।',
    captionEn: 'Irradiation now combined with impending rain leads to severe nitrogen leaching.',
    scaleKm: 'Risk Metric',
    visualIcon: <AlertTriangle size={48} color="#d97706" />,
    visualColor: 'rgba(217, 119, 6, 0.15)',
    dataPoint: 'Hazard Alert: Preventable Waste'
  },
  {
    id: 12,
    stageNameHi: 'दृश्य 12: अंतिम सरल निर्णय',
    stageNameEn: 'SCENE 12: The Clear Action',
    headlineHi: '“आज सिंचाई रोकें”',
    headlineEn: '“Hold Irrigation Today”',
    captionHi: 'इतनी सारी जटिल जानकारी। किसान के लिए एक आसान और सीधा फैसला।',
    captionEn: 'Trillions of calculations condensed into one crisp, money-saving action.',
    scaleKm: 'Action',
    visualIcon: <CheckCircle2 size={48} color="#16a34a" />,
    visualColor: 'rgba(22, 163, 74, 0.2)',
    dataPoint: 'Direct Savings: ₹350–₹400'
  }
];

export const HeroScrollStory: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const currentScene = SCENES[activeStep];

  return (
    <div
      style={{
        position: 'relative',
        borderRadius: 'var(--radius-xl)',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        border: '1.5px solid var(--border-card)',
        boxShadow: 'var(--shadow-lg)',
        padding: '2.5rem 2rem',
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <span className="badge badge-frozen" style={{ marginBottom: '8px' }}>
          THE SIGNATURE JOURNEY
        </span>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: 'var(--text-primary)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '8px' }}>
          अंतरिक्ष से किसान के खेत तक (Earth to Field)
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '640px', margin: '0 auto' }}>
          देखिए कैसे करोड़ों डेटा बिंदुओं से एक सटीक कृषि निर्णय तैयार होता है।
        </p>
      </div>

      {/* Main Interactive Stage */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(280px, 1fr) minmax(280px, 1fr)',
          gap: '2.5rem',
          alignItems: 'center',
          marginBottom: '2.5rem'
        }}
      >
        {/* Left: The Visual Telescope / Radar representation */}
        <div
          style={{
            position: 'relative',
            aspectRatio: '1',
            maxHeight: '380px',
            margin: '0 auto',
            width: '100%',
            borderRadius: 'var(--radius-xl)',
            background: currentScene.visualColor,
            border: '2px solid rgba(2, 132, 199, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'inset 0 0 40px rgba(255,255,255,0.8)'
          }}
        >
          {/* Subtle concentric orbital rings */}
          <div
            style={{
              position: 'absolute',
              width: '85%',
              height: '85%',
              borderRadius: '50%',
              border: '1px dashed rgba(2, 132, 199, 0.3)',
              animation: 'kisanSpinClockwise 40s linear infinite'
            }}
          />
          <div
            style={{
              position: 'absolute',
              width: '55%',
              height: '55%',
              borderRadius: '50%',
              border: '1px solid rgba(2, 132, 199, 0.2)'
            }}
          />

          {/* Centered Graphic Icon */}
          <div
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-md)',
              position: 'relative',
              zIndex: 2,
              transition: 'transform 0.3s ease'
            }}
          >
            {currentScene.visualIcon}
          </div>

          {/* Scale badge on visual */}
          <div
            style={{
              position: 'absolute',
              bottom: '16px',
              background: 'white',
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              color: 'var(--text-primary)',
              boxShadow: 'var(--shadow-sm)',
              zIndex: 2
            }}
          >
            SCALE: {currentScene.scaleKm}
          </div>
        </div>

        {/* Right: The Narrative & Progressive Insight */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-earth-emerald)', fontFamily: 'var(--font-mono)' }}>
              STEP {activeStep + 1} OF {SCENES.length}
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>•</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              {currentScene.stageNameEn}
            </span>
          </div>

          <h3 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.25, marginBottom: '12px' }}>
            {currentScene.headlineHi}
          </h3>

          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
            {currentScene.captionHi}
          </p>

          <div
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              background: 'white',
              border: '1px solid var(--border-subtle)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              color: 'var(--color-atmosphere-blue)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Sparkles size={16} />
            <span>{currentScene.dataPoint}</span>
          </div>

          {/* Navigation Controls for Steps */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '1.5rem' }}>
            <button
              onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
              disabled={activeStep === 0}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-card)',
                background: activeStep === 0 ? '#f1f5f9' : 'white',
                color: activeStep === 0 ? 'var(--text-muted)' : 'var(--text-primary)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: activeStep === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              Previous
            </button>

            <button
              onClick={() => setActiveStep((activeStep + 1) % SCENES.length)}
              style={{
                padding: '8px 20px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                background: 'var(--color-earth-emerald)',
                color: 'white',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              {activeStep === SCENES.length - 1 ? 'Start Over' : 'Next Scene'}
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Step Pills Bar */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
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
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              border: activeStep === idx ? '1.5px solid var(--color-earth-emerald)' : '1px solid var(--border-subtle)',
              background: activeStep === idx ? 'var(--color-earth-subtle)' : 'white',
              color: activeStep === idx ? 'var(--color-earth-emerald)' : 'var(--text-muted)',
              fontSize: '0.72rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: activeStep === idx ? 700 : 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease'
            }}
          >
            {idx + 1}. {scene.stageNameEn.split(':')[1]?.trim() || scene.stageNameEn}
          </button>
        ))}
      </div>
    </div>
  );
};
