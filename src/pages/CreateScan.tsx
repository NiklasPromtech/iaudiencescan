import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Wallet, FileText } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const CreateScan = () => {
  const [selectedOption, setSelectedOption] = useState<string>("");

  const scanOptions = [
    {
      id: "transact",
      title: "Wallets that transact a token",
      description: "Analyze wallets based on their transaction activity with a specific token. Perfect for identifying active traders and understanding market dynamics.",
      icon: TrendingUp,
    },
    {
      id: "hold",
      title: "Wallets that hold a token",
      description: "Study wallets that currently hold a token, regardless of transaction activity. Ideal for finding long-term investors and loyal community members.",
      icon: Wallet,
    },
    {
      id: "custom",
      title: "A list of wallets you provide",
      description: "Upload your own custom wallet list for analysis. Great for analyzing specific communities, airdrop recipients, or any curated audience.",
      icon: FileText,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Create New Scan
          </h1>
          <p className="text-lg text-muted-foreground">
            Choose how you want to identify your target audience
          </p>
        </div>

        <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
          <div className="grid gap-6">
            {scanOptions.map((option) => (
              <Card
                key={option.id}
                className={`cursor-pointer transition-all hover:border-primary/50 ${
                  selectedOption === option.id
                    ? "border-primary ring-2 ring-primary/20"
                    : ""
                }`}
                onClick={() => setSelectedOption(option.id)}
              >
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <RadioGroupItem
                      value={option.id}
                      id={option.id}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <Label
                        htmlFor={option.id}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <div className="p-2 rounded-lg bg-primary/10">
                          <option.icon className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="text-xl">{option.title}</CardTitle>
                      </Label>
                      <CardDescription className="mt-2 ml-14">
                        {option.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </RadioGroup>

        <div className="mt-12 flex justify-center">
          <Button
            size="lg"
            disabled={!selectedOption}
            className="min-w-[200px]"
          >
            Continue
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreateScan;
