import { Twitter, Github, MessageCircle } from "lucide-react";

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
              <li><a href="#features" className="text-muted-foreground hover:text-primary transition-smooth">Features</a></li>
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
                href="#" 
                className="w-10 h-10 bg-muted hover:bg-primary rounded-lg flex items-center justify-center transition-smooth group"
              >
                <Twitter className="w-5 h-5 text-muted-foreground group-hover:text-primary-foreground" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-muted hover:bg-primary rounded-lg flex items-center justify-center transition-smooth group"
              >
                <MessageCircle className="w-5 h-5 text-muted-foreground group-hover:text-primary-foreground" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-muted hover:bg-primary rounded-lg flex items-center justify-center transition-smooth group"
              >
                <Github className="w-5 h-5 text-muted-foreground group-hover:text-primary-foreground" />
              </a>
            </div>
            
            <div className="mt-6">
              <h4 className="font-semibold text-foreground mb-2 text-sm">Integrates with</h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-muted rounded text-xs text-muted-foreground">Google Ads</span>
                <span className="px-2 py-1 bg-muted rounded text-xs text-muted-foreground">Drippi.ai</span>
                <span className="px-2 py-1 bg-muted rounded text-xs text-muted-foreground">Mailchimp</span>
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