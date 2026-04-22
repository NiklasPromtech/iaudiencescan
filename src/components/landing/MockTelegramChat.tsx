import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import img from "@/assets/telegram-chat-view.png";

interface Props {
  compact?: boolean;
}

export const MockTelegramChat = ({ compact = false }: Props) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="block w-full cursor-zoom-in"
        aria-label="View full Telegram chat preview"
      >
        <div className="w-full border border-border bg-card overflow-hidden aspect-[1920/1516]">
          <img
            src={img}
            alt="Telegram chat with AudienceScan AI Assistant"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-6xl p-0 overflow-hidden border-border">
          <VisuallyHidden><DialogTitle>Ask in Telegram</DialogTitle></VisuallyHidden>
          <img
            src={img}
            alt="Telegram chat with AudienceScan AI Assistant"
            className="w-full h-auto"
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
