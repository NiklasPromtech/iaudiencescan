import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import platformIcons from "@/assets/platform-icons-circles.jpg";

const Blog = () => {
  const navigate = useNavigate();
  const blogPosts = [
    {
      id: 1,
      title: "A Personal Letter to New Users of AudienceScan",
      excerpt: "Hi, I'm Niklas, the founder of AudienceScan. I want to share how and why we ended up launching AudienceScan, from my early digital marketing days to building a tool that consistently delivers 50%+ cost reductions.",
      date: "Jan 29, 2025",
      readTime: "8 min read",
      category: "Founder's Letter",
      featured: false,
    },
    {
      id: 2,
      title: "AudienceScan Video Tutorials",
      excerpt: "Master AudienceScan and learn how to create high-performing ad campaigns across all major platforms. Includes step-by-step tutorials for Twitter, DV360, Reddit, and Telegram advertising.",
      date: "Jan 29, 2025",
      readTime: "12 min read",
      category: "Tutorials",
      featured: true,
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
50%+ reduction in costs.

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

If you have a token, if you're running marketing for a Web3 project, or if you're just curious—reach out anytime. I'd love to help. You can reach me directly at Niklas@AudienceScan.io.

Have an amazing day,

// Niklas
Founder and builder of AudienceScan`
    },
    {
      id: 3,
      title: "The Ultimate Guide to Wallet-Based Marketing",
      excerpt: "Discover how wallet data can revolutionize your marketing campaigns and increase conversion rates by 300%.",
      date: "Dec 10, 2024",
      readTime: "8 min read",
      category: "Guide"
    },
    {
      id: 4,
      title: "Case Study: How Protocol X Increased User Acquisition by 400%",
      excerpt: "Deep dive into how a major DeFi protocol used audience segmentation to dramatically improve their marketing ROI.",
      date: "Dec 5, 2024",
      readTime: "6 min read",
      category: "Case Study"
    },
    {
      id: 5,
      title: "Understanding On-Chain Behavior Patterns",
      excerpt: "A technical guide to interpreting wallet transaction data and what it reveals about user intent and preferences.",
      date: "Nov 28, 2024",
      readTime: "7 min read",
      category: "Technical"
    },
    {
      id: 6,
      title: "Privacy-First Audience Building in Web3",
      excerpt: "How to build effective marketing audiences while respecting user privacy and following best practices.",
      date: "Nov 20, 2024",
      readTime: "4 min read",
      category: "Privacy"
    },
    {
      id: 7,
      title: "Integrating AudienceScan with Your Marketing Stack",
      excerpt: "Step-by-step guide to connecting AudienceScan with Google Ads, Mailchimp, and other popular marketing tools.",
      date: "Nov 15, 2024",
      readTime: "6 min read",
      category: "Integration"
    }
  ];

  const categories = ["All", "Tutorials", "Founder's Letter", "Strategy", "Guide", "Case Study", "Technical", "Privacy", "Integration"];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-h1 font-bold text-foreground mb-6">
            Web3 Marketing Insights
          </h1>
          <p className="text-p1 text-muted-foreground max-w-2xl mx-auto">
            Stay ahead with the latest strategies, case studies, and insights from the world of Web3 marketing and audience building.
          </p>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-12 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === "All" ? "default" : "outline"}
                size="sm"
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Featured Post */}
          {blogPosts.filter(post => post.featured).map((post) => (
            <Card key={post.id} className="mb-12 overflow-hidden">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-8 flex items-center">
                  <div>
                    <Badge className="mb-4">Featured</Badge>
                    <CardTitle className="text-2xl mb-4">{post.title}</CardTitle>
                    <p className="text-muted-foreground mb-6">{post.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {post.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {post.readTime}
                      </div>
                      <Badge variant="outline">{post.category}</Badge>
                    </div>
                    <Button 
                      className="group"
                      onClick={() => navigate(post.id === 2 ? '/blog/tutorials' : '/blog/personal-letter')}
                    >
                      Read More
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-primary/20 to-primary/10 h-64 md:h-auto flex items-center justify-center p-8 relative overflow-hidden">
                  {/* Animated background particles */}
                  <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/30 rounded-full animate-ping" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
                    <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-primary/40 rounded-full animate-ping" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
                    <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-primary/25 rounded-full animate-ping" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
                  </div>
                  
                  {/* Central play button with orbiting platform icons */}
                  <div className="relative flex items-center justify-center w-full h-full">
                    {/* Central Play Button */}
                    <div className="relative z-20 group cursor-pointer">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500 animate-pulse"></div>
                      <img 
                        src="/lovable-uploads/39f0b36e-f0ea-425c-9f73-b75e874f0f67.png"
                        alt="Video play button"
                        className="relative w-24 h-24 group-hover:scale-110 transition-all duration-300 filter drop-shadow-2xl"
                      />
                    </div>
                    
                    {/* Orbiting X/Twitter Icon */}
                    <div className="absolute animate-spin" style={{ animationDuration: '20s' }}>
                      <div className="relative">
                        <div className="w-32 h-32 relative">
                          <img 
                            src="/lovable-uploads/03b5d5a7-4a63-4682-bc47-fc87dfa9ed89.png"
                            alt="X/Twitter platform icon"
                            className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 hover:scale-125 transition-all duration-300 filter drop-shadow-lg"
                            style={{ animation: 'reverse-spin 20s linear infinite' }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Orbiting Telegram Icon */}
                    <div className="absolute animate-spin" style={{ animationDuration: '25s', animationDirection: 'reverse' }}>
                      <div className="relative">
                        <div className="w-40 h-40 relative">
                          <img 
                            src="/lovable-uploads/1de3c902-4d9e-43de-92bd-56b825590bd8.png"
                            alt="Telegram platform icon"
                            className="absolute top-1/2 -right-4 transform -translate-y-1/2 w-14 h-14 hover:scale-125 transition-all duration-300 filter drop-shadow-lg"
                            style={{ animation: 'reverse-spin 25s linear infinite reverse' }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Additional floating icons for more epic feel */}
                    <div className="absolute top-8 left-8 w-8 h-8 bg-primary/20 rounded-full animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3s' }}></div>
                    <div className="absolute bottom-8 right-8 w-6 h-6 bg-primary/30 rounded-full animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '4s' }}></div>
                    <div className="absolute top-1/2 left-4 w-4 h-4 bg-primary/25 rounded-full animate-bounce" style={{ animationDelay: '2.5s', animationDuration: '3.5s' }}></div>
                  </div>
                  
                  {/* Epic gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-primary/5 pointer-events-none"></div>
                </div>
              </div>
            </Card>
          ))}

          {/* Blog Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.filter(post => !post.featured).map((post) => (
              <Card 
                key={post.id} 
                className="group hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => navigate(post.id === 1 ? '/blog/personal-letter' : `/blog/${post.id}`)}
              >
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 h-48 rounded-t-lg overflow-hidden">
                  {post.id === 1 && (
                    <img 
                      src="/lovable-uploads/163f606c-595d-49e0-8e7a-7276e10450ab.png" 
                      alt="Network chart showing audience data connections"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">{post.category}</Badge>
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Posts
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;