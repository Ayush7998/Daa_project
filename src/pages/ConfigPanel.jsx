import React, { useContext } from 'react';
import { SimulationContext } from '../context/SimulationContext';
import { Sliders, Settings } from 'lucide-react';

const ConfigPanel = () => {
  const { config, updateConfig } = useContext(SimulationContext);

  const ranges = {
    gridSize: { min: 5, max: 20, step: 1, label: 'Grid Size (NxN)' },
    numTrees: { min: 2, max: 6, step: 1, label: 'Number of Trees' },
    populationSize: { min: 4, max: 30, step: 2, label: 'Population Size' },
    generations: { min: 10, max: 200, step: 10, label: 'Max Generations' },
    initialMutationRate: { min: 0.1, max: 0.8, step: 0.1, label: 'Initial Mutation Rate' },
    coverageRadius: { min: 1, max: 5, step: 1, label: 'Coverage Radius (Manhattan)' },
  };

  return (
    <div className="flex-1 overflow-y-auto p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <header>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-green-500 bg-clip-text text-transparent flex items-center gap-3">
            <Sliders size={32} /> Algorithm Configuration
          </h2>
          <p className="text-slate-400 mt-2">Adjust parameters to see how Genetic Algorithm performance is affected compared to Brute Force.</p>
        </header>

        <div className="bg-slate-800 border border-slate-700 p-8 rounded-xl shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            
            {Object.entries(ranges).map(([key, bounds]) => (
              <div key={key} className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-slate-300">{bounds.label}</label>
                  <span className="font-mono text-teal-400 bg-slate-900 px-2 py-0.5 rounded text-sm border border-slate-700">
                    {config[key]}
                  </span>
                </div>
                <input 
                  type="range" 
                  min={bounds.min} 
                  max={bounds.max} 
                  step={bounds.step}
                  value={config[key]}
                  onChange={(e) => updateConfig(key, parseFloat(e.target.value))}
                  className="w-full accent-teal-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>{bounds.min}</span>
                  <span>{bounds.max}</span>
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between bg-slate-700/30 p-4 rounded-lg border border-slate-600 mt-4 md:col-span-2">
              <div>
                <h4 className="text-sm font-medium text-slate-200">Dynamic Mutation Rate</h4>
                <p className="text-xs text-slate-400 mt-1">Linearly decay mutation rate from initial to 0 as generations progress (simulated annealing approach).</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={config.dynamicMutation}
                  onChange={(e) => updateConfig('dynamicMutation', e.target.checked)}
                />
                <div className="w-11 h-6 bg-slate-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
              </label>
            </div>

          </div>
        </div>

        <div className="bg-green-900/20 border border-green-800/50 p-4 rounded-lg flex items-start gap-4">
          <Settings className="text-green-500 shrink-0 mt-1" size={24} />
          <div>
            <h4 className="text-sm font-bold text-green-400">Note on Grid Size</h4>
            <p className="text-xs text-slate-300 mt-1">
              Changing Grid Size requires re-generating the grid map in the Dataset panel for new placements to map correctly. 
              Higher Grid Size increases the state space exponentially (combinations = `nCr(gridSize*gridSize - obstacles, numTrees)`).
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ConfigPanel;
