import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { KnowledgeGraph } from "./knowledge-graph";
import { X } from "lucide-react";
import { PodcastSegment } from "../App";

interface GraphNode extends PodcastSegment {
  relevance: number;
  x: number;
  y: number;
  connections: string[];
}

interface FullscreenGraphModalProps {
  isOpen: boolean;
  onClose: () => void;
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
}

export function FullscreenGraphModal({
  isOpen,
  onClose,
  searchResults,
  onPreview,
  onAddToPlaylist,
  suggestions,
  onSuggestionClick
}: FullscreenGraphModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-none !max-h-none !w-screen !h-screen !p-0 !gap-0 !border-0 !m-0 !top-0 !left-0 !translate-x-0 !translate-y-0 !rounded-none">
        {/* Accessibility components - visually hidden */}
        <DialogTitle className="sr-only">
          Fullscreen Knowledge Graph View
        </DialogTitle>
        <DialogDescription className="sr-only">
          Interactive knowledge graph showing podcast segments and their connections. Navigate, zoom, and explore content in fullscreen mode.
        </DialogDescription>
        
        {/* Custom header with close button */}
        <div className="absolute top-4 right-4 z-50">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-10 w-10 p-0 bg-background/90 backdrop-blur-sm border border-border hover:bg-accent"
            title="Close Fullscreen"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Fullscreen Knowledge Graph */}
        <div className="w-full h-full">
          <KnowledgeGraph
            searchResults={searchResults}
            onPreview={onPreview}
            onAddToPlaylist={onAddToPlaylist}
            suggestions={suggestions}
            onSuggestionClick={onSuggestionClick}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}