import { useRef, useEffect, useState } from "react";
import { Grid, Phase, Position, CellType } from "@shared/types";

interface SimulationCanvasProps {
  grid: Grid;
  explorerPosition: Position;
  completePath: Position[];
  treasures: Position[];
  treasuresCollected: number;
  phase: Phase;
}

export default function SimulationCanvas({
  grid,
  explorerPosition,
  completePath,
  treasures,
  treasuresCollected,
  phase,
}: SimulationCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cellSize, setCellSize] = useState(40);
  const containerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const padding = 2;
    const gridWidth = cellSize * grid.cols + (grid.cols + 1) * padding;
    const gridHeight = cellSize * grid.rows + (grid.rows + 1) * padding;

    canvas.width = gridWidth;
    canvas.height = gridHeight;

    // Draw background
    ctx.fillStyle = "#f5f5f5";
    ctx.fillRect(0, 0, gridWidth, gridHeight);

    // Draw grid lines and cells
    for (let r = 0; r < grid.rows; r++) {
      for (let c = 0; c < grid.cols; c++) {
        const x = c * (cellSize + padding) + padding;
        const y = r * (cellSize + padding) + padding;

        const cell = grid.cells[r][c];
        const pos = new Position(r, c);

        // Determine cell color
        let fillColor = "#ffffff";

        switch (cell.type) {
          case CellType.START:
            fillColor = "#22c55e";
            break;
          case CellType.GOAL:
            fillColor = "#ef4444";
            break;
          case CellType.TREASURE:
            fillColor = "#fbbf24";
            break;
          case CellType.WALL:
            fillColor = "#1f2937";
            break;
          case CellType.EMPTY:
            fillColor = "#ffffff";
            break;
        }

        // Draw cell
        ctx.fillStyle = fillColor;
        ctx.fillRect(x, y, cellSize, cellSize);

        // Draw border
        ctx.strokeStyle = "#e5e7eb";
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, cellSize, cellSize);

        // Draw path if in executing phase
        if (phase === Phase.EXECUTING && completePath.length > 0) {
          const pathIndex = completePath.findIndex((p) => p.equals(pos));
          if (pathIndex !== -1 && pathIndex < completePath.length) {
            const progress = pathIndex / completePath.length;
            ctx.fillStyle = `rgba(34, 197, 94, ${0.3 * progress})`;
            ctx.fillRect(x, y, cellSize, cellSize);
          }
        }

        // Draw cell icon/emoji
        if (
          (cell.type === CellType.START ||
            cell.type === CellType.GOAL ||
            cell.type === CellType.TREASURE) &&
          cellSize > 20
        ) {
          ctx.font = `${Math.floor(cellSize * 0.6)}px Arial`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          const icon =
            cell.type === CellType.START
              ? "🚩"
              : cell.type === CellType.GOAL
                ? "🎯"
                : "💎";

          ctx.fillText(icon, x + cellSize / 2, y + cellSize / 2);
        }
      }
    }

    // Draw complete path as cyan line in executing phase
    if (phase === Phase.EXECUTING && completePath.length > 1) {
      ctx.strokeStyle = "rgba(34, 211, 238, 0.6)";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.beginPath();
      const firstPath = completePath[0];
      ctx.moveTo(
        firstPath.col * (cellSize + padding) + padding + cellSize / 2,
        firstPath.row * (cellSize + padding) + padding + cellSize / 2
      );

      for (let i = 1; i < completePath.length; i++) {
        const pos = completePath[i];
        ctx.lineTo(
          pos.col * (cellSize + padding) + padding + cellSize / 2,
          pos.row * (cellSize + padding) + padding + cellSize / 2
        );
      }
      ctx.stroke();
    }

    // Draw explorer at current position
    if (phase === Phase.EXECUTING) {
      const x = explorerPosition.col * (cellSize + padding) + padding + cellSize / 2;
      const y = explorerPosition.row * (cellSize + padding) + padding + cellSize / 2;

      // Explorer glow
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, cellSize / 2);
      gradient.addColorStop(0, "rgba(34, 211, 238, 0.4)");
      gradient.addColorStop(1, "rgba(34, 211, 238, 0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, cellSize / 2, 0, Math.PI * 2);
      ctx.fill();

      // Explorer circle
      ctx.fillStyle = "#00d4ff";
      ctx.beginPath();
      ctx.arc(x, y, cellSize / 3, 0, Math.PI * 2);
      ctx.fill();

      // Explorer border
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }, [grid, explorerPosition, completePath, cellSize, phase, treasuresCollected]);

  return (
    <div ref={containerRef} className="w-full flex justify-center">
      <canvas
        ref={canvasRef}
        className="rounded-lg border-2 border-slate-400"
        style={{ maxWidth: "100%", height: "auto" }}
      />
    </div>
  );
}
