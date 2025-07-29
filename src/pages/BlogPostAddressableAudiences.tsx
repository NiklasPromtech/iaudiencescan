import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowLeft, Target, TrendingDown, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BlogPostAddressableAudiences = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-background"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/blog')}
            className="mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Blog
          </Button>
          
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 text-sm">Strategy</Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Turning Blockchain Data Into{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
                Addressable Audiences
              </span>{" "}
              with AudienceScan
            </h1>
            
            <div className="flex items-center justify-center gap-6 text-muted-foreground mb-8">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Jan 28, 2025
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                7 min read
              </div>
            </div>
            
            {/* Key Metrics Highlight */}
            <div className="grid md:grid-cols-2 gap-6 mt-12 max-w-2xl mx-auto">
              <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 p-6 rounded-2xl border border-green-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingDown className="w-6 h-6 text-green-500" />
                  <span className="text-green-500 font-semibold">Cost Reduction</span>
                </div>
                <div className="text-3xl font-bold text-foreground">50%+</div>
                <p className="text-sm text-muted-foreground">Lower cost-per-engagement</p>
              </div>
              
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 rounded-2xl border border-primary/20">
                <div className="flex items-center gap-3 mb-2">
                  <Target className="w-6 h-6 text-primary" />
                  <span className="text-primary font-semibold">Break-even Point</span>
                </div>
                <div className="text-3xl font-bold text-foreground">$400</div>
                <p className="text-sm text-muted-foreground">Monthly ad spend threshold</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary/20 to-primary/10 p-8">
              <img 
                src="/lovable-uploads/2bb532a9-c9e2-4310-a6f0-b36ffd0d6c19.png" 
                alt="Blockchain data visualization showing addressable audiences"
                className="w-full max-h-96 object-contain mx-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-lg prose-slate dark:prose-invert">
            
            {/* Problem Section */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                <Zap className="w-8 h-8 text-primary" />
                The Problem: Guessing in the Dark
              </h2>
              <div className="bg-gradient-to-r from-destructive/10 to-destructive/5 p-6 rounded-2xl border-l-4 border-destructive mb-6">
                <p className="text-lg text-foreground leading-relaxed mb-0">
                  Running ads for crypto projects has always felt like throwing darts in a blackout. You can target broad interests, keywords, or communities, but you never really know if you're in front of communities that actually transact with tokens like yours.
                </p>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                It leads to wasted spend, irrelevant impressions, and campaigns that don't convert. In short, your addressable market is huge, but your addressable audience is a mystery.
              </p>
            </div>

            {/* Solution Section */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Enter AudienceScan: From Chain Data to Addressable Audiences
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                AudienceScan changes this by flipping the targeting process on its head. Instead of guessing where your audience might be, you can:
              </p>
              
              <div className="grid gap-6 mb-8">
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-2xl">
                  <h3 className="text-xl font-semibold text-foreground mb-3">1. Add a token</h3>
                  <p className="text-muted-foreground">Any of the larger EVM chains.</p>
                </div>
                
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-2xl">
                  <h3 className="text-xl font-semibold text-foreground mb-3">2. Scan wallets that transact with it</h3>
                  <p className="text-muted-foreground">Instantly see which wallets are active with that token.</p>
                </div>
                
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-2xl">
                  <h3 className="text-xl font-semibold text-foreground mb-3">3. Discover overlap</h3>
                  <p className="text-muted-foreground">Find what other tokens these wallets are trading.</p>
                </div>
                
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-2xl">
                  <h3 className="text-xl font-semibold text-foreground mb-3">4. Build segments</h3>
                  <p className="text-muted-foreground">Use these insights to create precise, addressable community audiences for your Twitter, Telegram, DV360, or programmatic campaigns.</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500/10 to-green-600/5 p-6 rounded-2xl border border-green-500/20">
                <p className="text-lg text-foreground font-medium mb-0">
                  No more "crypto enthusiasts" as your only targeting option. You now know exactly which communities your potential buyers are a part of and where to reach them.
                </p>
              </div>
            </div>

            {/* Why Addressable Matters Section */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Why "Addressable" Matters
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                An audience is only valuable if you can reach it. A market report telling you that 100,000 wallets hold a token is useless if you can't turn that into ad targeting data.
              </p>

              {/* ROI Highlight Box */}
              <div className="bg-gradient-to-br from-green-500/20 via-green-500/10 to-green-600/5 p-8 rounded-3xl border-2 border-green-500/30 mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingDown className="w-8 h-8 text-green-500" />
                    <span className="text-green-500 font-bold text-xl">Proven Results</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground mb-4">
                    We've repeatedly seen users reduce their{" "}
                    <span className="text-green-500">cost-per-engagement by 50%</span>
                  </p>
                  <div className="bg-white/10 p-4 rounded-xl">
                    <p className="text-lg font-semibold text-foreground mb-2">
                      💡 Quick Math: If you're spending <span className="text-primary font-bold">$400/month or more</span> on ads, AudienceScan more than pays for itself.
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                We bridge the gap between raw blockchain data and truly addressable audiences, letting you:
              </p>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                  <span className="text-lg text-muted-foreground">Reach communities based on real on-chain behavior.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                  <span className="text-lg text-muted-foreground">Cut wasted spend and lower engagement costs dramatically.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                  <span className="text-lg text-muted-foreground">Scale campaigns with data-driven confidence instead of assumptions.</span>
                </li>
              </ul>
            </div>

            {/* Future Section */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-foreground mb-6">
                The Future of Web3 Marketing is Addressable
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                As Web3 grows, ad platforms will get smarter, but they'll always rely on the data you feed them. AudienceScan is your shortcut to cutting out the noise and finding the wallets that matter most.
              </p>
              
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-8 rounded-2xl border border-primary/20">
                <p className="text-xl font-bold text-foreground text-center mb-0">
                  The days of wasting ad spend on "crypto-curious" audiences are ending. Your future customers are already on-chain – now, with AudienceScan, they're finally addressable.
                </p>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center py-12">
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-8 rounded-3xl">
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Ready to make your audiences addressable?
                </h3>
                <p className="text-lg text-muted-foreground mb-6">
                  Stop guessing where your audience is. Start reaching them where they actually are.
                </p>
                <Button size="lg" className="text-lg px-8" asChild>
                  <a href="https://app.audiencescan.io/signup" target="_blank" rel="noopener noreferrer noindex">
                    Try AudienceScan Now
                  </a>
                </Button>
              </div>
            </div>

          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogPostAddressableAudiences;