import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Lightbulb, Map, Zap, Trophy, Code } from "lucide-react";

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
          className="text-slate-600 hover:text-slate-800 hover:bg-purple-100"
        >
          <ArrowLeft size={24} />
        </Button>
        <h1 className="text-3xl font-bold text-slate-800">About This Project</h1>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* What Is This? */}
        <section className="bg-white/80 backdrop-blur-xl border-2 border-purple-200 rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-4">
            <Lightbulb className="text-yellow-500" size={32} />
            <h2 className="text-2xl font-bold text-slate-800">What Is This?</h2>
          </div>
          <p className="text-slate-700 leading-relaxed mb-4">
            <strong className="text-purple-600">Treasure Hunt</strong> is an interactive educational tool that helps you understand how computers find the best path through a maze. 
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            Imagine you're planning a road trip to visit multiple cities before reaching your final destination. What's the shortest route? 
            This is exactly what this program does - but instead of cities, you're collecting treasures! 💎
          </p>
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mt-4">
            <p className="text-blue-700 text-sm">
              <strong>💡 Real-World Example:</strong> This same problem is solved by delivery companies (like Amazon) to optimize delivery routes, 
              GPS navigation systems to find the fastest route through multiple stops, and even video game AI to plan character movements!
            </p>
          </div>
        </section>

        {/* How Does It Work? */}
        <section className="bg-white/80 backdrop-blur-xl border-2 border-purple-200 rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Code className="text-purple-600" size={32} />
            <h2 className="text-2xl font-bold text-slate-800">How Does It Work?</h2>
          </div>

          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                1
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">🎨 You Design the Map</h3>
                <p className="text-slate-700 text-sm leading-relaxed">
                  Using the <strong className="text-green-600">Editor</strong>, you create a grid-based map by placing:
                </p>
                <ul className="list-disc list-inside text-slate-700 text-sm mt-2 ml-4 space-y-1">
                  <li><strong className="text-green-600">🚩 Start Point:</strong> Where the journey begins</li>
                  <li><strong className="text-slate-600">⬛ Walls:</strong> Obstacles that can't be crossed</li>
                  <li><strong className="text-yellow-600">💎 Treasures:</strong> Items to collect (1-8 treasures)</li>
                  <li><strong className="text-red-600">🎯 Goal:</strong> The final destination</li>
                </ul>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                2
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">🔍 Phase 1: Preprocessing</h3>
                <p className="text-slate-700 text-sm leading-relaxed mb-2">
                  The computer uses the <strong className="text-blue-600">Greedy Best-First Search Algorithm</strong> to explore your map.
                </p>
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3 mt-2">
                  <p className="text-blue-700 text-sm">
                    <strong>What's Greedy Best-First Search?</strong> It's a smart searching algorithm that finds the shortest path between two points. 
                    Think of it like using GPS - it doesn't explore every single street, it intelligently focuses on promising routes.
                  </p>
                  <p className="text-blue-700 text-sm mt-2">
                    <strong>What happens:</strong> The algorithm finds the shortest distance from Start to each Treasure, 
                    between all Treasures, and from each Treasure to the Goal. It creates a "distance table" for later use.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                3
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">⚙️ Phase 2: Optimizing</h3>
                <p className="text-slate-700 text-sm leading-relaxed mb-2">
                  Now the computer uses <strong className="text-orange-600">Backtracking</strong> to find the best order to collect treasures.
                </p>
                <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-3 mt-2">
                  <p className="text-orange-700 text-sm">
                    <strong>The Problem:</strong> With 3 treasures, there are 6 possible orders (3×2×1). With 5 treasures, there are 120 orders! 
                    This is called the <strong>"Traveling Salesman Problem"</strong> - one of the most famous puzzles in computer science.
                  </p>
                  <p className="text-orange-700 text-sm mt-2">
                    <strong>What happens:</strong> The algorithm tries different orders like:<br/>
                    • Start → Treasure A → Treasure B → Treasure C → Goal<br/>
                    • Start → Treasure B → Treasure A → Treasure C → Goal<br/>
                    ...and finds which order has the shortest total distance!
                  </p>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                4
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">▶️ Phase 3: Executing</h3>
                <p className="text-slate-700 text-sm leading-relaxed">
                  Watch the <strong className="text-purple-600">explorer</strong> (glowing circle) follow the optimal path! 
                  It visits treasures in the perfect order and takes the shortest possible route to the goal.
                </p>
                <p className="text-slate-600 text-sm mt-2 italic">
                  You can pause, speed up, or slow down the animation to study how it moves through the maze.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                5
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">✨ Phase 4: Complete & Results</h3>
                <p className="text-slate-700 text-sm leading-relaxed">
                  When finished, you can view detailed statistics: total distance traveled, number of routes tested, 
                  time taken, and more! This helps you understand how efficient the algorithm was.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Is This Important? */}
        <section className="bg-white/80 backdrop-blur-xl border-2 border-purple-200 rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="text-yellow-500" size={32} />
            <h2 className="text-2xl font-bold text-slate-800">Why Is This Important?</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
              <h3 className="text-purple-700 font-semibold mb-2">📚 Learn Algorithms</h3>
              <p className="text-slate-700 text-sm">
                See how Greedy Best-First Search and Backtracking work visually instead of just reading about them in textbooks.
              </p>
            </div>
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
              <h3 className="text-blue-700 font-semibold mb-2">🎮 Interactive Learning</h3>
              <p className="text-slate-700 text-sm">
                Design your own challenges, adjust complexity, and experiment with different maze layouts.
              </p>
            </div>
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
              <h3 className="text-green-700 font-semibold mb-2">🌍 Real-World Skills</h3>
              <p className="text-slate-700 text-sm">
                These algorithms power GPS navigation, game AI, robotics, delivery optimization, and more!
              </p>
            </div>
            <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4">
              <h3 className="text-orange-700 font-semibold mb-2">🧠 Problem Solving</h3>
              <p className="text-slate-700 text-sm">
                Understand how computers solve optimization problems that would take humans days to calculate.
              </p>
            </div>
          </div>
        </section>

        {/* Technical Details */}
        <section className="bg-white/80 backdrop-blur-xl border-2 border-purple-200 rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="text-purple-600" size={32} />
            <h2 className="text-2xl font-bold text-slate-800">Technical Details</h2>
          </div>
          <div className="space-y-3">
            <div>
              <h3 className="text-purple-700 font-semibold mb-1">Greedy Best-First Search Algorithm</h3>
              <p className="text-slate-700 text-sm">
                Uses a heuristic (Manhattan Distance) to efficiently find shortest paths. Time complexity: O(b^d) where b is branching factor and d is depth.
              </p>
            </div>
            <div>
              <h3 className="text-orange-700 font-semibold mb-1">Backtracking for TSP</h3>
              <p className="text-slate-700 text-sm">
                Explores all permutations of treasure visit orders. With n treasures, it checks n! (factorial) combinations. 
                This is why we limit to 8 treasures (8! = 40,320 combinations).
              </p>
            </div>
            <div>
              <h3 className="text-pink-700 font-semibold mb-1">Built With</h3>
              <p className="text-slate-700 text-sm">
                React + TypeScript for the UI, Canvas API for animations, Vite for fast development. 
                Fully client-side - all computation happens in your browser!
              </p>
            </div>
          </div>
        </section>

        {/* Quick Start Guide */}
        <section className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-4">
            <Map className="text-green-600" size={32} />
            <h2 className="text-2xl font-bold text-slate-800">Quick Start Guide</h2>
          </div>
          <ol className="space-y-3 text-slate-700">
            <li className="flex gap-3">
              <span className="font-bold text-green-600 flex-shrink-0">Step 1:</span>
              <span>Click <strong>"Start Simulation"</strong> on the home page</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-green-600 flex-shrink-0">Step 2:</span>
              <span>Try the <strong>"Random Map"</strong> button to generate a starter maze</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-green-600 flex-shrink-0">Step 3:</span>
              <span>Click grid cells to customize: add/remove walls, move treasures, etc.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-green-600 flex-shrink-0">Step 4:</span>
              <span>Click <strong>"Run Algorithm"</strong> and watch the magic happen! ✨</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-green-600 flex-shrink-0">Step 5:</span>
              <span>Use pause/speed controls to study the algorithm at your own pace</span>
            </li>
          </ol>
        </section>

        {/* Call to Action */}
        <div className="text-center py-8">
          <Button
            size="lg"
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-lg px-8 py-6 rounded-lg font-semibold shadow-xl hover:shadow-2xl transition-all"
            onClick={() => navigate("/editor")}
          >
            Start Creating Your Map! 🚀
          </Button>
          <p className="text-slate-600 text-sm mt-4">
            No sign-up required • Works offline • 100% free
          </p>
        </div>
      </div>
    </div>
  );
}
