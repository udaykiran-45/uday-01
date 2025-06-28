import { DataPoint } from '../types';

const categories = ['E-commerce', 'Finance', 'Healthcare', 'Education', 'Entertainment', 'Technology'];
const regions = ['North America', 'Europe', 'Asia-Pacific', 'South America', 'Africa', 'Middle East'];

export function generateBigDataset(size: number): DataPoint[] {
  const dataset: DataPoint[] = [];
  const now = Date.now();
  
  for (let i = 0; i < size; i++) {
    dataset.push({
      id: `record_${i}`,
      timestamp: now - Math.random() * 86400000 * 30, // Last 30 days
      value: Math.random() * 10000,
      category: categories[Math.floor(Math.random() * categories.length)],
      region: regions[Math.floor(Math.random() * regions.length)],
      metadata: {
        userId: Math.floor(Math.random() * 10000),
        sessionId: `session_${Math.floor(Math.random() * 1000)}`,
        deviceType: Math.random() > 0.5 ? 'mobile' : 'desktop'
      }
    });
  }
  
  return dataset;
}

export function generateStreamingData(): DataPoint {
  return {
    id: `stream_${Date.now()}_${Math.random()}`,
    timestamp: Date.now(),
    value: Math.random() * 1000,
    category: categories[Math.floor(Math.random() * categories.length)],
    region: regions[Math.floor(Math.random() * regions.length)],
    metadata: {
      userId: Math.floor(Math.random() * 10000),
      sessionId: `session_${Math.floor(Math.random() * 1000)}`,
      deviceType: Math.random() > 0.5 ? 'mobile' : 'desktop'
    }
  };
}