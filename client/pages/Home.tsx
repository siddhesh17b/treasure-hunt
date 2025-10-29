import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Play } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex flex-col items-center justify-center px-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 text-center max-w-2xl">
        {/* Treasure Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-400/30 rounded-full blur-2xl animate-pulse" />
            <div className="relative w-24 h-24 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center shadow-2xl">
              <svg
                className="w-12 h-12 text-yellow-900"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10.5 1.5H9.5V0h1v1.5zm0 17H9.5v1.5h1V19zm7-8.5h1.5V9.5h-1.5v1zm-17 0H2V9.5H.5v1z" />
                <path d="M17 3v14H3V3h14zm-1 2H4v10h12V5z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
          Treasure Hunt
        </h1>

        {/* Subtitle */}
        <p className="text-2xl md:text-3xl font-light text-cyan-300 mb-3">
          Pathfinder
        </p>

        {/* Tagline */}
        <p className="text-lg text-gray-300 mb-12">
          Algorithmic Explorer
        </p>

        {/* Description */}
        <p className="text-gray-400 mb-12 max-w-lg mx-auto leading-relaxed">
          Design custom mazes and watch intelligent algorithms navigate them in real-time.
          Learn A* pathfinding and backtracking through beautiful animations.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button
            size="lg"
            className="bg-green-500 hover:bg-green-600 text-white text-lg px-8 py-6 rounded-lg font-semibold shadow-lg shadow-green-500/50 flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/editor")}
          >
            <Play size={24} />
            Start Simulation
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="border-cyan-400 text-cyan-300 hover:bg-cyan-500/20 text-lg px-8 py-6 rounded-lg font-semibold flex items-center gap-2"
            onClick={() => navigate("/about")}
          >
            <BookOpen size={24} />
            Learn More
          </Button>
        </div>

        {/* Info Panel */}
        <div className="bg-black/40 border border-cyan-500/30 rounded-lg p-6 backdrop-blur-sm">
          <p className="text-gray-300 text-sm mb-4 font-semibold">ALGORITHMS USED</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <div className="bg-blue-500/20 border border-blue-400/50 px-4 py-2 rounded-full text-blue-300 text-sm font-medium">
              ⭐ A* Search
            </div>
            <div className="bg-orange-500/20 border border-orange-400/50 px-4 py-2 rounded-full text-orange-300 text-sm font-medium">
              🔄 Backtracking
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
