import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const Video = () => {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [isClicking, setIsClicking] = useState(false);

  const rotatingPhrases = [
    "to target the right communities",
    "for KOL research and discovery",
    "to find aligned launchpads",
    "to research tokens in-depth",
    "to evaluate tokens for listing",
  ];

  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(1);

  useEffect(() => {
    // Animate mouse to Launch app button after 2 seconds
    const timer = setTimeout(() => {
      setMousePosition({ x: 85, y: 8 }); // Position near Launch app button
    }, 2000);

    // Click animation
    const clickTimer = setTimeout(() => {
      setIsClicking(true);
      setTimeout(() => setIsClicking(false), 200);
    }, 3500);

    return () => {
      clearTimeout(timer);
      clearTimeout(clickTimer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Header */}
      <header className="w-full bg-background/80 backdrop-blur-md sticky top-0 z-40 mx-2 sm:mx-4 mt-4 rounded-lg">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/27797bc6-b602-4720-b128-d641d006c8a7.png" 
              alt="AudienceScan" 
              className="h-6" 
            />
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-6">
              <span className="text-muted-foreground">Case Studies</span>
              <span className="text-muted-foreground">Pricing</span>
            </div>
            <Button className="bg-primary text-white hover:bg-primary/90 shadow-[0_0_10px_rgba(255,255,255,0.4)]">
              Launch app
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-24 pb-16 text-center">
        {/* Badge */}
        <div className="inline-flex items-center px-6 py-3 rounded-full bg-primary/10 text-primary font-medium mb-12">
          Create your perfect web3 marketing strategy
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-bold mb-4">
          <span className="text-foreground">Use on-chain data</span>
        </h1>
        <h2 className="text-4xl md:text-6xl font-bold text-primary">
          {rotatingPhrases[currentPhraseIndex]}
        </h2>
      </section>

      {/* Animated Mouse Cursor */}
      <div 
        className={`fixed z-50 pointer-events-none transition-all duration-1000 ease-out ${isClicking ? 'scale-90' : 'scale-100'}`}
        style={{
          left: `${mousePosition.x}%`,
          top: `${mousePosition.y}%`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-lg"
        >
          <path 
            d="M5.5 3.21V20.79L10.5 15.79H18.5L5.5 3.21Z" 
            fill="white" 
            stroke="black" 
            strokeWidth="1.5"
          />
        </svg>
        {isClicking && (
          <div className="absolute -inset-4 rounded-full bg-primary/30 animate-ping" />
        )}
      </div>
    </div>
  );
};

export default Video;
