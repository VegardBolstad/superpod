import { useState, useEffect, useCallback } from 'react';
import { mockApiService } from '../services/mockApi';
import { SuperPod, PodcastSegment } from '../App';

export function useSuperPods() {
  const [superPods, setSuperPods] = useState<SuperPod[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load user's SuperPods on mount
  useEffect(() => {
    loadSuperPods();
  }, []);

  const loadSuperPods = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await mockApiService.getUserSuperPods();
      if (response.success && 'data' in response) {
        setSuperPods(response.data);
      } else {
        setError('Failed to load SuperPods');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load SuperPods');
    } finally {
      setLoading(false);
    }
  }, []);

  const createSuperPod = useCallback(async (name: string, segments: PodcastSegment[]) => {
    try {
      const segmentIds = segments.map(s => s.id);
      const response = await mockApiService.createSuperPod({
        name,
        segments: segmentIds,
      });
      
      if (response.success && 'data' in response) {
        setSuperPods(prev => [...prev, response.data]);
        return response.data;
      } else {
        throw new Error('Failed to create SuperPod');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create SuperPod');
      throw err;
    }
  }, []);

  const updateSuperPod = useCallback(async (id: string, updates: Partial<SuperPod>) => {
    try {
      const response = await mockApiService.updateSuperPod(id, updates);
      if (response.success && 'data' in response) {
        setSuperPods(prev => prev.map(pod => pod.id === id ? response.data : pod));
        return response.data;
      } else {
        throw new Error('Failed to update SuperPod');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update SuperPod');
      throw err;
    }
  }, []);

  const deleteSuperPod = useCallback(async (id: string) => {
    try {
      const response = await mockApiService.deleteSuperPod(id);
      if (response.success) {
        setSuperPods(prev => prev.filter(pod => pod.id !== id));
      } else {
        throw new Error('Failed to delete SuperPod');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete SuperPod');
      throw err;
    }
  }, []);

  return {
    superPods,
    loading,
    error,
    createSuperPod,
    updateSuperPod,
    deleteSuperPod,
    refreshSuperPods: loadSuperPods,
  };
}
