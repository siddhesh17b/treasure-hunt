// Position and Grid utilities
export class Position {
  constructor(
    public row: number,
    public col: number
  ) {}

  equals(other: Position): boolean {
    return this.row === other.row && this.col === other.col;
  }

  manhattanDistance(other: Position): number {
    return Math.abs(this.row - other.row) + Math.abs(this.col - other.col);
  }

  getNeighbors(): Position[] {
    return [
      new Position(this.row - 1, this.col), // Up
      new Position(this.row + 1, this.col), // Down
      new Position(this.row, this.col - 1), // Left
      new Position(this.row, this.col + 1), // Right
    ];
  }

  toString(): string {
    return `(${this.row},${this.col})`;
  }

  hash(): string {
    return `${this.row},${this.col}`;
  }

  static fromHash(hash: string): Position {
    const [row, col] = hash.split(",").map(Number);
    return new Position(row, col);
  }
}

export enum CellType {
  EMPTY = "EMPTY",
  WALL = "WALL",
  START = "START",
  GOAL = "GOAL",
  TREASURE = "TREASURE",
}

export enum CellState {
  NORMAL = "NORMAL",
  EXPLORED = "EXPLORED",
  FRONTIER = "FRONTIER",
  PATH = "PATH",
  CURRENT_ROUTE = "CURRENT_ROUTE",
  FINAL_PATH = "FINAL_PATH",
  BACKTRACK = "BACKTRACK",
}

export interface Cell {
  type: CellType;
  state: CellState;
  animationProgress: number;
}

export class Grid {
  cells: Cell[][];
  start: Position | null = null;
  goal: Position | null = null;
  treasures: Position[] = [];

  constructor(
    public rows: number,
    public cols: number
  ) {
    this.cells = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => ({
        type: CellType.EMPTY,
        state: CellState.NORMAL,
        animationProgress: 0,
      }))
    );
  }

  isValid(pos: Position): boolean {
    return pos.row >= 0 && pos.row < this.rows && pos.col >= 0 && pos.col < this.cols;
  }

  isWalkable(pos: Position): boolean {
    if (!this.isValid(pos)) return false;
    const cellType = this.cells[pos.row][pos.col].type;
    return cellType !== CellType.WALL;
  }

  getCellType(pos: Position): CellType {
    if (!this.isValid(pos)) return CellType.WALL;
    return this.cells[pos.row][pos.col].type;
  }

  setCellType(pos: Position, type: CellType): void {
    if (!this.isValid(pos)) return;

    // Remove from old lists
    if (this.start?.equals(pos)) this.start = null;
    if (this.goal?.equals(pos)) this.goal = null;
    this.treasures = this.treasures.filter((t) => !t.equals(pos));

    // Set new type
    this.cells[pos.row][pos.col].type = type;

    // Update lists
    if (type === CellType.START) this.start = pos;
    if (type === CellType.GOAL) this.goal = pos;
    if (type === CellType.TREASURE) this.treasures.push(pos);
  }

  setCellState(pos: Position, state: CellState): void {
    if (!this.isValid(pos)) return;
    this.cells[pos.row][pos.col].state = state;
  }

  getCellState(pos: Position): CellState {
    if (!this.isValid(pos)) return CellState.NORMAL;
    return this.cells[pos.row][pos.col].state;
  }

  resetStates(): void {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        this.cells[r][c].state = CellState.NORMAL;
        this.cells[r][c].animationProgress = 0;
      }
    }
  }

  clearGrid(): void {
    this.cells = Array.from({ length: this.rows }, () =>
      Array.from({ length: this.cols }, () => ({
        type: CellType.EMPTY,
        state: CellState.NORMAL,
        animationProgress: 0,
      }))
    );
    this.start = null;
    this.goal = null;
    this.treasures = [];
  }

  copy(): Grid {
    const newGrid = new Grid(this.rows, this.cols);
    newGrid.cells = this.cells.map((row) =>
      row.map((cell) => ({ ...cell }))
    );
    newGrid.start = this.start ? new Position(this.start.row, this.start.col) : null;
    newGrid.goal = this.goal ? new Position(this.goal.row, this.goal.col) : null;
    newGrid.treasures = this.treasures.map((t) => new Position(t.row, t.col));
    return newGrid;
  }

  // Serialize for passing through React state
  serialize() {
    return {
      rows: this.rows,
      cols: this.cols,
      cells: this.cells,
      start: this.start ? { row: this.start.row, col: this.start.col } : null,
      goal: this.goal ? { row: this.goal.row, col: this.goal.col } : null,
      treasures: this.treasures.map((t) => ({ row: t.row, col: t.col })),
    };
  }

  // Deserialize from serialized data
  static deserialize(data: any): Grid {
    if (!data || !data.rows || !data.cols) {
      throw new Error("Invalid grid data for deserialization");
    }

    const grid = new Grid(data.rows, data.cols);

    // Ensure cells are properly initialized
    if (data.cells && Array.isArray(data.cells) && data.cells.length > 0) {
      grid.cells = data.cells.map((row: any[]) =>
        row.map((cell: any) => ({
          type: cell.type || CellType.EMPTY,
          state: cell.state || CellState.NORMAL,
          animationProgress: cell.animationProgress || 0,
        }))
      );
    }

    // Restore start position
    if (data.start && typeof data.start === "object" && "row" in data.start && "col" in data.start) {
      grid.start = new Position(data.start.row, data.start.col);
    }

    // Restore goal position
    if (data.goal && typeof data.goal === "object" && "row" in data.goal && "col" in data.goal) {
      grid.goal = new Position(data.goal.row, data.goal.col);
    }

    // Restore treasures
    if (data.treasures && Array.isArray(data.treasures)) {
      grid.treasures = data.treasures
        .filter((t: any) => t && typeof t === "object" && "row" in t && "col" in t)
        .map((t: any) => new Position(t.row, t.col));
    }

    return grid;
  }

  isValid_(): boolean {
    if (!this.start || !this.goal) return false;
    if (this.treasures.length === 0) return false;
    return true;
  }
}

export interface PathResult {
  path: Position[];
  distance: number;
  exploredCells: Position[];
}

export interface TreasureRoute {
  order: Position[];
  totalDistance: number;
  permutationsTested?: number;
}

export interface SimulationResult {
  optimalRoute: Position[];
  totalDistance: number;
  completePath: Position[];
  treasures: Position[];
  exploredCells: Position[];
  permutationsTested: number;
}

export enum Phase {
  PREPROCESSING = "PREPROCESSING",
  OPTIMIZING = "OPTIMIZING",
  EXECUTING = "EXECUTING",
  COMPLETE = "COMPLETE",
}

export enum Screen {
  HOME = "HOME",
  EDITOR = "EDITOR",
  SIMULATION = "SIMULATION",
  RESULTS = "RESULTS",
}
