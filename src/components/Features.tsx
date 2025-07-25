import { Search, BarChart3, Brain, Download, Target, Zap, Users, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Features = () => {
  const keyPrinciples = [
    {
      icon: Target,
      title: "Wallet Overlap = Better Targeting",
      description: "Discover which communities share holders with your token for precise audience targeting"
    },
    {
      icon: Zap,
      title: "Actual On-Chain Behavior > Guesswork",
      description: "Make decisions based on real wallet transactions, not assumptions"
    }
  ];

  const platformFeatures = [
    {
      icon: Search,
      title: "Paid Ads Tutorial",
      description: "Step-by-step guidance for X, Telegram, Reddit, and Google advertising campaigns"
    },
    {
      icon: BarChart3,
      title: "Case Studies Access",
      description: "Real test results from client campaigns on X, Telegram, and Google platforms"
    },
    {
      icon: Brain,
      title: "Web3 Tab Analysis",
      description: "Find projects with user overlap and get outreach templates for partnerships"
    },
    {
      icon: MessageCircle,
      title: "DM Campaign Tools",
      description: "X and Telegram templates highlighting community overlap for higher open rates"
    }
  ];

  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Key Principles */}
        <div className="text-center mb-16">
          <h2 className="text-h2 font-bold mb-6">
            The AudienceScan Advantage
          </h2>
          <p className="text-p1 text-muted-foreground max-w-3xl mx-auto mb-12">
            Stop guessing who your audience is. Start targeting with precision.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-24">
          {keyPrinciples.map((principle, index) => (
            <Card key={index} className="border-2 border-primary/20 hover:border-primary/40 transition-smooth hover:shadow-elegant group bg-gradient-subtle">
              <CardContent className="p-12 text-center">
                <div className="mb-8 flex justify-center">
                  <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center group-hover:animate-float shadow-glow">
                    <principle.icon className="w-10 h-10 text-primary-foreground" />
                  </div>
                </div>
                <h3 className="text-h3 font-bold mb-6 text-foreground">
                  {principle.title}
                </h3>
                <p className="text-p1 text-muted-foreground leading-relaxed">
                  {principle.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Platform Features */}
        <div className="text-center mb-16">
          <h2 className="text-h2 font-bold mb-6">
            Ways to Use the Platform
          </h2>
          <p className="text-p1 text-muted-foreground max-w-3xl mx-auto">
            From paid advertising to partnership outreach - everything you need to activate your insights
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {platformFeatures.map((feature, index) => (
            <Card key={index} className="border-2 border-primary/10 hover:border-primary/30 transition-smooth hover:shadow-elegant group">
              <CardContent className="p-8 text-center">
                <div className="mb-6 flex justify-center">
                  <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center group-hover:animate-float">
                    <feature.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                </div>
                <h3 className="text-h3 font-semibold mb-4 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-p2 text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;