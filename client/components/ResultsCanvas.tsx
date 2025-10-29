import { useRef, useEffect, useState } from "react";
import { SimulationResult, CellType, Position } from "@shared/types";

interface ResultsCanvasProps {
  result: SimulationResult;
}

export default function ResultsCanvas({ result }: ResultsCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cellSize, setCellSize] = useState(40);
  const containerRef = useRef<HTMLDivElement>(null);

  const rows = 10;
  const cols = 10;

  useEffect(() => {
    const updateCellSize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const availableSize = Math.floor((width - 20) / cols);
      setCellSize(Math.min(availableSize, 60));
    };

    updateCellSize();
    window.addEventListener("resize", updateCellSize);
    return () => window.removeEventListener("resize", updateCellSize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const padding = 2;
    const gridWidth = cellSize * cols + (cols + 1) * padding;
    const gridHeight = cellSize * rows + (rows + 1) * padding;

    canvas.width = gridWidth;
    canvas.height = gridHeight;

    // Draw background grid
    ctx.fillStyle = "#f5f5f5";
    ctx.fillRect(0, 0, gridWidth, gridHeight);

    // Draw grid cells
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * (cellSize + padding) + padding;
        const y = r * (cellSize + padding) + padding;

        // Default color
        let fillColor = "#ffffff";

        // Check if this is a wall
        const isWall =
          (r > 0 && r < rows - 1 && c > 0 && c < cols - 1 && Math.random() < 0.2);

        if (isWall) {
          fillColor = "#1f2937";
        }

        ctx.fillStyle = fillColor;
        ctx.fillRect(x, y, cellSize, cellSize);

        ctx.strokeStyle = "#e5e7eb";
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, cellSize, cellSize);
      }
    }

    // Draw final path as cyan line
    if (result.completePath.length > 1) {
      ctx.strokeStyle = "rgba(34, 211, 238, 0.8)";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.beginPath();
      const firstPath = result.completePath[0];
      ctx.moveTo(
        firstPath.col * (cellSize + padding) + padding + cellSize / 2,
        firstPath.row * (cellSize + padding) + padding + cellSize / 2
      );

      for (let i = 1; i < result.completePath.length; i++) {
        const pos = result.completePath[i];
        ctx.lineTo(
          pos.col * (cellSize + padding) + padding + cellSize / 2,
          pos.row * (cellSize + padding) + padding + cellSize / 2
        );
      }
      ctx.stroke();
    }

    // Draw start point
    const start = result.completePath[0];
    const startX = start.col * (cellSize + padding) + padding + cellSize / 2;
    const startY = start.row * (cellSize + padding) + padding + cellSize / 2;

    ctx.fillStyle = "#22c55e";
    ctx.beginPath();
    ctx.arc(startX, startY, cellSize / 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();

    if (cellSize > 20) {
      ctx.font = `${Math.floor(cellSize * 0.6)}px Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#ffffff";
      ctx.fillText("🚩", startX, startY);
    }

    // Draw treasures collected
    result.treasures.forEach((treasure, idx) => {
      const treasureX = treasure.col * (cellSize + padding) + padding + cellSize / 2;
      const treasureY = treasure.row * (cellSize + padding) + padding + cellSize / 2;

      ctx.fillStyle = "#fbbf24";
      ctx.beginPath();
      ctx.arc(treasureX, treasureY, cellSize / 2.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.stroke();

      if (cellSize > 20) {
        ctx.font = `${Math.floor(cellSize * 0.6)}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("💎", treasureX, treasureY);
      }
    });

    // Draw goal
    const goal = result.completePath[result.completePath.length - 1];
    const goalX = goal.col * (cellSize + padding) + padding + cellSize / 2;
    const goalY = goal.row * (cellSize + padding) + padding + cellSize / 2;

    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(goalX, goalY, cellSize / 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();

    if (cellSize > 20) {
      ctx.font = `${Math.floor(cellSize * 0.6)}px Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("🎯", goalX, goalY);
    }
  }, [cellSize, result]);

  return (
    <div ref={containerRef} className="w-full flex justify-center">
      <canvas
        ref={canvasRef}
        className="rounded-lg border-2 border-slate-400 shadow-lg"
        style={{ maxWidth: "100%", height: "auto" }}
      />
    </div>
  );
}
