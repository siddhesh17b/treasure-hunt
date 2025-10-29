import { useRef, useEffect, useState } from "react";
import { Grid, Phase, Position, CellType } from "@shared/types";

interface SimulationCanvasProps {
  grid: Grid;
  explorerPosition: Position;
  completePath: Position[];
  treasures: Position[];
  treasuresCollected: number;
  phase: Phase;
  exploredNodes: Position[];
  isLoading: boolean;
}

export default function SimulationCanvas({
  grid,
  explorerPosition,
  completePath,
  treasures,
  treasuresCollected,
  phase,
  exploredNodes,
  isLoading,
}: SimulationCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cellSize, setCellSize] = useState(40);
  const containerRef = useRef<HTMLDivElement>(null);

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
    const updateCellSize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      if (width === 0) return; // Wait until container has width
      const availableSize = Math.floor((width - 20) / grid.cols);
      setCellSize(Math.min(availableSize, 60));
    };

    // Use setTimeout to ensure container is mounted
    const timer = setTimeout(updateCellSize, 100);
    updateCellSize();
    
    window.addEventListener("resize", updateCellSize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateCellSize);
    };
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

    // Draw background with subtle gradient
    const gradient = ctx.createLinearGradient(0, 0, gridWidth, gridHeight);
    gradient.addColorStop(0, "#faf5ff");
    gradient.addColorStop(1, "#f3e8ff");
    ctx.fillStyle = gradient;
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
            fillColor = "#86efac";
            break;
          case CellType.GOAL:
            fillColor = "#fca5a5";
            break;
          case CellType.TREASURE:
            fillColor = "#fde047";
            break;
          case CellType.WALL:
            // Draw brick pattern for walls
            drawBrickPattern(ctx, x, y, cellSize, cellSize);
            fillColor = null; // Skip normal fill
            break;
          case CellType.EMPTY:
            fillColor = "#ffffff";
            break;
        }

        // Draw cell (skip if brick pattern was drawn)
        if (fillColor) {
          ctx.fillStyle = fillColor;
          ctx.fillRect(x, y, cellSize, cellSize);
        }

        // Draw border
        ctx.strokeStyle = "#e9d5ff";
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, cellSize, cellSize);

        // Show explored nodes during preprocessing phase with ripple animation
        if (phase === Phase.PREPROCESSING && exploredNodes.length > 0) {
          const exploredIndex = exploredNodes.findIndex(n => n.equals(pos));
          if (exploredIndex !== -1 && cell.type === CellType.EMPTY) {
            // Calculate animation progress based on when this node was explored
            const progress = exploredIndex / Math.max(1, exploredNodes.length);
            
            // Base purple gradient that fades in
            const baseOpacity = Math.min(0.4, 0.1 + progress * 0.3);
            ctx.fillStyle = `rgba(168, 85, 247, ${baseOpacity})`;
            ctx.fillRect(x, y, cellSize, cellSize);
            
            // Add wave effect for recently explored nodes (last 30 nodes)
            const recentThreshold = 30;
            if (exploredIndex >= exploredNodes.length - recentThreshold) {
              const recency = (exploredNodes.length - exploredIndex) / recentThreshold;
              
              // Pulsing pink wave
              const waveOpacity = 0.7 * recency;
              ctx.fillStyle = `rgba(236, 72, 153, ${waveOpacity})`;
              ctx.fillRect(x, y, cellSize, cellSize);
              
              // Add bright border to newest nodes
              if (exploredIndex >= exploredNodes.length - 5) {
                ctx.strokeStyle = `rgba(236, 72, 153, ${recency})`;
                ctx.lineWidth = 2;
                ctx.strokeRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
              }
            }
          }
        }

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

    // Draw complete path as gradient line in executing phase
    if (phase === Phase.EXECUTING && completePath.length > 1) {
      ctx.strokeStyle = "rgba(168, 85, 247, 0.7)";
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
      gradient.addColorStop(0, "rgba(168, 85, 247, 0.5)");
      gradient.addColorStop(1, "rgba(168, 85, 247, 0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, cellSize / 2, 0, Math.PI * 2);
      ctx.fill();

      // Explorer circle
      ctx.fillStyle = "#a855f7";
      ctx.beginPath();
      ctx.arc(x, y, cellSize / 3, 0, Math.PI * 2);
      ctx.fill();

      // Explorer border
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }, [grid, explorerPosition, completePath, cellSize, phase, treasuresCollected, exploredNodes, isLoading]);

  return (
    <div ref={containerRef} className="w-full flex justify-center min-h-[400px]">
      <canvas
        ref={canvasRef}
        className="rounded-xl border-2 border-purple-300 shadow-lg"
        style={{ maxWidth: "100%", height: "auto" }}
      />
    </div>
  );
}
