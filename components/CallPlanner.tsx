import React from 'react';
import { Calendar, MapPin, Clock, Navigation, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react';
import { mockHCPs } from '../services/mockData';

const CallPlanner: React.FC = () => {
  // Sort HCPs by potential for "optimization" simulation
  const plannedCalls = [...mockHCPs].sort((a, b) => b.potentialScore - a.potentialScore).slice(0, 4);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-6rem)]">
      {/* Route List */}
      <div className="lg:col-span-1 flex flex-col space-y-4 overflow-y-auto pr-2">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-800 flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <span>Today's Plan: Oct 24</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">AI Optimized for Impact & Drive Time</p>
          <div className="mt-4 flex items-center justify-between text-sm">
             <span className="text-slate-600">4 Stops</span>
             <span className="text-slate-600">42 mi / 1.5 hr drive</span>
          </div>
        </div>

        {plannedCalls.map((hcp, index) => (
          <div key={hcp.id} className="relative group">
            {index !== plannedCalls.length - 1 && (
                <div className="absolute left-6 top-10 bottom-[-16px] w-0.5 bg-indigo-100 group-hover:bg-indigo-200 transition-colors"></div>
            )}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:border-indigo-300 transition-all cursor-pointer">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 z-10 ring-4 ring-white">
                    {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h4 className="font-bold text-slate-800">{hcp.name}</h4>
                    <span className="text-xs font-medium text-slate-400">10:00 AM</span>
                  </div>
                  <p className="text-xs text-indigo-600 font-medium">{hcp.specialty}</p>
                  <p className="text-xs text-slate-500 mt-1 flex items-center">
                     <MapPin className="w-3 h-3 mr-1" /> {hcp.address}
                  </p>
                  
                  <div className="mt-3 p-2 bg-slate-50 rounded border border-slate-100">
                    <p className="text-xs font-medium text-slate-700 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1 text-amber-500" />
                        Why: Declining NRx in {hcp.specialty}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Map View */}
      <div className="lg:col-span-2 bg-slate-100 rounded-xl shadow-sm border border-slate-200 relative overflow-hidden flex flex-col">
        <div className="absolute top-4 right-4 z-10 bg-white p-2 rounded-lg shadow-md">
            <div className="text-xs font-bold text-slate-500 mb-1">TRAFFIC</div>
            <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-xs text-slate-700">Light</span>
            </div>
        </div>
        
        {/* Mock Map for Route */}
        <div className="flex-1 relative bg-[#e5e7eb] flex items-center justify-center">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]"></div>
            
            {/* SVG Route Visualization */}
            <svg className="w-full h-full" viewBox="0 0 800 600">
                {/* Roads */}
                <path d="M 200 100 L 200 300 L 500 300 L 500 500" fill="none" stroke="white" strokeWidth="12" />
                <path d="M 200 100 L 200 300 L 500 300 L 500 500" fill="none" stroke="#6366f1" strokeWidth="4" strokeDasharray="10 5" />
                
                {/* Waypoints */}
                <circle cx="200" cy="100" r="8" fill="#4f46e5" stroke="white" strokeWidth="2" />
                <text x="220" y="105" className="text-sm font-bold fill-slate-700">Stop 1</text>

                <circle cx="200" cy="300" r="8" fill="#4f46e5" stroke="white" strokeWidth="2" />
                <text x="180" y="325" className="text-sm font-bold fill-slate-700">Stop 2</text>

                <circle cx="500" cy="300" r="8" fill="#4f46e5" stroke="white" strokeWidth="2" />
                <text x="520" y="295" className="text-sm font-bold fill-slate-700">Stop 3</text>

                <circle cx="500" cy="500" r="8" fill="#4f46e5" stroke="white" strokeWidth="2" />
                <text x="520" y="505" className="text-sm font-bold fill-slate-700">Stop 4</text>
            </svg>
        </div>

        <div className="bg-white p-4 border-t border-slate-200 flex justify-between items-center">
            <div className="flex items-center space-x-4">
                <div className="text-center">
                    <p className="text-xs text-slate-500">Est. Time</p>
                    <p className="font-bold text-slate-800">4h 30m</p>
                </div>
                <div className="h-8 w-px bg-slate-200"></div>
                <div className="text-center">
                    <p className="text-xs text-slate-500">Distance</p>
                    <p className="font-bold text-slate-800">42 mi</p>
                </div>
            </div>
            <button className="flex items-center space-x-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm shadow-indigo-200">
                <Navigation className="w-4 h-4" />
                <span>Start Route</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default CallPlanner;