import React, { useState, useEffect } from 'react';
import gaLogo from '@/assets/ga-logo-2.png';
import duneLogo from '@/assets/dune-logo-2.png';
import audiencescanIcon from '@/assets/audiencescan-icon-result.png';

type Phase = 'black' | 'logos-in' | 'logos-center' | 'logos-fade' | 'reveal' | 'tagline';

const LOOP_DURATION = 12000;

const GADune2: React.FC = () => {
  const [phase, setPhase] = useState<Phase>('black');

  useEffect(() => {
    const schedule: [Phase, number][] = [
      ['logos-in', 500],
      ['logos-center', 2500],
      ['logos-fade', 5000],
      ['reveal', 6200],
      ['tagline', 7400],
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

  const phases = ['black', 'logos-in', 'logos-center', 'logos-fade', 'reveal', 'tagline'];
  const current = phases.indexOf(phase);
  const past = (p: Phase) => current >= phases.indexOf(p);

  return (
    <div className="w-full h-screen bg-white flex items-center justify-center overflow-hidden relative select-none">

      {/* GA Logo */}
      <div
        className="absolute z-10 flex flex-col items-center transition-all ease-out"
        style={{
          opacity:
            phase === 'black' ? 0
            : phase === 'logos-in' ? 1
            : phase === 'logos-center' ? 1
            : 0,
          transform:
            phase === 'black' ? 'translateX(-300px) scale(0.8)'
            : phase === 'logos-in' ? 'translateX(-160px) scale(1)'
            : phase === 'logos-center' ? 'translateX(-80px) scale(0.9)'
            : 'translateX(-80px) scale(0.9)',
          transitionDuration:
            phase === 'logos-in' ? '1200ms'
            : phase === 'logos-center' ? '2000ms'
            : phase === 'logos-fade' ? '1000ms'
            : '500ms',
        }}
      >
        <img src={gaLogo} alt="Google Analytics" className="w-28 h-28 md:w-36 md:h-36 object-contain" />
        <p className="text-black/40 mt-3 font-mono text-[9px] tracking-[0.4em] uppercase">
          Google Analytics
        </p>
      </div>

      {/* Dune Logo */}
      <div
        className="absolute z-10 flex flex-col items-center transition-all ease-out"
        style={{
          opacity:
            phase === 'black' ? 0
            : phase === 'logos-in' ? 1
            : phase === 'logos-center' ? 1
            : 0,
          transform:
            phase === 'black' ? 'translateX(300px) scale(0.8)'
            : phase === 'logos-in' ? 'translateX(160px) scale(1)'
            : phase === 'logos-center' ? 'translateX(80px) scale(0.9)'
            : 'translateX(80px) scale(0.9)',
          transitionDuration:
            phase === 'logos-in' ? '1200ms'
            : phase === 'logos-center' ? '2000ms'
            : phase === 'logos-fade' ? '1000ms'
            : '500ms',
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
