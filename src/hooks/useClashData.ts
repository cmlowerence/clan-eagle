 'use client';

import { useState, useEffect, useCallback } from 'react';

interface ProxyResponse<T> {
  cached: boolean;
  data: T;
  error?: string;
  debugUrl?: string;
}

export function useClashData<T>(key: string, endpoint: string) {
  const [data, setData] = useState<T | null>(null);
  
  // FIX: Initialize loading to TRUE if we have a valid endpoint. 
  // This prevents the "Not Found" flash on initial render.
  const isValidEndpoint = endpoint && !endpoint.includes('undefined') && !endpoint.includes('null') && endpoint !== '';
  const [loading, setLoading] = useState(!!isValidEndpoint);
  
  const [isCached, setIsCached] = useState(false);
  const [timestamp, setTimestamp] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async (forceUpdate = false) => {
    // Stop if endpoint is invalid
    if (!endpoint || endpoint.endsWith('/') || endpoint.includes('undefined') || endpoint.includes('null')) {
        setLoading(false);
        return;
    }

    setLoading(true);
    setError(null);
    try {
      const storageKey = `clash_cache_${key}`;
      
      // 1. Check LocalStorage (Fast Path)
      if (!forceUpdate) {
        const cachedRaw = localStorage.getItem(storageKey);
        if (cachedRaw) {
          try {
            const parsed = JSON.parse(cachedRaw);
            const ageMinutes = (Date.now() - parsed.timestamp) / 1000 / 60;
            
            // Valid for 12 Hours
            if (ageMinutes < 720) {
                setData(parsed.data as T);
                setIsCached(true);
                setTimestamp(parsed.timestamp);
                setLoading(false);
                return; // Stop here, don't fetch
            }
          } catch (e) {
            localStorage.removeItem(storageKey);
          }
        }
      }

      // 2. Fetch from Proxy (Slow Path)
      const proxyUrl = `/api/proxy?endpoint=${encodeURIComponent(endpoint)}`;
      const res = await fetch(proxyUrl);
      
      if (!res.ok) throw new Error("Failed to fetch data");

      const json = await res.json() as ProxyResponse<T>;

      if (json.error) throw new Error(json.error);

      const actualData = json.data;
      const newTimestamp = Date.now();
      
      // 3. Save to LocalStorage
      localStorage.setItem(storageKey, JSON.stringify({
        data: actualData,
        timestamp: newTimestamp
      }));

      setData(actualData);
      setIsCached(false);
      setTimestamp(newTimestamp);

    } catch (err: any) {
      console.error(`[useClashData] Failed:`, err);
      setError(err.message || "Failed to fetch data");
      setData(null); // Ensure data is null on error so "Not Found" shows correctly
    } finally {
      setLoading(false);
    }
  }, [key, endpoint]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { data, loading, isCached, timestamp, error, refresh: () => loadData(true) };
}
