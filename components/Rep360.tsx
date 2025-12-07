import React from 'react';
import { Search, Filter, MoreHorizontal, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { mockHCPs } from '../services/mockData';

const Rep360: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Field Intelligence (Rep360)</h2>
          <p className="text-slate-500">HCP Performance & Opportunities</p>
        </div>
        <div className="flex space-x-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by NPI, Name, or Zip..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-700 text-sm">
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-600">HCP Name / NPI</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Specialty</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Territory</th>
                <th className="px-6 py-4 font-semibold text-slate-600 text-center">Potential</th>
                <th className="px-6 py-4 font-semibold text-slate-600 text-center">NRx Growth</th>
                <th className="px-6 py-4 font-semibold text-slate-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockHCPs.map((hcp) => (
                <tr key={hcp.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{hcp.name}</div>
                    <div className="text-xs text-slate-500">NPI: {hcp.npi}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                      {hcp.specialty}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {hcp.territoryId}
                  </td>
                  <td className="px-6 py-4 text-center">
                     <div className="flex flex-col items-center">
                        <span className={`font-bold ${hcp.potentialScore > 90 ? 'text-green-600' : hcp.potentialScore > 75 ? 'text-indigo-600' : 'text-slate-600'}`}>
                            {hcp.potentialScore}
                        </span>
                        <div className="w-16 h-1.5 bg-slate-200 rounded-full mt-1">
                            <div 
                                className={`h-1.5 rounded-full ${hcp.potentialScore > 90 ? 'bg-green-500' : hcp.potentialScore > 75 ? 'bg-indigo-500' : 'bg-slate-400'}`} 
                                style={{ width: `${hcp.potentialScore}%` }}
                            ></div>
                        </div>
                     </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className={`flex items-center justify-center space-x-1 ${hcp.nrxGrowth > 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {hcp.nrxGrowth > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        <span className="font-medium">{Math.abs(hcp.nrxGrowth)}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-indigo-600 transition-colors">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center text-sm text-slate-500">
          <span>Showing {mockHCPs.length} of 2,450 HCPs</span>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-slate-300 rounded hover:bg-white disabled:opacity-50">Previous</button>
            <button className="px-3 py-1 border border-slate-300 rounded hover:bg-white">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rep360;