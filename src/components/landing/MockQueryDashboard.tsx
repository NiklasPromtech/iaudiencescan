import { useEffect, useState } from "react";
import img1 from "@/assets/build-dashboard-1.png";
import img2 from "@/assets/build-dashboard-2.png";
import img3 from "@/assets/build-dashboard-3.png";
import img4 from "@/assets/build-dashboard-4.png";

const frames = [img1, img2, img3, img4];

interface Props {
  compact?: boolean;
}

export const MockQueryDashboard = ({ compact = false }: Props) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % frames.length), 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative w-full border border-border bg-card overflow-hidden aspect-[4/3]">
      {frames.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={`Build dashboard step ${i + 1}`}
          className="absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-500"
          style={{ opacity: i === index ? 1 : 0 }}
          loading="lazy"
        />
      ))}
    </div>
  );
};
