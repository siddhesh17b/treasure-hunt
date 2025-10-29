import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Grid, CellType, Position } from "@shared/types";
import GridCanvas from "../components/GridCanvas";
import ToolPalette from "../components/ToolPalette";
import { ArrowLeft, Play, Shuffle } from "lucide-react";
import { generateRandomMap } from "../utils/mapGenerator";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 md:p-8">
      <Toaster />
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="text-slate-700 hover:text-slate-900 hover:bg-white/50"
          >
            <ArrowLeft size={24} />
          </Button>
          <h1 className="text-3xl font-bold text-slate-800">Design Your Map</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Welcome Banner - Only show once */}
        {showWelcome && (
          <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-indigo-50 border-2 border-purple-300 rounded-2xl p-6 mb-8 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="text-4xl">👋</div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-slate-800 mb-2">Welcome to the Map Editor!</h2>
                <p className="text-slate-700 text-sm mb-4 leading-relaxed">
                  Click on grid cells to place objects. You need at least:
                  <span className="block mt-2 ml-4">
                    🚩 <strong className="text-green-700">One Start Point</strong> - Where the explorer begins<br/>
                    💎 <strong className="text-yellow-700">One or More Treasures</strong> - Items to collect (max 8)<br/>
                    🎯 <strong className="text-red-700">One Goal Point</strong> - Final destination
                  </span>
                </p>
                <p className="text-slate-600 text-sm italic">
                  Tip: Try "Random Map" button for a quick start, then customize it!
                </p>
              </div>
              <button
                onClick={() => setShowWelcome(false)}
                className="text-slate-400 hover:text-slate-700 transition-colors text-xl font-bold"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Grid Canvas */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-xl border border-purple-200 rounded-2xl shadow-xl p-8">
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
            <div className="bg-white/80 backdrop-blur-xl border border-purple-200 rounded-2xl shadow-xl p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Tools</h2>
              <ToolPalette selectedTool={selectedTool} onSelectTool={setSelectedTool} />
            </div>

            {/* Legend */}
            <div className="bg-white/80 backdrop-blur-xl border border-purple-200 rounded-2xl shadow-xl p-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-4 uppercase">Legend</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-400 rounded shadow-sm" />
                  <span className="text-slate-700">Start</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-red-400 rounded shadow-sm" />
                  <span className="text-slate-700">Goal</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-yellow-400 rounded shadow-sm" />
                  <span className="text-slate-700">Treasure</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-slate-400 rounded border border-slate-300 shadow-sm" />
                  <span className="text-slate-700">Wall</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-white rounded border border-slate-200 shadow-sm" />
                  <span className="text-slate-700">Empty</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white/80 backdrop-blur-xl border border-purple-200 rounded-2xl shadow-xl p-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-4 uppercase">Map Stats</h3>
              <div className="space-y-2 text-sm text-slate-700">
                <div className="flex justify-between">
                  <span>Start Point:</span>
                  <span className="font-semibold text-green-600">
                    {grid.start ? "✓" : "✗"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Goal Point:</span>
                  <span className="font-semibold text-red-600">
                    {grid.goal ? "✓" : "✗"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Treasures:</span>
                  <span className="font-semibold text-yellow-600">{grid.treasures.length}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-6 flex items-center gap-2 shadow-lg"
                onClick={handleRunAlgorithm}
              >
                <Play size={20} />
                Run Algorithm
              </Button>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="border-2 border-purple-300 text-purple-700 hover:bg-purple-50 shadow-sm"
                  onClick={handleRandomMap}
                >
                  <Shuffle size={16} className="mr-2" />
                  Random Map
                </Button>
                <Button
                  variant="outline"
                  className="border-2 border-red-300 text-red-700 hover:bg-red-50 shadow-sm"
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
