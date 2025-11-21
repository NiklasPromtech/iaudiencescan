import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Import the uploaded images
import createEventImage from "/lovable-uploads/b45bfeb9-7ddd-4bac-a5c0-dc4cb34d6335.png";
import explorationImage from "/lovable-uploads/e0fb1a25-523d-42c5-b250-4097d4c6a3ad.png";
import explorationsMenuImage from "/lovable-uploads/badb5765-bdbf-4aed-a1bb-d463f7a5c20e.png";
import createWithoutCodeImage from "/lovable-uploads/a593ded6-42aa-449c-9b4c-f363de4d0739.png";

const BlogPostTracking = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            Tutorial
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent leading-[2]">
            Tracking, Tracking, Tracking
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Since this keeps coming up in conversations, I thought it would be worth putting together a short "How To" guide for setting up tracking in Google Analytics (GA4).
          </p>
          
          {/* Meta info */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
            <span>Jan 28, 2025</span>
            <span>•</span>
            <span>6 min read</span>
          </div>

          <p className="text-lg leading-relaxed mb-12">
            Below you'll find the three key steps: setting events, creating them if they don't exist, and using them in your reports.
          </p>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            
            <h2 className="text-3xl font-bold mb-6 text-foreground">1. How to Set Key Events</h2>
            
            <p className="text-lg leading-relaxed mb-6">
              Key events are what GA4 uses to measure success. These are the actions you want to highlight — such as signups, downloads, or button clicks.
            </p>

            <Card className="p-6 mb-8 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="p-0">
                <h3 className="text-xl font-bold mb-4">Steps:</h3>
                <ol className="list-decimal list-inside space-y-2 text-lg">
                  <li>Go to the Admin panel in GA (bottom left corner).</li>
                  <li>Under Data Display, click Events.</li>
                  <li>Find the event you want to mark as important.</li>
                  <li>Click the star icon to mark it as a Key Event.</li>
                </ol>
              </CardContent>
            </Card>

            <div className="mb-12">
              <img 
                src={createEventImage} 
                alt="Google Analytics interface showing how to create an event with button_click as the event name" 
                className="w-full rounded-lg shadow-lg border"
              />
              <p className="text-sm text-muted-foreground mt-2 text-center">Creating a new event in Google Analytics with a descriptive name</p>
            </div>

            <h2 className="text-3xl font-bold mb-6 text-foreground">2. What if You Can't See Any Events?</h2>

            <p className="text-lg leading-relaxed mb-6">
              Sometimes the event you want to track isn't automatically created. In that case, you'll need to create a new event.
            </p>

            <h3 className="text-2xl font-semibold mb-4 text-foreground">Option A: Create Without Code (simple case, like page views)</h3>

            <div className="mb-8">
              <img 
                src={createWithoutCodeImage} 
                alt="Google Analytics interface showing the Create without code option for event creation" 
                className="w-full rounded-lg shadow-lg border"
              />
              <p className="text-sm text-muted-foreground mt-2 text-center">Using the "Create without code" option for simple page view tracking</p>
            </div>

            <Card className="p-6 mb-8 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-0">
                <ol className="list-decimal list-inside space-y-2 text-lg">
                  <li>In the Events screen, click Create Event.</li>
                  <li>Choose Create without code.</li>
                  <li>Set Event Name to "page_view".</li>
                  <li>Add a condition so that GA only records it when the URL contains something specific (for example, /thank-you or /pricing).</li>
                </ol>
                <p className="mt-4 text-blue-700 font-medium">
                  This is great for tracking when users land on a particular page.
                </p>
              </CardContent>
            </Card>

            <h3 className="text-2xl font-semibold mb-4 text-foreground">Option B: Create With Code (advanced case, like button clicks)</h3>

            <p className="text-lg leading-relaxed mb-6">
              If you want to track an interaction beyond just page views (e.g., a user clicking a signup button), you'll need to add a tracking snippet to your site.
            </p>

            <p className="text-lg leading-relaxed mb-4">
              Send this example code to your developer or front-end team:
            </p>

            <Card className="p-6 mb-6 bg-gray-900 text-green-400 font-mono">
              <CardContent className="p-0">
                <pre className="whitespace-pre-wrap text-sm">
{`<script>
  // Example: user clicks a button
  gtag("event", "button_click", {
    event_category: "engagement",
    event_label: "signup_button",
    value: 1
  });
</script>`}
                </pre>
              </CardContent>
            </Card>

            <Card className="p-6 mb-8 bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200">
              <CardContent className="p-0">
                <h4 className="text-lg font-bold mb-3 text-amber-800">After adding the code:</h4>
                <ol className="list-decimal list-inside space-y-2 text-amber-700">
                  <li>Return to the Events setup page in GA.</li>
                  <li>Click Create with code.</li>
                  <li>Name the event exactly as in your code (e.g., "button_click").</li>
                </ol>
              </CardContent>
            </Card>

            <h2 className="text-3xl font-bold mb-6 text-foreground">3. How to Use Key Events</h2>

            <p className="text-lg leading-relaxed mb-6">
              Once your events are created and marked as key, you'll want to use them in your reporting.
            </p>

            <div className="mb-8">
              <img 
                src={explorationsMenuImage} 
                alt="Google Analytics Explorations page showing Blank and Free form options" 
                className="w-full rounded-lg shadow-lg border"
              />
              <p className="text-sm text-muted-foreground mt-2 text-center">Starting a new exploration in Google Analytics</p>
            </div>

            <Card className="p-6 mb-8 bg-gradient-to-r from-green-50 to-green-100 border-green-200">
              <CardContent className="p-0">
                <h3 className="text-xl font-bold mb-4 text-green-800">Steps:</h3>
                <ol className="list-decimal list-inside space-y-2 text-lg text-green-700">
                  <li>In GA, click Explore in the left-hand menu.</li>
                  <li>Select Blank to create a new custom report.</li>
                  <li>Give it a name (for example: I am on top of this).</li>
                  <li>Add Event name and Is key event as a Dimension.</li>
                  <li>Add Event count as a Metric.</li>
                  <li>Drag both into your report settings.</li>
                  <li>Filter it to "Is key event" to exact match True</li>
                </ol>
              </CardContent>
            </Card>

            <div className="mb-8">
              <img 
                src={explorationImage} 
                alt="Google Analytics exploration interface showing dimensions like Event name and Is key event with metrics" 
                className="w-full rounded-lg shadow-lg border"
              />
              <p className="text-sm text-muted-foreground mt-2 text-center">Setting up dimensions and metrics in your custom exploration report</p>
            </div>

            <p className="text-lg leading-relaxed mb-8">
              This will give you a clear breakdown of how often each key event is triggered — and by who.
            </p>

            <h2 className="text-3xl font-bold mb-6 text-foreground">4. Wrap Up</h2>

            <p className="text-lg leading-relaxed mb-8">
              Once you've set this up, you'll be able to confidently answer your stakeholders' questions about which actions users are taking and where they're coming from.
            </p>

            <Card className="p-8 bg-gradient-to-r from-primary to-primary/80 text-white">
              <CardContent className="p-0 text-center">
                <h3 className="text-2xl font-bold mb-4">Tracking, tracking, tracking — done.</h3>
                <p className="text-lg opacity-90">
                  With proper event tracking in place, you'll have the data you need to make informed decisions about your marketing campaigns and user experience improvements.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPostTracking;