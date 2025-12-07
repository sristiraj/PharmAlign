import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TerritoryMap from './components/TerritoryMap';
import AIAdvisor from './components/AIAdvisor';
import Rep360 from './components/Rep360';
import CallPlanner from './components/CallPlanner';
import { ViewState } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);

  const renderContent = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <Dashboard />;
      case ViewState.TERRITORY_MAP:
        return <TerritoryMap />;
      case ViewState.AI_ADVISOR:
        return <AIAdvisor />;
      case ViewState.REP_360:
        return <Rep360 />;
      case ViewState.CALL_PLANNER:
        return <CallPlanner />;
      case ViewState.SCENARIO_SIMULATOR:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center max-w-md">
                <h3 className="text-xl font-bold text-slate-800 mb-2">Scenario Simulator</h3>
                <p>This advanced module allows you to run "What-If" analysis on territory structures. (Coming in v1.1)</p>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="ml-64 flex-1 p-8 overflow-y-auto h-screen">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;