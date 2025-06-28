import React from 'react';
import { WorkerStatus as WorkerStatusType } from '../types';
import { Cpu, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface WorkerStatusProps {
  workers: WorkerStatusType[];
}

export const WorkerStatus: React.FC<WorkerStatusProps> = ({ workers }) => {
  const getStatusIcon = (status: WorkerStatusType['status']) => {
    switch (status) {
      case 'processing':
        return <Clock className="w-4 h-4 text-yellow-400 animate-spin" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      default:
        return <CheckCircle className="w-4 h-4 text-green-400" />;
    }
  };

  const getStatusColor = (status: WorkerStatusType['status']) => {
    switch (status) {
      case 'processing':
        return 'border-yellow-500/20 bg-yellow-500/5';
      case 'error':
        return 'border-red-500/20 bg-red-500/5';
      default:
        return 'border-green-500/20 bg-green-500/5';
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Cpu className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">Worker Cluster Status</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {workers.map((worker) => (
          <div
            key={worker.id}
            className={`p-4 rounded-lg border ${getStatusColor(worker.status)} transition-all duration-200`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-white capitalize">
                {worker.id.replace('_', ' ')}
              </span>
              {getStatusIcon(worker.status)}
            </div>
            
            <div className="space-y-1">
              <p className="text-xs text-slate-400">
                Status: <span className="text-white capitalize">{worker.status}</span>
              </p>
              <p className="text-xs text-slate-400">
                Tasks: <span className="text-white">{worker.tasksCompleted}</span>
              </p>
              {worker.currentTask && (
                <p className="text-xs text-yellow-400 truncate">
                  {worker.currentTask}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};