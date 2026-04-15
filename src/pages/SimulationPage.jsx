import React, { useContext } from 'react';
import { SimulationContext } from '../context/SimulationContext';
import GridVisualizer from '../components/GridVisualizer';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Play, Square, FastForward, Calculator, Activity } from 'lucide-react';

const SimulationPage = () => {
  const { grid, config, gaProgress, bfProgress, toggleGaSimulation, runBruteForce, changeSpeed } = useContext(SimulationContext);

  if (grid.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
        <Activity size={48} className="text-slate-600 mb-4" />
        <h2 className="text-2xl font-bold text-slate-400 mb-2">No Grid Data</h2>
        <p className="text-slate-500 max-w-md">Please navigate to the Dataset tab and generate a grid before running simulations.</p>
      </div>
    );
  }

  // Combine GA history and Brute Force target line for Recharts
  const chartData = gaProgress.history.map(point => ({
    ...point,
    bfFitness: bfProgress.done ? bfProgress.bestFitness : null
  }));

  const accuracy = bfProgress.done && bfProgress.bestFitness > 0 
    ? Math.min(100, Math.max(0, (gaProgress.bestFitness / bfProgress.bestFitness) * 100)).toFixed(2)
    : 0;

  return (
    <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-green-500 bg-clip-text text-transparent">Simulation Dashboard</h2>
          <p className="text-slate-400 mt-1">Live GA generation evolution vs Brute Force baseline.</p>
        </div>
        
        {/* Global Controls */}
        <div className="flex gap-4">
           {/* BF Control */}
           <button 
            onClick={runBruteForce}
            disabled={bfProgress.isCalculating || bfProgress.done}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold shadow-lg transition-all ${
              bfProgress.isCalculating ? 'bg-orange-600/50 cursor-not-allowed' : bfProgress.done ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-500 text-white'
            }`}
          >
            <Calculator size={18} />
            {bfProgress.isCalculating ? 'Calculating...' : bfProgress.done ? 'BF Complete' : 'Run Brute Force'}
          </button>

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
          
          <div className="w-full flex items-center justify-center p-2 bg-slate-900/50 rounded-lg mb-4">
             <div className="w-full max-w-sm">
                <GridVisualizer grid={grid} chromosome={gaProgress.bestChromosome} config={config} />
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-auto">
            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
              <div className="text-xs text-slate-400 uppercase">Best Fitness</div>
              <div className="text-2xl font-mono text-white">
                {gaProgress.bestFitness !== -Infinity ? gaProgress.bestFitness : '-'}
              </div>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
              <div className="text-xs text-slate-400 uppercase">Mutation Rate</div>
              <div className="text-2xl font-mono text-white">
                {gaProgress.currentMutationRate !== undefined ? (gaProgress.currentMutationRate * 100).toFixed(1) + '%' : '-'}
              </div>
            </div>
          </div>
        </div>

        {/* Brute Force UI */}
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-lg flex flex-col h-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2 text-orange-400">
              Brute Force Baseline
              {bfProgress.isCalculating && <span className="flex h-3 w-3 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span></span>}
            </h3>
          </div>
          
          <div className="w-full flex items-center justify-center p-2 bg-slate-900/50 rounded-lg mb-4">
             <div className="w-full max-w-sm">
                <GridVisualizer grid={grid} chromosome={bfProgress.bestChromosome} config={config} />
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-auto">
            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
              <div className="text-xs text-slate-400 uppercase">Optimal Fitness</div>
              <div className="text-2xl font-mono text-white">
                {bfProgress.done ? bfProgress.bestFitness : (bfProgress.isCalculating ? '...' : '-')}
              </div>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
              <div className="text-xs text-slate-400 uppercase">GA Accuracy</div>
              <div className={`text-2xl font-mono ${accuracy >= 90 ? 'text-green-400' : accuracy > 70 ? 'text-yellow-400' : 'text-red-400'}`}>
                {bfProgress.done && gaProgress.generation > 0 ? `${accuracy}%` : '-'}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Chart */}
      <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-lg h-80 mt-2">
        <h3 className="text-lg font-bold mb-4">Fitness Progress</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="generation" stroke="#94a3b8" fontSize={12} />
            <YAxis stroke="#94a3b8" fontSize={12} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.5rem', color: '#f8fafc' }}
              itemStyle={{ color: '#2dd4bf' }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="fitness" 
              name="GA Best Fitness"
              stroke="#2dd4bf" 
              strokeWidth={3}
              activeDot={{ r: 8 }} 
              isAnimationActive={false}
            />
            {bfProgress.done && (
              <ReferenceLine y={bfProgress.bestFitness} label={{ position: 'top', value: 'BF Optimal', fill: '#f97316', fontSize: 12 }} stroke="#f97316" strokeDasharray="3 3" />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

export default SimulationPage;
