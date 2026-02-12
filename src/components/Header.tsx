import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import audienceScanIcon from "@/assets/audiencescan-icon-large.png";

const Header = () => {
  return (
    <header className="w-full sticky top-0 z-50 py-4 px-4">
      <nav className="max-w-5xl mx-auto bg-card/90 backdrop-blur-md border border-border rounded-full px-6 py-3 flex items-center justify-between shadow-sm">
        {/* Logo: icon + text wordmark */}
        <Link to="/" className="flex items-center gap-2 shrink-0 hover:opacity-80 transition-opacity">
          <img
            src={audienceScanIcon}
            alt="AudienceScan"
            className="h-6 w-6 rounded-md"
          />
          <span className="font-semibold text-foreground text-sm tracking-tight">AudienceScan</span>
        </Link>

        {/* Center nav links */}
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

        {/* Right: auth buttons */}
        <div className="flex items-center gap-3">
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
