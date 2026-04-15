import React, { useContext, useMemo } from 'react';
import { SimulationContext } from '../context/SimulationContext';
import { calculateFitness } from '../utils/Algorithms';
import GridVisualizer from '../components/GridVisualizer';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { Download, Award, TrendingUp, AlertTriangle } from 'lucide-react';

const ResultsPage = () => {
  const { grid, config, gaProgress } = useContext(SimulationContext);

  const { detailedFitness, isComplete } = useMemo(() => {
    if (gaProgress.generation === 0 || !gaProgress.modifiedBestChromosome?.length) return { isComplete: false };
    
    return {
      isComplete: true, // we can show partial
      detailedFitness: calculateFitness(gaProgress.modifiedBestChromosome, grid, config, true)
    };
  }, [gaProgress.modifiedBestChromosome, grid, config]);

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
    { name: 'Original GA', fitness: gaProgress.originalBestFitness !== -Infinity ? gaProgress.originalBestFitness : 0 },
    { name: 'Modified GA', fitness: totalFitness }
  ];

  const improvement = gaProgress.originalBestFitness > 0 
    ? (((totalFitness - gaProgress.originalBestFitness) / gaProgress.originalBestFitness) * 100).toFixed(1)
    : 'N/A';

  const firstGenFitness = gaProgress.history.length > 0 ? gaProgress.history[0].modifiedFitness : 0;
  const gaAccuracy = totalFitness !== 0
    ? ((firstGenFitness / totalFitness) * 100).toFixed(1)
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

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl flex flex-col gap-2 shadow-lg">
            <div className="text-slate-400 flex items-center gap-2 text-sm uppercase tracking-wide"><Award size={16} className="text-teal-400"/> Modified GA Fitness</div>
            <div className="text-4xl font-bold text-white">{totalFitness}</div>
          </div>
          <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl flex flex-col gap-2 shadow-lg">
            <div className="text-slate-400 flex items-center gap-2 text-sm uppercase tracking-wide"><Award size={16} className="text-slate-400"/> Original Base</div>
            <div className="text-4xl font-bold text-white">{gaProgress.originalBestFitness !== -Infinity ? gaProgress.originalBestFitness : '-'}</div>
          </div>
          <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl flex flex-col gap-2 shadow-lg">
            <div className="text-slate-400 flex items-center gap-2 text-sm uppercase tracking-wide"><TrendingUp size={16} className="text-green-400"/> Improvement</div>
            <div className={`text-4xl font-bold ${improvement > 0 ? 'text-green-400' : 'text-slate-300'}`}>{improvement !== 'N/A' ? `${improvement}%` : '-'}</div>
          </div>
          <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl flex flex-col gap-2 shadow-lg">
            <div className="text-slate-400 flex items-center gap-2 text-sm uppercase tracking-wide"><TrendingUp size={16} className="text-teal-300"/> Accuracy</div>
            <div className="text-4xl font-bold text-white">{gaAccuracy !== 'N/A' ? `${gaAccuracy}%` : '-'}</div>
          </div>
          <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl flex flex-col gap-2 shadow-lg">
            <div className="text-slate-400 flex items-center gap-2 text-sm uppercase tracking-wide"><AlertTriangle size={16} className="text-yellow-400"/> Generations</div>
            <div className="text-4xl font-bold text-white">{gaProgress.generation}</div>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-lg flex flex-col">
            <h3 className="text-xl font-bold mb-4 border-b border-slate-700 pb-2">Final Grid Placement (Mod GA)</h3>
            <div className="flex-1 flex items-center justify-center bg-slate-900/50 rounded-lg p-4">
               <div className="w-full max-w-[250px]">
                 <GridVisualizer grid={grid} chromosome={gaProgress.modifiedBestChromosome} config={config} />
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
                      cy="45%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.5rem', color: '#f8fafc' }}
                      formatter={(value, name, props) => [`${value} pts`, name]}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36} 
                      iconType="circle" 
                      wrapperStyle={{ fontSize: '12px', color: '#cbd5e1', paddingTop: '20px' }} 
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
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#94a3b8' : '#2dd4bf'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ResultsPage;
