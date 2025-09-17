// Comprehensive API types for backend integration

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  error: string;
  code: number;
  details?: Record<string, string>;
}

// Search & Discovery Types
export interface SearchParams {
  query: string;
  tags?: string[];
  categories?: string[];
  sources?: string[];
  limit?: number;
  offset?: number;
  sortBy?: 'relevance' | 'date' | 'duration' | 'popularity';
  sortOrder?: 'asc' | 'desc';
}

export interface SearchFilters {
  dateRange?: {
    start: string;
    end: string;
  };
  durationRange?: {
    min: number; // in seconds
    max: number;
  };
  podcastSources?: string[];
  languages?: string[];
}

// Enhanced PodcastSegment for API
export interface ApiPodcastSegment {
  id: string;
  title: string;
  description: string;
  podcast: {
    id: string;
    name: string;
    publisher: string;
    imageUrl?: string;
  };
  episode: {
    id: string;
    title: string;
    number?: number;
    season?: number;
    publishDate: string;
  };
  segment: {
    startTime: number; // seconds
    endTime: number;   // seconds
    duration: number;  // seconds
  };
  audio: {
    url: string;
    format: 'mp3' | 'wav' | 'm4a';
    quality: 'low' | 'medium' | 'high';
  };
  transcript?: {
    text: string;
    confidence: number;
    timestamps?: Array<{
      start: number;
      end: number;
      text: string;
    }>;
  };
  tags: string[];
  topics: string[];
  entities?: Array<{
    name: string;
    type: 'person' | 'organization' | 'location' | 'concept';
    confidence: number;
  }>;
  sentiment?: {
    score: number; // -1 to 1
    label: 'positive' | 'negative' | 'neutral';
  };
  relevanceScore?: number;
  createdAt: string;
  updatedAt: string;
}

// SuperPod API Types
export interface ApiSuperPod {
  id: string;
  name: string;
  description?: string;
  userId: string;
  segments: string[]; // segment IDs
  metadata: {
    totalDuration: number;
    segmentCount: number;
    topicCoverage: string[];
    sourceDiversity: number;
  };
  aiGenerated?: {
    summary: string;
    transitions: Array<{
      fromSegmentId: string;
      toSegmentId: string;
      transitionText: string;
      audioUrl?: string;
    }>;
    introduction?: {
      text: string;
      audioUrl?: string;
    };
  };
  playbackHistory?: Array<{
    timestamp: string;
    position: number; // seconds into the SuperPod
    completed: boolean;
  }>;
  sharing: {
    isPublic: boolean;
    shareUrl?: string;
    collaborators?: string[]; // user IDs
  };
  createdAt: string;
  updatedAt: string;
}

// User Management
export interface ApiUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    timezone: string;
    notifications: {
      email: boolean;
      push: boolean;
      newContent: boolean;
      collaborations: boolean;
    };
    playback: {
      defaultSpeed: number;
      autoplay: boolean;
      skipSilence: boolean;
    };
    ai: {
      enableNarration: boolean;
      voiceStyle: string;
      summaryLength: 'brief' | 'detailed' | 'comprehensive';
      enableTransitions: boolean;
    };
  };
  subscription?: {
    plan: 'free' | 'pro' | 'enterprise';
    status: 'active' | 'cancelled' | 'expired';
    expiresAt?: string;
  };
  usage: {
    superPodsCreated: number;
    totalListeningTime: number;
    lastActiveAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Analytics Types
export interface ListeningAnalytics {
  totalTime: number;
  sessionsCount: number;
  averageSessionLength: number;
  topTopics: Array<{
    topic: string;
    count: number;
    totalTime: number;
  }>;
  topPodcasts: Array<{
    podcastId: string;
    podcastName: string;
    segmentCount: number;
    totalTime: number;
  }>;
  listeningPatterns: {
    timeOfDay: Record<string, number>; // hour -> minutes
    dayOfWeek: Record<string, number>; // day -> minutes
  };
}

// WebSocket Event Types
export interface WebSocketEvents {
  'superpod:created': { superPod: ApiSuperPod };
  'superpod:updated': { superPodId: string; updates: Partial<ApiSuperPod> };
  'superpod:deleted': { superPodId: string };
  'playback:sync': { 
    superPodId: string; 
    position: number; 
    isPlaying: boolean; 
    userId: string; 
  };
  'collaboration:invite': { 
    superPodId: string; 
    inviterId: string; 
    inviterName: string; 
  };
}
