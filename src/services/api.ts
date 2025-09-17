// API Service Layer for Backend Integration
import { PodcastSegment, SuperPod } from '../App';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Types for API responses
interface SearchResponse {
  segments: PodcastSegment[];
  totalResults: number;
  suggestions: string[];
  relatedTopics: string[];
}

interface GraphNode extends PodcastSegment {
  relevance: number;
  x: number;
  y: number;
  connections: string[];
}

class APIService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const token = localStorage.getItem('auth_token');
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Search & Discovery
  async searchPodcasts(params: {
    query: string;
    tags?: string[];
    categories?: string[];
    sources?: string[];
    limit?: number;
    offset?: number;
  }): Promise<SearchResponse> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(key, v));
      } else if (value !== undefined) {
        searchParams.set(key, String(value));
      }
    });

    return this.request<SearchResponse>(`/search?${searchParams}`);
  }

  async getSegmentDetails(segmentId: string): Promise<PodcastSegment> {
    return this.request<PodcastSegment>(`/segments/${segmentId}`);
  }

  async getRelatedSegments(segmentId: string): Promise<PodcastSegment[]> {
    return this.request<PodcastSegment[]>(`/segments/${segmentId}/related`);
  }

  // SuperPod Management
  async createSuperPod(data: {
    name: string;
    segments: string[]; // segment IDs
    summary?: string;
  }): Promise<SuperPod> {
    return this.request<SuperPod>('/superpods', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getUserSuperPods(): Promise<SuperPod[]> {
    return this.request<SuperPod[]>('/superpods');
  }

  async updateSuperPod(id: string, updates: Partial<SuperPod>): Promise<SuperPod> {
    return this.request<SuperPod>(`/superpods/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteSuperPod(id: string): Promise<void> {
    return this.request<void>(`/superpods/${id}`, {
      method: 'DELETE',
    });
  }

  // User Authentication
  async login(credentials: { email: string; password: string }): Promise<{ token: string; user: any }> {
    return this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout(): Promise<void> {
    localStorage.removeItem('auth_token');
    return this.request<void>('/auth/logout', { method: 'POST' });
  }

  // AI Features
  async generateSummary(segmentIds: string[]): Promise<{ summary: string }> {
    return this.request<{ summary: string }>('/ai/summarize', {
      method: 'POST',
      body: JSON.stringify({ segmentIds }),
    });
  }

  async generateTransitions(fromSegmentId: string, toSegmentId: string): Promise<{ transition: string }> {
    return this.request<{ transition: string }>('/ai/transitions', {
      method: 'POST',
      body: JSON.stringify({ fromSegmentId, toSegmentId }),
    });
  }

  // Audio Streaming
  async getAudioUrl(segmentId: string): Promise<{ url: string; duration: number }> {
    return this.request<{ url: string; duration: number }>(`/audio/${segmentId}`);
  }
}

export const apiService = new APIService();
export default apiService;
