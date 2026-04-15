import React, { useContext } from 'react';
import { SimulationContext } from '../context/SimulationContext';
import GridVisualizer from '../components/GridVisualizer';
import { Play, Square, FastForward, Calculator, Activity } from 'lucide-react';

const SimulationPage = () => {
  const { grid, config, gaProgress, toggleGaSimulation, changeSpeed } = useContext(SimulationContext);

  if (grid.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
        <Activity size={48} className="text-slate-600 mb-4" />
        <h2 className="text-2xl font-bold text-slate-400 mb-2">No Grid Data</h2>
        <p className="text-slate-500 max-w-md">Please navigate to the Dataset tab and generate a grid before running simulations.</p>
      </div>
    );
  }

  const comparisonDiff = gaProgress.originalBestFitness > 0 
    ? (((gaProgress.modifiedBestFitness - gaProgress.originalBestFitness) / gaProgress.originalBestFitness) * 100).toFixed(1)
    : 0;

  return (
    <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-green-500 bg-clip-text text-transparent">Simulation Dashboard</h2>
          <p className="text-slate-400 mt-1">Live competitive simulation: Original GA vs Modified GA.</p>
        </div>
        
        {/* Global Controls */}
        <div className="flex gap-4">
          {/* GA Control */}
          <button 
            onClick={toggleGaSimulation}
            className={`flex items-center gap-2 px-8 py-2 rounded-lg font-bold text-white shadow-lg transition-all ${
              gaProgress.isRunning ? 'bg-red-600 hover:bg-red-500' : 'bg-teal-600 hover:bg-teal-500'
            }`}
          >
            {gaProgress.isRunning ? <Square size={18} /> : <Play size={18} />}
            {gaProgress.isRunning ? 'Stop GA' : 'Start GA'}
          </button>
        </div>
      </header>

      {/* Speed Controls */}
      <div className="flex gap-2 justify-end">
        {[ {label: '1x', val: 500}, {label: '2x', val: 250}, {label: '5x', val: 50}, {label: 'MAX', val: 0} ].map(sp => (
          <button
            key={sp.label}
            onClick={() => changeSpeed(sp.val)}
            className={`px-3 py-1 text-xs rounded border transition-colors ${gaProgress.speed === sp.val ? 'bg-teal-600 border-teal-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}`}
          >
            {sp.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        
        {/* Context / Genetic Algorithm UI */}
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-lg flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2 text-teal-400">
              GA Evolution
              {gaProgress.isRunning && <span className="flex h-3 w-3 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span></span>}
            </h3>
            <div className="text-right">
              <div className="text-sm text-slate-400">Generation</div>
              <div className="font-mono text-xl">{gaProgress.generation} / {config.generations}</div>
            </div>
          </div>
          
          <div className="w-full flex flex-col items-center justify-center p-2 bg-slate-900/50 rounded-lg mb-4">
             <span className="text-xs text-slate-500 mb-2 font-semibold tracking-wider">Displaying Modified GA Placements</span>
             <div className="w-full max-w-sm">
                <GridVisualizer grid={grid} chromosome={gaProgress.modifiedBestChromosome} config={config} />
             </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-auto">
            <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700">
              <div className="flex justify-between items-center mb-1">
                <div className="text-xs text-slate-400 uppercase">Original GA Fitness</div>
                <div className="text-xs text-slate-500 font-mono">Fixed Mut.</div>
              </div>
              <div className="text-xl font-mono text-white">
                {gaProgress.originalBestFitness !== -Infinity ? gaProgress.originalBestFitness : '-'}
              </div>
            </div>
            <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700">
              <div className="flex justify-between items-center mb-1">
                <div className="text-xs text-slate-400 uppercase">Modified GA Fitness</div>
                <div className="text-xs text-yellow-500 font-mono">Dyn Mut.</div>
              </div>
              <div className="text-xl font-mono text-white">
                {gaProgress.modifiedBestFitness !== -Infinity ? gaProgress.modifiedBestFitness : '-'}
              </div>
            </div>
          </div>
        </div>

        {/* Brute Force UI */}
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-lg flex flex-col h-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2 text-slate-300">
              Original GA Baseline
              {gaProgress.isRunning && <span className="flex h-3 w-3 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-slate-500"></span></span>}
            </h3>
          </div>
          
          <div className="w-full flex flex-col items-center justify-center p-2 bg-slate-900/50 rounded-lg mb-4">
             <span className="text-xs text-slate-500 mb-2 font-semibold tracking-wider">Displaying Original GA Placements</span>
             <div className="w-full max-w-sm">
                <GridVisualizer grid={grid} chromosome={gaProgress.originalBestChromosome} config={config} />
             </div>
          </div>

          <div className="mt-auto">
            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 text-center">
              <div className="text-xs text-slate-400 uppercase mb-1">Baseline Fitness</div>
              <div className="text-3xl font-mono text-white">
                {gaProgress.originalBestFitness !== -Infinity ? gaProgress.originalBestFitness : '-'}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Dramatic Improvement Display Container */}
      <div className="bg-slate-800 border border-slate-700 p-8 rounded-xl shadow-[0_0_20px_rgba(45,212,191,0.05)] mt-4 flex flex-col items-center justify-center text-center">
        <div className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
          <Activity size={20} className="text-teal-400" />
          Mod Improvement vs Original Baseline
        </div>
        <div className={`text-6xl md:text-8xl font-black tracking-tight drop-shadow-2xl ${comparisonDiff > 0 ? 'text-green-400' : comparisonDiff < 0 ? 'text-red-400' : 'text-slate-400'}`}>
          {gaProgress.generation > 0 ? `${comparisonDiff}%` : '-'}
        </div>
      </div>

    </div>
  );
};

export default SimulationPage;
