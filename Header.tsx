import React from 'react';
import { BarChart3, Database, Activity } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-900 border-b border-slate-700">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Big Data Analytics</h1>
              <p className="text-sm text-slate-400">Scalable Data Processing Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-slate-400">
              <Activity className="w-4 h-4" />
              <span className="text-sm">Real-time Processing</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            
            <div className="flex items-center space-x-2 text-slate-400">
              <BarChart3 className="w-4 h-4" />
              <span className="text-sm">Live Analytics</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};