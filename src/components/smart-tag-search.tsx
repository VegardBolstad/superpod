import { useState, useEffect, useRef } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
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

  const handleAddTag = (tagName: string) => {
    if (selectedTags.length >= maxTags) return;
    
    if (!selectedTags.includes(tagName)) {
      onTagsChange([...selectedTags, tagName]);
    }
    
    setSearchQuery('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onTagsChange(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim() && tagResults.length > 0) {
      e.preventDefault();
      handleAddTag(tagResults[0].name);
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
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              placeholder={selectedTags.length >= maxTags ? `Max ${maxTags} tags reached` : placeholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsOpen(true)}
              className="pl-10 pr-4"
              disabled={selectedTags.length >= maxTags}
            />
            {selectedTags.length > 0 && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
                {selectedTags.length}/{maxTags}
              </div>
            )}
          </div>
        </PopoverTrigger>

        <PopoverContent className="w-[400px] p-0" align="start">
          <Command shouldFilter={false}>
            <CommandList>
              {isLoading && (
                <div className="p-4 text-sm text-muted-foreground text-center">
                  Searching tags...
                </div>
              )}
              
              {!isLoading && searchQuery && tagResults.length === 0 && (
                <CommandEmpty>
                  <div className="text-center py-4">
                    <Tag className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">No tags found for "{searchQuery}"</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => handleAddTag(searchQuery)}
                      disabled={selectedTags.length >= maxTags}
                    >
                      Create "{searchQuery}" tag
                    </Button>
                  </div>
                </CommandEmpty>
              )}

              {!isLoading && tagResults.length > 0 && (
                <CommandGroup heading="Suggested Tags">
                  {tagResults.map(tag => (
                    <CommandItem
                      key={tag.name}
                      onSelect={() => handleAddTag(tag.name)}
                      className="flex items-center justify-between cursor-pointer"
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
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

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
