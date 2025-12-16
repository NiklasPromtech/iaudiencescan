import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
const Header = () => {
  return <header className="w-full bg-background/80 backdrop-blur-md sticky top-0 z-50 mx-2 sm:mx-4 mt-4 rounded-lg">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/">
            <img src="/lovable-uploads/27797bc6-b602-4720-b128-d641d006c8a7.png" alt="AudienceScan" className="h-6 hover:opacity-80 transition-opacity cursor-pointer" />
          </Link>
        </div>
        
        

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
            href="https://calendly.com/niklas-audiencescan/audiencescan-demo" 
            target="_blank" 
            rel="nofollow noopener noreferrer"
            onClick={() => {
              try {
                (window as any).gtag_report_conversion?.('https://calendly.com/niklas-audiencescan/audiencescan-demo');
              } catch (e) {
                // Conversion tracking failed, link will still work
              }
            }}
          >
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-[0_0_20px_rgba(168,85,247,0.5),0_0_40px_rgba(236,72,153,0.3)] text-sm md:text-base px-3 sm:px-4 md:px-6">
              Book a demo
            </Button>
          </a>
        </div>
      </div>
    </header>;
};
export default Header;