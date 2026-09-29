import { PredictionProvider } from './PredictionProvider';
import { MockPredictionProvider } from './MockPredictionProvider';
import { LivePredictionProvider as LivePredictionProviderClass } from './LivePredictionProvider.class';

// Read configuration from environment (VITE_DATA_MODE=mock or live)
const dataMode = (import.meta.env.VITE_DATA_MODE as string) || 'mock';

export const predictionProvider: PredictionProvider =
  dataMode === 'live' ? new LivePredictionProviderClass() : new MockPredictionProvider();

export { MockPredictionProvider, LivePredictionProviderClass as LivePredictionProvider };
export type { PredictionProvider };
