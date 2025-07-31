import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-image.jpg";
import backdropTexture from "@/assets/backdrop-texture.jpg";

const Hero = () => {

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Hero Background Pattern */}
      <div 
        className="absolute inset-0 bg-cover bg-right bg-no-repeat opacity-30"
        style={{ 
          backgroundImage: `url(/lovable-uploads/bad95cd7-504e-4986-ad82-cdd251337e3b.png)`,
          backgroundSize: '70%'
        }}
      />
      
      {/* Backdrop Texture */}
      <div
        className="absolute top-4 right-4 w-8 h-8 opacity-5 bg-contain bg-no-repeat bg-center"
        style={{ backgroundImage: `url(${backdropTexture})` }}
      />
            
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-h1 font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent mb-6">
            Data-Backed Crypto Audiences. Guaranteed Results.
          </h1>
          
          <p className="text-p1 text-muted-foreground mb-8 max-w-3xl mx-auto">
            AudienceScan turns any token into a targetable audience for X, Telegram, Google, and Reddit ads – cutting costs by 50% or more. If it doesn't, you get your money back.
          </p>
          
          <div className="mb-12">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-4 text-lg">
              Start Your Guaranteed Test
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
    </section>
  );
};

export default Hero;