import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

const Pricing = () => {
  const plans = [
    {
      name: "Free",
      description: "Our most basic option",
      price: "Free",
      originalPrice: null,
      yearlyPrice: null,
      originalYearlyPrice: null,
      monthlyNote: null,
      originalMonthlyNote: null,
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
      price: "$999",
      originalPrice: "$2,499",
      yearlyPrice: "$999",
      originalYearlyPrice: "$2,499",
      monthlyNote: "$199 when you pay monthly",
      originalMonthlyNote: "$499 when you pay monthly",
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
      price: "$9,999",
      originalPrice: "$24,999",
      yearlyPrice: "$9,999",
      originalYearlyPrice: "$13,999",
      monthlyNote: "$999 when you pay monthly",
      originalMonthlyNote: "$2,499 when you pay monthly",
      features: [
        "50 scans / month",
        "Everything from Pro",
        "API",
        "White-labeled",
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
          {/* Promotional Banner */}
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mb-12 max-w-4xl mx-auto text-center">
            <h2 className="text-h3 font-bold text-primary mb-2">Limited Time: 60% Off All Plans!</h2>
            <p className="text-p2 text-muted-foreground">
              Early bird pricing available until we reach our first 100 users. Lock in these rates forever.
            </p>
          </div>

          <div className="text-center mb-16">
            <h1 className="text-h1 font-bold mb-6">
              Start generating audiences
            </h1>
            <p className="text-p1 text-muted-foreground max-w-3xl mx-auto">
              Choose a plan to unlock the power of <span className="font-semibold">AudienceScan</span>
            </p>
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
                    {plan.originalPrice && (
                      <div className={`text-p2 line-through ${plan.name === "Enterprise" ? 'text-background/50' : 'text-muted-foreground'} mb-1`}>
                        {plan.originalPrice}/per year
                      </div>
                    )}
                    <div className={`text-h2 font-bold ${plan.name === "Enterprise" ? 'text-background' : ''}`}>
                      {plan.price}
                      {plan.yearlyPrice && (
                        <span className={`text-p2 font-normal ${plan.name === "Enterprise" ? 'text-background/70' : 'text-muted-foreground'}`}>
                          {" "}/per year
                        </span>
                      )}
                    </div>
                    {plan.monthlyNote && (
                      <div>
                        {plan.originalMonthlyNote && (
                          <p className={`text-p3 line-through ${plan.name === "Enterprise" ? 'text-background/40' : 'text-muted-foreground/60'}`}>
                            {plan.originalMonthlyNote}
                          </p>
                        )}
                        <p className={`text-p3 ${plan.name === "Enterprise" ? 'text-background/60' : 'text-muted-foreground'} mt-1`}>
                          {plan.monthlyNote}
                        </p>
                      </div>
                    )}
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