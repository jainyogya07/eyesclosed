import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, LockKeyhole, MapPin, ShieldCheck, Sprout } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { KisaanLogo } from '../components/brand/KisaanLogo';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { signIn } = useApp();
  const [role, setRole] = useState('Farmer');
  const [phone, setPhone] = useState('');

  const enterPlatform = (event: React.FormEvent) => {
    event.preventDefault();
    signIn();
    navigate('/home');
  };

  return (
    <div className="login-page">
      <section className="login-hero">
        <div className="login-brand"><span><KisaanLogo size={34} /></span><strong>Kisaan Ki Yash</strong></div>
        <div className="login-hero-copy">
          <p className="login-eyebrow">Panchayat climate intelligence</p>
          <h1>Know what weather means for your <em>crops.</em></h1>
          <p>Weather, soil, Panchayat data and AI work together to turn local climate signals into clear agricultural action.</p>
        </div>
        <div className="login-signal-card">
          <div><MapPin size={17} /><span>Malihabad Panchayat</span><b>Live</b></div>
          <p><Sprout size={18} /> Crop suitability and advisories are ready for your fields.</p>
        </div>
      </section>

      <section className="login-panel-wrap">
        <form className="login-panel" onSubmit={enterPlatform}>
          <div className="login-panel-icon"><LockKeyhole size={22} /></div>
          <p className="login-eyebrow">Secure access</p>
          <h2>Welcome back</h2>
          <p className="login-intro">Sign in to see recommendations for your Panchayat.</p>

          <label htmlFor="role">I am a</label>
          <select id="role" value={role} onChange={(event) => setRole(event.target.value)}>
            <option>Farmer</option><option>Panchayat Officer</option><option>Agriculture Expert</option><option>District Officer</option>
          </select>
          <label htmlFor="phone">Mobile number</label>
          <input id="phone" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Enter 10-digit number" inputMode="numeric" required />
          <button type="submit">Continue to home <ArrowRight size={17} /></button>
          <div className="login-safe"><ShieldCheck size={15} /> Your location and farm data stay protected.</div>
          <p className="login-demo">Demo access — enter any valid mobile number to continue.</p>
        </form>
      </section>
    </div>
  );
};
