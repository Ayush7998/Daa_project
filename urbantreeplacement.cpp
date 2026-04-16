#include <bits/stdc++.h>
using namespace std;

/*
 Urban Tree Placement Optimization using Genetic Algorithm
 Subject: Design & Analysis of Algorithms
*/

struct Tree {
    int r, c;
};

const int ROWS = 5, COLS = 5;
const int NUM_TREES = 3;
const int POP_SIZE = 8;
const int GENERATIONS = 25;
const int RADIUS = 1;

int GRID[ROWS][COLS] = {
    {0, 0, 1, 1, -1},
    {1, 0, 0, 1, 0},
    {0, -1, 1, 0, 0},
    {0, 0, 0, 0, 0},
    {-1, 1, 0, 0, 1}
};

bool isValidCell(int r, int c) {
    return r >= 0 && r < ROWS && c >= 0 && c < COLS;
}

Tree randomTree() {
    while (true) {
        int r = rand() % ROWS;
        int c = rand() % COLS;
        if (GRID[r][c] != -1) return {r, c};
    }
}

int distance(Tree a, Tree b) {
    return abs(a.r - b.r) + abs(a.c - b.c);
}

// ===== FITNESS CALCULATOR FUNCTION =====
int fitness(vector<Tree>& chrom) {
    int overlap = 0, invalid = 0, roadsideBonus = 0;
    set<pair<int, int>> shaded;

    for (int i = 0; i < chrom.size(); i++) {
        Tree t = chrom[i];
        if (GRID[t.r][t.c] == -1) invalid++;

        // Shade nearby buildings
        for (int dr = -RADIUS; dr <= RADIUS; dr++) {
            for (int dc = -RADIUS; dc <= RADIUS; dc++) {
                int nr = t.r + dr, nc = t.c + dc;
                if (isValidCell(nr, nc) && distance(t, {nr, nc}) <= RADIUS) {
                    if (GRID[nr][nc] == 1)
                        shaded.insert({nr, nc});
                }
            }
        }

        // Check Trees are not planted side by side
        for (int j = i + 1; j < chrom.size(); j++) {
            if (distance(chrom[i], chrom[j]) <= 1)
                overlap++;
        }

        // Roadside trees extra bonus
        for (int dr = -1; dr <= 1; dr++) {
            for (int dc = -1; dc <= 1; dc++) {
                if (abs(dr) + abs(dc) == 1) {
                    int nr = t.r + dr, nc = t.c + dc;
                    if (isValidCell(nr, nc) && GRID[nr][nc] == -1)
                        roadsideBonus++;
                }
            }
        }
    }

    int shadeScore = shaded.size();
    return shadeScore - 10 * overlap - 100 * invalid + 5 * roadsideBonus;
}

// ===== SELECTION OF PARENT(on the basis of fitness score)=====
pair<vector<Tree>, vector<Tree>> selection(vector<pair<vector<Tree>, int>>& scored) {
    sort(scored.begin(), scored.end(),
         [](auto& a, auto& b) { return a.second > b.second; });
    return {scored[0].first, scored[1].first};
}

// ===== CROSSOVER(offspring generating function) FUNCTION =====
pair<vector<Tree>, vector<Tree>> crossover(vector<Tree>& p1, vector<Tree>& p2) {
    int point = rand() % NUM_TREES;
    vector<Tree> c1, c2;
    for (int i = 0; i < NUM_TREES; i++) {
        if (i < point) {
            c1.push_back(p1[i]);
            c2.push_back(p2[i]);
        } else {
            c1.push_back(p2[i]);
            c2.push_back(p1[i]);
        }
    }
    return {c1, c2};
}

// ===== MUTATION FUNCTION =====
void mutate(vector<Tree>& chrom, double rate) {
    if ((double)rand() / RAND_MAX < rate) {
        int idx = rand() % NUM_TREES;
        chrom[idx] = randomTree();
    }
}

int main() {
    srand(time(0));
    vector<vector<Tree>> population;
    for (int i = 0; i < POP_SIZE; i++) {
        population.push_back({randomTree(), randomTree(), randomTree()});
    }

    ofstream fout("fitness.txt");
    if (!fout.is_open()) {
        cerr << "Error: Could not open fitness.txt\n";
        return 1;
    }

    double mutationRate = 0.3;
    int prevBest = INT_MIN;
    int stagnationCount = 0;

    // Write header for clarity
    fout << "#Gen\tFitness\tMutationRate\n";

    for (int gen = 1; gen <= GENERATIONS; gen++) {
        vector<pair<vector<Tree>, int>> scored;
        for (auto& c : population) {
            scored.push_back({c, fitness(c)});
        }

        sort(scored.begin(), scored.end(),
             [](auto& a, auto& b) { return a.second > b.second; });

        auto best = scored.front();

        cout << "Generation " << gen
             << " | Best Fitness: " << best.second
             << " | Mutation Rate: " << fixed << setprecision(2) << mutationRate
             << " | Layout: ";
        for (auto& t : best.first)
            cout << "(" << t.r << "," << t.c << ") ";
        cout << "\n";

        fout << gen << "\t" << best.second << "\t" << fixed << setprecision(2) << mutationRate << "\n";

        // --- Dynamic Mutation Adjustment ---
        if (best.second <= prevBest) {
            stagnationCount++;
            if (stagnationCount >= 2) { // if no improvement in 2 generations
                mutationRate = min(0.8, mutationRate + 0.05);
                stagnationCount = 0;
            }
        } else {
            mutationRate = max(0.1, mutationRate - 0.05);
            prevBest = best.second;
            stagnationCount = 0;
        }

        vector<vector<Tree>> newPop = {best.first}; // elitism
        while (newPop.size() < POP_SIZE) {
            auto parents = selection(scored);
            auto children = crossover(parents.first, parents.second);
            mutate(children.first, mutationRate);
            mutate(children.second, mutationRate);
            newPop.push_back(children.first);
            if (newPop.size() < POP_SIZE) newPop.push_back(children.second);
        }
        population = newPop;
    }

    fout.close();
    cout << "\nResults saved to fitness.txt\n";
    return 0;
}