import { useEffect, useRef } from "react";
import { SimulationResult, Position, Grid, CellType } from "@shared/types";

interface ResultsCanvasProps {
  result: SimulationResult;
  grid: Grid;
}

export default function ResultsCanvas({ result, grid }: ResultsCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const drawGrid = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const rows = grid.rows;
      const cols = grid.cols;
      const containerWidth = canvas.parentElement?.clientWidth || 600;
      const cellSize = Math.min((containerWidth - 20) / cols, 60);

      canvas.width = cellSize * cols;
      canvas.height = cellSize * rows;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw cells based on actual grid
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cell = grid.cells[r][c];
          const x = c * cellSize;
          const y = r * cellSize;

          // Determine cell color from actual grid
          let bgColor = "#1e293b"; // Default empty cell (slate-800)
          
          if (cell.type === CellType.WALL) {
            bgColor = "#334155"; // Wall (slate-700)
          } else if (cell.type === CellType.START) {
            bgColor = "#15803d"; // Start (green-700)
          } else if (cell.type === CellType.GOAL) {
            bgColor = "#b91c1c"; // Goal (red-700)
          } else if (cell.type === CellType.TREASURE) {
            bgColor = "#ca8a04"; // Treasure (yellow-600)
          }

          ctx.fillStyle = bgColor;
          ctx.fillRect(x, y, cellSize, cellSize);

          // Draw cell border
          ctx.strokeStyle = "#475569";
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, cellSize, cellSize);
        }
      }

      // Draw the final path with gradient
      if (result.completePath.length > 1) {
        ctx.lineWidth = cellSize * 0.25;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        for (let i = 0; i < result.completePath.length - 1; i++) {
          const from = result.completePath[i];
          const to = result.completePath[i + 1];

          // Create gradient for path segment
          const gradient = ctx.createLinearGradient(
            (from.col + 0.5) * cellSize,
            (from.row + 0.5) * cellSize,
            (to.col + 0.5) * cellSize,
            (to.row + 0.5) * cellSize
          );

          const progress = i / (result.completePath.length - 1);
          gradient.addColorStop(0, `rgba(34, 211, 238, ${0.8 - progress * 0.3})`);
          gradient.addColorStop(1, `rgba(59, 130, 246, ${0.8 - progress * 0.3})`);

          ctx.strokeStyle = gradient;
          ctx.beginPath();
          ctx.moveTo((from.col + 0.5) * cellSize, (from.row + 0.5) * cellSize);
          ctx.lineTo((to.col + 0.5) * cellSize, (to.row + 0.5) * cellSize);
          ctx.stroke();
        }
      }

      // Draw special cells with icons
      const drawIcon = (pos: Position, emoji: string, bgColor: string) => {
        const x = pos.col * cellSize;
        const y = pos.row * cellSize;

        // Draw background circle
        ctx.fillStyle = bgColor;
        ctx.beginPath();
        ctx.arc(
          x + cellSize / 2,
          y + cellSize / 2,
          cellSize * 0.35,
          0,
          Math.PI * 2
        );
        ctx.fill();

        // Draw emoji
        ctx.font = `${cellSize * 0.5}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(emoji, x + cellSize / 2, y + cellSize / 2);
      };

      // Draw start
      if (grid.start) {
        drawIcon(grid.start, "🚩", "#15803d");
      }

      // Draw goal
      if (grid.goal) {
        drawIcon(grid.goal, "🎯", "#b91c1c");
      }

      // Draw treasures
      grid.treasures.forEach((treasure) => {
        drawIcon(treasure, "💎", "#ca8a04");
      });
    };

    drawGrid();

    // Redraw on window resize
    window.addEventListener("resize", drawGrid);
    return () => window.removeEventListener("resize", drawGrid);
  }, [result, grid]);

  return (
    <div className="w-full flex justify-center">
      <canvas ref={canvasRef} className="max-w-full" />
    </div>
  );
}
