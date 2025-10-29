import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Grid, Phase, SimulationResult, Position } from "@shared/types";
import { TreasureHuntSolver } from "@shared/algorithms";
import SimulationCanvas from "../components/SimulationCanvas";
import SimulationControls from "../components/SimulationControls";
import MetricsPanel from "../components/MetricsPanel";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

interface LocationState {
  gridData?: any;
}

export default function Simulation() {
  const location = useLocation();
  const navigate = useNavigate();

  const gridData = (location.state as LocationState)?.gridData;

  if (!gridData) {
    navigate("/editor");
    return null;
  }

  // Initialize grid safely
  let initialGrid: Grid;
  try {
    initialGrid = Grid.deserialize(gridData);
    if (!initialGrid || typeof initialGrid.copy !== "function") {
      throw new Error("Grid deserialization failed - copy method not available");
    }
  } catch (error) {
    console.error("Failed to deserialize grid:", error);
    toast.error("Error loading map. Returning to editor.");
    navigate("/editor");
    return null;
  }

  const [grid, setGrid] = useState(() => initialGrid.copy());
  const [phase, setPhase] = useState<Phase>(Phase.PREPROCESSING);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [speed, setSpeed] = useState(1); // Changed default from 2 to 1 (slower)
  const [phaseMessage, setPhaseMessage] = useState("Initializing...");
  const [explorerPos, setExplorerPos] = useState(initialGrid.start || new Position(0, 0));
  const [treasuresCollected, setTreasuresCollected] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [exploredNodes, setExploredNodes] = useState<Position[]>([]); // For visualization
  const [currentSearchPair, setCurrentSearchPair] = useState<{ from: Position | null; to: Position | null }>({
    from: null,
    to: null,
  });

  useEffect(() => {
    const runSimulation = async () => {
      try {
        setIsLoading(true);
        setPhase(Phase.PREPROCESSING);

        const simulationGrid = grid.copy();
        
        console.log("Starting simulation with grid:", {
          rows: simulationGrid.rows,
          cols: simulationGrid.cols,
          start: simulationGrid.start,
          goal: simulationGrid.goal,
          treasures: simulationGrid.treasures.length
        });

        const result = await TreasureHuntSolver.solve(
          simulationGrid,
          (phase: string) => {
            console.log("Phase update:", phase);
            setPhaseMessage(phase);
            if (phase.includes("Optimizing")) {
              // Clear exploration visualization when moving to optimization phase
              setExploredNodes([]);
              setCurrentSearchPair({ from: null, to: null });
            }
          },
          (pos: Position) => {
            // On explore - visualize exploration in real-time
            setExploredNodes(prev => [...prev, pos]);
          },
          (order: Position[], distance: number, isBest: boolean) => {
            // On test route
            console.log("Testing route:", { distance, isBest });
          }
        );

        console.log("Simulation result:", {
          pathLength: result.completePath.length,
          totalDistance: result.totalDistance,
          treasuresCount: grid.treasures.length
        });

        // Add treasures from grid to result
        const fullResult: SimulationResult = {
          ...result,
          treasures: grid.treasures,
        };

        setResult(fullResult);
        setIsLoading(false);
        setPhase(Phase.EXECUTING);
      } catch (error) {
        console.error("Simulation error:", error);
        toast.error(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
        setTimeout(() => navigate("/editor"), 2000);
      }
    };

    runSimulation();
  }, []);

  useEffect(() => {
    if (!result || isLoading || isAnimating) return;

    // Animate explorer along the path
    const animateExplorer = async () => {
      setIsAnimating(true);
      const path = result.completePath;
      const delayPerStep = Math.max(100, 500 / speed); // Slower: min 100ms, base 500ms

      for (let i = 0; i < path.length; i++) {
        if (isPaused) {
          // Wait while paused
          await new Promise((resolve) => setTimeout(resolve, 100));
          i--; // Retry same step
          continue;
        }

        setExplorerPos(path[i]);
        setCurrentStepIndex(i);

        // Check if we collected a treasure
        const treasure = result.treasures.find((t) => t.equals(path[i]));
        if (treasure && !result.treasures.slice(0, treasuresCollected).find((t) => t.equals(treasure))) {
          setTreasuresCollected((prev) => prev + 1);
          // Wait longer at treasure
          await new Promise((resolve) => setTimeout(resolve, 800));
        }

        await new Promise((resolve) => setTimeout(resolve, delayPerStep));
      }

      // Animation complete - auto navigate to results after 1.5 seconds
      setPhase(Phase.COMPLETE);
      setIsAnimating(false);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      navigate("/results", { state: { result, gridData: grid.serialize() } });
    };

    if (phase === Phase.EXECUTING && !isLoading && !isAnimating) {
      animateExplorer();
    }
  }, [result, phase, speed, isPaused, isLoading, treasuresCollected, isAnimating, navigate]);

  useEffect(() => {
    const startTime = Date.now();
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 100);

    return () => clearInterval(timer);
  }, []);

  // Skip to end handler
  const handleSkipToEnd = () => {
    if (!result) return;
    setIsPaused(true);
    setIsAnimating(false);
    const lastIndex = result.completePath.length - 1;
    setCurrentStepIndex(lastIndex);
    setExplorerPos(result.completePath[lastIndex]);
    setTreasuresCollected(result.treasures.length);
    setPhase(Phase.COMPLETE);
    
    // Navigate to results after a short delay
    setTimeout(() => {
      navigate("/results", { state: { result, gridData: grid.serialize() } });
    }, 1000);
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
            onClick={() => navigate("/editor")}
            className="text-slate-700 hover:text-slate-900 hover:bg-white/50"
          >
            <ArrowLeft size={24} />
          </Button>
          <h1 className="text-3xl font-bold text-slate-800">Algorithm Visualization</h1>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/about")}
          className="border-purple-300 text-purple-700 hover:bg-purple-50"
        >
          <BookOpen size={18} className="mr-2" />
          Learn More
        </Button>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Metrics Panel */}
        <MetricsPanel
          phase={phase}
          currentStep={currentStepIndex}
          totalSteps={result?.completePath.length || 0}
          distanceTraveled={currentStepIndex}
          treasuresCollected={treasuresCollected}
          totalTreasures={result?.treasures.length || 0}
          elapsedTime={elapsedTime}
          phaseMessage={phaseMessage}
        />

        {/* Main Visualization Area */}
        <div className="mt-8 bg-white/80 backdrop-blur-xl border border-purple-200 rounded-2xl shadow-xl p-8">
          <SimulationCanvas
            grid={grid}
            explorerPosition={explorerPos}
            completePath={result?.completePath || []}
            treasures={result?.treasures || []}
            treasuresCollected={treasuresCollected}
            phase={phase}
            exploredNodes={exploredNodes}
            isLoading={isLoading}
          />
          
          {/* Overlay message during preprocessing */}
          {isLoading && (
            <div className="mt-6 text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" />
                <p className="text-slate-700 text-lg font-medium">{phaseMessage}</p>
              </div>
              {phase === Phase.PREPROCESSING && exploredNodes.length > 0 && (
                <p className="text-purple-600 text-sm font-semibold">
                  Nodes explored: {exploredNodes.length}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Controls */}
        {!isLoading && (
          <SimulationControls
            isPaused={isPaused}
            onPauseToggle={() => setIsPaused(!isPaused)}
            onReset={() => navigate("/editor")}
            onComplete={() => {
              if (result) {
                navigate("/results", { state: { result, gridData: grid.serialize() } });
              }
            }}
            speed={speed}
            onSpeedChange={setSpeed}
            phase={phase}
            canAutoComplete={phase === Phase.COMPLETE}
            onSkipToEnd={handleSkipToEnd}
          />
        )}
      </div>
    </div>
  );
}
