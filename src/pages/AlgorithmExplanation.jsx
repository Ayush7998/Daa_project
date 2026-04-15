import React from 'react';
import { GitMerge, Repeat, Zap, Layers } from 'lucide-react';

const AlgorithmExplanation = () => {
  return (
    <div className="flex-1 overflow-y-auto p-12 bg-slate-900">
      <div className="max-w-4xl mx-auto space-y-12">
        
        <header>
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-teal-400 to-green-500 bg-clip-text text-transparent">How It Works</h2>
          <p className="text-lg text-slate-400 mt-3 leading-relaxed">
            A deeper dive into the Genetic Algorithm mechanics running beneath the hood to systematically optimize tree placement.
          </p>
        </header>

        <section className="space-y-6">
          <h3 className="text-2xl font-bold flex items-center gap-3"><Layers className="text-teal-400" /> Chromosome Encoding</h3>
          <p className="text-slate-300">
            In our algorithm, a <strong>Chromosome</strong> represents one potential solution format. Because our problem consists of placing `N` trees on an `r × c` grid, we define a chromosome as an array of `N` coordinate pairs, `{"[{r: 1, c: 2}, {r: 3, c: 4}, ...]"}`.
          </p>
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 font-mono text-sm overflow-x-auto text-teal-300 shadow-inner">
            <span className="text-teal-500">// Example: Placing 3 Trees</span><br/>
            [<br/>
            &nbsp;&nbsp;&#123; <span className="text-slate-400">r</span>: 5, <span className="text-slate-400">c</span>: 10 &#125;,<br/>
            &nbsp;&nbsp;&#123; <span className="text-slate-400">r</span>: 2, <span className="text-slate-400">c</span>: 8 &#125;,<br/>
            &nbsp;&nbsp;&#123; <span className="text-slate-400">r</span>: 7, <span className="text-slate-400">c</span>: 14 &#125;<br/>
            ]
          </div>
        </section>

        <section className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-800/80 p-6 rounded-xl border border-slate-700 shadow-lg relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                <Repeat size={100} />
              </div>
              <h4 className="text-lg font-bold text-green-400 mb-2 flex items-center gap-2"><Repeat size={20}/> Fitness Function</h4>
              <p className="text-slate-300 text-sm">
                Each chromosome is evaluated using a rigorous formula to derive a <strong>Fitness Score</strong>.<br/><br/>
                <span className="text-green-300 font-bold">Shade Score:</span> +1 for every unique target cell within radius.<br/>
                <span className="text-orange-300 font-bold">Overlap Penalty:</span> -10 if placed trees are adjacent.<br/>
                <span className="text-red-400 font-bold">Invalid Penalty:</span> -100 if placed on a road or obstacle.<br/>
                <span className="text-blue-300 font-bold">Roadside Bonus:</span> +5 if cleanly adjacent to a road.
              </p>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-xl border border-slate-700 shadow-lg relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                <GitMerge size={100} />
              </div>
              <h4 className="text-lg font-bold text-teal-400 mb-2 flex items-center gap-2"><GitMerge size={20}/> Crossover</h4>
              <p className="text-slate-300 text-sm">
                We sort all chromosomes by Fitness Score. The best performers (Elitism principle) are directly passed down to the next generation and also act as <strong>Parents</strong>.<br/><br/>
                A <em>Single-Point Crossover</em> is executed between parents to yield children, mixing the coordinate pairs to explore new combinations mathematically.
              </p>
            </div>
            
            <div className="bg-slate-800/80 p-6 rounded-xl border border-slate-700 shadow-lg relative overflow-hidden group md:col-span-2">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                <Zap size={100} />
              </div>
              <h4 className="text-lg font-bold text-yellow-400 mb-2 flex items-center gap-2"><Zap size={20}/> Original vs Modified Approach (Mutation)</h4>
              <p className="text-slate-300 text-sm mb-4">
                To comply with the assignment guidelines, this dashboard compares two Genetic Algorithm approaches to prevent premature local maximum convergence:
                <br/><br/>
                <strong className="text-teal-300 font-bold">Original GA:</strong> Uses a static, fixed <strong>Mutation Rate</strong> across all generations.<br/>
                <strong className="text-green-300 font-bold">Modified GA (Simulated Annealing):</strong> Uses a dynamic mutation rate that decays linearly as generations progress. This allows broad exploration early on, and highly localized refinement toward the final generations.
              </p>
              <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden flex">
                <div className="bg-yellow-400 h-full w-full" style={{ background: 'linear-gradient(90deg, #facc15 0%, #1e293b 100%)'}}></div>
              </div>
              <div className="flex justify-between text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">
                <span>High Mutation (Gen 1)</span>
                <span>Low Mutation (Gen N)</span>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default AlgorithmExplanation;
