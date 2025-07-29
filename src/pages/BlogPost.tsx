import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
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
            <div className="flex items-center justify-center gap-4 text-muted-foreground">
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
        <div className="container mx-auto px-4 max-w-4xl">
          <Card>
            <CardContent className="p-8">
              <div className="prose prose-lg max-w-none">
                {blogPost.content.split('\n\n').map((paragraph, index) => {
                  if (paragraph.trim() === '⸻') {
                    return <hr key={index} className="my-8 border-border" />;
                  }
                  
                  if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                    return (
                      <h3 key={index} className="text-xl font-semibold mt-8 mb-4 text-foreground">
                        {paragraph.replace(/\*\*/g, '')}
                      </h3>
                    );
                  }
                  
                  if (paragraph.startsWith('•')) {
                    const items = paragraph.split('\n');
                    return (
                      <ul key={index} className="list-disc list-inside space-y-2 my-4">
                        {items.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-muted-foreground">
                            {item.replace('•', '').trim()}
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  
                  return (
                    <p key={index} className="mb-4 text-muted-foreground leading-relaxed">
                      {paragraph.split('**').map((part, partIndex) => 
                        partIndex % 2 === 1 ? 
                          <strong key={partIndex} className="font-semibold text-foreground">{part}</strong> : 
                          part
                      )}
                    </p>
                  );
                })}
              </div>
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
            <Button size="lg" className="px-8">
              Try AudienceScan Free
            </Button>
            <Button variant="outline" size="lg" className="px-8">
              Contact Niklas
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogPost;