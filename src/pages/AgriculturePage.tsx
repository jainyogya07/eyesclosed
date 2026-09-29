import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import {
  Sprout,
  AlertCircle,
  Calendar,
  Activity,
  Layers,
  Sparkles,
  Info,
  TrendingUp,
  CheckCircle2,
  Leaf,
  Bug,
  Droplet
} from 'lucide-react';

export const AgriculturePage: React.FC = () => {
  const { language, selectedCrop, setSelectedCrop } = useApp();
  const hi = language === 'hi';

  const crops = [
    { id: 'Paddy (Basmati)', nameHi: 'धान (बासमती PB-1509)', nameEn: 'Paddy (Basmati PB-1509)' },
    { id: 'Wheat (HD-2967)', nameHi: 'गेहूं (HD-2967)', nameEn: 'Wheat (HD-2967)' },
    { id: 'Mango (Dasheri)', nameHi: 'दशहरी आम (मलिहाबाद बाग)', nameEn: 'Dasheri Mango (Malihabad Orchard)' },
    { id: 'Mustard (Pusa)', nameHi: 'सरसों (पूसा बोल्ड)', nameEn: 'Mustard (Pusa Bold)' }
  ];

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="badge badge-frozen">
            {hi ? 'फसल अवस्था व स्वास्थ्य' : 'Crop Intelligence & Health'}
          </span>
          <span className="badge badge-pilot">
            {hi ? 'उपग्रह रिमोट सेंसिंग' : 'Sentinel-2 Remote Sensing'}
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sprout size={28} color="#059669" />
              {hi ? 'फसल अवस्था एवं स्वास्थ्य सलाहकार' : 'Crop Stage & Health Intelligence'}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              {hi
                ? 'सेंटिनल-2 उपग्रह और थर्मल डिग्री डेज़ (GDD) द्वारा आपकी फसल के विकास चरण और पोषण आवश्यकताओं की सटीक जानकारी।'
                : 'Phenological tracking combining Sentinel-2 multispectral vegetation indices and accumulated thermal Growing Degree Days (GDD).'}
            </p>
          </div>

          {/* Crop Selector */}
          <div style={{ background: 'white', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-md)', padding: '6px 12px' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', fontWeight: 700 }}>
              {hi ? 'फसल चुनें:' : 'SELECT CROP:'}
            </span>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                fontFamily: 'inherit',
                fontSize: '0.9rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                background: 'transparent',
                cursor: 'pointer'
              }}
            >
              {crops.map((c) => (
                <option key={c.id} value={c.id}>
                  {hi ? c.nameHi : c.nameEn}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Crop Analytics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '22px', background: 'white', borderRadius: 'var(--radius-xl)' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            {hi ? 'विकास अवस्था' : 'PHENOLOGICAL STAGE'}
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#059669', marginTop: '4px' }}>
            {hi ? 'बाली निकलने की अवस्था' : 'FLOWERING & HEADING'}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {hi ? 'दिन 65 (महत्वपूर्ण जल खिड़की)' : 'Day 65 (Critical moisture window)'}
          </div>
          <div style={{ marginTop: '14px', background: 'var(--bg-surface-subtle)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: '74%', height: '100%', background: '#059669' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            <span>{hi ? 'बुवाई (दिन 0)' : 'Sowing (Day 0)'}</span>
            <span>{hi ? 'परिपक्वता (दिन 115)' : 'Harvest (Day 115)'}</span>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '22px', background: 'white', borderRadius: 'var(--radius-xl)' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            {hi ? 'थर्मल ताप संचय' : 'THERMAL GDD ACCUMULATION'}
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0284c7', marginTop: '4px' }}>
            1,380.4 °C-Days
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {hi ? 'परिपक्वता लक्ष्य: 1,850.0 °C-Days (74.6% पूर्ण)' : 'Target Maturity: 1,850.0 °C-Days (74.6% complete)'}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#059669', marginTop: '8px', fontWeight: 600 }}>
            {hi ? 'आधार तापमान: 10.0°C (खरीफ मानक)' : 'Base Temp (Tbase): 10.0°C (Kharif standard)'}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '22px', background: 'white', borderRadius: 'var(--radius-xl)' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            {hi ? 'कैनोपी स्वास्थ्य (NDRE)' : 'CHLOROPHYLL VIGOR (NDRE)'}
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
            0.82 ({hi ? 'उत्कृष्ट स्वास्थ्य' : 'High Vigor'})
          </div>
          <div style={{ fontSize: '0.85rem', color: '#059669', marginTop: '4px', fontWeight: 600 }}>
            {hi ? '5-वर्षीय औसत से +6.8% बेहतर' : '+6.8% vs 5-Year Historical Benchmark'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
            {hi ? 'स्रोत: सेंटिनल-2 रेड-एज बैंड' : 'Source: Sentinel-2 Red-Edge Band 5/7'}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '22px', background: 'white', borderRadius: 'var(--radius-xl)' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            {hi ? 'अनुमानित पैदावार' : 'PROJECTED HARVEST YIELD'}
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#059669', marginTop: '4px' }}>
            {hi ? '4.35 टन / हेक्टेयर' : '4.35 Tons / Ha'}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {hi ? 'सीमा: [3.95 – 4.70 टन/हे.]' : 'Expected: [3.95 – 4.70 Tons/Ha]'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
            {hi ? 'कटाई अनुमान: 25 अक्टूबर – 05 नवंबर' : 'Estimated Harvest: 25 Oct – 05 Nov'}
          </div>
        </div>
      </div>

      {/* Actionable Agronomic Advisory Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Fertilizer & Nutrient Card */}
        <div className="glass-panel" style={{ padding: '22px', background: 'white', borderRadius: 'var(--radius-xl)', borderLeft: '4px solid #16a34a' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#16a34a', fontWeight: 800, fontSize: '0.9rem', marginBottom: '8px' }}>
            <Leaf size={18} />
            <span>{hi ? 'पोषक तत्व व खाद सलाह (Nutrient Care)' : 'Nutrient & Fertilizer Advisory'}</span>
          </div>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', fontWeight: 800, marginBottom: '6px' }}>
            {hi ? 'यूरिया की दूसरी टॉप-ड्रेसिंग' : 'Second Top-Dressing of Urea'}
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
            {hi
              ? 'बाली निकलते समय 30 किग्रा यूरिया प्रति एकड़ का छिड़काव आवश्यक है। लेकिन आज रात 12.4 मिमी बारिश होने के कारण अभी खाद न डालें। बारिश के 24 घंटे बाद छिड़काव करें।'
              : 'Heading stage requires 30 kg/acre Urea. However, hold broadcasting today due to the 12.4 mm rain forecast tonight. Apply 24 hours post-rain when soil is moist but not muddy.'}
          </p>
        </div>

        {/* Pest & Disease Card */}
        <div className="glass-panel" style={{ padding: '22px', background: 'white', borderRadius: 'var(--radius-xl)', borderLeft: '4px solid #0284c7' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0284c7', fontWeight: 800, fontSize: '0.9rem', marginBottom: '8px' }}>
            <Bug size={18} />
            <span>{hi ? 'कीट व फफूंद सुरक्षा (Pest & Disease)' : 'Pest & Disease Surveillance'}</span>
          </div>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', fontWeight: 800, marginBottom: '6px' }}>
            {hi ? 'ब्लास्ट व शीथ ब्लाइट का कम जोखिम' : 'Low Fungal Blast & Sheath Blight Risk'}
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
            {hi
              ? 'वर्तमान में तापमान 28°C और आर्द्रता 68% है। फफूंद का कोई खतरा नहीं है। किसी भी रासायनिक कीटनाशक के अनावश्यक छिड़काव से बचें और ₹450/एकड़ दवा खर्च बचाएं।'
              : 'Canopy microclimate shows 28°C and 68% relative humidity. Fungal spore germination index remains low (22%). Avoid chemical sprays to save ₹450/acre.'}
          </p>
        </div>

        {/* Water Management Card */}
        <div className="glass-panel" style={{ padding: '22px', background: 'white', borderRadius: 'var(--radius-xl)', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d97706', fontWeight: 800, fontSize: '0.9rem', marginBottom: '8px' }}>
            <Droplet size={18} />
            <span>{hi ? 'खेत में पानी का स्तर (Water Depth)' : 'Ponding Water Management'}</span>
          </div>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', fontWeight: 800, marginBottom: '6px' }}>
            {hi ? 'खेत में 2-3 सेमी पानी पर्याप्त' : 'Maintain 2–3 cm Standing Water'}
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
            {hi
              ? 'आने वाली बारिश से खेतों में पानी का स्तर अपने आप बढ़ जाएगा। खेत की मेड़ें मजबूत रखें ताकि बारिश का पानी खेत में ही रुका रहे और भूजल रीचार्ज हो।'
              : 'Tonight\'s rain will naturally replenish field depth. Ensure bunds are intact to harvest rain in-situ, preventing water runoff into roadside drains.'}
          </p>
        </div>
      </div>
    </div>
  );
};
