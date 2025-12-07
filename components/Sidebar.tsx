import React from 'react';
import { LayoutDashboard, Map, Users, Bot, Calendar, SlidersHorizontal, Settings, PieChart } from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const menuItems = [
    { id: ViewState.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: ViewState.TERRITORY_MAP, label: 'Territory Alignment', icon: Map },
    { id: ViewState.REP_360, label: 'Field Intel (Rep360)', icon: Users },
    { id: ViewState.CALL_PLANNER, label: 'Predictive Call Plan', icon: Calendar },
    { id: ViewState.AI_ADVISOR, label: 'AI Advisor', icon: Bot },
    { id: ViewState.SCENARIO_SIMULATOR, label: 'Scenario Simulator', icon: SlidersHorizontal },
  ];

  return (
    <div className="w-64 bg-slate-900 text-slate-100 flex flex-col h-screen fixed left-0 top-0 shadow-xl z-20">
      <div className="p-6 border-b border-slate-700 flex items-center space-x-2">
        <PieChart className="w-8 h-8 text-indigo-400" />
        <div>
          <h1 className="text-xl font-bold tracking-tight">PharmaAlign</h1>
          <p className="text-xs text-slate-400">Territory Intelligence</p>
        </div>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-700">
        <button className="w-full flex items-center space-x-3 px-4 py-2 text-slate-400 hover:text-white transition-colors">
          <Settings className="w-5 h-5" />
          <span className="text-sm">Settings</span>
        </button>
        <div className="mt-4 flex items-center space-x-3 px-4">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold">JD</div>
          <div className="text-xs">
            <p className="font-semibold">John Doe</p>
            <p className="text-slate-500">Commercial Ops</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;