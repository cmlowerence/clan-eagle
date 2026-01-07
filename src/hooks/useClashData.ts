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
  const [loading, setLoading] = useState(true);
  const [isCached, setIsCached] = useState(false);
  const [timestamp, setTimestamp] = useState<number | null>(null); // Changed to number
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async (forceUpdate = false) => {
    setLoading(true);
    setError(null);
    try {
      const storageKey = `clash_cache_${key}`;
      
      // 1. Check LocalStorage
      if (!forceUpdate) {
        const cachedRaw = localStorage.getItem(storageKey);
        if (cachedRaw) {
          try {
            const parsed = JSON.parse(cachedRaw);
            const ageMinutes = (Date.now() - parsed.timestamp) / 1000 / 60;
            
            // CACHE LOGIC: Valid for 12 Hours (720 minutes)
            if (ageMinutes < 720) {
                setData(parsed.data as T);
                setIsCached(true);
                setTimestamp(parsed.timestamp);
                setLoading(false);
                return;
            } else {
              console.log(`[Cache] Expired (${Math.floor(ageMinutes)} mins old). Refetching...`);
            }
          } catch (e) {
            localStorage.removeItem(storageKey);
          }
        }
      }

      // 2. Fetch from Proxy
      const proxyUrl = `/api/proxy?endpoint=${encodeURIComponent(endpoint)}`;
      const res = await fetch(proxyUrl);
      
      if (!res.ok) throw new Error("Failed to fetch data");

      const json = await res.json() as ProxyResponse<T>;

      if (json.error) throw new Error(json.error);

      const actualData = json.data;

      // 3. Save to LocalStorage
      const newTimestamp = Date.now();
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
    } finally {
      setLoading(false);
    }
  }, [key, endpoint]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { data, loading, isCached, timestamp, error, refresh: () => loadData(true) };
}

