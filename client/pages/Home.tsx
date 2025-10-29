import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Play, Compass, Map, Sparkles, Zap, Target, Brain } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <Toaster />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Compass className="w-12 h-12 text-purple-600" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Treasure Hunt
              </h1>
            </div>
            <p className="text-xl text-slate-700 mb-2 font-medium">
              Interactive Algorithm Visualizer
            </p>
            <p className="text-sm text-slate-500">
              Explore pathfinding with Greedy Best-First Search + Backtracking
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white/80 backdrop-blur-xl border border-purple-200 rounded-2xl shadow-xl p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* What is this? */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-3 rounded-xl">
                    <Map className="w-6 h-6 text-purple-700" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 mb-2">What is this?</h2>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      An educational tool that visualizes how algorithms find the optimal path
                      through multiple treasures on a grid-based map. Watch the explorer navigate
                      from start 🚩 to goal 🎯 while collecting all treasures 💎!
                    </p>
                  </div>
                </div>
              </div>

              {/* How it works */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-gradient-to-br from-pink-100 to-pink-200 p-3 rounded-xl">
                    <Sparkles className="w-6 h-6 text-pink-700" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 mb-2">How it works</h2>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      The algorithm uses Greedy Best-First Search to find paths between points,
                      then employs Backtracking to determine the optimal order to collect all
                      treasures. See it happen in real-time!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Start Steps */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-xl border border-purple-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-purple-600 text-white px-2.5 py-1 rounded-lg text-sm font-bold shadow-sm">1</span>
                  <h3 className="font-semibold text-slate-800">Design Map</h3>
                </div>
                <p className="text-slate-600 text-sm">
                  Create your custom grid with walls, treasures, start and goal points
                </p>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-5 rounded-xl border border-pink-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-pink-600 text-white px-2.5 py-1 rounded-lg text-sm font-bold shadow-sm">2</span>
                  <h3 className="font-semibold text-slate-800">Run Simulation</h3>
                </div>
                <p className="text-slate-600 text-sm">
                  Watch the algorithm explore paths and optimize treasure collection
                </p>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-5 rounded-xl border border-indigo-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-indigo-600 text-white px-2.5 py-1 rounded-lg text-sm font-bold shadow-sm">3</span>
                  <h3 className="font-semibold text-slate-800">View Results</h3>
                </div>
                <p className="text-slate-600 text-sm">
                  Analyze the optimal route, metrics, and performance statistics
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate("/editor")}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Exploring
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/about")}
                className="border-2 border-purple-300 text-purple-700 hover:bg-purple-50 font-semibold px-8 py-6 text-lg shadow-md hover:shadow-lg transition-all"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Learn More
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-white/60 backdrop-blur border border-purple-200 rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-shadow">
              <Zap className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <h3 className="font-semibold text-slate-800 mb-1">Real-time</h3>
              <p className="text-slate-600 text-xs">Live visualization</p>
            </div>

            <div className="bg-white/60 backdrop-blur border border-purple-200 rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-shadow">
              <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-slate-800 mb-1">Interactive</h3>
              <p className="text-slate-600 text-xs">Control simulation</p>
            </div>

            <div className="bg-white/60 backdrop-blur border border-purple-200 rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-shadow">
              <Brain className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-slate-800 mb-1">Educational</h3>
              <p className="text-slate-600 text-xs">Learn algorithms</p>
            </div>

            <div className="bg-white/60 backdrop-blur border border-purple-200 rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-shadow">
              <Compass className="w-8 h-8 text-pink-600 mx-auto mb-2" />
              <h3 className="font-semibold text-slate-800 mb-1">Optimized</h3>
              <p className="text-slate-600 text-xs">Best path finding</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
