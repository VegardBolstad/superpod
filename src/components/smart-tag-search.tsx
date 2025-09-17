import { useState, useEffect, useRef } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Search, X, Tag, Hash } from 'lucide-react';
import { mockApiService } from '../services/mockApi';

interface TagResult {
  name: string;
  count: number;
  category: string;
}

interface SmartTagSearchProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
}

export function SmartTagSearch({ 
  selectedTags, 
  onTagsChange, 
  placeholder = "Search and add tags...",
  maxTags = 10
}: SmartTagSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [tagResults, setTagResults] = useState<TagResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced search for tags
  useEffect(() => {
    if (!searchQuery.trim()) {
      setTagResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await mockApiService.searchTags(searchQuery, 8);
        if (response.success) {
          // Filter out already selected tags
          const filteredResults = response.data.filter(
            tag => !selectedTags.includes(tag.name)
          );
          setTagResults(filteredResults);
        }
      } catch (error) {
        console.error('Tag search failed:', error);
        setTagResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedTags]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [tagResults]);

  const handleAddTag = (tagName: string) => {
    if (selectedTags.length >= maxTags) return;
    
    if (!selectedTags.includes(tagName)) {
      onTagsChange([...selectedTags, tagName]);
    }
    
    setSearchQuery('');
    setTagResults([]);
    setIsOpen(false);
    
    // Focus after a brief delay to ensure popover is closed
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onTagsChange(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const availableOptions = tagResults.length > 0 ? tagResults : 
      (searchQuery.trim() ? [{ name: searchQuery, count: 0, category: 'Custom' }] : []);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => {
        const next = prev + 1;
        return next >= availableOptions.length ? 0 : next;
      });
      if (!isOpen && availableOptions.length > 0) {
        setIsOpen(true);
      }
    }
    
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => {
        const next = prev - 1;
        return next < 0 ? availableOptions.length - 1 : next;
      });
      if (!isOpen && availableOptions.length > 0) {
        setIsOpen(true);
      }
    }
    
    if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && availableOptions[selectedIndex]) {
        handleAddTag(availableOptions[selectedIndex].name);
      } else if (searchQuery.trim() && availableOptions.length > 0) {
        handleAddTag(availableOptions[0].name);
      }
    }
    
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSelectedIndex(-1);
    }
    
    if (e.key === 'Backspace' && !searchQuery && selectedTags.length > 0) {
      e.preventDefault();
      handleRemoveTag(selectedTags[selectedTags.length - 1]);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'AI & ML':
        return '🤖';
      case 'Blockchain & Web3':
        return '⛓️';
      case 'Work & Culture':
        return '🏢';
      case 'Sustainability':
        return '🌱';
      case 'Business & Startup':
        return '🚀';
      case 'Philosophy & Mind':
        return '🧠';
      case 'Arts & Entertainment':
        return '🎭';
      case 'Education & Science':
        return '📚';
      case 'Health & Lifestyle':
        return '💪';
      default:
        return '🏷️';
    }
  };

  return (
    <div className="space-y-2">
      {/* Selected Tags */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map(tag => (
            <Badge 
              key={tag} 
              variant="secondary" 
              className="flex items-center gap-1 px-2 py-1"
            >
              <Hash className="w-3 h-3" />
              {tag}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground ml-1"
                onClick={() => handleRemoveTag(tag)}
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* Smart Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground z-10 pointer-events-none" />
        <Input
          ref={inputRef}
          placeholder={selectedTags.length >= maxTags ? `Max ${maxTags} tags reached` : placeholder}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (e.target.value.trim()) {
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          onBlur={(e) => {
            // Don't close if clicking on dropdown
            if (!e.relatedTarget?.closest('[data-dropdown]')) {
              setTimeout(() => setIsOpen(false), 150);
            }
          }}
          className="pl-10 pr-16"
          disabled={selectedTags.length >= maxTags}
        />
        
        {selectedTags.length > 0 && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
            {selectedTags.length}/{maxTags}
          </div>
        )}

        {/* Dropdown Results */}
        {isOpen && (searchQuery.trim() || tagResults.length > 0) && (
          <div 
            data-dropdown
            className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-md shadow-lg z-50 max-h-64 overflow-y-auto"
          >
            {isLoading && (
              <div className="p-4 text-sm text-muted-foreground text-center">
                Searching tags...
              </div>
            )}
            
            {!isLoading && searchQuery && tagResults.length === 0 && (
              <div className="p-1">
                <button
                  onClick={() => handleAddTag(searchQuery)}
                  className={`w-full text-center py-4 hover:bg-accent rounded ${
                    selectedIndex === 0 ? 'bg-accent' : ''
                  }`}
                  disabled={selectedTags.length >= maxTags}
                >
                  <Tag className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No tags found for "{searchQuery}"</p>
                  <div className="text-sm font-medium mt-2">
                    Create "{searchQuery}" tag
                  </div>
                </button>
              </div>
            )}

            {!isLoading && tagResults.length > 0 && (
              <div className="p-1">
                <div className="text-xs font-medium text-muted-foreground px-2 py-1 mb-1">
                  Suggested Tags
                </div>
                {tagResults.map((tag, index) => (
                  <button
                    key={tag.name}
                    onClick={() => handleAddTag(tag.name)}
                    className={`w-full flex items-center justify-between p-2 hover:bg-accent rounded text-left transition-colors ${
                      selectedIndex === index ? 'bg-accent' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{getCategoryIcon(tag.category)}</span>
                      <div>
                        <span className="font-medium">{tag.name}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          {tag.category}
                        </span>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {tag.count}
                    </Badge>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      {selectedTags.length > 0 && (
        <div className="text-xs text-muted-foreground">
          {selectedTags.length} tag{selectedTags.length !== 1 ? 's' : ''} selected
          {selectedTags.length >= maxTags && ' (maximum reached)'}
        </div>
      )}
    </div>
  );
}
