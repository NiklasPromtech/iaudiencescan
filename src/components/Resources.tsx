import { Link } from "react-router-dom";
import { Zap, BarChart3, Target, BookOpen, Mail } from "lucide-react";

const cards = [
  {
    icon: Zap,
    title: "Install Guide",
    description:
      "Place the tag and see data in under 5 minutes. Step-by-step with video.",
    link: "/blog/tracking",
  },
  {
    icon: BarChart3,
    title: "Understanding Your Dashboard",
    description: "What every metric means and what to do about it.",
    link: "/blog/what-am-i-looking-at",
  },
  {
    icon: Target,
    title: "Run Your First Scan",
    description:
      "Turn wallet data into X, Telegram, and Reddit targeting lists.",
    link: "/blog/tutorials",
  },
  {
    icon: BookOpen,
    title: "Case Studies",
    description:
      "Real campaigns: 84% lower CPA on DV360, 66% on Telegram, 3× conversions on X.",
    link: "/case-studies",
  },
];

const Resources = () => {
  return (
    <section id="resources" className="py-24 bg-muted/20">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Label + heading */}
        <p className="font-mono text-[10px] uppercase tracking-widest text-primary mb-4">
          Resources
        </p>
        <h2 className="font-bold text-3xl md:text-4xl text-foreground mb-12">
          Everything you need to get started.
        </h2>

        {/* 2×2 grid */}
        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          {cards.map((card) => (
            <div
              key={card.title}
              className="border border-border bg-card p-6 flex flex-col"
            >
              <div className="w-10 h-10 border border-primary/30 flex items-center justify-center mb-4">
                <card.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">
                {card.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                {card.description}
              </p>
            </div>
          ))}
        </div>

        {/* FAQ callout */}
        <div className="border border-border bg-card p-6 mb-6">
          <p className="text-sm text-muted-foreground">
            Have questions about data security, privacy compliance, or whether
            the tool works without paid ads?{" "}
            <Link
              to="/faq"
              className="text-primary hover:underline font-medium"
            >
              Check our FAQ
            </Link>
            .
          </p>
        </div>

        {/* Support */}
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <Mail className="w-4 h-4" />
          Need help? Reach us at{" "}
          <a
            href="mailto:support@audiencescan.io"
            className="text-primary hover:underline"
          >
            support@audiencescan.io
          </a>
        </p>
      </div>
    </section>
  );
};

export default Resources;
