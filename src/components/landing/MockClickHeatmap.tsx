import img from "@/assets/extension-click-view.png";

interface Props {
  compact?: boolean;
}

export const MockClickHeatmap = ({ compact = false }: Props) => {
  return (
    <div className="w-full border border-border bg-card overflow-hidden aspect-[4/3]">
      <img
        src={img}
        alt="Browser extension showing click counts on a live page"
        className="w-full h-full object-cover object-top"
        loading="lazy"
      />
    </div>
  );
};
