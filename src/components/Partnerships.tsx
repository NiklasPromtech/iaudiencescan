import { Handshake, Globe, MessageCircle, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Partnerships = () => {
  const partnershipStrategies = [
    {
      icon: Globe,
      title: "Web3 Tab Discovery",
      description: "Use the Web3 Tab in scan details to find projects with overlapping user bases"
    },
    {
      icon: Handshake,
      title: "Partnership Outreach",
      description: "Reach out to projects mentioning the overlap between your token holders and theirs"
    },
    {
      icon: MessageCircle,
      title: "DM Campaigns",
      description: "Increase open rates by mentioning shared community interests in X and Telegram outreach"
    },
    {
      icon: TrendingUp,
      title: "Cross-Promotion",
      description: "Leverage community overlap data to create mutually beneficial marketing partnerships"
    }
  ];

  return (
    <section id="partnerships" className="py-24 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-h2 font-bold mb-6">
            Smart Partnership Strategies
          </h2>
          <p className="text-p1 text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Turn wallet overlap insights into strategic partnerships. Find projects with shared audiences and create targeted outreach campaigns that actually resonate.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {partnershipStrategies.map((strategy, index) => (
            <Card key={index} className="border-2 border-primary/20 bg-card/50 backdrop-blur-sm hover:border-primary/40 transition-smooth hover:shadow-elegant group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:animate-float">
                  <strategy.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-h3 font-semibold mb-4 text-foreground">
                  {strategy.title}
                </h3>
                <p className="text-p2 text-muted-foreground leading-relaxed">
                  {strategy.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-primary/20 bg-accent/30 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <h3 className="text-h3 font-bold mb-6 text-foreground">
                Why Partnership Data Matters
              </h3>
              <p className="text-p1 text-muted-foreground leading-relaxed mb-6">
                When you know that 40% of your token holders also hold another project's token, 
                that's not just data - that's your next marketing partnership. Use these insights 
                to craft outreach messages that highlight genuine community overlap.
              </p>
              <div className="bg-primary/10 rounded-lg p-6">
                <p className="text-p2 text-foreground font-medium italic">
                  "Hey [Project], our scan shows 2,847 wallets hold both our tokens. 
                  Want to explore a cross-promotion that targets this shared audience?"
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Partnerships;