import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n';
import { SocialMediaLinks } from '../brand/SocialIcons';

export const Footer: React.FC = () => {
  const { t, hi } = useI18n();

  return (
    <footer className="platform-footer" aria-label="MausamSetu Footer">
      <div className="platform-footer-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Link to="/home" style={{ display: 'inline-block' }}>
            <img
              src="/assets/mausam-setu-logo.png"
              alt="MausamSetu Logo - Sahi Samay, Sahi Salah, Har Kisaan Tak"
              style={{
                height: '52px',
                width: 'auto',
                maxWidth: '220px',
                objectFit: 'contain',
                borderRadius: '8px'
              }}
            />
          </Link>
          <strong style={{ fontSize: '0.86rem', color: '#059669', letterSpacing: '0.02em' }}>
            {t('slogan')}
          </strong>
          <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b', lineHeight: 1.4 }}>
            {t('footer_copy')}
          </p>
          <span className="footer-status">
            <i /> {t('footer_live')}
          </span>

          <div style={{ marginTop: '6px' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '6px' }}>
              {t('footer_connect')}:
            </span>
            <SocialMediaLinks compact />
          </div>
        </div>

        <div>
          <h3>{t('footer_explore')}</h3>
          <Link to="/home">{t('footer_home')}</Link>
          <Link to="/my-farm">{hi ? 'मेरा खेत केंद्र' : 'My Farm Center'}</Link>
          <Link to="/panchayat">{hi ? 'पंचायत ग्रिड' : 'Panchayat Grid'}</Link>
          <Link to="/crops">{hi ? 'फसल उपयुक्तता' : 'Crop Intelligence'}</Link>
          <Link to="/weather">{hi ? 'मौसम पूर्वानुमान' : 'Weather Forecast'}</Link>
          <Link to="/digital-twin">{hi ? 'डिजिटल ट्विन 3D' : 'Digital Twin 3D'}</Link>
        </div>

        <div>
          <h3>{hi ? 'इंटेलिजेंस' : 'Intelligence'}</h3>
          <Link to="/water">{hi ? 'जल व मृदा नमी' : 'Water & Soil Moisture'}</Link>
          <Link to="/scenario">{hi ? 'जलवायु परिदृश्य लैब' : 'Climate Scenario Lab'}</Link>
          <Link to="/risks">{hi ? 'आपदा व जोखिम अलर्ट' : 'Hazards & Risks'}</Link>
          <Link to="/advice">{hi ? 'कार्यकारी सलाह' : 'Action Advisory'}</Link>
          <Link to="/features">{hi ? 'प्लेटफ़ॉर्म फीचर्स' : 'Platform Features'}</Link>
        </div>

        <div>
          <h3>{hi ? 'विज्ञान व शोध' : 'Science & Platform'}</h3>
          <Link to="/explore">{hi ? 'एक्सप्लोर केंद्र' : 'Explore Science Hub'}</Link>
          <Link to="/model-lab">{hi ? 'AI मॉडल लैब M1–M10' : 'AI Model Lab M1–M10'}</Link>
          <Link to="/data-center">{hi ? 'डेटा केंद्र व टेलीमेट्री' : 'Data Center & Telemetry'}</Link>
          <Link to="/validation">{hi ? 'मॉडल सत्यापन मेट्रिक्स' : 'Validation & Benchmarks'}</Link>
          <Link to="/about">{t('footer_about')}</Link>
        </div>
      </div>

      <div className="platform-footer-bottom">
        <span>{t('footer_rights')}</span>
        <span>{hi ? 'राष्ट्रीय कृषि जलवायु निर्णय समर्थन प्रणाली' : 'National Agricultural Climate Decision Support System'}</span>
      </div>
    </footer>
  );
};
