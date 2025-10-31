import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle2, TrendingUp, Wallet, Target, Zap, DollarSign } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import overlapResults from "@/assets/overlap-results.png";
import { useEffect, useState } from "react";

const Index = () => {
  const [wallets, setWallets] = useState(36250);
  const [transactions, setTransactions] = useState(236000);
  const [tokens, setTokens] = useState(52750);

  useEffect(() => {
    const interval = setInterval(() => {
      setWallets(prev => prev + Math.floor(Math.random() * 3) + 1);
      setTransactions(prev => prev + Math.floor(Math.random() * 8) + 1);
      setTokens(prev => prev + Math.floor(Math.random() * 2) + 1);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const stats = [
    { value: wallets.toLocaleString(), label: "Wallets analysed" },
    { value: transactions.toLocaleString(), label: "Transactions analysed" },
    { value: tokens.toLocaleString(), label: "Tokens found" }
  ];

  const benefits = [
    { icon: Target, title: "Stop Guessing", description: "Target wallets that actually transact with tokens like yours" },
    { icon: TrendingUp, title: "Proven Communities", description: "Find overlap between your holders and other successful projects" },
    { icon: Zap, title: "2-3 Minutes", description: "Get actionable audience data faster than testing a single ad" },
    { icon: DollarSign, title: "Avoid Waste", description: "$199 vs $5,000+ in wasted ad spend on bad audiences" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              Stop wasting ad spend on generic audiences
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Instead of guessing,<br />
              <span className="text-primary">target proven communities</span><br />
              your holders already engage with
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              $199 is less than testing 2 bad X Ads audiences. This tool pays for itself the first time you avoid wasted ad spend.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="text-lg px-8 py-6" asChild>
                <a href="https://app.audiencescan.io/" target="_blank" rel="noopener noreferrer">
                  Start Your Scan Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
                <a href="https://calendly.com/niklas-audiencescan/audiencescan-intro" target="_blank" rel="noopener noreferrer">
                  See Live Demo
                </a>
              </Button>
            </div>

            <div className="pt-4 text-sm text-muted-foreground">
              ✓ 2-3 minute scans &nbsp;•&nbsp; ✓ Fresh data exports &nbsp;•&nbsp; ✓ No complex setup
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Aha Moment - Live Overlap Data */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <Badge variant="default" className="px-4 py-2">
                The "Aha" Moment
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                See who your holders <span className="text-primary">actually follow</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Highlight surprising tokens and communities your holders engage with. Compare overlap vs generic targeting.
              </p>
            </div>

            <div className="rounded-xl overflow-hidden border-2 border-border shadow-2xl">
              <img 
                src={overlapResults} 
                alt="AudienceScan overlap results showing Twitter, Telegram, Reddit and Tags data with affinity scores"
                className="w-full h-auto"
              />
            </div>

            <div className="text-center pt-8">
              <p className="text-lg text-muted-foreground mb-6">
                <span className="font-semibold text-foreground">Frame it simply:</span> Instead of guessing, you can go straight to proven communities the wallets are engaged with
              </p>
              <Button size="lg" className="text-lg px-8" asChild>
                <a href="https://app.audiencescan.io/" target="_blank" rel="noopener noreferrer">
                  Run Your First Scan
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, idx) => (
                <Card key={idx} className="text-center">
                  <CardHeader>
                    <div className="mx-auto p-3 rounded-lg bg-primary/10 w-fit mb-4">
                      <benefit.icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{benefit.title}</CardTitle>
                    <CardDescription className="text-base">{benefit.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">
              Do you want to keep guessing or start targeting proven communities?
            </h2>
            <p className="text-xl text-muted-foreground">
              Get your first scan in 2-3 minutes. See your wallet overlap data. Make $199 feel like a rounding error.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6" asChild>
                <a href="https://app.audiencescan.io/" target="_blank" rel="noopener noreferrer">
                  Start Your Free Scan
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
                <a href="https://calendly.com/niklas-audiencescan/audiencescan-intro" target="_blank" rel="noopener noreferrer">
                  Talk to Sales
                </a>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Free trial • No credit card required • 2-minute setup
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
