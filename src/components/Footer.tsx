import audienceScanIcon from "@/assets/audiencescan-icon.png";
import xLogo from "@/assets/x-logo.png";
import telegramLogo from "@/assets/telegram-logo.png";

const sections = [
  {
    title: "Company",
    links: [
      { label: "GA Alternative", href: "/ga-alternative" },
      { label: "Compare", href: "/compare" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Support", href: "mailto:support@audiencescan.io" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="border-t border-border py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={audienceScanIcon}
                alt="AudienceScan Logo"
                className="h-8 w-8 rounded-md"
              />
              <span className="text-lg font-bold text-foreground">AudienceScan</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Web3 analytics that connects website visitors to wallet intelligence. Built by marketers who've scaled crypto projects.
            </p>
            <div className="flex gap-3 mt-5">
              <a
                href="https://www.linkedin.com/company/audiencescanio/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-muted hover:bg-primary rounded-full flex items-center justify-center transition-colors group"
              >
                <img src="/lovable-uploads/1df0ea7a-b66d-48b6-9c07-db35b36a8798.png" alt="LinkedIn" className="w-4 h-4 grayscale brightness-75 group-hover:brightness-0 group-hover:invert transition-all" />
              </a>
              <a
                href="https://t.me/audienceScan"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-muted hover:bg-primary rounded-full flex items-center justify-center transition-colors group"
              >
                <img src={telegramLogo} alt="Telegram" className="w-4 h-4 grayscale brightness-75 group-hover:brightness-0 group-hover:invert transition-all" />
              </a>
              <a
                href="https://x.com/AudienceScanIO"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-muted hover:bg-primary rounded-full flex items-center justify-center transition-colors group"
              >
                <img src={xLogo} alt="X" className="w-4 h-4 grayscale brightness-75 group-hover:brightness-0 group-hover:invert transition-all" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {sections.map((s) => (
            <div key={s.title}>
              <h4 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">
                {s.title}
              </h4>
              <ul className="space-y-2.5">
                {s.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="text-sm text-foreground/80 hover:text-primary transition-colors">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border mt-12 pt-8 text-center">
          <p className="text-xs text-muted-foreground">
            © 2026 AudienceScan. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
