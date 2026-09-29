import React, { useMemo, useState } from 'react';
import { CheckCircle2, ChevronRight, Clock3, Droplets, Leaf, MapPin, MessageCircle, ShieldAlert, Sprout, Volume2, Wheat } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

type Feature = { title: string; detail: string; status: 'Available' | 'Coming soon' | 'Future'; icon: React.ReactNode; tier: string };

const groups: { title: string; subtitle: string; tone: string; items: Feature[] }[] = [
  { title: 'Daily essentials', subtitle: 'Free tools for every farmer', tone: 'blue', items: [
    { title: '1-km weather forecast', detail: 'Temperature for your village, not a district average.', status: 'Available', icon: <MapPin />, tier: 'Free' },
    { title: 'Rain yes / no alert', detail: 'A simple next-24-hour rainfall decision.', status: 'Available', icon: <Droplets />, tier: 'Free' },
    { title: '3-day weather plan', detail: 'Temperature, humidity and wind in one view.', status: 'Available', icon: <Clock3 />, tier: 'Free' },
    { title: 'SMS & WhatsApp advice', detail: 'Get a short advisory without needing a complex app.', status: 'Coming soon', icon: <MessageCircle />, tier: 'Free' },
    { title: 'Village-based forecast', detail: 'Your panchayat stays attached to every advisory.', status: 'Available', icon: <MapPin />, tier: 'Free' },
  ] },
  { title: 'Save water and inputs', subtitle: 'Daily farm operations', tone: 'green', items: [
    { title: 'Soil moisture status', detail: 'Root-zone moisture with a clear irrigation signal.', status: 'Coming soon', icon: <Droplets />, tier: 'Kisan Saathi' },
    { title: 'Irrigation schedule', detail: 'How much to irrigate and when to do it.', status: 'Coming soon', icon: <Droplets />, tier: 'Kisan Saathi' },
    { title: '7-day farm forecast', detail: 'Plan labour, irrigation and field work for the week.', status: 'Coming soon', icon: <Clock3 />, tier: 'Kisan Saathi' },
    { title: 'Fertiliser 1-Week Rain Alarm (खाद सुरक्षा अलार्म)', detail: 'Warns 1 week in advance of heavy downpours to prevent fertilizer wash-off. SMS/Voice alerts at ₹59-₹89.', status: 'Available', icon: <Leaf />, tier: 'Kisan Saathi' },
    { title: 'Spray-safe window', detail: 'Checks rain and wind before recommending a spray.', status: 'Coming soon', icon: <ShieldAlert />, tier: 'Kisan Saathi' },
    { title: 'Crop-stage calendar', detail: 'Growth-stage reminders and seasonal crop care.', status: 'Coming soon', icon: <Sprout />, tier: 'Kisan Saathi' },
  ] },
  { title: 'Protect the whole crop', subtitle: 'Season-level protection', tone: 'orange', items: [
    { title: '10-Model AI Cascade (M1–M10)', detail: 'Coupled 1-km downscaled physics and ML models validated on AWS_LKO_05 pilot station.', status: 'Available', icon: <CheckCircle2 />, tier: 'Kisan Pro' },
    { title: 'Digital Twin What-If Sandbox', detail: 'Simulate rainfall overrides, temp anomalies, and canal water releases with immediate soil feedback.', status: 'Available', icon: <Droplets />, tier: 'Kisan Pro' },
    { title: 'Extreme-weather alerts', detail: 'Heat, frost, dry-spell and severe-rain warnings.', status: 'Coming soon', icon: <ShieldAlert />, tier: 'Kisan Pro' },
    { title: 'Yield outlook', detail: 'An end-of-season yield estimate for planning.', status: 'Future', icon: <Wheat />, tier: 'Kisan Pro' },
    { title: 'Flood & waterlogging risk', detail: 'See risk early and prepare field drainage.', status: 'Future', icon: <Droplets />, tier: 'Kisan Pro' },
    { title: 'Hindi voice advice', detail: 'Listen to important alerts in simple spoken Hindi.', status: 'Available', icon: <Volume2 />, tier: 'Kisan Pro' },
    { title: 'Insurance-ready report', detail: 'Weather evidence for crop-insurance claims.', status: 'Future', icon: <CheckCircle2 />, tier: 'Kisan Pro' },
    { title: 'Forecast confidence', detail: 'Know when data is limited before making a decision.', status: 'Available', icon: <CheckCircle2 />, tier: 'Kisan Pro' },
  ] },
  { title: 'For FPOs and partners', subtitle: 'One view across many farms', tone: 'purple', items: [
    { title: 'Multi-farm dashboard', detail: 'A panchayat-level view of farms and risks.', status: 'Future', icon: <Sprout />, tier: 'FPO' },
    { title: 'API access', detail: 'Connect farm intelligence to other systems.', status: 'Future', icon: <ChevronRight />, tier: 'FPO' },
    { title: 'Market-price signals', detail: 'Harvest timing suggestions using market prices.', status: 'Future', icon: <Wheat />, tier: 'FPO' },
    { title: 'Water & carbon report', detail: 'Measure water savings and sustainability progress.', status: 'Future', icon: <Leaf />, tier: 'FPO' },
  ] },
];

export const FeaturesPage: React.FC = () => {
  const { language } = useApp();
  const [filter, setFilter] = useState<'All' | Feature['status']>('All');
  const counts = useMemo(() => ({ available: groups.flatMap(g => g.items).filter(f => f.status === 'Available').length, planned: groups.flatMap(g => g.items).filter(f => f.status !== 'Available').length }), []);
  const hi = language === 'hi';
  return <div className="features-page">
    <section className="features-hero"><span className="eyebrow">{hi ? 'किसान की यश फीचर गाइड' : 'Kisaan Ki Yash feature guide'}</span><h1>{hi ? 'आपके खेत के लिए हर मदद, एक साफ़ जगह पर।' : 'Every farm tool, in one clear place.'}</h1><p>{hi ? 'जो आज उपलब्ध है और जो जल्द जोड़ा जाएगा, दोनों साफ़-साफ़ देखें।' : 'See what is available today and what is planned next, with no confusing claims.'}</p><div className="feature-counts"><span><strong>{counts.available}</strong>{hi ? ' अभी उपलब्ध' : ' available now'}</span><span><strong>{counts.planned}</strong>{hi ? ' जल्द आने वाले' : ' planned features'}</span></div></section>
    <div className="feature-filter"><button className={filter === 'All' ? 'selected' : ''} onClick={() => setFilter('All')}>{hi ? 'सभी फीचर' : 'All features'}</button><button className={filter === 'Available' ? 'selected' : ''} onClick={() => setFilter('Available')}>{hi ? 'अभी उपलब्ध' : 'Available now'}</button><button className={filter === 'Coming soon' ? 'selected' : ''} onClick={() => setFilter('Coming soon')}>{hi ? 'जल्द आने वाले' : 'Coming soon'}</button></div>
    <div className="feature-groups">{groups.map(group => { const items = filter === 'All' ? group.items : group.items.filter(item => item.status === filter); return items.length ? <section className="feature-group" key={group.title}><div className="feature-group-heading"><span className={`group-icon ${group.tone}`}>{group.items[0].icon}</span><div><h2>{group.title}</h2><p>{group.subtitle}</p></div></div><div className="feature-cards">{items.map(item => <article className="feature-card" key={item.title}><div className="feature-card-top"><span className={`feature-icon ${group.tone}`}>{item.icon}</span><span className={`status ${item.status.toLowerCase().replace(' ', '-')}`}>{item.status}</span></div><h3>{item.title}</h3><p>{item.detail}</p><span className="tier-label">{item.tier}</span></article>)}</div></section> : null; })}</div>
  </div>;
};
