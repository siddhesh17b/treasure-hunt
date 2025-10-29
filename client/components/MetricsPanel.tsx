import { Phase } from "@shared/types";

interface MetricsPanelProps {
  phase: Phase;
  currentStep: number;
  totalSteps: number;
  distanceTraveled: number;
  treasuresCollected: number;
  totalTreasures: number;
  elapsedTime: number;
  phaseMessage: string;
}

export default function MetricsPanel({
  phase,
  currentStep,
  totalSteps,
  distanceTraveled,
  treasuresCollected,
  totalTreasures,
  elapsedTime,
  phaseMessage,
}: MetricsPanelProps) {
  const getPhaseColor = (p: Phase) => {
    switch (p) {
      case Phase.PREPROCESSING:
        return "bg-blue-500/20 text-blue-300 border-blue-500/50";
      case Phase.OPTIMIZING:
        return "bg-orange-500/20 text-orange-300 border-orange-500/50";
      case Phase.EXECUTING:
        return "bg-cyan-500/20 text-cyan-300 border-cyan-500/50";
      case Phase.COMPLETE:
        return "bg-green-500/20 text-green-300 border-green-500/50";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/50";
    }
  };

  const getPhaseLabel = (p: Phase) => {
    switch (p) {
      case Phase.PREPROCESSING:
        return "🔍 Preprocessing";
      case Phase.OPTIMIZING:
        return "⚙️ Optimizing";
      case Phase.EXECUTING:
        return "▶️ Executing";
      case Phase.COMPLETE:
        return "✨ Complete";
      default:
        return "Initializing";
    }
  };

  return (
    <div className="bg-slate-900/50 border border-cyan-500/20 rounded-lg backdrop-blur-sm">
      {/* Phase Message */}
      <div className="bg-slate-900/80 border-b border-cyan-500/20 p-4">
        <p className="text-gray-300 text-center text-sm md:text-base">{phaseMessage}</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-6">
        {/* Phase */}
        <div className={`rounded-lg border p-4 text-center ${getPhaseColor(phase)}`}>
          <p className="text-xs md:text-sm font-semibold uppercase opacity-75 mb-2">
            Phase
          </p>
          <p className="text-lg md:text-2xl font-bold">{getPhaseLabel(phase)}</p>
        </div>

        {/* Steps */}
        <div className="bg-purple-500/20 text-purple-300 border border-purple-500/50 rounded-lg p-4 text-center">
          <p className="text-xs md:text-sm font-semibold uppercase opacity-75 mb-2">
            Steps
          </p>
          <p className="text-lg md:text-2xl font-bold">
            {currentStep} / {totalSteps}
          </p>
        </div>

        {/* Distance */}
        <div className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 rounded-lg p-4 text-center">
          <p className="text-xs md:text-sm font-semibold uppercase opacity-75 mb-2">
            Distance
          </p>
          <p className="text-lg md:text-2xl font-bold">{distanceTraveled}</p>
        </div>

        {/* Treasures */}
        <div className="bg-yellow-500/20 text-yellow-300 border border-yellow-500/50 rounded-lg p-4 text-center">
          <p className="text-xs md:text-sm font-semibold uppercase opacity-75 mb-2">
            Treasures
          </p>
          <p className="text-lg md:text-2xl font-bold">
            {treasuresCollected} / {totalTreasures}
          </p>
        </div>

        {/* Time */}
        <div className="bg-green-500/20 text-green-300 border border-green-500/50 rounded-lg p-4 text-center">
          <p className="text-xs md:text-sm font-semibold uppercase opacity-75 mb-2">
            Time
          </p>
          <p className="text-lg md:text-2xl font-bold">{elapsedTime}s</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-6 pb-6">
        <div className="bg-slate-800 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-cyan-400 to-green-400 h-full transition-all duration-300"
            style={{
              width: `${totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
