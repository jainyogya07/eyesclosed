import React from 'react';
import { DigitalTwinView } from '../components/digitalTwin/DigitalTwinView';

export const DigitalTwinPage: React.FC = () => {
  return (
    <div style={{ backgroundColor: 'var(--farmora-dark)', minHeight: 'calc(100vh - 120px)' }}>
      <DigitalTwinView />
    </div>
  );
};
