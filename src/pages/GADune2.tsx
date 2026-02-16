import React, { useState, useEffect } from 'react';
import gaLogo from '@/assets/ga-logo-2.png';
import duneLogo from '@/assets/dune-logo-2.png';
import audiencescanIcon from '@/assets/audiencescan-icon-result.png';

const LOOP_DURATION = 10000;

const GADune2: React.FC = () => {
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setCycle(c => c + 1), LOOP_DURATION);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-screen bg-white flex items-center justify-center overflow-hidden relative select-none">

      {/* GA Logo */}
      <div
        key={`ga-${cycle}`}
        className="absolute z-10 flex flex-col items-center animate-slide-from-left"
      >
        <img src={gaLogo} alt="Google Analytics" className="w-28 h-28 md:w-36 md:h-36 object-contain" />
        <p className="text-black/40 mt-3 font-mono text-[9px] tracking-[0.4em] uppercase">
          Google Analytics
        </p>
      </div>

      {/* Dune Logo */}
      <div
        key={`dune-${cycle}`}
        className="absolute z-10 flex flex-col items-center animate-slide-from-right"
      >
        <img src={duneLogo} alt="Dune" className="w-28 h-28 md:w-36 md:h-36 object-contain rounded-full" />
        <p className="text-black/40 mt-3 font-mono text-[9px] tracking-[0.4em] uppercase">
          Dune Analytics
        </p>
      </div>

      {/* AudienceScan reveal */}
      <div
        key={`as-${cycle}`}
        className="absolute z-30 flex flex-col items-center animate-reveal-logo"
      >
        <img
          src={audiencescanIcon}
          alt="AudienceScan"
          className="w-40 h-40 md:w-56 md:h-56 object-contain"
        />
      </div>

      {/* Tagline */}
      <div
        key={`tag-${cycle}`}
        className="absolute bottom-20 md:bottom-28 z-30 flex flex-col items-center gap-2 animate-reveal-tagline"
      >
        <p className="font-mono text-base md:text-xl tracking-[0.3em] uppercase text-black/90">
          AudienceScan
        </p>
        <div className="w-12 h-px bg-gradient-to-r from-transparent via-orange-500/60 to-transparent" />
        <p className="font-mono text-[10px] tracking-[0.5em] uppercase text-black/30">
          The Full Picture
        </p>
      </div>

      <style>{`
        @keyframes slide-from-left {
          0% { transform: translateX(-50vw); opacity: 0; }
          8% { opacity: 1; }
          100% { opacity: 0; transform: translateX(0px); }
        }
        @keyframes slide-from-right {
          0% { transform: translateX(50vw); opacity: 0; }
          8% { opacity: 1; }
          100% { opacity: 0; transform: translateX(0px); }
        }
        @keyframes reveal-logo {
          0%, 40% { opacity: 0; transform: scale(0.5); }
          60% { opacity: 1; transform: scale(1); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes reveal-tagline {
          0%, 55% { opacity: 0; transform: translateY(20px); }
          75% { opacity: 1; transform: translateY(0); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-from-left {
          animation: slide-from-left 4s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
        }
        .animate-slide-from-right {
          animation: slide-from-right 4s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
        }
        .animate-reveal-logo {
          animation: reveal-logo ${LOOP_DURATION}ms ease-out forwards;
        }
        .animate-reveal-tagline {
          animation: reveal-tagline ${LOOP_DURATION}ms ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default GADune2;
