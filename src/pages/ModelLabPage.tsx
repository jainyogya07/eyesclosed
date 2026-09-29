import React from 'react';
import { ModelLab } from '../components/modelLab/ModelLab';

export const ModelLabPage: React.FC = () => {
  return (
    <div style={{ backgroundColor: 'var(--farmora-dark)', minHeight: 'calc(100vh - 120px)' }}>
      <ModelLab />
    </div>
  );
};
