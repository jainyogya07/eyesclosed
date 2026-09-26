import { PredictionProvider } from './PredictionProvider';
import { MockPredictionProvider } from './MockPredictionProvider';
import { LivePredictionProvider } from './LivePredictionProvider';

// Read configuration from environment (VITE_DATA_MODE=mock or live)
const dataMode = (import.meta.env.VITE_DATA_MODE as string) || 'mock';

export const predictionProvider: PredictionProvider =
  dataMode === 'live' ? new LivePredictionProvider() : new MockPredictionProvider();

export { MockPredictionProvider, LivePredictionProvider };
export type { PredictionProvider };
