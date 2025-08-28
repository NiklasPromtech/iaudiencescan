import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
const holoclearScanImage = "/lovable-uploads/d4bad08d-c4de-4c77-ae9a-bd51c641d14b.png";
const dashboardQuestionImage = "/lovable-uploads/1daddb18-4705-451b-a588-6cfc793286a7.png";

const BlogPostWhatAmILookingAt = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="secondary" className="mb-4">
                Guide
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                What is it I am looking at?
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                A complete breakdown of your AudienceScan results and how to interpret the data that drives 50%+ cost reductions
              </p>
              <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                <span>Published: Aug 28, 2025</span>
                <span>•</span>
                <span>8 min read</span>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <article className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto prose prose-lg dark:prose-invert">
              
              {/* Introduction */}
              <Card className="mb-12 border-l-4 border-l-primary">
                <CardContent className="p-8">
                  <div className="mb-6">
                    <img 
                      src={dashboardQuestionImage} 
                      alt="User question about AudienceScan dashboard" 
                      className="rounded-lg shadow-lg w-full max-w-lg mx-auto"
                    />
                  </div>
                  <blockquote className="text-lg italic text-muted-foreground border-l-4 border-l-accent pl-6 mb-6">
                    "Right so, I've searched for a token I've been involved with in the past, what exactly am I looking at here?"
                  </blockquote>
                  <p className="text-lg leading-relaxed">
                    Got this question the other day, and it's one that people coming from the outside need answered. What is it actually you are looking at? So in this post we will break down:
                  </p>
                  <div className="grid md:grid-cols-3 gap-4 mt-8">
                    <div className="text-center p-4 bg-primary/5 rounded-lg">
                      <div className="text-2xl font-bold text-primary mb-2">1</div>
                      <p className="font-semibold">What is the meaning of the numbers</p>
                    </div>
                    <div className="text-center p-4 bg-accent/5 rounded-lg">
                      <div className="text-2xl font-bold text-accent mb-2">2</div>
                      <p className="font-semibold">Why they are relevant</p>
                    </div>
                    <div className="text-center p-4 bg-secondary/5 rounded-lg">
                      <div className="text-2xl font-bold text-secondary mb-2">3</div>
                      <p className="font-semibold">How to use them</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Main Scan Image */}
              <div className="mb-12">
                <img 
                  src={holoclearScanImage} 
                  alt="Detailed AudienceScan results for Holoclear showing Twitter, Telegram, Reddit and Tags data" 
                  className="rounded-lg shadow-xl w-full"
                />
                <p className="text-center text-sm text-muted-foreground mt-4">
                  A typical AudienceScan result showing cross-platform audience overlap data
                </p>
              </div>

              {/* Section 1: Meaning of Numbers */}
              <section className="mb-16">
                <h2 className="text-3xl font-bold mb-8 text-primary">1. What is the meaning of the numbers</h2>
                
                <Card className="mb-8">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-semibold mb-4 text-accent">a) Main Categories</h3>
                    <p className="mb-4">
                      When you look at a preview of a scan or in the scan view, you will see 4 main categories:
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <div className="font-bold text-blue-700 dark:text-blue-300">Twitter</div>
                      </div>
                      <div className="text-center p-4 bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-800 rounded-lg">
                        <div className="font-bold text-cyan-700 dark:text-cyan-300">Telegram</div>
                      </div>
                      <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                        <div className="font-bold text-orange-700 dark:text-orange-300">Reddit</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                        <div className="font-bold text-purple-700 dark:text-purple-300">Tags</div>
                      </div>
                    </div>
                    <p className="mt-4">
                      All of these represent different platforms where we create targeting setups.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-8">
                    <h3 className="text-xl font-semibold mb-4 text-foreground">b) Understanding the Data</h3>
                    
                    <div className="mb-8">
                      <h4 className="text-lg font-semibold mb-4 text-foreground">The % Value</h4>
                      <p className="mb-4">
                        This is the % <strong>OVERLAP</strong> between tokens that were transacted by traders of the source token (in this case Holoclear). 
                      </p>
                      
                      <div className="bg-muted/50 p-6 rounded-lg mb-4">
                        <h5 className="font-semibold mb-3">Simple Examples:</h5>
                        <div className="space-y-3">
                          <div className="flex items-center gap-4">
                            <Badge variant="outline" className="bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">100%</Badge>
                            <span>If we found 10 wallets that transacted Holoclear and <strong>all 10</strong> also transacted USDT</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <Badge variant="outline" className="bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800">30%</Badge>
                            <span>If we found 10 wallets that transacted Holoclear and <strong>3</strong> also transacted PANCAKE</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <Badge variant="outline" className="bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800">10%</Badge>
                            <span>If we found 10 wallets that transacted Holoclear and <strong>1</strong> also transacted DOGE</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold mb-4 text-foreground">Tokens and Communities</h4>
                      <p className="mb-4">
                        The tokens we see in this list are simply the communities we were able to match with the tokens that have an overlap.
                      </p>
                      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 p-6 rounded-lg">
                        <p className="mb-2">
                          <strong>Example:</strong> You might see DOGE under Reddit but NOT under Telegram.
                        </p>
                        <p>
                          This means when we scraped the worldwide web for information about DOGE, we were able to find their Reddit channel, but not their Telegram channel. So we leave it out of the Telegram list.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Section 2: Why Relevant */}
              <section className="mb-16">
                <h2 className="text-3xl font-bold mb-8 text-primary">2. Why they are relevant</h2>
                
                <Card>
                  <CardContent className="p-8">
                    <p className="text-lg mb-6">
                      The answer is simple: <strong>because the data told us.</strong>
                    </p>
                    
                    <p className="mb-6">
                      Over the years in this space, we have tried 100's of different ways to use on-chain/analytics data/keywords/audience data for our clients. The one way we found that generated the best results was discovered through extensive testing.
                    </p>

                    <div className="bg-gradient-to-r from-primary/5 to-accent/5 p-6 rounded-lg mb-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-primary mb-2">50%</div>
                        <p className="text-lg font-semibold">Below previous best results</p>
                        <p className="text-sm text-muted-foreground">Cost per action reduction</p>
                      </div>
                    </div>

                    <p className="mb-6">
                      We had a full-time staff (for a while) that only worked on finding communities based on interest/category/"common sense". But when we tested this specific approach, we consistently got cost per actions that were 50% below what our best guesses ever had gotten us.
                    </p>

                    <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 p-6 rounded-lg">
                      <h4 className="font-semibold mb-3 text-foreground">Our Best Theory:</h4>
                      <p>
                        The communities we find using on-chain data represent <strong>actionable behavior patterns</strong> rather than "tire kickers" we found targeting people with the same interests. What people <strong>do</strong> on the chain means more than what they are interested in.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Section 3: How to Use */}
              <section className="mb-16">
                <h2 className="text-3xl font-bold mb-8 text-primary">3. How to use them</h2>
                
                <Card>
                  <CardContent className="p-8">
                    <p className="text-lg mb-8">
                      Simply put, each category contains an addressable audience that you can target across different platforms.
                    </p>

                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                      <div className="text-center p-6 bg-primary/5 rounded-lg">
                        <div className="text-3xl mb-4">📱</div>
                        <h4 className="font-semibold mb-2">Paid Ad Campaigns</h4>
                        <p className="text-sm text-muted-foreground">Target these audiences in your advertising campaigns</p>
                      </div>
                      <div className="text-center p-6 bg-accent/5 rounded-lg">
                        <div className="text-3xl mb-4">💬</div>
                        <h4 className="font-semibold mb-2">DM Campaigns</h4>
                        <p className="text-sm text-muted-foreground">Direct outreach on X or Telegram</p>
                      </div>
                      <div className="text-center p-6 bg-secondary/5 rounded-lg">
                        <div className="text-3xl mb-4">🎯</div>
                        <h4 className="font-semibold mb-2">KOL Analysis</h4>
                        <p className="text-sm text-muted-foreground">Find key opinion leaders in these communities</p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-6 rounded-lg">
                      <h4 className="font-semibold mb-3">Your Messaging Advantage:</h4>
                      <blockquote className="text-lg italic">
                        "We know (for a fact) that people who own tokens in this community are also buying our token. Here is why [explanation]"
                      </blockquote>
                    </div>

                    <div className="mt-8">
                      <p className="mb-4">
                        Below is a link to our Tutorial post, where you can see videos about how we use them for campaign setup. But that is by no means the limit.
                      </p>
                      <div className="text-center">
                        <a 
                          href="/blog/tutorials" 
                          className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
                        >
                          Watch Video Tutorials →
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* CTA Section */}
              <section className="text-center">
                <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
                  <CardContent className="p-12">
                    <h3 className="text-2xl font-bold mb-4">Ready to see what your token's audience looks like?</h3>
                    <p className="text-lg text-muted-foreground mb-8">
                      Get your first scan and discover the communities that are already buying tokens like yours.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <a 
                        href="https://audiencescan.io/signup" 
                        className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold text-lg"
                      >
                        Start Your Free Scan
                      </a>
                      <a 
                        href="mailto:support@audiencescan.io" 
                        className="inline-flex items-center px-8 py-4 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors font-semibold text-lg"
                      >
                        Get Help
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </section>

            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPostWhatAmILookingAt;