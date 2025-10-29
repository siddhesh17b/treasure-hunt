import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface HowItWorksModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function HowItWorksModal({ open, onOpenChange }: HowItWorksModalProps) {
  const steps = [
    {
      number: 1,
      title: "🔍 Phase 1: Preprocessing",
      description:
        "The Greedy Best-First Search algorithm explores your maze to find the shortest paths between all important points (start, treasures, and goal). Watch for the exploration animation!",
      color: "from-blue-400 to-blue-600",
      emoji: "🔍",
    },
    {
      number: 2,
      title: "⚙️ Phase 2: Optimizing",
      description:
        "Using backtracking, the algorithm tests different orders to collect treasures. It's solving the 'Traveling Salesman Problem' - finding the shortest route that visits all treasures!",
      color: "from-orange-400 to-orange-600",
      emoji: "⚙️",
    },
    {
      number: 3,
      title: "▶️ Phase 3: Executing",
      description:
        "Watch the explorer (cyan circle) follow the optimal path! It visits treasures in the best order and reaches the goal using the shortest possible route.",
      color: "from-cyan-400 to-cyan-600",
      emoji: "▶️",
    },
    {
      number: 4,
      title: "✨ Phase 4: Complete",
      description:
        "Mission accomplished! Click 'Results' to see detailed metrics about the path length, treasures collected, and how many routes were tested to find the optimal one.",
      color: "from-green-400 to-green-600",
      emoji: "✨",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-slate-900 border-cyan-500/30 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white mb-2">
            🎯 Treasure Hunt: Algorithm Visualization
          </DialogTitle>
          <p className="text-gray-400 text-sm">
            This project demonstrates how Greedy Best-First Search and Backtracking algorithms work together to solve an optimization problem.
          </p>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          <div className="bg-slate-800/50 border border-cyan-500/20 rounded-lg p-4">
            <h3 className="text-cyan-300 font-semibold mb-2">🎮 What You'll See:</h3>
            <p className="text-gray-300 text-sm">
              The algorithm will automatically go through 4 phases to find the optimal path from 🚩 Start → 💎 Treasures → 🎯 Goal.
              You can pause, adjust speed, and watch each phase unfold in real-time!
            </p>
          </div>

          {steps.map((step) => (
            <div key={step.number} className="flex gap-4">
              <div className={`flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center font-bold text-white text-xl`}>
                {step.emoji}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}

          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
            <h3 className="text-yellow-300 font-semibold mb-2 flex items-center gap-2">
              💡 Did You Know?
            </h3>
            <p className="text-gray-300 text-sm">
              This is called the <strong>Traveling Salesman Problem (TSP)</strong> variant - one of the most famous problems in computer science! 
              Finding the absolute best route requires checking all possible orders, which grows exponentially with more treasures.
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <Button
            onClick={() => onOpenChange(false)}
            className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-8"
          >
            Let's Go! 🚀
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
