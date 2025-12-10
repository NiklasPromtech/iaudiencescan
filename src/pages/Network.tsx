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

  // Generate network graph with seeded randomness based on studyId
  const { nodes, edges } = useMemo(() => {
    if (tokens.length === 0) return { nodes: [], edges: [] };

    const size = 1000;
    const padding = 80;
    const maxTokens = Math.min(tokens.length, 80);

    // Seeded random for consistent layout
    const seed = studyId?.split('').reduce((a, c) => a + c.charCodeAt(0), 0) || 1;
    const seededRandom = (i: number) => {
      const x = Math.sin(seed * i) * 10000;
      return x - Math.floor(x);
    };

    const generatedNodes: Node[] = [];

    // Distribute nodes across the canvas using quasi-random positioning
    tokens.slice(0, maxTokens).forEach((token, index) => {
      const golden = 0.618033988749895;
      const angle = index * golden * Math.PI * 2;
      const radius = Math.sqrt(index / maxTokens) * (size / 2 - padding);
      
      // Add some controlled randomness
      const jitterX = (seededRandom(index * 2) - 0.5) * 60;
      const jitterY = (seededRandom(index * 2 + 1) - 0.5) * 60;
      
      const x = size / 2 + Math.cos(angle) * radius + jitterX;
      const y = size / 2 + Math.sin(angle) * radius + jitterY;
      const nodeSize = 20 + token.score * 40;

      generatedNodes.push({
        id: index,
        x: Math.max(padding, Math.min(size - padding, x)),
        y: Math.max(padding, Math.min(size - padding, y)),
        logo: token.logo,
        score: token.score,
        size: nodeSize,
      });
    });

    // Generate random edges
    const generatedEdges: Edge[] = [];
    const edgeCount = Math.floor(maxTokens * 2.5); // Dense connections

    for (let i = 0; i < edgeCount; i++) {
      const from = Math.floor(seededRandom(i * 3) * maxTokens);
      const to = Math.floor(seededRandom(i * 3 + 1) * maxTokens);
      
      if (from !== to) {
        // Avoid duplicate edges
        const exists = generatedEdges.some(
          e => (e.from === from && e.to === to) || (e.from === to && e.to === from)
        );
        if (!exists) {
          const strength = (generatedNodes[from].score + generatedNodes[to].score) / 2;
          generatedEdges.push({ from, to, strength });
        }
      }
    }

    // Ensure center token (index 0) has connections
    for (let i = 1; i < Math.min(8, maxTokens); i++) {
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
      {/* Ambient glow effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[200px]" />
        <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] bg-purple-500/15 rounded-full blur-[180px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-400/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative w-full h-screen flex items-center justify-center">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="max-w-full max-h-[95vh]"
          style={{ filter: 'drop-shadow(0 0 40px rgba(168, 85, 247, 0.15))' }}
        >
          <defs>
            {/* Glow filters */}
            <filter id="glow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="strongGlow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="8" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Gradient for edges */}
            {edges.map((edge, i) => {
              const fromNode = nodes[edge.from];
              const toNode = nodes[edge.to];
              if (!fromNode || !toNode) return null;
              return (
                <linearGradient
                  key={`grad-${i}`}
                  id={`edgeGrad-${i}`}
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#a855f7" stopOpacity={0.6 * edge.strength} />
                  <stop offset="50%" stopColor="#c084fc" stopOpacity={0.3 * edge.strength} />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity={0.6 * edge.strength} />
                </linearGradient>
              );
            })}

            {/* Clip paths */}
            {nodes.map((node) => (
              <clipPath key={`clip-${node.id}`} id={`clip-${node.id}`}>
                <circle cx={node.x} cy={node.y} r={node.size / 2 - 2} />
              </clipPath>
            ))}
          </defs>

          {/* Edges layer */}
          <g className="edges">
            {edges.map((edge, index) => {
              const fromNode = nodes[edge.from];
              const toNode = nodes[edge.to];
              if (!fromNode || !toNode) return null;

              const strokeWidth = 0.5 + edge.strength * 2;

              return (
                <g key={`edge-${index}`}>
                  {/* Edge glow */}
                  <line
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke="#a855f7"
                    strokeWidth={strokeWidth + 4}
                    strokeOpacity={edge.strength * 0.15}
                    className="blur-sm"
                  />
                  {/* Main edge */}
                  <line
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke={`url(#edgeGrad-${index})`}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                  />
                  {/* Animated particle */}
                  {edge.strength > 0.3 && (
                    <circle r="2" fill="#c084fc" opacity="0.8">
                      <animate
                        attributeName="cx"
                        from={fromNode.x}
                        to={toNode.x}
                        dur={`${2 + Math.random() * 3}s`}
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="cy"
                        from={fromNode.y}
                        to={toNode.y}
                        dur={`${2 + Math.random() * 3}s`}
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0;0.8;0.8;0"
                        dur={`${2 + Math.random() * 3}s`}
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                </g>
              );
            })}
          </g>

          {/* Nodes layer */}
          <g className="nodes">
            {nodes.map((node) => {
              const isCenter = node.id === 0;

              return (
                <g key={node.id} filter={isCenter ? "url(#strongGlow)" : "url(#glow)"}>
                  {/* Outer glow ring */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.size / 2 + 6}
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth={isCenter ? 2 : 1}
                    strokeOpacity={0.3 + node.score * 0.3}
                  />

                  {/* Inner ring */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.size / 2 + 2}
                    fill="none"
                    stroke="#c084fc"
                    strokeWidth={isCenter ? 3 : 2}
                    strokeOpacity={0.5 + node.score * 0.5}
                  />

                  {/* Dark background */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.size / 2}
                    fill="#0a0a0a"
                  />

                  {/* Token logo */}
                  <image
                    href={node.logo}
                    x={node.x - node.size / 2 + 2}
                    y={node.y - node.size / 2 + 2}
                    width={node.size - 4}
                    height={node.size - 4}
                    clipPath={`url(#clip-${node.id})`}
                    preserveAspectRatio="xMidYMid slice"
                  />

                  {/* Pulse animation for high-score nodes */}
                  {node.score > 0.4 && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.size / 2}
                      fill="none"
                      stroke="#a855f7"
                      strokeWidth="1.5"
                    >
                      <animate
                        attributeName="r"
                        from={node.size / 2}
                        to={node.size / 2 + 25}
                        dur="2.5s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        from="0.5"
                        to="0"
                        dur="2.5s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                </g>
              );
            })}
          </g>
        </svg>

        {/* Stats overlay */}
        <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-md border border-purple-500/30 rounded-xl px-5 py-3">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <span className="text-white/70">
                <span className="text-purple-400 font-semibold">{nodes.length}</span> tokens
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5 bg-gradient-to-r from-purple-500 to-purple-500/30 rounded" />
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
