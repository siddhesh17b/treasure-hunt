import { useRef, useEffect, useState } from "react";
import { Grid, CellType, Position } from "@shared/types";

interface GridCanvasProps {
  grid: Grid;
  onCellClick: (row: number, col: number) => void;
  selectedTool?: CellType;
  showCoordinates?: boolean;
}

export default function GridCanvas({
  grid,
  onCellClick,
  selectedTool,
  showCoordinates = false,
}: GridCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cellSize, setCellSize] = useState(40);
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);

  useEffect(() => {
    const updateCellSize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const availableSize = Math.floor((width - 20) / grid.cols);
      setCellSize(Math.min(availableSize, 60));
    };

    updateCellSize();
    window.addEventListener("resize", updateCellSize);
    return () => window.removeEventListener("resize", updateCellSize);
  }, [grid.cols]);

  const getCellColor = (row: number, col: number): string => {
    const cellType = grid.cells[row][col].type;

    switch (cellType) {
      case CellType.START:
        return "#22c55e";
      case CellType.GOAL:
        return "#ef4444";
      case CellType.TREASURE:
        return "#fbbf24";
      case CellType.WALL:
        return "#1f2937";
      case CellType.EMPTY:
        return "#f5f5f5";
      default:
        return "#ffffff";
    }
  };

  const getCellIcon = (row: number, col: number): string => {
    const cellType = grid.cells[row][col].type;
    switch (cellType) {
      case CellType.START:
        return "🚩";
      case CellType.GOAL:
        return "🎯";
      case CellType.TREASURE:
        return "💎";
      case CellType.WALL:
        return "";
      default:
        return "";
    }
  };

  const gridWidth = cellSize * grid.cols + (grid.cols + 1) * 1;
  const gridHeight = cellSize * grid.rows + (grid.rows + 1) * 1;

  return (
    <div
      ref={containerRef}
      className="w-full flex flex-col items-center gap-4"
    >
      <div
        className="relative bg-white rounded-lg border-4 border-slate-300 shadow-xl"
        style={{
          width: gridWidth,
          height: gridHeight,
          display: "grid",
          gridTemplateColumns: `repeat(${grid.cols}, 1fr)`,
          gap: 1,
          padding: 1,
          backgroundColor: "#f9fafb",
        }}
      >
        {grid.cells.map((row, rowIdx) =>
          row.map((cell, colIdx) => (
            <div
              key={`${rowIdx}-${colIdx}`}
              onClick={() => onCellClick(rowIdx, colIdx)}
              onMouseEnter={() => setHoveredCell({ row: rowIdx, col: colIdx })}
              onMouseLeave={() => setHoveredCell(null)}
              className="cursor-pointer relative flex items-center justify-center font-bold text-lg transition-all duration-75 rounded border border-slate-200 hover:border-blue-400 hover:shadow-md"
              style={{
                backgroundColor: getCellColor(rowIdx, colIdx),
                width: cellSize,
                height: cellSize,
                opacity:
                  hoveredCell?.row === rowIdx && hoveredCell?.col === colIdx
                    ? 0.9
                    : 1,
              }}
            >
              {getCellIcon(rowIdx, colIdx)}
              {hoveredCell?.row === rowIdx &&
                hoveredCell?.col === colIdx &&
                showCoordinates && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                    ({rowIdx}, {colIdx})
                  </div>
                )}
            </div>
          ))
        )}
      </div>

      {/* Grid Info */}
      <div className="text-sm text-gray-400">
        Grid Size: {grid.rows} × {grid.cols}
      </div>
    </div>
  );
}
