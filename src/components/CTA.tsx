import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const CTA = () => {
  const [email, setEmail] = useState("");

  return (
    <section className="py-24 bg-gradient-primary relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 border-2 border-primary-foreground rounded-full animate-float" />
        <div className="absolute bottom-20 right-32 w-24 h-24 border border-primary-foreground rounded-full animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-20 w-16 h-16 border border-primary-foreground rounded-full animate-float" style={{ animationDelay: '2s' }} />
      </div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-h2 font-bold text-primary-foreground mb-6">
            Ready to Understand Your Audience?
          </h2>
          
          <p className="text-p1 text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join the first 100 projects to get free audience analysis. 
            Turn your blockchain data into marketing gold.
          </p>
          
          {/* Main CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 max-w-2xl mx-auto">
            <Input
              placeholder="Enter your email or Telegram handle..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 h-12 text-p2 bg-primary-foreground/90 border-0 text-foreground placeholder:text-muted-foreground"
            />
            <Button 
              size="lg"
              className="px-8 h-12 text-p2 font-semibold min-w-[200px] bg-white text-primary hover:bg-white/90"
            >
              Get Free Analysis
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg"
              className="px-8 h-12 text-p2 font-semibold bg-white text-primary hover:bg-white/90"
            >
              Run Token Scan Now
            </Button>
            <Button 
              size="lg"
              className="px-8 h-12 text-p2 font-semibold bg-white text-primary hover:bg-white/90"
            >
              View Sample Report
            </Button>
          </div>
          
          <p className="text-p3 text-primary-foreground/60 mt-8">
            No spam, ever. Unsubscribe with one click.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;