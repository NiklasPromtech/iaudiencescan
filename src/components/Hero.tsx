import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import heroImage from "@/assets/hero-image.jpg";
import backdropTexture from "@/assets/backdrop-texture.jpg";

const Hero = () => {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  
  const rotatingPhrases = [
    "to find the most relevant communities for your outreach",
    "to find the most relevant communities for your KOL research",
    "to find the most relevant launchpads",
    "to enrich your token research",
    "to research tokens to add to your exchange"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentPhraseIndex((prev) => (prev + 1) % rotatingPhrases.length);
        setIsVisible(true);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Hero Background Pattern */}
      <div className="absolute inset-0 bg-cover bg-right bg-no-repeat opacity-30" style={{
      backgroundImage: `url(/lovable-uploads/bad95cd7-504e-4986-ad82-cdd251337e3b.png)`,
      backgroundSize: '70%'
    }} />
      
      {/* Backdrop Texture */}
      <div className="absolute top-4 right-4 w-8 h-8 opacity-5 bg-contain bg-no-repeat bg-center" style={{
      backgroundImage: `url(${backdropTexture})`
    }} />
            
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-h1 font-bold mb-6">
            <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Use on-chain data{" "}
            </span>
            <span 
              className={`bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent transition-opacity duration-300 ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {rotatingPhrases[currentPhraseIndex]}
            </span>
          </h1>
          
          <p className="text-p1 text-muted-foreground mb-8 max-w-3xl mx-auto">
            Analyze any token to discover the communities that actually transact with it. Target your outreach with precision—backed by real wallet behavior, not guesswork.
          </p>
          
          <div className="mb-12">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-4 text-lg">
              <Link to="/blog/guaranteed-results">Start Your Guaranteed Test</Link>
            </Button>
          </div>
          
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-h2 font-bold text-primary mb-2">847K+</div>
              <div className="text-p3 text-muted-foreground">Wallets Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-h2 font-bold text-primary mb-2">2.1M+</div>
              <div className="text-p3 text-muted-foreground">Transactions Processed</div>
            </div>
            <div className="text-center">
              <div className="text-h2 font-bold text-primary mb-2">125K+</div>
              <div className="text-p3 text-muted-foreground">Tokens Indexed</div>
            </div>
            <div className="text-center">
              <div className="text-h2 font-bold text-primary mb-2">$4.2B+</div>
              <div className="text-p3 text-muted-foreground">in On-Chain Activity</div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default Hero;