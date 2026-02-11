import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { BookOpen, Play, Settings } from "lucide-react";

const Resources = () => {
  const resources = [
    {
      icon: BookOpen,
      title: "How to Create Your First Scan",
      description: "Step-by-step guide to get started"
    },
    {
      icon: Play,
      title: "Step-by-Step X Ads Setup",
      description: "Complete walkthrough for Twitter advertising"
    },
    {
      icon: Settings,
      title: "DV360, Reddit, and Telegram Ad Walkthroughs",
      description: "Platform-specific implementation guides"
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-h2 font-bold mb-6">
            Resources & Tutorials
          </h2>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {resources.map((resource, index) => (
              <Card key={index} className="border-2 border-primary/10 hover:border-primary/30 transition-smooth hover:shadow-elegant group">
                <CardContent className="p-8 text-center">
                  <div className="mb-6 flex justify-center">
                    <div className="w-16 h-16 bg-gradient-primary rounded-lg flex items-center justify-center group-hover:animate-float">
                      <resource.icon className="w-8 h-8 text-primary-foreground" />
                    </div>
                  </div>
                  <h3 className="text-h3 font-semibold mb-4 text-foreground">
                    {resource.title}
                  </h3>
                  <p className="text-p2 text-muted-foreground leading-relaxed">
                    {resource.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-4">
              <Link to="/blog/tutorials">View Tutorials</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Resources;