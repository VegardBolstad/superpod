import { useState, useEffect } from "react";
import { SearchInterface } from "./components/search-interface";
import { KnowledgeGraph } from "./components/knowledge-graph";
import { SuperPodSidebar } from "./components/superpod-sidebar";
import { AudioPlayer } from "./components/audio-player";
import { SegmentPreview } from "./components/segment-preview";
import { AISettingsModal } from "./components/ai-settings-modal";
import { SuperPodDetailsModal } from "./components/superpod-details-modal";
import { OnboardingTutorial } from "./components/onboarding-tutorial";
import { FullscreenGraphModal } from "./components/fullscreen-graph-modal";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Mic, Sparkles, Menu, X, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Sun, Moon } from "lucide-react";
import { toast } from "sonner";

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

interface GraphNode extends PodcastSegment {
  relevance: number;
  x: number;
  y: number;
  connections: string[];
}

export interface SuperPod {
  id: string;
  name: string;
  segments: PodcastSegment[];
  totalDuration: string;
  createdAt: string;
  summary?: string;
}

interface AISettings {
  enableNarration: boolean;
  enableSummaries: boolean;
  enableTransitions: boolean;
  voiceStyle: string;
  speakingSpeed: number;
  summaryLength: string;
  transitionStyle: string;
}

export default function App() {
  const [searchResults, setSearchResults] = useState<GraphNode[]>([]);
  const [currentPlaylist, setCurrentPlaylist] = useState<PodcastSegment[]>([]);
  const [superPods, setSuperPods] = useState<SuperPod[]>([]);
  const [currentSegment, setCurrentSegment] = useState<PodcastSegment | null>(null);
  const [currentPlayingPlaylist, setCurrentPlayingPlaylist] = useState<PodcastSegment[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [previewSegment, setPreviewSegment] = useState<PodcastSegment | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [currentQuery, setCurrentQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSearchCollapsed, setIsSearchCollapsed] = useState(false);
  const [hasUserToggledSidebar, setHasUserToggledSidebar] = useState(false);
  const [hasUserToggledSearch, setHasUserToggledSearch] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Modal states
  const [isAISettingsOpen, setIsAISettingsOpen] = useState(false);
  const [isSuperPodDetailsOpen, setIsSuperPodDetailsOpen] = useState(false);
  const [selectedSuperPod, setSelectedSuperPod] = useState<SuperPod | null>(null);
  const [isGraphFullscreen, setIsGraphFullscreen] = useState(false);
  
  // Tutorial states
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  
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

  // Mock data
  const mockSegments: GraphNode[] = [
    {
      id: "1",
      title: "The Future of AI in Creative Industries",
      podcast: "Tech Talk Daily",
      duration: "8:45",
      tags: ["AI", "creativity", "technology", "future"],
      relevance: 0.95,
      x: 0,
      y: 0,
      connections: ["2", "4"],
      description: "Exploring how artificial intelligence is revolutionizing creative fields like design, music, and writing.",
      publishDate: "Dec 15, 2024",
      episode: "342",
      transcript: "Welcome to Tech Talk Daily. Today we're diving deep into how AI is transforming creative industries. From generative art to AI-assisted music composition, we're seeing unprecedented changes...",
      relatedTopics: ["Generative AI", "Creative Tools", "Digital Art", "Music Technology"]
    },
    {
      id: "2", 
      title: "Machine Learning Ethics and Society",
      podcast: "AI Ethics Podcast",
      duration: "12:30",
      tags: ["ML", "ethics", "society", "technology"],
      relevance: 0.87,
      x: 0,
      y: 0,
      connections: ["1", "3"],
      description: "A deep dive into the ethical implications of machine learning systems in modern society.",
      publishDate: "Dec 12, 2024",
      episode: "89",
      transcript: "Ethics in AI isn't just about preventing bias - it's about building systems that genuinely serve humanity. Today we explore the complex challenges facing AI developers...",
      relatedTopics: ["AI Bias", "Algorithmic Fairness", "Tech Ethics", "Responsible AI"]
    },
    {
      id: "3",
      title: "Building Sustainable Tech Companies",
      podcast: "Startup Stories",
      duration: "15:20",
      tags: ["startup", "sustainability", "business", "technology"],
      relevance: 0.76,
      x: 0,
      y: 0,
      connections: ["2", "5"],
      description: "How modern tech companies are integrating sustainability into their core business models.",
      publishDate: "Dec 10, 2024",
      episode: "156"
    },
    {
      id: "4",
      title: "The Psychology of Innovation",
      podcast: "Mind Matters",
      duration: "9:15",
      tags: ["psychology", "innovation", "creativity", "mindset"],
      relevance: 0.82,
      x: 0,
      y: 0,
      connections: ["1", "5"],
      description: "Understanding the psychological factors that drive breakthrough innovations.",
      publishDate: "Dec 8, 2024",
      episode: "234"
    },
    {
      id: "5",
      title: "Remote Work Culture Evolution",
      podcast: "Workplace Revolution",
      duration: "11:40",
      tags: ["remote work", "culture", "productivity", "future"],
      relevance: 0.69,
      x: 0,
      y: 0,
      connections: ["3", "4"],
      description: "How remote work is changing company culture and team dynamics.",
      publishDate: "Dec 5, 2024",
      episode: "67"
    }
  ];

  const suggestions = {
    top: ["artificial intelligence", "innovation", "future trends"],
    bottom: ["startup ecosystem", "digital transformation", "remote collaboration"],
    left: ["creative technology", "ethical AI", "sustainable business"],
    right: ["workplace culture", "productivity tools", "technology adoption"]
  };

  const handleSearch = (query: string, tags: string[], categories: string[], sources: string[]) => {
    setCurrentQuery(query);
    setSelectedSources(sources);
    // Mock search - in real app would call backend API
    const filtered = mockSegments.filter(segment => {
      const matchesQuery = query === "" || 
        segment.title.toLowerCase().includes(query.toLowerCase()) ||
        segment.podcast.toLowerCase().includes(query.toLowerCase()) ||
        segment.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()));
      
      const matchesTags = tags.length === 0 || 
        tags.some(tag => segment.tags.some(segTag => segTag.toLowerCase().includes(tag.toLowerCase())));
      
      const matchesSources = sources.length === 0 || sources.includes("Public"); // Mock source filtering
      
      return matchesQuery && matchesTags && matchesSources;
    });
    
    setSearchResults(filtered);
    toast.success(`Found ${filtered.length} relevant segments`);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSearch(suggestion, [], [], selectedSources);
  };

  const handlePreview = (segment: GraphNode) => {
    setPreviewSegment(segment);
    setIsPreviewOpen(true);
  };

  const handleAddToPlaylist = (segment: PodcastSegment) => {
    if (!currentPlaylist.find(s => s.id === segment.id)) {
      setCurrentPlaylist(prev => [...prev, segment]);
      toast.success(`Added "${segment.title}" to playlist`);
    } else {
      toast.info("Segment already in playlist");
    }
  };

  const handlePlaySegment = (segment: PodcastSegment) => {
    setCurrentSegment(segment);
    setCurrentPlayingPlaylist([segment]);
    setCurrentIndex(0);
    setIsPlaying(true);
    toast.success(`Now playing: ${segment.title}`);
  };

  const handlePlaySuperPod = (superPod: SuperPod) => {
    setCurrentPlayingPlaylist(superPod.segments);
    setCurrentSegment(superPod.segments[0]);
    setCurrentIndex(0);
    setIsPlaying(true);
    toast.success(`Playing SuperPod: ${superPod.name}`);
  };

  const handleSaveCurrentPlaylist = (name: string) => {
    const newSuperPod: SuperPod = {
      id: Date.now().toString(),
      name,
      segments: [...currentPlaylist],
      totalDuration: `${currentPlaylist.length * 8}m`, // Mock calculation
      createdAt: new Date().toISOString()
    };
    
    setSuperPods(prev => [...prev, newSuperPod]);
    setCurrentPlaylist([]);
    toast.success(`Created SuperPod: ${name}`);
  };

  const handleDeleteSuperPod = (id: string) => {
    setSuperPods(prev => prev.filter(sp => sp.id !== id));
    toast.success("SuperPod deleted");
  };

  const handleViewSuperPod = (superPod: SuperPod) => {
    setSelectedSuperPod(superPod);
    setIsSuperPodDetailsOpen(true);
  };

  const handleUpdateSuperPodSummary = (superPodId: string, summary: string) => {
    setSuperPods(prev => prev.map(sp => 
      sp.id === superPodId ? { ...sp, summary } : sp
    ));
    toast.success("Summary updated");
  };

  const handleStartTutorial = () => {
    setTutorialStep(0);
    setIsTutorialOpen(true);
  };

  const handleTutorialNext = () => {
    if (tutorialStep < 5) { // 6 steps total (0-5)
      setTutorialStep(prev => prev + 1);
    }
  };

  const handleTutorialPrevious = () => {
    if (tutorialStep > 0) {
      setTutorialStep(prev => prev - 1);
    }
  };

  const handleTutorialClose = () => {
    setIsTutorialOpen(false);
    setTutorialStep(0);
    toast.success("Welcome to SuperPod! Start searching to create your first SuperPod.");
  };

  const handleTutorialSkip = () => {
    setIsTutorialOpen(false);
    setTutorialStep(0);
  };

  const handleClearAllTags = () => {
    // Trigger search with cleared tags
    handleSearch(currentQuery, [], [], selectedSources);
    toast.info("All tags cleared");
  };

  const handleClearAllCategories = () => {
    // Trigger search with cleared categories
    handleSearch(currentQuery, [], [], selectedSources);
    toast.info("All categories cleared");
  };

  const handleSelectAllSources = () => {
    const allSources = ["Public", "Spotify", "Podme", "Apple"];
    handleSearch(currentQuery, [], [], allSources);
    toast.info("All sources selected");
  };

  const handleSelectNoneSources = () => {
    handleSearch(currentQuery, [], [], []);
    toast.info("All sources deselected");
  };

  const handleSaveSearch = () => {
    if (currentQuery || selectedSources.length > 0) {
      toast.success(`Search "${currentQuery || 'filters'}" saved to bookmarks`);
    } else {
      toast.info("Nothing to save - search for something first");
    }
  };

  const handleResetSearch = () => {
    setCurrentQuery("");
    setSelectedSources([]);
    setSearchResults([]);
    toast.info("Search reset");
  };

  const handleLoadSavedSearch = (search: any) => {
    // Load the saved search parameters and trigger search
    handleSearch(search.query, search.tags, search.categories, search.sources);
    toast.success(`Loaded search: "${search.name}"`);
  };

  const handleReorderPlaylist = (reorderedSegments: PodcastSegment[]) => {
    setCurrentPlaylist(reorderedSegments);
  };

  const handleAISettingsChange = (newSettings: AISettings) => {
    setAiSettings(newSettings);
    toast.success("AI settings saved");
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Apply dark mode to document
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

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

  // Initialize with some mock data and handle responsive behavior
  useEffect(() => {
    handleSearch("", [], [], []);
    
    // Initialize dark mode based on system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
    if (prefersDark) {
      document.documentElement.classList.add('dark');
    }
    
    // Auto-collapse on mobile (only if user hasn't manually overridden)
    const handleResize = () => {
      if (window.innerWidth < 768) {
        if (!hasUserToggledSidebar) setIsSidebarCollapsed(true);
        if (!hasUserToggledSearch) setIsSearchCollapsed(true);
      } else if (window.innerWidth < 1024) {
        if (!hasUserToggledSidebar) setIsSidebarCollapsed(true);
        if (!hasUserToggledSearch) setIsSearchCollapsed(false);
      } else {
        if (!hasUserToggledSidebar) setIsSidebarCollapsed(false);
        if (!hasUserToggledSearch) setIsSearchCollapsed(false);
      }
    };

    // Keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'b':
            e.preventDefault();
            setIsSidebarCollapsed(prev => !prev);
            setHasUserToggledSidebar(true);
            break;
          case 'f':
            e.preventDefault();
            setIsSearchCollapsed(prev => !prev);
            setHasUserToggledSearch(true);
            break;
        }
      }
    };

    handleResize();
    // Click outside to close menu
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      if (isMenuOpen && !target.closest('[data-menu]')) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('click', handleClickOutside);
    };
  }, [isMenuOpen, hasUserToggledSidebar, hasUserToggledSearch]);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="h-16 border-b bg-card flex items-center px-6 relative">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Mic className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl">SuperPod</h1>
          <Badge variant="secondary" className="text-xs">
            <Sparkles className="w-3 h-3 mr-1" />
            Beta
          </Badge>
        </div>
        
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleDarkMode}
            className="h-8 w-8 p-0"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>
          <div data-menu>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              className="h-8 w-8 p-0"
            >
              {isMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Dropdown Menu */}
        {isMenuOpen && (
          <div className="absolute top-1 right-1 w-64 bg-popover border border-border rounded-lg shadow-lg z-50" data-menu>
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <h3 className="text-sm">Menu</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMenuOpen(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              {currentQuery && (
                <div className="text-xs text-muted-foreground">
                  <div>Current search: "{currentQuery}"</div>
                  <div>{searchResults.length} results found</div>
                  {selectedSources.length > 0 && (
                    <div>Sources: {selectedSources.join(", ")}</div>
                  )}
                </div>
              )}
              
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground space-y-1">
                  <div className="flex items-center justify-between">
                    <span>Sidebar</span>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${isSidebarCollapsed ? 'bg-red-500' : 'bg-green-500'}`}></span>
                      <span>{isSidebarCollapsed ? 'Hidden' : 'Visible'}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Filters</span>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${isSearchCollapsed ? 'bg-red-500' : 'bg-green-500'}`}></span>
                      <span>{isSearchCollapsed ? 'Hidden' : 'Visible'}</span>
                    </div>
                  </div>
                  <div className="text-xs opacity-50">
                    Screen: {typeof window !== 'undefined' ? `${window.innerWidth}px` : 'Unknown'}
                  </div>
                </div>
                
                <div className="border-t border-border pt-2 space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => {
                    setIsSidebarCollapsed(!isSidebarCollapsed);
                    setHasUserToggledSidebar(true);
                  }}>
                    {isSidebarCollapsed ? 'Show' : 'Hide'} Sidebar <span className="ml-auto text-xs opacity-60">⌘B</span>
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => {
                    setIsSearchCollapsed(!isSearchCollapsed);
                    setHasUserToggledSearch(true);
                  }}>
                    {isSearchCollapsed ? 'Show' : 'Hide'} Filters <span className="ml-auto text-xs opacity-60">⌘F</span>
                  </Button>
                </div>
                
                <div className="border-t border-border pt-2 space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start" onClick={handleStartTutorial}>
                    View Tutorial
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => toast.info("Settings coming soon")}>
                    Settings
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => toast.info("Help coming soon")}>
                    Help & Support
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar */}
        <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'w-12' : 'w-80'} overflow-hidden relative superpod-sidebar`}>
          <SuperPodSidebar
            superPods={superPods}
            currentPlaylist={currentPlaylist}
            onPlaySuperPod={handlePlaySuperPod}
            onCreateSuperPod={handleStartTutorial}
            onDeleteSuperPod={handleDeleteSuperPod}
            onViewSuperPod={handleViewSuperPod}
            onClearPlaylist={() => setCurrentPlaylist([])}
            onSaveCurrentPlaylist={handleSaveCurrentPlaylist}
            onReorderPlaylist={handleReorderPlaylist}
            onOpenAISettings={() => setIsAISettingsOpen(true)}
            onLoadSavedSearch={handleLoadSavedSearch}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => {
              setIsSidebarCollapsed(!isSidebarCollapsed);
              setHasUserToggledSidebar(true);
            }}
          />
        </div>
        


        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Search Interface */}
          <div className="search-interface">
            <div className="p-4">
              <SearchInterface 
                onSearch={handleSearch} 
                currentQuery={currentQuery}
                resultCount={searchResults.length}
                isCollapsed={isSearchCollapsed}
                onClearAllTags={handleClearAllTags}
                onClearAllCategories={handleClearAllCategories}
                onSelectAllSources={handleSelectAllSources}
                onSelectNoneSources={handleSelectNoneSources}
                onSaveSearch={handleSaveSearch}
                onResetSearch={handleResetSearch}
                onToggleCollapse={() => {
                  setIsSearchCollapsed(!isSearchCollapsed);
                  setHasUserToggledSearch(true);
                }}
              />
            </div>
          </div>

          {/* Knowledge Graph */}
          <div className="flex-1 p-4 pt-0 min-h-0 knowledge-graph">
            <Card className="h-full relative">
              <KnowledgeGraph
                searchResults={searchResults}
                onPreview={handlePreview}
                onAddToPlaylist={handleAddToPlaylist}
                suggestions={suggestions}
                onSuggestionClick={handleSuggestionClick}
                onOpenFullscreen={() => setIsGraphFullscreen(true)}
              />
            </Card>
          </div>
        </div>
      </div>

      {/* Audio Player */}
      <AudioPlayer
        currentSegment={currentSegment}
        playlist={currentPlayingPlaylist}
        currentIndex={currentIndex}
        isPlaying={isPlaying}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onSeek={() => {}}
        onVolumeChange={() => {}}
        onTogglePlaylist={() => toast.info("Playlist view coming soon")}
      />

      {/* Segment Preview Modal */}
      <SegmentPreview
        segment={previewSegment}
        isOpen={isPreviewOpen}
        onClose={() => {
          setIsPreviewOpen(false);
          setPreviewSegment(null);
        }}
        onPlay={handlePlaySegment}
        onAddToPlaylist={handleAddToPlaylist}
      />

      {/* AI Settings Modal */}
      <AISettingsModal
        isOpen={isAISettingsOpen}
        onClose={() => setIsAISettingsOpen(false)}
        settings={aiSettings}
        onSave={handleAISettingsChange}
      />

      {/* SuperPod Details Modal */}
      <SuperPodDetailsModal
        isOpen={isSuperPodDetailsOpen}
        onClose={() => {
          setIsSuperPodDetailsOpen(false);
          setSelectedSuperPod(null);
        }}
        superPod={selectedSuperPod}
        onPlay={handlePlaySuperPod}
        onUpdateSummary={handleUpdateSuperPodSummary}
      />

      {/* Onboarding Tutorial */}
      <OnboardingTutorial
        isOpen={isTutorialOpen}
        onClose={handleTutorialClose}
        currentStep={tutorialStep}
        onNext={handleTutorialNext}
        onPrevious={handleTutorialPrevious}
        onSkip={handleTutorialSkip}
      />

      {/* Fullscreen Graph Modal */}
      <FullscreenGraphModal
        isOpen={isGraphFullscreen}
        onClose={() => setIsGraphFullscreen(false)}
        searchResults={searchResults}
        onPreview={handlePreview}
        onAddToPlaylist={handleAddToPlaylist}
        suggestions={suggestions}
        onSuggestionClick={handleSuggestionClick}
      />
    </div>
  );
}