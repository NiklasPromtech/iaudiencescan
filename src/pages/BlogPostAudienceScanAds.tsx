import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const BlogPostAudienceScanAds = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 pt-32 pb-16 max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/blog")}
          className="mb-8 p-0 h-auto text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Button>

        <article className="max-w-none">
          {/* Hero Section */}
          <div className="relative bg-gradient-to-br from-primary/10 via-secondary/5 to-background rounded-3xl p-12 mb-16 overflow-hidden">
            <div className="absolute inset-0 bg-[url('/lovable-uploads/1d9776f1-1e66-4502-8cbf-01934910df52.png')] bg-no-repeat bg-right bg-contain opacity-10"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
                  <img 
                    src="/lovable-uploads/1d9776f1-1e66-4502-8cbf-01934910df52.png" 
                    alt="AudienceScan Analytics" 
                    className="w-10 h-10"
                  />
                </div>
                <div>
                  <h1 className="text-h1 font-bold text-foreground mb-2">
                    AudienceScan Ads
                  </h1>
                  <div className="flex items-center gap-4 text-muted-foreground text-p2">
                    <span>Aug 6, 2025</span>
                    <span>•</span>
                    <span>6 min read</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-12">
            {/* Introduction */}
            <div className="prose prose-lg max-w-none">
              <p className="text-xl leading-relaxed text-foreground font-medium">
                Over the years, AudienceScan has grown out of real hands-on work in the Web3 space.
              </p>
              
              <p className="text-lg leading-relaxed text-muted-foreground">
                If you're curious about the full story, you can{' '}
                <a 
                  href="/blog/founders-letter" 
                  className="text-primary hover:underline font-medium transition-colors"
                >
                  read my personal letter here →
                </a>
              </p>
            </div>

            {/* Services Section */}
            <div className="bg-card rounded-2xl p-8 border">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Web3 Paid Marketing Services
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                If you're looking for help with paid marketing in Web3, this is where we can step in:
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-foreground font-medium">Paid X (Twitter)</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-foreground font-medium">Paid DV360 (Google Display)</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-foreground font-medium">Paid Telegram</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-foreground font-medium">Paid Reddit</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-secondary/5 rounded-xl">
                    <div className="w-2 h-2 bg-secondary rounded-full"></div>
                    <span className="text-foreground font-medium">DM campaigns on X</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-secondary/5 rounded-xl">
                    <div className="w-2 h-2 bg-secondary rounded-full"></div>
                    <span className="text-foreground font-medium">DM campaigns on Telegram</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-secondary/5 rounded-xl">
                    <div className="w-2 h-2 bg-secondary rounded-full"></div>
                    <span className="text-foreground font-medium">Tracking setup (Google Tag Manager)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 border border-primary/20">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-foreground mb-4">
                  Proven Results
                </h3>
                <p className="text-2xl font-semibold text-primary mb-6">
                  50%+ reduction in cost-per-on-site-action
                </p>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Time and time again, we've been able to cut cost-per-on-site-action by 50% or more for Web3 projects.
                </p>
              </div>
            </div>

            {/* CTA Section */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card rounded-2xl p-8 border text-center">
                <h4 className="text-xl font-bold text-foreground mb-4">
                  Explore Real Data
                </h4>
                <p className="text-muted-foreground mb-6">
                  See actual campaign performance and results from our Web3 clients.
                </p>
                <a 
                  href="/case-studies" 
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
                >
                  View Case Studies →
                </a>
              </div>
              
              <div className="bg-card rounded-2xl p-8 border text-center">
                <h4 className="text-xl font-bold text-foreground mb-4">
                  Run Campaigns Yourself
                </h4>
                <p className="text-muted-foreground mb-6">
                  Get access to our audience intelligence platform and tools.
                </p>
                <a 
                  href="/#cta" 
                  className="inline-flex items-center justify-center px-6 py-3 bg-secondary text-secondary-foreground rounded-xl font-medium hover:bg-secondary/90 transition-colors"
                >
                  Sign Up Now →
                </a>
              </div>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPostAudienceScanAds;