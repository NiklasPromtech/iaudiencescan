import React, { useState, useEffect } from 'react';
import gaLogo from '@/assets/ga-logo.png';
import duneLogo from '@/assets/dune-logo.png';
import audiencescanIcon from '@/assets/audiencescan-icon-result.png';

type Phase =
  | 'black'
  | 'text1'
  | 'logos-in'
  | 'orbiting'
  | 'pull'
  | 'collide'
  | 'shockwave'
  | 'reveal'
  | 'tagline';

const GADune: React.FC = () => {
  const [phase, setPhase] = useState<Phase>('black');

  useEffect(() => {
    const schedule: [Phase, number][] = [
      ['text1', 600],
      ['logos-in', 2800],
      ['orbiting', 4200],
      ['pull', 6800],
      ['collide', 8200],
      ['shockwave', 8600],
      ['reveal', 9400],
      ['tagline', 10600],
    ];
    const timers = schedule.map(([p, ms]) => setTimeout(() => setPhase(p), ms));
    return () => timers.forEach(clearTimeout);
  }, []);

  const phaseIndex = (p: Phase) =>
    ['black', 'text1', 'logos-in', 'orbiting', 'pull', 'collide', 'shockwave', 'reveal', 'tagline'].indexOf(p);
  const current = phaseIndex(phase);
  const past = (p: Phase) => current >= phaseIndex(p);

  return (
    <div className="w-full h-screen bg-[#050505] flex items-center justify-center overflow-hidden relative select-none">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Opening narrative */}
      <div
        className={`absolute z-30 flex flex-col items-center gap-3 transition-all duration-[1500ms] ease-out ${
          phase === 'text1' ? 'opacity-100 translate-y-0' : phase === 'black' ? 'opacity-0 translate-y-8' : 'opacity-0 -translate-y-8'
        }`}
      >
        <p className="font-mono text-[10px] tracking-[0.5em] uppercase text-white/30">Introducing</p>
        <p className="font-mono text-lg md:text-2xl tracking-[0.3em] uppercase text-white/80">
          A New Standard
        </p>
        <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-orange-500/60 mt-1">
          Web2 Analytics × On-Chain Intelligence
        </p>
      </div>

      {/* Orbital ring */}
      <div
        className={`absolute w-[280px] h-[280px] md:w-[360px] md:h-[360px] rounded-full border transition-all ease-out ${
          past('orbiting') && !past('collide')
            ? 'opacity-30 scale-100 border-orange-500/40 duration-[2000ms]'
            : past('collide')
            ? 'opacity-0 scale-150 border-orange-500/0 duration-700'
            : 'opacity-0 scale-50 border-white/0 duration-500'
        }`}
        style={{
          animation: past('orbiting') && !past('collide') ? 'spin-slow 8s linear infinite' : undefined,
        }}
      />
      <div
        className={`absolute w-[320px] h-[320px] md:w-[420px] md:h-[420px] rounded-full border border-dashed transition-all ease-out ${
          past('orbiting') && !past('collide')
            ? 'opacity-15 scale-100 border-purple-500/30 duration-[2000ms]'
            : past('collide')
            ? 'opacity-0 scale-[2] border-purple-500/0 duration-700'
            : 'opacity-0 scale-50 border-white/0 duration-500'
        }`}
        style={{
          animation: past('orbiting') && !past('collide') ? 'spin-slow 12s linear infinite reverse' : undefined,
        }}
      />

      {/* Energy gathering particles */}
      {past('orbiting') && !past('shockwave') && (
        <div className="absolute z-10">
          {Array.from({ length: 20 }).map((_, i) => {
            const angle = (i / 20) * 360;
            const delay = i * 0.15;
            return (
              <div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-orange-400"
                style={{
                  animation: `gather-particle 2s ${delay}s ease-in infinite`,
                  transform: `rotate(${angle}deg)`,
                }}
              />
            );
          })}
        </div>
      )}

      {/* GA Logo */}
      <div
        className={`absolute z-10 flex flex-col items-center transition-all ease-out ${
          phase === 'logos-in'
            ? 'opacity-100 duration-[1200ms]'
            : phase === 'orbiting'
            ? 'duration-[2000ms]'
            : phase === 'pull'
            ? 'duration-[1400ms]'
            : past('collide')
            ? 'opacity-0 duration-300 scale-0'
            : 'opacity-0 duration-500'
        }`}
        style={{
          transform:
            phase === 'logos-in'
              ? 'translateX(-160px) scale(1)'
              : phase === 'orbiting'
              ? 'translateX(-120px) translateY(-20px) scale(0.85)'
              : phase === 'pull'
              ? 'translateX(-30px) scale(0.6)'
              : past('collide')
              ? 'translateX(0) scale(0)'
              : 'translateX(-300px) scale(0.8)',
        }}
      >
        <div className="relative">
          <div
            className={`absolute -inset-4 rounded-full bg-orange-500/20 blur-xl transition-opacity duration-1000 ${
              past('orbiting') ? 'opacity-100' : 'opacity-0'
            }`}
          />
          <img src={gaLogo} alt="Google Analytics" className="w-28 h-28 md:w-36 md:h-36 object-contain relative" />
        </div>
        <p className="text-white/40 mt-3 font-mono text-[9px] tracking-[0.4em] uppercase">
          Google Analytics
        </p>
      </div>

      {/* Dune Logo */}
      <div
        className={`absolute z-10 flex flex-col items-center transition-all ease-out ${
          phase === 'logos-in'
            ? 'opacity-100 duration-[1200ms]'
            : phase === 'orbiting'
            ? 'duration-[2000ms]'
            : phase === 'pull'
            ? 'duration-[1400ms]'
            : past('collide')
            ? 'opacity-0 duration-300 scale-0'
            : 'opacity-0 duration-500'
        }`}
        style={{
          transform:
            phase === 'logos-in'
              ? 'translateX(160px) scale(1)'
              : phase === 'orbiting'
              ? 'translateX(120px) translateY(20px) scale(0.85)'
              : phase === 'pull'
              ? 'translateX(30px) scale(0.6)'
              : past('collide')
              ? 'translateX(0) scale(0)'
              : 'translateX(300px) scale(0.8)',
        }}
      >
        <div className="relative">
          <div
            className={`absolute -inset-4 rounded-full bg-purple-600/20 blur-xl transition-opacity duration-1000 ${
              past('orbiting') ? 'opacity-100' : 'opacity-0'
            }`}
          />
          <img src={duneLogo} alt="Dune" className="w-28 h-28 md:w-36 md:h-36 object-contain rounded-full relative" />
        </div>
        <p className="text-white/40 mt-3 font-mono text-[9px] tracking-[0.4em] uppercase">
          Dune Analytics
        </p>
      </div>

      {/* Shockwave rings */}
      {past('shockwave') && (
        <>
          <div className="absolute w-4 h-4 rounded-full border-2 border-orange-400/80 z-20 animate-shockwave-1" />
          <div className="absolute w-4 h-4 rounded-full border border-orange-500/40 z-20 animate-shockwave-2" />
          <div className="absolute w-4 h-4 rounded-full border border-white/20 z-20 animate-shockwave-3" />
        </>
      )}

      {/* Flash */}
      <div
        className={`absolute inset-0 z-20 pointer-events-none transition-opacity ${
          phase === 'shockwave' ? 'opacity-80 duration-200 bg-white' : phase === 'reveal' ? 'opacity-0 duration-[800ms] bg-white' : 'opacity-0 duration-500'
        }`}
      />

      {/* Particle explosion */}
      {(phase === 'collide' || phase === 'shockwave') && (
        <div className="absolute z-15">
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i / 24) * 360;
            const colors = ['bg-orange-400', 'bg-orange-500', 'bg-purple-500', 'bg-purple-700', 'bg-white'];
            const size = i % 3 === 0 ? 'w-2 h-2' : 'w-1 h-1';
            return (
              <div
                key={i}
                className={`absolute rounded-full ${colors[i % colors.length]} ${size}`}
                style={{
                  animation: `particle-explode 1s ease-out forwards`,
                  animationDelay: `${(i % 5) * 0.03}s`,
                  ['--angle' as string]: `${angle}deg`,
                  ['--distance' as string]: `${80 + (i % 3) * 60}px`,
                }}
              />
            );
          })}
        </div>
      )}

      {/* AudienceScan reveal */}
      <div
        className={`absolute z-30 flex flex-col items-center transition-all ease-out ${
          past('reveal') ? 'opacity-100 scale-100 duration-[1200ms]' : 'opacity-0 scale-[0.3] duration-500'
        }`}
      >
        <div className="relative">
          {/* Pulsing glow behind icon */}
          <div
            className={`absolute -inset-12 rounded-full blur-3xl transition-opacity duration-[2000ms] ${
              past('reveal') ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              background: 'radial-gradient(circle, rgba(249,115,22,0.25) 0%, rgba(139,92,246,0.1) 50%, transparent 70%)',
              animation: past('tagline') ? 'pulse-glow 3s ease-in-out infinite' : undefined,
            }}
          />
          <img
            src={audiencescanIcon}
            alt="AudienceScan"
            className="w-40 h-40 md:w-56 md:h-56 object-contain relative z-10"
          />
        </div>
      </div>

      {/* Final tagline */}
      <div
        className={`absolute bottom-20 md:bottom-28 z-30 flex flex-col items-center gap-2 transition-all duration-[1500ms] ease-out ${
          past('tagline') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <p className="font-mono text-base md:text-xl tracking-[0.3em] uppercase text-white/90">
          AudienceScan
        </p>
        <div className="w-12 h-px bg-gradient-to-r from-transparent via-orange-500/60 to-transparent" />
        <p className="font-mono text-[10px] tracking-[0.5em] uppercase text-white/30">
          The Full Picture
        </p>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes gather-particle {
          0% { opacity: 0; transform: rotate(var(--angle, 0deg)) translateY(-180px); }
          60% { opacity: 1; }
          100% { opacity: 0; transform: rotate(var(--angle, 0deg)) translateY(0px); }
        }
        @keyframes particle-explode {
          0% { opacity: 1; transform: rotate(var(--angle)) translateY(0); }
          100% { opacity: 0; transform: rotate(var(--angle)) translateY(calc(-1 * var(--distance))); }
        }
        @keyframes shockwave {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(25); opacity: 0; }
        }
        .animate-shockwave-1 {
          animation: shockwave 0.8s ease-out forwards;
        }
        .animate-shockwave-2 {
          animation: shockwave 1s 0.1s ease-out forwards;
        }
        .animate-shockwave-3 {
          animation: shockwave 1.3s 0.2s ease-out forwards;
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
};

export default GADune;
