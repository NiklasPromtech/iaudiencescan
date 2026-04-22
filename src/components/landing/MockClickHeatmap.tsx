import img from "@/assets/extension-click-view.png";

interface Props {
  compact?: boolean;
}

export const MockClickHeatmap = ({ compact = false }: Props) => {
  return (
    <div className="w-full border border-border bg-card overflow-hidden aspect-[1920/1516]">
      <img
        src={img}
        alt="Browser extension showing click counts on a live page"
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  );
};
