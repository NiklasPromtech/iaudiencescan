import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, MousePointerClick, Download, Puzzle, Eye } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MockClickHeatmap } from "@/components/landing/MockClickHeatmap";

const steps = [
  {
    icon: Download,
    title: "Install the extension",
    body: "Download the AudienceScan browser extension from your settings page. It works in any Chromium-based browser.",
  },
  {
    icon: Puzzle,
    title: "Add it from settings",
    body: "Open Settings → Integrations to grab the extension and pair it with your website. Setup takes under a minute.",
  },
  {
    icon: Eye,
    title: "See real click counts",
    body: "Browse your live site with the extension on. Every button, link, and CTA is overlaid with the real number of clicks it received.",
  },
];

const HowExtension = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </Link>

            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 border border-primary/30 flex items-center justify-center">
                <MousePointerClick className="w-4 h-4 text-primary" />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Pillar 02
              </span>
            </div>

            <h1 className="font-bold text-3xl md:text-5xl text-foreground mb-4">
              See where people <span className="underline decoration-primary decoration-2 underline-offset-4">click</span>.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-2xl">
              A browser extension overlays real click counts on every button on your live site. Install it, pair it with your website, and start seeing what actually gets clicked.
            </p>

            <div className="mb-12">
              <MockClickHeatmap />
            </div>

            <div className="grid md:grid-cols-3 gap-5 mb-12">
              {steps.map((s) => (
                <div key={s.title} className="border border-border bg-card p-6">
                  <div className="w-10 h-10 border border-primary/30 flex items-center justify-center mb-4">
                    <s.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
                </div>
              ))}
            </div>

            <div className="border border-border bg-muted/30 p-6 mb-12">
              <p className="text-sm text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground">Setup details:</span> Find the extension download and pairing instructions in{" "}
                <Link to="/settings/integrations" className="text-primary underline underline-offset-4">
                  Settings → Integrations
                </Link>
                .
              </p>
            </div>

            <div className="border border-border bg-card p-8 text-center">
              <h2 className="font-semibold text-xl text-foreground mb-3">Ready to see your clicks?</h2>
              <p className="text-sm text-muted-foreground mb-6">Sign up to download the extension and pair it with your site.</p>
              <Link
                to="/auth"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 font-mono text-xs uppercase tracking-widest hover:opacity-90 transition-opacity"
              >
                Get started <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HowExtension;
