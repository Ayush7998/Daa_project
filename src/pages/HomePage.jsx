import React from 'react';
import { Link } from 'react-router-dom';
import { TreePine, ArrowRight, Activity, Calculator } from 'lucide-react';

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
        
        <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6">
          <span className="bg-gradient-to-r from-teal-400 to-green-500 bg-clip-text text-transparent">Urban Tree Optimization</span>
        </h1>
        
        <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
          A Data Structures & Algorithms project demonstrating the power of <strong className="text-slate-100">Original GA</strong> versus <strong className="text-slate-100">Modified GA</strong>. 
          Upload city tree data, generate a grid, and watch evolutionary algorithms compete live.
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
          <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl backdrop-blur-sm shadow-md transition-colors hover:border-slate-500">
            <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center mb-4"><Calculator className="text-slate-400"/></div>
            <h3 className="text-lg font-bold text-slate-200">Original GA</h3>
            <p className="text-slate-400 text-sm mt-2">
              A baseline evolutionary approach featuring a static mutation rate across all generations.
            </p>
          </div>
          
          <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl hover:border-teal-500 transition-colors shadow-lg cursor-default">
            <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center mb-4"><Activity className="text-teal-400"/></div>
            <h3 className="text-lg font-bold text-teal-300">Modified GA</h3>
            <p className="text-sm text-slate-400 mt-2">
              Enhanced algorithm utilizing Simulated Annealing (dynamic mutation rate) to balance thorough exploration with focused local accuracy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
