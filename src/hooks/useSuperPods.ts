import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';
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
      const pods = await apiService.getUserSuperPods();
      setSuperPods(pods);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load SuperPods');
    } finally {
      setLoading(false);
    }
  }, []);

  const createSuperPod = useCallback(async (name: string, segments: PodcastSegment[]) => {
    try {
      const segmentIds = segments.map(s => s.id);
      const newSuperPod = await apiService.createSuperPod({
        name,
        segments: segmentIds,
      });
      
      setSuperPods(prev => [...prev, newSuperPod]);
      return newSuperPod;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create SuperPod');
      throw err;
    }
  }, []);

  const updateSuperPod = useCallback(async (id: string, updates: Partial<SuperPod>) => {
    try {
      const updated = await apiService.updateSuperPod(id, updates);
      setSuperPods(prev => prev.map(pod => pod.id === id ? updated : pod));
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update SuperPod');
      throw err;
    }
  }, []);

  const deleteSuperPod = useCallback(async (id: string) => {
    try {
      await apiService.deleteSuperPod(id);
      setSuperPods(prev => prev.filter(pod => pod.id !== id));
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
