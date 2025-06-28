export interface DataPoint {
  id: string;
  timestamp: number;
  value: number;
  category: string;
  region: string;
  metadata?: Record<string, any>;
}

export interface ProcessingMetrics {
  recordsProcessed: number;
  throughput: number;
  latency: number;
  errorRate: number;
  memoryUsage: number;
  cpuUsage: number;
}

export interface AnalysisResult {
  totalRecords: number;
  averageValue: number;
  maxValue: number;
  minValue: number;
  categoryCounts: Record<string, number>;
  regionDistribution: Record<string, number>;
  timeSeriesData: Array<{ time: number; value: number; }>;
  topCategories: Array<{ category: string; count: number; }>;
}

export interface WorkerStatus {
  id: string;
  status: 'idle' | 'processing' | 'error';
  tasksCompleted: number;
  currentTask?: string;
}