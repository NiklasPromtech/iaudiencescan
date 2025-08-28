import { useState } from "react";
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
  const [selectedCategory, setSelectedCategory] = useState("All");
  const blogPosts = [
    {
      id: 1,
      title: "What is it I am looking at?",
      excerpt: "A complete breakdown of your AudienceScan results and how to interpret the data that drives 50%+ cost reductions.",
      date: "Aug 28, 2025",
      readTime: "8 min read",
      category: "Guide",
      featured: false,
    },
    {
      id: 2,
      title: "The AudienceScan ROI: Why 50%+ Cost Reduction is Standard",
      excerpt: "Discover the numbers behind AudienceScan's consistent performance and calculate your potential savings with our interactive ROI calculator.",
      date: "Jul 30, 2025",
      readTime: "5 min read",
      category: "ROI Analysis",
      featured: false,
    },
    {
      id: 3,
      title: "A Personal Letter to New Users of AudienceScan",
      excerpt: "Hi, I'm Niklas, the founder of AudienceScan. I want to share how and why we ended up launching AudienceScan, from my early digital marketing days to building a tool that consistently delivers 50%+ cost reductions.",
      date: "Jan 29, 2025",
      readTime: "8 min read",
      category: "Founder's Letter",
      featured: false,
    },
    {
      id: 4,
      title: "AudienceScan Video Tutorials",
      excerpt: "Master AudienceScan and learn how to create high-performing ad campaigns across all major platforms. Includes step-by-step tutorials for Twitter, DV360, Reddit, and Telegram advertising.",
      date: "Mar 29, 2025",
      readTime: "12 min read",
      category: "Tutorials",
      featured: true,
    },
    {
      id: 5,
      title: "Turning Blockchain Data Into Addressable Audiences with AudienceScan",
      excerpt: "Running ads for crypto projects has always felt like throwing darts in a blackout. AudienceScan changes this by flipping the targeting process on its head, turning blockchain data into truly addressable audiences.",
      date: "Jun 28, 2025",
      readTime: "7 min read",
      category: "Strategy",
      featured: false,
    },
    {
      id: 5,
      title: "Guaranteed Results: We Put Our Money Where Our Mouth Is",
      excerpt: "50%+ cost reduction guaranteed or your money back. We're so confident in our results, we offer a full money-back guarantee for Pro subscribers.",
      date: "Jul 20, 2025",
      readTime: "5 min read",
      category: "Guarantee",
      featured: false,
    },
    {
      id: 6,
      title: "AudienceScan Ads",
      excerpt: "Over the years, AudienceScan has grown out of real hands-on work in the Web3 space. We offer comprehensive paid marketing services across all major platforms.",
      date: "Aug 6, 2025",
      readTime: "6 min read",
      category: "Services",
      featured: false,
    },
    {
      id: 7,
      title: "Tracking, Tracking, Tracking",
      excerpt: "A short 'How To' guide for setting up tracking in Google Analytics (GA4). Learn how to set key events, create them if they don't exist, and use them in your reports.",
      date: "Aug 20, 2025",
      readTime: "6 min read",
      category: "Tutorials",
      featured: false,
    },
    {
      id: 8,
      title: "Differentiate Your Agency From the Sea of Sameness",
      excerpt: "Most agencies walk into pitches with the same tired decks. Learn how to use AudienceScan data in Looker Studio to create unique, data-backed presentations that win clients.",
      date: "Aug 21, 2025",
      readTime: "8 min read",
      category: "Strategy",
      featured: false,
    }
  ];

  const categories = ["All", "ROI Analysis", "Tutorials", "Founder's Letter", "Strategy", "Guarantee", "Services"];

  const filteredPosts = selectedCategory === "All" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

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
                variant={category === selectedCategory ? "default" : "outline"}
                size="sm"
                className="rounded-full hover:text-foreground"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Featured Post */}
          {filteredPosts.filter(post => post.featured).map((post) => (
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
                      onClick={() => {
                        if (post.id === 1) {
                          navigate('/blog/roi');
                        } else if (post.id === 3) {
                          navigate('/blog/tutorials');
                        } else if (post.id === 5) {
                          navigate('/blog/guaranteed-results');
                        } else {
                          navigate('/blog/personal-letter');
                        }
                      }}
                    >
                      Read More
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 h-64 md:h-auto flex items-center justify-center p-8">
                  <div className="flex items-center gap-8">
                    {/* X/Twitter Icon */}
                    <div className="w-24 h-24 rounded-full flex items-center justify-center">
                      <img 
                        src="/lovable-uploads/03b5d5a7-4a63-4682-bc47-fc87dfa9ed89.png"
                        alt="X/Twitter platform icon"
                        className="w-16 h-16"
                      />
                    </div>
                    
                    {/* Play Button */}
                    <div className="w-28 h-28 rounded-full flex items-center justify-center">
                      <img 
                        src="/lovable-uploads/39f0b36e-f0ea-425c-9f73-b75e874f0f67.png"
                        alt="Video play button"
                        className="w-18 h-18"
                      />
                    </div>
                    
                    {/* Telegram Icon */}
                    <div className="w-24 h-24 rounded-full flex items-center justify-center">
                      <img 
                        src="/lovable-uploads/1de3c902-4d9e-43de-92bd-56b825590bd8.png"
                        alt="Telegram platform icon"
                        className="w-16 h-16"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {/* Blog Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.filter(post => !post.featured).map((post) => (
              <Card 
                key={post.id} 
                className="group hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => {
                  if (post.id === 1) {
                    navigate('/blog/what-am-i-looking-at');
                  } else if (post.id === 2) {
                    navigate('/blog/roi');
                  } else if (post.id === 3) {
                    navigate('/blog/personal-letter');
                  } else if (post.id === 4) {
                    navigate('/blog/tutorials');
                  } else if (post.id === 5) {
                    navigate('/blog/addressable-audiences');
                  } else if (post.id === 6) {
                    navigate('/blog/guaranteed-results');
                  } else if (post.id === 7) {
                    navigate('/blog/audiencescan-ads');
                  } else if (post.id === 8) {
                    navigate('/blog/tracking');
                  } else if (post.id === 9) {
                    navigate('/blog/agency-differentiation');
                  } else {
                    navigate(`/blog/${post.id}`);
                  }
                }}
              >
                 <div className="bg-gradient-to-br from-primary/10 to-primary/5 h-48 rounded-t-lg overflow-hidden p-4">
                   {post.id === 1 && (
                     <div className="flex items-center justify-center h-full">
                       <img 
                         src="/lovable-uploads/c9468e33-7558-4144-8a93-2f37dafeeecc.png" 
                         alt="ROI text in purple gradient"
                         className="w-full h-auto object-cover rounded"
                       />
                     </div>
                   )}
                   {post.id === 2 && (
                     <div>
                       <img 
                         src="/lovable-uploads/163f606c-595d-49e0-8e7a-7276e10450ab.png" 
                         alt="Network chart showing audience data connections"
                         className="w-full h-full object-contain"
                       />
                     </div>
                   )}
                   {post.id === 4 && (
                     <div className="flex items-center justify-center h-full">
                       <img 
                         src="/lovable-uploads/2bb532a9-c9e2-4310-a6f0-b36ffd0d6c19.png" 
                         alt="Blockchain data visualization showing addressable audiences"
                         className="w-full h-auto object-cover rounded"
                       />
                     </div>
                   )}
                    {post.id === 5 && (
                      <div className="flex items-center justify-center h-full">
                        <img 
                          src="/lovable-uploads/6fc508c7-ce47-40eb-847c-8511097c3ede.png" 
                          alt="Money Back 100% Guarantee badge"
                          className="w-full h-auto object-cover rounded"
                        />
                      </div>
                    )}
                     {post.id === 6 && (
                       <div className="flex items-center justify-center h-full">
                         <img 
                           src="/lovable-uploads/1d9776f1-1e66-4502-8cbf-01934910df52.png" 
                           alt="AudienceScan Analytics Icon"
                           className="w-24 h-24 object-contain"
                         />
                       </div>
                     )}
                      {post.id === 7 && (
                        <div className="flex items-center justify-center h-full">
                          <img 
                            src="/lovable-uploads/b45bfeb9-7ddd-4bac-a5c0-dc4cb34d6335.png" 
                            alt="Google Analytics tracking dashboard"
                            className="w-full h-auto object-cover rounded"
                          />
                        </div>
                      )}
                      {post.id === 8 && (
                        <div className="flex items-center justify-center h-full">
                          <img 
                            src="/lovable-uploads/f0cabb29-b0ec-45c9-ac40-e40566a59905.png" 
                            alt="Looker Studio dashboard showing agency data analysis"
                            className="w-full h-auto object-cover rounded"
                          />
                        </div>
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