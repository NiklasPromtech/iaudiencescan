import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const BlogPostAgencyDifferentiation = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <article className="container mx-auto px-4 py-16 max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/blog')}
          className="mb-8 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog
        </Button>

        <header className="mb-12">
          <h1 className="text-h1 font-bold text-foreground mb-6">
            Differentiate Your Agency From the Sea of Sameness
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Aug 21, 2025</span>
            <span>•</span>
            <span>8 min read</span>
            <span>•</span>
            <span>Strategy</span>
          </div>
        </header>

        <div className="prose prose-lg max-w-none text-foreground">
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Most agencies walk into a pitch with the same tired decks, the same recycled strategies, and the same promises. Clients have heard it all before.
          </p>

          <p className="mb-6">
            But what if you walked in and said:
          </p>

          <blockquote className="border-l-4 border-primary pl-6 py-4 bg-muted/50 rounded-r-lg mb-8">
            <p className="text-lg font-medium italic">
              "We did an on-chain analysis of your users and competitors and found some surprising insights we'd like to show you."
            </p>
          </blockquote>

          <p className="mb-6">
            That one line changes everything. You're no longer "just another agency." You're the one who came in with real data that nobody else has.
          </p>

          <p className="mb-8">
            This is exactly how we gave our agency an unfair edge for years — quietly using AudienceScan to back our pitches with blockchain data. Now, we've made it easy for you to do the same.
          </p>

          <p className="mb-8 font-semibold">
            Here's the exact playbook:
          </p>

          <div className="border-t border-muted my-12"></div>

          <h2 className="text-2xl font-bold mb-6">Step 1: Export the Data</h2>
          
          <p className="mb-6">
            Use AudienceScan to export overlap data for any token community.
          </p>

          <p className="mb-6 text-primary font-medium">
            👉 [Insert short video / gif of export flow]
          </p>

          <p className="mb-8">
            <a href="https://vimeo.com/1111983156?share=copy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
              Video link: https://vimeo.com/1111983156?share=copy
            </a>
          </p>

          <div className="border-t border-muted my-12"></div>

          <h2 className="text-2xl font-bold mb-6">Step 2: Load Into Google Sheets</h2>
          
          <p className="mb-6">
            Take that export and drop it straight into Google Sheets.
          </p>

          <div className="bg-muted/30 rounded-lg p-6 mb-8">
            <img 
              src="/lovable-uploads/18968c8d-6657-40ad-a4d1-c288ee9e62fb.png"
              alt="Google Sheets with Mog Coin sample data showing token analysis"
              className="w-full rounded-lg border"
            />
            <p className="text-sm text-muted-foreground mt-2 text-center">
              Screenshot of example sheet with token data
            </p>
          </div>

          <p className="mb-8">
            Don't want to start from scratch?<br />
            Here's a sample sheet you can copy: [Link to Sample GSheet]
          </p>

          <div className="border-t border-muted my-12"></div>

          <h2 className="text-2xl font-bold mb-6">Step 3: Connect Google Sheets to Looker Studio</h2>
          
          <p className="mb-6">
            Open Looker Studio and connect it directly to your Google Sheet.
          </p>

          <div className="bg-muted/30 rounded-lg p-6 mb-8">
            <img 
              src="/lovable-uploads/918ec6c4-ae11-43ae-888c-9696b8a9e24e.png"
              alt="Looker Studio connection interface showing Google Connectors"
              className="w-full rounded-lg border"
            />
            <p className="text-sm text-muted-foreground mt-2 text-center">
              Screenshot of the connection window
            </p>
          </div>

          <p className="mb-8">
            This is where the magic starts to happen.
          </p>

          <div className="border-t border-muted my-12"></div>

          <h2 className="text-2xl font-bold mb-6">Step 4: Add Logos as Images</h2>
          
          <p className="mb-6">
            Numbers are fine, but logos make your dashboard client-ready. Show them visually which tokens their audience overlaps with.
          </p>

          <div className="bg-muted/30 rounded-lg p-6 mb-8">
            <img 
              src="/lovable-uploads/1d77ddce-2134-4432-b593-4f2bde1fd074.png"
              alt="Field configuration in Looker Studio showing dimensions and data types"
              className="w-full rounded-lg border"
            />
            <p className="text-sm text-muted-foreground mt-2 text-center">
              Screenshot of field configuration with logo mapping
            </p>
          </div>

          <div className="border-t border-muted my-12"></div>

          <h2 className="text-2xl font-bold mb-6">Step 5: Clean the Data (Filter Tokens Without Logos)</h2>
          
          <p className="mb-6">
            Quick cleanup step: filter out tokens without logos to keep the dashboard polished. You're not just showing data — you're showing a story.
          </p>

          <div className="bg-muted/30 rounded-lg p-6 mb-8">
            <img 
              src="/lovable-uploads/cd60bbbb-54eb-49ab-a295-92ab3486fa08.png"
              alt="Create Filter dialog in Looker Studio for excluding null logos"
              className="w-full rounded-lg border"
            />
            <p className="text-sm text-muted-foreground mt-2 text-center">
              Filter setup to exclude tokens without logos
            </p>
          </div>

          <div className="border-t border-muted my-12"></div>

          <h2 className="text-2xl font-bold mb-6">Step 6: Your Base Dashboard (Do Whatever You Want With It)</h2>
          
          <p className="mb-6">
            And here it is — your agency's new secret weapon.
          </p>

          <div className="bg-muted/30 rounded-lg p-6 mb-8">
            <img 
              src="/lovable-uploads/f0cabb29-b0ec-45c9-ac40-e40566a59905.png"
              alt="Finished Looker Studio dashboard showing Your agency with token logos and community data"
              className="w-full rounded-lg border"
            />
            <p className="text-sm text-muted-foreground mt-2 text-center">
              Screenshot of the finished Looker dashboard
            </p>
          </div>

          <p className="mb-8">
            It's a flexible base you can adapt however you like:
          </p>

          <ul className="mb-8 space-y-2 pl-6">
            <li>• Competitor analysis</li>
            <li>• Audience overlap reports</li>
            <li>• Campaign targeting proposals</li>
          </ul>

          <div className="border-t border-muted my-12"></div>

          <h2 className="text-2xl font-bold mb-6">How to Use It in a Pitch</h2>
          
          <p className="mb-6">
            Here's the line again — it works:
          </p>

          <blockquote className="border-l-4 border-primary pl-6 py-4 bg-muted/50 rounded-r-lg mb-8">
            <p className="text-lg font-medium italic">
              "We did an on-chain analysis of your users and competitors and found some interesting insights back."
            </p>
          </blockquote>

          <p className="mb-8">
            Drop in your Looker dashboard as a slide, and suddenly your pitch isn't generic anymore. It's unique, data-backed, and impossible to ignore.
          </p>

          <div className="border-t border-muted my-12"></div>

          <h2 className="text-2xl font-bold mb-6">Wrap-Up: Why This Works</h2>
          
          <p className="mb-6">
            We've used this exact process internally for years to win pitches and cut ad costs by around 50%. Now it's easier than ever for agencies like yours to replicate it — with AudienceScan, Google Sheets, and Looker Studio.
          </p>

          <p className="mb-8">
            You don't need another growth hack. You don't need to out-spend your competitors. You just need to show up with something nobody else has.
          </p>

          <div className="border-t border-muted my-12"></div>

          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">🚀 Epic Selling Phrase / CTA</h2>
            
            <p className="text-lg mb-6">
              Agencies that use AudienceScan don't just pitch clients.<br />
              They walk in with proof, own the room, and win the budget.
            </p>

            <p className="mb-6 font-medium">
              Differentiate yourself — or blend into the sea of sameness. The choice is yours.
            </p>

            <Button size="lg" className="font-semibold">
              👉 Start with AudienceScan today
            </Button>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogPostAgencyDifferentiation;