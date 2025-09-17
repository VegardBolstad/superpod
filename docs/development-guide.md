# Development Guide

## 🚀 Getting Started

### Prerequisites
- **Node.js**: Version 16+ recommended
- **npm** or **yarn**: Package manager
- **Git**: Version control
- **VS Code**: Recommended IDE with extensions

### Quick Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd superpod-frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
# http://localhost:3000 (Create React App)
# http://localhost:5173 (Vite)
```

## 📦 Dependencies

### Core Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "typescript": "^5.0.0",
  "@types/react": "^18.2.0",
  "@types/react-dom": "^18.2.0"
}
```

### UI & Styling
```json
{
  "tailwindcss": "^4.0.0-alpha",
  "@tailwindcss/typography": "^0.5.0",
  "class-variance-authority": "^0.7.0",
  "clsx": "^2.0.0",
  "tailwind-merge": "^2.0.0"
}
```

### Functionality Libraries
```json
{
  "lucide-react": "^0.400.0",
  "sonner": "2.0.3",
  "react-dnd": "^16.0.0",
  "react-dnd-html5-backend": "^16.0.0",
  "react-hook-form": "7.55.0",
  "motion": "^10.16.0",
  "recharts": "^2.8.0"
}
```

### Development Dependencies
```json
{
  "vite": "^5.0.0",
  "@vitejs/plugin-react": "^4.0.0",
  "eslint": "^8.50.0",
  "@typescript-eslint/eslint-plugin": "^6.0.0",
  "prettier": "^3.0.0"
}
```

## 🗂️ Project Structure

```
superpod-frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── App.tsx                    # Main application component
│   ├── index.tsx                  # Application entry point
│   ├── components/
│   │   ├── audio-player.tsx
│   │   ├── draggable-playlist.tsx
│   │   ├── knowledge-graph.tsx
│   │   ├── search-interface.tsx
│   │   ├── segment-preview.tsx
│   │   ├── superpod-sidebar.tsx
│   │   ├── ai-settings-modal.tsx
│   │   ├── superpod-details-modal.tsx
│   │   └── ui/                    # Shadcn/ui components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       └── ...
│   ├── styles/
│   │   └── globals.css           # Tailwind configuration
│   ├── types/
│   │   └── index.ts              # TypeScript type definitions
│   └── utils/
│       └── api.ts                # API integration utilities
├── docs/                         # Documentation
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts               # Or webpack config
└── README.md
```

## ⚙️ Configuration Files

### TypeScript Configuration (`tsconfig.json`)
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["DOM", "DOM.Iterable", "ES6"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/utils/*": ["./src/utils/*"]
    }
  },
  "include": [
    "src"
  ],
  "exclude": [
    "node_modules"
  ]
}
```

### Tailwind Configuration (`tailwind.config.js`)
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        // ... additional color definitions
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
}
```

### Vite Configuration (`vite.config.ts`)
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
```

## 🛠️ Development Workflow

### Code Organization Principles
1. **Component-First**: Each feature as a self-contained component
2. **Type Safety**: TypeScript interfaces for all data structures
3. **Consistent Naming**: PascalCase for components, camelCase for functions
4. **Single Responsibility**: Each component has one clear purpose
5. **Composition Over Inheritance**: Build complex UI from simple components

### File Naming Conventions
```
# Components
PascalCase.tsx          # SearchInterface.tsx
kebab-case.tsx          # search-interface.tsx (alternative)

# Utilities and Hooks
camelCase.ts            # useLocalStorage.ts
camelCase.ts            # apiHelpers.ts

# Types
PascalCase.ts           # PodcastTypes.ts
index.ts                # Re-export from directories
```

### Component Creation Template
```tsx
import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface ComponentNameProps {
  // Required props
  data: DataType;
  onAction: (param: ParamType) => void;
  
  // Optional props with defaults
  isVisible?: boolean;
  className?: string;
}

export function ComponentName({
  data,
  onAction,
  isVisible = true,
  className = ""
}: ComponentNameProps) {
  const [localState, setLocalState] = useState<StateType>();

  // Event handlers
  const handleClick = () => {
    onAction(data.id);
  };

  // Early returns for conditional rendering
  if (!isVisible) return null;

  return (
    <Card className={`p-4 ${className}`}>
      <h3>{data.title}</h3>
      <Button onClick={handleClick}>
        Action
      </Button>
    </Card>
  );
}
```

## 🧪 Testing Strategy

### Testing Stack
```json
{
  "@testing-library/react": "^13.4.0",
  "@testing-library/jest-dom": "^5.16.5",
  "@testing-library/user-event": "^14.4.3",
  "vitest": "^0.34.0",
  "jsdom": "^22.0.0"
}
```

### Test File Structure
```
src/
├── components/
│   ├── SearchInterface.tsx
│   ├── SearchInterface.test.tsx
│   ├── KnowledgeGraph.tsx
│   └── KnowledgeGraph.test.tsx
└── __tests__/
    ├── integration/
    │   └── search-flow.test.tsx
    └── utils/
        └── test-utils.tsx
```

### Testing Utilities (`test-utils.tsx`)
```tsx
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';

// Custom render function with providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <div>
        {/* Add providers here if needed */}
        {children}
      </div>
    );
  };

  return render(ui, { wrapper: Wrapper, ...options });
};

export * from '@testing-library/react';
export { customRender as render };
```

### Component Test Example
```tsx
import { render, screen, fireEvent } from './test-utils';
import { SearchInterface } from './SearchInterface';

describe('SearchInterface', () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  it('calls onSearch with correct parameters', () => {
    render(
      <SearchInterface
        onSearch={mockOnSearch}
        currentQuery=""
        resultCount={0}
        isCollapsed={false}
      />
    );

    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: 'AI ethics' } });
    fireEvent.submit(searchInput.closest('form')!);

    expect(mockOnSearch).toHaveBeenCalledWith('AI ethics', [], [], []);
  });

  it('displays result count correctly', () => {
    render(
      <SearchInterface
        onSearch={mockOnSearch}
        currentQuery="test"
        resultCount={5}
        isCollapsed={false}
      />
    );

    expect(screen.getByText('5 results')).toBeInTheDocument();
  });
});
```

## 📱 Responsive Development

### Breakpoint Testing
```tsx
// Use viewport meta tag in testing
beforeEach(() => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 1024, // Desktop width
  });
  window.dispatchEvent(new Event('resize'));
});

// Test mobile behavior
it('collapses sidebar on mobile', () => {
  Object.defineProperty(window, 'innerWidth', {
    value: 768,
  });
  window.dispatchEvent(new Event('resize'));
  
  // Assertions for mobile behavior
});
```

### CSS-in-JS Testing
```tsx
// Test responsive classes
it('applies correct responsive classes', () => {
  render(<Component />);
  const element = screen.getByTestId('responsive-element');
  
  expect(element).toHaveClass('hidden', 'md:block', 'lg:flex');
});
```

## 🔧 Debugging Tools

### React Developer Tools
- **Component Tree**: Inspect component hierarchy
- **Props & State**: View current component state
- **Profiler**: Performance analysis
- **Hook Inspector**: Debug custom hooks

### Browser DevTools
- **Console**: Debug logging and errors
- **Network**: API calls and performance
- **Elements**: CSS debugging and responsive testing
- **Application**: Local storage and state inspection

### Debug Logging Pattern
```tsx
const DEBUG = process.env.NODE_ENV === 'development';

const debugLog = (component: string, action: string, data?: any) => {
  if (DEBUG) {
    console.group(`🔧 ${component} - ${action}`);
    if (data) console.log(data);
    console.groupEnd();
  }
};

// Usage in components
const handleSearch = (query: string, tags: string[]) => {
  debugLog('SearchInterface', 'handleSearch', { query, tags });
  onSearch(query, tags, [], []);
};
```

## 🚀 Build & Deployment

### Development Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint src --ext ts,tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,css,md}\"",
    "type-check": "tsc --noEmit"
  }
}
```

### Build Optimization
```typescript
// vite.config.ts - Production optimizations
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-select'],
          dnd: ['react-dnd', 'react-dnd-html5-backend'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
```

### Environment Configuration
```bash
# .env.local
REACT_APP_API_URL=http://localhost:3001
REACT_APP_ENVIRONMENT=development
REACT_APP_DEBUG=true

# .env.production
REACT_APP_API_URL=https://api.superpod.com
REACT_APP_ENVIRONMENT=production
REACT_APP_DEBUG=false
```

## 🔌 Integration Guidelines

### API Integration Pattern
```typescript
// src/utils/api.ts
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const apiClient = {
  async searchPodcasts(query: string, tags: string[]): Promise<PodcastSegment[]> {
    const response = await fetch(`${API_BASE_URL}/api/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify({ query, tags }),
    });
    
    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText}`);
    }
    
    return response.json();
  },
  
  async createSuperPod(name: string, segments: PodcastSegment[]): Promise<SuperPod> {
    const response = await fetch(`${API_BASE_URL}/api/superpods`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify({ name, segments }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create SuperPod: ${response.statusText}`);
    }
    
    return response.json();
  },
};

// Usage in components
const handleSearch = async (query: string, tags: string[]) => {
  try {
    setIsLoading(true);
    const results = await apiClient.searchPodcasts(query, tags);
    setSearchResults(results);
  } catch (error) {
    toast.error('Search failed. Please try again.');
    console.error('Search error:', error);
  } finally {
    setIsLoading(false);
  }
};
```

### Error Boundary Implementation
```tsx
// src/components/ErrorBoundary.tsx
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-muted-foreground mb-4">
              We apologize for the inconvenience. Please refresh the page to try again.
            </p>
            <Button onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## 📊 Performance Guidelines

### Bundle Analysis
```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist

# Check for unused dependencies
npx depcheck
```

### Performance Monitoring
```tsx
// Performance measurement hooks
import { useEffect, useRef } from 'react';

export const usePerformanceMonitor = (componentName: string) => {
  const renderStart = useRef<number>();
  
  useEffect(() => {
    renderStart.current = performance.now();
  });
  
  useEffect(() => {
    if (renderStart.current) {
      const renderTime = performance.now() - renderStart.current;
      if (renderTime > 16) { // Longer than one frame
        console.warn(`${componentName} render took ${renderTime.toFixed(2)}ms`);
      }
    }
  });
};

// Usage in components
export function ExpensiveComponent() {
  usePerformanceMonitor('ExpensiveComponent');
  // Component logic
}
```

### Code Splitting Example
```tsx
// Lazy load modal components
import { lazy, Suspense } from 'react';

const AISettingsModal = lazy(() => import('./components/ai-settings-modal'));
const SuperPodDetailsModal = lazy(() => import('./components/superpod-details-modal'));

// Usage with loading fallback
<Suspense fallback={<div>Loading...</div>}>
  {isAISettingsOpen && (
    <AISettingsModal
      isOpen={isAISettingsOpen}
      onClose={() => setIsAISettingsOpen(false)}
      settings={aiSettings}
      onSave={handleAISettingsChange}
    />
  )}
</Suspense>
```

---

*This development guide provides comprehensive setup, workflow, and best practices for developing the SuperPod frontend application. Follow these guidelines to maintain code quality, performance, and team consistency.*