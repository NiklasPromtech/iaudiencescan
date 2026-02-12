const nodes = [
  { x: 50, y: 50, size: 12, delay: 0 },
  { x: 25, y: 30, size: 6, delay: 0.5 },
  { x: 75, y: 25, size: 7, delay: 1 },
  { x: 30, y: 70, size: 5, delay: 1.5 },
  { x: 70, y: 72, size: 6, delay: 0.8 },
  { x: 15, y: 50, size: 4, delay: 1.2 },
  { x: 85, y: 48, size: 5, delay: 0.3 },
  { x: 40, y: 20, size: 4, delay: 1.8 },
  { x: 60, y: 82, size: 4, delay: 0.6 },
  { x: 20, y: 85, size: 3, delay: 2 },
  { x: 80, y: 15, size: 3, delay: 1.4 },
  { x: 45, y: 38, size: 3, delay: 0.9 },
];

const edges: [number, number][] = [
  [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6],
  [1, 7], [2, 10], [3, 9], [4, 8],
  [0, 11], [1, 5], [2, 6],
];

const NetworkAnimation = () => (
  <svg
    viewBox="0 0 100 100"
    className="w-72 h-72 lg:w-96 lg:h-96"
    fill="none"
  >
    {edges.map(([a, b], i) => (
      <line
        key={i}
        x1={nodes[a].x}
        y1={nodes[a].y}
        x2={nodes[b].x}
        y2={nodes[b].y}
        stroke="hsl(var(--primary))"
        strokeOpacity={0.2}
        strokeWidth={0.4}
      />
    ))}
    {nodes.map((n, i) => (
      <circle
        key={i}
        cx={n.x}
        cy={n.y}
        r={n.size / 4}
        fill={i === 0 ? "hsl(var(--primary))" : "hsl(var(--primary) / 0.6)"}
        className="animate-pulse"
        style={{ animationDelay: `${n.delay}s` }}
      />
    ))}
  </svg>
);

export default NetworkAnimation;
