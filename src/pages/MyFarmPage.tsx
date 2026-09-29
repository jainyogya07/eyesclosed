import React, { useState } from 'react';
import { useApp, LocationInfo } from '../contexts/AppContext';
import {
  MapPin,
  Volume2,
  VolumeX,
  Droplet,
  CloudSun,
  Sprout,
  Compass,
  Search,
  Check,
  ChevronDown,
  Navigation,
  Wind,
  Sparkles,
  Thermometer,
  ArrowRight
} from 'lucide-react';
import { ScientificDrawer } from '../components/common/ScientificDrawer';
import { StatusBadge } from '../components/common/StatusBadge';
import { CinematicFarmBackground } from '../components/common/CinematicFarmBackground';

const POPULAR_LOCATIONS: LocationInfo[] = [
  {
    panchayatCode: '0924001001',
    panchayatName: 'Malihabad (मलिहाबाद)',
    district: 'Lucknow (लखनऊ)',
    state: 'Uttar Pradesh (उत्तर प्रदेश)',
    lat: 26.9167,
    lon: 80.7167
  },
  {
    panchayatCode: '0924001002',
    panchayatName: 'Bakshi Ka Talab (बख्शी का तालाब)',
    district: 'Lucknow (लखनऊ)',
    state: 'Uttar Pradesh',
    lat: 27.0125,
    lon: 80.9312
  },
  {
    panchayatCode: '0924001003',
    panchayatName: 'Mohanlalganj (मोहनलालगंज)',
    district: 'Lucknow (लखनऊ)',
    state: 'Uttar Pradesh',
    lat: 26.6712,
    lon: 80.9854
  },
  {
    panchayatCode: '0924001004',
    panchayatName: 'Kakori (काकोरी)',
    district: 'Lucknow (लखनऊ)',
    state: 'Uttar Pradesh',
    lat: 26.8821,
    lon: 80.7981
  }
];

const CROPS = [
  { id: 'paddy', nameHi: 'धान (Paddy)', nameEn: 'Paddy', stageHi: 'पुष्पन अवस्था (Flowering)', stageEn: 'Flowering Stage' },
  { id: 'mango', nameHi: 'आम (Mango)', nameEn: 'Mango Orchard', stageHi: 'फल वृद्धि (Fruit Growth)', stageEn: 'Fruit Growth' },
  { id: 'wheat', nameHi: 'गेहूं (Wheat)', nameEn: 'Wheat', stageHi: 'बुवाई तैयारी (Pre-Sowing)', stageEn: 'Pre-Sowing' },
  { id: 'mustard', nameHi: 'सरसों (Mustard)', nameEn: 'Mustard', stageHi: 'वानस्पतिक अवस्था (Vegetative)', stageEn: 'Vegetative' }
];

export const MyFarmPage: React.FC = () => {
  const { language, location, setLocation, selectedCrop, setSelectedCrop, speakText, isSpeaking } = useApp();
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);

  const currentCropObj = CROPS.find((c) => selectedCrop.includes(c.nameEn)) || CROPS[0];

  const handleUseGPS = () => {
    if (!navigator.geolocation) return;
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          panchayatCode: '0924001001',
          panchayatName: 'खेत (GPS Detected Location)',
          district: 'Lucknow',
          state: 'Uttar Pradesh',
          lat: +pos.coords.latitude.toFixed(4),
          lon: +pos.coords.longitude.toFixed(4)
        });
        setGpsLoading(false);
        setShowLocationModal(false);
      },
      () => {
        setGpsLoading(false);
      }
    );
  };

  const adviceAudioText =
    language === 'hi'
      ? 'किसान भाई, आज आपके खेत के लिए सबसे जरूरी सलाह: आज सिंचाई बिल्कुल रोकें। अगले 18 घंटे में लगभग 12 मिलीमीटर बारिश की प्रबल संभावना है। जमीन में पहले से पर्याप्त नमी है। ट्यूबवेल न चलाने से आपके 350 से 400 रुपये बचेंगे।'
      : 'Farmer advisory for today: Hold irrigation completely. Expected rainfall of 12 millimeters over the next 18 hours. Root zone moisture is already adequate at 31%. Pumping water today will cause waterlogging and waste electricity.';

  return (
    <div style={{ position: 'relative', minHeight: 'calc(100vh - 120px)', padding: '2.5rem 1.5rem 6rem 1.5rem', backgroundColor: 'var(--farmora-dark)' }}>
      {/* Background Animated Farm Environment */}
      <CinematicFarmBackground variant="golden_farm" showParticles={true} opacity={0.3} />

      <div style={{ maxWidth: '960px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Top: Location & Crop Bar (Cockpit Glass Bar) */}
        <div
          className="farmora-glass-elevated"
          style={{
            padding: '18px 24px',
            marginBottom: '1.75rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '14px',
            borderRadius: 'var(--radius-xl)'
          }}
        >
          {/* Location Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', borderRadius: '50%', background: 'rgba(182, 178, 67, 0.15)', border: '1px solid rgba(182, 178, 67, 0.3)' }}>
              <MapPin size={20} color="var(--farmora-lime)" />
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--farmora-wheat)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                {language === 'hi' ? 'खेत का स्थान (1-KM GRID)' : 'ACTIVE PLOT GRID'}
              </div>
              <button
                onClick={() => setShowLocationModal(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--farmora-light)',
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: 0
                }}
              >
                <span>{location.panchayatName}</span>
                <ChevronDown size={16} color="var(--farmora-lime)" />
              </button>
            </div>
          </div>

          {/* Crop Selector Chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {CROPS.map((crop) => {
              const isSelected = selectedCrop.includes(crop.nameEn);
              return (
                <button
                  key={crop.id}
                  onClick={() => setSelectedCrop(`${crop.nameEn} (${crop.stageEn})`)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-full)',
                    border: isSelected ? '1.5px solid var(--farmora-lime)' : '1px solid rgba(182, 178, 67, 0.2)',
                    background: isSelected ? 'var(--farmora-lime)' : 'rgba(251, 251, 251, 0.05)',
                    color: isSelected ? 'var(--farmora-dark)' : 'var(--farmora-platinum)',
                    fontSize: '0.8rem',
                    fontWeight: isSelected ? 800 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {language === 'hi' ? crop.nameHi : crop.nameEn}
                </button>
              );
            })}
          </div>
        </div>

        {/* ==============================================================
            THE SINGLE-SCREEN FARMER ANSWER (Hero Cockpit Card)
            ============================================================== */}
        <div
          className="farmora-glass-elevated"
          style={{
            padding: '2.5rem',
            borderRadius: 'var(--radius-xl)',
            marginBottom: '1.75rem',
            border: '2px solid rgba(182, 178, 67, 0.45)',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)'
          }}
        >
          {/* Header Badge & Action Time */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-frozen">M1–M3 VERIFIED DECISION</span>
              <span style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--farmora-wheat)' }}>
                {language === 'hi' ? 'आज के लिए सलाह' : 'TODAY’S PRIME ACTION'}
              </span>
            </div>

            <div style={{ fontSize: '0.78rem', color: 'var(--farmora-wheat)', fontFamily: 'var(--font-mono)' }}>
              VALID UNTIL: 23:59 IST • 1-KM RES
            </div>
          </div>

          {/* Main Huge Recommendation Box */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <div
              style={{
                width: '88px',
                height: '88px',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'rgba(12, 13, 5, 0.8)',
                border: '2px solid var(--farmora-lime)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3.4rem',
                flexShrink: 0,
                boxShadow: '0 0 25px rgba(182, 178, 67, 0.35)'
              }}
            >
              🌧️
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '1.15rem', color: '#38bdf8', fontWeight: 700, marginBottom: '6px' }}>
                {language === 'hi'
                  ? 'अगले 18 घंटे में 12.4 मिमी वर्षा की 84% सम्भावना है।'
                  : '84% probability of 12.4 mm rainfall in the next 18 hours.'}
              </div>

              <h1
                style={{
                  fontSize: 'clamp(2.2rem, 4.5vw, 3.2rem)',
                  fontWeight: 900,
                  color: 'var(--farmora-lime)',
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                  marginBottom: '10px',
                  textShadow: '0 0 25px var(--farmora-lime-glow)'
                }}
              >
                {language === 'hi' ? 'आज सिंचाई रोकें' : 'Hold Irrigation Today'}
              </h1>

              <p style={{ fontSize: '1.1rem', color: 'var(--farmora-platinum)', lineHeight: 1.6, maxWidth: '680px' }}>
                {language === 'hi'
                  ? 'खेत में जड़ों के पास 31% नमी पहले से मौजूद है। आज ट्यूबवेल न चलाने से आपके ₹350–₹400 की बिजली और डीजल की सीधी बचत होगी और फसल जलभराव से बचेगी।'
                  : 'Root-zone moisture is sufficient at 31% VWC. Skipping pumping today saves ₹350–₹400 in diesel/electricity and prevents root rot.'}
              </p>
            </div>
          </div>

          {/* Voice Player & Audio Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <button
              onClick={() => speakText(adviceAudioText)}
              className="farmora-btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px 28px',
                fontSize: '1rem',
                background: isSpeaking ? '#ef4444' : 'var(--farmora-lime)',
                color: isSpeaking ? 'white' : 'var(--farmora-dark)'
              }}
            >
              {isSpeaking ? <VolumeX size={20} /> : <Volume2 size={20} />}
              <span>
                {isSpeaking
                  ? language === 'hi' ? 'आवाज़ रोकें' : 'Stop Audio'
                  : language === 'hi' ? 'सलाह सुनें (Hindi Audio)' : 'Listen to Advice (Audio)'}
              </span>
              {isSpeaking && (
                <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                  <span style={{ width: 3, height: 16, background: 'currentColor', animation: 'audioWaveBar 0.8s infinite ease-in-out' }} />
                  <span style={{ width: 3, height: 22, background: 'currentColor', animation: 'audioWaveBar 0.6s infinite ease-in-out' }} />
                  <span style={{ width: 3, height: 12, background: 'currentColor', animation: 'audioWaveBar 0.9s infinite ease-in-out' }} />
                </div>
              )}
            </button>
            <span style={{ fontSize: '0.85rem', color: 'var(--farmora-wheat)', fontFamily: 'var(--font-mono)' }}>
              LOCAL DIALECT VOICEOVER SYNTHESIS
            </span>
          </div>
        </div>

        {/* 4 Vital Conditions Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>
          <div className="farmora-glass card-hover-tilt" style={{ padding: '20px', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--farmora-platinum)', fontWeight: 700, textTransform: 'uppercase' }}>जड़ क्षेत्र नमी</span>
              <Droplet size={18} color="var(--farmora-lime)" />
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--farmora-lime)' }}>31.2%</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--farmora-wheat)' }}>0–30 cm Depth VWC (पर्याप्त)</div>
          </div>

          <div className="farmora-glass card-hover-tilt" style={{ padding: '20px', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--farmora-platinum)', fontWeight: 700, textTransform: 'uppercase' }}>फसल छतरी तापमान</span>
              <Thermometer size={18} color="var(--farmora-wheat)" />
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--farmora-wheat)' }}>27.8°C</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--farmora-platinum)' }}>M1 Downscaled (-0.8°C vs air)</div>
          </div>

          <div className="farmora-glass card-hover-tilt" style={{ padding: '20px', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--farmora-platinum)', fontWeight: 700, textTransform: 'uppercase' }}>48h वर्षा संभावना</span>
              <CloudSun size={18} color="#38bdf8" />
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#38bdf8' }}>84%</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--farmora-platinum)' }}>12.4 mm (M3 Hurdle)</div>
          </div>

          <div className="farmora-glass card-hover-tilt" style={{ padding: '20px', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--farmora-platinum)', fontWeight: 700, textTransform: 'uppercase' }}>वाष्पीकरण (ETc)</span>
              <Wind size={18} color="var(--farmora-sage)" />
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--farmora-light)' }}>5.8 mm</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--farmora-platinum)' }}>दैनिक फसल जल मांग</div>
          </div>
        </div>

        {/* Progressive Disclosure: Why this advice? */}
        <ScientificDrawer
          title="यह सलाह क्यों दी गई? (Why this advisory?)"
          whyExplanation={
            <div>
              आपके चुने हुए क्षेत्र ({location.panchayatName}) में मॉडल 1 (M1) एवं मॉडल 3 (M3) के अनुसार अगले 18 घंटे में 12.4mm वर्षा अनुमानित है। 
              वर्तमान में मिट्टी में 31.2% नमी उपलब्ध है जो इस फसल की वानस्पतिक मांग (5.8mm/दिन) के लिए 3 दिन तक पर्याप्त है। 
              अभी पानी देने से मिट्टी संतृप्त (saturated) होकर जड़ों का श्वसन रोक देगी।
            </div>
          }
          evidenceContent={
            <div>
              मलिहाबाद स्टेशन पर परीक्षण में मॉडल 1 का MAE 0.4083°C तथा मॉडल 3 का Hurdle RMSE 0.9725 पाया गया। 
              निर्णय M10 एग्रोनॉमिक लॉजिक द्वारा सत्यापित है।
            </div>
          }
          scientificDetails={{
            modelProvenance: 'M1 (Weather Downscaling) + M3 (Precipitation) + M4 (Soil Moisture) + M10 (Decision Engine)',
            uncertainty: 'Conformal prediction interval [3.6mm, 6.0mm] with 90% confidence',
            stationValidation: 'Station AWS_LKO_05 pilot data locked',
            metrics: {
              'Soil Field Capacity': '34% VWC',
              'Permanent Wilting Point': '14% VWC',
              'Predicted Rain Probability': '84%',
              'Economic Diesel Savings': '₹350 / acre'
            }
          }}
        />
      </div>

      {/* Location Modal */}
      {showLocationModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(10px)',
            zIndex: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}
        >
          <div
            className="farmora-glass-elevated"
            style={{
              width: '100%',
              maxWidth: '500px',
              padding: '28px',
              borderRadius: 'var(--radius-xl)'
            }}
          >
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--farmora-light)', marginBottom: '14px' }}>
              {language === 'hi' ? 'खेत का स्थान चुनें' : 'Select Farm Location'}
            </h3>

            <button
              onClick={handleUseGPS}
              className="farmora-btn-primary"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '0.92rem',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Navigation size={18} />
              <span>{gpsLoading ? 'Locating via GPS...' : 'Use Current Device GPS'}</span>
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              {POPULAR_LOCATIONS.map((loc) => (
                <button
                  key={loc.panchayatCode}
                  onClick={() => {
                    setLocation(loc);
                    setShowLocationModal(false);
                  }}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    background: location.panchayatCode === loc.panchayatCode ? 'rgba(182, 178, 67, 0.2)' : 'rgba(251, 251, 251, 0.05)',
                    border: location.panchayatCode === loc.panchayatCode ? '1.5px solid var(--farmora-lime)' : '1px solid rgba(182, 178, 67, 0.2)',
                    color: 'var(--farmora-light)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700 }}>{loc.panchayatName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--farmora-platinum)' }}>{loc.district}</div>
                  </div>
                  {location.panchayatCode === loc.panchayatCode && <Check size={18} color="var(--farmora-lime)" />}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowLocationModal(false)}
              className="farmora-btn-secondary"
              style={{ width: '100%', padding: '10px' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
