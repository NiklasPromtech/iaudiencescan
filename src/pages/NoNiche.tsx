import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const NoNiche = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Back link */}
      <div className="fixed top-6 left-6 z-50">
        <Link 
          to="/wizard/v2" 
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Wizard</span>
        </Link>
      </div>

      {/* Main content */}
      <div className="flex flex-col items-center justify-center min-h-screen px-6">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-6">
          No audience is too niche
        </h1>
        
        <p className="text-white/70 text-lg md:text-xl text-center max-w-2xl mb-12">
          Need to know about meme coin fans? Or the competitors in a specific token category? Get the granularity of insight you need to understand every web3 audience under the sun.
        </p>

        {/* Animation placeholder area */}
        <div className="w-full max-w-4xl aspect-video rounded-2xl border border-white/10 bg-white/[0.02] flex items-center justify-center">
          <span className="text-white/40 text-lg">Animation workspace</span>
        </div>
      </div>
    </div>
  );
};

export default NoNiche;
