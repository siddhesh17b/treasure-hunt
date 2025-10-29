import { useLocation, useNavigate } from "react-router-dom";
import { SimulationResult, Grid } from "@shared/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, RotateCcw } from "lucide-react";
import ResultsCanvas from "../components/ResultsCanvas";
import { Toaster } from "@/components/ui/sonner";

interface LocationState {
  result?: SimulationResult;
  gridData?: any;
}

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();

  const result = (location.state as LocationState)?.result;
  const gridData = (location.state as LocationState)?.gridData;

  if (!result || !gridData) {
    navigate("/");
    return null;
  }

  let grid: Grid;
  try {
    grid = Grid.deserialize(gridData);
  } catch (error) {
    navigate("/");
    return null;
  }

  const stats = [
    {
      label: "Total Distance",
      value: result.totalDistance,
      icon: "📏",
      unit: "steps",
      color: "from-cyan-400 to-cyan-600",
    },
    {
      label: "Treasures Collected",
      value: result.treasures.length,
      icon: "💎",
      unit: "collected",
      color: "from-yellow-400 to-yellow-600",
    },
    {
      label: "Nodes Explored",
      value: result.exploredCells.length,
      icon: "🔍",
      unit: "nodes",
      color: "from-blue-400 to-blue-600",
    },
    {
      label: "Routes Tested",
      value: result.permutationsTested,
      icon: "🔄",
      unit: "routes",
      color: "from-orange-400 to-orange-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 md:p-8">
      <Toaster />
      {/* Animated confetti background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="text-slate-700 hover:text-slate-900 hover:bg-white/50"
          >
            <ArrowLeft size={24} />
          </Button>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-green-300/40 rounded-full blur-3xl animate-pulse" />
                <div className="relative text-6xl md:text-8xl">🎉</div>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Mission Complete!
            </h1>
            <p className="text-xl text-purple-700 mb-2 font-semibold">Optimal path found and executed</p>
            <p className="text-slate-600">
              The explorer successfully navigated to collect all treasures and reach the goal
            </p>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className={`bg-gradient-to-br ${stat.color} p-6 rounded-2xl border-2 border-white/30 shadow-xl`}
              >
                <div className="text-4xl mb-3">{stat.icon}</div>
                <div className="text-4xl font-bold text-white mb-2">
                  {typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}
                </div>
                <div className="text-sm text-white/90 mb-1 font-semibold uppercase">
                  {stat.label}
                </div>
                <div className="text-xs text-white/70">{stat.unit}</div>
              </div>
            ))}
          </div>

          {/* Route Visualization */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Path Map */}
            <div className="lg:col-span-2">
              <div className="bg-white/80 backdrop-blur-xl border border-purple-200 rounded-2xl shadow-xl p-8">
                <h2 className="text-xl font-bold text-slate-800 mb-6">Optimal Path Visualization</h2>
                <ResultsCanvas result={result} grid={grid} />
              </div>
            </div>

            {/* Route Details */}
            <div className="space-y-6">
              {/* Journey Summary */}
              <div className="bg-white/80 backdrop-blur-xl border border-purple-200 rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Journey Summary</h3>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-xs shadow-md">
                      1
                    </div>
                    <div>
                      <p className="text-sm text-slate-700 font-semibold">Start</p>
                      <p className="text-xs text-slate-500">
                        Position ({result.optimalRoute[0]?.row}, {result.optimalRoute[0]?.col})
                      </p>
                    </div>
                  </div>

                  {result.optimalRoute.map((treasure, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-white font-bold text-xs shadow-md">
                        {idx + 2}
                      </div>
                      <div>
                        <p className="text-sm text-slate-700 font-semibold">Treasure {idx + 1}</p>
                        <p className="text-xs text-slate-500">
                          Position ({treasure.row}, {treasure.col})
                        </p>
                      </div>
                    </div>
                  ))}

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-xs shadow-md">
                      ✓
                    </div>
                    <div>
                      <p className="text-sm text-slate-700 font-semibold">Goal Reached</p>
                      <p className="text-xs text-green-500 font-semibold">Success!</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Algorithm Info */}
              <div className="bg-white/80 backdrop-blur-xl border border-purple-200 rounded-2xl shadow-xl p-6">
                <h3 className="text-sm font-bold text-slate-800 mb-3 uppercase">Algorithms Used</h3>
                <div className="space-y-3 text-sm">
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-lg px-3 py-2">
                    <p className="text-blue-700 font-semibold">⭐ Greedy Best-First Search</p>
                    <p className="text-blue-600 text-xs mt-1">
                      Found shortest paths between all key points
                    </p>
                  </div>
                  <div className="bg-orange-50 border-2 border-orange-200 rounded-lg px-3 py-2">
                    <p className="text-orange-700 font-semibold">🔄 Backtracking</p>
                    <p className="text-orange-600 text-xs mt-1">
                      Optimized treasure collection order
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button
              onClick={() => navigate("/editor")}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-6 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
            >
              <RotateCcw size={20} />
              New Map
            </Button>

            <Button
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold py-6 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
            >
              <Home size={20} />
              Home
            </Button>

            <Button
              variant="outline"
              className="border-2 border-green-400 text-green-600 hover:bg-green-50 font-semibold py-6 shadow-md hover:shadow-lg transition-all"
            >
              📸 Share Results
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
