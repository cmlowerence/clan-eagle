'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchClashAPI } from '@/lib/api'; // Re-using your existing server fetcher logic in a client context via API routes or direct call if feasible, 
// BUT typically fetchClashAPI was server-side. 
// We will adapt this to use a standard fetch to your proxy.

// Helper to fetch directly from your proxy URL
const fetchProxy = async (endpoint: string) => {
  const BASE_URL = 'https://coc-api-functional.onrender.com';
  const cleanEndpoint = endpoint.replace(/#/g, '%23');
  const res = await fetch(`${BASE_URL}${cleanEndpoint}`);
  if (!res.ok) throw new Error('API Error');
  const json = await res.json();
  return json.data; // Unwrap the { cached, data } envelope here
};

export function useClashData<T>(key: string, endpoint: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCached, setIsCached] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async (forceUpdate = false) => {
    setLoading(true);
    setError(null);
    try {
      const storageKey = `clash_cache_${key}`;
      const cachedRaw = localStorage.getItem(storageKey);
      
      // 1. Check Cache
      if (cachedRaw && !forceUpdate) {
        const { data: cachedData, timestamp } = JSON.parse(cachedRaw);
        const age = (Date.now() - timestamp) / 1000 / 60; // Age in minutes
        
        // Cache valid for 10 minutes
        if (age < 10) {
            setData(cachedData);
            setIsCached(true);
            setLastUpdated(new Date(timestamp).toLocaleTimeString());
            setLoading(false);
            return;
        }
      }

      // 2. Fetch Fresh
      const freshData = await fetchProxy(endpoint);
      
      // 3. Save to Cache
      localStorage.setItem(storageKey, JSON.stringify({
        data: freshData,
        timestamp: Date.now()
      }));

      setData(freshData);
      setIsCached(false);
      setLastUpdated(new Date().toLocaleTimeString());

    } catch (err: any) {
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, [key, endpoint]);

  // Initial Load
  useEffect(() => {
    loadData();
  }, [loadData]);

  return { data, loading, isCached, lastUpdated, error, refresh: () => loadData(true) };
}
