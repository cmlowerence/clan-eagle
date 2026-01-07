'use client';

import { useState, useEffect, useCallback } from 'react';

// Define the shape of the proxy response
interface ProxyResponse<T> {
  cached: boolean;
  data: T;
  error?: string;
}

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
      
      // 1. Check LocalStorage Cache (if not forcing update)
      if (!forceUpdate) {
        const cachedRaw = localStorage.getItem(storageKey);
        if (cachedRaw) {
          try {
            const { data: cachedData, timestamp } = JSON.parse(cachedRaw);
            const age = (Date.now() - timestamp) / 1000 / 60; // Age in minutes
            
            // Valid for 10 minutes
            if (age < 10) {
                console.log(`[Cache] Hit for ${key}`);
                setData(cachedData);
                setIsCached(true);
                setLastUpdated(new Date(timestamp).toLocaleTimeString());
                setLoading(false);
                return;
            }
          } catch (e) {
            console.warn("Cache parse error", e);
            localStorage.removeItem(storageKey);
          }
        }
      }

      // 2. Fetch from our Internal Proxy
      console.log(`[API] Fetching fresh data for ${key}`);
      
      // IMPORTANT: We pass the endpoint as a query param
      const proxyUrl = `/api/proxy?endpoint=${encodeURIComponent(endpoint)}`;
      const res = await fetch(proxyUrl);
      
      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }

      const json: ProxyResponse<T> = await res.json();

      if (json.error) {
        throw new Error(json.error);
      }

      // 3. Unwrap and Save
      // The backend returns { cached: boolean, data: ... }
      // We want the inner 'data'
      const actualData = json.data;

      localStorage.setItem(storageKey, JSON.stringify({
        data: actualData,
        timestamp: Date.now()
      }));

      setData(actualData);
      setIsCached(false); // It's fresh from the server
      setLastUpdated(new Date().toLocaleTimeString());

    } catch (err: any) {
      console.error(`[useClashData] Error:`, err);
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

