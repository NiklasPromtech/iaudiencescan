import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowLeft, TrendingDown, Users, Zap, Target, BarChart3, Lightbulb, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const BlogPost = () => {
  const { id } = useParams();
  
  // This would normally come from a database or API
  const blogPost = {
    id: 1,
    title: "A Personal Letter to New Users of AudienceScan",
    excerpt: "Hi, I'm Niklas, the founder of AudienceScan. I want to share how and why we ended up launching AudienceScan, from my early digital marketing days to building a tool that consistently delivers 50%+ cost reductions.",
    date: "Jan 29, 2025",
    readTime: "8 min read",
    category: "Founder's Letter",
    content: `Hi, I'm Niklas, the founder of AudienceScan.

Before anything else, I just want to say thank you for making it here. Even if it only results in a single page view in my Analytics, I truly appreciate it.

Honestly, I think I'm writing this post 50% for myself and 50% to let you know how and why we ended up launching AudienceScan.

⸻

**Short background**

I started my digital marketing journey a bit over a decade ago now (which hurts to admit 😅). Back then, when people saw retargeting ads (usually from Criteo), they'd ACTUALLY go back to the site and buy those shoes they looked at earlier.

Running ads was simple. Ads generated clicks, clicks generated actions, and actions had clear financial value.

Things have changed.

⸻

**Analytics phase**

I moved on to working with social influencers, writing product descriptions, building on-site tools to guide people down funnels, and eventually into social and programmatic ads.

This led me to a company that analyzed Twitter data (at the time). My mind was blow. I didn't know data could be collected and aggregated in that way.

We'd take one specific handle (the "source handle") and then pull all the handles that the source handle interacted with (secondary handles). Then, we'd map how those secondary handles interacted with each other.

It allowed us to build network cluster maps, showing what groups of people spent time together.

As the company grew, I felt the urge to jump off and do my own thing—which eventually landed me in the crypto space.

⸻

**Crypto phase**

I had some good people around me, and together we ran hundreds of campaigns in the crypto space. We used basic analysis tools, made our reports look just a little bit better than the competition, and because there was so much work going around during the boom, everything went well.

But as all booms do, the crypto boom slowed down.

⸻

**Staying relevant**

We had to find ways to stay relevant—and stay just a few % ahead of competitors. Out of that challenge, AudienceScan was born.

One of the first tests we ran was incredibly manual:
• We'd open thousands of tabs to check what wallets were trading a specific token.
• Then we'd look at what other tokens those wallets were also buying.

At first, this was based on holdings (we later switched to purely transaction data because holdings had issues).

When we compared this data-driven approach to our "normal" targeting—just going after obvious communities—the results were massive:
**50%+ reduction in costs.**

It was exhausting work, but those numbers kept coming back. Again and again. We knew we were onto something.

⸻

**Building for us**

So, I started building a backend to make the process easier. I wish I had built in public because 99% of the problems I faced could have been solved faster with a bit of outside help.

We used this rough early version for about two years. It wasn't efficient, but it worked—and that 50%+ cost reduction was consistent across X, Telegram, and DV360 campaigns. Sometimes DV360 delivered even better results as ad prices on social platforms kept climbing.

⸻

**Building for everyone—the wrong way**

We spoke to a lot of crypto projects that wanted to use data smarter but didn't have the budget for us to run full campaigns for them. What they really needed were insights and direction—something to give them a running start.

That's when I started building the UI. And I made the classic "first SaaS mistake":
I added feature after feature after feature, thinking "ohhh someone will love this".
• First iteration: React, using a random template.
• Second: Flutter (I was building some apps at the time—a life coaching app and a gym app).
• Third: Still Flutter, with three different design companies involved, each making things more complicated.

⸻

**Building for everyone—the right way**

The brief to the final designer was different. I said:

"Show me only the data we actually use when we run campaigns. Remove everything else."

In 3 months, we went from 4 broken platforms crammed with buttons and half-working features…
…to a single product you can log in to, subscribe to, and run scans on almost any EVM token.

There are still edge cases I'm trying to figure out. But I'm proud of how far we've come. I know 1,000 ways NOT to build a SaaS now—and that's valuable too.

Most importantly, we've been able to keep delivering that same 50%+ cost reduction for clients, time after time.

⸻

Today, AudienceScan is priced so that anyone can add it to their marketing mix—even small projects with budgets of just $500/month can see the ROI.

So once again, thanks for making it this far.

If you have a token, if you're running marketing for a Web3 project, or if you're just curious—reach out anytime. I'd love to help. You can reach me directly at **Niklas@AudienceScan.io**.

Have an amazing day,

// Niklas  
Founder and builder of AudienceScan`
  };

  // If post not found (in a real app, you'd handle this properly)
  if (!blogPost) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-h1 font-bold mb-4">Post Not Found</h1>
          <Link to="/blog">
            <Button>Back to Blog</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Back to Blog */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <Link to="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </section>

      {/* Blog Post Header */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <Badge className="mb-4">{blogPost.category}</Badge>
            <h1 className="text-h1 font-bold text-foreground mb-6">
              {blogPost.title}
            </h1>
            <div className="flex items-center justify-center gap-4 text-muted-foreground mb-8">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {blogPost.date}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {blogPost.readTime}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Post Content */}
      <section className="py-8">
        <div className="container mx-auto px-4 max-w-4xl space-y-8">
          
          {/* Opening */}
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Hi, I'm Niklas, the founder of AudienceScan.
                  </p>
                  <p className="text-muted-foreground mt-4">
                    Before anything else, I just want to say thank you for making it here. Even if it only results in a single page view in my Analytics, I truly appreciate it.
                  </p>
                  <p className="text-muted-foreground mt-4">
                    Honestly, I think I'm writing this post 50% for myself and 50% to let you know how and why we ended up launching AudienceScan.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Short Background */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-6 h-6 text-primary" />
              <h3 className="text-2xl font-bold text-foreground">Short background</h3>
            </div>
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  I started my digital marketing journey a bit over a decade ago now (which hurts to admit 😅). Back then, when people saw retargeting ads (usually from Criteo), they'd ACTUALLY go back to the site and buy those shoes they looked at earlier.
                </p>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="font-medium text-green-800 dark:text-green-200">
                    Running ads was simple. Ads generated clicks, clicks generated actions, and actions had clear financial value.
                  </p>
                </div>
                <p className="text-muted-foreground mt-4 font-medium">
                  Things have changed.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Analytics Phase */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-6 h-6 text-primary" />
              <h3 className="text-2xl font-bold text-foreground">Analytics phase</h3>
            </div>
            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  I moved on to working with social influencers, writing product descriptions, building on-site tools to guide people down funnels, and eventually into social and programmatic ads.
                </p>
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                        Mind = Blown 🤯
                      </p>
                      <p className="text-blue-700 dark:text-blue-300">
                        This led me to a company that analyzed Twitter data (at the time). My mind was blow. I didn't know data could be collected and aggregated in that way.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <Card className="border-primary/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-primary">The Process</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground">
                        We'd take one specific handle (the "source handle") and then pull all the handles that the source handle interacted with (secondary handles).
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="border-secondary/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-secondary">The Magic</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground">
                        Then, we'd map how those secondary handles interacted with each other, building network cluster maps.
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Network Cluster Map Visualization */}
                <div className="mt-6">
                  <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
                    <CardHeader>
                      <CardTitle className="text-center text-lg text-primary">Network Cluster Map Example</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="text-center mb-4">
                        <img 
                          src="/lovable-uploads/f261ca92-566d-4793-a438-cd95998dab53.png" 
                          alt="Network cluster map showing interconnected user groups and communities"
                          className="w-full max-w-2xl mx-auto h-auto rounded-lg"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground text-center italic">
                        This is exactly what those network cluster maps looked like - showing how different user groups connected and interacted with each other.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Crypto Phase */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-6 h-6 text-primary" />
              <h3 className="text-2xl font-bold text-foreground">Crypto phase</h3>
            </div>
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  I had some good people around me, and together we ran hundreds of campaigns in the crypto space. We used basic analysis tools, made our reports look just a little bit better than the competition, and because there was so much work going around during the boom, everything went well.
                </p>
                <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                  <p className="text-orange-800 dark:text-orange-200 font-medium">
                    But as all booms do, the crypto boom slowed down.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Staying Relevant - The Big Discovery */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <TrendingDown className="w-6 h-6 text-primary" />
              <h3 className="text-2xl font-bold text-foreground">Staying relevant</h3>
            </div>
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground leading-relaxed mb-6">
                  We had to find ways to stay relevant—and stay just a few % ahead of competitors. Out of that challenge, AudienceScan was born.
                </p>
                
                <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary">
                      <Target className="w-5 h-5" />
                      The Manual Process That Started It All
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">One of the first tests we ran was incredibly manual:</p>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm text-muted-foreground">We'd open thousands of tabs to check what wallets were trading a specific token.</p>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm text-muted-foreground">Then we'd look at what other tokens those wallets were also buying.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-2">
                    <strong>Note:</strong> At first, this was based on holdings (we later switched to purely transaction data because holdings had issues).
                  </p>
                </div>

                {/* Results Card */}
                <Card className="mt-6 border-2 border-green-200 dark:border-green-800 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">50%+</div>
                    <div className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">Cost Reduction</div>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      When we compared this data-driven approach to our "normal" targeting—just going after obvious communities—the results were massive.
                    </p>
                  </CardContent>
                </Card>

                <p className="text-muted-foreground mt-4 italic">
                  It was exhausting work, but those numbers kept coming back. Again and again. We knew we were onto something.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Building Phase */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-6 h-6 text-primary" />
              <h3 className="text-2xl font-bold text-foreground">Building for us</h3>
            </div>
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  So, I started building a backend to make the process easier. I wish I had built in public because 99% of the problems I faced could have been solved faster with a bit of outside help.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <Card className="text-center border-primary/20">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-primary mb-1">2</div>
                      <div className="text-sm text-muted-foreground">Years using rough version</div>
                    </CardContent>
                  </Card>
                  <Card className="text-center border-primary/20">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-primary mb-1">50%+</div>
                      <div className="text-sm text-muted-foreground">Consistent cost reduction</div>
                    </CardContent>
                  </Card>
                  <Card className="text-center border-primary/20">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-primary mb-1">3</div>
                      <div className="text-sm text-muted-foreground">Platforms (X, Telegram, DV360)</div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Building Wrong Way */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Lightbulb className="w-6 h-6 text-red-500" />
              <h3 className="text-2xl font-bold text-foreground">Building for everyone—the wrong way</h3>
            </div>
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground leading-relaxed mb-6">
                  We spoke to a lot of crypto projects that wanted to use data smarter but didn't have the budget for us to run full campaigns for them. What they really needed were insights and direction—something to give them a running start.
                </p>
                
                <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800 mb-6">
                  <h4 className="font-semibold text-red-800 dark:text-red-200 mb-3">The Classic "First SaaS Mistake"</h4>
                  <p className="text-red-700 dark:text-red-300 mb-4">
                    I added feature after feature after feature, thinking "ohhh someone will love this".
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-red-100 dark:bg-red-900/30 rounded">
                      <span className="font-bold text-red-600">1st</span>
                      <span className="text-red-700 dark:text-red-300">React, using a random template</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-red-100 dark:bg-red-900/30 rounded">
                      <span className="font-bold text-red-600">2nd</span>
                      <span className="text-red-700 dark:text-red-300">Flutter (I was building some apps at the time—a life coaching app and a gym app)</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-red-100 dark:bg-red-900/30 rounded">
                      <span className="font-bold text-red-600">3rd</span>
                      <span className="text-red-700 dark:text-red-300">Still Flutter, with three different design companies involved, each making things more complicated</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Building Right Way */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Lightbulb className="w-6 h-6 text-green-500" />
              <h3 className="text-2xl font-bold text-foreground">Building for everyone—the right way</h3>
            </div>
            <Card>
              <CardContent className="p-6">
                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800 mb-6">
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-3">The Brief That Changed Everything</h4>
                  <blockquote className="text-lg italic text-green-700 dark:text-green-300 border-l-4 border-green-400 pl-4">
                    "Show me only the data we actually use when we run campaigns. Remove everything else."
                  </blockquote>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-red-200 dark:border-red-800">
                    <CardHeader>
                      <CardTitle className="text-red-600 dark:text-red-400 text-lg">Before</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">4 broken platforms crammed with buttons and half-working features</p>
                    </CardContent>
                  </Card>
                  <Card className="border-green-200 dark:border-green-800">
                    <CardHeader>
                      <CardTitle className="text-green-600 dark:text-green-400 text-lg">After (3 months)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">A single product you can log in to, subscribe to, and run scans on almost any EVM token</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-6 text-center">
                  <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
                    <CardContent className="p-6">
                      <div className="text-3xl font-bold text-primary mb-2">50%+</div>
                      <p className="text-lg font-semibold text-foreground mb-2">Cost Reduction Maintained</p>
                      <p className="text-sm text-muted-foreground">
                        Most importantly, we've been able to keep delivering that same 50%+ cost reduction for clients, time after time.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Final Message */}
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/30">
            <CardContent className="p-8 text-center">
              <h4 className="text-xl font-bold text-foreground mb-4">Today</h4>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                AudienceScan is priced so that anyone can add it to their marketing mix—even small projects with budgets of just $500/month can see the ROI.
              </p>
              <p className="text-muted-foreground mb-4">
                So once again, thanks for making it this far.
              </p>
              <p className="text-muted-foreground mb-6">
                If you have a token, if you're running marketing for a Web3 project, or if you're just curious—reach out anytime. I'd love to help. You can reach me directly at <strong className="text-primary">Niklas@AudienceScan.io</strong>.
              </p>
              <p className="text-lg font-medium text-foreground mb-2">Have an amazing day,</p>
              <p className="text-primary font-bold">// Niklas</p>
              <p className="text-sm text-muted-foreground">Founder and builder of AudienceScan</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Marketing?</h3>
          <p className="text-muted-foreground mb-8">
            Experience the same 50%+ cost reduction that Niklas talks about in this post.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8" asChild>
              <a href="https://app.audiencescan.io/signup" target="_blank" rel="noopener noreferrer">
                Try AudienceScan Free
              </a>
            </Button>
            <Button variant="outline" size="lg" className="px-8" asChild>
              <a href="mailto:Niklas@AudienceScan.io" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Contact Niklas
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogPost;