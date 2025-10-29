import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Grid, Phase, SimulationResult, Position } from "@shared/types";
import { TreasureHuntSolver } from "@shared/algorithms";
import SimulationCanvas from "../components/SimulationCanvas";
import SimulationControls from "../components/SimulationControls";
import MetricsPanel from "../components/MetricsPanel";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Simulation() {
  const location = useLocation();
  const navigate = useNavigate();

  const gridData = (location.state as any)?.gridData;

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
  const [speed, setSpeed] = useState(2);
  const [phaseMessage, setPhaseMessage] = useState("Initializing...");
  const [explorerPos, setExplorerPos] = useState(initialGrid.start || new Position(0, 0));
  const [treasuresCollected, setTreasuresCollected] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

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
            // On explore - update grid cell state
            const updatedGrid = grid.copy();
            updatedGrid.resetStates();
            setGrid(updatedGrid);
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
    if (!result || isLoading) return;

    // Animate explorer along the path
    const animateExplorer = async () => {
      const path = result.completePath;
      const delayPerStep = Math.max(20, 100 / speed); // Speed affects animation

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
          await new Promise((resolve) => setTimeout(resolve, 300));
        }

        await new Promise((resolve) => setTimeout(resolve, delayPerStep));
      }

      // Animation complete
      setPhase(Phase.COMPLETE);
    };

    if (phase === Phase.EXECUTING && !isLoading) {
      animateExplorer();
    }
  }, [result, phase, speed, isPaused, isLoading, treasuresCollected]);

  useEffect(() => {
    const startTime = Date.now();
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 100);

    return () => clearInterval(timer);
  }, []);

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
          />
        )}
      </div>
    </div>
  );
}
