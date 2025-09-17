import { useState, useEffect, useCallback, useRef } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { SmartTagSearch } from "./smart-tag-search";
import { Search, Filter, X, RotateCcw, Bookmark, ChevronUp, ChevronDown } from "lucide-react";

interface SearchInterfaceProps {
  onSearch: (query: string, tags: string[], categories: string[], sources: string[]) => void;
  currentQuery?: string;
  resultCount?: number;
  isCollapsed?: boolean;
  onClearAllTags: () => void;
  onClearAllCategories: () => void;
  onSelectAllSources: () => void;
  onSelectNoneSources: () => void;
  onSaveSearch: () => void;
  onResetSearch: () => void;
  onToggleCollapse?: () => void;
}

export function SearchInterface({ 
  onSearch, 
  currentQuery, 
  resultCount, 
  isCollapsed = false,
  onClearAllTags,
  onClearAllCategories,
  onSelectAllSources,
  onSelectNoneSources,
  onSaveSearch,
  onResetSearch,
  onToggleCollapse
}: SearchInterfaceProps) {
  const [query, setQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [focusedCategoryIndex, setFocusedCategoryIndex] = useState(-1);
  const [focusedSourceIndex, setFocusedSourceIndex] = useState(-1);
  const [focusSection, setFocusSection] = useState<'search' | 'tags' | 'categories' | 'sources'>('search');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const tagSearchRef = useRef<HTMLDivElement>(null);

  const availableTags = [
    "technology", "business", "health", "science", "education", 
    "comedy", "news", "politics", "psychology", "philosophy"
  ];

  const availableCategories = [
    "Interview", "Documentary", "Tutorial", "News", "Opinion", 
    "Research", "Case Study", "Panel Discussion"
  ];

  const availableSources = ["Public", "Spotify", "Podme", "Apple"];

  const handleSearch = () => {
    onSearch(query, selectedTags, selectedCategories, selectedSources);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleSource = (source: string) => {
    setSelectedSources(prev => 
      prev.includes(source) 
        ? prev.filter(s => s !== source)
        : [...prev, source]
    );
  };

  const handleClearAllTags = () => {
    setSelectedTags([]);
    onClearAllTags();
  };

  const handleClearAllCategories = () => {
    setSelectedCategories([]);
    onClearAllCategories();
  };

  const handleSelectAllSources = () => {
    setSelectedSources(availableSources);
    onSelectAllSources();
  };

  const handleSelectNoneSources = () => {
    setSelectedSources([]);
    onSelectNoneSources();
  };

  const handleReset = () => {
    setQuery("");
    setSelectedTags([]);
    setSelectedCategories([]);
    setSelectedSources([]);
    setFocusedCategoryIndex(-1);
    setFocusedSourceIndex(-1);
    setFocusSection('search');
    onResetSearch();
  };

  // Keyboard navigation handlers
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Only handle shortcuts when not typing in an input or interacting with details/summary
    if (e.target instanceof HTMLInputElement || 
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLDetailsElement ||
        e.target instanceof HTMLElement && e.target.tagName === 'SUMMARY') {
      return;
    }

    if (e.key === 'Tab' && !e.shiftKey) {
      e.preventDefault();
      
      switch (focusSection) {
        case 'search':
          // Move to tags section
          setFocusSection('tags');
          break;
          
        case 'tags':
          // Move to categories
          setFocusSection('categories');
          setFocusedCategoryIndex(0);
          break;
          
        case 'categories':
          if (focusedCategoryIndex < availableCategories.length - 1) {
            setFocusedCategoryIndex(prev => prev + 1);
          } else {
            // Move to sources
            setFocusSection('sources');
            setFocusedCategoryIndex(-1);
            setFocusedSourceIndex(0);
          }
          break;
          
        case 'sources':
          if (focusedSourceIndex < availableSources.length - 1) {
            setFocusedSourceIndex(prev => prev + 1);
          } else {
            // Cycle back to search
            setFocusSection('search');
            setFocusedSourceIndex(-1);
          }
          break;
      }
    }

    if (e.key === ' ') {
      e.preventDefault();
      
      if (focusSection === 'categories' && focusedCategoryIndex >= 0) {
        const category = availableCategories[focusedCategoryIndex];
        toggleCategory(category);
      } else if (focusSection === 'sources' && focusedSourceIndex >= 0) {
        const source = availableSources[focusedSourceIndex];
        toggleSource(source);
      }
    }

    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          handleReset();
          break;
        case 's':
          e.preventDefault();
          onSaveSearch();
          break;
      }
    }
  }, [focusedCategoryIndex, focusedSourceIndex, focusSection, availableCategories, availableSources, toggleCategory, toggleSource, handleReset, onSaveSearch]);

  // Add keyboard event listeners
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Handle focus changes
  useEffect(() => {
    if (focusSection === 'search' && searchInputRef.current) {
      searchInputRef.current.focus();
    } else if (focusSection === 'tags' && tagSearchRef.current) {
      const input = tagSearchRef.current.querySelector('input');
      if (input) input.focus();
    }
  }, [focusSection]);

  return (
    <div className="space-y-4 p-4 bg-card rounded-lg border">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            ref={searchInputRef}
            placeholder="Search podcast content..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <Button onClick={handleSearch}>
          Search
        </Button>
        {onToggleCollapse && (
          <Button
            variant="outline"
            size="sm"
            className="h-10 w-10 p-0"
            onClick={onToggleCollapse}
          >
            {isCollapsed ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </Button>
        )}
      </div>

      {/* Search Status */}
      {currentQuery && (
        <div className="text-xs text-muted-foreground bg-muted/50 px-3 py-2 rounded-md">
          <div className="flex items-center justify-between">
            <span>Searching: "{currentQuery}"</span>
            {resultCount !== undefined && (
              <span>{resultCount} result{resultCount !== 1 ? 's' : ''} found</span>
            )}
          </div>
        </div>
      )}


      {/* Collapsible Filters */}
      <div className={`space-y-3 transition-all duration-300 ${isCollapsed ? 'max-h-0 overflow-hidden opacity-0' : 'max-h-[500px] opacity-100'}`}>
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h4 className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Smart Tag Search
            </h4>
            {selectedTags.length > 0 && (
              <button
                onClick={handleClearAllTags}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
          
          {/* Smart Tag Search Component */}
          <div ref={tagSearchRef}>
            <SmartTagSearch
              selectedTags={selectedTags}
              onTagsChange={setSelectedTags}
              placeholder="Type to search tags..."
              maxTags={8}
            />
          </div>
          
          {/* Keep old static tags as fallback for now */}
          <details className="mt-4" tabIndex={-1}>
            <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground" tabIndex={-1}>
              Browse all tags
            </summary>
            <div className="flex flex-wrap gap-2 mt-2">
              {availableTags.map(tag => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer text-xs"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                  {selectedTags.includes(tag) && (
                    <X className="w-3 h-3 ml-1" />
                  )}
                </Badge>
              ))}
            </div>
          </details>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <h4>Categories</h4>
            {selectedCategories.length > 0 && (
              <button
                onClick={handleClearAllCategories}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {availableCategories.map((category, index) => (
              <Badge
                key={category}
                variant={selectedCategories.includes(category) ? "default" : "outline"}
                className="cursor-pointer text-xs"
                onClick={() => toggleCategory(category)}
              >
                {category}
                {selectedCategories.includes(category) && (
                  <X className="w-3 h-3 ml-1" />
                )}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <h4>Sources</h4>
            <div className="flex gap-2">
              <button
                onClick={handleSelectAllSources}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                All
              </button>
              <span className="text-xs text-muted-foreground">|</span>
              <button
                onClick={handleSelectNoneSources}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                None
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            {availableSources.map((source, index) => (
              <div 
                key={source} 
                className="flex items-center space-x-2 p-1 rounded"
              >
                <Checkbox
                  id={`source-${source}`}
                  checked={selectedSources.includes(source)}
                  onCheckedChange={() => toggleSource(source)}
                />
                <label 
                  htmlFor={`source-${source}`}
                  className="text-sm cursor-pointer"
                >
                  {source}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Control Buttons */}
        <div className="flex justify-end gap-2 pt-2 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="h-8 text-xs"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Reset
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onSaveSearch}
            className="h-8 text-xs"
          >
            <Bookmark className="w-3 h-3 mr-1" />
            Save
          </Button>
        </div>
      </div>

      {/* Collapsed state indicator */}
      {isCollapsed && (selectedTags.length > 0 || selectedCategories.length > 0 || selectedSources.length > 0) && (
        <div className="text-xs text-muted-foreground bg-muted/30 px-3 py-1 rounded-md">
          <div className="flex items-center gap-2 flex-wrap">
            <span>Active filters:</span>
            {selectedTags.length > 0 && (
              <Badge variant="secondary" className="text-xs h-5">{selectedTags.length} tag{selectedTags.length !== 1 ? 's' : ''}</Badge>
            )}
            {selectedCategories.length > 0 && (
              <Badge variant="secondary" className="text-xs h-5">{selectedCategories.length} categor{selectedCategories.length !== 1 ? 'ies' : 'y'}</Badge>
            )}
            {selectedSources.length > 0 && (
              <Badge variant="secondary" className="text-xs h-5">{selectedSources.length} source{selectedSources.length !== 1 ? 's' : ''}</Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
}