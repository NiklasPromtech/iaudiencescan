import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "How to Build High-Converting Web3 Audiences",
      excerpt: "Learn the strategies top Web3 projects use to identify and target their ideal users through wallet data analysis.",
      date: "Dec 15, 2024",
      readTime: "5 min read",
      category: "Strategy",
      featured: true
    },
    {
      id: 2,
      title: "The Ultimate Guide to Wallet-Based Marketing",
      excerpt: "Discover how wallet data can revolutionize your marketing campaigns and increase conversion rates by 300%.",
      date: "Dec 10, 2024",
      readTime: "8 min read",
      category: "Guide"
    },
    {
      id: 3,
      title: "Case Study: How Protocol X Increased User Acquisition by 400%",
      excerpt: "Deep dive into how a major DeFi protocol used audience segmentation to dramatically improve their marketing ROI.",
      date: "Dec 5, 2024",
      readTime: "6 min read",
      category: "Case Study"
    },
    {
      id: 4,
      title: "Understanding On-Chain Behavior Patterns",
      excerpt: "A technical guide to interpreting wallet transaction data and what it reveals about user intent and preferences.",
      date: "Nov 28, 2024",
      readTime: "7 min read",
      category: "Technical"
    },
    {
      id: 5,
      title: "Privacy-First Audience Building in Web3",
      excerpt: "How to build effective marketing audiences while respecting user privacy and following best practices.",
      date: "Nov 20, 2024",
      readTime: "4 min read",
      category: "Privacy"
    },
    {
      id: 6,
      title: "Integrating AudienceScan with Your Marketing Stack",
      excerpt: "Step-by-step guide to connecting AudienceScan with Google Ads, Mailchimp, and other popular marketing tools.",
      date: "Nov 15, 2024",
      readTime: "6 min read",
      category: "Integration"
    }
  ];

  const categories = ["All", "Strategy", "Guide", "Case Study", "Technical", "Privacy", "Integration"];

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
                    <Button className="group">
                      Read More
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-primary/20 to-primary/10 h-64 md:h-auto">
                  {/* Placeholder for featured image */}
                </div>
              </div>
            </Card>
          ))}

          {/* Blog Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.filter(post => !post.featured).map((post) => (
              <Card key={post.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 h-48 rounded-t-lg">
                  {/* Placeholder for blog image */}
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