import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { 
  Search, 
  X, 
  Bookmark, 
  Hash, 
  Calendar,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { mockApiService } from "../services/mockApi";
import { SavedSearch } from "../types/api";

interface SavedSearchesProps {
  onLoadSearch: (search: SavedSearch) => void;
}

export function SavedSearches({ onLoadSearch }: SavedSearchesProps) {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(true);

  // Load saved searches on mount
  useEffect(() => {
    loadSavedSearches();
  }, []);

  const loadSavedSearches = async () => {
    setIsLoading(true);
    try {
      const response = await mockApiService.getSavedSearches();
      if (response.success) {
        setSavedSearches(response.data);
      }
    } catch (error) {
      console.error('Failed to load saved searches:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSearch = async (searchId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the search load
    
    try {
      const response = await mockApiService.deleteSavedSearch(searchId);
      if (response.success) {
        setSavedSearches(prev => prev.filter(s => s.id !== searchId));
      }
    } catch (error) {
      console.error('Failed to delete saved search:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getSearchSummary = (search: SavedSearch) => {
    const parts = [];
    if (search.query) parts.push(`"${search.query}"`);
    if (search.tags.length > 0) parts.push(`${search.tags.length} tags`);
    if (search.categories.length > 0) parts.push(`${search.categories.length} categories`);
    if (search.sources.length > 0) parts.push(`${search.sources.length} sources`);
    return parts.join(' • ');
  };

  if (savedSearches.length === 0 && !isLoading) {
    return null; // Don't show section if no saved searches
  }

  return (
    <div className="space-y-3">
      <Separator />
      
      {/* Section Header */}
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-sm font-medium text-sidebar-foreground">
            Saved Searches
          </h3>
          {savedSearches.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {savedSearches.length}
            </Badge>
          )}
        </div>
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        )}
      </div>

      {/* Saved Searches List */}
      {isExpanded && (
        <div className="space-y-2">
          {isLoading ? (
            <div className="text-center py-4">
              <div className="text-xs text-muted-foreground">Loading searches...</div>
            </div>
          ) : savedSearches.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              <Search className="w-6 h-6 mx-auto mb-2 opacity-50" />
              <p className="text-xs">No saved searches yet</p>
              <p className="text-xs opacity-75">Use Ctrl+S to save searches</p>
            </div>
          ) : (
            <ScrollArea className="max-h-64">
              <div className="space-y-1">
                {savedSearches.map((search) => (
                  <Card
                    key={search.id}
                    className="p-2 hover:bg-sidebar-accent/50 transition-colors cursor-pointer group"
                    onClick={() => onLoadSearch(search)}
                  >
                    <div className="space-y-1">
                      {/* Search Name */}
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-medium text-sidebar-foreground line-clamp-1">
                          {search.name}
                        </h4>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => handleDeleteSearch(search.id, e)}
                          className="h-4 w-4 p-0 opacity-0 group-hover:opacity-60 hover:opacity-100 transition-opacity"
                          title="Delete saved search"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>

                      {/* Search Summary */}
                      <div className="text-xs text-muted-foreground line-clamp-1">
                        {getSearchSummary(search)}
                      </div>

                      {/* Tags Preview */}
                      {search.tags.length > 0 && (
                        <div className="flex gap-1 flex-wrap">
                          {search.tags.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs h-4 px-1">
                              <Hash className="w-2 h-2 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                          {search.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs h-4 px-1">
                              +{search.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Date */}
                      <div className="flex items-center gap-1 text-xs text-muted-foreground/75">
                        <Calendar className="w-2 h-2" />
                        <span>{formatDate(search.createdAt)}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      )}
    </div>
  );
}
