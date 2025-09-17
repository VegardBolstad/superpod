import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { DraggablePlaylist } from "./draggable-playlist";
import { SavedSearches } from "./saved-searches";
import {
  Play,
  Plus,
  Trash2,
  Edit,
  FolderOpen,
  Mic,
  Clock,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface PodcastSegment {
  id: string;
  title: string;
  podcast: string;
  duration: string;
  tags: string[];
}

interface SuperPod {
  id: string;
  name: string;
  segments: PodcastSegment[];
  totalDuration: string;
  createdAt: string;
}

interface SuperPodSidebarProps {
  superPods: SuperPod[];
  currentPlaylist: PodcastSegment[];
  onPlaySuperPod: (superPod: SuperPod) => void;
  onCreateSuperPod: () => void;
  onDeleteSuperPod: (id: string) => void;
  onViewSuperPod: (superPod: SuperPod) => void;
  onClearPlaylist: () => void;
  onSaveCurrentPlaylist: (name: string) => void;
  onReorderPlaylist: (
    reorderedSegments: PodcastSegment[],
  ) => void;
  onOpenAISettings: () => void;
  onLoadSavedSearch?: (search: any) => void;
  savedSearchesRefreshKey?: number;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function SuperPodSidebar({
  superPods,
  currentPlaylist,
  onPlaySuperPod,
  onCreateSuperPod,
  onDeleteSuperPod,
  onViewSuperPod,
  onClearPlaylist,
  onSaveCurrentPlaylist,
  onReorderPlaylist,
  onOpenAISettings,
  onLoadSavedSearch,
  savedSearchesRefreshKey,
  isCollapsed = false,
  onToggleCollapse,
}: SuperPodSidebarProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  const handleSavePlaylist = () => {
    if (newPlaylistName.trim() && currentPlaylist.length > 0) {
      onSaveCurrentPlaylist(newPlaylistName.trim());
      setNewPlaylistName("");
      setIsCreating(false);
    }
  };

  const getTotalDuration = (segments: PodcastSegment[]) => {
    // Mock calculation - in real app would sum actual durations
    return `${segments.length * 5}m`;
  };

  if (isCollapsed) {
    // Show collapsed state with toggle button
    return (
      <div className="w-12 h-full bg-sidebar border-r flex flex-col items-center relative">
        <div className="border-b w-full flex justify-center p-[8px]">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-[8px] mx-[4px] my-[2px]"
            onClick={onToggleCollapse}
            title="Open SuperPods"
          >
            <Mic className="w-5 h-5 text-sidebar-primary" />
          </Button>
        </div>
        <div className="p-2">
          <Button
            onClick={onCreateSuperPod}
            size="sm"
            className="h-8 w-8 p-0"
            title="New SuperPod"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 h-full bg-sidebar border-r flex flex-col relative">
      <div className="px-2 py-4 border-b pt-[0px] pr-[8px] pb-[16px] pl-[8px]">
        <div className="flex items-center gap-2 mb-[16px] p-[0px] mt-[10px] mr-[0px] ml-[0px]">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-1"
            onClick={onToggleCollapse}
            title="Collapse sidebar"
          >
            <Mic className="w-5 h-5 text-sidebar-primary" />
          </Button>
          <h2 className="text-sidebar-foreground">
            My SuperPods
          </h2>
          {onToggleCollapse && (
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto h-6 w-6 p-0"
              onClick={onToggleCollapse}
            >
              <ChevronLeft className="w-3 h-3" />
            </Button>
          )}
        </div>

        <Button
          onClick={onCreateSuperPod}
          className="w-full"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          New SuperPod
        </Button>
      </div>

      <div className="flex flex-col flex-1 min-h-0">
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {/* Current Playlist */}
            {currentPlaylist.length > 0 && (
              <Card className="p-3 bg-sidebar-accent">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sidebar-accent-foreground">
                    Current Playlist
                  </h3>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-sidebar-accent-foreground hover:bg-sidebar-accent"
                      onClick={onOpenAISettings}
                      title="AI Narration Settings"
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </Button>
                    <Badge
                      variant="secondary"
                      className="text-xs"
                    >
                      {currentPlaylist.length} segments
                    </Badge>
                  </div>
                </div>

                <div className="mb-3">
                  <DraggablePlaylist
                    segments={currentPlaylist}
                    onReorder={onReorderPlaylist}
                  />
                </div>

                {isCreating ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="SuperPod name..."
                      value={newPlaylistName}
                      onChange={(e) =>
                        setNewPlaylistName(e.target.value)
                      }
                      className="w-full px-2 py-1 text-xs bg-background border rounded"
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleSavePlaylist()
                      }
                    />
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        onClick={handleSavePlaylist}
                        className="flex-1 text-xs h-7"
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsCreating(false)}
                        className="text-xs h-7"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      onClick={() => setIsCreating(true)}
                      className="flex-1 text-xs h-7"
                    >
                      Save SuperPod
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={onClearPlaylist}
                      className="text-xs h-7"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </Card>
            )}

            <Separator />

            {/* Saved SuperPods */}
            <div className="space-y-3">
              {superPods.length === 0 &&
              currentPlaylist.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FolderOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No SuperPods yet</p>
                  <p className="text-xs">
                    Search and collect segments to create your
                    first SuperPod
                  </p>
                </div>
              ) : (
                superPods.map((superPod) => (
                  <Card
                    key={superPod.id}
                    className="p-3 hover:bg-sidebar-accent/50 transition-colors"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h4 className="text-sm text-sidebar-foreground line-clamp-2">
                          {superPod.name}
                        </h4>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            onDeleteSuperPod(superPod.id)
                          }
                          className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{superPod.totalDuration}</span>
                        <span>•</span>
                        <span>
                          {superPod.segments.length} segments
                        </span>
                      </div>

                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          onClick={() => onPlaySuperPod(superPod)}
                          className="flex-1 h-7 text-xs"
                        >
                          <Play className="w-3 h-3 mr-1" />
                          Play
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onViewSuperPod(superPod)}
                          className="h-7 text-xs px-2"
                          title="View segments and summary"
                        >
                          <FolderOpen className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </ScrollArea>

        {/* Saved Searches - Fixed at bottom */}
        {onLoadSavedSearch && (
          <div className="bg-sidebar/50 p-4">
            <SavedSearches 
              onLoadSearch={onLoadSavedSearch} 
              refreshKey={savedSearchesRefreshKey}
            />
          </div>
        )}
      </div>
    </div>
  );
}