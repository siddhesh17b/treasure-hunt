# Treasure Hunt Algorithm Visualizer - AI Agent Instructions

## Project Overview
An interactive educational tool visualizing pathfinding algorithms (A* + Backtracking) to solve the Traveling Salesman Problem variant: finding the optimal route from a start point through multiple treasures to a goal on a grid-based map.

**Core Tech**: React 18 + TypeScript + Express + Vite (Fusion Starter template)
**Algorithm**: A* pathfinding + Backtracking optimization for treasure collection order

## Architecture & Data Flow

### Three-Folder Structure (Critical Pattern)
- `shared/` - **Shared business logic** between client/server (Position class, Grid class, algorithms)
- `client/` - React SPA with React Router 6, TailwindCSS, Radix UI components
- `server/` - Express API (minimal usage; only when server-side logic strictly required)

**Path Aliases**: `@/` → client/, `@shared/` → shared/

### Application Flow (Multi-Screen SPA)
1. **Home** (`/`) → Entry point with app introduction + link to About page
2. **About** (`/about`) → Comprehensive beginner-friendly explanation of the project, algorithms, and how everything works
3. **Editor** (`/editor`) → Grid map design interface with tool palette + dismissible welcome banner
4. **Simulation** (`/simulation`) → Real-time algorithm visualization with "Learn More" link to About page
5. **Results** (`/results`) → Analysis of optimal route found

Navigation uses `react-router-dom` with state passing via `location.state` for grid data transfer between screens.

### Educational Features for Beginners
- **About Page**: Dedicated `/about` route with comprehensive explanations from basics to technical details
  - "What Is This?" - High-level overview with real-world examples
  - "How Does It Work?" - Step-by-step breakdown of all 4 phases
  - "Why Is This Important?" - Learning benefits and real-world applications
  - "Technical Details" - Algorithm complexity and implementation notes
  - "Quick Start Guide" - 5-step getting started tutorial
- **Welcome Banner**: Appears on Editor page with quick-start instructions (dismissible with ✕ button)
- **Learn More Buttons**: Available on Home and Simulation pages linking to About page
- **Phase Indicators**: Visual progress through algorithm phases with emoji icons (🔍⚙️▶️✨)
- **Metrics Panel**: Real-time stats showing current phase, steps, distance, treasures collected

## Core Domain Models (shared/types.ts)

### Position Class
```typescript
class Position {
  constructor(public row: number, public col: number)
  hash(): string // "row,col" - used as Map keys
  equals(other: Position): boolean
  manhattanDistance(other: Position): number
  getNeighbors(): Position[] // UDLR neighbors
}
```

### Grid Class
**Stateful grid manager** with:
- `cells: Cell[][]` - 2D array of `{type: CellType, state: CellState, animationProgress}`
- `start: Position | null`, `goal: Position | null`, `treasures: Position[]`
- Methods: `setCellType()`, `setCellState()`, `isWalkable()`, `copy()`, `serialize()`/`deserialize()`

**Critical Pattern**: Always use `grid.copy()` before mutations to maintain immutability in React state.

### Enums
- `CellType`: START, GOAL, TREASURE, WALL, EMPTY (physical grid content)
- `CellState`: NORMAL, EXPLORED, FRONTIER, PATH, CURRENT_ROUTE, FINAL_PATH, BACKTRACK (visualization state)
- `Phase`: PREPROCESSING, OPTIMIZING, EXECUTING, COMPLETE (simulation phases)

## Algorithm Implementation (shared/algorithms.ts)

### TreasureHuntSolver.solve()
**Three-phase algorithm**:

1. **PREPROCESSING**: A* computes all-pairs shortest paths between {start, treasures, goal}
   - Stores distances in nested Maps: `Map<string, Map<string, number>>`
   - Uses Position.hash() as keys
   - Validates all treasures are reachable

2. **OPTIMIZING**: Backtracking finds optimal treasure collection order
   - Explores all permutations of treasure visit sequences
   - Tracks `permutationsTested` for educational metrics
   - Callback `onTestRoute(order, distance, isBest)` for live visualization

3. **EXECUTING**: Constructs complete path from ordered route segments
   - Concatenates A* paths: start → treasure1 → ... → treasureN → goal

**Async pattern**: Uses `await new Promise(resolve => setTimeout(resolve, 50))` for animation delays

## React Component Patterns

### State Management
- **No global state library** - Uses React useState + URL navigation state
- Grid serialization required when passing through React Router:
  ```typescript
  navigate('/simulation', { state: { gridData: grid.serialize() } })
  // Then: Grid.deserialize((location.state as any)?.gridData)
  ```

### Canvas Components (GridCanvas, SimulationCanvas, ResultsCanvas)
- **Manual DOM-based rendering** with `useRef` + CSS Grid layout
- Responsive cell sizing: `cellSize = Math.min((containerWidth - 20) / grid.cols, 60)`
- Color coding via `getCellColor()` helper functions
- Emoji icons for cell types: 🚩 (START), 🎯 (GOAL), 💎 (TREASURE)

### Editor Page Pattern
```typescript
const [grid, setGrid] = useState<Grid>(() => new Grid(GRID_SIZE, GRID_SIZE))
const [gridKey, setGridKey] = useState(0) // Force re-render on grid changes

const handleCellClick = useCallback((row, col) => {
  const newGrid = grid.copy() // Always copy first
  newGrid.setCellType(new Position(row, col), selectedTool)
  setGrid(newGrid)
  setGridKey(k => k + 1) // Trigger canvas re-render
}, [selectedTool, grid])
```

### Simulation Animation Loop
Uses `useEffect` with speed-controlled intervals:
```typescript
for (let i = 0; i < path.length; i++) {
  if (isPaused) { await new Promise(r => setTimeout(r, 100)); i--; continue; }
  setExplorerPos(path[i])
  await new Promise(r => setTimeout(r, Math.max(20, 100 / speed)))
}
```

## Development Workflow

### Prerequisites

Before running this project, ensure you have the following installed:

1. **Node.js** (v18 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **PNPM** (Package Manager)
   - Install globally: `npm install -g pnpm`
   - Verify installation: `pnpm --version`
   - Alternative: Use `npx pnpm` if you don't want to install globally

3. **Google Chrome Browser**
   - Download from: https://www.google.com/chrome/
   - For mobile: Install Chrome from Play Store (Android) or App Store (iOS)

4. **Git** (optional, for cloning the repository)
   - Download from: https://git-scm.com/

### Commands (PNPM required)
```bash
pnpm dev        # Vite dev server (port 8080) with Express middleware
pnpm build      # Build client → dist/spa/, server → dist/server/
pnpm start      # Production server
pnpm typecheck  # TypeScript validation (run before commits)
pnpm test       # Vitest tests
```

### Running on Chrome (PC & Mobile)

**On PC:**
1. Install dependencies: `pnpm install`
2. Start dev server: `pnpm dev`
3. Open Chrome and navigate to `http://localhost:8080`

**On Mobile (same network):**
1. Start dev server on PC: `pnpm dev`
2. Find your PC's local IP address:
   - Windows: `ipconfig` (look for IPv4 Address)
   - macOS/Linux: `ifconfig` or `ip addr`
3. On mobile Chrome, navigate to `http://<YOUR_PC_IP>:8080`
   - Example: `http://192.168.1.100:8080`
4. Ensure PC and mobile are on the same Wi-Fi network

**Note**: Vite dev server binds to `::` (all interfaces) allowing network access. The app is fully responsive and works on mobile devices.

### Single-Port Development
- Vite serves frontend at `http://localhost:8080`
- Express middleware handles `/api/*` routes in same process
- Hot reload for both client AND server code
- See `vite.config.ts` → `expressPlugin()` for integration

### API Endpoint Pattern (Minimal Use)
Only create endpoints when server-side logic is mandatory (e.g., private keys, DB operations):
```typescript
// server/routes/my-route.ts
export const handleMyRoute: RequestHandler = (req, res) => {
  res.json({ data: "..." })
}

// server/index.ts
app.get("/api/my-endpoint", handleMyRoute)
```

## UI Component Library

### Radix UI + TailwindCSS
- Pre-built components in `client/components/ui/`
- Use `cn()` utility (clsx + tailwind-merge) for conditional classes:
  ```typescript
  className={cn("base-class", { "active-class": isActive }, props.className)}
  ```

### Theme System
- Dark gradient backgrounds: `bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950`
- Accent colors: Cyan borders (`border-cyan-500/20`), yellow treasures, green start, red goal
- Configure design tokens in `client/global.css` and `tailwind.config.ts`

### Toast Notifications
Use `sonner` for user feedback:
```typescript
import { toast } from "sonner"
toast.error("Please place a start point")
toast.success("Random map generated!")
```

## Testing & Validation

### Grid Validation (Editor)
Before running simulation:
- Verify `grid.start` and `grid.goal` exist
- Check `grid.treasures.length > 0` and `<= 8` (performance limit)
- All treasures must be reachable (solver throws error if not)

### Type Safety
- **Strict TypeScript** - No `any` types without explicit casts
- Shared types in `@shared/types` ensure client/server alignment
- Use `Position` class methods (`.equals()`, `.hash()`) instead of direct comparisons

## Project-Specific Conventions

### Map Generation (utils/mapGenerator.ts)
- Default grid: 10×10
- Random wall placement: 40% probability
- Ensures path exists via BFS reachability check
- If unreachable, clears column 0 as fallback corridor

### Immutability Pattern
**Always** create new instances for state updates:
```typescript
const newGrid = grid.copy()          // Grid
const newPos = new Position(r, c)    // Position
setGrid(newGrid)                      // React state
```

### Component Key Pattern
Use incrementing `key` prop to force component re-mounts when grid structure changes:
```typescript
<GridCanvas key={gridKey} grid={grid} />
```

## Common Pitfalls & Solutions

1. **Grid deserialization failures**: Always wrap in try-catch and validate `.copy()` method exists
2. **Position comparison**: Use `.equals()` method, not `===` (different object references)
3. **Map keys**: Use `.hash()` string for Map/Set keys, not Position objects
4. **React state mutations**: Never mutate `grid.cells` directly - always `grid.copy()` first
5. **Async animations**: Use proper async/await in useEffect to avoid race conditions

## File Organization

- **Pages**: client/pages/ (each route = one page component)
- **Reusable components**: client/components/ (Canvas, Controls, Modals)
- **UI library**: client/components/ui/ (never edit - generated by shadcn)
- **Utilities**: client/utils/ (mapGenerator), shared/ (algorithms, types)
- **Hooks**: client/hooks/ (use-mobile, use-toast)

## Additional Context

- Built on Fusion Starter template (see AGENTS.md for base patterns)
- Educational project for DAA (Design & Analysis of Algorithms) lab
- Visualization emphasizes step-by-step algorithm understanding over production optimization
- Three.js/Fiber dependencies present but not currently used (potential 3D visualization future)
