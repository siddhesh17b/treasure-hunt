import { CellType } from "@shared/types";
import { Button } from "@/components/ui/button";

interface ToolPaletteProps {
  selectedTool: CellType;
  onSelectTool: (tool: CellType) => void;
}

const tools = [
  { type: CellType.START, label: "Start", icon: "🚩", bgColor: "bg-green-500", borderColor: "border-green-500" },
  { type: CellType.GOAL, label: "Goal", icon: "🎯", bgColor: "bg-red-500", borderColor: "border-red-500" },
  { type: CellType.TREASURE, label: "Treasure", icon: "💎", bgColor: "bg-yellow-400", borderColor: "border-yellow-400" },
  { type: CellType.WALL, label: "Wall", icon: "🧱", bgColor: "bg-slate-700", borderColor: "border-slate-700" },
  { type: CellType.EMPTY, label: "Erase", icon: "🗑️", bgColor: "bg-gray-400", borderColor: "border-gray-400" },
];

export default function ToolPalette({ selectedTool, onSelectTool }: ToolPaletteProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {tools.map((tool) => {
        const isSelected = selectedTool === tool.type;
        return (
          <button
            key={tool.type}
            onClick={() => onSelectTool(tool.type)}
            className={`flex flex-col items-center gap-2 py-4 px-3 rounded-xl transition-all duration-200 border-2 shadow-sm ${
              isSelected
                ? `${tool.bgColor} text-white border-white shadow-lg scale-105`
                : `border-purple-200 text-slate-700 hover:border-purple-300 hover:bg-purple-50 bg-white`
            }`}
          >
            <span className="text-2xl">{tool.icon}</span>
            <span className="text-xs font-semibold text-center leading-tight">{tool.label}</span>
          </button>
        );
      })}
    </div>
  );
}
