import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => (
  <footer className="platform-footer">
    <div className="platform-footer-grid">
      <div><strong>Kisaan Ki Yash</strong><p>Hyperlocal weather, soil and crop intelligence for Panchayat-level farming decisions.</p><span className="footer-status"><i /> Platform data view</span></div>
      <div><h3>Explore</h3><Link to="/home">Home</Link><Link to="/panchayat">Panchayat</Link><Link to="/agriculture">Crop Intelligence</Link><Link to="/weather">Weather</Link></div>
      <div><h3>Intelligence</h3><Link to="/digital-twin">GIS Map</Link><Link to="/irrigation">Water & Soil</Link><Link to="/hazards">Alerts & Risk</Link><Link to="/decision-center">Advisory Center</Link></div>
      <div><h3>Platform</h3><Link to="/about">About</Link><Link to="/model-lab">Science & Models</Link><Link to="/data-center">Data Center</Link><Link to="/validation">Validation</Link></div>
    </div>
    <div className="platform-footer-bottom"><span>© 2026 Kisaan Ki Yash</span><span>Local agricultural decision support</span></div>
  </footer>
);
