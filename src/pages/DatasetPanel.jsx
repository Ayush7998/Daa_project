import React, { useContext, useRef } from 'react';
import { SimulationContext } from '../context/SimulationContext';
import GridVisualizer from '../components/GridVisualizer';
import { Upload, FileJson, Play } from 'lucide-react';

const DatasetPanel = () => {
  const { dataset, grid, handleFileUpload, generateGrid } = useContext(SimulationContext);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) handleFileUpload(file);
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 lg:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <header>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-green-500 bg-clip-text text-transparent">Dataset Management</h2>
          <p className="text-slate-400 mt-2">Load the Kaggle NYC 2015 dataset or use our integrated subset to generate the urban grid.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Controls */}
          <div className="space-y-6">
            <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><FileJson className="text-teal-400" /> Data Source</h3>
              
              <div className="space-y-4">
                <button 
                  onClick={() => window.open('https://www.kaggle.com/datasets/new-york-city/ny-2015-street-tree-census-tree-data', '_blank')}
                  className="w-full relative px-4 py-3 bg-slate-700/50 hover:bg-slate-700 text-left border border-slate-600 rounded-lg transition-colors group"
                >
                  <span className="block font-medium text-slate-200">Get Kaggle Dataset</span>
                  <span className="block text-sm text-slate-400">Downloads the 180MB file directly from Kaggle.</span>
                </button>

                <div className="relative">
                  <input 
                    type="file" 
                    accept=".csv" 
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={handleFileChange}
                  />
                  <button 
                    onClick={() => fileInputRef.current.click()}
                    className="w-full px-4 py-4 border-2 border-dashed border-slate-600 hover:border-teal-500 hover:bg-teal-900/10 rounded-lg transition-all flex flex-col items-center justify-center gap-2 group"
                  >
                    <Upload className="text-slate-400 group-hover:text-teal-400 transition-colors" />
                    <span className="text-slate-300 group-hover:text-teal-300">Upload CSV file...</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Current Data</h3>
                <span className="bg-slate-700 px-3 py-1 rounded-full text-xs text-slate-300 font-mono">
                  {dataset.length} records
                </span>
              </div>
              <div className="max-h-48 overflow-y-auto mb-4 border border-slate-700 rounded-lg">
                <table className="w-full text-sm text-left text-slate-300">
                  <thead className="text-xs text-slate-400 bg-slate-700/50 uppercase sticky top-0">
                    <tr>
                      <th className="px-4 py-2">ID</th>
                      <th className="px-4 py-2">Status</th>
                      <th className="px-4 py-2">Lat</th>
                      <th className="px-4 py-2">Lon</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataset.slice(0, 10).map((row, i) => (
                      <tr key={i} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                        <td className="px-4 py-2">{row.tree_id || i}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] ${row.status?.toLowerCase().includes('alive') ? 'bg-green-900/50 text-green-400' : 'bg-slate-600'}`}>
                            {row.status || 'N/A'}
                          </span>
                        </td>
                        <td className="px-4 py-2">{Number(row.latitude).toFixed(4)}</td>
                        <td className="px-4 py-2">{Number(row.longitude).toFixed(4)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-slate-500 mb-4">* Showing top 10 rows only.</p>
              
              <button 
                onClick={generateGrid}
                className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-colors"
                disabled={dataset.length === 0}
              >
                <Play size={18} /> Generate Grid Map
              </button>
            </div>
          </div>

          {/* Grid Preview */}
          <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-lg flex flex-col">
            <h3 className="text-xl font-bold mb-4 flex justify-between items-center">
              <span>Grid Preview</span>
              {grid.length > 0 && <span className="text-xs font-mono bg-slate-700 px-2 py-1 rounded">{grid.length}x{grid.length}</span>}
            </h3>
            
            <div className="flex-1 flex items-center justify-center rounded-lg p-2 bg-slate-900/50">
              <div className="w-full max-w-sm">
                 <GridVisualizer grid={grid} chromosome={[]} config={{}} />
              </div>
            </div>

            <div className="mt-4 flex gap-4 text-xs text-slate-400 justify-center">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-green-900/40 border border-green-700 rounded-sm"></div> Target/Alive</div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-red-900/30 border border-red-800 rounded-sm"></div> Obstacle/Dead</div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-slate-800 border border-slate-700 rounded-sm"></div> Empty</div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default DatasetPanel;
