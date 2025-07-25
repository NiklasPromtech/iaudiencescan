import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

const CTA = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const telegramRegex = /^@[\w]+$/;
    return emailRegex.test(email) || telegramRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error("Please enter your email or Telegram handle");
      return;
    }

    if (!validateEmail(email.trim())) {
      toast.error("Please enter a valid email or Telegram handle (e.g., @username)");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Success! We'll contact you soon with your free analysis.");
      setEmail("");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 max-w-2xl mx-auto">
            <Input
              type="text"
              placeholder="Enter your email or Telegram handle..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 h-12 text-p2 bg-primary-foreground/90 border-0 text-foreground placeholder:text-muted-foreground"
              disabled={isLoading}
            />
            <Button 
              type="submit"
              size="lg"
              disabled={isLoading}
              className="px-8 h-12 text-p2 font-semibold min-w-[200px] bg-white text-primary hover:bg-white/90 disabled:opacity-50"
            >
              {isLoading ? "Processing..." : "Get Free Analysis"}
            </Button>
          </form>
          
          <p className="text-p3 text-primary-foreground/60 mt-8">
            No spam, ever. Unsubscribe with one click.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;