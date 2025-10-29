import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Grid, CellType, Position } from "@shared/types";
import GridCanvas from "../components/GridCanvas";
import ToolPalette from "../components/ToolPalette";
import { ArrowLeft, Play, Shuffle } from "lucide-react";
import { generateRandomMap } from "../utils/mapGenerator";
import { toast } from "sonner";

const GRID_SIZE = 10;

export default function Editor() {
  const navigate = useNavigate();
  const [selectedTool, setSelectedTool] = useState<CellType>(CellType.START);
  const [grid, setGrid] = useState<Grid>(() => new Grid(GRID_SIZE, GRID_SIZE));
  const [gridKey, setGridKey] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      const newGrid = grid.copy();
      const pos = new Position(row, col);
      const currentType = newGrid.getCellType(pos);

      // If clicking same type, remove it (toggle behavior)
      if (currentType === selectedTool) {
        newGrid.setCellType(pos, CellType.EMPTY);
      } else {
        // Place the selected tool
        newGrid.setCellType(pos, selectedTool);
      }

      setGrid(newGrid);
      setGridKey((k) => k + 1);
    },
    [selectedTool, grid]
  );

  const validateGrid = (): boolean => {
    if (!grid.start) {
      toast.error("⚠️ Please place a start point");
      return false;
    }
    if (!grid.goal) {
      toast.error("⚠️ Please place a goal point");
      return false;
    }
    if (grid.treasures.length === 0) {
      toast.error("⚠️ Add at least one treasure to collect");
      return false;
    }
    if (grid.treasures.length > 8) {
      toast.error("⚠️ Too many treasures (max 8 for optimal performance)");
      return false;
    }
    return true;
  };

  const handleRunAlgorithm = () => {
    if (validateGrid()) {
      navigate("/simulation", { state: { gridData: grid.serialize() } });
    }
  };

  const handleRandomMap = () => {
    const newGrid = generateRandomMap(GRID_SIZE, GRID_SIZE);
    setGrid(newGrid);
    setGridKey((k) => k + 1);
    toast.success("Random map generated!");
  };

  const handleClearAll = () => {
    if (confirm("Are you sure? This will clear the entire map.")) {
      const newGrid = new Grid(GRID_SIZE, GRID_SIZE);
      setGrid(newGrid);
      setGridKey((k) => k + 1);
      toast.success("Map cleared");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="text-gray-300 hover:text-white"
          >
            <ArrowLeft size={24} />
          </Button>
          <h1 className="text-3xl font-bold text-white">Design Your Map</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Welcome Banner - Only show once */}
        {showWelcome && (
          <div className="bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-cyan-500/30 rounded-lg p-6 mb-8 backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <div className="text-4xl">👋</div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white mb-2">Welcome to the Map Editor!</h2>
                <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                  Click on grid cells to place objects. You need at least:
                  <span className="block mt-2 ml-4">
                    🚩 <strong className="text-green-400">One Start Point</strong> - Where the explorer begins<br/>
                    💎 <strong className="text-yellow-400">One or More Treasures</strong> - Items to collect (max 8)<br/>
                    🎯 <strong className="text-red-400">One Goal Point</strong> - Final destination
                  </span>
                </p>
                <p className="text-gray-400 text-sm italic">
                  Tip: Try "Random Map" button for a quick start, then customize it!
                </p>
              </div>
              <button
                onClick={() => setShowWelcome(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Grid Canvas */}
          <div className="lg:col-span-2">
            <div className="bg-slate-900/50 border border-cyan-500/20 rounded-lg p-8 backdrop-blur-sm">
              <GridCanvas
                key={gridKey}
                grid={grid}
                onCellClick={handleCellClick}
                selectedTool={selectedTool}
              />
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Tool Palette */}
            <div className="bg-slate-900/50 border border-cyan-500/20 rounded-lg p-6 backdrop-blur-sm">
              <h2 className="text-lg font-semibold text-white mb-4">Tools</h2>
              <ToolPalette selectedTool={selectedTool} onSelectTool={setSelectedTool} />
            </div>

            {/* Legend */}
            <div className="bg-slate-900/50 border border-cyan-500/20 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase">Legend</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded" />
                  <span className="text-gray-300">Start</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-red-500 rounded" />
                  <span className="text-gray-300">Goal</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-yellow-400 rounded" />
                  <span className="text-gray-300">Treasure</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-slate-800 rounded border border-slate-600" />
                  <span className="text-gray-300">Wall</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-white rounded" />
                  <span className="text-gray-300">Empty</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-slate-900/50 border border-cyan-500/20 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase">Map Stats</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex justify-between">
                  <span>Start Point:</span>
                  <span className="font-semibold text-green-400">
                    {grid.start ? "✓" : "✗"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Goal Point:</span>
                  <span className="font-semibold text-red-400">
                    {grid.goal ? "✓" : "✗"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Treasures:</span>
                  <span className="font-semibold text-yellow-400">{grid.treasures.length}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-6 flex items-center gap-2"
                onClick={handleRunAlgorithm}
              >
                <Play size={20} />
                Run Algorithm
              </Button>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="border-cyan-400/50 text-cyan-300 hover:bg-cyan-500/20"
                  onClick={handleRandomMap}
                >
                  <Shuffle size={16} className="mr-2" />
                  Random Map
                </Button>
                <Button
                  variant="outline"
                  className="border-red-400/50 text-red-300 hover:bg-red-500/20"
                  onClick={handleClearAll}
                >
                  Clear All
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
