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
        return "bg-blue-50 text-blue-700 border-blue-300";
      case Phase.OPTIMIZING:
        return "bg-orange-50 text-orange-700 border-orange-300";
      case Phase.EXECUTING:
        return "bg-purple-50 text-purple-700 border-purple-300";
      case Phase.COMPLETE:
        return "bg-green-50 text-green-700 border-green-300";
      default:
        return "bg-gray-50 text-gray-700 border-gray-300";
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
    <div className="bg-white/80 backdrop-blur-xl border border-purple-200 rounded-2xl shadow-lg">
      {/* Phase Message */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-200 p-4">
        <p className="text-slate-700 text-center text-sm md:text-base font-medium">{phaseMessage}</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-6">
        {/* Phase */}
        <div className={`rounded-xl border-2 p-4 text-center shadow-sm ${getPhaseColor(phase)}`}>
          <p className="text-xs md:text-sm font-semibold uppercase opacity-75 mb-2">
            Phase
          </p>
          <p className="text-lg md:text-2xl font-bold">{getPhaseLabel(phase)}</p>
        </div>

        {/* Steps */}
        <div className="bg-purple-50 text-purple-700 border-2 border-purple-300 rounded-xl p-4 text-center shadow-sm">
          <p className="text-xs md:text-sm font-semibold uppercase opacity-75 mb-2">
            Steps
          </p>
          <p className="text-lg md:text-2xl font-bold">
            {currentStep} / {totalSteps}
          </p>
        </div>

        {/* Distance */}
        <div className="bg-cyan-50 text-cyan-700 border-2 border-cyan-300 rounded-xl p-4 text-center shadow-sm">
          <p className="text-xs md:text-sm font-semibold uppercase opacity-75 mb-2">
            Distance
          </p>
          <p className="text-lg md:text-2xl font-bold">{distanceTraveled}</p>
        </div>

        {/* Treasures */}
        <div className="bg-yellow-50 text-yellow-700 border-2 border-yellow-300 rounded-xl p-4 text-center shadow-sm">
          <p className="text-xs md:text-sm font-semibold uppercase opacity-75 mb-2">
            Treasures
          </p>
          <p className="text-lg md:text-2xl font-bold">
            {treasuresCollected} / {totalTreasures}
          </p>
        </div>

        {/* Time */}
        <div className="bg-green-50 text-green-700 border-2 border-green-300 rounded-xl p-4 text-center shadow-sm">
          <p className="text-xs md:text-sm font-semibold uppercase opacity-75 mb-2">
            Time
          </p>
          <p className="text-lg md:text-2xl font-bold">{elapsedTime}s</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-6 pb-6">
        <div className="bg-purple-100 rounded-full h-3 overflow-hidden shadow-inner">
          <div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-300 shadow-sm"
            style={{
              width: `${totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
