import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface MetricsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'blue' | 'green' | 'yellow' | 'red';
}

export const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend = 'neutral',
  color = 'blue'
}) => {
  const colorClasses = {
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    green: 'bg-green-500/10 text-green-400 border-green-500/20',
    yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    red: 'bg-red-500/10 text-red-400 border-red-500/20'
  };

  const trendColors = {
    up: 'text-green-400',
    down: 'text-red-400',
    neutral: 'text-slate-400'
  };

  return (
    <div className={`p-6 rounded-xl border ${colorClasses[color]} bg-slate-800 hover:bg-slate-750 transition-colors`}>
      <div className="flex items-center justify-between mb-4">
        <Icon className="w-6 h-6" />
        {trend !== 'neutral' && (
          <div className={`text-xs font-medium ${trendColors[trend]}`}>
            {trend === 'up' ? '↗' : '↘'}
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-slate-400">{title}</h3>
        <p className="text-2xl font-bold text-white">{value}</p>
        {subtitle && (
          <p className="text-xs text-slate-500">{subtitle}</p>
        )}
      </div>
    </div>
  );
};