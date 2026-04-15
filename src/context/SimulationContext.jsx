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
    originalBestFitness: -Infinity,
    originalBestChromosome: [],
    modifiedBestFitness: -Infinity,
    modifiedBestChromosome: [],
    history: [], // For charts: {generation, originalFitness, modifiedFitness}
    isRunning: false,
    speed: 500, // ms per generation
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
    setGaProgress(prev => ({ 
      ...prev, generation: 0, 
      originalBestFitness: -Infinity, originalBestChromosome: [], 
      modifiedBestFitness: -Infinity, modifiedBestChromosome: [], 
      history: [], isRunning: false 
    }));
  }, [config.gridSize, dataset]);


  // GA Execution
  const toggleGaSimulation = () => {
    if (gaProgress.isRunning) {
      clearInterval(simulationRef.current);
      setGaProgress(prev => ({ ...prev, isRunning: false }));
    } else {
      if (gaProgress.generation === 0) {
        // Start fresh: clone initial pop so both start exactly identically
        let initialPop = generateInitialPopulation(config.gridSize, config);
        let originalPop = JSON.parse(JSON.stringify(initialPop));
        let modifiedPop = JSON.parse(JSON.stringify(initialPop));
        
        let gen = 0;
        let history = [];
        
        setGaProgress(prev => ({ ...prev, isRunning: true, history: [] }));
        
        simulationRef.current = setInterval(() => {
          if (gen >= config.generations) {
            clearInterval(simulationRef.current);
            setGaProgress(prev => ({ ...prev, isRunning: false }));
            return;
          }
          
          let modifiedMutationRate = config.initialMutationRate;
          let originalMutationRate = config.initialMutationRate; // Original GA is fixed config

          if (config.dynamicMutation) {
            // Drop mutation rate linearly over time for modified GA ONLY
            modifiedMutationRate = config.initialMutationRate * (1 - gen / config.generations);
          }

          const resOriginal = runGeneticAlgorithmStep(originalPop, grid, config, originalMutationRate);
          originalPop = resOriginal.newPopulation;

          const resModified = runGeneticAlgorithmStep(modifiedPop, grid, config, modifiedMutationRate);
          modifiedPop = resModified.newPopulation;
          
          gen++;
          history.push({ 
            generation: gen, 
            originalFitness: resOriginal.bestFitness, 
            modifiedFitness: resModified.bestFitness,
            bf: null 
          });
          
          setGaProgress(prev => ({
            ...prev,
            generation: gen,
            originalBestFitness: resOriginal.bestFitness,
            originalBestChromosome: resOriginal.bestChromosome,
            originalCurrentMutationRate: originalMutationRate,
            modifiedBestFitness: resModified.bestFitness,
            modifiedBestChromosome: resModified.bestChromosome,
            modifiedCurrentMutationRate: modifiedMutationRate,
            history: [...history]
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
      gaProgress, toggleGaSimulation, changeSpeed
    }}>
      {children}
    </SimulationContext.Provider>
  );
};
