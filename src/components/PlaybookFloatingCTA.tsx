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
      className={`fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 transition-all duration-500 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
      }`}
    >
      <Link to="/strategy-playbook" className="block group">
        <div className="relative">
          {/* Pulsing glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-lg md:rounded-lg blur-xl opacity-50 group-hover:opacity-75 animate-pulse" />
          
          {/* Main card */}
          <div className="relative bg-card border-2 border-primary/30 rounded-lg md:rounded-lg p-2.5 md:p-4 shadow-2xl backdrop-blur-sm hover:scale-105 transition-all duration-300 max-w-[200px] md:max-w-xs">
            {/* Dismiss button */}
            <button
              onClick={handleDismiss}
              className="absolute -top-2 -right-2 bg-background border border-border rounded-full p-1 md:p-1.5 hover:bg-accent transition-colors z-10"
              aria-label="Dismiss"
            >
              <X className="w-3 h-3" />
            </button>

            {/* Sparkle badge */}
            <div className="absolute -top-2 -left-2 md:-top-3 md:-left-3 bg-gradient-to-r from-primary to-secondary text-white text-[10px] md:text-xs font-bold px-2 md:px-3 py-0.5 md:py-1 rounded-full flex items-center gap-1 shadow-lg animate-bounce">
              <Sparkles className="w-2.5 h-2.5 md:w-3 md:h-3" />
              FREE
            </div>

            <div className="flex items-center md:items-start gap-2 md:gap-3">
              {/* Icon */}
              <div className="bg-gradient-to-br from-primary to-secondary p-2 md:p-3 rounded-lg flex-shrink-0">
                <BookOpen className="w-4 h-4 md:w-6 md:h-6 text-white" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm md:text-base mb-0 md:mb-1 group-hover:text-primary transition-colors leading-tight">
                  10-Step Strategy
                </h3>
                <p className="hidden md:block text-xs text-muted-foreground leading-relaxed mb-2">
                  The exact playbook we use to deliver 50%+ cost reductions
                </p>
                
                {/* CTA text with arrow */}
                <div className="flex items-center gap-1 text-[10px] md:text-xs font-semibold text-primary">
                  <span className="md:hidden">View playbook</span>
                  <span className="hidden md:inline">Start implementing now</span>
                  <span className="group-hover:translate-x-1 transition-transform inline-block">
                    →
                  </span>
                </div>
              </div>
            </div>

            {/* Progress indicator - hidden on mobile */}
            <div className="hidden md:block mt-3 pt-3 border-t border-border/50">
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