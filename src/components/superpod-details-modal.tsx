import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Play, Clock, FileText, Edit, Save, X, ChevronDown, ChevronUp } from "lucide-react";
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

interface SuperPod {
  id: string;
  name: string;
  segments: PodcastSegment[];
  totalDuration: string;
  createdAt: string;
  summary?: string;
}

interface SuperPodDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  superPod: SuperPod | null;
  onPlay: (superPod: SuperPod) => void;
  onUpdateSummary?: (superPodId: string, summary: string) => void;
}

export function SuperPodDetailsModal({ 
  isOpen, 
  onClose, 
  superPod, 
  onPlay,
  onUpdateSummary 
}: SuperPodDetailsModalProps) {
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [summaryText, setSummaryText] = useState("");
  const [expandedSegments, setExpandedSegments] = useState<Set<string>>(new Set());

  if (!superPod) return null;

  const handleEditSummary = () => {
    setSummaryText(superPod.summary || "");
    setIsEditingSummary(true);
  };

  const handleSaveSummary = () => {
    if (onUpdateSummary) {
      onUpdateSummary(superPod.id, summaryText);
    }
    setIsEditingSummary(false);
  };

  const toggleSegmentExpansion = (segmentId: string) => {
    const newExpanded = new Set(expandedSegments);
    if (newExpanded.has(segmentId)) {
      newExpanded.delete(segmentId);
    } else {
      newExpanded.add(segmentId);
    }
    setExpandedSegments(newExpanded);
  };

  const generateAutoSummary = () => {
    // Mock auto-generated summary based on segments
    const topics = superPod.segments.map(s => s.tags).flat();
    const uniqueTopics = [...new Set(topics)].slice(0, 5);
    const autoSummary = `This SuperPod explores ${uniqueTopics.join(", ")} through ${superPod.segments.length} carefully curated segments. The content spans ${superPod.totalDuration} and covers insights from multiple expert perspectives.`;
    setSummaryText(autoSummary);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{superPod.name}</span>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {superPod.segments.length} segments
              </Badge>
              <Badge variant="outline" className="text-xs">
                {superPod.totalDuration}
              </Badge>
            </div>
          </DialogTitle>
          <DialogDescription>
            Created {new Date(superPod.createdAt).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex flex-col gap-4 min-h-0">
          {/* Summary Section */}
          <Card className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  SuperPod Summary
                </Label>
                {!isEditingSummary && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEditSummary}
                    className="h-7 text-xs"
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                )}
              </div>

              {isEditingSummary ? (
                <div className="space-y-3">
                  <Textarea
                    value={summaryText}
                    onChange={(e) => setSummaryText(e.target.value)}
                    placeholder="Add a summary for this SuperPod..."
                    className="min-h-[100px]"
                  />
                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={generateAutoSummary}
                      className="text-xs"
                    >
                      Generate Auto-Summary
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditingSummary(false)}
                        className="h-7 text-xs"
                      >
                        <X className="w-3 h-3 mr-1" />
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSaveSummary}
                        className="h-7 text-xs"
                      >
                        <Save className="w-3 h-3 mr-1" />
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  {superPod.summary || "No summary available. Click Edit to add one."}
                </div>
              )}
            </div>
          </Card>

          {/* Segments List */}
          <Card className="flex-1 flex flex-col overflow-hidden">
            <div className="p-4 border-b flex-shrink-0">
              <h4>Segments</h4>
            </div>
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
              <div className="p-4 space-y-3 min-h-0">
                {superPod.segments.map((segment, index) => (
                  <Card key={segment.id} className="p-3">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {index + 1}
                            </Badge>
                            <h5 className="truncate text-sm">{segment.title}</h5>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{segment.podcast}</span>
                            <span>•</span>
                            <span>{segment.duration}</span>
                            {segment.episode && (
                              <>
                                <span>•</span>
                                <span>Ep. {segment.episode}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleSegmentExpansion(segment.id)}
                          className="h-6 w-6 p-0"
                        >
                          {expandedSegments.has(segment.id) ? (
                            <ChevronUp className="w-3 h-3" />
                          ) : (
                            <ChevronDown className="w-3 h-3" />
                          )}
                        </Button>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {segment.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {expandedSegments.has(segment.id) && (
                        <div className="space-y-2 pt-2 border-t">
                          {segment.description && (
                            <div>
                              <Label className="text-xs text-muted-foreground">Description</Label>
                              <p className="text-xs mt-1">{segment.description}</p>
                            </div>
                          )}
                          
                          {segment.relatedTopics && segment.relatedTopics.length > 0 && (
                            <div>
                              <Label className="text-xs text-muted-foreground">Related Topics</Label>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {segment.relatedTopics.map(topic => (
                                  <Badge key={topic} variant="outline" className="text-xs">
                                    {topic}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {segment.transcript && (
                            <div>
                              <Label className="text-xs text-muted-foreground">Transcript Preview</Label>
                              <p className="text-xs mt-1 text-muted-foreground line-clamp-3">
                                {segment.transcript}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
              </ScrollArea>
            </div>
          </Card>
        </div>

        <div className="flex justify-between pt-4 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Total Duration: {superPod.totalDuration}</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={() => onPlay(superPod)}>
              <Play className="w-4 h-4 mr-2" />
              Play SuperPod
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}