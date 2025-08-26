import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="w-full bg-background/80 backdrop-blur-md sticky top-0 z-50 mx-4 mt-4 rounded-lg">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/">
            <img 
              src="/lovable-uploads/27797bc6-b602-4720-b128-d641d006c8a7.png" 
              alt="AudienceScan" 
              className="h-6 hover:opacity-80 transition-opacity cursor-pointer"
            />
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <a href="/#features" className="text-p2 text-muted-foreground hover:text-foreground transition-smooth">
            How It Works
          </a>
          <a href="/#partnerships" className="text-p2 text-muted-foreground hover:text-foreground transition-smooth">
            Web3 Partnerships
          </a>
          <a href="/#faq" className="text-p2 text-muted-foreground hover:text-foreground transition-smooth">
            Support
          </a>
          <Link to="/case-studies" className="text-p2 text-muted-foreground hover:text-foreground transition-smooth">
            Case Studies
          </Link>
          <Link to="/pricing" className="text-p2 text-muted-foreground hover:text-foreground transition-smooth">
            Pricing
          </Link>
        </nav>

        <div className="flex items-center gap-2 md:gap-6">
          <div className="hidden md:flex items-center gap-6">
            <Link to="/case-studies" className="text-p2 text-muted-foreground hover:text-foreground transition-smooth">
              Case Studies
            </Link>
            <Link to="/pricing" className="text-p2 text-muted-foreground hover:text-foreground transition-smooth">
              Pricing
            </Link>
          </div>
          <a 
            href="https://app.audiencescan.io" 
            target="_blank" 
            rel="nofollow noopener noreferrer"
          >
            <Button className="bg-primary text-white hover:bg-primary/90 shadow-[0_0_10px_rgba(255,255,255,0.4)] text-sm md:text-base px-3 md:px-6">
              Launch app
            </Button>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;