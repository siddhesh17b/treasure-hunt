import { useEffect, useRef } from "react";
import { SimulationResult, Position, Grid, CellType } from "@shared/types";

interface ResultsCanvasProps {
  result: SimulationResult;
  grid: Grid;
}

export default function ResultsCanvas({ result, grid }: ResultsCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
    ctx.fillRect(x + 1, y + 1, width - 2, height - 2);
  };

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

          // Determine cell color from actual grid - using light theme colors
          let bgColor = "#ffffff"; // Default empty cell (white)
          
          if (cell.type === CellType.WALL) {
            // Draw brick pattern for walls
            drawBrickPattern(ctx, x, y, cellSize, cellSize);
            bgColor = null; // Skip normal fill
          } else if (cell.type === CellType.START) {
            bgColor = "#86efac"; // Start (green-300)
          } else if (cell.type === CellType.GOAL) {
            bgColor = "#fca5a5"; // Goal (red-300)
          } else if (cell.type === CellType.TREASURE) {
            bgColor = "#fde047"; // Treasure (yellow-300)
          }

          // Draw cell (skip if brick pattern was drawn)
          if (bgColor) {
            ctx.fillStyle = bgColor;
            ctx.fillRect(x, y, cellSize, cellSize);
          }

          // Draw cell border
          ctx.strokeStyle = "#e9d5ff";
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
          gradient.addColorStop(0, `rgba(168, 85, 247, ${0.8 - progress * 0.3})`);
          gradient.addColorStop(1, `rgba(236, 72, 153, ${0.8 - progress * 0.3})`);

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
        drawIcon(grid.start, "🚩", "#86efac");
      }

      // Draw goal
      if (grid.goal) {
        drawIcon(grid.goal, "🎯", "#fca5a5");
      }

      // Draw treasures
      grid.treasures.forEach((treasure) => {
        drawIcon(treasure, "💎", "#fde047");
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
