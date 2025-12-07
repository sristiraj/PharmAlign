import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { performanceData, workloadDistribution, mockTerritories } from '../services/mockData';
import { TrendingUp, Users, MapPin, AlertTriangle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const totalHCPs = mockTerritories.reduce((acc, t) => acc + t.hcpCount, 0);
  const avgWorkload = (mockTerritories.reduce((acc, t) => acc + t.workloadIndex, 0) / mockTerritories.length).toFixed(2);
  const unbalancedTerritories = mockTerritories.filter(t => t.workloadIndex > 1.1 || t.workloadIndex < 0.9).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Commercial Operations Overview</h2>
          <p className="text-slate-500">Real-time performance and alignment metrics</p>
        </div>
        <div className="flex space-x-2">
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium border border-green-200">
                Data Updated: Just now
            </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total TRx Volume</p>
              <h3 className="text-2xl font-bold text-slate-900">25,600</h3>
            </div>
            <div className="p-3 bg-indigo-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
          <p className="mt-4 text-xs text-green-600 font-medium flex items-center">
            <span className="bg-green-100 px-1.5 py-0.5 rounded mr-2">↑ 12.5%</span> 
            vs last month
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Active HCPs</p>
              <h3 className="text-2xl font-bold text-slate-900">{totalHCPs}</h3>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-500 flex items-center">
             Across {mockTerritories.length} territories
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Avg Workload Index</p>
              <h3 className="text-2xl font-bold text-slate-900">{avgWorkload}</h3>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg">
              <MapPin className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-500">Target: 1.0 (±0.1)</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Unbalanced Areas</p>
              <h3 className="text-2xl font-bold text-red-600">{unbalancedTerritories}</h3>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <p className="mt-4 text-xs text-red-600 font-medium">
            Requires attention
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Performance */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6">TRx Performance vs Target</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="value" stroke="#6366f1" fillOpacity={1} fill="url(#colorValue)" name="Actual Sales" />
                <Line type="monotone" dataKey="target" stroke="#94a3b8" strokeDasharray="5 5" name="Target" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Workload Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Territory Workload Balance</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workloadDistribution} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Workload Index" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-xs text-yellow-800">
            <strong>Insight:</strong> T004 (DC Metro) is significantly over-capacity (1.35). Consider shifting ZIPs to T003.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;