import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

import img1 from "@/assets/build-dashboard-1.png";
import img2 from "@/assets/build-dashboard-2.png";
import img3 from "@/assets/build-dashboard-3.png";
import img4 from "@/assets/build-dashboard-4.png";

const frames = [img1, img2, img3, img4];

interface Props {
  compact?: boolean;
}

const Slideshow = ({ className }: { className?: string }) => {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % frames.length), 1800);
    return () => clearInterval(id);
  }, []);
  return (
    <div className={className}>
      {frames.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={`Build dashboard step ${i + 1}`}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
          style={{ opacity: i === index ? 1 : 0 }}
          loading="lazy"
        />
      ))}
    </div>
  );
};

export const MockQueryDashboard = ({ compact = false }: Props) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="block w-full cursor-zoom-in"
        aria-label="View full Build dashboard preview"
      >
        <Slideshow className="relative w-full border border-border bg-card overflow-hidden aspect-[1920/1516]" />
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-6xl p-0 overflow-hidden border-border">
          <DialogTitle className="sr-only">Build your own dashboard</DialogTitle>
          <Slideshow className="relative w-full bg-card aspect-[1920/1516]" />
        </DialogContent>
      </Dialog>
    </>
  );
};
