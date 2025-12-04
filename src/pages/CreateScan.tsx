import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, TrendingUp, Wallet, FileText, ChevronDown, Plus, Minus, DollarSign, Hash, Search, Copy, Building2, Tags } from "lucide-react";
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
  const [tokenSearch, setTokenSearch] = useState("");
  const [showTokenResults, setShowTokenResults] = useState(false);
  const [inputMode, setInputMode] = useState<"search" | "manual">("search");
  const [showMoreScanTypes, setShowMoreScanTypes] = useState(false);

  // Mock token search results
  const mockTokenResults = tokenSearch ? {
    name: "USD Coin",
    symbol: "USDC",
    logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png",
    cmcLink: "https://coinmarketcap.com/currencies/usd-coin/",
    addresses: [
      { chain: "Ethereum", address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" },
      { chain: "Solana", address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" },
      { chain: "Polygon", address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174" },
      { chain: "Arbitrum", address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8" },
    ]
  } : null;

  const primaryScanOptions = [
    {
      id: "transactors",
      title: "Token Transactors",
      description: "Analyze wallets based on their transaction activity with a specific token. Filter by transaction count or volume.",
      icon: TrendingUp,
    },
    {
      id: "holders",
      title: "Token Holders",
      description: "Study wallets that currently hold a token. Ideal for finding long-term investors and loyal community members.",
      icon: Wallet,
    },
  ];

  const secondaryScanOptions = [
    {
      id: "exchange",
      title: "Exchange Targeting",
      description: "Target wallets that interact with specific exchanges. Great for finding active traders.",
      icon: Building2,
    },
    {
      id: "category",
      title: "Category",
      description: "Target wallets based on token categories like DeFi, NFTs, Gaming, and more.",
      icon: Tags,
    },
    {
      id: "custom",
      title: "Custom List",
      description: "Upload your own custom wallet list for analysis. Great for analyzing specific communities or airdrop recipients.",
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
          {/* Widget 1: Token Search */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Search Token</CardTitle>
              <CardDescription>Search for a token by name or symbol to analyze</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-2">
                <Button
                  variant={inputMode === "search" ? "default" : "outline"}
                  onClick={() => setInputMode("search")}
                  className="flex-1"
                >
                  <Search className="mr-2 h-4 w-4" />
                  Search token
                </Button>
                <Button
                  variant={inputMode === "manual" ? "default" : "outline"}
                  onClick={() => setInputMode("manual")}
                  className="flex-1"
                >
                  Paste contract manually
                </Button>
              </div>

              {inputMode === "search" ? (
                <>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Enter token name or symbol (e.g., USDC, Ethereum)"
                      className="pl-10"
                      value={tokenSearch}
                      onChange={(e) => {
                        setTokenSearch(e.target.value);
                        setShowTokenResults(e.target.value.length > 0);
                      }}
                    />
                  </div>

                  {showTokenResults && mockTokenResults && (
                    <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img 
                            src={mockTokenResults.logo} 
                            alt={`${mockTokenResults.name} logo`}
                            className="w-12 h-12 rounded-full"
                          />
                          <div>
                            <h3 className="text-lg font-semibold">{mockTokenResults.name}</h3>
                            <Badge variant="secondary" className="mt-1">{mockTokenResults.symbol}</Badge>
                          </div>
                        </div>
                        <a 
                          href={mockTokenResults.cmcLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <span>check on</span>
                          <img 
                            src="https://s2.coinmarketcap.com/static/cloud/img/coinmarketcap_1.svg"
                            alt="CoinMarketCap"
                            className="h-4"
                          />
                        </a>
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-muted-foreground">Contract Addresses</h4>
                        {mockTokenResults.addresses.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-background rounded-md border">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline">{item.chain}</Badge>
                              </div>
                              <code className="text-xs text-muted-foreground break-all">{item.address}</code>
                            </div>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="ml-2 shrink-0"
                              onClick={() => navigator.clipboard.writeText(item.address)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>

                      <Button className="w-full">
                        Continue with this token
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Contract Address</label>
                    <Input
                      type="text"
                      placeholder="Paste contract address here"
                      className="font-mono text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Chain</label>
                    <Input
                      type="text"
                      placeholder="e.g., Ethereum, Solana, Polygon"
                    />
                  </div>
                  <Button className="w-full">
                    Continue with this contract
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}

            </CardContent>
          </Card>

          {/* Widget 2: Create New Scan */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Create New Scan</CardTitle>
              <CardDescription>Choose how you want to identify your target audience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Primary scan options - shown prominently */}
              <div className="grid md:grid-cols-2 gap-6">
                {primaryScanOptions.map((option) => (
                  <Card
                    key={option.id}
                    className={`transition-all hover:border-primary/50 ${
                      selectedOption === option.id
                        ? "border-primary ring-2 ring-primary/20"
                        : ""
                    }`}
                  >
                    <CardHeader>
                      <div className="flex flex-col items-center text-center gap-4">
                        <div className="p-4 rounded-lg bg-primary/10">
                          <option.icon className="h-10 w-10 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{option.title}</CardTitle>
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
                      >
                        Select
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Secondary scan options - collapsible */}
              <Collapsible open={showMoreScanTypes} onOpenChange={setShowMoreScanTypes}>
                <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full justify-center py-2">
                  <span>{showMoreScanTypes ? "Hide" : "More scan types"}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${showMoreScanTypes ? 'rotate-180' : ''}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    {secondaryScanOptions.map((option) => (
                      <Card
                        key={option.id}
                        className={`transition-all hover:border-primary/50 ${
                          selectedOption === option.id
                            ? "border-primary ring-2 ring-primary/20"
                            : ""
                        }`}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <option.icon className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <CardTitle className="text-base">{option.title}</CardTitle>
                                {option.badge && (
                                  <Badge variant="secondary" className="text-xs">{option.badge}</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <CardDescription className="text-xs mb-3">
                            {option.description}
                          </CardDescription>
                          <Button 
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => setSelectedOption(option.id)}
                          >
                            Select
                            <ArrowRight className="ml-2 h-3 w-3" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>

          {/* Widget 3: Advanced Filter */}
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
