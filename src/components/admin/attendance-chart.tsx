/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { 
  AreaChart, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  Area,
  TooltipProps,
  LegendProps
} from 'recharts';
import { AttendanceStat } from '../../lib/types/dashboard';
import { useState } from 'react';
import { TrendingUp, Users, User, Baby, Calendar } from 'lucide-react';

interface AttendanceChartProps {
  data?: AttendanceStat[];
}

interface ChartDataPoint {
  date: string;
  total: number;
  adults: number;
  children: number;
  fullDate: string;
  dayOfWeek: string;
  growth: number;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const total = payload.find(p => p.dataKey === 'total')?.value || 0;
    const adults = payload.find(p => p.dataKey === 'adults')?.value || 0;
    const children = payload.find(p => p.dataKey === 'children')?.value || 0;
    const growth = payload.find(p => p.dataKey === 'growth')?.value || 0;
    
    return (
      <div className="backdrop-blur-xl bg-gray-900/95 border border-white/20 rounded-xl p-4 shadow-2xl min-w-[200px]">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/20">
          <Calendar className="w-4 h-4 text-blue-300" />
          <p className="text-white font-teko text-lg font-bold">{label}</p>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-white/90 text-sm">Total</span>
            </div>
            <span className="text-white font-bold text-lg">{total}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-white/90 text-sm">Adults</span>
            </div>
            <span className="text-white font-bold">{adults}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-white/90 text-sm">Children</span>
            </div>
            <span className="text-white font-bold">{children}</span>
          </div>
          
          <div className="flex items-center justify-between pt-2 mt-2 border-t border-white/20">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-3 h-3 text-yellow-400" />
              <span className="text-white/90 text-sm">Growth</span>
            </div>
            <span className={`font-bold ${growth >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {growth >= 0 ? '+' : ''}
              {growth}%
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const CustomLegend = (props: Omit<LegendProps, 'ref'>) => {
  const { payload } = props;
  const [activeSeries, setActiveSeries] = useState(['total', 'adults', 'children']);

  if (!payload || payload.length === 0) {
    return null;
  }

  const handleClick = (dataKey: string) => {
    if (activeSeries.includes(dataKey)) {
      if (activeSeries.length > 1) {
        setActiveSeries(activeSeries.filter(key => key !== dataKey));
      }
    } else {
      setActiveSeries([...activeSeries, dataKey]);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
      {payload.map((entry: any, index: number) => (
        <button
          key={`legend-${index}`}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200 ${
            activeSeries.includes(entry.dataKey?.toString() || '') 
              ? 'bg-white/10 backdrop-blur-sm border border-white/20' 
              : 'opacity-40 hover:opacity-70'
          }`}
          onClick={() => handleClick(entry.dataKey?.toString() || '')}
        >
          <div 
            className="w-3 h-3 rounded-full"
            style={{ 
              backgroundColor: entry.color,
              boxShadow: activeSeries.includes(entry.dataKey?.toString() || '') ? `0 0 8px ${entry.color}80` : 'none'
            }}
          />
          <span className="text-white text-sm font-medium">{entry.value}</span>
          {entry.dataKey === 'total' && <Users className="w-3 h-3" />}
          {entry.dataKey === 'adults' && <User className="w-3 h-3" />}
          {entry.dataKey === 'children' && <Baby className="w-3 h-3" />}
        </button>
      ))}
    </div>
  );
};

export function AttendanceChart({ data = [] }: AttendanceChartProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  
  // Calculate growth percentage for each data point
  const calculateGrowth = (data: AttendanceStat[]): ChartDataPoint[] => {
    return data.map((stat, index) => {
      const prevTotal = index > 0 ? data[index - 1].total : stat.total;
      const growth = prevTotal > 0 ? Math.round(((stat.total - prevTotal) / prevTotal) * 100) : 0;
      
      return {
        date: new Date(stat.date).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        }),
        fullDate: stat.date,
        dayOfWeek: new Date(stat.date).toLocaleDateString('en-US', { weekday: 'short' }),
        total: stat.total,
        adults: stat.adults,
        children: stat.children,
        growth: growth
      };
    });
  };

  const chartData: ChartDataPoint[] = calculateGrowth(data);

  if (chartData.length === 0) {
    return (
      <div className="relative overflow-hidden backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl h-[600px] flex flex-col">
        <div className="relative z-10">
          <div className="mb-8">
            <h2 className="text-white font-teko text-3xl font-bold mb-2">Attendance Analytics</h2>
            <p className="text-white/60 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Real-time attendance tracking and insights
            </p>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center mb-6">
              <Users className="w-12 h-12 text-white/40" />
            </div>
            <p className="text-white/80 text-lg mb-2">No attendance data available</p>
            <p className="text-white/50 text-sm">Start tracking attendance to see insights</p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const avgAttendance = Math.round(chartData.reduce((acc, curr) => acc + curr.total, 0) / chartData.length);
  const maxAttendance = Math.max(...chartData.map(d => d.total));
  const totalAdults = chartData.reduce((acc, curr) => acc + curr.adults, 0);
  const totalChildren = chartData.reduce((acc, curr) => acc + curr.children, 0);
  const totalGrowth = chartData[chartData.length - 1].growth;

  return (
    <div className="relative overflow-hidden backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl h-[600px] flex flex-col">
      {/* Header - Made smaller */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-white font-teko text-3xl font-bold mb-1">Attendance Analytics</h2>
            <p className="text-white/60 flex items-center gap-2 text-sm">
              <Calendar className="w-3.5 h-3.5" />
              Last {timeRange === '7d' ? '7' : timeRange === '90d' ? '90' : '30'} days • Updated today
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex bg-white/10 backdrop-blur-sm rounded-xl p-1 border border-white/20">
              {(['7d', '30d', '90d'] as const).map((range) => (
                <button
                  key={range}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    timeRange === range 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                  onClick={() => setTimeRange(range)}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards  */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-xs mb-1">Avg. Attendance</p>
              <p className="text-white text-xl font-bold">{avgAttendance}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-red-400" />
            </div>
          </div>
        </div>
        
        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-xs mb-1">Peak Attendance</p>
              <p className="text-white text-xl font-bold">{maxAttendance}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-400" />
            </div>
          </div>
        </div>
        
        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-xs mb-1">Total Adults</p>
              <p className="text-white text-xl font-bold">{totalAdults}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <User className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
        </div>
        
        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-xs mb-1">Total Children</p>
              <p className="text-white text-xl font-bold">{totalChildren}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <Baby className="w-4 h-4 text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-xs mb-1">Growth</p>
              <p className={`text-xl font-bold ${totalGrowth >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {totalGrowth >= 0 ? '+' : ''}{totalGrowth}%
              </p>
            </div>
            <div className={`w-8 h-8 rounded-full ${totalGrowth >= 0 ? 'bg-emerald-500/20' : 'bg-red-500/20'} flex items-center justify-center`}>
              <TrendingUp className={`w-4 h-4 ${totalGrowth >= 0 ? 'text-emerald-400' : 'text-red-400'} ${totalGrowth < 0 ? 'rotate-180' : ''}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart 
            data={chartData} 
            margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
          >
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C80036" stopOpacity={0.8}/>
                <stop offset="100%" stopColor="#C80036" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorAdults" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8}/>
                <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorChildren" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity={0.8}/>
                <stop offset="100%" stopColor="#10B981" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#374151" 
              vertical={false}
              strokeOpacity={0.3}
            />
            
            <XAxis 
              dataKey="date" 
              stroke="#9CA3AF"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: '#4B5563', strokeWidth: 1 }}
              padding={{ left: 10, right: 10 }}
            />
            
            <YAxis 
              stroke="#9CA3AF"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: '#4B5563', strokeWidth: 1 }}
              width={40}
            />
            
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ 
                stroke: '#ffffff20',
                strokeWidth: 1,
                strokeDasharray: '3 3'
              }}
            />
            
            <Legend content={<CustomLegend />} />
            
            {/* Main area charts with larger visual elements */}
            <Area 
              type="monotone" 
              dataKey="total" 
              name="Total"
              stroke="#C80036" 
              strokeWidth={4}
              fill="url(#colorTotal)"
              fillOpacity={0.4}
              dot={{ r: 5, fill: '#C80036', strokeWidth: 2, stroke: '#ffffff' }}
              activeDot={{ r: 8, fill: '#ffffff', stroke: '#C80036', strokeWidth: 3 }}
            />
            
            <Area 
              type="monotone" 
              dataKey="adults" 
              name="Adults"
              stroke="#3B82F6" 
              strokeWidth={3}
              fill="url(#colorAdults)"
              fillOpacity={0.3}
            />
            
            <Area 
              type="monotone" 
              dataKey="children" 
              name="Children"
              stroke="#10B981" 
              strokeWidth={3}
              fill="url(#colorChildren)"
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}