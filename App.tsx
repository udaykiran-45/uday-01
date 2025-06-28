import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { MetricsCard } from './components/MetricsCard';
import { WorkerStatus } from './components/WorkerStatus';
import { DataVisualization } from './components/DataVisualization';
import { ProcessingControls } from './components/ProcessingControls';
import { BigDataProcessor } from './utils/dataProcessor';
import { generateBigDataset, generateStreamingData } from './utils/dataGenerator';
import { AnalysisResult, ProcessingMetrics } from './types';
import { 
  Database, 
  Zap, 
  Clock, 
  TrendingUp, 
  BarChart3, 
  Activity,
  Cpu,
  HardDrive
} from 'lucide-react';

function App() {
  const [processor] = useState(() => new BigDataProcessor(4));
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [metrics, setMetrics] = useState<ProcessingMetrics | null>(null);
  const [workers, setWorkers] = useState(processor.getWorkers());
  const [isProcessing, setIsProcessing] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingData, setStreamingData] = useState(0);

  const updateMetrics = useCallback(() => {
    setMetrics(processor.getMetrics());
    setWorkers(processor.getWorkers());
  }, [processor]);

  const handleStartProcessing = async (size: number) => {
    setIsProcessing(true);
    
    try {
      const dataset = generateBigDataset(size);
      const result = await processor.processDataChunk(dataset, 5000);
      setAnalysisResult(result);
      updateMetrics();
    } catch (error) {
      console.error('Processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStreamingToggle = (enabled: boolean) => {
    setIsStreaming(enabled);
  };

  // Simulate real-time streaming
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      const newData = generateStreamingData();
      setStreamingData(prev => prev + 1);
      
      // Process streaming data in small batches
      if (streamingData % 100 === 0) {
        processor.processDataChunk([newData], 1).then(() => {
          updateMetrics();
        });
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isStreaming, streamingData, processor, updateMetrics]);

  // Update metrics periodically
  useEffect(() => {
    const interval = setInterval(updateMetrics, 2000);
    return () => clearInterval(interval);
  }, [updateMetrics]);

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      
      <main className="px-6 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricsCard
              title="Records Processed"
              value={metrics?.recordsProcessed.toLocaleString() || '0'}
              subtitle="Total processed"
              icon={Database}
              color="blue"
            />
            
            <MetricsCard
              title="Throughput"
              value={`${Math.round(metrics?.throughput || 0).toLocaleString()}/s`}
              subtitle="Records per second"
              icon={Zap}
              color="green"
              trend="up"
            />
            
            <MetricsCard
              title="Latency"
              value={`${Math.round(metrics?.latency || 0)}ms`}
              subtitle="Processing time"
              icon={Clock}
              color="yellow"
            />
            
            <MetricsCard
              title="Error Rate"
              value={`${((metrics?.errorRate || 0) * 100).toFixed(2)}%`}
              subtitle="Processing errors"
              icon={TrendingUp}
              color="red"
            />
          </div>

          {/* System Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricsCard
              title="CPU Usage"
              value={`${Math.round(metrics?.cpuUsage || 0)}%`}
              subtitle="Cluster utilization"
              icon={Cpu}
              color="blue"
            />
            
            <MetricsCard
              title="Memory Usage"
              value={`${Math.round(metrics?.memoryUsage || 0)}%`}
              subtitle="RAM utilization"
              icon={HardDrive}
              color="green"
            />
            
            <MetricsCard
              title="Streaming Data"
              value={streamingData.toLocaleString()}
              subtitle="Real-time records"
              icon={Activity}
              color="yellow"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Processing Controls */}
            <div className="lg:col-span-1">
              <ProcessingControls
                onStartProcessing={handleStartProcessing}
                onStreamingToggle={handleStreamingToggle}
                isProcessing={isProcessing}
                isStreaming={isStreaming}
              />
            </div>

            {/* Worker Status */}
            <div className="lg:col-span-2">
              <WorkerStatus workers={workers} />
            </div>
          </div>

          {/* Data Visualizations */}
          {analysisResult && (
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <BarChart3 className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">Analysis Results</h2>
              </div>
              <DataVisualization data={analysisResult} />
            </div>
          )}

          {/* Analysis Summary */}
          {analysisResult && (
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Key Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-400">{analysisResult.totalRecords.toLocaleString()}</p>
                  <p className="text-sm text-slate-400">Total Records</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-400">{Math.round(analysisResult.averageValue).toLocaleString()}</p>
                  <p className="text-sm text-slate-400">Average Value</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-400">{Math.round(analysisResult.maxValue).toLocaleString()}</p>
                  <p className="text-sm text-slate-400">Peak Value</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-400">{Object.keys(analysisResult.categoryCounts).length}</p>
                  <p className="text-sm text-slate-400">Categories</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;