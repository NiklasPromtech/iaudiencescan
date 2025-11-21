import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, CheckCircle, AlertTriangle, Clock, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CTA from "@/components/CTA";

const BlogPostGuarantee = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/5" />
        <div className="container mx-auto px-6 relative">
          <Button
            variant="ghost"
            onClick={() => navigate('/blog')}
            className="mb-8 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
          
          <div className="max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-4">
              Guarantee
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent pb-2">
              Guaranteed Results
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8">
              <span>Published December 2024</span>
              <span>•</span>
              <span>5 min read</span>
              <span>•</span>
              <span>Money-Back Guarantee</span>
            </div>

            {/* Key Metrics */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="p-6 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="h-6 w-6 text-primary" />
                  <span className="font-semibold">Money-Back</span>
                </div>
                <p className="text-2xl font-bold text-primary">100% Guarantee</p>
                <p className="text-sm text-muted-foreground">If we don't deliver 50%+ cost reduction</p>
              </Card>
              
              <Card className="p-6 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="h-6 w-6 text-primary" />
                  <span className="font-semibold">Max Refund</span>
                </div>
                <p className="text-2xl font-bold text-primary">$199</p>
                <p className="text-sm text-muted-foreground">One month of Pro subscription</p>
              </Card>
              
              <Card className="p-6 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="h-6 w-6 text-primary" />
                  <span className="font-semibold">Test Period</span>
                </div>
                <p className="text-2xl font-bold text-primary">3 Weeks</p>
                <p className="text-sm text-muted-foreground">Minimum $1,000 spend per campaign</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            
            {/* Introduction */}
            <div className="prose prose-lg max-w-none mb-12">
              <p className="text-xl leading-relaxed text-muted-foreground">
                Since all our tests have come back saying the same thing – <strong className="text-foreground">50%+ reduction in cost</strong> – we figured we'd put our money where our mouth is and offer a money-back guarantee.
              </p>
            </div>

            {/* Requirements Section */}
            <Card className="p-8 mb-12 border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
              <div className="flex items-center gap-3 mb-6">
                <AlertTriangle className="h-8 w-8 text-primary" />
                <h2 className="text-2xl font-bold">Guarantee Requirements</h2>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Badge variant="outline" className="mt-1 font-bold">1</Badge>
                  <p>The guarantee only applies to <strong>Pro subscriptions</strong>.</p>
                </div>
                
                <div className="flex items-start gap-4">
                  <Badge variant="outline" className="mt-1 font-bold">2</Badge>
                  <p>The test setup must be done on <strong>X, Reddit, or DV360</strong> (we're ignoring Telegram since it's too easy to set up spray-and-pray campaigns there that just attract bots).</p>
                </div>
                
                <div className="flex items-start gap-4">
                  <Badge variant="outline" className="mt-1 font-bold">3</Badge>
                  <div>
                    <p className="mb-2">The setup requires that you create <strong>one campaign following our tutorial videos</strong> and <strong>one comparison campaign</strong>.</p>
                    <p className="text-sm text-muted-foreground pl-4 border-l-2 border-muted">
                      For ease, you can set it up as shown in the screengrabs on the case study page.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Badge variant="outline" className="mt-1 font-bold">4</Badge>
                  <p>Each campaign must spend <strong>at least $1,000</strong> and run for <strong>3 weeks</strong> with spend distributed evenly, both launched at the same time with the same ad assets.</p>
                </div>
                
                <div className="flex items-start gap-4">
                  <Badge variant="outline" className="mt-1 font-bold">5</Badge>
                  <p>The maximum refund is the value of <strong>one month of Pro ($199)</strong>.</p>
                </div>
                
                <div className="flex items-start gap-4">
                  <Badge variant="outline" className="mt-1 font-bold">6</Badge>
                  <p>Optimizations must be applied equally to both campaigns. (For example, if you optimize geo targeting on the comparison campaign, you must do the same on the AudienceScan campaign.)</p>
                </div>
                
                <div className="flex items-start gap-4">
                  <Badge variant="outline" className="mt-1 font-bold">7</Badge>
                  <div>
                    <p className="mb-2">To get the refund, you must <strong>book a 30-minute meeting</strong> where we review the setup and export the following reports during the call:</p>
                    <ul className="list-disc pl-8 space-y-1 text-sm">
                      <li>A daily breakdown of performance</li>
                      <li>A log export for all levels of the campaign (Campaign, Ad group, Ad)</li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Badge variant="outline" className="mt-1 font-bold">8</Badge>
                  <p><strong>Only one refund per company.</strong></p>
                </div>
              </div>
            </Card>

            {/* KPI Declaration */}
            <Card className="p-8 mb-12 border-accent/20 bg-gradient-to-r from-accent/5 to-transparent">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle className="h-8 w-8 text-accent" />
                <h2 className="text-2xl font-bold">KPI Declaration</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Badge variant="outline" className="mt-1 font-bold">9</Badge>
                  <div>
                    <p className="mb-2">Before starting the test, you must email <strong>guarantee@audiencescan.io</strong> with:</p>
                    <ul className="list-disc pl-8 space-y-1">
                      <li>The primary KPI focus (e.g., CPC, CPE, CPA)</li>
                      <li>A screenshot of historical benchmarks for similar campaigns in your account</li>
                      <li>A link to the scan that will be used (if it's a competitor token, explain why it's the best fit)</li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Badge variant="outline" className="mt-1 font-bold">10</Badge>
                  <p>The token used for the scan must be <strong>the token of the ad account OR the closest competitor token</strong>.</p>
                </div>
                
                <div className="flex items-start gap-4">
                  <Badge variant="outline" className="mt-1 font-bold">11</Badge>
                  <p>Refund requests must be submitted to <strong>guarantee@audiencescan.io within 7 days</strong> of the test period ending. Claims submitted later are not eligible.</p>
                </div>
              </div>
            </Card>

            {/* Contact Information */}
            <Card className="p-8 text-center border-primary/20 bg-gradient-to-r from-primary/10 to-accent/10">
              <h3 className="text-2xl font-bold mb-4">Ready to Test Our Guarantee?</h3>
              <p className="text-lg text-muted-foreground mb-6">
                Contact us at <a href="mailto:guarantee@audiencescan.io" className="text-primary font-semibold hover:underline">guarantee@audiencescan.io</a> to get started with your guaranteed test.
              </p>
              <Button size="lg" className="text-lg px-8" asChild>
                <a href="https://app.audiencescan.io/signup" target="_blank" rel="noopener noreferrer noindex">
                  Start Your Guaranteed Test
                </a>
              </Button>
            </Card>
          </div>
        </div>
      </section>

      <CTA />
      <Footer />
    </div>
  );
};

export default BlogPostGuarantee;