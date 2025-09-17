// 🔄 MOCK API SERVICE
// This simulates a real backend API with realistic delays and responses
// Your developer can replace these functions with real API calls

import { 
  mockPodcastSegments, 
  mockSuperPods,
  mockAISettings,
  mockAudioData,
  searchMockSegments,
  getMockSegmentsByIds,
  mockApiResponses
} from '../data/mockData';
import { SuperPod } from '../App';
import { SavedSearch } from '../types/api';

// Simulate network delay
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API class that simulates real backend
export class MockApiService {
  
  // ===== TAG SEARCH =====
  async searchTags(query: string, limit: number = 10) {
    await delay(200);

    try {
      const allTags = [
        "technology", "AI", "startup", "innovation", "ethics", "future", "business", "psychology",
        "machine learning", "artificial intelligence", "deep learning", "neural networks",
        "blockchain", "cryptocurrency", "web3", "decentralization", "smart contracts",
        "remote work", "workplace culture", "productivity", "collaboration", "team dynamics",
        "sustainable business", "green tech", "climate change", "renewable energy", "ESG",
        "creative technology", "digital art", "generative AI", "design thinking", "UX/UI",
        "entrepreneurship", "venture capital", "funding", "scaling", "growth hacking",
        "data science", "analytics", "big data", "cloud computing", "cybersecurity",
        "mobile development", "web development", "software engineering", "DevOps", "agile",
        "leadership", "management", "strategy", "decision making", "problem solving",
        "marketing", "branding", "social media", "content creation", "storytelling",
        "finance", "investing", "cryptocurrency", "fintech", "economics", "market trends",
        "philosophy", "comedy", "entertainment", "education", "science", "health", "fitness",
        "creativity", "music", "art", "design", "photography", "writing", "journalism",
        "politics", "history", "culture", "society", "relationships", "personal development",
        "mindfulness", "meditation", "spirituality", "travel", "food", "cooking", "lifestyle"
      ];

      const filtered = allTags.filter(tag => 
        tag.toLowerCase().includes(query.toLowerCase())
      ).slice(0, limit);

      return {
        success: true,
        data: filtered.map(tag => ({
          name: tag,
          count: Math.floor(Math.random() * 100) + 10, // Mock usage count
          category: this.getTagCategory(tag)
        }))
      };
    } catch (error) {
      return mockApiResponses.error('Tag search failed', 500);
    }
  }

  private getTagCategory(tag: string): string {
    if (['AI', 'machine learning', 'artificial intelligence', 'deep learning', 'neural networks'].includes(tag)) {
      return 'AI & ML';
    }
    if (['blockchain', 'cryptocurrency', 'web3', 'decentralization', 'smart contracts'].includes(tag)) {
      return 'Blockchain & Web3';
    }
    if (['remote work', 'workplace culture', 'productivity', 'collaboration', 'team dynamics'].includes(tag)) {
      return 'Work & Culture';
    }
    if (['sustainable business', 'green tech', 'climate change', 'renewable energy', 'ESG'].includes(tag)) {
      return 'Sustainability';
    }
    if (['entrepreneurship', 'venture capital', 'startup', 'scaling', 'funding', 'business'].includes(tag)) {
      return 'Business & Startup';
    }
    if (['philosophy', 'psychology', 'mindfulness', 'meditation', 'spirituality', 'personal development'].includes(tag)) {
      return 'Philosophy & Mind';
    }
    if (['comedy', 'entertainment', 'music', 'art', 'creativity', 'design', 'photography'].includes(tag)) {
      return 'Arts & Entertainment';
    }
    if (['education', 'science', 'history', 'journalism', 'writing'].includes(tag)) {
      return 'Education & Science';
    }
    if (['health', 'fitness', 'lifestyle', 'food', 'cooking', 'travel'].includes(tag)) {
      return 'Health & Lifestyle';
    }
    return 'General';
  }

  // ===== SEARCH & DISCOVERY =====
  async searchPodcasts(params: {
    query: string;
    tags?: string[];
    categories?: string[];
    sources?: string[];
    limit?: number;
    offset?: number;
  }) {
    await delay(300); // Simulate network delay

    try {
      const { query, tags, sources, limit = 50, offset = 0 } = params;
      
      // Simulate search logic
      const allResults = searchMockSegments(query, tags, sources);
      const paginatedResults = allResults.slice(offset, offset + limit);
      
      // Add mock relevance scores and graph positions
      const segmentsWithGraph = paginatedResults.map((segment, index) => ({
        ...segment,
        relevance: Math.max(0.5, 1 - (index * 0.1)), // Decreasing relevance
        x: Math.random() * 800 - 400, // Random graph positions
        y: Math.random() * 600 - 300,
        connections: mockPodcastSegments
          .filter(s => s.id !== segment.id && 
                  s.tags.some(tag => segment.tags.includes(tag)))
          .slice(0, 2)
          .map(s => s.id)
      }));

      return mockApiResponses.searchSuccess(segmentsWithGraph);
    } catch (error) {
      return mockApiResponses.error('Search failed', 500);
    }
  }

  async getSegmentDetails(segmentId: string) {
    await delay(200);
    
    const segment = mockPodcastSegments.find(s => s.id === segmentId);
    if (!segment) {
      return mockApiResponses.error('Segment not found', 404);
    }

    return {
      success: true,
      data: {
        ...segment,
        audioData: mockAudioData[segmentId] || null,
        relatedSegments: mockPodcastSegments
          .filter(s => s.id !== segmentId && 
                  s.tags.some(tag => segment.tags.includes(tag)))
          .slice(0, 3)
      }
    };
  }

  async getRelatedSegments(segmentId: string) {
    await delay(250);
    
    const segment = mockPodcastSegments.find(s => s.id === segmentId);
    if (!segment) {
      return mockApiResponses.error('Segment not found', 404);
    }

    const related = mockPodcastSegments.filter(s => 
      s.id !== segmentId && 
      s.tags.some(tag => segment.tags.includes(tag))
    ).slice(0, 5);

    return {
      success: true,
      data: related
    };
  }

  // ===== SUPERPOD MANAGEMENT =====
  async createSuperPod(data: {
    name: string;
    segments: string[]; // segment IDs
    summary?: string;
  }) {
    await delay(400);

    try {
      const segments = getMockSegmentsByIds(data.segments);
      
      if (segments.length === 0) {
        return mockApiResponses.error('No valid segments provided', 400);
      }

      const newSuperPod: SuperPod = {
        id: `sp_${Date.now()}`,
        name: data.name,
        segments,
        totalDuration: `${segments.reduce((total, seg) => {
          const [mins, secs] = seg.duration.split(':').map(Number);
          return total + mins + (secs / 60);
        }, 0).toFixed(0)}m`,
        createdAt: new Date().toISOString(),
        summary: data.summary || `A curated collection exploring ${data.name.toLowerCase()}.`
      };

      // Simulate saving to database
      mockSuperPods.push(newSuperPod);

      return {
        success: true,
        data: newSuperPod
      };
    } catch (error) {
      return mockApiResponses.error('Failed to create SuperPod', 500);
    }
  }

  async getUserSuperPods() {
    await delay(300);
    
    return {
      success: true,
      data: [...mockSuperPods] // Return copy to prevent mutations
    };
  }

  async updateSuperPod(id: string, updates: Partial<SuperPod>) {
    await delay(350);
    
    const index = mockSuperPods.findIndex(sp => sp.id === id);
    if (index === -1) {
      return mockApiResponses.error('SuperPod not found', 404);
    }

    const updated = { ...mockSuperPods[index], ...updates };
    mockSuperPods[index] = updated;

    return {
      success: true,
      data: updated
    };
  }

  async deleteSuperPod(id: string) {
    await delay(250);
    
    const index = mockSuperPods.findIndex(sp => sp.id === id);
    if (index === -1) {
      return mockApiResponses.error('SuperPod not found', 404);
    }

    mockSuperPods.splice(index, 1);

    return {
      success: true,
      data: { message: 'SuperPod deleted successfully' }
    };
  }

  // ===== USER AUTHENTICATION (MOCK) =====
  async login(credentials: { email: string; password: string }) {
    await delay(600);

    // Mock authentication - accept any credentials for demo
    if (!credentials.email || !credentials.password) {
      return mockApiResponses.error('Email and password required', 400);
    }

    const mockUser = {
      id: 'user_123',
      email: credentials.email,
      name: credentials.email.split('@')[0], // Use email prefix as name
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${credentials.email}`,
      preferences: {
        theme: 'system' as const,
        aiSettings: mockAISettings
      }
    };

    return {
      success: true,
      data: {
        user: mockUser,
        token: `mock_token_${Date.now()}`,
        expiresIn: 3600 // 1 hour
      }
    };
  }

  async logout() {
    await delay(200);
    return {
      success: true,
      data: { message: 'Logged out successfully' }
    };
  }

  // ===== AI FEATURES (MOCK) =====
  async generateSummary(segmentIds: string[]) {
    await delay(1500); // Longer delay to simulate AI processing

    const segments = getMockSegmentsByIds(segmentIds);
    if (segments.length === 0) {
      return mockApiResponses.error('No valid segments provided', 400);
    }

    // Mock AI-generated summary
    const topics = [...new Set(segments.flatMap(s => s.tags))].slice(0, 3);
    const summary = `This SuperPod explores ${topics.join(', ')} through ${segments.length} carefully curated segments from leading podcasts. Key insights include innovative approaches to ${topics[0]}, practical applications in ${topics[1] || 'various industries'}, and future implications for ${topics[2] || 'society'}.`;

    return {
      success: true,
      data: { summary }
    };
  }

  async generateTransitions(fromSegmentId: string, toSegmentId: string) {
    await delay(800);

    const fromSegment = mockPodcastSegments.find(s => s.id === fromSegmentId);
    const toSegment = mockPodcastSegments.find(s => s.id === toSegmentId);

    if (!fromSegment || !toSegment) {
      return mockApiResponses.error('Segment not found', 404);
    }

    // Mock AI-generated transition
    const transition = `Building on the insights about ${fromSegment.tags[0]}, let's now explore how this connects to ${toSegment.tags[0]} in our next segment.`;

    return {
      success: true,
      data: { 
        transition,
        audioUrl: `/audio/transitions/${fromSegmentId}-${toSegmentId}.mp3`
      }
    };
  }

  // ===== AUDIO STREAMING =====
  async getAudioUrl(segmentId: string) {
    await delay(150);

    const audioData = mockAudioData[segmentId];
    if (!audioData) {
      return mockApiResponses.error('Audio not found', 404);
    }

    return {
      success: true,
      data: audioData
    };
  }

  // ===== SAVED SEARCHES =====
  private savedSearches: SavedSearch[] = [
    {
      id: 'search_1',
      name: 'AI & Innovation',
      query: 'artificial intelligence',
      tags: ['AI', 'innovation', 'technology'],
      categories: ['Interview', 'Documentary'],
      sources: ['Public', 'Spotify'],
      createdAt: '2024-12-15T10:30:00Z'
    },
    {
      id: 'search_2', 
      name: 'Business Psychology',
      query: 'leadership',
      tags: ['psychology', 'business', 'leadership'],
      categories: ['Case Study'],
      sources: ['Public'],
      createdAt: '2024-12-14T14:20:00Z'
    }
  ];

  async getSavedSearches() {
    await delay(300);
    
    return {
      success: true,
      data: [...this.savedSearches] // Return copy to prevent mutations
    };
  }

  async saveSearch(searchData: {
    name: string;
    query: string;
    tags: string[];
    categories: string[];
    sources: string[];
  }) {
    await delay(400);

    try {
      const newSearch: SavedSearch = {
        id: `search_${Date.now()}`,
        ...searchData,
        createdAt: new Date().toISOString()
      };

      this.savedSearches.unshift(newSearch); // Add to beginning
      
      // Keep only last 10 saved searches
      if (this.savedSearches.length > 10) {
        this.savedSearches = this.savedSearches.slice(0, 10);
      }

      return {
        success: true,
        data: newSearch
      };
    } catch (error) {
      return mockApiResponses.error('Failed to save search', 500);
    }
  }

  async deleteSavedSearch(searchId: string) {
    await delay(250);

    const index = this.savedSearches.findIndex(s => s.id === searchId);
    if (index === -1) {
      return mockApiResponses.error('Saved search not found', 404);
    }

    this.savedSearches.splice(index, 1);

    return {
      success: true,
      data: { message: 'Saved search deleted successfully' }
    };
  }

  // ===== ANALYTICS (MOCK) =====
  async getListeningAnalytics() {
    await delay(400);

    return {
      success: true,
      data: {
        totalListeningTime: 14520, // seconds
        superPodsCreated: mockSuperPods.length,
        favoriteTopics: ['technology', 'AI', 'innovation'],
        listeningStreak: 7, // days
        weeklyProgress: [45, 67, 23, 89, 56, 78, 34] // minutes per day
      }
    };
  }
}

// Export singleton instance
export const mockApiService = new MockApiService();

// Helper function to switch between mock and real API
export const getApiService = () => {
  const USE_MOCK_API = (window as any).__REACT_APP_USE_MOCK_API__ !== 'false';
  
  if (USE_MOCK_API) {
    console.log('🎭 Using Mock API - Set REACT_APP_USE_MOCK_API=false to use real backend');
    return mockApiService;
  }
  
  // Your developer will replace this with real API service
  throw new Error('Real API service not implemented yet. Set REACT_APP_USE_MOCK_API=true to use mock data.');
};
