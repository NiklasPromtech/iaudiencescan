import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, TrendingUp, Wallet, FileText, ChevronDown, Plus, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const CreateScan = () => {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(true);
  const [transactionValueMin, setTransactionValueMin] = useState(0);
  const [transactionValueMax, setTransactionValueMax] = useState(0);
  const [transactionCountMin, setTransactionCountMin] = useState(2);
  const [transactionCountMax, setTransactionCountMax] = useState(3);

  const scanOptions = [
    {
      id: "transact",
      title: "Wallets that transact a token",
      description: "Analyze wallets based on their transaction activity with a specific token. Perfect for identifying active traders and understanding market dynamics.",
      icon: TrendingUp,
      comingSoon: true,
    },
    {
      id: "hold",
      title: "Wallets that hold a token",
      description: "Study wallets that currently hold a token, regardless of transaction activity. Ideal for finding long-term investors and loyal community members.",
      icon: Wallet,
      comingSoon: true,
    },
    {
      id: "custom",
      title: "A list of wallets you provide",
      description: "Upload your own custom wallet list for analysis. Great for analyzing specific communities, airdrop recipients, or any curated audience. Available for Solana chain.",
      icon: FileText,
      badge: "Solana compatible",
    },
  ];

  // Mock calculation - in real app this would be based on actual data
  const calculateMatchingWallets = () => {
    return 0; // Placeholder
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Widgets
          </h1>
          <p className="text-lg text-muted-foreground">
            Design and configure your scan widgets
          </p>
        </div>

        <div className="space-y-8">
          {/* Widget 1: Create New Scan */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Create New Scan</CardTitle>
              <CardDescription>Choose how you want to identify your target audience</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                {scanOptions.map((option) => (
                  <Card
                    key={option.id}
                    className={`transition-all hover:border-primary/50 ${
                      selectedOption === option.id
                        ? "border-primary ring-2 ring-primary/20"
                        : ""
                    } ${option.comingSoon ? "opacity-60" : ""}`}
                  >
                    <CardHeader>
                      <div className="flex flex-col items-center text-center gap-4">
                        <div className="p-3 rounded-lg bg-primary/10">
                          <option.icon className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <CardTitle className="text-xl">{option.title}</CardTitle>
                            {option.badge && (
                              <Badge variant="default" className="text-xs">{option.badge}</Badge>
                            )}
                            {option.comingSoon && (
                              <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
                            )}
                          </div>
                          <CardDescription className="mt-2">
                            {option.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        className="w-full"
                        onClick={() => setSelectedOption(option.id)}
                        disabled={option.comingSoon}
                      >
                        Select
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Widget 2: Advanced Filter */}
          <Card>
            <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
              <CardHeader>
                <CollapsibleTrigger className="flex items-center justify-between w-full hover:opacity-80 transition-opacity">
                  <CardTitle className="text-2xl">Advanced token scan tools</CardTitle>
                  <ChevronDown className={`h-5 w-5 transition-transform ${isAdvancedOpen ? 'rotate-180' : ''}`} />
                </CollapsibleTrigger>
              </CardHeader>
              <CollapsibleContent>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Transaction Value */}
                    <div className="bg-muted/30 rounded-lg p-6 space-y-6">
                      <h3 className="text-xl font-semibold text-center">Transaction value</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">Minimum</label>
                          <Input 
                            type="number" 
                            value={transactionValueMin}
                            onChange={(e) => setTransactionValueMin(Number(e.target.value))}
                            className="w-32 text-center"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">Maximum</label>
                          <Input 
                            type="number" 
                            value={transactionValueMax}
                            onChange={(e) => setTransactionValueMax(Number(e.target.value))}
                            className="w-32 text-center"
                          />
                        </div>
                      </div>

                      <div className="pt-4 border-t border-border">
                        <p className="text-center text-sm text-muted-foreground">
                          Matching wallets: <span className="font-semibold text-foreground">{calculateMatchingWallets()}</span>
                        </p>
                      </div>
                    </div>

                    {/* Transaction Count */}
                    <div className="bg-muted/30 rounded-lg p-6 space-y-6">
                      <h3 className="text-xl font-semibold text-center">Transaction count</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">Minimum</label>
                          <div className="flex items-center gap-2">
                            <Button 
                              size="icon" 
                              variant="outline"
                              className="h-8 w-8"
                              onClick={() => setTransactionCountMin(Math.max(0, transactionCountMin - 1))}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <Input 
                              type="number" 
                              value={transactionCountMin}
                              onChange={(e) => setTransactionCountMin(Number(e.target.value))}
                              className="w-20 text-center"
                            />
                            <Button 
                              size="icon" 
                              variant="outline"
                              className="h-8 w-8"
                              onClick={() => setTransactionCountMin(transactionCountMin + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">Maximum</label>
                          <div className="flex items-center gap-2">
                            <Button 
                              size="icon" 
                              variant="outline"
                              className="h-8 w-8"
                              onClick={() => setTransactionCountMax(Math.max(0, transactionCountMax - 1))}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <Input 
                              type="number" 
                              value={transactionCountMax}
                              onChange={(e) => setTransactionCountMax(Number(e.target.value))}
                              className="w-20 text-center"
                            />
                            <Button 
                              size="icon" 
                              variant="outline"
                              className="h-8 w-8"
                              onClick={() => setTransactionCountMax(transactionCountMax + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-border">
                        <p className="text-center text-sm text-muted-foreground">
                          Matching wallets: <span className="font-semibold text-foreground">{calculateMatchingWallets()}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreateScan;
