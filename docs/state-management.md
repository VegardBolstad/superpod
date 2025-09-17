# State Management Documentation

## 🗂️ State Architecture Overview

SuperPod uses a centralized state management approach with React hooks, following the "Lifting State Up" pattern. All major application state is managed in the root `App.tsx` component and passed down to child components through props.

## 🎯 Core State Categories

### 1. Content State
**Purpose**: Manages podcast segments, search results, and SuperPods

```typescript
// Search and discovery state
const [searchResults, setSearchResults] = useState<GraphNode[]>([]);
const [currentQuery, setCurrentQuery] = useState("");
const [selectedSources, setSelectedSources] = useState<string[]>([]);

// Playlist and SuperPod state  
const [currentPlaylist, setCurrentPlaylist] = useState<PodcastSegment[]>([]);
const [superPods, setSuperPods] = useState<SuperPod[]>([]);

// Playback state
const [currentSegment, setCurrentSegment] = useState<PodcastSegment | null>(null);
const [currentPlayingPlaylist, setCurrentPlayingPlaylist] = useState<PodcastSegment[]>([]);
const [currentIndex, setCurrentIndex] = useState(0);
const [isPlaying, setIsPlaying] = useState(false);
```

**State Flow:**
```
Search Input → API Call → Search Results → User Selection → Current Playlist → SuperPod Creation
```

### 2. UI State
**Purpose**: Controls interface visibility and user interactions

```typescript
// Panel visibility
const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
const [isSearchCollapsed, setIsSearchCollapsed] = useState(false);
const [isMenuOpen, setIsMenuOpen] = useState(false);

// User preference tracking
const [hasUserToggledSidebar, setHasUserToggledSidebar] = useState(false);
const [hasUserToggledSearch, setHasUserToggledSearch] = useState(false);

// Modal states
const [isPreviewOpen, setIsPreviewOpen] = useState(false);
const [isAISettingsOpen, setIsAISettingsOpen] = useState(false);
const [isSuperPodDetailsOpen, setIsSuperPodDetailsOpen] = useState(false);
```

**Responsive Behavior Logic:**
```typescript
useEffect(() => {
  const handleResize = () => {
    if (window.innerWidth < 768) {
      // Mobile: Auto-collapse unless user has overridden
      if (!hasUserToggledSidebar) setIsSidebarCollapsed(true);
      if (!hasUserToggledSearch) setIsSearchCollapsed(true);
    } else if (window.innerWidth < 1024) {
      // Tablet: Collapse sidebar only
      if (!hasUserToggledSidebar) setIsSidebarCollapsed(true);
      if (!hasUserToggledSearch) setIsSearchCollapsed(false);
    } else {
      // Desktop: Show all panels
      if (!hasUserToggledSidebar) setIsSidebarCollapsed(false);
      if (!hasUserToggledSearch) setIsSearchCollapsed(false);
    }
  };

  handleResize();
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, [hasUserToggledSidebar, hasUserToggledSearch]);
```

### 3. Modal State
**Purpose**: Manages modal visibility and content

```typescript
// Modal visibility
const [previewSegment, setPreviewSegment] = useState<PodcastSegment | null>(null);
const [selectedSuperPod, setSelectedSuperPod] = useState<SuperPod | null>(null);

// AI Settings
const [aiSettings, setAiSettings] = useState<AISettings>({
  enableNarration: true,
  enableSummaries: true,
  enableTransitions: true,
  voiceStyle: "neutral",
  speakingSpeed: 1.0,
  summaryLength: "brief",
  transitionStyle: "smooth"
});
```

## 🔄 State Update Patterns

### 1. Search Flow
```typescript
const handleSearch = (query: string, tags: string[], categories: string[], sources: string[]) => {
  // Update search context
  setCurrentQuery(query);
  setSelectedSources(sources);
  
  // Process search (currently mock, will be API call)
  const filtered = mockSegments.filter(segment => {
    const matchesQuery = query === "" || 
      segment.title.toLowerCase().includes(query.toLowerCase()) ||
      segment.podcast.toLowerCase().includes(query.toLowerCase()) ||
      segment.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()));
    
    const matchesTags = tags.length === 0 || 
      tags.some(tag => segment.tags.some(segTag => segTag.toLowerCase().includes(tag.toLowerCase())));
    
    const matchesSources = sources.length === 0 || sources.includes("Public");
    
    return matchesQuery && matchesTags && matchesSources;
  });
  
  // Update results
  setSearchResults(filtered);
  toast.success(`Found ${filtered.length} relevant segments`);
};
```

### 2. Playlist Management Flow
```typescript
// Add segment to current playlist
const handleAddToPlaylist = (segment: PodcastSegment) => {
  if (!currentPlaylist.find(s => s.id === segment.id)) {
    setCurrentPlaylist(prev => [...prev, segment]);
    toast.success(`Added "${segment.title}" to playlist`);
  } else {
    toast.info("Segment already in playlist");
  }
};

// Reorder playlist segments (from drag & drop)
const handleReorderPlaylist = (reorderedSegments: PodcastSegment[]) => {
  setCurrentPlaylist(reorderedSegments);
};

// Save current playlist as SuperPod
const handleSaveCurrentPlaylist = (name: string) => {
  const newSuperPod: SuperPod = {
    id: Date.now().toString(),
    name,
    segments: [...currentPlaylist],
    totalDuration: `${currentPlaylist.length * 8}m`, // Mock calculation
    createdAt: new Date().toISOString()
  };
  
  setSuperPods(prev => [...prev, newSuperPod]);
  setCurrentPlaylist([]); // Clear current playlist
  toast.success(`Created SuperPod: ${name}`);
};
```

### 3. Playback State Flow
```typescript
// Play individual segment
const handlePlaySegment = (segment: PodcastSegment) => {
  setCurrentSegment(segment);
  setCurrentPlayingPlaylist([segment]);
  setCurrentIndex(0);
  setIsPlaying(true);
  toast.success(`Now playing: ${segment.title}`);
};

// Play entire SuperPod
const handlePlaySuperPod = (superPod: SuperPod) => {
  setCurrentPlayingPlaylist(superPod.segments);
  setCurrentSegment(superPod.segments[0]);
  setCurrentIndex(0);
  setIsPlaying(true);
  toast.success(`Playing SuperPod: ${superPod.name}`);
};

// Navigate within playlist
const handleNext = () => {
  if (currentIndex < currentPlayingPlaylist.length - 1) {
    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    setCurrentSegment(currentPlayingPlaylist[nextIndex]);
  }
};

const handlePrevious = () => {
  if (currentIndex > 0) {
    const prevIndex = currentIndex - 1;
    setCurrentIndex(prevIndex);
    setCurrentSegment(currentPlayingPlaylist[prevIndex]);
  }
};
```

## 📊 Data Models

### Core Interfaces
```typescript
// Base podcast segment interface
export interface PodcastSegment {
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

// Extended interface for search results with graph data
interface GraphNode extends PodcastSegment {
  relevance: number;
  x: number;
  y: number;
  connections: string[];
}

// SuperPod collection interface
export interface SuperPod {
  id: string;
  name: string;
  segments: PodcastSegment[];
  totalDuration: string;
  createdAt: string;
  summary?: string;
}

// AI configuration interface
interface AISettings {
  enableNarration: boolean;
  enableSummaries: boolean;
  enableTransitions: boolean;
  voiceStyle: string;
  speakingSpeed: number;
  summaryLength: string;
  transitionStyle: string;
}
```

## 🔧 State Synchronization Patterns

### 1. Parent-Child State Sync
Components receive state through props and send updates through callbacks:

```typescript
// Parent component (App)
<SuperPodSidebar
  superPods={superPods}
  currentPlaylist={currentPlaylist}
  onSaveCurrentPlaylist={handleSaveCurrentPlaylist}
  onReorderPlaylist={handleReorderPlaylist}
  // ... other props
/>

// Child component (SuperPodSidebar)
const SuperPodSidebar = ({ 
  superPods, 
  currentPlaylist, 
  onSaveCurrentPlaylist, 
  onReorderPlaylist 
}) => {
  // Uses props for display, calls callbacks for updates
  const handleSave = (name: string) => {
    onSaveCurrentPlaylist(name);
  };
};
```

### 2. Derived State Pattern
Some state is computed from other state rather than stored:

```typescript
// Computed values
const getTotalDuration = (segments: PodcastSegment[]) => {
  // Mock calculation - in real app would sum actual durations
  return `${segments.length * 5}m`;
};

// Used in rendering without storing
<Badge variant="secondary">
  {currentPlaylist.length} segments • {getTotalDuration(currentPlaylist)}
</Badge>
```

### 3. Conditional State Display
UI elements conditionally render based on state:

```typescript
// Current playlist only shows when segments exist
{currentPlaylist.length > 0 && (
  <Card className="p-3 bg-sidebar-accent">
    {/* Playlist content */}
  </Card>
)}

// Empty state shows when no SuperPods AND no current work
{superPods.length === 0 && currentPlaylist.length === 0 ? (
  <div className="text-center py-8 text-muted-foreground">
    <p>No SuperPods yet</p>
  </div>
) : (
  // SuperPods list
)}
```

## 🚀 Future State Management Evolution

### Phase 1: Current Implementation
- ✅ React hooks with lifted state
- ✅ Props-based communication
- ✅ Local state for UI components
- ✅ Mock data integration

### Phase 2: Enhanced Client State
**Recommended Libraries:**
- **Zustand** - Lightweight state management
- **React Query** - Server state and caching
- **Use-Local-Storage-State** - Persistent user preferences

```typescript
// Example Zustand store structure
interface AppStore {
  // Content state
  searchResults: GraphNode[];
  currentPlaylist: PodcastSegment[];
  superPods: SuperPod[];
  
  // Actions
  setSearchResults: (results: GraphNode[]) => void;
  addToPlaylist: (segment: PodcastSegment) => void;
  reorderPlaylist: (segments: PodcastSegment[]) => void;
  saveSuperPod: (name: string) => void;
  
  // UI state
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
}
```

### Phase 3: Server State Integration
**React Query Integration:**
```typescript
// Server state hooks
const useSearchResults = (query: string, tags: string[]) => {
  return useQuery({
    queryKey: ['search', query, tags],
    queryFn: () => searchPodcasts(query, tags),
    enabled: query.length > 0,
  });
};

const useSuperPods = () => {
  return useQuery({
    queryKey: ['superpods'],
    queryFn: fetchUserSuperPods,
  });
};

const useCreateSuperPod = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createSuperPod,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superpods'] });
    },
  });
};
```

### Phase 4: Real-time State
**WebSocket Integration:**
```typescript
// Real-time updates for collaborative features
const useRealtimeUpdates = () => {
  useEffect(() => {
    const socket = io('/superpods');
    
    socket.on('playlist_updated', (data) => {
      // Update local state with real-time changes
      updatePlaylist(data.playlist);
    });
    
    return () => socket.disconnect();
  }, []);
};
```

## 🔒 State Persistence Strategy

### Current: Session Only
State is lost on page refresh (appropriate for prototype)

### Future: Selective Persistence
```typescript
// User preferences (persistent)
const usePersistedPreferences = () => {
  const [preferences, setPreferences] = useLocalStorage('superpod-preferences', {
    sidebarCollapsed: false,
    searchCollapsed: false,
    aiSettings: defaultAISettings,
  });
  
  return [preferences, setPreferences];
};

// Session state (temporary)
const useSessionState = () => {
  const [currentPlaylist, setCurrentPlaylist] = useState<PodcastSegment[]>([]);
  // Lost on refresh - user can rebuild easily
};

// Cached data (with expiration)
const useCachedSearchResults = () => {
  return useQuery({
    queryKey: ['search-cache'],
    queryFn: fetchSearchResults,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};
```

## 📈 Performance Optimization

### Memoization Strategy
```typescript
// Expensive computations
const filteredResults = useMemo(() => {
  return searchResults.filter(result => 
    selectedTags.every(tag => result.tags.includes(tag))
  );
}, [searchResults, selectedTags]);

// Stable event handlers
const handleAddToPlaylist = useCallback((segment: PodcastSegment) => {
  setCurrentPlaylist(prev => [...prev, segment]);
}, []);

// Component memoization
const MemoizedKnowledgeGraph = memo(KnowledgeGraph, (prev, next) => {
  return prev.searchResults.length === next.searchResults.length &&
         prev.selectedTags.join(',') === next.selectedTags.join(',');
});
```

### State Update Batching
```typescript
// Batch related state updates
const handlePlaySuperPod = (superPod: SuperPod) => {
  // React automatically batches these updates
  setCurrentPlayingPlaylist(superPod.segments);
  setCurrentSegment(superPod.segments[0]);
  setCurrentIndex(0);
  setIsPlaying(true);
};
```

---

*This state management documentation provides a comprehensive view of how data flows through the SuperPod application, from the current prototype implementation to future scalability considerations.*