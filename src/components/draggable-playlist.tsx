import React, { useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
interface PodcastSegment {
  id: string;
  title: string;
  podcast: string;
  duration: string;
  tags: string[];
  description?: string;
  publishDate?: string;
  episode?: string;
  transcript?: string;
  relatedTopics?: string[];
}

interface DraggableSegmentProps {
  segment: PodcastSegment;
  index: number;
  moveSegment: (dragIndex: number, hoverIndex: number) => void;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

function DraggableSegment({ segment, index, moveSegment }: DraggableSegmentProps) {
  const [{ isDragging }, drag] = useDrag({
    type: "segment",
    item: (): DragItem => ({
      id: segment.id,
      index,
      type: "segment",
    }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "segment",
    hover: (item: DragItem) => {
      if (!item) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      moveSegment(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const opacity = isDragging ? 0.4 : 1;

  return (
    <div
      ref={(node) => drag(drop(node))}
      style={{ opacity }}
      className="group flex items-center gap-2 text-xs text-sidebar-accent-foreground p-2 rounded bg-background/50 hover:bg-background/70 transition-colors cursor-move"
      title="Drag to reorder"
    >
      <div className="flex flex-col gap-1 opacity-40 group-hover:opacity-60">
        <div className="w-1 h-0.5 bg-current rounded-full"></div>
        <div className="w-1 h-0.5 bg-current rounded-full"></div>
        <div className="w-1 h-0.5 bg-current rounded-full"></div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="truncate">{segment.title}</div>
        <div className="text-muted-foreground text-xs">{segment.podcast} • {segment.duration}</div>
      </div>
      <div className="text-xs text-muted-foreground opacity-60">
        {index + 1}
      </div>
    </div>
  );
}

interface DraggablePlaylistProps {
  segments: PodcastSegment[];
  onReorder: (reorderedSegments: PodcastSegment[]) => void;
}

export function DraggablePlaylist({ segments, onReorder }: DraggablePlaylistProps) {
  const [localSegments, setLocalSegments] = useState(segments);

  // Sync local state with prop changes
  useEffect(() => {
    setLocalSegments(segments);
  }, [segments]);

  const moveSegment = (dragIndex: number, hoverIndex: number) => {
    const newSegments = [...localSegments];
    const draggedSegment = newSegments[dragIndex];
    
    newSegments.splice(dragIndex, 1);
    newSegments.splice(hoverIndex, 0, draggedSegment);
    
    setLocalSegments(newSegments);
    onReorder(newSegments);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-1">
        {localSegments.length === 0 ? (
          <div className="text-xs text-muted-foreground text-center py-4">
            Add segments from search results to build your SuperPod
          </div>
        ) : (
          localSegments.map((segment, index) => (
            <DraggableSegment
              key={segment.id}
              segment={segment}
              index={index}
              moveSegment={moveSegment}
            />
          ))
        )}
      </div>
    </DndProvider>
  );
}