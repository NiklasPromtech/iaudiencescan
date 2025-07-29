import xLogo from "@/assets/x-logo.png";
import telegramLogo from "@/assets/telegram-logo.png";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="/lovable-uploads/7badbb3e-0d49-4228-97e2-42ebc92a02e0.png" 
                alt="AudienceScan Logo" 
                className="h-8 w-8"
              />
              <span className="text-h3 font-bold text-foreground">AudienceScan</span>
            </div>
            <p className="text-p3 text-muted-foreground leading-relaxed">
              Built by marketers & devs who've scaled Web3 projects. 
              Turn wallet data into marketing signal.
            </p>
          </div>
          
          {/* Product */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Product</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/proposed-features" className="text-muted-foreground hover:text-primary transition-smooth">Proposed Features</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-smooth">Pricing</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-smooth">API</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-smooth">Integrations</a></li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-smooth">About</a></li>
              <li><a href="/blog" className="text-muted-foreground hover:text-primary transition-smooth">Blog</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-smooth">Careers</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-smooth">Contact</a></li>
            </ul>
          </div>
          
          {/* Connect */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Connect</h3>
            <div className="flex gap-4">
              <a 
                href="https://www.linkedin.com/company/audiencescanio/" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-muted hover:bg-primary rounded-lg flex items-center justify-center transition-smooth group"
              >
                <img src="/lovable-uploads/1df0ea7a-b66d-48b6-9c07-db35b36a8798.png" alt="LinkedIn" className="w-5 h-5 group-hover:brightness-0 group-hover:invert transition-all" />
              </a>
              <a 
                href="https://t.me/audienceScan" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-muted hover:bg-primary rounded-lg flex items-center justify-center transition-smooth group"
              >
                <img src={telegramLogo} alt="Telegram" className="w-5 h-5 group-hover:brightness-0 group-hover:invert transition-all" />
              </a>
              <a 
                href="https://x.com/AudienceScanIO" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-muted hover:bg-primary rounded-lg flex items-center justify-center transition-smooth group"
              >
                <img src={xLogo} alt="X" className="w-5 h-5 group-hover:brightness-0 group-hover:invert transition-all" />
              </a>
            </div>
            
            <div className="mt-6">
              <h4 className="font-semibold text-foreground mb-2 text-sm">Useable for</h4>
              <div className="flex flex-wrap gap-2">
                <a href="https://ads.google.com/" target="_blank" rel="noopener noreferrer" className="px-2 py-1 bg-muted hover:bg-muted-foreground/20 rounded text-xs text-muted-foreground hover:text-foreground transition-smooth">Google Ads</a>
                <a href="https://marketingplatform.google.com/about/display-video-360/" target="_blank" rel="noopener noreferrer" className="px-2 py-1 bg-muted hover:bg-muted-foreground/20 rounded text-xs text-muted-foreground hover:text-foreground transition-smooth">DV360</a>
                <a href="https://ads.x.com/" target="_blank" rel="noopener noreferrer" className="px-2 py-1 bg-muted hover:bg-muted-foreground/20 rounded text-xs text-muted-foreground hover:text-foreground transition-smooth">X ads</a>
                <a href="https://ads.telegram.org/" target="_blank" rel="noopener noreferrer" className="px-2 py-1 bg-muted hover:bg-muted-foreground/20 rounded text-xs text-muted-foreground hover:text-foreground transition-smooth">Telegram ads</a>
                <a href="https://ads.reddit.com/" target="_blank" rel="noopener noreferrer" className="px-2 py-1 bg-muted hover:bg-muted-foreground/20 rounded text-xs text-muted-foreground hover:text-foreground transition-smooth">Reddit Ads</a>
                <a href="https://www.drippiai.link/onboarding?&inviterUid=rhsjratWHLVB6BYKS4qx8j6HO662&inviterName=AudienceScan" target="_blank" rel="noopener noreferrer" className="px-2 py-1 bg-muted hover:bg-muted-foreground/20 rounded text-xs text-muted-foreground hover:text-foreground transition-smooth">Drippi</a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2024 AudienceScan. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-smooth">Privacy</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-smooth">Terms</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-smooth">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;