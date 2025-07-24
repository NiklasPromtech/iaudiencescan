import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-image.jpg";
import backdropTexture from "@/assets/backdrop-texture.jpg";

const Hero = () => {

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-subtle overflow-hidden">
      {/* Backdrop Texture */}
      <div 
        className="absolute inset-0 opacity-5 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backdropTexture})` }}
      />
      
      {/* Hero Background Image */}
      <div 
        className="absolute inset-0 opacity-5 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
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
          
          {/* CTA Button */}
          <div className="flex justify-center mb-8">
            <Button 
              size="lg"
              className="bg-primary text-white hover:bg-primary/90 px-12 h-14 text-p1 font-semibold"
            >
              Generate Audience
            </Button>
          </div>
          
          
          <div className="absolute bottom-8 right-8">
            <a href="#" className="text-p3 text-muted-foreground hover:text-primary transition-smooth flex items-center gap-2">
              Sample of how to make a scan
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
          
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