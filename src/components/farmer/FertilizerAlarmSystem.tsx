import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import {
  Bell,
  CloudRain,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  PhoneCall,
  MessageSquare,
  Sparkles,
  Volume2,
  Calendar,
  DollarSign,
  ArrowRight
} from 'lucide-react';

export const FertilizerAlarmSystem: React.FC = () => {
  const { language, speakText, isSpeaking, location } = useApp();
  const hi = language === 'hi';

  const [activePlan, setActivePlan] = useState<'sms' | 'call'>('call');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [selectedDay, setSelectedDay] = useState(1);

  const forecastDays = [
    { day: hi ? 'आज (दिन 1)' : 'Today (D1)', rainMm: 0.1, temp: '33°C', safe: true, label: hi ? 'सुरक्षित छिड़काव' : 'Safe Window' },
    { day: hi ? 'कल (दिन 2)' : 'Tomorrow (D2)', rainMm: 0.0, temp: '34°C', safe: true, label: hi ? 'सुरक्षित' : 'Safe' },
    { day: hi ? 'दिन 3' : 'Day 3', rainMm: 0.8, temp: '32°C', safe: true, label: hi ? 'अनुकूल' : 'Optimal' },
    { day: hi ? 'दिन 4' : 'Day 4', rainMm: 0.2, temp: '33°C', safe: true, label: hi ? 'अंतिम विंडो' : 'Final Window' },
    { day: hi ? 'दिन 5' : 'Day 5', rainMm: 3.5, temp: '30°C', safe: false, label: hi ? 'सावधानी' : 'Caution' },
    { day: hi ? 'दिन 6' : 'Day 6', rainMm: 28.6, temp: '27°C', safe: false, label: hi ? 'भारी वर्षा ⚠️' : 'Heavy Rain ⚠️' },
    { day: hi ? 'दिन 7' : 'Day 7', rainMm: 18.2, temp: '26°C', safe: false, label: hi ? 'वर्षा जारी ⚠️' : 'Rain Showers ⚠️' },
  ];

  const speechAlertHi =
    'किसान भाई, खाद सुरक्षा अलार्म: आपके क्षेत्र मलिहाबाद में अगले पांच दिन मौसम सूखा है और छठवें दिन अट्ठाईस मिलीमीटर भारी बारिश होगी। यूरिया और डीएपी खाद का छिड़काव अगले अड़तालीस घंटे में कर लें। पांचवें दिन के बाद खाद बिल्कुल न डालें, नहीं तो पानी में बहकर खाद का आठ सौ पचास रुपये प्रति एकड़ नुकसान होगा।';

  const speechAlertEn =
    'Farmer Fertilizer Alarm: In your region Malihabad, weather remains dry for the next 5 days, followed by 28.6 mm heavy rain on Day 6. Apply Urea and DAP within the next 48 hours. Do not apply fertilizer after Day 4 to prevent wash-off losses of ₹850 per acre.';

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.trim().length >= 10) {
      setSubscribed(true);
    }
  };

  return (
    <section className="fertilizer-alarm-section" style={{ margin: '3rem 0' }}>
      <div
        className="glass-panel-elevated"
        style={{
          background: 'linear-gradient(145deg, #ffffff 0%, #f7fee7 50%, #ecfdf5 100%)',
          borderRadius: 'var(--radius-xl)',
          border: '2px solid rgba(132, 204, 22, 0.4)',
          boxShadow: '0 20px 40px -15px rgba(22, 101, 52, 0.12)',
          padding: 'clamp(1.5rem, 3.5vw, 3rem)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Glow backdrop badge */}
        <div
          style={{
            position: 'absolute',
            top: '-60px',
            right: '-60px',
            width: '240px',
            height: '240px',
            background: 'radial-gradient(circle, rgba(132, 204, 22, 0.25) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />

        {/* Section Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span
                style={{
                  background: '#65a30d',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  padding: '4px 12px',
                  borderRadius: '999px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <Bell size={13} /> {hi ? 'खाद सुरक्षा अलार्म सिस्टम' : 'Fertilizer Early-Warning Alarm'}
              </span>
              <span className="badge badge-pilot">7-DAY RAIN HORIZON</span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.5rem, 2.8vw, 2.3rem)', color: 'var(--text-primary)', fontWeight: 800, margin: '4px 0 8px' }}>
              {hi ? (
                <>बारिश से 1 हफ्ता पहले अलार्म — <em>खाद बहने से बचाएं</em></>
              ) : (
                <>1-Week Advance Rain Alarm — <em>Stop Nutrient Leaching</em></>
              )}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', maxWidth: '780px', lineHeight: 1.55 }}>
              {hi
                ? 'यदि खाद डालने के तुरंत बाद भारी बारिश हो जाए तो यूरिया और डीएपी पानी में बह जाते हैं। हमारी 1-किमी मौसम प्रणाली 7 दिन पहले भारी बारिश की सूचना देती है ताकि किसान सही समय पर खाद डाल सकें।'
                : 'Heavy rain immediately after broadcasting fertilizer causes surface runoff and deep percolation losses of up to ₹850–₹1,200/acre. Our 1-km downscaled radar monitors 7 days ahead to protect your investment.'}
            </p>
          </div>

          {/* Hindi Voice Audio Trigger */}
          <button
            onClick={() => speakText(hi ? speechAlertHi : speechAlertEn)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              background: isSpeaking ? 'var(--color-hazard-crimson)' : '#15803d',
              color: 'white',
              border: 'none',
              borderRadius: '999px',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(21, 128, 61, 0.28)',
              transition: 'all 0.2s ease'
            }}
          >
            <Volume2 size={18} />
            <span>{isSpeaking ? (hi ? 'आवाज़ रोकें' : 'Stop Audio') : (hi ? 'अलार्म सुनें (Audio)' : 'Listen Alarm (Audio)')}</span>
          </button>
        </div>

        {/* 7-Day Rainfall Forecast Strip */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={16} color="#15803d" /> {hi ? '7-दिवसीय वर्षा पूर्वानुमान एवं खाद उपयुक्तता' : '7-Day Precipitation & Fertilizer Applicability'}
            </span>
            <span style={{ fontSize: '0.78rem', color: '#15803d', fontWeight: 600 }}>
              {location.panchayatName}
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '10px'
            }}
          >
            {forecastDays.map((item, idx) => (
              <div
                key={item.day}
                onClick={() => setSelectedDay(idx + 1)}
                style={{
                  background: item.safe ? '#ffffff' : '#fef2f2',
                  border: item.safe
                    ? selectedDay === idx + 1 ? '2px solid #16a34a' : '1px solid #bbf7d0'
                    : selectedDay === idx + 1 ? '2px solid #dc2626' : '1px solid #fecaca',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px 10px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                  boxShadow: selectedDay === idx + 1 ? '0 8px 18px rgba(0,0,0,0.08)' : 'var(--shadow-sm)'
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  {item.day}
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: item.rainMm > 10 ? '#b91c1c' : '#047857' }}>
                  {item.rainMm} mm
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 6px' }}>
                  {item.temp}
                </div>
                <span
                  style={{
                    display: 'inline-block',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '999px',
                    background: item.safe ? '#dcfce7' : '#fee2e2',
                    color: item.safe ? '#15803d' : '#b91c1c'
                  }}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Live Recommendation & Economic Savings Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}
        >
          {/* Action Box */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid #bbf7d0',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#15803d', fontWeight: 700, fontSize: '0.9rem', marginBottom: '8px' }}>
                <CheckCircle2 size={20} />
                <span>{hi ? 'सलाह: आज खाद का छिड़काव करें' : 'Advisory: Broadcast Fertilizer Now'}</span>
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
                {hi ? 'अगले 72 घंटे सुरक्षित विंडो' : 'Next 72 Hours: Prime Absorption Window'}
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {hi
                  ? 'मौसम 5 दिन तक शुष्क रहेगा। आज यूरिया या डीएपी डालने से पौधों की जड़ें पोषक तत्व 100% अवशोषित कर लेंगी। दिन 5 के बाद खाद न डालें, दिन 6 को 28.6 मिमी वर्षा होने की संभावना 89% है।'
                  : 'Atmospheric conditions remain dry through Day 5. Broadcasting nitrogen/phosphate today guarantees complete root absorption. Cease broadcasting by Day 4 to avoid the 28.6 mm rainstorm on Day 6.'}
              </p>
            </div>

            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed #e2e8f0', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ background: '#dcfce7', color: '#166534', padding: '6px 12px', borderRadius: '8px', fontWeight: 800, fontSize: '0.95rem' }}>
                ₹850 / एकड़
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                {hi ? 'खाद बर्बादी और लीचिंग से अनुमानित बचत' : 'Estimated nutrient leaching loss prevented per acre'}
              </div>
            </div>
          </div>

          {/* Minimal Cost Subscription Card (₹59 / ₹89) */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid #fed7aa',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#c2410c', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {hi ? 'सीधे मोबाइल पर अलर्ट' : 'Direct Mobile Alarm'}
                </span>
                <span style={{ background: '#ffedd5', color: '#9a3412', fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: '999px' }}>
                  {hi ? 'न्यूनतम शुल्क' : 'Minimal Cost'}
                </span>
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
                {hi ? 'वर्षा पूर्व-सूचना फोन अलर्ट' : 'Pre-Rain Phone & WhatsApp Alerts'}
              </h3>

              {/* Plan Switcher */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', margin: '12px 0' }}>
                <button
                  type="button"
                  onClick={() => setActivePlan('sms')}
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                    border: activePlan === 'sms' ? '2px solid #ea580c' : '1px solid #fed7aa',
                    background: activePlan === 'sms' ? '#fff7ed' : '#ffffff',
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>SMS Plan</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#c2410c' }}>₹59 <small style={{ fontSize: '0.65rem' }}>{hi ? '/सीजन' : '/season'}</small></div>
                </button>

                <button
                  type="button"
                  onClick={() => setActivePlan('call')}
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                    border: activePlan === 'call' ? '2px solid #16a34a' : '1px solid #bbf7d0',
                    background: activePlan === 'call' ? '#f0fdf4' : '#ffffff',
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Voice + WhatsApp</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#15803d' }}>₹89 <small style={{ fontSize: '0.65rem' }}>{hi ? '/सीजन' : '/season'}</small></div>
                </button>
              </div>

              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '6px 0 12px' }}>
                {activePlan === 'call'
                  ? (hi ? '📞 बारिश से 5 दिन पहले हिंदी में वॉयस कॉल एवं व्हाट्सएप चेतावनी।' : '📞 Automated regional voice call + WhatsApp alert 5 days prior.')
                  : (hi ? '💬 बारिश से 5 दिन पहले और 48 घंटे पहले 2 एसएमएस संदेश।' : '💬 2 SMS warnings sent 5 days and 48 hours prior to rain.')}
              </p>
            </div>

            {/* Subscribe Input Form */}
            {subscribed ? (
              <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: '8px', padding: '10px 14px', color: '#166534', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} />
                <span>{hi ? `अलर्ट सक्रिय! (+91 ${phoneNumber}) पर अलर्ट पहुंचेगा` : `Alarm Active! Alerts routed to +91 ${phoneNumber}`}</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="tel"
                  placeholder={hi ? 'अपना 10-अंक मोबाइल नंबर' : '10-digit mobile number'}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem',
                    fontFamily: 'inherit'
                  }}
                  required
                />
                <button
                  type="submit"
                  style={{
                    background: activePlan === 'call' ? '#15803d' : '#ea580c',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 14px',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {hi ? `सक्रिय करें (₹${activePlan === 'call' ? '89' : '59'})` : `Activate (₹${activePlan === 'call' ? '89' : '59'})`}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
