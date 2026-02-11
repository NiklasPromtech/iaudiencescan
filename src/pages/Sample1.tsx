import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Target, Database, Zap, TrendingUp, Shield, BarChart3, Users, Rocket, Building2 } from "lucide-react";

const Sample1 = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-accent/5 to-primary/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(127,64,255,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(127,64,255,0.05),transparent_50%)]" />
        
        <div className="container mx-auto px-4 py-32 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h1 className="text-6xl lg:text-7xl font-bold leading-tight">
                Reach real crypto users.{" "}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Stop wasting budget.
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                AudienceScan shows you exactly which tokens your holders overlap with, so you can target the right communities on X, Reddit, Telegram, DV360, and more.
              </p>
              
              <div className="flex flex-col gap-4">
                <Button size="lg" className="text-lg px-8 py-6 w-fit bg-gradient-primary hover:opacity-90 text-white shadow-glow">
                  Start free trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 w-fit">
                  See sample analysis
                </Button>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Trusted by exchanges, AI projects, DeFi protocols and token teams globally.
              </p>
            </div>
            
            <div className="relative h-[600px] hidden lg:block">
              <div className="absolute inset-0 bg-gradient-primary opacity-20 blur-3xl rounded-full" />
              <div className="relative h-full flex items-center justify-center">
                <div className="w-80 h-80 bg-card/50 backdrop-blur-sm rounded-xl border-2 border-primary/20 shadow-glow flex items-center justify-center">
                  <BarChart3 className="w-32 h-32 text-primary animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-bold text-center mb-20">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <div className="text-center space-y-6">
              <div className="w-24 h-24 mx-auto bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                <Target className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold">Connect a token</h3>
              <p className="text-muted-foreground leading-relaxed">
                Paste a contract or choose from 100k+ tokens. AudienceScan fetches trading wallets automatically.
              </p>
            </div>
            
            <div className="text-center space-y-6">
              <div className="w-24 h-24 mx-auto bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                <Database className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold">We map wallet behavior</h3>
              <p className="text-muted-foreground leading-relaxed">
                We analyze which tokens these wallets actually buy, sell, hold, or engage with.
              </p>
            </div>
            
            <div className="text-center space-y-6">
              <div className="w-24 h-24 mx-auto bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                <Users className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold">You get a real audience</h3>
              <p className="text-muted-foreground leading-relaxed">
                You instantly see which communities overlap the most — and where to target.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <a href="#" className="text-primary hover:underline inline-flex items-center gap-2 text-lg">
              View example scan <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Interactive Overlap Graph */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-6 mb-16">
              <h2 className="text-5xl font-bold">
                Your holders don't behave like you think.
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                See which tokens your audience buys, how they move cross-chain, and where their attention really is. This is the data other marketers simply don't have.
              </p>
            </div>
            
            <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-sm shadow-glow">
              <CardContent className="p-12">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div className="h-96 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <BarChart3 className="w-32 h-32 mx-auto text-primary" />
                      <p className="text-muted-foreground">Interactive overlap visualization</p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Target className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-2">Token overlap ranking</h3>
                        <p className="text-muted-foreground">See exactly which tokens your audience holds</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-2">Wallet activity metrics</h3>
                        <p className="text-muted-foreground">Trading patterns and behavioral data</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Users className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-2">Ideal community targets</h3>
                        <p className="text-muted-foreground">Find the right audiences to reach</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <BarChart3 className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-2">Persona clustering</h3>
                        <p className="text-muted-foreground">Segment users by behavior patterns</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-32 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-bold text-center mb-20">
            Made for crypto marketers who want clarity.
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="border-2 border-primary/10 hover:border-primary/30 transition-all hover:shadow-glow">
              <CardContent className="p-8 space-y-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold">Exchanges</h3>
                <p className="text-muted-foreground leading-relaxed">
                  See which communities drive deposit/volume. Run profitable acquisition campaigns.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-primary/10 hover:border-primary/30 transition-all hover:shadow-glow">
              <CardContent className="p-8 space-y-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold">Token teams</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Discover your true competitor set and target the right holders.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-primary/10 hover:border-primary/30 transition-all hover:shadow-glow">
              <CardContent className="p-8 space-y-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
                  <Rocket className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold">Launchpads</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Find aligned holders for pre-sales, whitelist drops, and hype-building.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-primary/10 hover:border-primary/30 transition-all hover:shadow-glow">
              <CardContent className="p-8 space-y-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold">Agencies / Media buyers</h3>
                <p className="text-muted-foreground leading-relaxed">
                  No more random targeting. Build data-backed campaigns on X/Reddit/DV360.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Results/Benefits - Dark Section */}
      <section className="py-32 bg-foreground text-background">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-bold text-center mb-20">
            Stop boosting posts. Start winning actual users.
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 max-w-7xl mx-auto">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto bg-primary/20 rounded-lg flex items-center justify-center">
                <Target className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Real wallet-level targeting</h3>
              <p className="text-background/70 leading-relaxed">
                We show you communities that actually buy—not just follow.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto bg-primary/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold">10–20× better media efficiency</h3>
              <p className="text-background/70 leading-relaxed">
                Teams cut budget wastage by targeting the right tribes.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto bg-primary/20 rounded-lg flex items-center justify-center">
                <Shield className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Transparent, on-chain backed data</h3>
              <p className="text-background/70 leading-relaxed">
                Everything is derived from real transactions — no speculation.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto bg-primary/20 rounded-lg flex items-center justify-center">
                <Zap className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold">10-second setup</h3>
              <p className="text-background/70 leading-relaxed">
                Paste a contract address. That's it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <div className="relative h-[500px] bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl overflow-hidden shadow-glow">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <BarChart3 className="w-40 h-40 mx-auto text-primary" />
                  <p className="text-muted-foreground">Dashboard Preview</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-8">
              <h2 className="text-5xl font-bold">
                A full crypto audience intelligence platform.
              </h2>
              
              <div className="space-y-4">
                {[
                  "Wallet overlap ranking",
                  "Token-affinity scoring model",
                  "Long-tail community detection",
                  "Multi-chain support (ETH, BSC, Polygon, Base, Solana)",
                  "Export lists for X, Reddit, DV360, Facebook, Telegram",
                  "Alerts for new wallet behavior",
                  "Unlimited scans on Pro"
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                    </div>
                    <p className="text-lg">{feature}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-32 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-bold text-center mb-20">
            Simple pricing. No lock-ins. Cancel anytime.
          </h2>
          
          <Card className="max-w-xl mx-auto border-2 border-primary/20 shadow-glow">
            <CardContent className="p-12 text-center space-y-8">
              <div>
                <h3 className="text-3xl font-bold mb-4">Pro</h3>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl font-bold">9,999</span>
                  <span className="text-2xl text-muted-foreground">SEK / month</span>
                </div>
              </div>
              
              <div className="space-y-3 text-left">
                {[
                  "Unlimited token scans",
                  "All chains",
                  "Wallet overlap engine",
                  "Community ranking",
                  "Export data",
                  "API access",
                  "Priority support"
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                    </div>
                    <p>{feature}</p>
                  </div>
                ))}
              </div>
              
              <Button size="lg" className="w-full text-lg py-6 bg-gradient-primary hover:opacity-90 text-white">
                Start your free trial
              </Button>
              
              <p className="text-sm text-muted-foreground">
                Money-back guarantee if you don't find value within 7 days.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-bold text-center mb-20">
            Trusted by leading crypto teams
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-primary/10">
              <CardContent className="p-8">
                <p className="text-lg italic mb-4">
                  "AudienceScan is the only targeting tool that actually works in crypto."
                </p>
                <p className="text-sm text-muted-foreground">— DeFi Protocol CMO</p>
              </CardContent>
            </Card>
            
            <Card className="border-primary/10">
              <CardContent className="p-8">
                <p className="text-lg italic mb-4">
                  "We discovered holders we didn't even know we had."
                </p>
                <p className="text-sm text-muted-foreground">— Exchange Growth Lead</p>
              </CardContent>
            </Card>
            
            <Card className="border-primary/10">
              <CardContent className="p-8">
                <p className="text-lg italic mb-4">
                  "The wallet overlap analysis paid for itself in one campaign."
                </p>
                <p className="text-sm text-muted-foreground">— Token Marketing Director</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 relative overflow-hidden bg-gradient-to-br from-primary via-secondary to-primary">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
        
        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <h2 className="text-6xl font-bold mb-6">
            See what your audience really looks like.
          </h2>
          <p className="text-2xl mb-12 opacity-90">
            Paste your token contract and get instant insights.
          </p>
          <Button size="lg" className="text-xl px-12 py-8 bg-white text-primary hover:bg-white/90">
            Start free trial
            <ArrowRight className="ml-2 h-6 w-6" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-foreground text-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-5 gap-8 max-w-6xl mx-auto">
            <div>
              <h3 className="font-bold mb-4">Product</h3>
              <ul className="space-y-2 text-background/70">
                <li><a href="#" className="hover:text-background">Features</a></li>
                <li><a href="#" className="hover:text-background">Pricing</a></li>
                <li><a href="#" className="hover:text-background">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Resources</h3>
              <ul className="space-y-2 text-background/70">
                <li><a href="#" className="hover:text-background">Docs</a></li>
                <li><a href="#" className="hover:text-background">Blog</a></li>
                <li><a href="#" className="hover:text-background">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-2 text-background/70">
                <li><a href="#" className="hover:text-background">About</a></li>
                <li><a href="#" className="hover:text-background">Careers</a></li>
                <li><a href="#" className="hover:text-background">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2 text-background/70">
                <li><a href="#" className="hover:text-background">Privacy</a></li>
                <li><a href="#" className="hover:text-background">Terms</a></li>
                <li><a href="#" className="hover:text-background">Security</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Connect</h3>
              <ul className="space-y-2 text-background/70">
                <li><a href="#" className="hover:text-background">Twitter</a></li>
                <li><a href="#" className="hover:text-background">Discord</a></li>
                <li><a href="#" className="hover:text-background">Telegram</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Sample1;
