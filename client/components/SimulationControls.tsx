import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Phase } from "@shared/types";
import { Play, Pause, RotateCcw, SkipForward, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";

interface SimulationControlsProps {
  isPaused: boolean;
  onPauseToggle: () => void;
  onReset: () => void;
  onComplete: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  phase: Phase;
  canAutoComplete: boolean;
  onStepBackward?: () => void;
  onStepForward?: () => void;
  onSkipToEnd?: () => void;
}

export default function SimulationControls({
  isPaused,
  onPauseToggle,
  onReset,
  onComplete,
  speed,
  onSpeedChange,
  phase,
  canAutoComplete,
  onStepBackward,
  onStepForward,
  onSkipToEnd,
}: SimulationControlsProps) {
  return (
    <div className="mt-8 bg-slate-900/50 border border-cyan-500/20 rounded-lg p-6 backdrop-blur-sm">
      <div className="space-y-6">
        {/* Speed Control */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-white">Animation Speed</label>
            <span className="text-sm text-cyan-300 font-semibold">{speed}x</span>
          </div>
          <Slider
            value={[speed]}
            onValueChange={(value) => onSpeedChange(value[0])}
            min={1}
            max={10}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between mt-2 text-xs text-gray-400">
            <span>Slow</span>
            <span>Normal</span>
            <span>Fast</span>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="grid grid-cols-5 gap-2">
          <Button
            onClick={onStepBackward}
            disabled={!isPaused || phase !== Phase.EXECUTING}
            variant="outline"
            className="border-cyan-400/50 text-cyan-300 hover:bg-cyan-500/20 py-6 font-semibold flex items-center justify-center disabled:opacity-30"
            title="Step Backward"
          >
            <ChevronLeft size={20} />
          </Button>

          <Button
            onClick={onPauseToggle}
            className={`py-6 font-semibold flex items-center justify-center gap-2 ${
              isPaused
                ? "bg-green-500 hover:bg-green-600"
                : "bg-yellow-500 hover:bg-yellow-600"
            } text-white`}
          >
            {isPaused ? (
              <>
                <Play size={20} />
                <span className="hidden sm:inline">Play</span>
              </>
            ) : (
              <>
                <Pause size={20} />
                <span className="hidden sm:inline">Pause</span>
              </>
            )}
          </Button>

          <Button
            onClick={onStepForward}
            disabled={!isPaused || phase !== Phase.EXECUTING}
            variant="outline"
            className="border-cyan-400/50 text-cyan-300 hover:bg-cyan-500/20 py-6 font-semibold flex items-center justify-center disabled:opacity-30"
            title="Step Forward"
          >
            <ChevronRight size={20} />
          </Button>

          <Button
            onClick={onReset}
            variant="outline"
            className="border-red-400/50 text-red-300 hover:bg-red-500/20 py-6 font-semibold flex items-center justify-center gap-2"
          >
            <RotateCcw size={20} />
            <span className="hidden sm:inline">Reset</span>
          </Button>

          <Button
            onClick={onSkipToEnd}
            disabled={phase !== Phase.EXECUTING}
            className="bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white py-6 font-semibold flex items-center justify-center gap-2"
            title="Skip to End"
          >
            <ChevronsRight size={20} />
            <span className="hidden sm:inline">Skip</span>
          </Button>
        </div>

        {/* Phase Indicator */}
        <div>
          <label className="text-sm font-semibold text-white block mb-3">Phases</label>
          <div className="grid grid-cols-4 gap-2">
            <div
              className={`p-3 rounded text-center text-xs font-semibold ${
                phase === Phase.PREPROCESSING
                  ? "bg-blue-500 text-white"
                  : "bg-slate-800 text-gray-400"
              }`}
            >
              <div>🔍</div>
              <div className="text-xs mt-1">Preprocess</div>
            </div>
            <div
              className={`p-3 rounded text-center text-xs font-semibold ${
                phase === Phase.OPTIMIZING
                  ? "bg-orange-500 text-white"
                  : "bg-slate-800 text-gray-400"
              }`}
            >
              <div>⚙️</div>
              <div className="text-xs mt-1">Optimize</div>
            </div>
            <div
              className={`p-3 rounded text-center text-xs font-semibold ${
                phase === Phase.EXECUTING
                  ? "bg-cyan-500 text-white"
                  : "bg-slate-800 text-gray-400"
              }`}
            >
              <div>▶️</div>
              <div className="text-xs mt-1">Execute</div>
            </div>
            <div
              className={`p-3 rounded text-center text-xs font-semibold ${
                phase === Phase.COMPLETE
                  ? "bg-green-500 text-white"
                  : "bg-slate-800 text-gray-400"
              }`}
            >
              <div>✨</div>
              <div className="text-xs mt-1">Complete</div>
            </div>
          </div>
        </div>

        {/* Info Text */}
        <div className="bg-slate-800/50 border border-slate-700 rounded p-4">
          <p className="text-xs text-gray-300 leading-relaxed">
            💡 <strong>Tip:</strong> Use the speed slider to adjust animation speed. Pause
            to study individual steps. When complete, click Results to see detailed metrics.
          </p>
        </div>
      </div>
    </div>
  );
}
