import React from 'react';

const GridVisualizer = ({ grid, chromosome, config }) => {
  const size = grid.length;
  // Fallback for empty grid
  if (size === 0) {
    return (
      <div className="w-full aspect-square border-2 border-slate-700 border-dashed rounded-lg flex items-center justify-center text-slate-500">
        <p>No grid generated yet.</p>
      </div>
    );
  }

  // Quick lookup for chromosome positions
  const treeSet = new Set(chromosome ? chromosome.map(t => `${t.r},${t.c}`) : []);

  return (
    <div 
      className="grid gap-[1px] bg-slate-700/50 p-1 rounded border border-slate-600 shadow-md"
      style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
    >
      {grid.map((rowArr, r) => (
        rowArr.map((val, c) => {
          const isTree = treeSet.has(`${r},${c}`);
          let bgColor = 'bg-slate-800'; // default empty
          if (val === 1) bgColor = 'bg-green-900/40'; // Target / Alive Tree area
          if (val === -1) bgColor = 'bg-red-900/30'; // Obstacle / Dead / Road
          
          return (
            <div 
              key={`${r}-${c}`} 
              className={`aspect-square relative group transition-colors duration-300 ${bgColor}`}
            >
              {/* Tooltip */}
              <div className="absolute inset-0 hidden group-hover:block bg-black/80 text-[10px] text-white p-1 z-10 whitespace-nowrap -mt-6 rounded pointer-events-none">
                ({r},{c}) | Val: {val}
              </div>
              
              {/* Render Tree */}
              {isTree && (
                <div className="absolute inset-0 m-auto w-3/4 h-3/4 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.6)] animate-pulse" />
              )}
            </div>
          );
        })
      ))}
    </div>
  );
};

export default GridVisualizer;
