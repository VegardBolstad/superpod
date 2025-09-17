# Technical Specifications

## 🏗️ System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite (recommended) or Create React App
- **State Management**: React Hooks with centralized state in App.tsx
- **Styling**: Tailwind CSS v4 with CSS custom properties
- **Component Library**: Shadcn/ui for consistent, accessible components
- **Icons**: Lucide React for consistent iconography

### Key Technical Decisions
- **No External State Management**: Uses React's built-in state management for simplicity
- **Component Composition**: Favors composition over inheritance for flexibility
- **Mock-First Development**: Built with realistic mock data for rapid prototyping
- **Responsive-First**: Mobile-aware design with adaptive behavior
- **Type-Safe**: Full TypeScript coverage for runtime error prevention

## 📊 Data Models

### Core Interfaces

**PodcastSegment Interface:**
```typescript
export interface PodcastSegment {
  id: string;                    // Unique identifier
  title: string;                 // Segment title
  podcast: string;               // Podcast name
  duration: string;              // Format: "8:45"
  tags: string[];                // Categorization tags
  description?: string;          // Segment description
  publishDate?: string;          // Publication date
  episode?: string;              // Episode number/name
  transcript?: string;           // Full text transcript
  relatedTopics?: string[];      // Related topic suggestions
}
```

**GraphNode Interface:**
```typescript
interface GraphNode extends PodcastSegment {
  relevance: number;             // 0-1 relevance score
  x: number;                     // Graph position (future use)
  y: number;                     // Graph position (future use)
  connections: string[];         // Connected segment IDs
}
```

**SuperPod Interface:**
```typescript
export interface SuperPod {
  id: string;                    // Unique identifier
  name: string;                  // User-defined name
  segments: PodcastSegment[];    // Ordered segment list
  totalDuration: string;         // Calculated total duration
  createdAt: string;             // ISO timestamp
  summary?: string;              // AI-generated or user summary
}
```

**AISettings Interface:**
```typescript
interface AISettings {
  enableNarration: boolean;      // AI voice narration
  enableSummaries: boolean;      // Segment summaries
  enableTransitions: boolean;    // Inter-segment transitions
  voiceStyle: string;            // "neutral" | "professional" | "casual"
  speakingSpeed: number;         // 0.5 - 2.0 multiplier
  summaryLength: string;         // "brief" | "detailed" | "comprehensive"
  transitionStyle: string;       // "smooth" | "quick" | "contextual"
}
```

## 🎨 Styling Architecture

### Tailwind CSS v4 Configuration
**CSS Custom Properties:**
```css
:root {
  /* Base colors */
  --background: #ffffff;
  --foreground: oklch(0.145 0 0);
  --card: #ffffff;
  --card-foreground: oklch(0.145 0 0);
  
  /* Interactive colors */
  --primary: #030213;
  --primary-foreground: oklch(1 0 0);
  --secondary: oklch(0.95 0.0058 264.53);
  --secondary-foreground: #030213;
  
  /* Semantic colors */
  --muted: #ececf0;
  --muted-foreground: #717182;
  --accent: #e9ebef;
  --accent-foreground: #030213;
  --destructive: #d4183d;
  --destructive-foreground: #ffffff;
  
  /* Layout colors */
  --border: rgba(0, 0, 0, 0.1);
  --input: transparent;
  --input-background: #f3f3f5;
  --ring: oklch(0.708 0 0);
  
  /* Sidebar colors */
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: #030213;
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  
  /* Typography */
  --font-weight-medium: 500;
  --font-weight-normal: 400;
  
  /* Spacing */
  --radius: 0.625rem;
}
```

**Dark Theme Variables:**
```css
.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.145 0 0);
  --primary: oklch(0.985 0 0);
  --secondary: oklch(0.269 0 0);
  --muted: oklch(0.269 0 0);
  --accent: oklch(0.269 0 0);
  --border: oklch(0.269 0 0);
  --sidebar: oklch(0.205 0 0);
  --sidebar-accent: oklch(0.269 0 0);
}
```

### Typography System
**Base Typography (No Tailwind Classes Required):**
```css
:where(:not(:has([class*=" text-"]), :not(:has([class^="text-"])))) {
  h1 { font-size: var(--text-2xl); font-weight: var(--font-weight-medium); line-height: 1.5; }
  h2 { font-size: var(--text-xl); font-weight: var(--font-weight-medium); line-height: 1.5; }
  h3 { font-size: var(--text-lg); font-weight: var(--font-weight-medium); line-height: 1.5; }
  h4 { font-size: var(--text-base); font-weight: var(--font-weight-medium); line-height: 1.5; }
  p { font-size: var(--text-base); font-weight: var(--font-weight-normal); line-height: 1.5; }
  label { font-size: var(--text-base); font-weight: var(--font-weight-medium); line-height: 1.5; }
  button { font-size: var(--text-base); font-weight: var(--font-weight-medium); line-height: 1.5; }
  input { font-size: var(--text-base); font-weight: var(--font-weight-normal); line-height: 1.5; }
}
```

## 📱 Responsive Specifications

### Breakpoint System
```typescript
// Responsive breakpoints
const breakpoints = {
  mobile: 'max-width: 767px',      // < 768px
  tablet: '768px to 1023px',       // 768px - 1023px  
  desktop: 'min-width: 1024px',    // >= 1024px
};
```

### Layout Specifications

**Desktop Layout (≥1024px):**
```
┌─────────────────────────────────────────────────────────┐
│ Header (h-16)                                     [Menu]│
├───────────┬─────────────────────────────────────────────┤
│ Sidebar   │ Search Interface (collapsible)              │
│ (w-80)    ├─────────────────────────────────────────────┤
│           │ Knowledge Graph (flex-1)                    │
│           │                                             │
│           │                                             │
├───────────┴─────────────────────────────────────────────┤
│ Audio Player (h-20)                                     │
└─────────────────────────────────────────────────────────┘
```

**Tablet Layout (768px-1023px):**
```
┌─────────────────────────────────────────────────────────┐
│ Header (h-16)                                     [Menu]│
├─────────────────────────────────────────────────────────┤
│ Search Interface (collapsible)                          │
├─────────────────────────────────────────────────────────┤
│ Knowledge Graph (flex-1)                                │
│                                                         │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ Audio Player (h-20)                                     │
└─────────────────────────────────────────────────────────┘
```

**Mobile Layout (<768px):**
```
┌─────────────────────────┐
│ Header (h-16)     [Menu]│
├─────────────────────────┤
│ Knowledge Graph         │
│                         │
│                         │
│                         │
├─────────────────────────┤
│ Audio Player (h-20)     │
└─────────────────────────┘
```

### Adaptive Behavior Logic
```typescript
// Responsive state management
useEffect(() => {
  const handleResize = () => {
    const width = window.innerWidth;
    
    if (width < 768) {
      // Mobile: Both panels collapsed by default
      if (!hasUserToggledSidebar) setIsSidebarCollapsed(true);
      if (!hasUserToggledSearch) setIsSearchCollapsed(true);
    } else if (width < 1024) {
      // Tablet: Sidebar collapsed, search visible
      if (!hasUserToggledSidebar) setIsSidebarCollapsed(true);
      if (!hasUserToggledSearch) setIsSearchCollapsed(false);
    } else {
      // Desktop: Both panels visible
      if (!hasUserToggledSidebar) setIsSidebarCollapsed(false);
      if (!hasUserToggledSearch) setIsSearchCollapsed(false);
    }
  };

  handleResize();
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, [hasUserToggledSidebar, hasUserToggledSearch]);
```

## 🔌 Component Specifications

### Drag & Drop Implementation
**React DND Configuration:**
```typescript
// DraggablePlaylist.tsx specifications
interface DragItem {
  index: number;
  id: string;
  type: string;
}

// Drag source configuration
const [{ isDragging }, drag] = useDrag({
  type: "segment",
  item: (): DragItem => ({
    id: segment.id,
    index,
    type: "segment",
  }),
  collect: (monitor) => ({
    isDragging: monitor.isDragging(),
  }),
});

// Drop target configuration  
const [, drop] = useDrop({
  accept: "segment",
  hover: (item: DragItem) => {
    if (!item || item.index === index) return;
    
    moveSegment(item.index, index);
    item.index = index;
  },
});
```

### Modal System Specifications
**Dialog Implementation Pattern:**
```typescript
// All modals follow this pattern
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Additional props specific to modal
}

// Implementation with portal rendering
<Dialog open={isOpen} onOpenChange={onClose}>
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle>Modal Title</DialogTitle>
    </DialogHeader>
    {/* Modal content */}
    <DialogFooter>
      <Button variant="outline" onClick={onClose}>Cancel</Button>
      <Button onClick={handleSave}>Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

## 🎨 Animation Specifications

### Motion Library Configuration
```typescript
// Standard animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.2, ease: "easeOut" }
};

const slideIn = {
  initial: { x: -100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 100, opacity: 0 },
  transition: { duration: 0.3, ease: "easeInOut" }
};

// Panel collapse animation
const panelVariants = {
  open: { width: 320, opacity: 1 },
  closed: { width: 0, opacity: 0 },
  transition: { duration: 0.3, ease: "easeInOut" }
};
```

### Interaction Feedback Specifications
```css
/* Hover and focus states */
.interactive {
  transition: all 0.15s ease;
}

.interactive:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.interactive:active {
  transform: translateY(0);
}

.interactive:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
}

/* Button press feedback */
.button:active {
  transform: scale(0.98);
}
```

## 🔄 State Management Specifications

### State Structure
```typescript
// Application state shape
interface AppState {
  // Content state
  searchResults: GraphNode[];
  currentPlaylist: PodcastSegment[];
  superPods: SuperPod[];
  currentQuery: string;
  selectedSources: string[];
  
  // Playback state
  currentSegment: PodcastSegment | null;
  currentPlayingPlaylist: PodcastSegment[];
  currentIndex: number;
  isPlaying: boolean;
  
  // UI state
  isSidebarCollapsed: boolean;
  isSearchCollapsed: boolean;
  isMenuOpen: boolean;
  hasUserToggledSidebar: boolean;
  hasUserToggledSearch: boolean;
  
  // Modal state
  previewSegment: PodcastSegment | null;
  isPreviewOpen: boolean;
  selectedSuperPod: SuperPod | null;
  isAISettingsOpen: boolean;
  isSuperPodDetailsOpen: boolean;
  
  // Settings
  aiSettings: AISettings;
}
```

### Event Handler Specifications
```typescript
// Standardized event handler signatures
type SearchHandler = (
  query: string,
  tags: string[],
  categories: string[],
  sources: string[]
) => void;

type PlaylistHandler = (segments: PodcastSegment[]) => void;
type SegmentHandler = (segment: PodcastSegment) => void;
type SuperPodHandler = (superPod: SuperPod) => void;
type StringHandler = (value: string) => void;
type BooleanHandler = (value: boolean) => void;
type VoidHandler = () => void;
```

## 🔒 Security Specifications

### Input Validation
```typescript
// Search input sanitization
const sanitizeSearchInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML
    .substring(0, 200);   // Limit length
};

// Segment data validation
const validateSegment = (segment: any): segment is PodcastSegment => {
  return (
    typeof segment.id === 'string' &&
    typeof segment.title === 'string' &&
    typeof segment.podcast === 'string' &&
    typeof segment.duration === 'string' &&
    Array.isArray(segment.tags)
  );
};
```

### XSS Prevention
```typescript
// Safe HTML rendering (when needed)
import DOMPurify from 'dompurify';

const SafeHTMLContent = ({ content }: { content: string }) => {
  const sanitizedContent = DOMPurify.sanitize(content);
  return <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />;
};
```

## 📊 Performance Specifications

### Bundle Size Targets
- **Initial Bundle**: < 500KB gzipped
- **Vendor Bundle**: < 200KB gzipped
- **Component Chunks**: < 50KB gzipped each
- **Total Bundle**: < 1MB gzipped

### Performance Budgets
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.5s
- **Cumulative Layout Shift**: < 0.1

### Optimization Strategies
```typescript
// Code splitting configuration
const AISettingsModal = lazy(() => 
  import('./components/ai-settings-modal').then(module => ({
    default: module.AISettingsModal
  }))
);

// Component memoization
const KnowledgeGraph = memo(KnowledgeGraphComponent, (prev, next) => {
  return (
    prev.searchResults.length === next.searchResults.length &&
    prev.suggestions === next.suggestions
  );
});

// Debounced search
const debouncedSearch = useMemo(
  () => debounce((query: string) => {
    performSearch(query);
  }, 300),
  []
);
```

## 📱 Accessibility Specifications

### WCAG 2.1 AA Compliance
- **Color Contrast**: Minimum 4.5:1 for normal text, 3:1 for large text
- **Keyboard Navigation**: Full functionality without mouse
- **Screen Reader**: Proper ARIA labels and semantic HTML
- **Focus Management**: Visible focus indicators and logical tab order

### Accessibility Implementation
```typescript
// ARIA labels and roles
<Button
  aria-label={`Add ${segment.title} to playlist`}
  aria-describedby={`segment-${segment.id}-description`}
>
  Add to Playlist
</Button>

// Live regions for dynamic content
<div
  aria-live="polite"
  aria-atomic="true"
  className="sr-only"
>
  {searchResults.length} search results found
</div>

// Keyboard navigation
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    closeModal();
  } else if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    handleAction();
  }
};
```

## 🧪 Testing Specifications

### Test Coverage Targets
- **Unit Tests**: > 80% line coverage
- **Integration Tests**: All major user flows
- **E2E Tests**: Critical path scenarios
- **Accessibility Tests**: Automated a11y checks

### Test Types and Tools
```typescript
// Unit test example
describe('SearchInterface', () => {
  it('should call onSearch with sanitized input', () => {
    const mockOnSearch = jest.fn();
    render(<SearchInterface onSearch={mockOnSearch} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '<script>alert("xss")</script>AI ethics' } });
    fireEvent.submit(input.closest('form')!);
    
    expect(mockOnSearch).toHaveBeenCalledWith(
      'AI ethics', // XSS attempt removed
      [], [], []
    );
  });
});

// Integration test example
describe('Playlist Creation Flow', () => {
  it('should create and save a SuperPod', async () => {
    render(<App />);
    
    // Search for content
    const searchInput = screen.getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'AI' } });
    fireEvent.submit(searchInput.closest('form')!);
    
    // Add segment to playlist
    const addButton = await screen.findByText('Add to Playlist');
    fireEvent.click(addButton);
    
    // Save SuperPod
    const saveButton = screen.getByText('Save SuperPod');
    fireEvent.click(saveButton);
    
    const nameInput = screen.getByPlaceholderText('SuperPod name...');
    fireEvent.change(nameInput, { target: { value: 'My AI SuperPod' } });
    fireEvent.click(screen.getByText('Save'));
    
    // Verify SuperPod created
    expect(screen.getByText('My AI SuperPod')).toBeInTheDocument();
  });
});
```

---

*This technical specification provides comprehensive implementation details for the SuperPod frontend application, covering all aspects from data models to performance requirements.*