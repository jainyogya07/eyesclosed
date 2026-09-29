import React from 'react';
import {
  Info,
  ShieldCheck,
  CheckCircle2,
  Users,
  Compass,
  AlertTriangle,
  HeartHandshake,
  Layers
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export const AboutPage: React.FC = () => {
  const { language } = useApp();
  const hi = language === 'hi';

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="badge badge-frozen">Smart India Hackathon</span>
          <span className="badge badge-pilot">{hi ? 'सिस्टम वास्तुकला' : 'Architecture Specification'}</span>
        </div>
        <h1 style={{ fontSize: '2.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Info size={32} color="var(--color-atmosphere-blue)" />
          {hi ? 'मौसम सेतु के बारे में' : 'About Mausam Setu'}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          {hi
            ? 'भारतीय छोटे और सीमांत किसानों के लिए स्थानीय मौसम, मिट्टी और AI आधारित कृषि निर्णय प्रणाली।'
            : 'An AI-native climate intelligence and agricultural decision cascade designed for smallholder Indian farming resilience.'}
        </p>
      </div>

      {/* 3 Audience Tiers */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.6rem', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
          {hi ? 'तीन उपयोगकर्ता दृष्टिकोण' : 'Who We Serve (Three Operating Perspectives)'}
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '24px', background: 'white', borderRadius: 'var(--radius-xl)' }}>
            <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--color-earth-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <HeartHandshake size={24} color="var(--color-earth-emerald)" />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', color: 'var(--color-earth-emerald)' }}>
              {hi ? '1. किसान भाइयों के लिए' : '1. For Farmers'}
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {hi
                ? 'सीधे और स्पष्ट कृषि निर्देश, जिन्हें ऑडियो संदेश के रूप में भी सुना जा सकता है। आज क्या करना है और क्या नहीं करना है (सिंचाई, खाद, छिड़काव), जिससे डीजल और फसल दोनों की बचत हो।'
                : 'Direct, unequivocal action advisories delivered in simple Hindi via audio notes. Clear DO / DO NOT guidance for irrigation pumping and chemical spraying, preventing wasted diesel and chemical wash-off.'}
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '24px', background: 'white', borderRadius: 'var(--radius-xl)' }}>
            <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--color-atmosphere-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <Users size={24} color="var(--color-atmosphere-blue)" />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', color: 'var(--color-atmosphere-blue)' }}>
              {hi ? '2. पंचायत एवं कृषि अधिकारियों के लिए' : '2. For Panchayats & Officers'}
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {hi
                ? 'पंचायत डिजिटल ट्विन और सैंडबॉक्स। अधिकारी एक साथ 50 गांवों में मिट्टी की नमी, जलभराव और फसल तनाव देखकर नहर से पानी छोड़ने की सही योजना बना सकते हैं।'
                : 'A cyber-physical Panchayat Digital Twin and What-If simulator. Extension officers can monitor soil moisture stress and flood waterlogging across 50 villages simultaneously and route canal irrigation proactively.'}
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '24px', background: 'white', borderRadius: 'var(--radius-xl)' }}>
            <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'rgba(124, 58, 237, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <ShieldCheck size={24} color="var(--color-quantum-violet)" />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', color: 'var(--color-quantum-violet)' }}>
              {hi ? '3. वैज्ञानिकों एवं समीक्षकों के लिए' : '3. For Scientists & Reviewers'}
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {hi
                ? 'पूर्ण वैज्ञानिक पारदर्शिता: 1-किमी डाउनस्केलिंग, कन्फॉर्मल क्वांटाइल रिग्रेशन (CQR), स्वतंत्र मौसम स्टेशन परीक्षण (AWS_LKO_05) और सत्यापन रिपोर्ट।'
                : 'Complete transparency: metric projected CRS (EPSG:32644), Conformal Quantile Regression (CQR) certified 90% bounds, SHA-256 cryptographic model hashes, and Leave-One-Station-Out independent ground station benchmarks.'}
            </p>
          </div>
        </div>
      </div>

      {/* Responsible AI Principles & Abstention Protocol */}
      <div className="glass-panel" style={{ padding: '28px', background: 'white', borderRadius: 'var(--radius-xl)', marginBottom: '3rem', borderLeft: '5px solid var(--color-earth-emerald)' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '12px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShieldCheck size={26} color="var(--color-earth-emerald)" />
          Responsible AI & The "Honest AI" Abstention Gate
        </h2>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '14px' }}>
          Conventional generative AI and uncalibrated neural networks frequently hallucinate high confidence even under severe out-of-distribution domain shift. In agricultural decision-making, a wrong prediction can bankrupt a smallholder farmer.
        </p>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          <strong>Mausam Setu enforces a strict Abstention Gate:</strong> If atmospheric chaos causes conformal prediction interval width to exceed safe operating bounds or input features violate physical constraints, the AI explicitly states: <em>"Prediction Withheld — High Atmospheric Volatility"</em> and seamlessly defers to official IMD district advisories.
        </p>
      </div>

      {/* Limitations Disclaimer */}
      <div className="glass-panel" style={{ padding: '24px', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-xl)' }}>
        <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={18} color="var(--color-solar-amber)" />
          Known Operational Limitations
        </h3>
        <ul style={{ paddingLeft: '20px', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          <li>Currently benchmarked on a 72-hour pilot dataset across 5 AWS stations in Lucknow district.</li>
          <li>Not calibrated for complex mountainous terrain (Himalayas / Western Ghats) without regional retraining.</li>
          <li>Models 4, 5, 7, 8, 9, 10 are currently simulated against physical specifications while active training queue slots progress.</li>
        </ul>
      </div>
    </div>
  );
};
