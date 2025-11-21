import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const PlaybookFloatingCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if user has dismissed it before
    const dismissed = sessionStorage.getItem("playbook_cta_dismissed");
    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    // Show after 2 seconds with animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsVisible(false);
    setIsDismissed(true);
    sessionStorage.setItem("playbook_cta_dismissed", "true");
  };

  if (isDismissed) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
      }`}
    >
      <Link to="/strategy-playbook" className="block group">
        <div className="relative">
          {/* Pulsing glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-2xl blur-xl opacity-50 group-hover:opacity-75 animate-pulse" />
          
          {/* Main card */}
          <div className="relative bg-card border-2 border-primary/30 rounded-2xl p-4 shadow-2xl backdrop-blur-sm hover:scale-105 transition-all duration-300 max-w-xs">
            {/* Dismiss button */}
            <button
              onClick={handleDismiss}
              className="absolute -top-2 -right-2 bg-background border border-border rounded-full p-1.5 hover:bg-accent transition-colors z-10"
              aria-label="Dismiss"
            >
              <X className="w-3 h-3" />
            </button>

            {/* Sparkle badge */}
            <div className="absolute -top-3 -left-3 bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg animate-bounce">
              <Sparkles className="w-3 h-3" />
              FREE
            </div>

            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className="bg-gradient-to-br from-primary to-secondary p-3 rounded-xl flex-shrink-0">
                <BookOpen className="w-6 h-6 text-white" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base mb-1 group-hover:text-primary transition-colors">
                  Get the 10-Step Strategy
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                  The exact playbook we use to deliver 50%+ cost reductions
                </p>
                
                {/* CTA text with arrow */}
                <div className="flex items-center gap-1 text-xs font-semibold text-primary">
                  <span>Start implementing now</span>
                  <span className="group-hover:translate-x-1 transition-transform inline-block">
                    →
                  </span>
                </div>
              </div>
            </div>

            {/* Progress indicator */}
            <div className="mt-3 pt-3 border-t border-border/50">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>10 tasks • 62 steps</span>
                <span className="text-primary font-medium">Track progress ✓</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PlaybookFloatingCTA;