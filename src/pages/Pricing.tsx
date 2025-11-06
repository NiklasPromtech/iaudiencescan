import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Check } from "lucide-react";
import { useState } from "react";

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: "Free",
      description: "Our most basic option",
      monthlyPrice: "Free",
      yearlyPrice: "Free",
      features: [
        "1 scan",
        "Preview data only"
      ],
      buttonText: "Get Started",
      buttonVariant: "outline" as const,
      popular: false
    },
    {
      name: "Pro",
      description: "500+ marketers use this daily",
      monthlyPrice: "$199",
      yearlyPrice: "$999",
      features: [
        "5 scans / month",
        "Full data",
        "Additional filter\n- Transaction count"
      ],
      buttonText: "Choose Pro",
      buttonVariant: "default" as const,
      popular: true
    },
    {
      name: "Enterprise",
      description: "Ad agencies love this for targeting",
      monthlyPrice: "$999",
      yearlyPrice: "$9,999",
      features: [
        "50 scans / month",
        "Everything from Pro",
        "API",
        "Premium support",
        "Additional filter\n- Transaction volume"
      ],
      buttonText: "Choose Enterprise",
      buttonVariant: "default" as const,
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-h1 font-bold mb-4">
              Start generating audiences
            </h1>
            <p className="text-p1 text-muted-foreground mb-2">
              Start from as little as $199 / month
            </p>
            <p className="text-p2 text-muted-foreground max-w-3xl mx-auto">
              Choose a plan to unlock the power of <span className="font-semibold">AudienceScan</span>
            </p>
          </div>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`text-p1 font-medium transition-colors ${!isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
            />
            <span className={`text-p1 font-medium transition-colors ${isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
              Yearly
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative border-2 transition-all duration-300 hover:shadow-xl h-full flex flex-col ${
                  plan.popular 
                    ? 'border-primary bg-primary/5 scale-105' 
                    : plan.name === "Enterprise"
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border hover:border-primary/30'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <CardHeader className="text-center pb-8">
                  <CardTitle className={`text-h3 font-bold ${plan.name === "Enterprise" ? 'text-background' : ''}`}>
                    {plan.name}
                  </CardTitle>
                  <p className={`text-p2 ${plan.name === "Enterprise" ? 'text-background/70' : 'text-muted-foreground'} mt-2`}>
                    {plan.description}
                  </p>
                  
                  <div className="mt-6">
                    <div className={`text-h2 font-bold ${plan.name === "Enterprise" ? 'text-background' : ''}`}>
                      {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                      {plan.monthlyPrice !== "Free" && (
                        <span className={`text-p2 font-normal ${plan.name === "Enterprise" ? 'text-background/70' : 'text-muted-foreground'}`}>
                          {isYearly ? "/per year" : "/per month"}
                        </span>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex flex-col flex-1">
                  <div className="space-y-3 flex-1">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-3">
                        <Check className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                          plan.name === "Enterprise" ? 'text-background' : 'text-primary'
                        }`} />
                        <span className={`text-p2 whitespace-pre-wrap ${
                          plan.name === "Enterprise" ? 'text-background/90' : 'text-foreground'
                        }`}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-6">
                    <a 
                      href="https://app.audiencescan.io/signUp"
                      target="_blank"
                      rel="nofollow noopener noreferrer"
                      className="block"
                    >
                      <Button 
                        variant={plan.name === "Enterprise" ? "secondary" : plan.buttonVariant}
                        className="w-full"
                        size="lg"
                      >
                        {plan.buttonText}
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-16">
            <p className="text-p2 text-muted-foreground">
              Need a custom solution? <a href="mailto:support@audiencescan.io" className="text-primary hover:underline">Contact us</a>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;