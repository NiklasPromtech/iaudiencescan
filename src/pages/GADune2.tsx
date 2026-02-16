import React, { useState, useEffect } from 'react';
import gaLogo from '@/assets/ga-logo-2.png';
import duneLogo from '@/assets/dune-logo-2.png';
import audiencescanIcon from '@/assets/audiencescan-icon-result.png';

type Phase = 'black' | 'slide' | 'fade' | 'reveal' | 'tagline';

const LOOP_DURATION = 11000;

const GADune2: React.FC = () => {
  const [phase, setPhase] = useState<Phase>('black');

  useEffect(() => {
    const schedule: [Phase, number][] = [
      ['slide', 300],
      ['fade', 3000],
      ['reveal', 4200],
      ['tagline', 5400],
    ];

    const runLoop = () => {
      setPhase('black');
      const timers = schedule.map(([p, ms]) => setTimeout(() => setPhase(p), ms));
      const loopTimer = setTimeout(runLoop, LOOP_DURATION);
      return [...timers, loopTimer];
    };

    let timers = runLoop();
    return () => timers.forEach(clearTimeout);
  }, []);

  const phases = ['black', 'slide', 'fade', 'reveal', 'tagline'];
  const current = phases.indexOf(phase);
  const past = (p: Phase) => current >= phases.indexOf(p);

  return (
    <div className="w-full h-screen bg-white flex items-center justify-center overflow-hidden relative select-none">

      {/* GA Logo - slides from far left to center, fades out in second half */}
      <div
        className="absolute z-10 flex flex-col items-center"
        style={{
          opacity: phase === 'black' ? 0 : past('fade') ? 0 : undefined,
          animation: phase === 'slide' ? 'slide-in-left 3200ms cubic-bezier(0.25, 0.1, 0.25, 1) forwards' : undefined,
          transform: phase === 'black' ? 'translateX(-45vw)' : undefined,
          transition: phase === 'black' ? 'opacity 400ms' : past('fade') ? 'opacity 600ms ease-out' : undefined,
        }}
      >
        <img src={gaLogo} alt="Google Analytics" className="w-28 h-28 md:w-36 md:h-36 object-contain" />
        <p className="text-black/40 mt-3 font-mono text-[9px] tracking-[0.4em] uppercase">
          Google Analytics
        </p>
      </div>

      {/* Dune Logo - slides from far right to center, fades out in second half */}
      <div
        className="absolute z-10 flex flex-col items-center"
        style={{
          opacity: phase === 'black' ? 0 : past('fade') ? 0 : undefined,
          animation: phase === 'slide' ? 'slide-in-right 3200ms cubic-bezier(0.25, 0.1, 0.25, 1) forwards' : undefined,
          transform: phase === 'black' ? 'translateX(45vw)' : undefined,
          transition: phase === 'black' ? 'opacity 400ms' : past('fade') ? 'opacity 600ms ease-out' : undefined,
        }}
      >
        <img src={duneLogo} alt="Dune" className="w-28 h-28 md:w-36 md:h-36 object-contain rounded-full" />
        <p className="text-black/40 mt-3 font-mono text-[9px] tracking-[0.4em] uppercase">
          Dune Analytics
        </p>
      </div>

      {/* AudienceScan reveal */}
      <div
        className="absolute z-30 flex flex-col items-center transition-all ease-out"
        style={{
          opacity: past('reveal') ? 1 : 0,
          transform: past('reveal') ? 'scale(1)' : 'scale(0.5)',
          transitionDuration: '1200ms',
        }}
      >
        <img
          src={audiencescanIcon}
          alt="AudienceScan"
          className="w-40 h-40 md:w-56 md:h-56 object-contain"
        />
      </div>

      {/* Tagline */}
      <div
        className="absolute bottom-20 md:bottom-28 z-30 flex flex-col items-center gap-2 transition-all ease-out"
        style={{
          opacity: past('tagline') ? 1 : 0,
          transform: past('tagline') ? 'translateY(0)' : 'translateY(20px)',
          transitionDuration: '1500ms',
        }}
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
        @keyframes slide-in-left {
          0% { transform: translateX(-45vw); opacity: 0; }
          15% { opacity: 1; }
          55% { opacity: 1; }
          85% { opacity: 0; }
          100% { transform: translateX(0px); opacity: 0; }
        }
        @keyframes slide-in-right {
          0% { transform: translateX(45vw); opacity: 0; }
          15% { opacity: 1; }
          55% { opacity: 1; }
          85% { opacity: 0; }
          100% { transform: translateX(0px); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default GADune2;
