# 🗺️ Treasure Hunt Algorithm Visualizer

An interactive educational tool that visualizes pathfinding algorithms (Greedy Best-First Search + Backtracking) to solve a Traveling Salesman Problem variant: finding the optimal route from a start point through multiple treasures to a goal on a grid-based map.

**Core algorithms implemented in C** for optimal performance and educational clarity.

## ✨ Features

- 🎨 **Interactive Map Editor**: Design custom grid maps with walls, treasures, start and goal points
- 🔍 **Real-time Visualization**: Watch algorithms explore the map step-by-step
- 📊 **Live Metrics**: Track distance, treasures collected, nodes explored, and permutations tested
- 🎯 **Optimal Path Finding**: Uses Greedy Best-First Search + Backtracking optimization
- 💻 **C Algorithm Implementation**: Core pathfinding logic written in C for performance
- 📱 **Fully Responsive**: Works on desktop, tablet, and mobile devices
- 🎓 **Educational**: Perfect for learning pathfinding and optimization algorithms

## 🚀 Live Demo

**Access the app**: [https://treasure-hunt-daa-solver.netlify.app](https://treasure-hunt-daa-solver.netlify.app)

Works on:
- 💻 Desktop (Windows, Mac, Linux)
- 📱 Mobile (Android, iOS)
- 🖥️ Any device with a modern web browser

## 🛠️ Tech Stack

- **Algorithms**: C (Greedy BFS, Backtracking) - Located in `/algorithms` folder
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS 3 + Radix UI
- **Routing**: React Router 6
- **Canvas**: HTML5 Canvas for grid visualization
- **Integration**: TypeScript wrapper for C algorithms

## 📋 Prerequisites

Before running this project locally, ensure you have:

1. **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
2. **PNPM** (Package Manager) - Install: `npm install -g pnpm`
3. **Git** (optional) - [Download here](https://git-scm.com/)

## 🏃 Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/siddhesh17b/treasure-hunt.git
cd treasure-hunt
```

### 2. Install dependencies
```bash
pnpm install
```

### 3. Start development server
```bash
pnpm dev
```

### 4. Open in browser
- **On PC**: Navigate to `http://localhost:8080`
- **On Mobile** (same WiFi network):
  1. Find your PC's IP address:
     - Windows: `ipconfig` (look for IPv4 Address)
     - Mac/Linux: `ifconfig` or `ip addr`
  2. On mobile browser: `http://<YOUR_PC_IP>:8080`
     - Example: `http://192.168.1.100:8080`

## 📦 Available Scripts

```bash
pnpm dev        # Start dev server (port 8080)
pnpm build      # Build for production
pnpm start      # Run production server
pnpm typecheck  # TypeScript validation
pnpm test       # Run tests
```

## 🌐 Deployment

### Deploy to Netlify (Recommended - FREE)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy on Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Sign up/Login (can use GitHub account)
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub and select this repository
   - Netlify auto-detects settings from `netlify.toml`
   - Click "Deploy"

3. **Get your link**:
   - You'll receive a URL like: `https://treasure-hunt-algo.netlify.app`
   - Share this link with anyone - works on all devices!

### Alternative: Deploy to Vercel

```bash
# Install Vercel CLI
pnpm install -g vercel

# Deploy
vercel
```

## 🎮 How to Use

1. **Home Page**: Learn about the project and algorithms
2. **Editor Page**: 
   - Use the tool palette to place Start (🚩), Goal (🎯), Treasures (💎), and Walls (🧱)
   - Click "Random Map" for a quick start
   - Click "Run Simulation" when ready
3. **Simulation Page**:
   - Watch the algorithm explore and find the optimal path
   - Control playback speed
   - View real-time metrics
4. **Results Page**:
   - See the optimal path visualization
   - Review performance statistics
   - Check treasure collection order

## 🧠 Algorithms Used

### Core C Implementations (`/algorithms` folder)

#### 1. **Greedy Best-First Search** (`greedy_bfs.c`)
- Finds shortest path from start to goal using heuristic-based search
- Uses Manhattan distance as heuristic function
- Implements custom Priority Queue for efficient node selection
- **Time Complexity**: O(V + E) where V = vertices, E = edges
- **Space Complexity**: O(V)

**Key Features**:
- Priority queue implementation with sorted insertion
- Visited cells tracking to avoid cycles
- Parent pointer storage for path reconstruction
- Manhattan distance heuristic for optimal pathfinding

#### 2. **Backtracking TSP Solver** (`backtracking.c`)
- Solves Traveling Salesman Problem variant
- Explores all permutations of treasure visiting orders
- Finds globally optimal route with minimum total distance
- **Time Complexity**: O(n!) where n = number of treasures
- **Space Complexity**: O(n) for recursion stack

**Key Features**:
- Recursive permutation generation
- Pruning techniques for optimization
- Real-time best route tracking
- Comprehensive route testing and comparison

### Web Interface Integration
- TypeScript wrapper interfaces with C algorithm logic
- Visual representation of algorithm execution
- Real-time metrics and step-by-step visualization
- Interactive map editor for custom test cases

### Algorithm Workflow
1. **Preprocessing**: Greedy BFS finds shortest paths between all key points
2. **Optimization**: Backtracking determines optimal treasure collection order  
3. **Execution**: Constructs and visualizes complete optimal path

## 🎨 Color Scheme

- **Light Theme**: Purple and pink gradient palette
- 🚩 **Start**: Green
- 🎯 **Goal**: Red
- 💎 **Treasure**: Yellow
- 🧱 **Wall**: Brick texture
- 📍 **Path**: Purple→Pink gradient

## 📁 Project Structure

```
treasure-hunt/
├── algorithms/         # C Algorithm Implementations ⭐
│   ├── greedy_bfs.c   # Greedy Best-First Search algorithm
│   └── backtracking.c # Backtracking TSP solver
├── client/            # React frontend
│   ├── pages/        # Route components
│   ├── components/   # Reusable UI components
│   └── utils/        # Utility functions
├── server/           # Express backend
├── shared/           # Shared types & algorithm wrappers
│   ├── types.ts     # Position, Grid, Cell types
│   └── algorithms.ts # TypeScript interface to C algorithms
└── netlify/         # Deployment configuration
```

## 🔧 Running C Algorithms Standalone

The core algorithms can be compiled and run independently for testing:

```bash
# Navigate to algorithms folder
cd algorithms

# Compile Greedy BFS
gcc greedy_bfs.c -o greedy_bfs
./greedy_bfs

# Compile Backtracking
gcc backtracking.c -o backtracking  
./backtracking
```

Both programs include demo test cases and visualization output.

## 🤝 Contributing

This is an educational project for DAA (Design & Analysis of Algorithms) lab. Feel free to:
- Report bugs
- Suggest improvements
- Fork and experiment

## 📝 License

MIT License - See [LICENSE](LICENSE) file for details

## 👨‍💻 Author

**Siddhesh Bisen**
- GitHub: [@siddhesh17b](https://github.com/siddhesh17b)
- Project Repository: [treasure-hunt](https://github.com/siddhesh17b/treasure-hunt)

Created as part of Design & Analysis of Algorithms coursework

## 🙏 Acknowledgments

- Built with [Fusion Starter](https://github.com/fusion-starter) template
- UI components from [Radix UI](https://www.radix-ui.com/)
- Icons from [Lucide React](https://lucide.dev/)

---

**🌟 Star this repo if you found it helpful!**
