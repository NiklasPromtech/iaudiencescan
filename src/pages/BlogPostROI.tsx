import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Calculator, DollarSign, TrendingDown } from "lucide-react";

const BlogPostROI = () => {
  const [budget, setBudget] = useState([1000]);
  const currentBudget = budget[0];
  const savedAmount = currentBudget * 0.5;
  const shouldUseAudienceScan = currentBudget >= 400;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            ROI Analysis
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            The AudienceScan ROI: Why 50%+ Cost Reduction is Standard
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Discover the numbers behind AudienceScan's consistent performance and calculate your potential savings with our interactive ROI calculator.
          </p>
          
          {/* Meta info */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
            <span>Jan 30, 2025</span>
            <span>•</span>
            <span>5 min read</span>
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <Card className="p-8 mb-8 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="p-0">
                <div className="flex items-center gap-3 mb-6">
                  <TrendingDown className="h-8 w-8 text-primary" />
                  <h2 className="text-2xl font-bold m-0">The 50% Rule</h2>
                </div>
                
                <p className="text-lg leading-relaxed mb-6">
                  The number we keep seeing time and time again across hundreds of campaigns is a <strong>50%+ reduction in advertising costs</strong>. This isn't marketing fluff—it's consistent, measurable performance that happens when you stop guessing where your audience is and start knowing exactly where to find them.
                </p>
                
                <p className="text-lg leading-relaxed">
                  To put this in perspective: if you spend $1,000 using your best guess versus $1,000 on a campaign using AudienceScan data as your foundation, you would typically reduce your cost per acquisition by 50% or more. That means the same budget delivers twice the results.
                </p>
              </CardContent>
            </Card>

            <h2 className="text-3xl font-bold mb-6 text-foreground flex items-center gap-3">
              <Calculator className="h-8 w-8" />
              ROI Calculator
            </h2>
            
            <p className="text-lg leading-relaxed mb-8">
              Use the calculator below to see your potential savings with AudienceScan. Simply adjust the slider to match your typical monthly advertising budget:
            </p>

            {/* Interactive ROI Calculator */}
            <Card className="p-8 mb-8 bg-gradient-to-br from-background to-muted/20 border-2 border-primary/20">
              <CardContent className="p-0">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">Monthly Advertising Budget</h3>
                  <div className="flex items-center justify-center gap-2 mb-6">
                    <DollarSign className="h-6 w-6 text-primary" />
                    <span className="text-4xl font-bold text-primary">
                      {currentBudget.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="max-w-md mx-auto mb-8">
                    <Slider
                      value={budget}
                      onValueChange={setBudget}
                      max={10000}
                      min={0}
                      step={100}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground mt-2">
                      <span>$0</span>
                      <span>$10,000</span>
                    </div>
                  </div>
                </div>

                {shouldUseAudienceScan ? (
                  <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-6 text-center">
                    <h4 className="text-xl font-bold text-green-800 mb-4">✅ Try AudienceScan</h4>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-green-600 mb-1">Without AudienceScan</p>
                        <p className="text-2xl font-bold text-green-800">${currentBudget.toLocaleString()}</p>
                        <p className="text-sm text-green-600">Standard campaign cost</p>
                      </div>
                      <div>
                        <p className="text-sm text-green-600 mb-1">With AudienceScan</p>
                        <p className="text-2xl font-bold text-green-800">${(currentBudget - savedAmount).toLocaleString()}</p>
                        <p className="text-sm text-green-600">Same results, 50% less cost</p>
                      </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-green-200">
                      <p className="text-lg font-bold text-green-800">
                        Monthly Savings: ${savedAmount.toLocaleString()}
                      </p>
                      <p className="text-lg font-bold text-green-800">
                        Annual Savings: ${(savedAmount * 12).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-6 text-center">
                    <h4 className="text-xl font-bold text-orange-800 mb-4">💡 Consider Your Scale</h4>
                    <p className="text-orange-700 leading-relaxed">
                      With a budget under $400/month, you might want to focus on organic growth and smaller-scale testing first. 
                      AudienceScan delivers the most impact for campaigns with meaningful advertising spend where cost optimization 
                      creates substantial savings.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <h2 className="text-3xl font-bold mb-6 text-foreground">Why These Numbers Matter</h2>
            
            <p className="text-lg leading-relaxed mb-6">
              The 50% cost reduction isn't just about spending less money—it's about <strong>dramatically improving your campaign performance</strong>. When you know exactly where your audience is most active and engaged, every dollar works harder.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card className="p-6">
                <CardContent className="p-0">
                  <h3 className="text-xl font-bold mb-4">Traditional Targeting</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Demographic guessing</li>
                    <li>• Platform assumptions</li>
                    <li>• Trial and error approach</li>
                    <li>• Wasted ad spend</li>
                    <li>• Inconsistent results</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardContent className="p-0">
                  <h3 className="text-xl font-bold mb-4 text-primary">AudienceScan Targeting</h3>
                  <ul className="space-y-2 text-primary/80">
                    <li>• Data-driven precision</li>
                    <li>• Verified audience locations</li>
                    <li>• Optimized platform selection</li>
                    <li>• Efficient budget allocation</li>
                    <li>• Consistent 50%+ savings</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <h2 className="text-3xl font-bold mb-6 text-foreground">Real-World Impact</h2>
            
            <p className="text-lg leading-relaxed mb-6">
              These aren't theoretical numbers. Across Web3 projects, SaaS companies, and digital marketing campaigns, AudienceScan consistently delivers:
            </p>

            <Card className="p-6 mb-8 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div>
                    <p className="text-3xl font-bold text-blue-800 mb-2">50%+</p>
                    <p className="text-blue-600">Cost Reduction</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-blue-800 mb-2">2x</p>
                    <p className="text-blue-600">Better Targeting</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-blue-800 mb-2">100%</p>
                    <p className="text-blue-600">Data-Driven</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <p className="text-lg leading-relaxed mb-8">
              The question isn't whether AudienceScan will improve your ROI—the data proves it will. The question is whether you're ready to stop wasting money on inefficient targeting and start seeing what precision audience data can do for your campaigns.
            </p>

            <Card className="p-8 bg-gradient-to-r from-primary to-primary/80 text-white">
              <CardContent className="p-0 text-center">
                <h3 className="text-2xl font-bold mb-4">Ready to Optimize Your ROI?</h3>
                <p className="text-lg mb-6 opacity-90">
                  Join hundreds of marketers who've already discovered the power of data-driven audience targeting.
                </p>
                <a
                  href="https://app.audiencescan.io/signup"
                  className="inline-flex items-center justify-center px-8 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                  rel="noindex"
                >
                  Start Your First Scan
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPostROI;