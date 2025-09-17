# Frontend Architecture

## 🏗️ Architecture Overview

SuperPod follows a modern React architecture with functional components, hooks for state management, and a component-driven design approach. The application prioritizes maintainability, type safety, and responsive user experience.

## 📋 Technical Stack

### Core Technologies
- **React 18** - Component library with concurrent features
- **TypeScript** - Type safety and developer experience
- **Tailwind CSS v4** - Utility-first styling with design tokens
- **Vite/Create React App** - Build tooling and development server

### Key Libraries
- **Shadcn/ui** - Accessible, customizable UI component library
- **React DND** - Drag and drop functionality for playlist management
- **Motion (Framer Motion)** - Smooth animations and transitions
- **Recharts** - Data visualization for analytics and graphs
- **Sonner** - Toast notifications for user feedback
- **Lucide React** - Consistent icon system

## 🗂️ Project Structure

```
src/
├── App.tsx                    # Main application component
├── components/
│   ├── audio-player.tsx       # Audio playback controls
│   ├── draggable-playlist.tsx # Drag & drop playlist management
│   ├── knowledge-graph.tsx    # Visual search results display
│   ├── search-interface.tsx   # Search input and filters
│   ├── segment-preview.tsx    # Segment detail modal
│   ├── superpod-sidebar.tsx   # Playlist and library management
│   ├── ai-settings-modal.tsx  # AI narration configuration
│   ├── superpod-details-modal.tsx # SuperPod viewing modal
│   └── ui/                    # Shadcn/ui component library
├── styles/
│   └── globals.css           # Tailwind configuration and design tokens
└── types/                    # TypeScript type definitions
```

## 🔄 State Management Strategy

### Component-Level State
Uses React's `useState` and `useEffect` hooks for local component state:

```typescript
// Example: Search interface state
const [searchQuery, setSearchQuery] = useState("");
const [selectedTags, setSelectedTags] = useState<string[]>([]);
const [isCollapsed, setIsCollapsed] = useState(false);
```

### Application-Level State
Centralized in `App.tsx` using the "Lifting State Up" pattern:

```typescript
// Core application state
const [searchResults, setSearchResults] = useState<GraphNode[]>([]);
const [currentPlaylist, setCurrentPlaylist] = useState<PodcastSegment[]>([]);
const [superPods, setSuperPods] = useState<SuperPod[]>([]);
const [currentSegment, setCurrentSegment] = useState<PodcastSegment | null>(null);
```

### Props-Based Communication
State flows down through props, events bubble up through callbacks:

```typescript
<SuperPodSidebar
  superPods={superPods}
  currentPlaylist={currentPlaylist}
  onSaveCurrentPlaylist={handleSaveCurrentPlaylist}
  onReorderPlaylist={handleReorderPlaylist}
/>
```

### Future State Management
For production scale, consider:
- **Zustand** - Lightweight state management
- **React Query** - Server state and caching
- **Context API** - User preferences and theme

## 🧩 Component Architecture

### Composition Pattern
Components are designed for reusability and composition:

```typescript
// Modal components follow consistent patterns
<SegmentPreview
  segment={previewSegment}
  isOpen={isPreviewOpen}
  onClose={() => setIsPreviewOpen(false)}
  onPlay={handlePlaySegment}
  onAddToPlaylist={handleAddToPlaylist}
/>
```

### Controlled Components
Form elements and interactive components are controlled:

```typescript
// Search interface as controlled component
<SearchInterface 
  onSearch={handleSearch} 
  currentQuery={currentQuery}
  resultCount={searchResults.length}
  isCollapsed={isSearchCollapsed}
/>
```

### Event-Driven Architecture
Components communicate through well-defined event handlers:

```typescript
// Drag and drop events
const handleReorderPlaylist = (reorderedSegments: PodcastSegment[]) => {
  setCurrentPlaylist(reorderedSegments);
};
```

## 🎨 Design System Integration

### Tailwind CSS v4 Configuration
Uses CSS custom properties for theming:

```css
:root {
  --primary: #030213;
  --secondary: oklch(0.95 0.0058 264.53);
  --sidebar: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
}
```

### Component Styling Strategy
1. **Base Styles** - Defined in `globals.css` with typography defaults
2. **Component Variants** - Using Shadcn/ui's class-variance-authority
3. **Responsive Classes** - Tailwind responsive prefixes for breakpoints
4. **Theme Support** - Light/dark mode through CSS custom properties

### Typography System
Base typography applied without Tailwind classes:

```css
:where(:not(:has([class*=" text-"]), :not(:has([class^="text-"])))) {
  h1 { font-size: var(--text-2xl); font-weight: var(--font-weight-medium); }
  p { font-size: var(--text-base); font-weight: var(--font-weight-normal); }
}
```

## 📱 Responsive Design Architecture

### Breakpoint Strategy
- **Desktop First** - Primary design target (1024px+)
- **Tablet Adaptation** - Collapsible sidebar (768px - 1024px)
- **Mobile Optimization** - Compact interface (< 768px)

### Adaptive Behavior
Components respond to screen size changes:

```typescript
useEffect(() => {
  const handleResize = () => {
    if (window.innerWidth < 768) {
      if (!hasUserToggledSidebar) setIsSidebarCollapsed(true);
      if (!hasUserToggledSearch) setIsSearchCollapsed(true);
    }
  };
  
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, [hasUserToggledSidebar, hasUserToggledSearch]);
```

### User Preference Memory
The app remembers user choices for panel states:

```typescript
const [hasUserToggledSidebar, setHasUserToggledSidebar] = useState(false);
const [hasUserToggledSearch, setHasUserToggledSearch] = useState(false);
```

## 🔌 Integration Architecture

### Mock Data Layer
Current implementation uses mock data with realistic structure:

```typescript
const mockSegments: GraphNode[] = [
  {
    id: "1",
    title: "The Future of AI in Creative Industries",
    podcast: "Tech Talk Daily",
    duration: "8:45",
    tags: ["AI", "creativity", "technology"],
    relevance: 0.95,
    connections: ["2", "4"],
    // ... additional metadata
  }
];
```

### API Integration Points
Designed for easy backend integration:

```typescript
// Search function ready for API integration
const handleSearch = async (query: string, tags: string[], categories: string[], sources: string[]) => {
  // Current: Mock implementation
  const filtered = mockSegments.filter(/* mock filtering logic */);
  setSearchResults(filtered);
  
  // Future: Real API call
  // const response = await fetch('/api/search', { ... });
  // const results = await response.json();
  // setSearchResults(results);
};
```

### Data Flow Architecture
Unidirectional data flow from API → State → Components:

```
[API/Mock Data] → [App State] → [Component Props] → [UI Rendering]
                      ↑              ↓
                [Event Handlers] ← [User Interactions]
```

## 🚀 Performance Considerations

### Component Optimization
- **React.memo** for expensive re-renders
- **useCallback** for event handler stability
- **useMemo** for computed values
- **Lazy loading** for modal components

### Bundle Optimization
- **Code splitting** by route/feature
- **Tree shaking** with ES modules
- **Dynamic imports** for heavy components
- **Asset optimization** for images/icons

### State Update Patterns
Efficient state updates to minimize re-renders:

```typescript
// Batch updates for related state changes
const handlePlaySuperPod = (superPod: SuperPod) => {
  setCurrentPlayingPlaylist(superPod.segments);
  setCurrentSegment(superPod.segments[0]);
  setCurrentIndex(0);
  setIsPlaying(true);
};
```

## 🧪 Testing Architecture

### Component Testing Strategy
- **Unit Tests** - Individual component behavior
- **Integration Tests** - Component interaction
- **E2E Tests** - User journey validation
- **Accessibility Tests** - ARIA and keyboard navigation

### Mock Data Testing
Realistic mock data enables thorough testing:

```typescript
// Test data matches production interface
interface TestSegment extends PodcastSegment {
  // Includes all expected properties
  transcript?: string;
  relatedTopics?: string[];
}
```

## 🔒 Security Considerations

### Client-Side Security
- **Input Validation** - Sanitize user inputs
- **XSS Prevention** - Proper data escaping  
- **HTTPS Only** - Secure data transmission
- **Content Security Policy** - Restrict resource loading

### Data Handling
- **Local Storage** - Minimal sensitive data storage
- **Session Management** - Secure token handling
- **API Communication** - Authenticated requests only

## 📈 Scalability Planning

### Component Scalability
- **Atomic Design** - Reusable component hierarchy
- **Feature Modules** - Organized by functionality
- **Shared Utilities** - Common logic extraction
- **Type Safety** - Prevent runtime errors

### State Scalability
Current architecture supports growth to:
- **State Management Libraries** (Zustand, Redux)
- **Server State** (React Query, SWR)
- **Real-time Updates** (WebSocket integration)
- **Offline Support** (Service workers, IndexedDB)

---

*This architecture provides a solid foundation for the SuperPod application while remaining flexible for future enhancements and integrations.*