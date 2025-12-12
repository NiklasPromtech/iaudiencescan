import { useState } from "react";
import { X, ChevronDown, ExternalLink } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface AgencyHowPanelProps {
  open: boolean;
  onClose: () => void;
}

const AgencyHowPanel = ({ open, onClose }: AgencyHowPanelProps) => {
  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-lg bg-black/95 border-l border-white/10 overflow-y-auto"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>How agencies use this data</SheetTitle>
        </SheetHeader>
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-10 py-6 pr-2">
          {/* Opening Statement - Animated */}
          <div 
            className="space-y-4"
            style={{ animation: 'fadeInUp 0.5s ease-out backwards' }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Be truly data-first
            </h2>
            <p className="text-white/60 text-base leading-relaxed">
              Most Web3 marketing starts with assumptions.
              <br />
              <span className="text-purple-400">This starts with wallets that already acted.</span>
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-white/10" />

          {/* How this is actually used - Accordions */}
          <div 
            className="space-y-3"
            style={{ animation: 'fadeInUp 0.5s 0.1s ease-out backwards' }}
          >
            <p className="text-white/40 text-xs uppercase tracking-wider mb-4">
              How this is actually used
            </p>

            <Accordion type="single" collapsible className="space-y-2">
              {/* Find the right KOLs */}
              <AccordionItem value="kols" className="border-white/10 bg-white/[0.02] rounded-xl px-4">
                <AccordionTrigger className="text-white hover:no-underline py-4">
                  <span className="text-left text-sm font-medium">Find the right KOLs</span>
                </AccordionTrigger>
                <AccordionContent className="text-white/60 text-sm pb-4">
                  <p className="mb-3">
                    Identify tokens with high overlap and reach creators already followed by those users.
                  </p>
                  <p className="text-white/40 text-xs">
                    Filter creators by follower count and relevance.
                  </p>
                </AccordionContent>
              </AccordionItem>

              {/* Support paid ads */}
              <AccordionItem value="ads" className="border-white/10 bg-white/[0.02] rounded-xl px-4">
                <AccordionTrigger className="text-white hover:no-underline py-4">
                  <span className="text-left text-sm font-medium">Support paid ads</span>
                </AccordionTrigger>
                <AccordionContent className="text-white/60 text-sm pb-4">
                  <p className="mb-4">
                    Use overlapping communities as targeting inputs across X, Reddit, Telegram, and the open web.
                  </p>
                  <div className="space-y-2">
                    <a 
                      href="/blog/tutorials" 
                      className="flex items-center gap-2 text-purple-400 hover:text-purple-300 text-xs transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View ad platform tutorials
                    </a>
                    <a 
                      href="/strategy-playbook" 
                      className="flex items-center gap-2 text-purple-400 hover:text-purple-300 text-xs transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      10-step strategy framework
                    </a>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Build a full strategy */}
              <AccordionItem value="strategy" className="border-white/10 bg-white/[0.02] rounded-xl px-4">
                <AccordionTrigger className="text-white hover:no-underline py-4">
                  <span className="text-left text-sm font-medium">Build a full strategy</span>
                </AccordionTrigger>
                <AccordionContent className="text-white/60 text-sm pb-4">
                  <p className="mb-3">
                    Apply on-chain insights across messaging, channels, and sequencing.
                  </p>
                  <a 
                    href="/strategy-playbook" 
                    className="flex items-center gap-2 text-purple-400 hover:text-purple-300 text-xs transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    View the 10-step framework
                  </a>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Divider */}
          <div className="border-t border-white/10" />

          {/* White-label section */}
          <div 
            className="space-y-4"
            style={{ animation: 'fadeInUp 0.5s 0.2s ease-out backwards' }}
          >
            <h3 className="text-lg font-semibold text-white">
              Easy to white-label
            </h3>
            <p className="text-white/50 text-sm">
              Use this chart directly in pitch decks and client materials.
            </p>
            
            {/* Video */}
            <div className="rounded-xl overflow-hidden border border-white/10 bg-black">
              <video 
                autoPlay 
                muted 
                playsInline
                className="w-full h-auto"
                src="/videos/white-label-demo.mov"
              />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AgencyHowPanel;
