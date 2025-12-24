import { Quote } from "lucide-react";

interface TestimonialBarProps {
  className?: string;
}

const TestimonialBar = ({ className = "" }: TestimonialBarProps) => {
  return (
    <div className={`py-12 px-6 ${className}`}>
      <div className="max-w-4xl mx-auto">
        <div className="relative bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 rounded-2xl p-8 md:p-10 border border-purple-500/20">
          {/* Quote icon */}
          <Quote className="absolute top-6 left-6 w-8 h-8 text-purple-500/30" />
          
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-[2px]">
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-2xl font-bold text-white">
                  NK
                </div>
              </div>
            </div>
            
            {/* Quote content */}
            <div className="flex-1 text-center md:text-left">
              <p className="text-lg md:text-xl text-white font-medium leading-relaxed mb-4">
                "AudienceScan cut our CPA by <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-bold">66%</span> on the first campaign. We now use it for every Web3 client pitch."
              </p>
              <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                <span className="text-white font-semibold">Nikolai Kuznetsov</span>
                <span className="hidden md:inline text-white/30">•</span>
                <span className="text-white/50 text-sm">Head of Growth, Luna PR</span>
              </div>
            </div>
            
            {/* Stat badge */}
            <div className="flex-shrink-0">
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-500/30 text-center">
                <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  84%
                </div>
                <div className="text-xs text-white/50 uppercase tracking-wider mt-1">
                  Lower CPA
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialBar;
