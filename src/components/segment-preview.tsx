import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { 
  Play, 
  Plus, 
  X, 
  Clock, 
  Calendar,
  Tag,
  ExternalLink
} from "lucide-react";

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

interface SegmentPreviewProps {
  segment: PodcastSegment | null;
  onClose: () => void;
  onPlay: (segment: PodcastSegment) => void;
  onAddToPlaylist: (segment: PodcastSegment) => void;
  isOpen: boolean;
}

export function SegmentPreview({
  segment,
  onClose,
  onPlay,
  onAddToPlaylist,
  isOpen
}: SegmentPreviewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'transcript' | 'related'>('overview');

  if (!isOpen || !segment) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 pb-24">
      <Card className="w-full max-w-4xl max-h-[calc(100vh-8rem)] bg-background">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex-1 min-w-0">
            <h2 className="truncate">{segment.title}</h2>
            <p className="text-muted-foreground">{segment.podcast}</p>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={onClose}
            className="h-8 w-8 p-0 ml-4"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex flex-col h-[calc(100vh-12rem)]">
          {/* Tabs */}
          <div className="border-b">
            <div className="flex">
              {(['overview', 'transcript', 'related'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm capitalize border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <ScrollArea className="flex-1 p-4">
            {activeTab === 'overview' && (
              <div className="space-y-4">
                {/* Metadata */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{segment.duration}</span>
                  </div>
                  {segment.publishDate && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{segment.publishDate}</span>
                    </div>
                  )}
                  {segment.episode && (
                    <div className="flex items-center gap-2 text-sm">
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                      <span>Episode {segment.episode}</span>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Tags */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Tag className="w-4 h-4 text-muted-foreground" />
                    <h3>Tags</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {segment.tags.map(tag => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Description */}
                {segment.description && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="mb-2">Description</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {segment.description}
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === 'transcript' && (
              <div className="space-y-4">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h3 className="mb-2">Transcript</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {segment.transcript || 
                      "This is a sample transcript excerpt from the podcast segment. In a real application, this would contain the actual transcribed content from the podcast, allowing users to search through and read the content before adding it to their SuperPod. The transcript would be generated using speech-to-text technology and processed for searchability."}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'related' && (
              <div className="space-y-4">
                <h3>Related Topics</h3>
                <div className="grid gap-2">
                  {(segment.relatedTopics || [
                    'Artificial Intelligence', 
                    'Machine Learning', 
                    'Technology Ethics', 
                    'Future of Work',
                    'Digital Transformation'
                  ]).map(topic => (
                    <Card key={topic} className="p-3 hover:bg-muted/50 cursor-pointer transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{topic}</span>
                        <Button size="sm" variant="ghost" className="h-6 text-xs">
                          Explore
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </ScrollArea>

          {/* Actions */}
          <div className="border-t p-4 bg-background/95 backdrop-blur-sm">
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                size="lg"
                onClick={() => onPlay(segment)}
                className="min-w-[120px]"
              >
                <Play className="w-4 h-4 mr-2" />
                Play Now
              </Button>
              <Button
                size="lg"
                onClick={() => onAddToPlaylist(segment)}
                className="min-w-[140px]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add to SuperPod
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}