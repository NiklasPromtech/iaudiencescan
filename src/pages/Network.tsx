import { useParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";

interface TokenData {
  logo: string;
  score: number;
}

interface Node {
  id: string;
  x: number;
  y: number;
  logo: string;
  score: number;
  size: number;
}

interface Edge {
  source: string;
  target: string;
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

  // Generate network graph data from tokens
  const { nodes, edges } = useMemo(() => {
    if (tokens.length === 0) return { nodes: [], edges: [] };

    const size = 900;
    const center = size / 2;
    const centerToken = tokens[0];
    const otherTokens = tokens.slice(1, 60); // Limit for performance

    const generatedNodes: Node[] = [];
    const generatedEdges: Edge[] = [];

    // Center node
    generatedNodes.push({
      id: "center",
      x: center,
      y: center,
      logo: centerToken.logo,
      score: centerToken.score,
      size: 80,
    });

    // Distribute other nodes using force-directed-like positioning
    otherTokens.forEach((token, index) => {
      const angle = (index / otherTokens.length) * Math.PI * 2 + Math.random() * 0.3;
      const baseRadius = 150 + (1 - token.score) * 250;
      const radius = baseRadius + (Math.random() - 0.5) * 80;
      
      const x = center + Math.cos(angle) * radius;
      const y = center + Math.sin(angle) * radius;
      const nodeSize = 24 + token.score * 32;

      generatedNodes.push({
        id: `node-${index}`,
        x,
        y,
        logo: token.logo,
        score: token.score,
        size: nodeSize,
      });

      // Create edge to center
      generatedEdges.push({
        source: "center",
        target: `node-${index}`,
        strength: token.score,
      });

      // Create some random inter-node connections for visual interest
      if (index > 0 && Math.random() > 0.6) {
        const targetIndex = Math.floor(Math.random() * index);
        generatedEdges.push({
          source: `node-${index}`,
          target: `node-${targetIndex}`,
          strength: Math.min(token.score, otherTokens[targetIndex]?.score || 0.5) * 0.5,
        });
      }
    });

    return { nodes: generatedNodes, edges: generatedEdges };
  }, [tokens]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground/60 animate-pulse">Loading network...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-destructive">Error: {error}</div>
      </div>
    );
  }

  const size = 900;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 overflow-hidden">
      {/* Ambient glow effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/15 rounded-full blur-[120px]" />
      </div>

      <div className="relative">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="max-w-full max-h-[90vh]"
        >
          <defs>
            {/* Gradient for edges */}
            <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
            </linearGradient>

            {/* Glow filter */}
            <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Stronger glow for center */}
            <filter id="centerGlow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="15" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Clip paths for each node */}
            {nodes.map((node) => (
              <clipPath key={`clip-${node.id}`} id={`clip-${node.id}`}>
                <circle cx={node.x} cy={node.y} r={node.size / 2} />
              </clipPath>
            ))}
          </defs>

          {/* Background grid pattern */}
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeOpacity="0.05"
              strokeWidth="1"
            />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Edges */}
          <g className="edges">
            {edges.map((edge, index) => {
              const sourceNode = nodes.find((n) => n.id === edge.source);
              const targetNode = nodes.find((n) => n.id === edge.target);
              if (!sourceNode || !targetNode) return null;

              const opacity = edge.strength * 0.6;
              const strokeWidth = 1 + edge.strength * 2;

              // Calculate control point for curved edges
              const midX = (sourceNode.x + targetNode.x) / 2;
              const midY = (sourceNode.y + targetNode.y) / 2;
              const dx = targetNode.x - sourceNode.x;
              const dy = targetNode.y - sourceNode.y;
              const curvature = 0.15;
              const controlX = midX - dy * curvature;
              const controlY = midY + dx * curvature;

              return (
                <g key={`edge-${index}`}>
                  {/* Edge glow */}
                  <path
                    d={`M ${sourceNode.x} ${sourceNode.y} Q ${controlX} ${controlY} ${targetNode.x} ${targetNode.y}`}
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth={strokeWidth + 4}
                    strokeOpacity={opacity * 0.3}
                    className="blur-sm"
                  />
                  {/* Main edge */}
                  <path
                    d={`M ${sourceNode.x} ${sourceNode.y} Q ${controlX} ${controlY} ${targetNode.x} ${targetNode.y}`}
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth={strokeWidth}
                    strokeOpacity={opacity}
                    strokeLinecap="round"
                  />
                  {/* Animated pulse along edge */}
                  <circle r="3" fill="hsl(var(--primary))" opacity={opacity}>
                    <animateMotion
                      dur={`${3 + Math.random() * 2}s`}
                      repeatCount="indefinite"
                      path={`M ${sourceNode.x} ${sourceNode.y} Q ${controlX} ${controlY} ${targetNode.x} ${targetNode.y}`}
                    />
                  </circle>
                </g>
              );
            })}
          </g>

          {/* Nodes */}
          <g className="nodes">
            {nodes.map((node) => {
              const isCenter = node.id === "center";

              return (
                <g key={node.id} filter={isCenter ? "url(#centerGlow)" : "url(#nodeGlow)"}>
                  {/* Node ring */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.size / 2 + 3}
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth={isCenter ? 3 : 2}
                    strokeOpacity={0.6 + node.score * 0.4}
                  />
                  
                  {/* Node background */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.size / 2}
                    fill="hsl(var(--background))"
                  />

                  {/* Token logo */}
                  <image
                    href={node.logo}
                    x={node.x - node.size / 2}
                    y={node.y - node.size / 2}
                    width={node.size}
                    height={node.size}
                    clipPath={`url(#clip-${node.id})`}
                    preserveAspectRatio="xMidYMid slice"
                  />

                  {/* Pulsing animation for high-score nodes */}
                  {node.score > 0.5 && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.size / 2 + 6}
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="1"
                      opacity="0"
                    >
                      <animate
                        attributeName="r"
                        from={node.size / 2 + 3}
                        to={node.size / 2 + 20}
                        dur="2s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        from="0.6"
                        to="0"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                </g>
              );
            })}
          </g>
        </svg>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm border border-border/50 rounded-lg p-3">
          <div className="text-xs text-foreground/60 mb-2">Connection Strength</div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-primary/30" />
              <span className="text-xs text-foreground/50">Weak</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-1 bg-primary/60" />
              <span className="text-xs text-foreground/50">Medium</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-1.5 bg-primary" />
              <span className="text-xs text-foreground/50">Strong</span>
            </div>
          </div>
        </div>

        {/* Node count */}
        <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm border border-border/50 rounded-lg px-3 py-2">
          <div className="text-xs text-foreground/60">
            <span className="text-primary font-semibold">{nodes.length}</span> nodes •{" "}
            <span className="text-primary font-semibold">{edges.length}</span> connections
          </div>
        </div>
      </div>
    </div>
  );
};

export default Network;
