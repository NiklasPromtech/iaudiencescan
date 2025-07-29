import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import networkChart from "@/assets/network-chart.jpg";

const BlogPostFoundersLetter = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            Founder's Letter
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            A Personal Letter to New Users of AudienceScan
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Hi, I'm Niklas, the founder of AudienceScan. I want to share how and why we ended up launching AudienceScan, from my early digital marketing days to building a tool that consistently delivers 50%+ cost reductions.
          </p>
          
          {/* Meta info */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
            <span>Jan 29, 2025</span>
            <span>•</span>
            <span>8 min read</span>
          </div>

          {/* Hero Image */}
          <div className="mb-12">
            <img 
              src={networkChart} 
              alt="Network chart showing audience data connections" 
              className="w-full rounded-lg shadow-lg"
            />
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <Card className="p-8 mb-8 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="p-0">
                <p className="text-lg leading-relaxed mb-6">
                  When I started in digital marketing over a decade ago, I quickly learned that success wasn't just about creative campaigns or compelling copy—it was about finding the right audience. But here's what frustrated me: we were essentially guessing where our target customers spent their time online.
                </p>
                
                <p className="text-lg leading-relaxed mb-6">
                  Sure, we had demographics, psychographics, and buyer personas. But when it came to actually placing ads, we were making educated guesses about which platforms would deliver the best results. Sometimes we'd get lucky with Facebook. Other times, Twitter would surprise us. Reddit campaigns might work for one client but fail spectacularly for another.
                </p>

                <p className="text-lg leading-relaxed">
                  The problem wasn't our strategy—it was our data. We needed to know where our audience actually was, not where we thought they might be.
                </p>
              </CardContent>
            </Card>

            <h2 className="text-3xl font-bold mb-6 text-foreground">The Revelation</h2>
            
            <p className="text-lg leading-relaxed mb-6">
              The breakthrough came when I was working with a DeFi client in 2022. Traditional audience research suggested we should focus on Twitter and LinkedIn for crypto professionals. But when we started analyzing actual blockchain data—looking at wallet addresses and transaction patterns—we discovered something fascinating.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              Our target audience wasn't just on Twitter and LinkedIn. They were heavily active on Reddit, Telegram, and even platforms we hadn't considered. More importantly, we could see exactly which communities they participated in, what content they engaged with, and when they were most active.
            </p>

            <p className="text-lg leading-relaxed mb-8">
              That single campaign, guided by real audience data instead of assumptions, delivered a 60% lower cost per acquisition than our previous efforts. The client was thrilled, but I was obsessed. If this worked for crypto, why couldn't it work for every industry?
            </p>

            <h2 className="text-3xl font-bold mb-6 text-foreground">Building AudienceScan</h2>

            <p className="text-lg leading-relaxed mb-6">
              What started as a side project quickly became my mission. I began developing what would eventually become AudienceScan—a platform that could analyze any token, NFT collection, or digital asset and map out exactly where that audience was most active across the web.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              The technology was complex. We had to build systems that could process massive amounts of blockchain data, cross-reference it with social media activity, and present it in a way that marketers could actually use. But the results spoke for themselves.
            </p>

            <Card className="p-6 mb-8 bg-gradient-to-r from-green-50 to-green-100 border-green-200">
              <CardContent className="p-0">
                <h3 className="text-xl font-bold mb-4 text-green-800">The Results That Changed Everything</h3>
                <p className="text-green-700 leading-relaxed">
                  Across hundreds of campaigns and multiple platforms, AudienceScan consistently delivered cost per action reductions of 50% or more compared to traditional targeting methods. We weren't just improving campaigns—we were revolutionizing how digital marketing worked.
                </p>
              </CardContent>
            </Card>

            <h2 className="text-3xl font-bold mb-6 text-foreground">Why This Matters for You</h2>

            <p className="text-lg leading-relaxed mb-6">
              Whether you're marketing a new DeFi protocol, an NFT collection, a SaaS product, or anything else in the digital space, the principle remains the same: your audience is already out there, engaging with content, participating in communities, and making purchasing decisions.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              The question isn't whether your audience exists—it's whether you know where to find them. AudienceScan gives you that map. It shows you exactly which platforms to prioritize, which communities to engage with, and how to allocate your advertising budget for maximum impact.
            </p>

            <p className="text-lg leading-relaxed mb-8">
              We've tested this across X/Twitter, Reddit, DV360, Telegram, and more. The data doesn't lie: when you know where your audience actually is, your campaigns perform dramatically better.
            </p>

            <h2 className="text-3xl font-bold mb-6 text-foreground">What's Next</h2>

            <p className="text-lg leading-relaxed mb-6">
              This is just the beginning. We're constantly expanding our platform coverage, improving our analysis algorithms, and finding new ways to help marketers connect with their audiences more effectively.
            </p>

            <p className="text-lg leading-relaxed mb-8">
              If you're tired of guessing where your audience is, if you want to stop wasting budget on platforms that don't deliver, and if you're ready to see what data-driven audience targeting can do for your campaigns, I invite you to try AudienceScan.
            </p>

            <Card className="p-8 bg-gradient-to-r from-primary to-primary/80 text-white">
              <CardContent className="p-0 text-center">
                <h3 className="text-2xl font-bold mb-4">Ready to Find Your Audience?</h3>
                <p className="text-lg mb-6 opacity-90">
                  Stop guessing. Start knowing. Create your first AudienceScan today.
                </p>
                <a
                  href="https://app.audiencescan.io/signup"
                  className="inline-flex items-center justify-center px-8 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                  rel="noindex"
                >
                  Start Your Scan
                </a>
              </CardContent>
            </Card>

            <div className="mt-12 pt-8 border-t border-border">
              <p className="text-muted-foreground italic">
                — Niklas, Founder of AudienceScan
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPostFoundersLetter;