import { useParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";

interface TokenData {
  logo: string;
  score: number;
}

interface Node {
  id: number;
  x: number;
  y: number;
  logo: string;
  score: number;
  size: number;
}

interface Edge {
  from: number;
  to: number;
  strength: number;
}

const Network = () => {
  const { studyId } = useParams<{ studyId: string }>();
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://token-analysis-final.nw.r.appspot.com/chart/${studyId}`
        );
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setTokens(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    if (studyId) fetchData();
  }, [studyId]);

  // Generate network graph with collision avoidance
  const { nodes, edges } = useMemo(() => {
    if (tokens.length === 0) return { nodes: [], edges: [] };

    const size = 1000;
    const padding = 100;
    const maxTokens = Math.min(tokens.length, 80);

    // Seeded random for consistent layout
    const seed = studyId?.split('').reduce((a, c) => a + c.charCodeAt(0), 0) || 1;
    const seededRandom = (i: number) => {
      const x = Math.sin(seed * i) * 10000;
      return x - Math.floor(x);
    };

    const generatedNodes: Node[] = [];

    // Place nodes with collision avoidance
    tokens.slice(0, maxTokens).forEach((token, index) => {
      const nodeSize = 24 + token.score * 36;
      let x: number, y: number;
      let attempts = 0;
      const maxAttempts = 50;

      // Try to find a non-overlapping position
      do {
        if (index === 0) {
          // Center token in middle
          x = size / 2;
          y = size / 2;
        } else {
          // Distribute using golden angle with jitter
          const golden = 0.618033988749895;
          const angle = index * golden * Math.PI * 2 + seededRandom(index * 7) * 0.5;
          const baseRadius = 80 + Math.sqrt(index / maxTokens) * (size / 2 - padding - 80);
          const jitter = (seededRandom(index * 13 + attempts) - 0.5) * 100;
          
          x = size / 2 + Math.cos(angle) * (baseRadius + jitter);
          y = size / 2 + Math.sin(angle) * (baseRadius + jitter);
        }

        // Clamp to bounds
        x = Math.max(padding, Math.min(size - padding, x));
        y = Math.max(padding, Math.min(size - padding, y));

        // Check for overlap with existing nodes
        const hasOverlap = generatedNodes.some((other) => {
          const dx = x - other.x;
          const dy = y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = (nodeSize + other.size) / 2 + 15;
          return dist < minDist;
        });

        if (!hasOverlap || attempts >= maxAttempts) break;
        attempts++;
      } while (true);

      generatedNodes.push({
        id: index,
        x,
        y,
        logo: token.logo,
        score: token.score,
        size: nodeSize,
      });
    });

    // Generate random edges
    const generatedEdges: Edge[] = [];
    const edgeCount = Math.floor(maxTokens * 2);

    for (let i = 0; i < edgeCount; i++) {
      const from = Math.floor(seededRandom(i * 3) * maxTokens);
      const to = Math.floor(seededRandom(i * 3 + 1) * maxTokens);
      
      if (from !== to) {
        const exists = generatedEdges.some(
          e => (e.from === from && e.to === to) || (e.from === to && e.to === from)
        );
        if (!exists) {
          const strength = (generatedNodes[from].score + generatedNodes[to].score) / 2;
          generatedEdges.push({ from, to, strength });
        }
      }
    }

    // Ensure center token has connections
    for (let i = 1; i < Math.min(6, maxTokens); i++) {
      const exists = generatedEdges.some(e => 
        (e.from === 0 && e.to === i) || (e.from === i && e.to === 0)
      );
      if (!exists) {
        generatedEdges.push({ from: 0, to: i, strength: generatedNodes[i].score });
      }
    }

    return { nodes: generatedNodes, edges: generatedEdges };
  }, [tokens, studyId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white/60 animate-pulse">Loading network...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  const size = 1000;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center overflow-hidden">
      {/* Static ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[200px]" />
        <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[180px]" />
      </div>

      <div className="relative w-full h-screen flex items-center justify-center">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="max-w-full max-h-[95vh]"
        >
          <defs>
            {/* Clip paths */}
            {nodes.map((node) => (
              <clipPath key={`clip-${node.id}`} id={`clip-${node.id}`}>
                <circle cx={node.x} cy={node.y} r={node.size / 2 - 2} />
              </clipPath>
            ))}
          </defs>

          {/* Edges */}
          <g className="edges">
            {edges.map((edge, index) => {
              const fromNode = nodes[edge.from];
              const toNode = nodes[edge.to];
              if (!fromNode || !toNode) return null;

              const opacity = 0.15 + edge.strength * 0.4;
              const strokeWidth = 0.5 + edge.strength * 1.5;

              return (
                <line
                  key={`edge-${index}`}
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke="#a855f7"
                  strokeWidth={strokeWidth}
                  strokeOpacity={opacity}
                  strokeLinecap="round"
                />
              );
            })}
          </g>

          {/* Nodes */}
          <g className="nodes">
            {nodes.map((node) => {
              const isCenter = node.id === 0;

              return (
                <g key={node.id}>
                  {/* Ring */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.size / 2 + 2}
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth={isCenter ? 3 : 2}
                    strokeOpacity={0.4 + node.score * 0.5}
                  />

                  {/* Background */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.size / 2}
                    fill="#0a0a0a"
                  />

                  {/* Logo */}
                  <image
                    href={node.logo}
                    x={node.x - node.size / 2 + 2}
                    y={node.y - node.size / 2 + 2}
                    width={node.size - 4}
                    height={node.size - 4}
                    clipPath={`url(#clip-${node.id})`}
                    preserveAspectRatio="xMidYMid slice"
                  />
                </g>
              );
            })}
          </g>
        </svg>

        {/* Stats */}
        <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-md border border-purple-500/30 rounded-xl px-5 py-3">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <span className="text-white/70">
                <span className="text-purple-400 font-semibold">{nodes.length}</span> tokens
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5 bg-purple-500/60 rounded" />
              <span className="text-white/70">
                <span className="text-purple-400 font-semibold">{edges.length}</span> connections
              </span>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="absolute top-6 left-6">
          <h1 className="text-white/90 text-xl font-light tracking-wide">Token Network</h1>
          <p className="text-white/40 text-sm mt-1">Community overlap analysis</p>
        </div>
      </div>
    </div>
  );
};

export default Network;
