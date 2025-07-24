import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="w-full border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/27797bc6-b602-4720-b128-d641d006c8a7.png" 
            alt="AudienceScan" 
            className="h-6"
          />
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-p2 text-muted-foreground hover:text-foreground transition-smooth">
            Features
          </a>
          <a href="#how-it-works" className="text-p2 text-muted-foreground hover:text-foreground transition-smooth">
            How it works
          </a>
          <a href="#faq" className="text-p2 text-muted-foreground hover:text-foreground transition-smooth">
            FAQ
          </a>
        </nav>

        <div className="flex items-center">
            <img 
              src="/lovable-uploads/277d9169-9274-487d-a725-e00ee2e8164e.png" 
              alt="Generate Audience" 
              className="w-[228px] h-auto cursor-pointer hover:opacity-90 transition-opacity"
            />
        </div>
      </div>
    </header>
  );
};

export default Header;