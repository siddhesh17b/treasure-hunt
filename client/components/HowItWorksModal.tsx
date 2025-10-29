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
      title: "Design Your Map",
      description:
        "Create a maze by placing walls, treasures, a start point, and a goal on an interactive grid. Use the paint-like tools to design your challenge.",
      color: "from-yellow-400 to-orange-400",
    },
    {
      number: 2,
      title: "A* Exploration",
      description:
        "Watch as the algorithm explores the maze with a blue wavefront, finding the shortest paths between all important points.",
      color: "from-blue-400 to-blue-600",
    },
    {
      number: 3,
      title: "Optimize Route",
      description:
        "The algorithm tests different treasure collection orders with orange routes, finding the optimal sequence to visit all treasures.",
      color: "from-orange-400 to-orange-600",
    },
    {
      number: 4,
      title: "Execute & Celebrate",
      description:
        "Follow the explorer as it moves along the perfect cyan path, collecting treasures and reaching the goal with celebration effects!",
      color: "from-cyan-400 to-cyan-600",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-slate-900 border-cyan-500/30">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white">How It Works</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {steps.map((step) => (
            <div key={step.number} className="flex gap-4">
              <div className={`flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center font-bold text-white text-lg`}>
                {step.number}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-gray-300">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <Button
            onClick={() => onOpenChange(false)}
            className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold"
          >
            Got It!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
