import { Search, BarChart3, Brain, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Features = () => {
  const features = [
    {
      icon: Search,
      title: "Token Analysis",
      description: "Upload any contract, get holder overlap and wallet insights across multiple chains"
    },
    {
      icon: BarChart3,
      title: "Audience Breakdown",
      description: "See which X/Telegram communities your holders are active in with detailed percentages"
    },
    {
      icon: Brain,
      title: "GTM Recommendations",
      description: "Suggested next steps based on wallet behavior and community overlap patterns"
    },
    {
      icon: Download,
      title: "Exportable Lists",
      description: "Export audience segments for use in Drippi, Google Ads, and other marketing tools"
    }
  ];

  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Powerful Features for Web3 Marketing
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to understand and activate your token community
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-2 border-primary/10 hover:border-primary/30 transition-smooth hover:shadow-elegant group">
              <CardContent className="p-8 text-center">
                <div className="mb-6 flex justify-center">
                  <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center group-hover:animate-float">
                    <feature.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
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