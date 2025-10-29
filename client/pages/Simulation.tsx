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
          },
          (pos: Position) => {
            // On explore - visualize exploration
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
      navigate("/results", { state: { result } });
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

  // Step control handlers
  const handleStepBackward = () => {
    if (!result || currentStepIndex <= 0) return;
    const newIndex = currentStepIndex - 1;
    setCurrentStepIndex(newIndex);
    setExplorerPos(result.completePath[newIndex]);
    
    // Recalculate treasure count based on treasures encountered up to this point
    const treasuresEncountered = new Set<string>();
    for (let i = 0; i <= newIndex; i++) {
      const pos = result.completePath[i];
      const treasure = result.treasures.find(t => t.equals(pos));
      if (treasure) {
        treasuresEncountered.add(treasure.hash());
      }
    }
    setTreasuresCollected(treasuresEncountered.size);
  };

  const handleStepForward = () => {
    if (!result || currentStepIndex >= result.completePath.length - 1) return;
    const newIndex = currentStepIndex + 1;
    setCurrentStepIndex(newIndex);
    setExplorerPos(result.completePath[newIndex]);
    
    // Recalculate treasure count based on treasures encountered up to this point
    const treasuresEncountered = new Set<string>();
    for (let i = 0; i <= newIndex; i++) {
      const pos = result.completePath[i];
      const treasure = result.treasures.find(t => t.equals(pos));
      if (treasure) {
        treasuresEncountered.add(treasure.hash());
      }
    }
    setTreasuresCollected(treasuresEncountered.size);
  };

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
      navigate("/results", { state: { result } });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/editor")}
            className="text-gray-300 hover:text-white"
          >
            <ArrowLeft size={24} />
          </Button>
          <h1 className="text-3xl font-bold text-white">Algorithm Visualization</h1>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/about")}
          className="border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/20"
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
        <div className="mt-8 bg-slate-900/50 border border-cyan-500/20 rounded-lg p-8 backdrop-blur-sm">
          {isLoading ? (
            <div className="aspect-square flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-cyan-500 border-t-yellow-400 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-300 text-lg">{phaseMessage}</p>
              </div>
            </div>
          ) : (
            <SimulationCanvas
              grid={grid}
              explorerPosition={explorerPos}
              completePath={result?.completePath || []}
              treasures={result?.treasures || []}
              treasuresCollected={treasuresCollected}
              phase={phase}
              exploredNodes={exploredNodes}
            />
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
                navigate("/results", { state: { result } });
              }
            }}
            speed={speed}
            onSpeedChange={setSpeed}
            phase={phase}
            canAutoComplete={phase === Phase.COMPLETE}
            onStepBackward={handleStepBackward}
            onStepForward={handleStepForward}
            onSkipToEnd={handleSkipToEnd}
          />
        )}
      </div>
    </div>
  );
}
