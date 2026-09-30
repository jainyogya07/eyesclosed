import React from 'react';
import { Link } from 'react-router-dom';
import {
  Droplets,
  AlertTriangle,
  Box,
  Sliders,
  Satellite,
  Cpu,
  ShieldCheck,
  Database,
  ArrowRight,
  Compass
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export const ExplorePage: React.FC = () => {
  const { language } = useApp();
  const en = language === 'en';

  const exploreTools = [
    {
      to: '/water',
      titleEn: 'Water & Soil Moisture',
      titleHi: 'जल व मृदा नमी',
      descEn: 'Root-zone 40cm soil moisture, ET0 evapotranspiration, field capacity, and hydrological water balance.',
      descHi: 'रूट-ज़ोन 40 सेमी मिट्टी नमी, ET0 वाष्पीकरण, फील्ड कैपेसिटी और वैज्ञानिक जल संतुलन।',
      icon: Droplets,
      color: '#0284c7',
      badge: en ? 'Hydrology Model' : 'हाइड्रोलॉजी मॉडल'
    },
    {
      to: '/scenario',
      titleEn: 'Future Climate Scenario Lab',
      titleHi: 'जलवायु परिदृश्य लैब',
      descEn: 'Monsoon delay (15–30 days), rainfall deficits (-20% to -40%), and temperature rise impact simulator.',
      descHi: 'मानसून में 15–30 दिन की देरी, वर्षा में 20–40% कमी और तापमान वृद्धि का फसल प्रभाव सिम्युलेटर।',
      icon: Sliders,
      color: '#ea580c',
      badge: en ? 'Simulation Engine' : 'सिमुलेशन इंजन'
    },
    {
      to: '/risks',
      titleEn: 'Hazards & Climate Risks',
      titleHi: 'आपदा व मौसम जोखिम अलर्ट',
      descEn: 'Prioritized early warnings for waterlogging, pest outbreaks, heat stress, and crop failure probabilities.',
      descHi: 'जलभराव, कीट प्रकोप, अत्यधिक गर्मी और फसल तनाव के प्राथमिकता आधारित प्रारंभिक अलर्ट।',
      icon: AlertTriangle,
      color: '#dc2626',
      badge: en ? 'Hazard Detection' : 'आपदा निगरानी'
    },
    {
      to: '/digital-twin',
      titleEn: '3D Digital Twin Field',
      titleHi: '3D डिजिटल ट्विन सिमुलेशन',
      descEn: 'Interactive 3D field model visualizing elevation gradients, sunlight vectors, and microclimate physics.',
      descHi: 'खेत का त्रि-आयामी (3D) डिजिटल प्रतिरूप। मौसम व मिट्टी के प्रभाव का दृश्य अनुभव।',
      icon: Box,
      color: '#10b981',
      badge: en ? '3D Physics Model' : '3D भौतिकी मॉडल'
    },
    {
      to: '/agriculture',
      titleEn: 'Satellite & Crop Health',
      titleHi: 'सैटेलाइट वनस्पति व फसल स्वास्थ्य',
      descEn: 'Sentinel-2 multispectral remote sensing: NDVI vegetation vigor, NDRE chlorophyll, and EVI canopy index.',
      descHi: 'Sentinel-2 उपग्रह से NDVI, NDRE, EVI वनस्पति सूचकांक व फसल स्वास्थ्य विश्लेषण।',
      icon: Satellite,
      color: '#059669',
      badge: en ? 'Multispectral GIS' : 'मल्टीस्पेक्ट्रल जीआईएस'
    },
    {
      to: '/model-lab',
      titleEn: 'AI Model Lab (M1–M10 Registry)',
      titleHi: 'AI मॉडल लैब (M1–M10 रजिस्ट्री)',
      descEn: '10 AI/ML models trained on IMD downscaling, ERA5 reanalysis, and sensor data with hyperparameters & status.',
      descHi: 'आईएमडी और सेंसर डेटा पर प्रशिक्षित 10 वैज्ञानिक मॉडल्स, हाइपरपैरामीटर्स व पायलट स्थिति।',
      icon: Cpu,
      color: '#6366f1',
      badge: en ? 'M1–M10 Registry' : 'M1–M10 रजिस्ट्री'
    },
    {
      to: '/validation',
      titleEn: 'Model Validation & Benchmarks',
      titleHi: 'मॉडल सत्यापन व बेंचमार्क',
      descEn: 'Sensor vs prediction residual distributions, MAE/RMSE benchmarks, and conformal uncertainty coverage.',
      descHi: 'सेंसर बनाम प्रेडिक्शन त्रुटि वितरण, MAE/RMSE मेट्रिक्स व अनिश्चितता कवरेज।',
      icon: ShieldCheck,
      color: '#0891b2',
      badge: en ? 'Empirical Benchmarks' : 'सत्यापन मेट्रिक्स'
    },
    {
      to: '/data-center',
      titleEn: 'Data Center & Telemetry',
      titleHi: 'डेटा केंद्र व टेलीमेट्री नेटवर्क',
      descEn: 'Live data ecosystem combining IMD AWS stations, Open-Meteo, satellite passes, and in-situ soil probes.',
      descHi: 'आईएमडी एडब्ल्यूएस स्टेशन, उपग्रह फीड व इन-सीटू ग्राउंड टेलीमेट्री का वास्तविक इकोसिस्टम।',
      icon: Database,
      color: '#475569',
      badge: en ? 'Live Telemetry' : 'लाइव टेलीमेट्री'
    }
  ];

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '1.5rem 1rem 4rem' }}>
      {/* Header */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(12px)',
          borderRadius: '16px',
          border: '1.5px solid #e2e8f0',
          padding: '22px 26px',
          marginBottom: '2rem',
          boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span
            style={{
              background: '#ecfdf5',
              color: '#059669',
              padding: '3px 10px',
              borderRadius: '999px',
              fontSize: '0.72rem',
              fontWeight: 800,
              letterSpacing: '0.04em'
            }}
          >
            {en ? 'SCIENTIFIC TOOLS & RESEARCH SUITE' : 'वैज्ञानिक उपकरण व अनुसंधान सुइट'}
          </span>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
            {en ? 'For Agronomists, Research Officers & Climate Scientists' : 'कृषि वैज्ञानिकों, अधिकारियों व शोधकर्ताओं के लिए'}
          </span>
        </div>

        <h1 style={{ fontSize: '1.45rem', color: '#0f172a', fontWeight: 800, margin: '0 0 6px 0' }}>
          {en ? 'Explore Science, Models & GIS Intelligence' : 'वैज्ञानिक व तकनीकी अन्वेषण केंद्र'}
        </h1>
        <p style={{ color: '#475569', fontSize: '0.9rem', margin: 0, maxWidth: '820px', lineHeight: 1.5 }}>
          {en
            ? 'The scientific intelligence infrastructure powering our farmer recommendations — 1-km downscaled meteorology, multispectral satellite remote sensing, hydrological soil balance, and 10 calibrated AI models.'
            : 'किसानों के सरल इंटरफेस के पीछे का पूरा वैज्ञानिक ढांचा — 1-किमी डाउनस्केलिंग, सैटेलाइट रिमोट सेंसिंग, हाइड्रो-सॉयल फिजिक्स और 10 AI मॉडल्स।'}
        </p>
      </div>

      {/* Grid of Tools */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
        {exploreTools.map((tool) => {
          const Icon = tool.icon;
          const title = en ? tool.titleEn : tool.titleHi;
          const desc = en ? tool.descEn : tool.descHi;

          return (
            <Link
              key={tool.to}
              to={tool.to}
              style={{
                textDecoration: 'none',
                background: 'rgba(255, 255, 255, 0.94)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                border: '1.5px solid #e2e8f0',
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                transition: 'transform 0.15s ease, border-color 0.15s ease'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      background: `${tool.color}15`,
                      color: tool.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Icon size={22} />
                  </div>

                  <span
                    style={{
                      background: '#f8fafc',
                      color: '#475569',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '999px',
                      border: '1px solid #e2e8f0'
                    }}
                  >
                    {tool.badge}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
                  {title}
                </h3>
                <p style={{ fontSize: '0.84rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                  {desc}
                </p>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: tool.color,
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  marginTop: '16px',
                  paddingTop: '12px',
                  borderTop: '1px solid #f1f5f9'
                }}
              >
                <span>{en ? 'Launch Tool' : 'उपकरण खोलें'}</span>
                <ArrowRight size={14} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
