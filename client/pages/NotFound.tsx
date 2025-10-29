import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-4">
          404
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">Page Not Found</h1>
        <p className="text-gray-400 mb-8">
          Oops! It looks like you've wandered off the treasure map. Let's get you back on track.
        </p>
        <Button
          onClick={() => navigate("/")}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-6 px-8 flex items-center justify-center gap-2 w-full sm:w-auto mx-auto"
        >
          <Home size={20} />
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
