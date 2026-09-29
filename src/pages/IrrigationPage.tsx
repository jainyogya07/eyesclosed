import React from 'react';
import { useApp } from '../contexts/AppContext';
import { Droplet, TrendingDown, DollarSign, Clock, ShieldCheck } from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';

export const IrrigationPage: React.FC = () => {
  const { language, location } = useApp();

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2.5rem 1.5rem 6rem 1.5rem', backgroundColor: 'var(--farmora-dark)', minHeight: 'calc(100vh - 120px)' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <StatusBadge status="frozen" label="WATER BALANCE & CANAL SCHEDULER" />
          <span className="badge badge-pilot">M6 EVAPOTRANSPIRATION ENGINE</span>
        </div>
        <h1 style={{ fontSize: '2.6rem', fontWeight: 800, color: 'var(--farmora-light)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Droplet size={32} color="var(--farmora-lime)" />
          Irrigation & Water Resource Intelligence
        </h1>
        <p style={{ color: 'var(--farmora-platinum)', fontSize: '1.02rem', maxWidth: '780px' }}>
          Thermodynamic FAO-56 Penman-Monteith crop water requirement calculation coupled with soil moisture drawdown profiling.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem', marginBottom: '2.5rem' }}>
        <div className="farmora-glass-elevated" style={{ padding: '24px', borderRadius: 'var(--radius-xl)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--farmora-light)', marginBottom: '14px' }}>
            Current Irrigation Status
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <span style={{ fontSize: '2.5rem' }}>🚫</span>
            <div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--farmora-lime)' }}>
                HOLD PUMPING
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--farmora-platinum)' }}>
                Zero irrigation needed for the next 48 hours.
              </div>
            </div>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--farmora-platinum)', lineHeight: 1.6 }}>
            Adequate soil water availability (31.2% VWC) combined with expected convective precipitation (12.4mm) fulfills 100% of evapotranspiration demand (5.8mm/day).
          </p>
        </div>

        <div className="farmora-glass-elevated" style={{ padding: '24px', borderRadius: 'var(--radius-xl)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--farmora-light)', marginBottom: '14px' }}>
            Economic & Environmental Impact
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(12, 13, 5, 0.75)', borderRadius: '8px', border: '1px solid rgba(182, 178, 67, 0.2)' }}>
              <span style={{ color: 'var(--farmora-platinum)' }}>Diesel Fuel Saved:</span>
              <strong style={{ color: 'var(--farmora-lime)' }}>3.8 Liters / Acre</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(12, 13, 5, 0.75)', borderRadius: '8px', border: '1px solid rgba(182, 178, 67, 0.2)' }}>
              <span style={{ color: 'var(--farmora-platinum)' }}>Groundwater Pumping Averted:</span>
              <strong style={{ color: '#38bdf8' }}>48,000 Liters / Acre</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(12, 13, 5, 0.75)', borderRadius: '8px', border: '1px solid rgba(182, 178, 67, 0.2)' }}>
              <span style={{ color: 'var(--farmora-platinum)' }}>Direct Farmer Savings:</span>
              <strong style={{ color: 'var(--farmora-wheat)' }}>₹350 – ₹400 / Acre</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
