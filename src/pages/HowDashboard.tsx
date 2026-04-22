import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, LayoutDashboard, Sparkles, Pin, RefreshCw } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MockQueryDashboard } from "@/components/landing/MockQueryDashboard";

const steps = [
  {
    icon: Sparkles,
    title: "Ask the SQL assistant",
    body: "Describe what you want to know in plain English. The built-in AI assistant writes the SQL against your raw event data — no schema memorisation needed.",
  },
  {
    icon: Pin,
    title: "Pin queries as tiles",
    body: "Save any query and pin it to a dashboard. Each tile renders the result as a number, table, or chart.",
  },
  {
    icon: RefreshCw,
    title: "It updates itself",
    body: "Tiles refresh on every load so your dashboard always reflects the latest data. Stitch together as many as you need.",
  },
];

const HowDashboard = () => {
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
                <LayoutDashboard className="w-4 h-4 text-primary" />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Pillar 01
              </span>
            </div>

            <h1 className="font-bold text-3xl md:text-5xl text-foreground mb-4">
              Build your own <span className="underline decoration-primary decoration-2 underline-offset-4">dashboard</span>.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-2xl">
              Pin queries as tiles. They update themselves. The SQL assistant figures out how to query your raw data — you stitch the dashboard from there.
            </p>

            <div className="border border-border bg-card mb-12">
              <MockQueryDashboard />
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

            <div className="border border-border bg-card p-8 text-center">
              <h2 className="font-semibold text-xl text-foreground mb-3">Ready to build yours?</h2>
              <p className="text-sm text-muted-foreground mb-6">Sign up, install the tag, and start pinning queries.</p>
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

export default HowDashboard;
