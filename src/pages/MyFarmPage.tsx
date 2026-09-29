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
  Navigation
} from 'lucide-react';
import { ScientificDrawer } from '../components/common/ScientificDrawer';
import { StatusBadge } from '../components/common/StatusBadge';
import { AtmosphericBackground } from '../components/common/AtmosphericBackground';

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
  const [searchQuery, setSearchQuery] = useState('');
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
    <div style={{ position: 'relative', minHeight: 'calc(100vh - 120px)', padding: '2rem 1.5rem 5rem 1.5rem', background: 'var(--bg-primary)' }}>
      <AtmosphericBackground intensity="subtle" showGrid={true} />

      <div style={{ maxWidth: '840px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Top: Location & Crop Bar */}
        <div
          className="glass-panel"
          style={{
            padding: '16px 20px',
            marginBottom: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            borderRadius: 'var(--radius-lg)'
          }}
        >
          {/* Location Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={20} color="var(--color-earth-emerald)" />
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {language === 'hi' ? 'खेत का स्थान' : 'FARM LOCATION'}
              </div>
              <button
                onClick={() => setShowLocationModal(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: 0
                }}
              >
                {location.panchayatName}
                <ChevronDown size={16} color="var(--text-secondary)" />
              </button>
            </div>
          </div>

          {/* Crop Selector Chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            {CROPS.map((crop) => {
              const isSelected = selectedCrop.includes(crop.nameEn);
              return (
                <button
                  key={crop.id}
                  onClick={() => setSelectedCrop(language === 'hi' ? crop.nameHi : `${crop.nameEn} (${crop.stageEn})`)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-full)',
                    border: isSelected ? '1.5px solid var(--color-earth-emerald)' : '1px solid var(--border-subtle)',
                    background: isSelected ? 'var(--color-earth-subtle)' : 'white',
                    color: isSelected ? 'var(--color-earth-emerald)' : 'var(--text-secondary)',
                    fontWeight: isSelected ? 700 : 500,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
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
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
            border: '2px solid var(--color-earth-light)',
            borderRadius: 'var(--radius-xl)',
            padding: '2.5rem 2rem',
            boxShadow: 'var(--shadow-lg)',
            marginBottom: '1.75rem',
            position: 'relative'
          }}
        >
          {/* Header row in card */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <StatusBadge status="frozen" label={language === 'hi' ? 'आज का सीधा फैसला' : "TODAY'S DECISION"} />
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                {language === 'hi' ? 'अपडेट: अभी' : 'UPDATED: JUST NOW'}
              </span>
            </div>

            {/* Audio Read-out button */}
            <button
              onClick={() => speakText(adviceAudioText)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                background: isSpeaking ? 'var(--color-earth-emerald)' : 'var(--color-earth-subtle)',
                color: isSpeaking ? 'white' : 'var(--color-earth-emerald)',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              {isSpeaking ? <VolumeX size={18} /> : <Volume2 size={18} />}
              {isSpeaking
                ? language === 'hi'
                  ? 'आवाज़ बंद करें'
                  : 'Stop Voice'
                : language === 'hi'
                ? 'बोलकर सुनें'
                : 'Listen to Advice'}
            </button>
          </div>

          {/* Big Recommendation Hero */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div
              style={{
                fontSize: '3.5rem',
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
              <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-atmosphere-blue)', marginBottom: '4px' }}>
                {language === 'hi' ? 'अगले 18 घंटे में वर्षा अनुमान' : 'Incoming Rainfall within 18 Hours'}
              </div>
              <h1
                style={{
                  fontSize: 'clamp(2rem, 5vw, 2.8rem)',
                  fontWeight: 800,
                  color: 'var(--color-hazard-crimson)',
                  lineHeight: 1.15,
                  marginBottom: '8px',
                  letterSpacing: '-0.02em'
                }}
              >
                {language === 'hi' ? 'आज सिंचाई रोकें' : 'Hold Irrigation Today'}
              </h1>
              <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
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
                    <strong>3. बचत:</strong> आज ट्यूबवेल न चलाने से आपके लगभग ₹350–₹400 का डीजल व बिजली का खर्च बचेगा और खेत में जलभराव का खतरा टलेगा।
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
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '12px' }}>
            {language === 'hi' ? 'खेत की 4 मुख्य स्थितियां' : 'FOUR VITAL FARM CONDITIONS'}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            {/* 1. Weather */}
            <div className="glass-panel" style={{ padding: '18px', background: 'white', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-atmosphere-blue)', marginBottom: '8px' }}>
                <CloudSun size={20} />
                <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase' }}>
                  {language === 'hi' ? 'तापमान (Weather)' : 'Weather'}
                </span>
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                28.2°C
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {language === 'hi' ? 'हल्के बादल, सुहावना' : 'Partly Cloudy'}
              </div>
            </div>

            {/* 2. Soil */}
            <div className="glass-panel" style={{ padding: '18px', background: 'white', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-earth-emerald)', marginBottom: '8px' }}>
                <Droplet size={20} />
                <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase' }}>
                  {language === 'hi' ? 'मिट्टी (Soil)' : 'Soil Moisture'}
                </span>
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                31%
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-earth-emerald)', fontWeight: 600 }}>
                {language === 'hi' ? 'पर्याप्त नमी (Moist)' : 'Adequate Moisture'}
              </div>
            </div>

            {/* 3. Rain */}
            <div className="glass-panel" style={{ padding: '18px', background: 'white', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-atmosphere-blue)', marginBottom: '8px' }}>
                <span style={{ fontSize: '1.2rem' }}>🌧️</span>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase' }}>
                  {language === 'hi' ? 'बारिश (Rain)' : 'Rain Forecast'}
                </span>
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                12.4 mm
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {language === 'hi' ? 'अगले 18 घंटे में (84% संभावना)' : 'In 18h (84% prob)'}
              </div>
            </div>

            {/* 4. Crop */}
            <div className="glass-panel" style={{ padding: '18px', background: 'white', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#16a34a', marginBottom: '8px' }}>
                <Sprout size={20} />
                <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase' }}>
                  {language === 'hi' ? 'फसल (Crop)' : 'Crop State'}
                </span>
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentCropObj.nameEn}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
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
              background: 'rgba(15, 23, 42, 0.45)',
              backdropFilter: 'blur(4px)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem'
            }}
          >
            <div
              className="glass-panel-elevated"
              style={{
                width: '100%',
                maxWidth: '520px',
                background: 'white',
                borderRadius: 'var(--radius-xl)',
                padding: '24px',
                boxShadow: 'var(--shadow-xl)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>
                  {language === 'hi' ? 'अपना खेत / गांव चुनें' : 'Select Farm Location'}
                </h3>
                <button
                  onClick={() => setShowLocationModal(false)}
                  style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--text-muted)' }}
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
                  gap: '8px',
                  padding: '12px',
                  background: 'var(--color-atmosphere-subtle)',
                  border: '1.5px solid var(--color-atmosphere-light)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--color-atmosphere-blue)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  marginBottom: '1.25rem'
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
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
                {language === 'hi' ? 'पायलट क्लस्टर के गांव' : 'PILOT CLUSTER PANCHAYATS'}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {POPULAR_LOCATIONS.map((loc) => {
                  const isCurrent = loc.panchayatCode === location.panchayatCode;
                  return (
                    <div
                      key={loc.panchayatCode}
                      onClick={() => {
                        setLocation(loc);
                        setShowLocationModal(false);
                      }}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 'var(--radius-md)',
                        border: isCurrent ? '1.5px solid var(--color-earth-emerald)' : '1px solid var(--border-subtle)',
                        background: isCurrent ? 'var(--color-earth-subtle)' : '#f8fafc',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'background 0.15s ease'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                          {loc.panchayatName}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          {loc.district} • Lat {loc.lat}, Lon {loc.lon}
                        </div>
                      </div>
                      {isCurrent && <Check size={18} color="var(--color-earth-emerald)" />}
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
