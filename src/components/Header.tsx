import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Search, ChevronDown } from "lucide-react";

const Header = () => {
  return (
    <header className="w-full sticky top-0 z-50 py-4 px-4">
      <nav className="max-w-5xl mx-auto bg-card/90 backdrop-blur-md border border-border rounded-full px-6 py-3 flex items-center justify-between shadow-sm">
        {/* Logo pill */}
        <Link to="/" className="flex items-center gap-2 shrink-0 bg-foreground rounded-full px-3 py-1.5 hover:bg-foreground/90 transition-colors">
          <img
            src="/lovable-uploads/27797bc6-b602-4720-b128-d641d006c8a7.png"
            alt="AudienceScan"
            className="h-4 brightness-0 invert"
          />
        </Link>

        {/* Center nav links with dropdown arrows */}
        <div className="hidden md:flex items-center gap-6">
          <a href="/#how-it-works" className="font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
            How It Works
            <ChevronDown className="w-3 h-3" />
          </a>
          <a href="/blog" className="font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
            Resources
            <ChevronDown className="w-3 h-3" />
          </a>
          <a
            href="https://calendly.com/niklas-audiencescan/audiencescan-demo"
            target="_blank"
            rel="nofollow noopener noreferrer"
            className="font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
          >
            Demo
          </a>
        </div>

        {/* Right: search + auth buttons */}
        <div className="flex items-center gap-3">
          <button className="hidden sm:flex w-8 h-8 items-center justify-center rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
            <Search className="w-4 h-4" />
          </button>
          <Link to="/auth">
            <span className="hidden sm:inline font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              Log In
            </span>
          </Link>
          <Link to="/auth">
            <Button size="sm" className="font-mono text-xs uppercase tracking-wider rounded-full px-5">
              Sign Up
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
