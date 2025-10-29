import { Position, Grid, PathResult, TreasureRoute, CellState } from "./types";

// Priority Queue for A* algorithm
class PriorityQueue {
  private items: Array<{ value: Position; priority: number }> = [];

  add(value: Position, priority: number): void {
    this.items.push({ value, priority });
    this.items.sort((a, b) => a.priority - b.priority);
  }

  removeMin(): Position | undefined {
    return this.items.shift()?.value;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  clear(): void {
    this.items = [];
  }
}

export class AStar {
  static search(
    grid: Grid,
    start: Position,
    goal: Position,
    onExplore?: (pos: Position) => void
  ): PathResult {
    const openSet = new PriorityQueue();
    const closedSet = new Set<string>();
    const cameFrom = new Map<string, Position>();
    const gScore = new Map<string, number>();
    const fScore = new Map<string, number>();
    const exploredCells: Position[] = [];

    const heuristic = (pos: Position, target: Position): number => {
      return pos.manhattanDistance(target);
    };

    const startHash = start.hash();
    const goalHash = goal.hash();

    gScore.set(startHash, 0);
    fScore.set(startHash, heuristic(start, goal));
    openSet.add(start, fScore.get(startHash)!);

    while (!openSet.isEmpty()) {
      const current = openSet.removeMin()!;
      const currentHash = current.hash();

      if (closedSet.has(currentHash)) {
        continue;
      }

      closedSet.add(currentHash);
      exploredCells.push(current);

      if (onExplore && !current.equals(start) && !current.equals(goal)) {
        onExplore(current);
      }

      if (current.equals(goal)) {
        // Reconstruct path
        const path: Position[] = [current];
        let curr = current;
        while (cameFrom.has(curr.hash())) {
          curr = cameFrom.get(curr.hash())!;
          path.unshift(curr);
        }

        return {
          path,
          distance: gScore.get(goalHash) || 0,
          exploredCells,
        };
      }

      for (const neighbor of current.getNeighbors()) {
        if (!grid.isWalkable(neighbor)) {
          continue;
        }

        const neighborHash = neighbor.hash();
        if (closedSet.has(neighborHash)) {
          continue;
        }

        const tentativeGScore = (gScore.get(currentHash) || 0) + 1;

        if (!gScore.has(neighborHash) || tentativeGScore < gScore.get(neighborHash)!) {
          cameFrom.set(neighborHash, current);
          gScore.set(neighborHash, tentativeGScore);
          fScore.set(neighborHash, tentativeGScore + heuristic(neighbor, goal));
          openSet.add(neighbor, fScore.get(neighborHash)!);
        }
      }
    }

    return {
      path: [],
      distance: Infinity,
      exploredCells,
    };
  }
}

export class Backtracking {
  static findOptimalOrder(
    start: Position,
    goal: Position,
    treasures: Position[],
    distances: Map<string, Map<string, number>>,
    onTest?: (order: Position[], distance: number, isBest: boolean) => void
  ): TreasureRoute {
    let bestOrder: Position[] = [];
    let minDistance = Infinity;
    let permutationsTested = 0;

    const getDistance = (from: Position, to: Position): number => {
      const fromMap = distances.get(from.hash());
      if (!fromMap) return Infinity;
      return fromMap.get(to.hash()) || Infinity;
    };

    const backtrack = (
      current: Position,
      visited: Position[],
      unvisited: Set<string>,
      totalCost: number
    ): void => {
      if (unvisited.size === 0) {
        const finalCost = totalCost + getDistance(current, goal);

        permutationsTested++;

        if (onTest) {
          const isBest = finalCost < minDistance;
          onTest(visited, finalCost, isBest);
        }

        if (finalCost < minDistance) {
          minDistance = finalCost;
          bestOrder = [...visited];
        }

        return;
      }

      for (const treasureHash of unvisited) {
        const treasure = Position.fromHash(treasureHash);
        const distToTreasure = getDistance(current, treasure);

        if (distToTreasure === Infinity) {
          continue;
        }

        const newVisited = [...visited, treasure];
        const newUnvisited = new Set(unvisited);
        newUnvisited.delete(treasureHash);

        backtrack(treasure, newVisited, newUnvisited, totalCost + distToTreasure);
      }
    };

    const unvisitedSet = new Set(treasures.map((t) => t.hash()));
    backtrack(start, [], unvisitedSet, 0);

    return {
      order: bestOrder,
      totalDistance: minDistance,
      permutationsTested,
    };
  }
}

export class TreasureHuntSolver {
  static async solve(
    grid: Grid,
    onPhaseChange?: (phase: string) => void,
    onExplore?: (pos: Position) => void,
    onTestRoute?: (order: Position[], distance: number, isBest: boolean) => void
  ): Promise<{
    optimalRoute: Position[];
    totalDistance: number;
    completePath: Position[];
    exploredCells: Position[];
    permutationsTested: number;
  }> {
    if (!grid.start || !grid.goal || grid.treasures.length === 0) {
      throw new Error("Invalid grid configuration");
    }

    const start = grid.start;
    const goal = grid.goal;
    const treasures = grid.treasures;
    const allPoints = [start, ...treasures, goal];

    // Phase 1: Compute all-pairs shortest paths
    onPhaseChange?.("Preprocessing - Finding shortest paths...");
    const distances = new Map<string, Map<string, number>>();
    const paths = new Map<string, Map<string, Position[]>>();
    const allExploredCells: Position[] = [];

    for (let i = 0; i < allPoints.length; i++) {
      distances.set(allPoints[i].hash(), new Map());
      paths.set(allPoints[i].hash(), new Map());

      for (let j = 0; j < allPoints.length; j++) {
        if (i === j) {
          distances.get(allPoints[i].hash())!.set(allPoints[j].hash(), 0);
          paths.get(allPoints[i].hash())!.set(allPoints[j].hash(), []);
          continue;
        }

        const result = AStar.search(grid, allPoints[i], allPoints[j], onExplore);

        if (result.distance === Infinity) {
          distances.get(allPoints[i].hash())!.set(allPoints[j].hash(), Infinity);
          paths.get(allPoints[i].hash())!.set(allPoints[j].hash(), []);
        } else {
          distances.get(allPoints[i].hash())!.set(allPoints[j].hash(), result.distance);
          paths.get(allPoints[i].hash())!.set(allPoints[j].hash(), result.path);
          allExploredCells.push(...result.exploredCells);
        }

        // Add small delay for visualization
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    }

    // Check if all paths exist
    for (const treasure of treasures) {
      const distToTreasure = distances.get(start.hash())?.get(treasure.hash());
      const distToGoal = distances.get(treasure.hash())?.get(goal.hash());
      if (distToTreasure === Infinity || distToGoal === Infinity) {
        throw new Error("Some treasures are unreachable!");
      }
    }

    // Phase 2: Backtracking to find optimal order
    onPhaseChange?.("Optimizing - Finding best treasure order...");
    const routeResult = Backtracking.findOptimalOrder(start, goal, treasures, distances, onTestRoute);

    if (routeResult.totalDistance === Infinity) {
      throw new Error("No valid route found!");
    }

    // Phase 3: Build complete path
    onPhaseChange?.("Executing - Following optimal route...");
    const fullRoute = [start, ...routeResult.order, goal];
    const completePath: Position[] = [];

    for (let i = 0; i < fullRoute.length - 1; i++) {
      const segmentPath = paths.get(fullRoute[i].hash())?.get(fullRoute[i + 1].hash()) || [];
      if (i < fullRoute.length - 2) {
        completePath.push(...segmentPath.slice(0, -1));
      } else {
        completePath.push(...segmentPath);
      }
    }

    return {
      optimalRoute: routeResult.order,
      totalDistance: routeResult.totalDistance,
      completePath,
      exploredCells: allExploredCells,
      permutationsTested: routeResult.permutationsTested || 0,
    };
  }
}
