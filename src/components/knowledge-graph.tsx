import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Play, Plus, Eye, ZoomIn, ZoomOut, RotateCcw, X } from "lucide-react";

interface GraphNode {
  id: string;
  title: string;
  podcast: string;
  duration: string;
  relevance: number;
  tags: string[];
  x: number;
  y: number;
  connections: string[];
}

interface KnowledgeGraphProps {
  searchResults: GraphNode[];
  onPreview: (node: GraphNode) => void;
  onAddToPlaylist: (node: GraphNode) => void;
  suggestions: {
    top: string[];
    bottom: string[];
    left: string[];
    right: string[];
  };
  onSuggestionClick: (suggestion: string) => void;
  onOpenFullscreen?: () => void;
}

export function KnowledgeGraph({ 
  searchResults, 
  onPreview, 
  onAddToPlaylist, 
  suggestions,
  onSuggestionClick,
  onOpenFullscreen
}: KnowledgeGraphProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  // Center nodes on initial load and handle layout
  useEffect(() => {
    if (searchResults.length === 0) return;

    const nodes = [...searchResults];
    const centerX = 400;
    const centerY = 300;

    // Position nodes in a circular layout based on relevance
    nodes.forEach((node, index) => {
      const angle = (index / nodes.length) * 2 * Math.PI;
      const radius = 100 + (1 - node.relevance) * 150;
      node.x = centerX + Math.cos(angle) * radius;
      node.y = centerY + Math.sin(angle) * radius;
    });

    // Center the view on the nodes when they first load
    resetView();
  }, [searchResults]);

  // Click outside detection for popup
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setSelectedNode(null);
      }
    };

    if (selectedNode) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [selectedNode]);

  // Pan and zoom handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  }, [pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    // Track mouse position for popup positioning
    setMousePosition({ x: e.clientX, y: e.clientY });
    
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.1, Math.min(3, prev * delta)));
  }, []);

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const zoomIn = () => setZoom(prev => Math.min(3, prev * 1.2));
  const zoomOut = () => setZoom(prev => Math.max(0.1, prev / 1.2));

  const getNodeSize = (relevance: number) => {
    return 20 + relevance * 30;
  };

  const getNodeColor = (relevance: number) => {
    if (relevance > 0.8) return "rgb(59, 130, 246)"; // blue-500
    if (relevance > 0.6) return "rgb(16, 185, 129)"; // emerald-500
    if (relevance > 0.4) return "rgb(245, 158, 11)"; // amber-500
    return "rgb(156, 163, 175)"; // gray-400
  };

  // Calculate popup position to stay within viewport
  const calculatePopupPosition = useCallback((mouseX: number, mouseY: number) => {
    const popupWidth = 320; // w-80 = 320px
    const popupHeight = 400; // max-h-96 = 384px
    const offset = 20; // Distance from cursor
    
    let x = mouseX + offset;
    let y = mouseY + offset;
    
    // Keep popup within viewport bounds
    if (x + popupWidth > window.innerWidth) {
      x = mouseX - popupWidth - offset;
    }
    if (y + popupHeight > window.innerHeight) {
      y = mouseY - popupHeight - offset;
    }
    
    // Ensure popup doesn't go off-screen on the left or top
    x = Math.max(8, x); // 8px minimum margin
    y = Math.max(8, y);
    
    return { x, y };
  }, []);

  // Handle node click with position calculation
  const handleNodeClick = useCallback((nodeId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (selectedNode === nodeId) {
      setSelectedNode(null);
    } else {
      const newPosition = calculatePopupPosition(mousePosition.x, mousePosition.y);
      setPopupPosition(newPosition);
      setSelectedNode(nodeId);
    }
  }, [selectedNode, mousePosition, calculatePopupPosition]);

  return (
    <div className="relative w-full h-full bg-card border rounded-lg overflow-hidden flex flex-col" style={{ contain: 'size' }}>
      {/* Controls Bar */}
      <div className="absolute top-4 left-4 z-20 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={zoomIn}
          className="h-8 w-8 p-0 bg-background/90 backdrop-blur-sm"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={zoomOut}
          className="h-8 w-8 p-0 bg-background/90 backdrop-blur-sm"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={resetView}
          className="h-8 w-8 p-0 bg-background/90 backdrop-blur-sm"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
        <div className="px-2 py-1 bg-background/90 backdrop-blur-sm rounded text-xs border">
          {Math.round(zoom * 100)}%
        </div>
      </div>

      {/* Fullscreen Button */}
      <div className="absolute top-4 right-4 z-20">
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onOpenFullscreen?.();
          }}
          className="h-8 w-8 p-0 bg-background/90 backdrop-blur-sm"
          title="Fullscreen Graph View"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </Button>
      </div>

      {/* Top suggestions */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-2xl px-4">
        <div className="flex gap-2 flex-wrap justify-center">
          {suggestions.top.map(suggestion => (
            <Button
              key={suggestion}
              variant="outline"
              size="sm"
              onClick={() => onSuggestionClick(suggestion)}
              className="bg-background/90 backdrop-blur-sm text-xs h-7 px-3"
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>

      {/* Left suggestions */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 hidden md:block">
        <div className="flex flex-col gap-2">
          {suggestions.left.map(suggestion => (
            <Button
              key={suggestion}
              variant="outline"
              size="sm"
              onClick={() => onSuggestionClick(suggestion)}
              className="bg-background/90 backdrop-blur-sm text-xs h-7 max-w-36 truncate"
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>

      {/* Right suggestions */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 hidden md:block">
        <div className="flex flex-col gap-2">
          {suggestions.right.map(suggestion => (
            <Button
              key={suggestion}
              variant="outline"
              size="sm"
              onClick={() => onSuggestionClick(suggestion)}
              className="bg-background/90 backdrop-blur-sm text-xs h-7 max-w-36 truncate"
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>

      {/* Bottom suggestions */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-2xl px-4">
        <div className="flex gap-2 flex-wrap justify-center">
          {suggestions.bottom.map(suggestion => (
            <Button
              key={suggestion}
              variant="outline"
              size="sm"
              onClick={() => onSuggestionClick(suggestion)}
              className="bg-background/90 backdrop-blur-sm text-xs h-7 px-3"
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>

      {/* Graph Container */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <div
          className="w-full h-full relative"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.1s ease-out'
          }}
        >

          {/* Graph SVG */}
          <svg
            ref={svgRef}
            className="w-full h-full min-w-[800px] min-h-[600px]"
            viewBox="0 0 800 600"
            style={{ pointerEvents: 'none' }}
          >
        {/* Connections */}
        {searchResults.map(node =>
          node.connections.map(connId => {
            const connectedNode = searchResults.find(n => n.id === connId);
            if (!connectedNode) return null;
            return (
              <line
                key={`${node.id}-${connId}`}
                x1={node.x}
                y1={node.y}
                x2={connectedNode.x}
                y2={connectedNode.y}
                stroke="rgba(156, 163, 175, 0.3)"
                strokeWidth="1"
              />
            );
          })
        )}

            {/* Nodes */}
            {searchResults.map(node => (
              <g key={node.id}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={getNodeSize(node.relevance)}
                  fill={getNodeColor(node.relevance)}
                  stroke={selectedNode === node.id ? "#000" : "transparent"}
                  strokeWidth="2"
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ pointerEvents: 'all' }}
                  onClick={(e) => handleNodeClick(node.id, e)}
                />
                <text
                  x={node.x}
                  y={node.y + getNodeSize(node.relevance) + 16}
                  textAnchor="middle"
                  className="text-xs fill-foreground pointer-events-none"
                >
                  {node.title.length > 20 ? `${node.title.slice(0, 20)}...` : node.title}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Node details popup - positioned near cursor */}
      {selectedNode && (() => {
        const node = searchResults.find(n => n.id === selectedNode);
        if (!node) return null;
        
        return (
          <div 
            ref={popupRef}
            className="fixed w-80 max-w-[calc(100vw-1rem)] max-h-96 z-50"
            style={{
              left: `${popupPosition.x}px`,
              top: `${popupPosition.y}px`,
            }}
          >
            <Card className="bg-background/95 backdrop-blur-sm shadow-lg border">
              <ScrollArea className="max-h-96">
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="line-clamp-2 pr-2">{node.title}</h3>
                      <p className="text-muted-foreground text-sm">{node.podcast}</p>
                      <p className="text-xs text-muted-foreground">{node.duration}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedNode(null)}
                      className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {node.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  {node.description && (
                    <p className="text-xs text-muted-foreground line-clamp-3">
                      {node.description}
                    </p>
                  )}
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onPreview(node)}
                      className="flex-1 h-8"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => onAddToPlaylist(node)}
                      className="flex-1 h-8"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </Card>
          </div>
        );
      })()}

      {/* Help text when no results */}
      {searchResults.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <p className="text-sm">No podcast segments found</p>
            <p className="text-xs">Try adjusting your search terms or filters</p>
          </div>
        </div>
      )}
    </div>
  );
}