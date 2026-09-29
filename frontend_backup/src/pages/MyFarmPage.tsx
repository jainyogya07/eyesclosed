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
  Sparkles
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
    <div style={{ position: 'relative', minHeight: 'calc(100vh - 120px)', padding: '2.5rem 1.5rem 6rem 1.5rem' }}>
      {/* Background Animated Farm Environment with floating pollen */}
      <CinematicFarmBackground variant="golden_farm" showParticles={true} overlayOpacity={0.65} />

      <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Top: Location & Crop Bar (Cockpit Glass Bar) */}
        <div
          className="cinematic-glass-elevated"
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
            <div style={{ padding: '8px', borderRadius: '50%', background: 'var(--color-earth-subtle)' }}>
              <MapPin size={22} color="var(--color-earth-emerald)" />
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                {language === 'hi' ? 'खेत का स्थान' : 'FARM LOCATION'}
              </div>
              <button
                onClick={() => setShowLocationModal(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: 0
                }}
              >
                <span>{location.panchayatName}</span>
                <ChevronDown size={18} color="var(--color-earth-emerald)" />
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
                  onClick={() => setSelectedCrop(language === 'hi' ? crop.nameHi : `${crop.nameEn} (${crop.stageEn})`)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-full)',
                    border: isSelected ? '2px solid var(--color-earth-emerald)' : '1px solid rgba(255,255,255,0.8)',
                    background: isSelected ? 'var(--color-earth-deep)' : 'rgba(255, 255, 255, 0.85)',
                    color: isSelected ? 'white' : 'var(--text-secondary)',
                    fontWeight: isSelected ? 800 : 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? '0 4px 14px rgba(5, 150, 105, 0.35)' : 'none'
                  }}
                >
                  {language === 'hi' ? crop.nameHi : crop.nameEn}
                </button>
              );
            })}
          </div>
        </div>

        {/* MIDDLE: THE BIG SINGLE RECOMMENDATION (5-SECOND ANSWER) */}
        <div
          className="cinematic-glass-elevated card-hover-tilt"
          style={{
            borderRadius: 'var(--radius-xl)',
            padding: '3rem 2.5rem',
            marginBottom: '2rem',
            border: '2.5px solid var(--color-earth-light)',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.97) 0%, rgba(240,253,244,0.94) 100%)',
            boxShadow: '0 30px 70px -15px rgba(5, 150, 105, 0.3)'
          }}
        >
          {/* Header row in card */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <StatusBadge status="frozen" label={language === 'hi' ? 'आज का सीधा फैसला' : "TODAY'S FARM DECISION"} />
              <span style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                {language === 'hi' ? 'अपडेट: अभी' : 'UPDATED: JUST NOW'}
              </span>
            </div>

            {/* Audio Read-out button with live visualizer waveform */}
            <button
              onClick={() => speakText(adviceAudioText)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 20px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                background: isSpeaking ? 'var(--color-hazard-crimson)' : 'var(--color-earth-deep)',
                color: 'white',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(6, 78, 59, 0.35)',
                transition: 'all 0.2s ease'
              }}
            >
              {isSpeaking ? <VolumeX size={18} /> : <Volume2 size={18} />}
              <span>{isSpeaking ? (language === 'hi' ? 'आवाज़ बंद करें' : 'Stop Audio') : (language === 'hi' ? 'बोलकर सुनें' : 'Listen to Advice')}</span>

              {/* Animated Waveform bars when speaking */}
              {isSpeaking && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '16px' }}>
                  {[1, 2, 3, 4].map((i) => (
                    <span
                      key={i}
                      style={{
                        width: '3px',
                        background: 'white',
                        borderRadius: '2px',
                        animation: `audioWaveBar 0.${4 + i}s infinite ease-in-out`
                      }}
                    />
                  ))}
                </div>
              )}
            </button>
          </div>

          {/* Big Recommendation Hero */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.75rem', marginBottom: '1.5rem' }}>
            <div
              style={{
                fontSize: '3.8rem',
                lineHeight: 1,
                padding: '16px',
                background: 'white',
                borderRadius: 'var(--radius-xl)',
                border: '1.5px solid var(--border-card)',
                boxShadow: '0 8px 20px rgba(0,0,0,0.06)'
              }}
            >
              🌧️
            </div>

            <div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-atmosphere-blue)', marginBottom: '4px' }}>
                {language === 'hi' ? 'अगले 18 घंटे में वर्षा अनुमान (84% संभावना)' : 'Incoming Rainfall within 18 Hours (84% prob)'}
              </div>
              <h1
                style={{
                  fontSize: 'clamp(2.4rem, 5.5vw, 3.4rem)',
                  fontWeight: 800,
                  color: 'var(--color-hazard-crimson)',
                  lineHeight: 1.1,
                  marginBottom: '10px',
                  letterSpacing: '-0.03em'
                }}
              >
                {language === 'hi' ? 'आज सिंचाई रोकें' : 'Hold Irrigation Today'}
              </h1>
              <p style={{ fontSize: '1.2rem', color: 'var(--text-primary)', lineHeight: 1.5, fontWeight: 500 }}>
                {language === 'hi'
                  ? 'खेत में ट्यूबवेल न चलाएं। आने वाली बारिश और वर्तमान मिट्टी की नमी फसल के लिए पर्याप्त है।'
                  : 'Do not pump groundwater today. Impending rain and current root-zone moisture are sufficient.'}
              </p>
            </div>
          </div>

          {/* Progressive Disclosure Level 2, 3, 4 */}
          <ScientificDrawer
            title={language === 'hi' ? 'यह सलाह क्यों दी गई है? (विस्तार देखें)' : 'Why this advice? (Click to expand)'}
            whyExplanation={
              language === 'hi' ? (
                <div>
                  <p style={{ marginBottom: '8px' }}>
                    <strong>1. आने वाली बारिश:</strong> हमारे 1-किमी मॉडल ने आपके मलिहाबाद क्षेत्र में अगले 18 घंटों में 12.4 मिमी बारिश का अनुमान लगाया है।
                  </p>
                  <p style={{ marginBottom: '8px' }}>
                    <strong>2. मिट्टी में पर्याप्त नमी:</strong> वर्तमान में जड़ क्षेत्र (0–30 सेमी) में मिट्टी की नमी 31% (VWC) है, जो {currentCropObj.nameHi} की पुष्पन अवस्था के लिए आदर्श है।
                  </p>
                  <p>
                    <strong>3. बचत:</strong> आज ट्यूबवेल न चलाने से आपके लगभग <strong>₹350–₹400 का डीजल व बिजली का खर्च बचेगा</strong> और खेत में जलभराव का खतरा टलेगा।
                  </p>
                </div>
              ) : (
                <div>
                  <p style={{ marginBottom: '8px' }}>
                    <strong>1. Precipitation Arrival:</strong> 1-km weather downscaling indicates 12.4 mm rainfall within 18 hours (probability 84%).
                  </p>
                  <p style={{ marginBottom: '8px' }}>
                    <strong>2. Soil Moisture Buffer:</strong> Active root-zone (0-30cm) moisture is 31% VWC, fully within the optimum comfort range for {currentCropObj.nameEn}.
                  </p>
                  <p>
                    <strong>3. Direct Savings:</strong> Holding pumping cycles preserves ~₹350 to ₹400 in diesel/electricity expenses and prevents nitrogen leaching.
                  </p>
                </div>
              )
            }
            evidenceContent={
              <ul style={{ paddingLeft: '20px', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                <li>Lucknow IMD AWS Telemetry: 28.2°C surface temperature (Model 1 calibrated).</li>
                <li>Precipitation Downscaling (Model 3 Hurdle Formulation): 12.4 mm ± 1.2 mm uncertainty.</li>
                <li>Sentinel-1 synthetic aperture radar soil backscatter proxy: 31% volumetric moisture.</li>
              </ul>
            }
            scientificDetails={{
              modelProvenance: 'M1 (1-km Downscaling) + M3 (Precipitation Hurdle) + M6 (ET Demand Physics Engine)',
              uncertainty: 'Conformal Prediction Band [9.6 mm, 14.8 mm] at 90% coverage level',
              stationValidation: 'Locked test station AWS_LKO_05 (72-hour Lucknow pilot)',
              metrics: {
                'M1 MAE': '0.4083°C',
                'M3 Hurdle RMSE': '0.9725 mm/h',
                'MAE Reduction': '39.89%',
                'Validation Base': 'Locked 72h Pilot'
              }
            }}
          />
        </div>

        {/* BELOW: ONLY 4 VITAL METRICS (Weather, Soil, Rain, Crop) */}
        <div>
          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-earth-deep)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} />
            <span>{language === 'hi' ? 'खेत की 4 मुख्य स्थितियां' : 'FOUR VITAL FARM CONDITIONS'}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '1.25rem' }}>
            {/* 1. Weather */}
            <div className="cinematic-glass card-hover-tilt" style={{ padding: '22px', borderRadius: 'var(--radius-xl)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-atmosphere-blue)', marginBottom: '10px' }}>
                <CloudSun size={24} />
                <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>
                  {language === 'hi' ? 'तापमान' : 'Temperature'}
                </span>
              </div>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                28.2°C
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                {language === 'hi' ? 'हल्के बादल, सुहावना' : 'Partly Cloudy'}
              </div>
            </div>

            {/* 2. Soil */}
            <div className="cinematic-glass card-hover-tilt" style={{ padding: '22px', borderRadius: 'var(--radius-xl)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-earth-emerald)', marginBottom: '10px' }}>
                <Droplet size={24} />
                <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>
                  {language === 'hi' ? 'मिट्टी नमी' : 'Soil Moisture'}
                </span>
              </div>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                31%
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-earth-emerald)', fontWeight: 700 }}>
                {language === 'hi' ? 'पर्याप्त नमी (Moist)' : 'Adequate Moisture'}
              </div>
            </div>

            {/* 3. Rain */}
            <div className="cinematic-glass card-hover-tilt" style={{ padding: '22px', borderRadius: 'var(--radius-xl)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-atmosphere-blue)', marginBottom: '10px' }}>
                <span style={{ fontSize: '1.4rem' }}>🌧️</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>
                  {language === 'hi' ? 'बारिश' : 'Rain Forecast'}
                </span>
              </div>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                12.4 mm
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                {language === 'hi' ? 'अगले 18 घंटे में (84%)' : 'Next 18h (84% prob)'}
              </div>
            </div>

            {/* 4. Crop */}
            <div className="cinematic-glass card-hover-tilt" style={{ padding: '22px', borderRadius: 'var(--radius-xl)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#16a34a', marginBottom: '10px' }}>
                <Sprout size={24} />
                <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>
                  {language === 'hi' ? 'फसल' : 'Crop State'}
                </span>
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentCropObj.nameEn}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                {language === 'hi' ? currentCropObj.stageHi : currentCropObj.stageEn}
              </div>
            </div>
          </div>
        </div>

        {/* Location Picker Modal */}
        {showLocationModal && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(8px)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem'
            }}
          >
            <div
              className="cinematic-glass-elevated"
              style={{
                width: '100%',
                maxWidth: '520px',
                borderRadius: 'var(--radius-xl)',
                padding: '28px',
                boxShadow: '0 30px 70px rgba(0,0,0,0.3)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {language === 'hi' ? 'अपना खेत / गांव चुनें' : 'Select Farm Location'}
                </h3>
                <button
                  onClick={() => setShowLocationModal(false)}
                  style={{ background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  ✕
                </button>
              </div>

              {/* GPS Auto-detect Button */}
              <button
                onClick={handleUseGPS}
                disabled={gpsLoading}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  padding: '14px',
                  background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  color: 'white',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  marginBottom: '1.5rem',
                  boxShadow: '0 4px 15px rgba(2, 132, 199, 0.35)'
                }}
              >
                <Navigation size={18} />
                {gpsLoading
                  ? language === 'hi'
                    ? 'GPS से खोजा जा रहा है...'
                    : 'Locating via GPS...'
                  : language === 'hi'
                  ? 'वर्तमान GPS लोकेशन इस्तेमाल करें'
                  : 'Use Current GPS Location'}
              </button>

              {/* Village List */}
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase' }}>
                {language === 'hi' ? 'पायलट क्लस्टर के गांव' : 'PILOT CLUSTER PANCHAYATS'}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {POPULAR_LOCATIONS.map((loc) => {
                  const isCurrent = loc.panchayatCode === location.panchayatCode;
                  return (
                    <div
                      key={loc.panchayatCode}
                      onClick={() => {
                        setLocation(loc);
                        setShowLocationModal(false);
                      }}
                      className="card-hover-tilt"
                      style={{
                        padding: '14px 16px',
                        borderRadius: 'var(--radius-md)',
                        border: isCurrent ? '2px solid var(--color-earth-emerald)' : '1px solid var(--border-subtle)',
                        background: isCurrent ? 'var(--color-earth-subtle)' : 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1rem' }}>
                          {loc.panchayatName}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                          {loc.district} • Lat {loc.lat}, Lon {loc.lon}
                        </div>
                      </div>
                      {isCurrent && <Check size={20} color="var(--color-earth-emerald)" />}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
