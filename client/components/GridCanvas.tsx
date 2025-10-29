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
        return "#86efac";
      case CellType.GOAL:
        return "#fca5a5";
      case CellType.TREASURE:
        return "#fde047";
      case CellType.WALL:
        return "#64748b"; // Darker slate for wall base
      case CellType.EMPTY:
        return "#ffffff";
      default:
        return "#ffffff";
    }
  };

  const drawBrickPattern = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number
  ) => {
    // Base color - darker slate
    ctx.fillStyle = "#64748b";
    ctx.fillRect(x, y, width, height);

    // Brick pattern
    const brickHeight = height / 3;
    const brickWidth = width / 2;

    // Draw mortar lines
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 1;

    // Horizontal lines
    ctx.beginPath();
    ctx.moveTo(x, y + brickHeight);
    ctx.lineTo(x + width, y + brickHeight);
    ctx.moveTo(x, y + brickHeight * 2);
    ctx.lineTo(x + width, y + brickHeight * 2);
    ctx.stroke();

    // Vertical lines (offset pattern)
    ctx.beginPath();
    // Top row
    ctx.moveTo(x + brickWidth, y);
    ctx.lineTo(x + brickWidth, y + brickHeight);
    // Middle row (offset)
    ctx.moveTo(x + brickWidth / 2, y + brickHeight);
    ctx.lineTo(x + brickWidth / 2, y + brickHeight * 2);
    ctx.moveTo(x + brickWidth * 1.5, y + brickHeight);
    ctx.lineTo(x + brickWidth * 1.5, y + brickHeight * 2);
    // Bottom row
    ctx.moveTo(x + brickWidth, y + brickHeight * 2);
    ctx.lineTo(x + brickWidth, y + height);
    ctx.stroke();

    // Add subtle shadow for depth
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(x + 1, y + 1, width - 2, height - 2);
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
        className="relative bg-purple-50 rounded-xl border-4 border-purple-300 shadow-xl"
        style={{
          width: gridWidth,
          height: gridHeight,
          display: "grid",
          gridTemplateColumns: `repeat(${grid.cols}, 1fr)`,
          gap: 1,
          padding: 1,
          backgroundColor: "#faf5ff",
        }}
      >
        {grid.cells.map((row, rowIdx) =>
          row.map((cell, colIdx) => {
            const isWall = cell.type === CellType.WALL;
            return (
              <div
                key={`${rowIdx}-${colIdx}`}
                onClick={() => onCellClick(rowIdx, colIdx)}
                onMouseEnter={() => setHoveredCell({ row: rowIdx, col: colIdx })}
                onMouseLeave={() => setHoveredCell(null)}
                className={`cursor-pointer relative flex items-center justify-center font-bold text-lg transition-all duration-75 rounded border hover:shadow-md ${
                  isWall 
                    ? "border-slate-600 hover:border-slate-700 bg-brick-pattern" 
                    : "border-purple-200 hover:border-purple-400"
                }`}
                style={{
                  backgroundColor: isWall ? "#64748b" : getCellColor(rowIdx, colIdx),
                  backgroundImage: isWall 
                    ? `linear-gradient(to bottom, 
                        transparent 33%, #475569 33%, #475569 34%, transparent 34%, 
                        transparent 66%, #475569 66%, #475569 67%, transparent 67%),
                       linear-gradient(to right, 
                        transparent 0%, transparent 50%, #475569 50%, #475569 51%, transparent 51%),
                       linear-gradient(to right, 
                        transparent 0%, #475569 25%, #475569 26%, transparent 26%,
                        transparent 75%, #475569 75%, #475569 76%, transparent 76%)`
                    : "none",
                  backgroundPosition: isWall ? "0 0, 0 0, 0 33%" : "initial",
                  backgroundSize: isWall ? `100% 100%, 100% 33.33%, 100% 33.33%` : "initial",
                  width: cellSize,
                  height: cellSize,
                  opacity:
                    hoveredCell?.row === rowIdx && hoveredCell?.col === colIdx
                      ? 0.9
                      : 1,
                  boxShadow: isWall ? "inset 1px 1px 3px rgba(0,0,0,0.15)" : "none",
                }}
              >
                {getCellIcon(rowIdx, colIdx)}
                {hoveredCell?.row === rowIdx &&
                  hoveredCell?.col === colIdx &&
                  showCoordinates && (
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                      ({rowIdx}, {colIdx})
                    </div>
                  )}
              </div>
            );
          })
        )}
      </div>

      {/* Grid Info */}
      <div className="text-sm text-slate-600 font-medium">
        Grid Size: {grid.rows} × {grid.cols}
      </div>
    </div>
  );
}
