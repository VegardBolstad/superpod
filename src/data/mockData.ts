// 🎯 CONSOLIDATED MOCK DATA
// All hardcoded data extracted from components for easy backend replacement

import { PodcastSegment, SuperPod } from '../App';

// ===== PODCAST SEGMENTS DATA =====
export const mockPodcastSegments: PodcastSegment[] = [
  {
    id: "1",
    title: "The Future of AI in Creative Industries",
    podcast: "Tech Talk Daily",
    duration: "8:45",
    tags: ["AI", "creativity", "technology", "future"],
    description: "Exploring how artificial intelligence is revolutionizing creative fields like design, music, and writing.",
    publishDate: "Dec 15, 2024",
    episode: "342",
    transcript: "Welcome to Tech Talk Daily. Today we're diving deep into how AI is transforming creative industries. From generative art to AI-assisted music composition, we're seeing unprecedented changes in how we create and consume creative content. The tools are becoming more sophisticated, and the barrier to entry is lowering dramatically...",
    relatedTopics: ["Generative AI", "Creative Tools", "Digital Art", "Music Technology"]
  },
  {
    id: "2",
    title: "Machine Learning Ethics and Society",
    podcast: "AI Ethics Podcast",
    duration: "12:30",
    tags: ["ML", "ethics", "society", "technology"],
    description: "A deep dive into the ethical implications of machine learning systems in modern society.",
    publishDate: "Dec 12, 2024",
    episode: "89",
    transcript: "Ethics in AI isn't just about preventing bias - it's about building systems that genuinely serve humanity. Today we explore the complex challenges facing AI developers and the responsibility we all share in creating ethical technology solutions...",
    relatedTopics: ["AI Bias", "Algorithmic Fairness", "Tech Ethics", "Responsible AI"]
  },
  {
    id: "3",
    title: "Building Sustainable Tech Companies",
    podcast: "Startup Stories",
    duration: "15:20",
    tags: ["startup", "sustainability", "business", "technology"],
    description: "How modern tech companies are integrating sustainability into their core business models.",
    publishDate: "Dec 10, 2024",
    episode: "156",
    transcript: "Sustainability isn't just a buzzword anymore - it's a business imperative. We're seeing companies that put environmental and social responsibility at the center of their business model outperform their competitors...",
    relatedTopics: ["Green Tech", "ESG", "Circular Economy", "Impact Investing"]
  },
  {
    id: "4",
    title: "The Psychology of Innovation",
    podcast: "Mind Matters",
    duration: "9:15",
    tags: ["psychology", "innovation", "creativity", "mindset"],
    description: "Understanding the psychological factors that drive breakthrough innovations.",
    publishDate: "Dec 8, 2024",
    episode: "234",
    transcript: "What separates innovative thinkers from the rest? It's not just intelligence or creativity - there are specific psychological patterns and mindsets that foster breakthrough thinking...",
    relatedTopics: ["Creative Thinking", "Cognitive Bias", "Problem Solving", "Mental Models"]
  },
  {
    id: "5",
    title: "Remote Work Culture Evolution",
    podcast: "Workplace Revolution",
    duration: "11:40",
    tags: ["remote work", "culture", "productivity", "future"],
    description: "How remote work is changing company culture and team dynamics.",
    publishDate: "Dec 5, 2024",
    episode: "67",
    transcript: "The shift to remote work has fundamentally changed how we think about company culture, collaboration, and productivity. We're learning that culture isn't just about office spaces and water cooler conversations...",
    relatedTopics: ["Distributed Teams", "Digital Collaboration", "Work-Life Balance", "Async Communication"]
  },
  {
    id: "6",
    title: "Blockchain Beyond Cryptocurrency",
    podcast: "Tech Horizons",
    duration: "14:22",
    tags: ["blockchain", "technology", "innovation", "decentralization"],
    description: "Exploring practical applications of blockchain technology beyond digital currencies.",
    publishDate: "Dec 3, 2024",
    episode: "128",
    transcript: "While cryptocurrency gets most of the attention, blockchain technology has far-reaching applications in supply chain management, digital identity, and decentralized governance...",
    relatedTopics: ["Smart Contracts", "DeFi", "Web3", "Decentralization"]
  }
];

// ===== GRAPH CONNECTIONS DATA =====
export const mockGraphConnections: Record<string, string[]> = {
  "1": ["2", "4"], // AI in Creative Industries connects to ML Ethics and Psychology of Innovation
  "2": ["1", "3"], // ML Ethics connects to AI in Creative and Sustainable Tech
  "3": ["2", "5"], // Sustainable Tech connects to ML Ethics and Remote Work
  "4": ["1", "5"], // Psychology connects to AI in Creative and Remote Work
  "5": ["3", "4"], // Remote Work connects to Sustainable Tech and Psychology
  "6": ["1", "2"], // Blockchain connects to AI and Ethics
};

// ===== SEARCH SUGGESTIONS =====
export const mockSuggestions = {
  top: ["artificial intelligence", "innovation", "future trends"],
  bottom: ["startup ecosystem", "digital transformation", "remote collaboration"],
  left: ["creative technology", "ethical AI", "sustainable business"],
  right: ["workplace culture", "productivity tools", "technology adoption"]
};

// ===== PODCAST SOURCES =====
export const mockPodcastSources = [
  { id: "public", name: "Public", count: 1250 },
  { id: "spotify", name: "Spotify", count: 850 },
  { id: "podme", name: "Podme", count: 420 },
  { id: "apple", name: "Apple", count: 680 }
];

// ===== CATEGORIES & TAGS =====
export const mockCategories = [
  { id: "interview", name: "Interview", count: 45 },
  { id: "discussion", name: "Discussion", count: 32 },
  { id: "educational", name: "Educational", count: 28 },
  { id: "news", name: "News", count: 19 }
];

export const mockTags = [
  { id: "technology", name: "technology", count: 156 },
  { id: "ai", name: "AI", count: 89 },
  { id: "startup", name: "startup", count: 67 },
  { id: "innovation", name: "innovation", count: 54 },
  { id: "ethics", name: "ethics", count: 43 },
  { id: "future", name: "future", count: 38 },
  { id: "business", name: "business", count: 72 },
  { id: "psychology", name: "psychology", count: 31 }
];

// ===== SAMPLE SUPERPODS =====
export const mockSuperPods: SuperPod[] = [
  {
    id: "sp1",
    name: "AI Ethics Deep Dive",
    segments: [mockPodcastSegments[0], mockPodcastSegments[1]], // AI Creative + ML Ethics
    totalDuration: "21:15",
    createdAt: "2024-12-10T10:30:00Z",
    summary: "A comprehensive exploration of AI's impact on creative industries and the ethical considerations that come with machine learning adoption."
  },
  {
    id: "sp2", 
    name: "Future of Work",
    segments: [mockPodcastSegments[4], mockPodcastSegments[3]], // Remote Work + Psychology
    totalDuration: "20:55",
    createdAt: "2024-12-08T14:20:00Z",
    summary: "Understanding how remote work is reshaping company culture and the psychological factors that drive innovation in distributed teams."
  }
];

// ===== AI SETTINGS DEFAULTS =====
export const mockAISettings = {
  enableNarration: true,
  enableSummaries: true,
  enableTransitions: true,
  voiceStyle: "neutral",
  speakingSpeed: 1.0,
  summaryLength: "brief",
  transitionStyle: "smooth"
};

// ===== MOCK AUDIO METADATA =====
export const mockAudioData: Record<string, { url: string; duration: number; waveform?: number[] }> = {
  "1": { 
    url: "/audio/ai-creative-industries.mp3", 
    duration: 525, // 8:45 in seconds
    waveform: [0.2, 0.4, 0.6, 0.8, 0.5, 0.3, 0.7, 0.9, 0.4, 0.2] // Mock waveform data
  },
  "2": { 
    url: "/audio/ml-ethics.mp3", 
    duration: 750, // 12:30 in seconds
    waveform: [0.3, 0.5, 0.7, 0.4, 0.6, 0.8, 0.5, 0.3, 0.6, 0.4]
  },
  "3": { 
    url: "/audio/sustainable-tech.mp3", 
    duration: 920, // 15:20 in seconds
    waveform: [0.4, 0.6, 0.5, 0.7, 0.3, 0.8, 0.6, 0.4, 0.5, 0.7]
  },
  "4": { 
    url: "/audio/psychology-innovation.mp3", 
    duration: 555, // 9:15 in seconds
    waveform: [0.5, 0.3, 0.8, 0.6, 0.4, 0.7, 0.5, 0.6, 0.3, 0.8]
  },
  "5": { 
    url: "/audio/remote-work.mp3", 
    duration: 700, // 11:40 in seconds
    waveform: [0.6, 0.4, 0.7, 0.5, 0.8, 0.3, 0.6, 0.7, 0.4, 0.5]
  },
  "6": { 
    url: "/audio/blockchain-beyond.mp3", 
    duration: 862, // 14:22 in seconds
    waveform: [0.7, 0.5, 0.6, 0.8, 0.4, 0.6, 0.7, 0.3, 0.8, 0.5]
  }
};

// ===== UTILITY FUNCTIONS =====
export const getMockSegmentById = (id: string): PodcastSegment | undefined => {
  return mockPodcastSegments.find(segment => segment.id === id);
};

export const getMockSegmentsByIds = (ids: string[]): PodcastSegment[] => {
  return ids.map(id => getMockSegmentById(id)).filter(Boolean) as PodcastSegment[];
};

export const searchMockSegments = (query: string, tags?: string[], sources?: string[]): PodcastSegment[] => {
  return mockPodcastSegments.filter(segment => {
    const matchesQuery = !query || 
      segment.title.toLowerCase().includes(query.toLowerCase()) ||
      segment.podcast.toLowerCase().includes(query.toLowerCase()) ||
      segment.description?.toLowerCase().includes(query.toLowerCase()) ||
      segment.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()));

    const matchesTags = !tags?.length || 
      tags.some(tag => segment.tags.some(segTag => segTag.toLowerCase().includes(tag.toLowerCase())));

    const matchesSources = !sources?.length || sources.includes("public"); // Mock: all segments are "public"

    return matchesQuery && matchesTags && matchesSources;
  });
};

// ===== MOCK API RESPONSES =====
export const mockApiResponses = {
  searchSuccess: (segments: PodcastSegment[]) => ({
    success: true,
    data: {
      segments,
      totalResults: segments.length,
      suggestions: mockSuggestions.top,
      relatedTopics: segments.flatMap(s => s.relatedTopics || []).slice(0, 5)
    }
  }),
  
  createSuperPodSuccess: (name: string, segmentIds: string[]) => ({
    success: true,
    data: {
      id: `sp_${Date.now()}`,
      name,
      segments: getMockSegmentsByIds(segmentIds),
      totalDuration: `${segmentIds.length * 8}m`, // Mock calculation
      createdAt: new Date().toISOString(),
      summary: `A curated collection of ${segmentIds.length} podcast segments about ${name.toLowerCase()}.`
    }
  }),

  error: (message: string, code: number = 400) => ({
    success: false,
    error: {
      message,
      code,
      timestamp: new Date().toISOString()
    }
  })
};
