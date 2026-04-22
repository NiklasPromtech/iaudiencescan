import img from "@/assets/telegram-chat-view.png";

interface Props {
  compact?: boolean;
}

export const MockTelegramChat = ({ compact = false }: Props) => {
  return (
    <div className="w-full border border-border bg-card overflow-hidden aspect-[4/3]">
      <img
        src={img}
        alt="Telegram chat with AudienceScan AI Assistant answering analytics questions"
        className="w-full h-full object-cover object-top"
        loading="lazy"
      />
    </div>
  );
};
