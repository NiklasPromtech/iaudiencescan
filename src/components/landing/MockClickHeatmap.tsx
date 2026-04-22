import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

import img from "@/assets/extension-click-view.png";

interface Props {
  compact?: boolean;
}

export const MockClickHeatmap = ({ compact = false }: Props) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="block w-full cursor-zoom-in"
        aria-label="View full extension click overlay"
      >
        <div className="w-full border border-border bg-card overflow-hidden aspect-[1920/1516]">
          <img
            src={img}
            alt="Browser extension showing click counts on a live page"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-6xl p-0 overflow-hidden border-border">
          <DialogTitle className="sr-only">See where people click</DialogTitle>
          <img
            src={img}
            alt="Browser extension showing click counts on a live page"
            className="w-full h-auto"
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
