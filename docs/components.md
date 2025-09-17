# Component Documentation

## 📋 Component Overview

SuperPod is built with a modular component architecture. Each component has a specific responsibility and communicates through well-defined props and event handlers.

## 🎛️ Core Components

### App.tsx
**Main Application Container**

The root component that manages global state and coordinates between all child components.

**Key Responsibilities:**
- Application state management
- Event handler orchestration  
- Responsive behavior coordination
- Modal state management

**State Management:**
```typescript
// Core state
const [searchResults, setSearchResults] = useState<GraphNode[]>([]);
const [currentPlaylist, setCurrentPlaylist] = useState<PodcastSegment[]>([]);
const [superPods, setSuperPods] = useState<SuperPod[]>([]);
const [currentSegment, setCurrentSegment] = useState<PodcastSegment | null>(null);

// UI state
const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
const [isSearchCollapsed, setIsSearchCollapsed] = useState(false);
const [isMenuOpen, setIsMenuOpen] = useState(false);
```

**Responsive Logic:**
- Auto-collapses panels based on screen size
- Remembers user preferences for manual toggles
- Keyboard shortcuts (⌘B, ⌘F) for quick access

---

### SearchInterface.tsx
**Search Input and Filtering Controls**

Provides the main search functionality with tag and category filtering.

**Props Interface:**
```typescript
interface SearchInterfaceProps {
  onSearch: (query: string, tags: string[], categories: string[], sources: string[]) => void;
  currentQuery: string;
  resultCount: number;
  isCollapsed: boolean;
}
```

**Features:**
- **Text Search**: Natural language query input
- **Tag Filtering**: Multi-select tag chips with suggestions
- **Category Selection**: Podcast category filtering
- **Source Filtering**: Choose from available podcast sources
- **Collapsible Interface**: Compact mode for mobile/tablet

**Implementation Highlights:**
```typescript
// Dynamic tag suggestions based on search
const getTagSuggestions = (query: string) => {
  return availableTags.filter(tag => 
    tag.toLowerCase().includes(query.toLowerCase())
  );
};

// Integrated search execution
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  onSearch(searchQuery, selectedTags, selectedCategories, selectedSources);
};
```

---

### KnowledgeGraph.tsx
**Visual Search Results Display**

Displays search results as an interactive knowledge graph with clickable suggestions.

**Props Interface:**
```typescript
interface KnowledgeGraphProps {
  searchResults: GraphNode[];
  onPreview: (segment: GraphNode) => void;
  onAddToPlaylist: (segment: PodcastSegment) => void;
  suggestions: {
    top: string[];
    bottom: string[];
    left: string[];
    right: string[];
  };
  onSuggestionClick: (suggestion: string) => void;
}
```

**Features:**
- **Grid Layout**: Responsive card-based result display
- **Contextual Suggestions**: Related topics positioned around results
- **Interactive Cards**: Preview and add-to-playlist actions
- **Visual Hierarchy**: Relevance-based styling and layout

**Card Component Structure:**
```typescript
// Individual result card
<div className="group relative bg-card border rounded-lg p-4 hover:shadow-md transition-all">
  <div className="flex items-start justify-between mb-2">
    <h3 className="text-sm font-medium">{segment.title}</h3>
    <Badge className="text-xs">{segment.relevance}%</Badge>
  </div>
  
  <div className="text-xs text-muted-foreground mb-3">
    {segment.podcast} • {segment.duration}
  </div>
  
  <div className="flex gap-1 mb-3">
    {segment.tags.map(tag => (
      <Badge key={tag} variant="secondary" className="text-xs">
        {tag}
      </Badge>
    ))}
  </div>
  
  <div className="flex gap-2">
    <Button size="sm" onClick={() => onPreview(segment)}>
      Preview
    </Button>
    <Button size="sm" variant="outline" onClick={() => onAddToPlaylist(segment)}>
      Add to Playlist
    </Button>
  </div>
</div>
```

---

### SuperPodSidebar.tsx
**Playlist and Library Management**

Manages the current playlist creation and displays saved SuperPods library.

**Props Interface:**
```typescript
interface SuperPodSidebarProps {
  superPods: SuperPod[];
  currentPlaylist: PodcastSegment[];
  onPlaySuperPod: (superPod: SuperPod) => void;
  onCreateSuperPod: () => void;
  onDeleteSuperPod: (id: string) => void;
  onViewSuperPod: (superPod: SuperPod) => void;
  onClearPlaylist: () => void;
  onSaveCurrentPlaylist: (name: string) => void;
  onReorderPlaylist: (reorderedSegments: PodcastSegment[]) => void;
  onOpenAISettings: () => void;
  isCollapsed?: boolean;
}
```

**Features:**
- **Current Playlist Management**: Add, reorder, and save segments
- **Drag & Drop Integration**: Uses DraggablePlaylist component
- **SuperPod Library**: Browse and manage saved SuperPods
- **AI Settings Access**: Quick access to narration configuration
- **Responsive Behavior**: Collapses on smaller screens

**Dynamic Visibility Logic:**
```typescript
// Current playlist only shows when segments exist
{currentPlaylist.length > 0 && (
  <Card className="p-3 bg-sidebar-accent">
    <div className="flex items-center justify-between mb-2">
      <h3>Current Playlist</h3>
      <Badge variant="secondary">{currentPlaylist.length} segments</Badge>
    </div>
    <DraggablePlaylist segments={currentPlaylist} onReorder={onReorderPlaylist} />
  </Card>
)}

// Empty state only shows when no SuperPods AND no current playlist
{superPods.length === 0 && currentPlaylist.length === 0 ? (
  <div className="text-center py-8 text-muted-foreground">
    <FolderOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
    <p className="text-sm">No SuperPods yet</p>
  </div>
) : (
  // SuperPods list
)}
```

---

### DraggablePlaylist.tsx
**Drag & Drop Playlist Management**

Enables reordering of playlist segments through drag and drop interaction.

**Props Interface:**
```typescript
interface DraggablePlaylistProps {
  segments: PodcastSegment[];
  onReorder: (reorderedSegments: PodcastSegment[]) => void;
}
```

**Key Features:**
- **React DND Integration**: HTML5 drag and drop backend
- **State Synchronization**: Syncs with parent component updates
- **Visual Feedback**: Opacity changes during drag operations
- **Responsive Layout**: Adapts to container width

**Implementation Architecture:**
```typescript
// State synchronization with parent
useEffect(() => {
  setLocalSegments(segments);
}, [segments]);

// Drag and drop logic
const moveSegment = (dragIndex: number, hoverIndex: number) => {
  const newSegments = [...localSegments];
  const draggedSegment = newSegments[dragIndex];
  
  newSegments.splice(dragIndex, 1);
  newSegments.splice(hoverIndex, 0, draggedSegment);
  
  setLocalSegments(newSegments);
  onReorder(newSegments);
};

// Individual draggable segment
const DraggableSegment = ({ segment, index, moveSegment }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "segment",
    item: { id: segment.id, index, type: "segment" },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  const [, drop] = useDrop({
    accept: "segment",
    hover: (item) => {
      if (item.index !== index) {
        moveSegment(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      style={{ opacity: isDragging ? 0.4 : 1 }}
      className="cursor-move p-2 bg-background/50 hover:bg-background/70 rounded"
    >
      {/* Segment content */}
    </div>
  );
};
```

---

### AudioPlayer.tsx
**Audio Playback Controls**

Provides comprehensive audio playback controls and playlist navigation.

**Props Interface:**
```typescript
interface AudioPlayerProps {
  currentSegment: PodcastSegment | null;
  playlist: PodcastSegment[];
  currentIndex: number;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onTogglePlaylist: () => void;
}
```

**Features:**
- **Transport Controls**: Play, pause, next, previous
- **Progress Tracking**: Seek bar with time display
- **Volume Control**: Adjustable audio level
- **Playlist Navigation**: Current segment info and playlist access
- **Responsive Layout**: Adapts to screen width

**Component Structure:**
```typescript
<div className="h-20 bg-card border-t flex items-center px-6">
  {/* Now Playing Info */}
  <div className="flex items-center gap-3 min-w-0 flex-1">
    <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
      <Music className="w-5 h-5 text-muted-foreground" />
    </div>
    <div className="min-w-0">
      <div className="text-sm font-medium truncate">
        {currentSegment?.title || "No segment selected"}
      </div>
      <div className="text-xs text-muted-foreground truncate">
        {currentSegment?.podcast}
      </div>
    </div>
  </div>

  {/* Transport Controls */}
  <div className="flex items-center gap-2">
    <Button size="sm" variant="ghost" onClick={onPrevious}>
      <SkipBack className="w-4 h-4" />
    </Button>
    <Button size="sm" onClick={isPlaying ? onPause : onPlay}>
      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
    </Button>
    <Button size="sm" variant="ghost" onClick={onNext}>
      <SkipForward className="w-4 h-4" />
    </Button>
  </div>
</div>
```

---

## 🗂️ Modal Components

### SegmentPreview.tsx
**Detailed Segment Information Modal**

Displays comprehensive segment information including full transcript.

**Features:**
- **Full Transcript Display**: Scrollable transcript text
- **Metadata Information**: Episode details, publish date, duration
- **Related Topics**: Clickable topic suggestions
- **Action Buttons**: Play immediately or add to playlist
- **Responsive Design**: Optimized for all screen sizes

### AISettingsModal.tsx
**AI Narration Configuration**

Allows users to customize AI narration preferences for SuperPods.

**Settings Categories:**
- **Voice Configuration**: Style, speed, and tone settings
- **Content Options**: Enable/disable summaries and transitions
- **Personalization**: Learning preferences and customization

### SuperPodDetailsModal.tsx
**SuperPod Information and Management**

Comprehensive view of saved SuperPods with editing capabilities.

**Features:**
- **Segment List**: View all segments in the SuperPod
- **Summary Editing**: AI-generated or custom summaries
- **Metadata Management**: Title, description, and tags
- **Playback Options**: Start playback from any segment

---

## 🧩 UI Components (Shadcn/ui)

The application leverages Shadcn/ui components for consistent, accessible UI elements:

### Core UI Components Used
- **Button** - All interactive actions
- **Card** - Content containers and section organization
- **Badge** - Tags, status indicators, and metadata
- **Dialog** - Modal containers for detailed views
- **Input** - Form inputs and search fields
- **Select** - Dropdown selections for categories and sources
- **Separator** - Visual content separation
- **ScrollArea** - Scrollable content regions
- **Tooltip** - Contextual help and information

### Customization Strategy
Components are customized through:
1. **CSS Custom Properties** - Theme colors and spacing
2. **Tailwind Classes** - Layout and responsive behavior
3. **Component Variants** - Size and style variations
4. **Compound Components** - Complex UI patterns

---

## 🔄 Component Communication Patterns

### Parent-Child Communication
```typescript
// Parent passes data down, child sends events up
<SearchInterface 
  currentQuery={searchQuery}           // Data down
  onSearch={handleSearch}              // Events up
/>
```

### Event Bubbling
```typescript
// Events bubble up through component hierarchy
KnowledgeGraph → onPreview → App → setPreviewSegment → SegmentPreview
```

### State Lifting
```typescript
// Shared state lives in closest common ancestor
App (shared state) → SuperPodSidebar & AudioPlayer (consume state)
```

### Context Usage (Future)
For cross-cutting concerns like themes and user preferences:
```typescript
// Planned for production implementation
<ThemeProvider>
  <UserPreferencesProvider>
    <App />
  </UserPreferencesProvider>
</ThemeProvider>
```

---

*This component documentation provides implementation details for all major components in the SuperPod application. Each component is designed for reusability, maintainability, and optimal user experience.*