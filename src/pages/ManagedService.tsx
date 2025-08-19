import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Target, 
  TrendingUp, 
  Shield, 
  Users, 
  BarChart3, 
  CheckCircle, 
  Clock, 
  Zap,
  Eye,
  DollarSign,
  MessageSquare,
  ArrowRight,
  Star,
  Award,
  Globe
} from "lucide-react";

const ManagedService = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-24 bg-gradient-subtle relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/src/assets/backdrop-texture.jpg')] opacity-5"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow animate-pulse-glow">
                <Target className="w-10 h-10 text-primary-foreground" />
              </div>
            </div>
            
            <h1 className="text-h1 font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
              AudienceScan Managed Crypto Ad Service
            </h1>
            
            <p className="text-p1 text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto">
              Operator-to-operator paid ad campaigns for Web3 projects – built by crypto marketers, for crypto marketers. No hype, just data-driven improvements.
            </p>
            
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-4 text-lg shadow-elegant hover-scale">
              Start Your $2,500 Pilot
            </Button>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-16 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-destructive/20 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-destructive/10 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-destructive" />
                  </div>
                  <h2 className="text-h2 font-bold">Why Web3 Ads Often Underperform</h2>
                </div>
                
                <p className="text-p1 text-muted-foreground mb-6 leading-relaxed">
                  Tired of pouring budget into crypto ads with unclear results? We've been there. AudienceScan is our answer: a managed advertising service that uses on-chain audience data to beat your current performance benchmarks – or helps you establish solid ones if you're starting fresh.
                </p>
                
                <p className="text-p1 text-muted-foreground mb-6 leading-relaxed">
                  The typical crypto ad experience is broken. Big ad networks still don't "get" crypto – they slap on broad interest labels like "Bitcoin enthusiast" and call it targeting, which means your ads end up hitting a generic crowd instead of actual crypto users. Many Web3 teams have wasted thousands on clicks from people who've never touched a wallet.
                </p>
                
                <div className="bg-secondary/5 p-6 rounded-xl border border-secondary/20">
                  <p className="text-p1 font-medium text-foreground italic">
                    "We turned our frustration into a solution, focusing on what actually matters to crypto projects: reaching real on-chain active users and measuring genuine outcomes."
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Credibility */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
                  <Users className="w-8 h-8 text-primary-foreground" />
                </div>
              </div>
              <h2 className="text-h2 font-bold mb-4">Built by Web3 Growth Operators, Not a Traditional Agency</h2>
              <p className="text-p1 text-muted-foreground max-w-2xl mx-auto">
                AudienceScan isn't a generic agency service – it's operator-to-operator support from practitioners who understand your challenges.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-card/50 backdrop-blur-sm hover-scale transition-smooth">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-h3 font-semibold mb-3">We Speak Your Language</h3>
                  <p className="text-p2 text-muted-foreground">
                    Collaborate with practitioners who understand KPIs like cost-per-wallet and TVL, not just CPC and CTR.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-card/50 backdrop-blur-sm hover-scale transition-smooth">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Eye className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-h3 font-semibold mb-3">No "Black Box" BS</h3>
                  <p className="text-p2 text-muted-foreground">
                    Full transparency on how our targeting works and the logic behind our campaigns.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-card/50 backdrop-blur-sm hover-scale transition-smooth">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-h3 font-semibold mb-3">Built on Trust</h3>
                  <p className="text-p2 text-muted-foreground">
                    Candid communication, realistic goal-setting, and full access to performance data.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-h2 font-bold mb-4">How It Works – A Clear, Data-Driven Process</h2>
              <p className="text-p1 text-muted-foreground">
                Full transparency about our process, timeline, and what you get.
              </p>
            </div>
            
            <div className="space-y-8">
              <Card className="border-2 border-primary/20 bg-card/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold text-lg shrink-0">
                      1
                    </div>
                    <div>
                      <h3 className="text-h3 font-semibold mb-3 flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary" />
                        Scoping & Audit (Pre-Pilot)
                      </h3>
                      <p className="text-p1 text-muted-foreground leading-relaxed">
                        Free consultation call to understand your goals, current performance, and ensure we're a fit. We'll outline a brief game plan for the pilot.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-primary/20 bg-card/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold text-lg shrink-0">
                      2
                    </div>
                    <div>
                      <h3 className="text-h3 font-semibold mb-3 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-primary" />
                        $2.5k Pilot Campaign (1st Month)
                      </h3>
                      <p className="text-p1 text-muted-foreground leading-relaxed mb-4">
                        One-month trial run designed to prove value with minimal risk. Week 1: Setup everything. Weeks 2-4: Manage live campaigns with continuous optimization.
                      </p>
                      <div className="bg-primary/5 p-4 rounded-xl border border-primary/20">
                        <p className="text-p2 font-medium text-foreground">
                          Goal: Beat your existing performance benchmarks within this month.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-primary/20 bg-card/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold text-lg shrink-0">
                      3
                    </div>
                    <div>
                      <h3 className="text-h3 font-semibold mb-3 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-primary" />
                        Results & Review
                      </h3>
                      <p className="text-p1 text-muted-foreground leading-relaxed">
                        Transparent report focused on outcomes that matter. No vanity metrics – we'll compare against your previous benchmarks to quantify improvement.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-primary/20 bg-card/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold text-lg shrink-0">
                      4
                    </div>
                    <div>
                      <h3 className="text-h3 font-semibold mb-3 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-primary" />
                        Scale or Stop – Your Call
                      </h3>
                      <p className="text-p1 text-muted-foreground leading-relaxed">
                        If the pilot meets expectations, we'll propose ongoing engagement ($5k-$10k/month). If not satisfied, no obligation to continue.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Proven Results */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
                  <Award className="w-8 h-8 text-primary-foreground" />
                </div>
              </div>
              <h2 className="text-h2 font-bold mb-4">Proven Results (Social Proof from Our Pilots)</h2>
              <p className="text-p1 text-muted-foreground">
                Data-driven Web3 folks trust results, not promises. Here are anonymized case study snapshots.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-card/50 backdrop-blur-sm border-2 border-primary/20 hover-scale transition-smooth">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-h3 font-semibold">DeFi Trading App</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-primary/5 p-3 rounded-lg">
                      <p className="text-p2 font-semibold text-primary">50% Cost Reduction</p>
                      <p className="text-p3 text-muted-foreground">$60 → $30 CPA</p>
                    </div>
                    <p className="text-p2 text-muted-foreground leading-relaxed">
                      "First time our ads actually hit the right crowd."
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-card/50 backdrop-blur-sm border-2 border-primary/20 hover-scale transition-smooth">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Target className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-h3 font-semibold">NFT Marketplace</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-primary/5 p-3 rounded-lg">
                      <p className="text-p2 font-semibold text-primary">4% Conversion Rate</p>
                      <p className="text-p3 text-muted-foreground">$12 cost per sign-up</p>
                    </div>
                    <p className="text-p2 text-muted-foreground leading-relaxed">
                      "Finally, some real numbers we can work with."
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-card/50 backdrop-blur-sm border-2 border-primary/20 hover-scale transition-smooth">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-h3 font-semibold">Layer-1 Blockchain</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-primary/5 p-3 rounded-lg">
                      <p className="text-p2 font-semibold text-primary">Double Efficiency</p>
                      <p className="text-p3 text-muted-foreground">1.2% CTR, 15% conversion</p>
                    </div>
                    <p className="text-p2 text-muted-foreground leading-relaxed">
                      "Twice the engagement and quality sign-ups."
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
                  <DollarSign className="w-8 h-8 text-primary-foreground" />
                </div>
              </div>
              <h2 className="text-h2 font-bold mb-4">Pricing and Commitment – No Surprises</h2>
              <p className="text-p1 text-muted-foreground">
                Trust is built with upfront transparency. Here's our pricing model in plain terms.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-2 border-primary/30 bg-card/80 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold">
                  PILOT
                </div>
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-h3 font-bold mb-2">Pilot Program</h3>
                    <div className="text-h1 font-bold text-primary mb-2">$2,500</div>
                    <p className="text-p2 text-muted-foreground">One-time pilot campaign</p>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                      <span className="text-p2">Full setup and management</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                      <span className="text-p2">Audience research & optimization</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                      <span className="text-p2">Performance report & insights</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                      <span className="text-p2">No long-term commitment</span>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    Start Pilot
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-secondary/30 bg-card/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-h3 font-bold mb-2">Ongoing Service</h3>
                    <div className="text-h1 font-bold text-secondary mb-2">$5k-$10k</div>
                    <p className="text-p2 text-muted-foreground">Per month, after pilot</p>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-secondary shrink-0" />
                      <span className="text-p2">Embedded growth partner</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-secondary shrink-0" />
                      <span className="text-p2">Multi-channel campaigns</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-secondary shrink-0" />
                      <span className="text-p2">Weekly reporting & strategy</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-secondary shrink-0" />
                      <span className="text-p2">Month-to-month flexibility</span>
                    </div>
                  </div>
                  
                  <Button variant="secondary" className="w-full">
                    Scale Campaigns
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-8 text-center">
              <Card className="bg-primary/5 border border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <Shield className="w-6 h-6 text-primary" />
                    <h3 className="text-h3 font-semibold">Performance Guarantee</h3>
                  </div>
                  <p className="text-p1 text-muted-foreground">
                    Beat your benchmark or help create one. If we can't move the needle in the pilot, we'll work with you to make it right.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-h2 font-bold mb-4">FAQs – Your Questions, Answered Upfront</h2>
              <p className="text-p1 text-muted-foreground">
                An informed client is the best kind. Below we address common questions.
              </p>
            </div>
            
            <div className="space-y-6">
              <Card className="bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="text-h3 font-semibold mb-3">What makes AudienceScan different from other crypto marketing agencies?</h3>
                  <p className="text-p1 text-muted-foreground leading-relaxed">
                    We are Web3 operators first, marketers second. We built a proprietary audience engine that targets based on actual on-chain behavior, not just interests. You work directly with the people who developed the tech and strategy.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="text-h3 font-semibold mb-3">What if I don't have benchmarks because we haven't done much paid advertising?</h3>
                  <p className="text-p1 text-muted-foreground leading-relaxed">
                    Perfect! Our first job is establishing a baseline. We'll treat the pilot as an experiment to determine your customer acquisition costs and conversion rates. By the end, you'll have meaningful data to guide future marketing efforts.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="text-h3 font-semibold mb-3">On which platforms will you run our ads?</h3>
                  <p className="text-p1 text-muted-foreground leading-relaxed">
                    Typically Twitter (X), Google, Reddit, and Telegram. The exact mix depends on where your target users "live." During the pilot, we focus on 1-2 channels. In ongoing management, we can expand to multi-channel approaches.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="text-h3 font-semibold mb-3">How quickly can we start?</h3>
                  <p className="text-p1 text-muted-foreground leading-relaxed">
                    Usually within 1-2 weeks from our initial conversation. We take on a limited number of pilots each month to maintain quality. The first step is scheduling a free consultation call.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/src/assets/backdrop-texture.jpg')] opacity-10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm animate-float">
                <Globe className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h2 className="text-h2 font-bold mb-6 text-white">
              Ready to Accelerate Your Growth?
            </h2>
            
            <p className="text-p1 text-white/90 mb-8 leading-relaxed max-w-3xl mx-auto">
              Imagine one month from now: clear view of effective crypto advertising, more signups, lower costs, and concrete numbers to evaluate paid growth. All through operator-to-operator collaboration.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-4 text-lg shadow-elegant">
                Book Free Consultation
              </Button>
              <Button size="lg" className="bg-white/20 text-white border-2 border-white/30 hover:bg-white/30 backdrop-blur-sm font-semibold px-8 py-4 text-lg">
                Start $2,500 Pilot <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ManagedService;