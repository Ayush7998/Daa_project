import React, { createContext, useState, useCallback, useRef } from 'react';
import Papa from 'papaparse';
import defaultDataset from '../data/nyc_sample.json';
import { runGeneticAlgorithmStep, generateInitialPopulation, generateCombinations, calculateFitness } from '../utils/Algorithms';

export const SimulationContext = createContext(null);

export const SimulationProvider = ({ children }) => {
  const [dataset, setDataset] = useState(defaultDataset);
  
  const [config, setConfig] = useState({
    gridSize: 10,
    numTrees: 3,
    populationSize: 10,
    generations: 50,
    initialMutationRate: 0.2,
    coverageRadius: 2,
    dynamicMutation: true,
  });

  const [grid, setGrid] = useState([]); // 2D array: 1 = target, -1 = obstacle, 0 = empty
  
  // Simulation State
  const [gaProgress, setGaProgress] = useState({
    generation: 0,
    bestFitness: -Infinity,
    bestChromosome: [],
    history: [], // For charts: {generation, fitness}
    isRunning: false,
    speed: 500, // ms per generation
  });

  const [bfProgress, setBfProgress] = useState({
    bestFitness: -Infinity,
    bestChromosome: [],
    isCalculating: false,
    done: false,
  });

  // Ref to hold simulation loops
  const simulationRef = useRef(null);

  const updateConfig = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleFileUpload = (file) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        setDataset(results.data.filter(d => d.latitude && d.longitude && d.status));
      }
    });
  };

  const generateGrid = useCallback(() => {
    const size = config.gridSize;
    // Initialize empty grid (0)
    let newGrid = Array(size).fill().map(() => Array(size).fill(0));
    
    if (dataset.length === 0) {
      setGrid(newGrid);
      return;
    }

    // Find bounding box
    let minLat = Infinity, maxLat = -Infinity;
    let minLon = Infinity, maxLon = -Infinity;
    
    dataset.forEach(d => {
      if (d.latitude < minLat) minLat = d.latitude;
      if (d.latitude > maxLat) maxLat = d.latitude;
      if (d.longitude < minLon) minLon = d.longitude;
      if (d.longitude > maxLon) maxLon = d.longitude;
    });

    const latRange = maxLat - minLat || 1;
    const lonRange = maxLon - minLon || 1;

    dataset.forEach(d => {
      // Map to grid coords [0, size-1]
      // Using Math.min to handle the exact max edge case easily
      const r = Math.min(size - 1, Math.floor(((d.latitude - minLat) / latRange) * size));
      const c = Math.min(size - 1, Math.floor(((d.longitude - minLon) / lonRange) * size));
      
      const st = (d.status || '').toLowerCase();
      // 'alive' = shade target (1), 'stump'/'dead' = obstacle (-1)
      if (st.includes('alive') || st === '1') {
        newGrid[r][c] = 1;
      } else if (st.includes('dead') || st.includes('stump') || st === '-1') {
        newGrid[r][c] = -1;
      }
    });
    
    setGrid(newGrid);
    
    // Reset simulation states when grid changes
    setGaProgress(prev => ({ ...prev, generation: 0, bestFitness: -Infinity, history: [], isRunning: false }));
    setBfProgress(prev => ({ ...prev, bestFitness: -Infinity, done: false }));
  }, [config.gridSize, dataset]);


  // Brute Force processing (async unblocking via chunks)
  const runBruteForce = async () => {
    setBfProgress(prev => ({ ...prev, isCalculating: true, done: false, bestFitness: -Infinity, bestChromosome: [] }));
    
    // find open cells
    const openCells = [];
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[r].length; c++) {
        if (grid[r][c] !== -1) openCells.push({r, c});
      }
    }

    if (openCells.length < config.numTrees) {
      setBfProgress(prev => ({ ...prev, isCalculating: false, done: true }));
      return;
    }

    let maxFitness = -Infinity;
    let bestComb = [];
    
    const generator = generateCombinations(openCells, config.numTrees);
    
    // Process in chunks to unblock UI
    const processChunk = () => {
      return new Promise((resolve) => {
        let i = 0;
        let iter = generator.next();
        
        while (!iter.done && i < 1000) {
          const fitness = calculateFitness(iter.value, grid, config);
          if (fitness > maxFitness) {
            maxFitness = fitness;
            bestComb = iter.value;
          }
          i++;
          iter = generator.next();
        }
        
        if (iter.done) {
          resolve({ done: true, maxFitness, bestComb });
        } else {
          // Yield to main thread
          setTimeout(() => {
            processChunk().then(resolve);
          }, 0);
        }
      });
    };

    const res = await processChunk();
    setBfProgress(prev => ({
      ...prev,
      bestFitness: res.maxFitness,
      bestChromosome: res.bestComb,
      isCalculating: false,
      done: true
    }));
  };

  // GA Execution
  const toggleGaSimulation = () => {
    if (gaProgress.isRunning) {
      clearInterval(simulationRef.current);
      setGaProgress(prev => ({ ...prev, isRunning: false }));
    } else {
      if (gaProgress.generation === 0) {
        // Start fresh
        let currentPop = generateInitialPopulation(config.gridSize, config);
        let gen = 0;
        let history = [];
        
        setGaProgress(prev => ({ ...prev, isRunning: true, history: [] }));
        
        simulationRef.current = setInterval(() => {
          if (gen >= config.generations) {
            clearInterval(simulationRef.current);
            setGaProgress(prev => ({ ...prev, isRunning: false }));
            return;
          }
          
          let mutationRate = config.initialMutationRate;
          if (config.dynamicMutation) {
            // Drop mutation rate linearly over time
            mutationRate = config.initialMutationRate * (1 - gen / config.generations);
          }

          const res = runGeneticAlgorithmStep(currentPop, grid, config, mutationRate);
          currentPop = res.newPopulation;
          gen++;
          history.push({ generation: gen, fitness: res.bestFitness, bf: null }); // bf updated later in charts component
          
          setGaProgress(prev => ({
            ...prev,
            generation: gen,
            bestFitness: res.bestFitness,
            bestChromosome: res.bestChromosome,
            history: [...history],
            currentMutationRate: mutationRate
          }));
          
        }, gaProgress.speed);
      } else {
        // Resume not implemented deeply yet, but basically reuse pop
        // keeping it simple for now, resetting if started again.
      }
    }
  };

  const changeSpeed = (ms) => {
    setGaProgress(prev => ({ ...prev, speed: ms }));
    // If running, restart interval
    if (gaProgress.isRunning) {
      clearInterval(simulationRef.current);
      // toggleGaSimulation checks if generating is fresh, we need a better pause/resume or just let toggle handle it.
      // For simplicity, speed changes take effect on next toggle.
    }
  };

  return (
    <SimulationContext.Provider value={{
      dataset, config, grid, updateConfig, handleFileUpload, generateGrid,
      gaProgress, bfProgress, runBruteForce, toggleGaSimulation, changeSpeed
    }}>
      {children}
    </SimulationContext.Provider>
  );
};
