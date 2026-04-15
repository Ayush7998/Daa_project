import React, { useContext, useMemo } from 'react';
import { SimulationContext } from '../context/SimulationContext';
import { calculateFitness } from '../utils/Algorithms';
import GridVisualizer from '../components/GridVisualizer';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Download, Award, TrendingUp, AlertTriangle } from 'lucide-react';

const ResultsPage = () => {
  const { grid, config, gaProgress, bfProgress } = useContext(SimulationContext);

  const { detailedFitness, isComplete } = useMemo(() => {
    if (gaProgress.generation === 0 || !gaProgress.bestChromosome?.length) return { isComplete: false };
    
    return {
      isComplete: true, // we can show partial
      detailedFitness: calculateFitness(gaProgress.bestChromosome, grid, config, true)
    };
  }, [gaProgress.bestChromosome, grid, config]);

  if (!isComplete) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-10">
        <h2 className="text-2xl font-bold text-slate-400 mb-2">No Results Yet</h2>
        <p className="text-slate-500 max-w-md text-center">Run the Genetic Algorithm in the Simulation tab to see results.</p>
      </div>
    );
  }

  const { shadeScore, overlapPenalty, invalidPenalty, roadsideBonus } = detailedFitness.breakdown;
  const totalFitness = detailedFitness.fitness;

  const pieData = [
    { name: 'Shade Target', value: shadeScore > 0 ? shadeScore : 0, color: '#10b981' },
    { name: 'Roadside Bonus', value: roadsideBonus > 0 ? roadsideBonus * 5 : 0, color: '#3b82f6' },
    { name: 'Overlap Penalty', value: overlapPenalty > 0 ? overlapPenalty * 10 : 0, color: '#f59e0b' },
    { name: 'Invalid Penalty', value: invalidPenalty > 0 ? invalidPenalty * 100 : 0, color: '#ef4444' }
  ].filter(d => d.value > 0);

  const barData = [
    { name: 'Genetic Alg', fitness: totalFitness },
    { name: 'Brute Force', fitness: bfProgress.done ? bfProgress.bestFitness : 0 }
  ];

  const accuracy = bfProgress.done && bfProgress.bestFitness > 0 
    ? Math.min(100, Math.max(0, (totalFitness / bfProgress.bestFitness) * 100)).toFixed(1)
    : 'N/A';

  return (
    <div className="flex-1 overflow-y-auto p-8 lg:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <header className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-green-500 bg-clip-text text-transparent">Simulation Results</h2>
            <p className="text-slate-400 mt-2">Comprehensive breakdown of the algorithm's final state.</p>
          </div>
          <button className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-lg transition-colors">
            <Download size={18} /> Export PDF
          </button>
        </header>

        {/* Summary Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl flex flex-col gap-2 shadow-lg">
            <div className="text-slate-400 flex items-center gap-2 text-sm uppercase tracking-wide"><Award size={16} className="text-teal-400"/> GA Fitness</div>
            <div className="text-4xl font-bold text-white">{totalFitness}</div>
          </div>
          <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl flex flex-col gap-2 shadow-lg">
            <div className="text-slate-400 flex items-center gap-2 text-sm uppercase tracking-wide"><Award size={16} className="text-orange-400"/> BF Optimal</div>
            <div className="text-4xl font-bold text-white">{bfProgress.done ? bfProgress.bestFitness : '-'}</div>
          </div>
          <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl flex flex-col gap-2 shadow-lg">
            <div className="text-slate-400 flex items-center gap-2 text-sm uppercase tracking-wide"><TrendingUp size={16} className="text-green-400"/> Accuracy</div>
            <div className="text-4xl font-bold text-white">{accuracy}%</div>
          </div>
          <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl flex flex-col gap-2 shadow-lg">
            <div className="text-slate-400 flex items-center gap-2 text-sm uppercase tracking-wide"><AlertTriangle size={16} className="text-yellow-400"/> Generations</div>
            <div className="text-4xl font-bold text-white">{gaProgress.generation}</div>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-lg flex flex-col">
            <h3 className="text-xl font-bold mb-4 border-b border-slate-700 pb-2">Final Grid Placement</h3>
            <div className="flex-1 flex items-center justify-center bg-slate-900/50 rounded-lg p-4">
               <div className="w-full max-w-[250px]">
                 <GridVisualizer grid={grid} chromosome={gaProgress.bestChromosome} config={config} />
               </div>
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-lg flex flex-col">
            <h3 className="text-xl font-bold mb-4 border-b border-slate-700 pb-2">Fitness Breakdown</h3>
            {pieData.length > 0 ? (
              <div className="flex-1 min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.5rem', color: '#f8fafc' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : <p className="text-slate-500 m-auto">Scores are zero.</p>}
          </div>

          <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-lg flex flex-col">
            <h3 className="text-xl font-bold mb-4 border-b border-slate-700 pb-2">Comparison</h3>
            <div className="flex-1 min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <RechartsTooltip 
                    cursor={{fill: '#334155', opacity: 0.4}}
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.5rem', color: '#f8fafc' }}
                  />
                  <Bar dataKey="fitness" radius={[4, 4, 0, 0]}>
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#2dd4bf' : '#f97316'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            {!bfProgress.done && <p className="text-xs text-orange-400 text-center mt-2">Brute Force baseline not calculated yet.</p>}
          </div>

        </div>

      </div>
    </div>
  );
};

export default ResultsPage;
