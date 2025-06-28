import { DataPoint, AnalysisResult, ProcessingMetrics, WorkerStatus } from '../types';

export class BigDataProcessor {
  private workers: WorkerStatus[] = [];
  private processingMetrics: ProcessingMetrics = {
    recordsProcessed: 0,
    throughput: 0,
    latency: 0,
    errorRate: 0,
    memoryUsage: 0,
    cpuUsage: 0
  };

  constructor(workerCount: number = 4) {
    this.initializeWorkers(workerCount);
  }

  private initializeWorkers(count: number) {
    for (let i = 0; i < count; i++) {
      this.workers.push({
        id: `worker_${i}`,
        status: 'idle',
        tasksCompleted: 0
      });
    }
  }

  async processDataChunk(data: DataPoint[], chunkSize: number = 1000): Promise<AnalysisResult> {
    const startTime = Date.now();
    const chunks = this.chunkArray(data, chunkSize);
    const results: Partial<AnalysisResult>[] = [];

    // Simulate distributed processing
    for (let i = 0; i < chunks.length; i++) {
      const workerIndex = i % this.workers.length;
      this.workers[workerIndex].status = 'processing';
      this.workers[workerIndex].currentTask = `Processing chunk ${i + 1}/${chunks.length}`;
      
      const chunkResult = await this.processChunk(chunks[i]);
      results.push(chunkResult);
      
      this.workers[workerIndex].status = 'idle';
      this.workers[workerIndex].tasksCompleted++;
      this.workers[workerIndex].currentTask = undefined;
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    const finalResult = this.aggregateResults(results, data.length);
    
    // Update metrics
    const processingTime = Date.now() - startTime;
    this.updateMetrics(data.length, processingTime);
    
    return finalResult;
  }

  private chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  private async processChunk(chunk: DataPoint[]): Promise<Partial<AnalysisResult>> {
    const categoryCounts: Record<string, number> = {};
    const regionDistribution: Record<string, number> = {};
    const timeSeriesData: Array<{ time: number; value: number; }> = [];
    
    let totalValue = 0;
    let maxValue = -Infinity;
    let minValue = Infinity;

    chunk.forEach(point => {
      // Aggregate by category
      categoryCounts[point.category] = (categoryCounts[point.category] || 0) + 1;
      
      // Aggregate by region
      regionDistribution[point.region] = (regionDistribution[point.region] || 0) + 1;
      
      // Calculate statistics
      totalValue += point.value;
      maxValue = Math.max(maxValue, point.value);
      minValue = Math.min(minValue, point.value);
      
      // Time series data
      timeSeriesData.push({
        time: point.timestamp,
        value: point.value
      });
    });

    return {
      totalRecords: chunk.length,
      averageValue: totalValue / chunk.length,
      maxValue,
      minValue,
      categoryCounts,
      regionDistribution,
      timeSeriesData
    };
  }

  private aggregateResults(results: Partial<AnalysisResult>[], totalRecords: number): AnalysisResult {
    const aggregated: AnalysisResult = {
      totalRecords,
      averageValue: 0,
      maxValue: -Infinity,
      minValue: Infinity,
      categoryCounts: {},
      regionDistribution: {},
      timeSeriesData: [],
      topCategories: []
    };

    let totalValue = 0;
    
    results.forEach(result => {
      if (result.averageValue && result.totalRecords) {
        totalValue += result.averageValue * result.totalRecords;
      }
      
      if (result.maxValue) {
        aggregated.maxValue = Math.max(aggregated.maxValue, result.maxValue);
      }
      
      if (result.minValue) {
        aggregated.minValue = Math.min(aggregated.minValue, result.minValue);
      }
      
      // Merge category counts
      if (result.categoryCounts) {
        Object.entries(result.categoryCounts).forEach(([category, count]) => {
          aggregated.categoryCounts[category] = (aggregated.categoryCounts[category] || 0) + count;
        });
      }
      
      // Merge region distribution
      if (result.regionDistribution) {
        Object.entries(result.regionDistribution).forEach(([region, count]) => {
          aggregated.regionDistribution[region] = (aggregated.regionDistribution[region] || 0) + count;
        });
      }
      
      // Merge time series data
      if (result.timeSeriesData) {
        aggregated.timeSeriesData.push(...result.timeSeriesData);
      }
    });

    aggregated.averageValue = totalValue / totalRecords;
    
    // Sort time series data
    aggregated.timeSeriesData.sort((a, b) => a.time - b.time);
    
    // Create top categories
    aggregated.topCategories = Object.entries(aggregated.categoryCounts)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return aggregated;
  }

  private updateMetrics(recordsProcessed: number, processingTime: number) {
    this.processingMetrics.recordsProcessed += recordsProcessed;
    this.processingMetrics.throughput = recordsProcessed / (processingTime / 1000);
    this.processingMetrics.latency = processingTime;
    this.processingMetrics.errorRate = Math.random() * 0.1; // Simulate error rate
    this.processingMetrics.memoryUsage = Math.random() * 80 + 20; // 20-100%
    this.processingMetrics.cpuUsage = Math.random() * 60 + 40; // 40-100%
  }

  getWorkers(): WorkerStatus[] {
    return [...this.workers];
  }

  getMetrics(): ProcessingMetrics {
    return { ...this.processingMetrics };
  }
}