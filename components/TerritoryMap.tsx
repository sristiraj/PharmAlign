import React, { useState, useEffect } from 'react';
import { Layers, MousePointer2, Save, RefreshCw, ZoomIn, ZoomOut, Globe, Building2 } from 'lucide-react';
import { db } from '../services/database';
import { Region, Country, Territory, Affiliate } from '../types';

const TerritoryMap: React.FC = () => {
  const [activeTool, setActiveTool] = useState<'select' | 'polygon' | 'move'>('select');
  const [showHeatmap, setShowHeatmap] = useState(false);
  
  // Database State
  const [regions, setRegions] = useState<Region[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>('NA');
  const [selectedCountry, setSelectedCountry] = useState<string>('US');
  const [territories, setTerritories] = useState<Territory[]>([]);
  const [currentAffiliate, setCurrentAffiliate] = useState<Affiliate | undefined>(undefined);

  // Load Initial Data
  useEffect(() => {
    setRegions(db.getRegions());
  }, []);

  // Update Countries when Region changes
  useEffect(() => {
    const filteredCountries = db.getCountries(selectedRegion);
    setCountries(filteredCountries);
    if (filteredCountries.length > 0) {
        setSelectedCountry(filteredCountries[0].id);
    } else {
        setSelectedCountry('');
    }
  }, [selectedRegion]);

  // Update Map Data when Country changes
  useEffect(() => {
    if (selectedCountry) {
        setTerritories(db.getTerritories(selectedCountry));
        setCurrentAffiliate(db.getAffiliateByCountry(selectedCountry));
    } else {
        setTerritories([]);
        setCurrentAffiliate(undefined);
    }
  }, [selectedCountry]);

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Global Filter Bar (Database Query UI) */}
      <div className="bg-slate-900 text-white p-3 flex items-center space-x-4 shadow-md z-20">
        <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-semibold tracking-wide">GLOBAL VIEW</span>
        </div>
        <div className="h-4 w-px bg-slate-700"></div>
        
        {/* Region Select */}
        <div className="flex flex-col">
            <label className="text-[10px] text-slate-400 font-medium uppercase">Region</label>
            <select 
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer hover:text-indigo-300"
            >
                {regions.map(r => (
                    <option key={r.id} value={r.id} className="text-slate-900">{r.name}</option>
                ))}
            </select>
        </div>

        {/* Country Select */}
        <div className="flex flex-col pl-4 border-l border-slate-700">
            <label className="text-[10px] text-slate-400 font-medium uppercase">Country</label>
            <select 
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer hover:text-indigo-300"
            >
                {countries.map(c => (
                    <option key={c.id} value={c.id} className="text-slate-900">{c.name}</option>
                ))}
            </select>
        </div>

        {/* Affiliate Info Display */}
        {currentAffiliate && (
            <div className="flex items-center ml-auto bg-indigo-900/50 px-3 py-1.5 rounded border border-indigo-700/50">
                <Building2 className="w-4 h-4 text-indigo-300 mr-2" />
                <div>
                    <div className="text-xs text-indigo-200">Affiliate Entity</div>
                    <div className="text-xs font-bold">{currentAffiliate.name} ({currentAffiliate.code})</div>
                </div>
            </div>
        )}
      </div>

      {/* Map Toolbar */}
      <div className="p-4 border-b border-slate-200 bg-white flex justify-between items-center z-10 relative">
        <div className="flex space-x-2">
          <button 
            onClick={() => setActiveTool('select')}
            className={`p-2 rounded-lg transition-colors ${activeTool === 'select' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:bg-slate-100'}`}
            title="Select Territory"
          >
            <MousePointer2 className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setActiveTool('move')}
            className={`p-2 rounded-lg transition-colors ${activeTool === 'move' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:bg-slate-100'}`}
            title="Edit Boundaries"
          >
            <Layers className="w-5 h-5" />
          </button>
          <div className="w-px h-8 bg-slate-200 mx-2"></div>
          <button 
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${showHeatmap ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
          >
            <span className={`w-3 h-3 rounded-full ${showHeatmap ? 'bg-indigo-500' : 'bg-slate-300'}`}></span>
            <span>Potential Heatmap</span>
          </button>
        </div>

        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
            <RefreshCw className="w-4 h-4" />
            <span>Auto-Balance (AI)</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
            <Save className="w-4 h-4" />
            <span>Save Scenario</span>
          </button>
        </div>
      </div>

      {/* Map Canvas Area */}
      <div className="flex-1 bg-slate-100 relative overflow-hidden group">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>
        
        {/* Empty State if no territories */}
        {territories.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                    <Globe className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-500">No territories defined for this country.</p>
                </div>
            </div>
        )}

        {/* Conceptual Map Visualization using SVG */}
        <svg className="w-full h-full" viewBox="0 0 800 600">
           <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="1"/>
            </pattern>
            <filter id="shadow">
                <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3"/>
            </filter>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Dynamic Rendering of Territories based on selected Country */}
          {selectedCountry === 'US' && (
            <>
              {/* NYC */}
              <path 
                d="M 200 150 L 350 150 L 380 250 L 250 300 L 180 220 Z" 
                fill={showHeatmap ? "#ef4444" : "#fee2e2"} 
                fillOpacity="0.6" stroke="#ef4444" strokeWidth="3" filter="url(#shadow)"
                className="cursor-pointer hover:fill-opacity-80 transition-all duration-300"
              />
              <text x="280" y="220" textAnchor="middle" className="text-sm font-bold fill-red-900 pointer-events-none">T001: NYC</text>

              {/* Boston */}
              <path 
                d="M 350 150 L 550 120 L 600 250 L 380 250 Z" 
                fill={showHeatmap ? "#3b82f6" : "#dbeafe"} 
                fillOpacity="0.6" stroke="#3b82f6" strokeWidth="2" filter="url(#shadow)"
                className="cursor-pointer hover:fill-opacity-80 transition-all duration-300"
              />
              <text x="480" y="200" textAnchor="middle" className="text-sm font-bold fill-blue-900 pointer-events-none">T002: BOS</text>

              {/* Philly */}
              <path 
                d="M 250 300 L 380 250 L 450 400 L 280 450 Z" 
                fill={showHeatmap ? "#10b981" : "#d1fae5"} 
                fillOpacity="0.6" stroke="#10b981" strokeWidth="2" filter="url(#shadow)"
                className="cursor-pointer hover:fill-opacity-80 transition-all duration-300"
              />
              <text x="350" y="360" textAnchor="middle" className="text-sm font-bold fill-emerald-900 pointer-events-none">T003: PHL</text>

              {/* DC */}
              <path 
                d="M 280 450 L 450 400 L 420 550 L 250 520 Z" 
                fill={showHeatmap ? "#f59e0b" : "#fef3c7"} 
                fillOpacity="0.6" stroke="#f59e0b" strokeWidth="2" filter="url(#shadow)"
                className="cursor-pointer hover:fill-opacity-80 transition-all duration-300"
              />
              <text x="350" y="490" textAnchor="middle" className="text-sm font-bold fill-amber-900 pointer-events-none">T004: DC</text>
            </>
          )}

          {selectedCountry === 'GB' && (
            <>
              {/* London */}
              <path 
                d="M 300 250 L 500 250 L 480 400 L 320 400 Z" 
                fill={showHeatmap ? "#ef4444" : "#fee2e2"} 
                fillOpacity="0.6" stroke="#ef4444" strokeWidth="3" filter="url(#shadow)"
                className="cursor-pointer hover:fill-opacity-80 transition-all duration-300"
              />
              <text x="400" y="330" textAnchor="middle" className="text-sm font-bold fill-red-900 pointer-events-none">T_UK_01: London</text>
              
               {/* Manchester */}
               <path 
                d="M 300 100 L 450 100 L 480 230 L 320 230 Z" 
                fill={showHeatmap ? "#3b82f6" : "#dbeafe"} 
                fillOpacity="0.6" stroke="#3b82f6" strokeWidth="3" filter="url(#shadow)"
                className="cursor-pointer hover:fill-opacity-80 transition-all duration-300"
              />
              <text x="390" y="170" textAnchor="middle" className="text-sm font-bold fill-blue-900 pointer-events-none">T_UK_02: Manchester</text>
            </>
          )}

          {/* Fallback visual for other countries */}
          {selectedCountry !== 'US' && selectedCountry !== 'GB' && territories.length > 0 && (
             <g>
               <rect x="200" y="200" width="400" height="300" fill="#f1f5f9" stroke="#94a3b8" strokeDasharray="5 5" rx="20" />
               <text x="400" y="350" textAnchor="middle" className="text-lg text-slate-400 fill-slate-400">Map Data Not Available for {selectedCountry}</text>
             </g>
          )}

          {/* Pins for HCPs (Only show if territories exist) */}
          {territories.length > 0 && (
            <>
               <circle cx="280" cy="200" r="4" fill="#1e293b" />
               <circle cx="300" cy="180" r="4" fill="#1e293b" />
               <circle cx="500" cy="180" r="4" fill="#1e293b" />
               <circle cx="350" cy="300" r="4" fill="#1e293b" />
            </>
          )}
        </svg>

        {/* Map Controls */}
        <div className="absolute bottom-6 right-6 flex flex-col space-y-2">
          <button className="p-2 bg-white rounded-lg shadow-md border border-slate-200 text-slate-600 hover:text-indigo-600">
            <ZoomIn className="w-5 h-5" />
          </button>
          <button className="p-2 bg-white rounded-lg shadow-md border border-slate-200 text-slate-600 hover:text-indigo-600">
            <ZoomOut className="w-5 h-5" />
          </button>
        </div>
        
        {/* Legend */}
        <div className="absolute bottom-6 left-6 bg-white p-3 rounded-lg shadow-md border border-slate-200">
          <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Workload Index</h4>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <span className="text-xs text-slate-700">High (&gt;1.2)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-blue-400"></div>
              <span className="text-xs text-slate-700">Balanced (0.9 - 1.1)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <span className="text-xs text-slate-700">Low (&lt;0.9)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerritoryMap;