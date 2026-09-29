import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => (
  <footer className="platform-footer" aria-label="Mausam Setu Footer">
    <div className="platform-footer-grid">
      <div>
        <strong>मौसम सेतु · Mausam Setu</strong>
        <p>1-किमी हाइपरलोकल मौसम, उपग्रह मिट्टी नमी व AI कृषि निर्णय प्रणाली।</p>
        <span className="footer-status">
          <i /> लाइव टेलीमेट्री और मॉडल सक्रिय
        </span>
      </div>
      <div>
        <h3>Explore</h3>
        <Link to="/home">Home (होम)</Link>
        <Link to="/panchayat">Panchayat (पंचायत)</Link>
        <Link to="/digital-twin">Digital Twin 3D (डिजिटल ट्विन)</Link>
        <Link to="/agriculture">Crop Care (फसल सलाह)</Link>
        <Link to="/weather">Weather (मौसम)</Link>
      </div>
      <div>
        <h3>Intelligence</h3>
        <Link to="/irrigation">Water & Nutrients (सिंचाई व खाद)</Link>
        <Link to="/hazards">Hazard Alerts (जोखिम अलर्ट)</Link>
        <Link to="/decision-center">Advisory Center (सलाह केंद्र)</Link>
        <Link to="/features">32 Platform Features (सभी फीचर्स)</Link>
      </div>
      <div>
        <h3>Science & Platform</h3>
        <Link to="/model-lab">AI Model Lab M1–M10</Link>
        <Link to="/data-center">Data Center & Telemetry</Link>
        <Link to="/validation">Validation & Metrics</Link>
        <Link to="/about">About Mausam Setu</Link>
      </div>
    </div>
    <div className="platform-footer-bottom">
      <span>© 2026 Mausam Setu (मौसम सेतु) · All Rights Reserved</span>
      <span>National Agricultural Decision Support System</span>
    </div>
  </footer>
);
