import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const BlogPostAudienceScanAds = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 pt-32 pb-16 max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/blog")}
          className="mb-8 p-0 h-auto text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Button>

        <article className="prose prose-lg max-w-none">
          <header className="mb-12">
            <h1 className="text-h1 font-bold mb-6 text-foreground">
              AudienceScan Ads
            </h1>
            <div className="flex items-center gap-4 text-muted-foreground text-p2">
              <span>Aug 6, 2025</span>
              <span>•</span>
              <span>6 min read</span>
            </div>
          </header>

          <div className="space-y-6 text-foreground">
            <p className="text-lg leading-relaxed">
              Over the years, AudienceScan has grown out of real hands-on work in the Web3 space.
            </p>
            
            <p className="text-lg leading-relaxed">
              If you're curious about the full story, you can{' '}
              <a 
                href="/blog/founders-letter" 
                className="text-primary hover:underline font-medium"
              >
                read my personal letter here →
              </a>
            </p>

            <p className="text-lg leading-relaxed">
              And if you're looking for help with paid marketing in Web3, this is where we can step in:
            </p>

            <ul className="space-y-2 text-lg pl-6">
              <li>• Paid X (Twitter)</li>
              <li>• Paid DV360 (Google Display)</li>
              <li>• Paid Telegram</li>
              <li>• Paid Reddit</li>
              <li>• DM campaigns on X</li>
              <li>• DM campaigns on Telegram</li>
              <li>• Tracking setup (Google Tag Manager)</li>
            </ul>

            <p className="text-lg leading-relaxed font-medium">
              Time and time again, we've been able to cut cost-per-on-site-action by 50% or more for Web3 projects.
            </p>

            <p className="text-lg leading-relaxed">
              You can explore real campaign data under{' '}
              <a 
                href="/case-studies" 
                className="text-primary hover:underline font-medium"
              >
                Case Studies →
              </a>
            </p>

            <p className="text-lg leading-relaxed">
              Or, if you'd rather run campaigns yourself,{' '}
              <a 
                href="/#cta" 
                className="text-primary hover:underline font-medium"
              >
                sign up here →
              </a>
            </p>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPostAudienceScanAds;