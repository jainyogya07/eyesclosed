import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  ChevronRight,
  Clock3,
  Droplets,
  Leaf,
  MapPin,
  MessageCircle,
  ShieldAlert,
  Sprout,
  Volume2,
  Wheat
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';

type Feature = {
  title: string;
  detail: string;
  status: 'Available' | 'Coming soon' | 'Future';
  icon: React.ReactNode;
  tier: string;
};

export const FeaturesPage: React.FC = () => {
  const { language } = useApp();
  const hi = language === 'hi';
  const [filter, setFilter] = useState<'All' | Feature['status']>('All');

  const groups = useMemo(() => {
    return [
      {
        title: hi ? 'दैनिक आवश्यक सुविधाएं' : 'Daily Essentials',
        subtitle: hi ? 'हर किसान भाई के लिए निःशुल्क टूल्स' : 'Free tools for every farmer',
        tone: 'blue',
        items: [
          {
            title: hi ? '1-किमी मौसम पूर्वानुमान' : '1-km Weather Forecast',
            detail: hi ? 'आपके गांव के अनुसार सटीक तापमान और आर्द्रता।' : 'Hyperlocal temperature for your specific village sector.',
            status: 'Available',
            icon: <MapPin />,
            tier: hi ? 'निःशुल्क' : 'Free'
          },
          {
            title: hi ? 'बारिश हां / ना संकेत' : 'Rain Yes / No Decision',
            detail: hi ? 'अगले 24 घंटे में बारिश का साफ़ निर्णय।' : 'A simple next-24-hour rainfall decision for immediate field actions.',
            status: 'Available',
            icon: <Droplets />,
            tier: hi ? 'निःशुल्क' : 'Free'
          },
          {
            title: hi ? '3-दिवसीय मौसम चक्र' : '3-Day Weather Plan',
            detail: hi ? 'तापमान, हवा और नमी का एक साथ दृश्य।' : 'Downscaled hourly temperature, humidity, and wind in one unified view.',
            status: 'Available',
            icon: <Clock3 />,
            tier: hi ? 'निःशुल्क' : 'Free'
          },
          {
            title: hi ? 'एसएमएस व व्हाट्सएप सलाह' : 'SMS & WhatsApp Advice',
            detail: hi ? 'सीधे मोबाइल पर साफ़ कृषि संदेश बिना ऐप खोले।' : 'Receive concise farm advisories via text without needing high data bandwidth.',
            status: 'Coming soon',
            icon: <MessageCircle />,
            tier: hi ? 'निःशुल्क' : 'Free'
          },
          {
            title: hi ? 'ग्राम पंचायत आधार' : 'Village-Centric Localization',
            detail: hi ? 'हर सलाह आपकी चुनी हुई पंचायत से जुड़ी रहती है।' : 'Every telemetry reading stays pegged to your specific Gram Panchayat coordinates.',
            status: 'Available',
            icon: <MapPin />,
            tier: hi ? 'निःशुल्क' : 'Free'
          }
        ] as Feature[]
      },
      {
        title: hi ? 'पानी और लागत बचत' : 'Save Water & Inputs',
        subtitle: hi ? 'खेत की दैनिक कार्यप्रणाली' : 'Daily farm operations',
        tone: 'green',
        items: [
          {
            title: hi ? 'जड़ क्षेत्र मिट्टी नमी' : 'Soil Moisture Status',
            detail: hi ? 'जड़ों के पास उपलब्ध पानी की स्थिति और सिंचाई संकेत।' : 'Root-zone VWC telemetry with a binary irrigation recommendation.',
            status: 'Coming soon',
            icon: <Droplets />,
            tier: 'Kisan Saathi'
          },
          {
            title: hi ? 'स्मार्ट सिंचाई समय-सारिणी' : 'Irrigation Schedule',
            detail: hi ? 'कितना पानी देना है और कब देना है।' : 'Physical ETc water deficit calculations recommending optimal pump hours.',
            status: 'Coming soon',
            icon: <Droplets />,
            tier: 'Kisan Saathi'
          },
          {
            title: hi ? '7-दिवसीय कृषि योजना' : '7-Day Farm Operations Forecast',
            detail: hi ? 'मजदूरी, बुवाई और कटाई की एक हफ्ते की तैयारी।' : 'Plan labour, irrigation, and field work across the week.',
            status: 'Coming soon',
            icon: <Clock3 />,
            tier: 'Kisan Saathi'
          },
          {
            title: hi ? 'खाद सुरक्षा अलार्म' : 'Fertilizer 1-Week Rain Alarm',
            detail: hi ? 'भारी बारिश से 1 हफ्ता पहले चेतावनी ताकि यूरिया-डीएपी पानी में न बहे। मोबाइल अलर्ट मात्र ₹59-₹89।' : 'Early warning 7 days before heavy downpours to prevent nutrient leaching. Mobile alerts at ₹59-₹89/season.',
            status: 'Available',
            icon: <Leaf />,
            tier: 'Kisan Saathi'
          },
          {
            title: hi ? 'सुरक्षित स्प्रे विंडो' : 'Spray-Safe Window',
            detail: hi ? 'बारिश और हवा की गति देखकर कीटनाशक छिड़काव का सही समय।' : 'Evaluates rain risk and wind drift speed before recommending spray.',
            status: 'Coming soon',
            icon: <ShieldAlert />,
            tier: 'Kisan Saathi'
          },
          {
            title: hi ? 'फसल विकास कैलेंडर' : 'Crop Stage Tracking (GDD)',
            detail: hi ? 'थर्मल यूनिट्स के आधार पर फसल की अवस्था और समय पर पोषण।' : 'Thermal Growing Degree Day tracking for timely crop protection.',
            status: 'Coming soon',
            icon: <Sprout />,
            tier: 'Kisan Saathi'
          }
        ] as Feature[]
      },
      {
        title: hi ? 'पूरी फसल की सुरक्षा' : 'Protect the Whole Crop',
        subtitle: hi ? 'सीजन-स्तरीय जोखिम प्रबंधन' : 'Season-level resilience & risk control',
        tone: 'orange',
        items: [
          {
            title: hi ? '10-मॉडल AI कैस्केड (M1–M10)' : '10-Model AI Cascade (M1–M10)',
            detail: hi ? 'पायलट स्टेशन AWS_LKO_05 पर प्रमाणित 1-किमी मौसम और भौतिकी मॉडल।' : 'Coupled 1-km downscaled physics and ML models validated on AWS_LKO_05 pilot station.',
            status: 'Available',
            icon: <CheckCircle2 />,
            tier: 'Kisan Pro'
          },
          {
            title: hi ? 'डिजिटल ट्विन सैंडबॉक्स' : 'Digital Twin What-If Sandbox',
            detail: hi ? 'बारिश, तापमान और नहर आपूर्ति में बदलाव करके खेत पर प्रभाव जांचें।' : 'Simulate rainfall overrides, temp anomalies, and canal water releases with immediate soil feedback.',
            status: 'Available',
            icon: <Droplets />,
            tier: 'Kisan Pro'
          },
          {
            title: hi ? 'चरम मौसम चेतावनी' : 'Extreme-Weather Early Warning',
            detail: hi ? 'पाला, शीत लहर, लू और तेज आंधी की समय पूर्व सूचना।' : 'Advance warnings for nocturnal frost, heatwaves, and gale gusts.',
            status: 'Coming soon',
            icon: <ShieldAlert />,
            tier: 'Kisan Pro'
          },
          {
            title: hi ? 'उपज का अनुमान' : 'Pre-Harvest Yield Outlook',
            detail: hi ? 'उपग्रह बायोमास से कटाई से पहले उपज का वैज्ञानिक आकलन।' : 'Canopy light-use efficiency models estimating field yield before harvest.',
            status: 'Future',
            icon: <Wheat />,
            tier: 'Kisan Pro'
          },
          {
            title: hi ? 'जलभराव व बाढ़ जोखिम' : 'Inundation & Ponding Risk',
            detail: hi ? 'स्थलाकृतिक सूचकांक से जलभराव की पहचान और निकास की तैयारी।' : 'High-resolution DEM modeling identifying plot-level drainage bottlenecks.',
            status: 'Future',
            icon: <Droplets />,
            tier: 'Kisan Pro'
          },
          {
            title: hi ? 'वॉयस ऑडियो सलाह' : 'Vernacular Voice Advice',
            detail: hi ? 'महत्वपूर्ण अलर्ट और दैनिक सिफारिशें बोलकर सुनें।' : 'Listen to critical action advisories in clear audio format.',
            status: 'Available',
            icon: <Volume2 />,
            tier: 'Kisan Pro'
          },
          {
            title: hi ? 'फसल बीमा साक्ष्य रिपोर्ट' : 'Crop Insurance Evidence Dossier',
            detail: hi ? 'मौसम की मार के प्रमाणित आंकड़े बीमा दावे के लिए।' : 'Cryptographically timestamped micro-climate history for insurance settlement claims.',
            status: 'Future',
            icon: <CheckCircle2 />,
            tier: 'Kisan Pro'
          },
          {
            title: hi ? 'पूर्वानुमान विश्वसनीयता' : 'Conformal Forecast Confidence',
            detail: hi ? 'निर्णय लेने से पहले डेटा अनिश्चितता और सीमाएं स्पष्ट रूप से देखें।' : 'Rigorous conformal prediction bounds ensuring users know model uncertainty limits.',
            status: 'Available',
            icon: <CheckCircle2 />,
            tier: 'Kisan Pro'
          }
        ] as Feature[]
      },
      {
        title: hi ? 'FPO और कृषि संस्थाओं के लिए' : 'For FPOs & Enterprise Partners',
        subtitle: hi ? 'सैकड़ों खेतों का एक साझा दृश्य' : 'One unified dashboard across many villages',
        tone: 'purple',
        items: [
          {
            title: hi ? 'ग्राम क्लस्टर डैशबोर्ड' : 'Cluster-Level Operations Hub',
            detail: hi ? 'पूरी पंचायत और तहसील स्तर पर फसलों और जोखिमों की एक साथ निगरानी।' : 'Pan-panchayat bird-eye monitoring of crop stress and input requirements.',
            status: 'Future',
            icon: <Sprout />,
            tier: 'FPO'
          },
          {
            title: hi ? 'सुरक्षित API कनेक्टिविटी' : 'Enterprise REST API Access',
            detail: hi ? 'अन्य कृषि सॉफ्टवेयर और सप्लाई चेन में डेटा को जोड़ें।' : 'Programmatic API access feeding downscaled forecasts to supply chain systems.',
            status: 'Future',
            icon: <ChevronRight />,
            tier: 'FPO'
          },
          {
            title: hi ? 'मंडी भाव व बिक्री संकेत' : 'Mandi Price & Arrival Signals',
            detail: hi ? 'निकटतम मंडियों के भाव के अनुसार कटाई और बिक्री का सही समय।' : 'APMC arrival telemetry suggesting optimal harvest sale timing.',
            status: 'Future',
            icon: <Wheat />,
            tier: 'FPO'
          },
          {
            title: hi ? 'जल व कार्बन क्रेडिट रिपोर्ट' : 'Water & Carbon Credit Auditing',
            detail: hi ? 'कम पानी से धान खेती (AWD) पर कार्बन क्रेडिट और जल बचत का प्रमाणपत्र।' : 'Verified methane reduction verification for Alternate Wetting & Drying carbon credits.',
            status: 'Future',
            icon: <Leaf />,
            tier: 'FPO'
          }
        ] as Feature[]
      }
    ];
  }, [hi]);

  const counts = useMemo(
    () => ({
      available: groups.flatMap((g) => g.items).filter((f) => f.status === 'Available').length,
      planned: groups.flatMap((g) => g.items).filter((f) => f.status !== 'Available').length
    }),
    [groups]
  );

  return (
    <div className="features-page">
      <section className="features-hero">
        <span className="eyebrow">{hi ? 'किसान की यश फीचर गाइड' : 'Kisaan Ki Yash Feature Guide'}</span>
        <h1>{hi ? 'आपके खेत के लिए हर सुविधा, एक साफ़ जगह पर।' : 'Every Farm Tool, in One Clear Place.'}</h1>
        <p>
          {hi
            ? 'जो सुविधाएं आज उपलब्ध हैं और जो जल्द जोड़ी जाएंगी, दोनों साफ़-साफ़ देखें।'
            : 'Explore features available today and what is on the engineering horizon, with absolute clarity.'}
        </p>
        <div className="feature-counts">
          <span>
            <strong>{counts.available}</strong>
            {hi ? ' अभी उपलब्ध' : ' available now'}
          </span>
          <span>
            <strong>{counts.planned}</strong>
            {hi ? ' प्रस्तावित सुविधाएं' : ' planned features'}
          </span>
        </div>
      </section>

      <div className="feature-filter">
        <button className={filter === 'All' ? 'selected' : ''} onClick={() => setFilter('All')}>
          {hi ? 'सभी सुविधाएं' : 'All Features'}
        </button>
        <button className={filter === 'Available' ? 'selected' : ''} onClick={() => setFilter('Available')}>
          {hi ? 'अभी उपलब्ध' : 'Available Now'}
        </button>
        <button className={filter === 'Coming soon' ? 'selected' : ''} onClick={() => setFilter('Coming soon')}>
          {hi ? 'जल्द आने वाले' : 'Coming Soon'}
        </button>
      </div>

      <div className="feature-groups">
        {groups.map((group) => {
          const items = filter === 'All' ? group.items : group.items.filter((item) => item.status === filter);
          if (!items.length) return null;
          return (
            <section className="feature-group" key={group.title}>
              <div className="feature-group-heading">
                <span className={`group-icon ${group.tone}`}>{group.items[0].icon}</span>
                <div>
                  <h2>{group.title}</h2>
                  <p>{group.subtitle}</p>
                </div>
              </div>
              <div className="feature-cards">
                {items.map((item) => (
                  <article className="feature-card" key={item.title}>
                    <div className="feature-card-top">
                      <span className={`feature-icon ${group.tone}`}>{item.icon}</span>
                      <span className={`status ${item.status.toLowerCase().replace(' ', '-')}`}>
                        {hi
                          ? item.status === 'Available'
                            ? 'उपलब्ध'
                            : item.status === 'Coming soon'
                            ? 'शीघ्र'
                            : 'प्रस्तावित'
                          : item.status}
                      </span>
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.detail}</p>
                    <span className="tier-label">{item.tier}</span>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};
