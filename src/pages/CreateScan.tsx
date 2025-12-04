import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, TrendingUp, Wallet, FileText, ChevronDown, Plus, Minus, DollarSign, Hash, Search, Copy, Building2, Tags } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

  const allScanOptions = [
    {
      id: "transactors",
      title: "Token Transactors",
      description: "Analyze wallets based on transaction activity with a specific token.",
      icon: TrendingUp,
      group: "token",
    },
    {
      id: "holders",
      title: "Token Holders",
      description: "Study wallets that currently hold a token.",
      icon: Wallet,
      group: "token",
    },
    {
      id: "exchange",
      title: "Exchange Targeting",
      description: "Target wallets that interact with specific exchanges.",
      icon: Building2,
      group: "source",
    },
    {
      id: "category",
      title: "Category",
      description: "Target wallets based on token categories.",
      icon: Tags,
      group: "source",
    },
    {
      id: "custom",
      title: "Custom List",
      description: "Upload your own wallet list for analysis.",
      icon: FileText,
      group: "custom",
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

          {/* OPTION B: Visual Grouping with Headers */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Option B: Visual Grouping</CardTitle>
              <CardDescription>Organized by category with section headers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* By Token Section */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">By Token</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {allScanOptions.filter(o => o.group === "token").map((option) => (
                    <Card
                      key={option.id}
                      className={`transition-all hover:border-primary/50 cursor-pointer ${
                        selectedOption === option.id ? "border-primary ring-2 ring-primary/20" : ""
                      }`}
                      onClick={() => setSelectedOption(option.id)}
                    >
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                          <option.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium">{option.title}</h4>
                          <p className="text-sm text-muted-foreground">{option.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* By Source Section */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">By Source</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {allScanOptions.filter(o => o.group === "source").map((option) => (
                    <Card
                      key={option.id}
                      className={`transition-all hover:border-primary/50 cursor-pointer ${
                        selectedOption === option.id ? "border-primary ring-2 ring-primary/20" : ""
                      }`}
                      onClick={() => setSelectedOption(option.id)}
                    >
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                          <option.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm">{option.title}</h4>
                          <p className="text-xs text-muted-foreground">{option.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Custom Section */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Custom</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {allScanOptions.filter(o => o.group === "custom").map((option) => (
                    <Card
                      key={option.id}
                      className={`transition-all hover:border-primary/50 cursor-pointer ${
                        selectedOption === option.id ? "border-primary ring-2 ring-primary/20" : ""
                      }`}
                      onClick={() => setSelectedOption(option.id)}
                    >
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                          <option.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-sm">{option.title}</h4>
                            {option.badge && <Badge variant="secondary" className="text-xs">{option.badge}</Badge>}
                          </div>
                          <p className="text-xs text-muted-foreground">{option.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* OPTION C: Tabs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Option C: Tabs</CardTitle>
              <CardDescription>Navigate between scan types using tabs</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="token" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-6">
                  <TabsTrigger value="token">Token</TabsTrigger>
                  <TabsTrigger value="exchange">Exchange</TabsTrigger>
                  <TabsTrigger value="category">Category</TabsTrigger>
                  <TabsTrigger value="custom">Custom List</TabsTrigger>
                </TabsList>
                <TabsContent value="token" className="space-y-4">
                  <p className="text-sm text-muted-foreground mb-4">Choose how to analyze token-related wallets:</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    {allScanOptions.filter(o => o.group === "token").map((option) => (
                      <Card
                        key={option.id}
                        className={`transition-all hover:border-primary/50 cursor-pointer ${
                          selectedOption === option.id ? "border-primary ring-2 ring-primary/20" : ""
                        }`}
                        onClick={() => setSelectedOption(option.id)}
                      >
                        <CardContent className="p-6 text-center">
                          <div className="p-3 rounded-lg bg-primary/10 inline-block mb-3">
                            <option.icon className="h-8 w-8 text-primary" />
                          </div>
                          <h4 className="font-semibold mb-1">{option.title}</h4>
                          <p className="text-sm text-muted-foreground">{option.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="exchange">
                  <div className="text-center py-8">
                    <div className="p-4 rounded-lg bg-primary/10 inline-block mb-4">
                      <Building2 className="h-12 w-12 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Exchange Targeting</h3>
                    <p className="text-muted-foreground mb-4">Target wallets that interact with specific exchanges.</p>
                    <Button onClick={() => setSelectedOption("exchange")}>
                      Select Exchange Targeting
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="category">
                  <div className="text-center py-8">
                    <div className="p-4 rounded-lg bg-primary/10 inline-block mb-4">
                      <Tags className="h-12 w-12 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Category</h3>
                    <p className="text-muted-foreground mb-4">Target wallets based on token categories.</p>
                    <Button onClick={() => setSelectedOption("category")}>
                      Select Category
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="custom">
                  <div className="text-center py-8">
                    <div className="p-4 rounded-lg bg-primary/10 inline-block mb-4">
                      <FileText className="h-12 w-12 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Custom List</h3>
                    <p className="text-muted-foreground mb-4">Upload your own wallet list for analysis.</p>
                    <Badge variant="secondary" className="mb-4">Solana compatible</Badge>
                    <div>
                      <Button onClick={() => setSelectedOption("custom")}>
                        Select Custom List
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* OPTION D: Compact Cards */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Option D: Compact Cards</CardTitle>
              <CardDescription>All options visible in a single row</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {allScanOptions.map((option) => (
                  <Card
                    key={option.id}
                    className={`transition-all hover:border-primary/50 cursor-pointer ${
                      selectedOption === option.id ? "border-primary ring-2 ring-primary/20" : ""
                    }`}
                    onClick={() => setSelectedOption(option.id)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="p-2 rounded-lg bg-primary/10 inline-block mb-2">
                        <option.icon className="h-5 w-5 text-primary" />
                      </div>
                      <h4 className="font-medium text-sm leading-tight">{option.title}</h4>
                      {option.badge && (
                        <Badge variant="secondary" className="text-[10px] mt-1">{option.badge}</Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
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
