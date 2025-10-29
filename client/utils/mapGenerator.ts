import { Grid, CellType, Position } from "@shared/types";

export function generateRandomMap(rows: number, cols: number): Grid {
  const grid = new Grid(rows, cols);

  // Place start at top-left area
  grid.setCellType(new Position(0, 0), CellType.START);

  // Place goal at bottom-right area
  grid.setCellType(new Position(rows - 1, cols - 1), CellType.GOAL);

  // Generate simple maze with walls
  // Create walls in a somewhat random pattern that still allows a path
  for (let r = 1; r < rows - 1; r++) {
    for (let c = 1; c < cols - 1; c++) {
      // Random wall placement (40% chance)
      if (Math.random() < 0.4) {
        grid.setCellType(new Position(r, c), CellType.WALL);
      }
    }
  }

  // Place 2-3 treasures at random walkable positions
  const numTreasures = 2 + Math.floor(Math.random() * 2);
  let treasuresPlaced = 0;

  for (let attempt = 0; attempt < 100 && treasuresPlaced < numTreasures; attempt++) {
    const r = Math.floor(Math.random() * (rows - 2)) + 1;
    const c = Math.floor(Math.random() * (cols - 2)) + 1;
    const pos = new Position(r, c);

    // Don't place on start or goal
    if (
      !pos.equals(grid.start!) &&
      !pos.equals(grid.goal!) &&
      grid.getCellType(pos) === CellType.EMPTY
    ) {
      grid.setCellType(pos, CellType.TREASURE);
      treasuresPlaced++;
    }
  }

  // Ensure there's at least a path from start to goal
  // Simple BFS to verify connectivity
  const hasPath = canReach(grid, grid.start!, grid.goal!);
  if (!hasPath) {
    // If no path, clear walls in a line from start to goal
    for (let r = 0; r < rows; r++) {
      const pos = new Position(r, 0);
      if (grid.getCellType(pos) === CellType.WALL) {
        grid.setCellType(pos, CellType.EMPTY);
      }
    }
  }

  return grid;
}

function canReach(grid: Grid, start: Position, goal: Position): boolean {
  const visited = new Set<string>();
  const queue = [start];
  visited.add(start.hash());

  while (queue.length > 0) {
    const current = queue.shift()!;

    if (current.equals(goal)) {
      return true;
    }

    for (const neighbor of current.getNeighbors()) {
      if (
        !visited.has(neighbor.hash()) &&
        grid.isWalkable(neighbor)
      ) {
        visited.add(neighbor.hash());
        queue.push(neighbor);
      }
    }
  }

  return false;
}
