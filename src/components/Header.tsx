import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="w-full border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
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
            Platform
          </a>
          <a href="/#partnerships" className="text-p2 text-muted-foreground hover:text-foreground transition-smooth">
            Partnerships
          </a>
          <a href="/#faq" className="text-p2 text-muted-foreground hover:text-foreground transition-smooth">
            FAQ
          </a>
        </nav>

        <div className="flex items-center gap-6">
          <Link to="/case-studies" className="text-p2 text-muted-foreground hover:text-foreground transition-smooth">
            Case Studies
          </Link>
          <Link to="/pricing" className="text-p2 text-muted-foreground hover:text-foreground transition-smooth">
            Pricing
          </Link>
          <a 
            href="https://app.audiencescan.io" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <img 
              src="/lovable-uploads/277d9169-9274-487d-a725-e00ee2e8164e.png" 
              alt="Generate Audience" 
              className="w-[180px] h-auto cursor-pointer hover:opacity-90 transition-opacity"
            />
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;