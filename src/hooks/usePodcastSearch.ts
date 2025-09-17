import { useState, useCallback, useRef } from 'react';
import { mockApiService } from '../services/mockApi';
import { PodcastSegment } from '../App';

interface SearchState {
  results: PodcastSegment[];
  loading: boolean;
  error: string | null;
  totalResults: number;
  suggestions: string[];
}

export function usePodcastSearch() {
  const [state, setState] = useState<SearchState>({
    results: [],
    loading: false,
    error: null,
    totalResults: 0,
    suggestions: [],
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const search = useCallback(async (params: {
    query: string;
    tags?: string[];
    categories?: string[];
    sources?: string[];
  }) => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await mockApiService.searchPodcasts(params);
      
      if (response.success && 'data' in response) {
        setState({
          results: response.data.segments,
          loading: false,
          error: null,
          totalResults: response.data.totalResults,
          suggestions: response.data.suggestions || [],
        });
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: ('error' in response ? response.error.message : 'Search failed'),
        }));
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        setState(prev => ({
          ...prev,
          loading: false,
          error: error.message,
        }));
      }
    }
  }, []);

  const clearResults = useCallback(() => {
    setState({
      results: [],
      loading: false,
      error: null,
      totalResults: 0,
      suggestions: [],
    });
  }, []);

  return {
    ...state,
    search,
    clearResults,
  };
}
