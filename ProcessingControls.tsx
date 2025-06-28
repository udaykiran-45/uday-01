import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Download, Settings } from 'lucide-react';

interface ProcessingControlsProps {
  onStartProcessing: (size: number) => void;
  onStreamingToggle: (enabled: boolean) => void;
  isProcessing: boolean;
  isStreaming: boolean;
}

export const ProcessingControls: React.FC<ProcessingControlsProps> = ({
  onStartProcessing,
  onStreamingToggle,
  isProcessing,
  isStreaming
}) => {
  const [datasetSize, setDatasetSize] = useState(100000);

  const handleSizeChange = (size: number) => {
    setDatasetSize(size);
  };

  const exportData = () => {
    // Simulate data export
    const data = {
      timestamp: new Date().toISOString(),
      datasetSize,
      message: 'Analysis results exported successfully'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `big-data-analysis-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Settings className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">Processing Controls</h3>
      </div>
      
      <div className="space-y-6">
        {/* Dataset Size Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Dataset Size
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[10000, 50000, 100000, 500000, 1000000, 5000000].map((size) => (
              <button
                key={size}
                onClick={() => handleSizeChange(size)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  datasetSize === size
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {size.toLocaleString()} records
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => onStartProcessing(datasetSize)}
            disabled={isProcessing}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Start Analysis</span>
              </>
            )}
          </button>

          <button
            onClick={() => onStreamingToggle(!isStreaming)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              isStreaming
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isStreaming ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Stop Stream</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Start Stream</span>
              </>
            )}
          </button>

          <button
            onClick={exportData}
            className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>

          <button
            onClick={() => window.location.reload()}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>

        {/* Real-time Streaming Toggle */}
        <div className="pt-4 border-t border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-white">Real-time Data Streaming</h4>
              <p className="text-xs text-slate-400">Process data as it arrives</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isStreaming ? 'bg-green-400 animate-pulse' : 'bg-slate-600'}`} />
              <span className="text-xs text-slate-400">
                {isStreaming ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};