import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, TrendingUp } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const BlogPostTutorials = () => {
  const tutorials = [
    {
      title: "How to Create a Scan",
      description: "A short video showing how to create a scan of wallets that transacts a token.",
      videoId: "1132464448",
      note: "This is a good approach if you're looking at a token that offers a staking contract or liquidity pools that might reduce the number of holders of the token."
    },
    {
      title: "How to Setup X/Twitter Ads Campaign",
      description: "Step-by-step guide to setting up targeted Twitter advertising campaigns using AudienceScan data.",
      videoId: "1097756665/ce816fa0d3"
    },
    {
      title: "How to Setup a DV360 Ads Campaign",
      description: "Complete walkthrough for creating Display & Video 360 campaigns with audience insights.",
      videoId: "1097756631/70f4ec5a88"
    },
    {
      title: "How to Setup a Reddit Ads Campaign",
      description: "Learn to target the right communities and users on Reddit using your audience data.",
      videoId: "1097756647/51436e5a2d"
    },
    {
      title: "How to Setup a Telegram Ads Campaign",
      description: "Target Telegram users effectively with data-driven advertising strategies.",
      videoId: "1097756659/976a621ca6"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Tutorials
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent pb-2">
            AudienceScan Video Tutorials
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Master AudienceScan and learn how to create high-performing ad campaigns across all major platforms
          </p>
        </div>

        {/* Performance Stats */}
        <Card className="max-w-4xl mx-auto mb-16 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-4">
              <TrendingUp className="h-8 w-8 text-primary" />
              <h2 className="text-2xl font-bold">Proven Results</h2>
            </div>
            <p className="text-lg text-muted-foreground">
              Across all platforms, we have consistently generated a <span className="font-bold text-primary">cost per action 50% below</span> the cost of guessing where to find your audience or letting the platform optimize for itself. Data-driven targeting delivers real results.
            </p>
          </CardContent>
        </Card>

        {/* Tutorial Videos */}
        <div className="max-w-6xl mx-auto space-y-12">
          {tutorials.map((tutorial, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Play className="h-6 w-6 text-primary" />
                  <CardTitle className="text-2xl">{tutorial.title}</CardTitle>
                </div>
                <p className="text-muted-foreground">{tutorial.description}</p>
                {tutorial.note && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800 font-medium">
                      💡 Tip: {tutorial.note}
                    </p>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="aspect-video w-full">
                  <iframe
                    src={`https://player.vimeo.com/video/${tutorial.videoId.includes('/') ? tutorial.videoId.split('/')[0] : tutorial.videoId}?${tutorial.videoId.includes('/') ? `h=${tutorial.videoId.split('/')[1]}&` : ''}badge=0&autopause=0&player_id=0&app_id=58479`}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    title={tutorial.title}
                    className="rounded-lg"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <Card className="max-w-4xl mx-auto mt-16 bg-gradient-to-r from-primary to-primary/80 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Campaign?</h2>
            <p className="text-xl mb-6 opacity-90">
              Use these tutorials to create your first AudienceScan and launch targeted campaigns that deliver results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://app.audiencescan.io/signup"
                className="inline-flex items-center justify-center px-8 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                rel="noindex"
              >
                Start Your Scan
              </a>
              <a
                href="https://t.me/audienceScan"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
              >
                Get Support
              </a>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPostTutorials;