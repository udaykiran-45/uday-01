import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { AnalysisResult } from '../types';

interface DataVisualizationProps {
  data: AnalysisResult;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316'];

export const DataVisualization: React.FC<DataVisualizationProps> = ({ data }) => {
  // Prepare time series data for visualization
  const timeSeriesData = data.timeSeriesData
    .sort((a, b) => a.time - b.time)
    .reduce((acc, point, index) => {
      if (index % 100 === 0) { // Sample every 100th point for performance
        acc.push({
          time: new Date(point.time).toLocaleDateString(),
          value: Math.round(point.value * 100) / 100
        });
      }
      return acc;
    }, [] as Array<{ time: string; value: number }>);

  const categoryData = Object.entries(data.categoryCounts).map(([name, value]) => ({
    name,
    value
  }));

  const regionData = Object.entries(data.regionDistribution).map(([name, value]) => ({
    name,
    value
  }));

  return (
    <div className="space-y-6">
      {/* Time Series Analysis */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Time Series Analysis</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="time" 
                stroke="#9CA3AF"
                fontSize={12}
              />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1E293B',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Category Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Regional Distribution */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Regional Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="name" 
                  stroke="#9CA3AF"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Categories */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Top Categories by Volume</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.topCategories} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" stroke="#9CA3AF" fontSize={12} />
              <YAxis 
                dataKey="category" 
                type="category"
                stroke="#9CA3AF"
                fontSize={12}
                width={100}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1E293B',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Bar dataKey="count" fill="#F59E0B" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};