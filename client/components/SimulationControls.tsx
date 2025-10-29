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
    <div className="mt-8 bg-white/80 backdrop-blur-xl border border-purple-200 rounded-2xl shadow-xl p-6">
      <div className="space-y-6">
        {/* Speed Control */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-slate-800">Animation Speed</label>
            <span className="text-sm text-purple-600 font-bold">{speed}x</span>
          </div>
          <Slider
            value={[speed]}
            onValueChange={(value) => onSpeedChange(value[0])}
            min={1}
            max={10}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between mt-2 text-xs text-slate-500">
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
            className="border-2 border-purple-300 text-purple-700 hover:bg-purple-50 py-6 font-semibold flex items-center justify-center disabled:opacity-30"
            title="Step Backward"
          >
            <ChevronLeft size={20} />
          </Button>

          <Button
            onClick={onPauseToggle}
            className={`py-6 font-semibold flex items-center justify-center gap-2 shadow-md ${
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
            className="border-2 border-purple-300 text-purple-700 hover:bg-purple-50 py-6 font-semibold flex items-center justify-center disabled:opacity-30"
            title="Step Forward"
          >
            <ChevronRight size={20} />
          </Button>

          <Button
            onClick={onReset}
            variant="outline"
            className="border-2 border-red-300 text-red-700 hover:bg-red-50 py-6 font-semibold flex items-center justify-center gap-2"
          >
            <RotateCcw size={20} />
            <span className="hidden sm:inline">Reset</span>
          </Button>

          <Button
            onClick={onSkipToEnd}
            disabled={phase !== Phase.EXECUTING}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 text-white py-6 font-semibold flex items-center justify-center gap-2 shadow-md"
            title="Skip to End"
          >
            <ChevronsRight size={20} />
            <span className="hidden sm:inline">Skip</span>
          </Button>
        </div>

        {/* Phase Indicator */}
        <div>
          <label className="text-sm font-semibold text-slate-800 block mb-3">Phases</label>
          <div className="grid grid-cols-4 gap-2">
            <div
              className={`p-3 rounded-xl text-center text-xs font-semibold shadow-sm ${
                phase === Phase.PREPROCESSING
                  ? "bg-blue-500 text-white"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              <div>🔍</div>
              <div className="text-xs mt-1">Preprocess</div>
            </div>
            <div
              className={`p-3 rounded-xl text-center text-xs font-semibold shadow-sm ${
                phase === Phase.OPTIMIZING
                  ? "bg-orange-500 text-white"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              <div>⚙️</div>
              <div className="text-xs mt-1">Optimize</div>
            </div>
            <div
              className={`p-3 rounded-xl text-center text-xs font-semibold shadow-sm ${
                phase === Phase.EXECUTING
                  ? "bg-purple-500 text-white"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              <div>▶️</div>
              <div className="text-xs mt-1">Execute</div>
            </div>
            <div
              className={`p-3 rounded-xl text-center text-xs font-semibold shadow-sm ${
                phase === Phase.COMPLETE
                  ? "bg-green-500 text-white"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              <div>✨</div>
              <div className="text-xs mt-1">Complete</div>
            </div>
          </div>
        </div>

        {/* Info Text */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-4 shadow-sm">
          <p className="text-xs text-slate-700 leading-relaxed">
            💡 <strong>Tip:</strong> Use the speed slider to adjust animation speed. Pause
            to study individual steps. When complete, click Results to see detailed metrics.
          </p>
        </div>
      </div>
    </div>
  );
}
