import React, { useState, useRef, useEffect, useMemo } from "react";
import { RabbitGraphNode, RabbitGraphLink, Thesis } from "../../types/thesis";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Filter,
  Sparkles,
  Calendar,
  Layers,
  ArrowRight,
  Eye,
  PlusCircle,
  Clock,
  Compass,
  Zap,
  Info
} from "lucide-react";

interface RabbitVisualGraphProps {
  nodes: RabbitGraphNode[];
  links: RabbitGraphLink[];
  selectedNodeId: string | null;
  onSelectNode: (node: RabbitGraphNode) => void;
  onAddSeed: (thesisId: string) => void;
  onExploreNode: (node: RabbitGraphNode) => void;
  allTheses: Thesis[];
}

export const RabbitVisualGraph: React.FC<RabbitVisualGraphProps> = ({
  nodes,
  links,
  selectedNodeId,
  onSelectNode,
  onAddSeed,
  onExploreNode,
  allTheses,
}) => {
  const [viewMode, setViewMode] = useState<"network" | "timeline">("network");
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState<RabbitGraphNode | null>(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });

  // Filters
  const [minCitations, setMinCitations] = useState(0);
  const [selectedYearRange, setSelectedYearRange] = useState<[number, number]>([2015, 2026]);
  const [filterType, setFilterType] = useState<string>("all");

  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 520 });

  // Handle Container Resize
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width && entry.contentRect.height) {
          setDimensions({
            width: Math.max(400, Math.floor(entry.contentRect.width)),
            height: Math.max(350, Math.floor(entry.contentRect.height)),
          });
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Filtered nodes
  const filteredNodes = useMemo(() => {
    return nodes.filter((n) => {
      if (n.citationsCount < minCitations) return false;
      if (n.year < selectedYearRange[0] || n.year > selectedYearRange[1]) return false;
      if (filterType !== "all" && n.nodeType !== filterType) return false;
      return true;
    });
  }, [nodes, minCitations, selectedYearRange, filterType]);

  const filteredNodeIds = useMemo(() => new Set(filteredNodes.map((n) => n.id)), [filteredNodes]);

  // Compute Layout Positions (Force simulation or Timeline)
  const layoutedNodes = useMemo(() => {
    const { width, height } = dimensions;
    const centerX = width / 2;
    const centerY = height / 2;

    if (viewMode === "timeline") {
      const years = filteredNodes.map((n) => n.year);
      const minYr = Math.min(...years, 2018);
      const maxYr = Math.max(...years, 2026);
      const span = Math.max(1, maxYr - minYr);

      const byYear: { [yr: number]: RabbitGraphNode[] } = {};
      filteredNodes.forEach((n) => {
        byYear[n.year] = byYear[n.year] || [];
        byYear[n.year].push(n);
      });

      return filteredNodes.map((node) => {
        const frac = (node.year - minYr) / span;
        const x = 70 + frac * (width - 140);
        const group = byYear[node.year] || [node];
        const idx = group.indexOf(node);
        const count = group.length;
        const spread = Math.min(height - 100, count * 55);
        const startY = centerY - spread / 2 + 25;
        const y = count === 1 ? centerY : startY + (idx / Math.max(1, count - 1)) * spread;

        return { ...node, x, y };
      });
    }

    // Network Force Layout Simulation
    const count = filteredNodes.length;
    const seedNodes = filteredNodes.filter((n) => n.isSeed);
    const nonSeeds = filteredNodes.filter((n) => !n.isSeed);

    const positions: { [id: string]: { x: number; y: number } } = {};

    // Center Seeds
    seedNodes.forEach((s, idx) => {
      const r = seedNodes.length > 1 ? 55 : 0;
      const angle = (idx / Math.max(1, seedNodes.length)) * Math.PI * 2;
      positions[s.id] = {
        x: centerX + Math.cos(angle) * r,
        y: centerY + Math.sin(angle) * r,
      };
    });

    // Orbit Others
    nonSeeds.forEach((n, idx) => {
      let r = 160;
      let baseAngle = 0;

      if (n.nodeType === "earlier") {
        r = 210;
        baseAngle = Math.PI * 0.9;
      } else if (n.nodeType === "later") {
        r = 200;
        baseAngle = -Math.PI * 0.1;
      } else if (n.nodeType === "similar") {
        r = 145;
        baseAngle = Math.PI * 0.35;
      }

      const offset = ((idx % 7) / 7) * Math.PI * 1.5 - Math.PI * 0.75;
      const jitter = (idx % 3 - 1) * 22;
      positions[n.id] = {
        x: centerX + Math.cos(baseAngle + offset) * (r + jitter),
        y: centerY + Math.sin(baseAngle + offset) * (r + jitter),
      };
    });

    return filteredNodes.map((n) => ({
      ...n,
      x: positions[n.id]?.x || centerX,
      y: positions[n.id]?.y || centerY,
    }));
  }, [filteredNodes, dimensions, viewMode]);

  const nodePosMap = useMemo(() => {
    const map = new Map<string, { x: number; y: number; node: RabbitGraphNode }>();
    layoutedNodes.forEach((n) => {
      map.set(n.id, { x: n.x || 0, y: n.y || 0, node: n });
    });
    return map;
  }, [layoutedNodes]);

  // Connected links for selected node
  const activeLinks = useMemo(() => {
    return links.filter((l) => {
      const s = nodePosMap.get(l.source);
      const t = nodePosMap.get(l.target);
      return s && t;
    });
  }, [links, nodePosMap]);

  const selectedConnectedIds = useMemo(() => {
    if (!selectedNodeId) return new Set<string>();
    const set = new Set<string>([selectedNodeId]);
    links.forEach((l) => {
      if (l.source === selectedNodeId) set.add(l.target);
      if (l.target === selectedNodeId) set.add(l.source);
    });
    return set;
  }, [selectedNodeId, links]);

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName === "svg" || (e.target as HTMLElement).id === "graph-canvas") {
      setIsDraggingCanvas(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingCanvas) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDraggingCanvas(false);
  };

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const getNodeColor = (type: string, isSeed?: boolean) => {
    if (isSeed) return { fill: "#10b981", stroke: "#34d399", glow: "rgba(16, 185, 129, 0.45)" };
    switch (type) {
      case "similar":
        return { fill: "#0ea5e9", stroke: "#38bdf8", glow: "rgba(14, 165, 233, 0.35)" };
      case "earlier":
        return { fill: "#f59e0b", stroke: "#fbbf24", glow: "rgba(245, 158, 11, 0.35)" };
      case "later":
        return { fill: "#8b5cf6", stroke: "#a78bfa", glow: "rgba(139, 92, 246, 0.35)" };
      default:
        return { fill: "#6366f1", stroke: "#818cf8", glow: "rgba(99, 102, 241, 0.35)" };
    }
  };

  return (
    <div className="relative w-full h-full min-h-[480px] rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col select-none group shadow-inner">
      {/* Top Floating Controls Bar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left View Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-800 pointer-events-auto shadow-md">
          <button
            onClick={() => setViewMode("network")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              viewMode === "network"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Compass className="w-3.5 h-3.5" /> Force Graph
          </button>
          <button
            onClick={() => setViewMode("timeline")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              viewMode === "timeline"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Clock className="w-3.5 h-3.5" /> Timeline View
          </button>
        </div>

        {/* Right Filter & Zoom Controls */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Quick Type Filter */}
          <div className="hidden sm:flex items-center gap-1 p-1 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-800 text-[11px]">
            {(["all", "similar", "earlier", "later"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-2.5 py-1 rounded-md font-semibold capitalize transition-all ${
                  filterType === t
                    ? "bg-slate-800 text-white font-bold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {t === "all" ? "All Nodes" : t}
              </button>
            ))}
          </div>

          {/* Zoom Buttons */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-800">
            <button
              onClick={() => setZoom((z) => Math.min(2.5, z + 0.2))}
              className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(0.4, z - 0.2))}
              className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetView}
              className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
              title="Reset View"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div
        id="graph-canvas"
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="flex-1 w-full h-full cursor-grab active:cursor-grabbing relative overflow-hidden"
      >
        <svg
          className="w-full h-full"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "center center",
            transition: isDraggingCanvas ? "none" : "transform 0.15s ease-out",
          }}
        >
          <defs>
            {/* Glow Filters */}
            <filter id="seed-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Marker Arrows */}
            <marker
              id="arrow-citation"
              viewBox="0 0 10 10"
              refX="18"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#818cf8" opacity="0.8" />
            </marker>
            <marker
              id="arrow-ref"
              viewBox="0 0 10 10"
              refX="18"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#fbbf24" opacity="0.8" />
            </marker>
          </defs>

          {/* Background Grid Accent */}
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.5" strokeOpacity="0.4" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Timeline Year Labels Background */}
          {viewMode === "timeline" && (
            <g className="timeline-axis opacity-40">
              {[2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026].map((yr) => {
                const frac = (yr - 2018) / 8;
                const x = 70 + frac * (dimensions.width - 140);
                return (
                  <g key={yr} transform={`translate(${x}, 0)`}>
                    <line y1="30" y2={dimensions.height - 30} stroke="#334155" strokeDasharray="3,3" />
                    <text y="45" fill="#94a3b8" fontSize="11" fontWeight="bold" textAnchor="middle">
                      {yr}
                    </text>
                  </g>
                );
              })}
            </g>
          )}

          {/* Links / Edges */}
          <g className="graph-links">
            {activeLinks.map((link) => {
              const source = nodePosMap.get(link.source);
              const target = nodePosMap.get(link.target);
              if (!source || !target) return null;

              const isHighlighted =
                selectedNodeId === link.source || selectedNodeId === link.target;
              const isDimmed =
                selectedNodeId && !isHighlighted;

              const strokeColor =
                link.type === "reference"
                  ? "#f59e0b"
                  : link.type === "citation"
                  ? "#8b5cf6"
                  : "#0ea5e9";

              // If timeline mode, use curved Bezier arc
              if (viewMode === "timeline") {
                const dx = target.x - source.x;
                const dy = target.y - source.y;
                const dr = Math.sqrt(dx * dx + dy * dy) * 1.2;
                return (
                  <path
                    key={link.id}
                    d={`M ${source.x} ${source.y} A ${dr} ${dr} 0 0,1 ${target.x} ${target.y}`}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={isHighlighted ? 2.5 : 1.2}
                    strokeDasharray={link.type === "similarity" ? "4,4" : undefined}
                    opacity={isDimmed ? 0.12 : isHighlighted ? 0.9 : 0.4}
                    className="transition-opacity duration-200"
                  />
                );
              }

              return (
                <line
                  key={link.id}
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  stroke={strokeColor}
                  strokeWidth={isHighlighted ? 2.5 : 1.2}
                  strokeDasharray={link.type === "similarity" ? "3,3" : undefined}
                  opacity={isDimmed ? 0.12 : isHighlighted ? 0.95 : 0.4}
                  className="transition-opacity duration-200"
                />
              );
            })}
          </g>

          {/* Nodes */}
          <g className="graph-nodes">
            {layoutedNodes.map((node) => {
              const isSelected = selectedNodeId === node.id;
              const isConnected = selectedConnectedIds.has(node.id);
              const isDimmed = selectedNodeId && !isConnected;
              const color = getNodeColor(node.nodeType, node.isSeed);
              const r = node.radius || (node.isSeed ? 28 : 20);

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x || 0}, ${node.y || 0})`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectNode(node);
                  }}
                  onMouseEnter={(e) => {
                    const rect = containerRef.current?.getBoundingClientRect();
                    if (rect) {
                      setHoverPos({
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top,
                      });
                    }
                    setHoveredNode(node);
                  }}
                  onMouseLeave={() => setHoveredNode(null)}
                  className={`cursor-pointer transition-all duration-200 ${
                    isDimmed ? "opacity-20 scale-90" : "opacity-100 scale-100"
                  }`}
                >
                  {/* Outer Seed Pulse Animation */}
                  {node.isSeed && (
                    <circle
                      r={r + 8}
                      fill="none"
                      stroke={color.stroke}
                      strokeWidth="2"
                      opacity="0.5"
                      className="animate-ping"
                    />
                  )}

                  {/* Halo Ring */}
                  {(isSelected || node.isSeed) && (
                    <circle
                      r={r + 6}
                      fill="none"
                      stroke={color.stroke}
                      strokeWidth={isSelected ? 3 : 1.5}
                      strokeDasharray={isSelected ? undefined : "3,3"}
                      opacity="0.85"
                    />
                  )}

                  {/* Main Node Body */}
                  <circle
                    r={r}
                    fill={color.fill}
                    stroke={color.stroke}
                    strokeWidth={isSelected ? 3 : 2}
                    filter={node.isSeed ? "url(#seed-glow)" : undefined}
                    className="hover:brightness-125 transition-all shadow-lg"
                  />

                  {/* Node Icon/Text */}
                  <text
                    x="0"
                    y={node.isSeed ? 4 : 3}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize={node.isSeed ? "11" : "9"}
                    fontWeight="bold"
                    className="pointer-events-none select-none"
                  >
                    {node.isSeed ? "★ SEED" : `${node.citationsCount}c`}
                  </text>

                  {/* Under Label */}
                  <text
                    x="0"
                    y={r + 14}
                    textAnchor="middle"
                    fill={isSelected ? "#ffffff" : "#cbd5e1"}
                    fontSize="10"
                    fontWeight={isSelected ? "bold" : "normal"}
                    className="pointer-events-none select-none max-w-[120px] drop-shadow-sm"
                  >
                    {node.title.length > 22 ? `${node.title.slice(0, 20)}...` : node.title}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Hover Tooltip Card */}
        {hoveredNode && (
          <div
            className="absolute z-30 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3 w-64 p-3 rounded-xl bg-slate-900/95 backdrop-blur-md border border-slate-700 text-white shadow-2xl text-xs space-y-1.5 transition-all duration-150"
            style={{
              left: Math.max(135, Math.min(dimensions.width - 135, hoverPos.x)),
              top: Math.max(10, hoverPos.y - 12),
            }}
          >
            <div className="flex items-center justify-between gap-2">
              <span
                className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase ${
                  hoveredNode.isSeed
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : hoveredNode.nodeType === "similar"
                    ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                    : hoveredNode.nodeType === "earlier"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    : "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                }`}
              >
                {hoveredNode.isSeed ? "Seed Paper" : `${hoveredNode.nodeType} Work`}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold">{hoveredNode.year}</span>
            </div>

            <h5 className="font-bold text-slate-100 line-clamp-2 leading-tight">
              {hoveredNode.title}
            </h5>

            <p className="text-[10px] text-slate-400 truncate">
              {hoveredNode.authors.join(", ")} • {hoveredNode.university}
            </p>

            <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[10px] text-slate-300">
              <span>{hoveredNode.citationsCount} Citations</span>
              {hoveredNode.similarityScore && (
                <span className="text-sky-400 font-bold">{hoveredNode.similarityScore}% Match</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Visual Legend */}
      <div className="p-3 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-300">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="font-bold text-white text-[10px] uppercase tracking-wider">Legend:</span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-emerald-400/40" /> Seed Paper
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-sky-500" /> Similar Work
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500" /> Earlier (References)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-purple-500" /> Later (Citations)
          </span>
        </div>

        <div className="text-[10px] text-slate-400 flex items-center gap-2">
          <span>Click any node to deep dive</span>
          <span className="text-indigo-400 font-semibold">• {filteredNodes.length} literature nodes</span>
        </div>
      </div>
    </div>
  );
};
