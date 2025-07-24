import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-image.jpg";
import backdropTexture from "@/assets/backdrop-texture.jpg";

const Hero = () => {

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Hero Background Pattern */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(/lovable-uploads/bad95cd7-504e-4986-ad82-cdd251337e3b.png)` }}
      />
      
      {/* Backdrop Texture */}
      <div
        className="absolute top-0 right-0 w-16 h-16 opacity-5 bg-no-repeat"
        style={{ backgroundImage: `url(${backdropTexture})`, backgroundSize: '32px 32px' }}
      />
            
      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-primary/10 rounded-full animate-float blur-sm" />
      <div className="absolute bottom-40 right-32 w-24 h-24 bg-primary-glow/20 rounded-full animate-float blur-sm" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 right-20 w-16 h-16 bg-accent/30 rounded-full animate-float blur-sm" style={{ animationDelay: '2s' }} />
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-h1 font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Turn any token into a data-backed crypto audience
          </h1>
          
          <p className="text-p1 text-muted-foreground mb-8 max-w-3xl mx-auto">
            Create and target the perfect Web3 audience for Twitter, Telegram, and Google Ads — with precision
          </p>
          
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-h2 font-bold text-primary mb-2">847K+</div>
              <div className="text-p3 text-muted-foreground">Wallets Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-h2 font-bold text-primary mb-2">2.1M+</div>
              <div className="text-p3 text-muted-foreground">Transactions</div>
            </div>
            <div className="text-center">
              <div className="text-h2 font-bold text-primary mb-2">125K+</div>
              <div className="text-p3 text-muted-foreground">Tokens Found</div>
            </div>
            <div className="text-center">
              <div className="text-h2 font-bold text-primary mb-2">$4.2B+</div>
              <div className="text-p3 text-muted-foreground">Transaction Value</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;