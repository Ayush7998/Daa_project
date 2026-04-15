import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { Home, Database, Settings, Activity, FileBarChart, BookOpen } from 'lucide-react';

// Placeholder Pages
import HomePage from './pages/HomePage';
import DatasetPanel from './pages/DatasetPanel';
import ConfigPanel from './pages/ConfigPanel';
import SimulationPage from './pages/SimulationPage';
import ResultsPage from './pages/ResultsPage';
import AlgorithmExplanation from './pages/AlgorithmExplanation';

function App() {
  return (
    <div className="flex h-screen bg-slate-900 text-slate-50 font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <nav className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col pt-6 z-10 shrink-0">
        <div className="px-6 pb-6 border-b border-slate-700">
          <h1 className="text-xl font-bold tracking-tight text-teal-400">UrbanGA</h1>
          <p className="text-xs text-slate-400 mt-1">Tree Placement Optimizer</p>
        </div>
        
        <ul className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <NavItem to="/" icon={<Home size={18} />} label="Home" />
          <NavItem to="/dataset" icon={<Database size={18} />} label="Dataset Info" />
          <NavItem to="/config" icon={<Settings size={18} />} label="Configuration" />
          <NavItem to="/simulation" icon={<Activity size={18} />} label="Simulation" />
          <NavItem to="/results" icon={<FileBarChart size={18} />} label="Results" />
          <NavItem to="/explanation" icon={<BookOpen size={18} />} label="How GA Works" />
        </ul>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-slate-900">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dataset" element={<DatasetPanel />} />
          <Route path="/config" element={<ConfigPanel />} />
          <Route path="/simulation" element={<SimulationPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/explanation" element={<AlgorithmExplanation />} />
        </Routes>
      </main>
    </div>
  );
}

// NavItem Component Helper
const NavItem = ({ to, icon, label }) => {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
            isActive
              ? 'bg-green-700/20 text-green-400 font-medium'
              : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
          }`
        }
      >
        {icon}
        <span>{label}</span>
      </NavLink>
    </li>
  );
};

export default App;
