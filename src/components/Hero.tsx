import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import heroImage from "@/assets/hero-image.jpg";

const Hero = () => {
  const [tokenAddress, setTokenAddress] = useState("");

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-subtle overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 opacity-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-primary/10 rounded-full animate-float blur-sm" />
      <div className="absolute bottom-40 right-32 w-24 h-24 bg-primary-glow/20 rounded-full animate-float blur-sm" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 right-20 w-16 h-16 bg-accent/30 rounded-full animate-float blur-sm" style={{ animationDelay: '2s' }} />
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Run Audience Analysis on Any Token in Seconds
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            AudienceScan turns blockchain data into real marketing signal. 
            <span className="text-primary font-semibold"> Free analysis for the first 100 projects.</span>
          </p>
          
          {/* CTA Form */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 max-w-2xl mx-auto">
            <Input
              placeholder="Enter token contract address..."
              value={tokenAddress}
              onChange={(e) => setTokenAddress(e.target.value)}
              className="flex-1 h-12 text-lg border-2 border-primary/20 focus:border-primary"
            />
            <Button 
              size="lg"
              className="bg-gradient-primary hover:shadow-glow animate-pulse-glow px-8 h-12 text-lg font-semibold min-w-[200px]"
            >
              Run a Free Scan
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground mb-12">
            No wallet connect needed • Results in under 30 seconds
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">437+</div>
              <div className="text-sm text-muted-foreground">Wallets Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">436+</div>
              <div className="text-sm text-muted-foreground">Transactions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">1298+</div>
              <div className="text-sm text-muted-foreground">Tokens Found</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">728M+</div>
              <div className="text-sm text-muted-foreground">Transaction Value</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;