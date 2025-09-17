# 🎧 SuperPod - AI-Powered Podcast Curation Platform

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.0-blue.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.4.20-blue.svg)](https://vitejs.dev/)

A revolutionary desktop podcasting application that transforms how users consume and organize podcast content. Create personalized learning journeys called "SuperPods" by curating segments from different podcasts with AI-powered insights.

## 🌟 Features

### 🤖 AI-Powered Discovery
- **Intelligent Search**: Natural language queries to find relevant segments
- **Knowledge Graph**: Visual representation of content relationships  
- **Smart Suggestions**: Contextual recommendations based on search intent
- **Tag-Based Filtering**: Organize content by topics, themes, and categories

### 🎵 Interactive Content Curation
- **Segment Preview**: Full transcript viewing with metadata
- **One-Click Addition**: Add segments to current playlist
- **Visual Relationships**: See how topics connect across different podcasts
- **Source Filtering**: Choose from trusted podcast sources

### 📝 Advanced Playlist Management
- **Drag & Drop Reordering**: Intuitive segment arrangement
- **Real-Time Updates**: Changes reflected immediately across the app
- **Playlist Analytics**: Track duration, source diversity, topic coverage
- **Save & Share**: Convert playlists to permanent SuperPods

### 🎙️ AI Narration & Enhancement
- **Voice Synthesis**: AI-generated introductions and transitions
- **Content Summarization**: Brief recaps of previous segments
- **Smooth Transitions**: Contextual bridges between different topics
- **Customizable Voice**: Multiple AI voice styles and speeds

### 🎶 Immersive Audio Experience
- **Seamless Playback**: Continuous audio across different sources
- **Advanced Controls**: Skip, rewind, speed adjustment
- **Playlist Navigation**: Jump between segments effortlessly
- **Progress Tracking**: Resume where you left off

## 🚀 Quick Start

### Prerequisites

- **Node.js**: Version 16+ (v18+ recommended for optimal performance)
- **npm** or **yarn**: Package manager
- **Git**: Version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/superpod-prototype.git
   cd superpod-prototype
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Navigate to `http://localhost:3000`
   - The application will automatically open in your default browser

### 🎯 First Steps

1. **Explore the Interface**: Familiarize yourself with the search, knowledge graph, and sidebar
2. **Try a Search**: Search for topics like "AI ethics" or "startup advice"
3. **Preview Segments**: Click on any segment in the knowledge graph to preview
4. **Create a Playlist**: Add segments to your current playlist using the "Add to Playlist" button
5. **Reorder Content**: Drag and drop segments in the sidebar to arrange your SuperPod
6. **Save Your SuperPod**: Click "Save SuperPod" to create a permanent collection

## 🏗️ Technical Architecture

### Core Technologies

- **React 18**: Modern functional components with hooks
- **TypeScript**: Full type safety and developer experience
- **Tailwind CSS v4**: Utility-first styling with custom design tokens
- **Vite**: Fast build tooling and development server
- **Shadcn/ui**: Accessible, customizable UI component library

### Key Libraries

- **React DND**: Drag and drop functionality for playlist management
- **Framer Motion**: Smooth animations and transitions
- **Recharts**: Data visualization for analytics and graphs
- **Sonner**: Toast notifications for user feedback
- **Lucide React**: Consistent icon system

### Project Structure

```
src/
├── App.tsx                    # Main application component
├── main.tsx                   # Application entry point
├── components/
│   ├── audio-player.tsx       # Audio playback controls
│   ├── draggable-playlist.tsx # Drag & drop playlist management
│   ├── knowledge-graph.tsx    # Visual search results display
│   ├── search-interface.tsx   # Search input and filters
│   ├── segment-preview.tsx    # Segment detail modal
│   ├── superpod-sidebar.tsx   # Playlist and library management
│   ├── ai-settings-modal.tsx  # AI narration configuration
│   └── ui/                    # Shadcn/ui component library
├── styles/
│   └── globals.css           # Tailwind configuration and design tokens
└── docs/                     # Comprehensive documentation
```

## 📱 Responsive Design

The application is fully responsive with:

- **Desktop First** approach (1024px+) - Primary experience
- **Tablet Support** (768px - 1024px) - Collapsible sidebar
- **Mobile Ready** (< 768px) - Optimized interface
- **User Preference Memory** - Remembers panel states
- **Keyboard Shortcuts** - ⌘B for sidebar, ⌘F for search

## 🎨 Design System

### Color Palette
- **Primary**: `#030213` - Deep navy for primary actions
- **Secondary**: `oklch(0.95 0.0058 264.53)` - Light purple for secondary elements
- **Accent**: `#e9ebef` - Soft gray for accents
- **Sidebar**: `oklch(0.985 0 0)` - Clean white for sidebar

### Typography
- **Base Font Size**: 16px
- **Font Weights**: Normal (400), Medium (500)
- **Line Height**: 1.5 for optimal readability

### Components
- **Consistent Spacing**: 4px base unit system
- **Border Radius**: 0.625rem (10px) for modern feel
- **Shadows**: Subtle depth with consistent elevation
- **Animations**: Smooth 300ms transitions

## 🛠️ Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run TypeScript type checking
npm run type-check

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code with Prettier
npm run format
```

## 📊 Current Status

This is a **frontend prototype** with:

- ✅ Complete UI/UX implementation
- ✅ All interactive features working with mock data
- ✅ Responsive design and accessibility
- ✅ Type safety and error handling
- ✅ Drag & drop functionality
- ✅ Audio player interface
- ✅ AI settings configuration
- ✅ Knowledge graph visualization

### Ready for Integration

The prototype is designed to integrate with:

- **Backend APIs** for podcast data and user management
- **AI Services** for transcription and summarization
- **Audio Streaming** services for podcast playback
- **Authentication** providers for user accounts
- **Database** systems for data persistence

## 🎯 Target Users

### Primary: Knowledge Workers & Lifelong Learners
- **Professionals** staying current with industry trends
- **Entrepreneurs** seeking diverse business insights
- **Researchers** gathering information across multiple sources
- **Students** creating study materials from expert content

### Secondary: Content Creators & Educators
- **Podcasters** researching topics and gathering insights
- **Teachers** creating educational content for students
- **Trainers** developing professional development materials

## 🔮 Future Roadmap

### Phase 1: Core Enhancement
- Real podcast API integration
- Backend data persistence
- User authentication system
- Enhanced AI features

### Phase 2: Advanced Features
- Mobile applications
- Offline listening capabilities
- Advanced analytics and insights
- Social sharing and collaboration

### Phase 3: Platform Expansion
- Creator monetization tools
- Community features
- Advanced AI narration
- Multi-language support

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./docs/development-guide.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Standards

- **TypeScript**: Full type coverage required
- **ESLint**: Follow configured linting rules
- **Prettier**: Consistent code formatting
- **Conventional Commits**: Clear commit messages

## 📚 Documentation

- **[Overview](./docs/overview.md)** - Application concept and features
- **[Architecture](./docs/architecture.md)** - Technical design decisions
- **[Components](./docs/components.md)** - Detailed component documentation
- **[Development Guide](./docs/development-guide.md)** - Setup and workflow
- **[UI/UX Guide](./docs/ui-ux-guide.md)** - Design system and patterns

## 🐛 Troubleshooting

### Common Issues

**Development server won't start**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**TypeScript errors**
```bash
# Run type checking
npm run type-check
```

**Styling issues**
```bash
# Rebuild Tailwind
npm run build
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **MediaFutures** - Project sponsor and vision
- **Figma Make** - Initial prototype platform
- **Shadcn/ui** - Excellent component library
- **Radix UI** - Accessible primitives
- **Tailwind CSS** - Utility-first styling

---

**Built with ❤️ by the MediaFutures SuperPod Team**

*Transform your podcast listening experience with AI-powered curation.*
