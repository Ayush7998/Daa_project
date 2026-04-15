// Core Algorithms for Urban Tree Placement Optimization

// Helper to get Manhattan Distance
export const getManhattanDistance = (cell1, cell2) => {
  return Math.abs(cell1.r - cell2.r) + Math.abs(cell1.c - cell2.c);
};

// Evaluate fitness of a specific tree placement combination (chromosome)
// chromosome format: array of {r, c} objects
export const calculateFitness = (chromosome, grid, config, detailed = false) => {
  const { coverageRadius } = config;
  const gridSize = grid.length;
  
  let shadeScore = 0;
  let overlapPenalty = 0;
  let invalidPenalty = 0;
  let roadsideBonus = 0;
  
  // Track covered buildings/targets to count uniquely
  const coveredTargets = new Set();
  
  for (let i = 0; i < chromosome.length; i++) {
    const tree = chromosome[i];
    
    // Check if placed on invalid cell (e.g. road/obstacle, grid value -1)
    if (grid[tree.r][tree.c] === -1) {
      invalidPenalty += 1;
    }
    
    // Roadside bonus: check 4 directions
    const dirs = [[-1,0],[1,0],[0,-1],[0,1]];
    let isRoadside = false;
    for (const [dr, dc] of dirs) {
      const nr = tree.r + dr;
      const nc = tree.c + dc;
      if (nr >= 0 && nr < gridSize && nc >= 0 && nc < gridSize) {
        if (grid[nr][nc] === -1) {
          isRoadside = true;
          break;
        }
      }
    }
    if (isRoadside) roadsideBonus += 1;
    
    // Shade score (cover buildings/targets, grid value 1) within coverageRadius
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (grid[r][c] === 1) { // 1 means existing/shade target
          if (getManhattanDistance(tree, {r, c}) <= coverageRadius) {
            coveredTargets.add(`${r},${c}`);
          }
        }
      }
    }
    
    // Overlap Penalty: Compute dist to other placed trees in this chromosome
    for (let j = i + 1; j < chromosome.length; j++) {
      const otherTree = chromosome[j];
      if (getManhattanDistance(tree, otherTree) <= 1) { // Trees too close
        overlapPenalty += 1;
      }
    }
  }
  
  shadeScore = coveredTargets.size;
  
  // formula: shadeScore - 10*overlapPenalty - 100*invalidPenalty + 5*roadsideBonus
  const totalFitness = shadeScore - (10 * overlapPenalty) - (100 * invalidPenalty) + (5 * roadsideBonus);
  
  if (detailed) {
    return {
      fitness: totalFitness,
      breakdown: { shadeScore, overlapPenalty, invalidPenalty, roadsideBonus }
    };
  }
  return totalFitness;
};

// Generator for combinations setup (nCr)
export function* generateCombinations(elements, k) {
  if (k === 0) {
    yield [];
    return;
  }
  for (let i = 0; i <= elements.length - k; i++) {
    for (const c of generateCombinations(elements.slice(i + 1), k - 1)) {
      yield [elements[i], ...c];
    }
  }
}

// Generate an initial random population for GA
export const generateInitialPopulation = (gridSize, config) => {
  const { populationSize, numTrees } = config;
  const population = [];
  
  for (let i = 0; i < populationSize; i++) {
    const chromosome = [];
    for (let j = 0; j < numTrees; j++) {
      chromosome.push({
        r: Math.floor(Math.random() * gridSize),
        c: Math.floor(Math.random() * gridSize)
      });
    }
    population.push(chromosome);
  }
  return population;
};

// GA Step: Selection, Crossover, Mutation
export const runGeneticAlgorithmStep = (currentPopulation, grid, config, currentMutationRate) => {
  const { populationSize, numTrees } = config;
  const gridSize = grid.length;
  
  // 1. Evaluate Fitness & Sort (Selection)
  const evaluated = currentPopulation.map(chrom => ({
    chromosome: chrom,
    fitness: calculateFitness(chrom, grid, config)
  }));
  
  evaluated.sort((a, b) => b.fitness - a.fitness); // Descending
  
  // Top 2 become parents (Elitism / Selection)
  const parent1 = evaluated[0].chromosome;
  const parent2 = evaluated[1].chromosome;
  
  const nextGeneration = [];
  // Keep best 2 automatically (Elitism)
  nextGeneration.push([...parent1]);
  nextGeneration.push([...parent2]);
  
  // 2. Crossover & 3. Mutation
  while (nextGeneration.length < populationSize) {
    // Single point crossover
    const crossoverPoint = Math.floor(Math.random() * numTrees);
    const child = [
      ...parent1.slice(0, crossoverPoint),
      ...parent2.slice(crossoverPoint)
    ];
    
    // Mutation
    for (let i = 0; i < numTrees; i++) {
      if (Math.random() < currentMutationRate) {
        child[i] = { // Mutate one random tree position
          r: Math.floor(Math.random() * gridSize),
          c: Math.floor(Math.random() * gridSize)
        };
      }
    }
    nextGeneration.push(child);
  }
  
  return {
    newPopulation: nextGeneration,
    bestFitness: evaluated[0].fitness,
    bestChromosome: evaluated[0].chromosome
  };
};
