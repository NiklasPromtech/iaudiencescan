import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle2, TrendingUp, Wallet, Target, Zap, DollarSign } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Index = () => {
  const overlapData = [
    { platform: "Twitter", items: [
      { name: "@circle", logo: "💵", score: "100%" },
      { name: "@Tether_to", logo: "💎", score: "69%" },
      { name: "@zkmlsystems", logo: "⚡", score: "49%" }
    ]},
    { platform: "Telegram", items: [
      { name: "t/OfficialTether", logo: "💎", score: "69%" },
      { name: "t/zkmlsystems", logo: "⚡", score: "49%" },
      { name: "t/reploy.ai", logo: "🟢", score: "41%" }
    ]},
    { platform: "Web3", items: [
      { name: "USD Coin", logo: "💵", score: "100%" },
      { name: "Wrapped Ether", logo: "🔷", score: "81%" },
      { name: "Dai Stablecoin", logo: "🟡", score: "33%" }
    ]}
  ];

  const stats = [
    { value: "145", label: "Wallets analysed" },
    { value: "944", label: "Transactions analysed" },
    { value: "211", label: "Tokens found" },
    { value: "97.9", label: "Avg affinity score", suffix: "%" }
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
              <Button size="lg" className="text-lg px-8 py-6">
                Start Your Scan Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                See Live Demo
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary">
                  {stat.value}{stat.suffix || ''}
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

            <div className="grid md:grid-cols-3 gap-6">
              {overlapData.map((platform, idx) => (
                <Card key={idx} className="border-2 hover:border-primary/50 transition-all">
                  <CardHeader>
                    <CardTitle className="text-primary text-lg">{platform.platform}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {platform.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{item.logo}</div>
                          <div className="text-sm font-medium truncate">{item.name}</div>
                        </div>
                        <Badge variant="secondary" className="font-bold">{item.score}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center pt-8">
              <p className="text-lg text-muted-foreground mb-6">
                <span className="font-semibold text-foreground">Frame it simply:</span> Instead of guessing, you can go straight to proven communities the wallets are engaged with
              </p>
              <Button size="lg" className="text-lg px-8">
                Run Your First Scan
                <ArrowRight className="ml-2 h-5 w-5" />
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

      {/* Simple $199 Value Prop */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-6">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                Fresh audiences & exports for as little as <span className="text-primary">$199/month</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                This tool pays for itself the first time you avoid wasted ad spend. $199 is less than the cost of testing 2 bad X Ads audiences.
              </p>
            </div>

            <Card className="border-2 border-primary max-w-xl mx-auto">
              <CardHeader className="text-center pb-8">
                <div className="space-y-2">
                  <div className="text-5xl font-bold text-primary">$199</div>
                  <div className="text-muted-foreground">per month</div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary mt-0.5 shrink-0" />
                    <span className="text-base">Unlimited token scans</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary mt-0.5 shrink-0" />
                    <span className="text-base">Fresh audience data exports</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary mt-0.5 shrink-0" />
                    <span className="text-base">Advanced transaction filters</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary mt-0.5 shrink-0" />
                    <span className="text-base">Twitter, Telegram, Reddit & Web3 overlap</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary mt-0.5 shrink-0" />
                    <span className="text-base">Priority support</span>
                  </li>
                </ul>
                
                <div className="pt-4">
                  <Button size="lg" className="w-full text-lg py-6">
                    Start Your Subscription
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>

                <p className="text-center text-sm text-muted-foreground pt-2">
                  Free trial available • Cancel anytime
                </p>
              </CardContent>
            </Card>

            <div className="text-center pt-4">
              <p className="text-muted-foreground mb-4">
                Need custom targeting or full campaign management?
              </p>
              <Button variant="outline" size="lg">
                Talk to Sales About Agency Services
              </Button>
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
              <Button size="lg" className="text-lg px-8 py-6">
                Start Your Free Scan
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                Talk to Sales
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
