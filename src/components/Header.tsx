import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="w-full border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">A</span>
          </div>
          <span className="text-xl font-bold text-foreground">AudienceScan</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-muted-foreground hover:text-foreground transition-smooth">
            Features
          </a>
          <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-smooth">
            How it works
          </a>
          <a href="#faq" className="text-muted-foreground hover:text-foreground transition-smooth">
            FAQ
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <Button variant="ghost" className="hidden sm:flex">
            Dashboard
          </Button>
          <Button className="bg-gradient-primary hover:shadow-elegant transition-smooth">
            Run a Free Scan
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;