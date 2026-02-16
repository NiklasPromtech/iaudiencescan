import React, { useState, useEffect } from 'react';
import gaLogo from '@/assets/ga-logo.png';
import duneLogo from '@/assets/dune-logo.png';
import audiencescanIcon from '@/assets/audiencescan-icon-result.png';

type Phase = 'intro' | 'moving' | 'colliding' | 'flash' | 'reveal';

const narrativeLines: { phase: Phase; delay: number; text: string }[] = [
  { phase: 'intro', delay: 200, text: 'Two worlds. One vision.' },
  { phase: 'moving', delay: 400, text: 'Web2 analytics meets on-chain intelligence.' },
  { phase: 'colliding', delay: 0, text: 'Merging into something new.' },
  { phase: 'reveal', delay: 600, text: 'AudienceScan — the full picture.' },
];

const GADune: React.FC = () => {
  const [phase, setPhase] = useState<Phase>('intro');
  const [visibleNarrative, setVisibleNarrative] = useState<number>(-1);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase('moving'), 1800),
      setTimeout(() => setPhase('colliding'), 4200),
      setTimeout(() => setPhase('flash'), 5200),
      setTimeout(() => setPhase('reveal'), 5800),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const idx = narrativeLines.findIndex((n) => n.phase === phase);
    if (idx === -1) return;
    const timer = setTimeout(() => setVisibleNarrative(idx), narrativeLines[idx].delay);
    return () => clearTimeout(timer);
  }, [phase]);

  return (
    <div className="w-full h-screen bg-[#0a0a0a] flex items-center justify-center overflow-hidden relative">
      {/* Flash overlay */}
      <div
        className={`absolute inset-0 bg-white z-20 pointer-events-none transition-opacity duration-500 ${
          phase === 'flash' ? 'opacity-60' : 'opacity-0'
        }`}
      />

      {/* GA Logo */}
      <div
        className={`absolute transition-all ease-in-out ${
          phase === 'intro' ? 'opacity-100 duration-700' : ''
        } ${phase === 'moving' ? 'duration-[2000ms]' : ''} ${
          phase === 'colliding' || phase === 'flash' || phase === 'reveal'
            ? 'opacity-0 duration-500 scale-50'
            : ''
        }`}
        style={{
          transform:
            phase === 'intro'
              ? 'translateX(-200px) scale(1)'
              : phase === 'moving'
              ? 'translateX(-20px) scale(0.9)'
              : 'translateX(0) scale(0.5)',
        }}
      >
        <img src={gaLogo} alt="Google Analytics" className="w-40 h-40 object-contain" />
        <p className="text-white/50 text-center mt-4 font-mono text-xs tracking-widest uppercase">
          Google Analytics
        </p>
      </div>

      {/* Plus sign */}
      <div
        className={`absolute text-white/30 text-4xl font-light z-10 transition-opacity duration-500 ${
          phase === 'moving' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        +
      </div>

      {/* Dune Logo */}
      <div
        className={`absolute transition-all ease-in-out ${
          phase === 'intro' ? 'opacity-100 duration-700' : ''
        } ${phase === 'moving' ? 'duration-[2000ms]' : ''} ${
          phase === 'colliding' || phase === 'flash' || phase === 'reveal'
            ? 'opacity-0 duration-500 scale-50'
            : ''
        }`}
        style={{
          transform:
            phase === 'intro'
              ? 'translateX(200px) scale(1)'
              : phase === 'moving'
              ? 'translateX(20px) scale(0.9)'
              : 'translateX(0) scale(0.5)',
        }}
      >
        <img src={duneLogo} alt="Dune" className="w-40 h-40 object-contain rounded-full" />
        <p className="text-white/50 text-center mt-4 font-mono text-xs tracking-widest uppercase">
          Dune
        </p>
      </div>

      {/* Particle burst on collision */}
      {(phase === 'colliding' || phase === 'flash') && (
        <div className="absolute z-10">
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i / 12) * 360;
            const colors = ['bg-orange-400', 'bg-purple-700', 'bg-orange-500', 'bg-indigo-800'];
            return (
              <div
                key={i}
                className={`absolute w-2 h-2 rounded-full ${colors[i % colors.length]}`}
                style={{
                  animation: 'particle-burst 0.8s ease-out forwards',
                  transform: `rotate(${angle}deg) translateY(-10px)`,
                  ['--angle' as string]: `${angle}deg`,
                }}
              />
            );
          })}
        </div>
      )}

      {/* AudienceScan result */}
      <div
        className={`absolute z-10 flex flex-col items-center transition-all duration-700 ease-out ${
          phase === 'reveal' ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
        }`}
      >
        <div className="relative">
          <div
            className={`absolute -inset-8 rounded-full bg-orange-500/10 blur-2xl transition-opacity duration-1000 ${
              phase === 'reveal' ? 'opacity-100' : 'opacity-0'
            }`}
          />
          <img
            src={audiencescanIcon}
            alt="AudienceScan"
            className="w-48 h-48 object-contain relative z-10"
          />
        </div>
        <p className="text-white mt-6 font-mono text-sm tracking-[0.2em] uppercase relative z-10">
          AudienceScan
        </p>
        <p className="text-white/30 mt-2 font-mono text-[10px] tracking-widest uppercase">
          Web2 Meets Web3
        </p>
      </div>

      {/* Narrative text */}
      <div className="absolute bottom-24 z-30 w-full flex justify-center pointer-events-none">
        {narrativeLines.map((line, i) => (
          <p
            key={i}
            className={`absolute font-mono text-sm md:text-base tracking-widest text-white/70 text-center px-6 transition-all duration-[1200ms] ease-out ${
              visibleNarrative === i ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {line.text}
          </p>
        ))}
      </div>

      <style>{`
        @keyframes particle-burst {
          0% { opacity: 1; transform: rotate(var(--angle)) translateY(0); }
          100% { opacity: 0; transform: rotate(var(--angle)) translateY(-120px); }
        }
      `}</style>
    </div>
  );
};

export default GADune;
