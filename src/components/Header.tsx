import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="w-full bg-background/80 backdrop-blur-md sticky top-0 z-50 mx-2 sm:mx-4 mt-4 rounded-lg">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/">
            <img src="/lovable-uploads/27797bc6-b602-4720-b128-d641d006c8a7.png" alt="AudienceScan" className="h-6 hover:opacity-80 transition-opacity cursor-pointer" />
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://calendly.com/niklas-audiencescan/audiencescan-demo"
            target="_blank"
            rel="nofollow noopener noreferrer"
            className="hidden md:inline text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Book a Demo
          </a>
          <Link to="/auth">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm md:text-base px-3 sm:px-4 md:px-6">
              Get Started Free
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
