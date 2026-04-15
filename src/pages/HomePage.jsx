import React from 'react';
import { Link } from 'react-router-dom';
import { TreePine, ArrowRight, GitBranch, Crosshair } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="flex-1 overflow-y-auto p-12 flex flex-col items-center justify-center text-center relative">
      {/* Background Decorative Blobs */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-green-900/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-teal-900/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="z-10 max-w-3xl">
        <div className="inline-flex items-center justify-center p-3 bg-slate-800 rounded-2xl mb-6 shadow-lg border border-slate-700">
          <TreePine size={48} className="text-teal-400" />
        </div>
        
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-teal-400 to-green-500 bg-clip-text text-transparent">
          Urban Tree Placement<br />Optimization
        </h1>
        
        <p className="text-xl text-slate-300 mb-10 leading-relaxed">
          A Data Structures & Algorithms project demonstrating the power of <strong className="text-slate-100">Genetic Algorithms</strong> versus <strong className="text-slate-100">Brute Force</strong>. 
          Maximize shade, minimize overlap, and optimize urban greenspace automatically based on the NYC Tree Census format!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/dataset" 
            className="flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-400 text-slate-900 font-semibold py-3 px-8 rounded-full transition-all shadow-[0_0_20px_rgba(45,212,191,0.3)] hover:shadow-[0_0_30px_rgba(45,212,191,0.5)] transform hover:-translate-y-1"
          >
            Get Started <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-20 text-left">
          <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3">
              <GitBranch className="text-green-400" />
              <h3 className="text-lg font-bold">Genetic Algorithm</h3>
            </div>
            <p className="text-slate-400 text-sm">
              Simulates evolution using selection, crossover, and mutation to find near-optimal tree placements rapidly across massive state spaces.
            </p>
          </div>
          
          <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3">
              <Crosshair className="text-orange-400" />
              <h3 className="text-lg font-bold">Brute Force Search</h3>
            </div>
            <p className="text-slate-400 text-sm">
              Calculates absolutely every combination to find the mathematical global optimum, providing a baseline for GA accuracy—but scales poorly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
