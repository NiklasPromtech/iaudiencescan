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
      ['fade', 3500],
      ['reveal', 5500],
      ['tagline', 6700],
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

      {/* GA Logo - slides from far left to center */}
      <div
        className="absolute z-10 flex flex-col items-center"
        style={{
          transition: phase === 'slide' ? 'transform 3200ms cubic-bezier(0.25, 0.1, 0.25, 1), opacity 800ms ease-out'
            : phase === 'fade' ? 'opacity 1200ms ease-out'
            : 'opacity 400ms ease-out',
          opacity: phase === 'black' ? 0 : phase === 'slide' ? 1 : 0,
          transform:
            phase === 'black' ? 'translateX(-45vw)'
            : phase === 'slide' ? 'translateX(-60px)'
            : 'translateX(-60px)',
        }}
      >
        <img src={gaLogo} alt="Google Analytics" className="w-28 h-28 md:w-36 md:h-36 object-contain" />
        <p className="text-black/40 mt-3 font-mono text-[9px] tracking-[0.4em] uppercase">
          Google Analytics
        </p>
      </div>

      {/* Dune Logo - slides from far right to center */}
      <div
        className="absolute z-10 flex flex-col items-center"
        style={{
          transition: phase === 'slide' ? 'transform 3200ms cubic-bezier(0.25, 0.1, 0.25, 1), opacity 800ms ease-out'
            : phase === 'fade' ? 'opacity 1200ms ease-out'
            : 'opacity 400ms ease-out',
          opacity: phase === 'black' ? 0 : phase === 'slide' ? 1 : 0,
          transform:
            phase === 'black' ? 'translateX(45vw)'
            : phase === 'slide' ? 'translateX(60px)'
            : 'translateX(60px)',
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
    </div>
  );
};

export default GADune2;
