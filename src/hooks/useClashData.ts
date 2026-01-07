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
  const [loading, setLoading] = useState(false); // Default to false so we don't show loader for empty states
  const [isCached, setIsCached] = useState(false);
  const [timestamp, setTimestamp] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async (forceUpdate = false) => {
    // STOP if the endpoint is invalid (prevents the Compare Page error)
    if (!endpoint || endpoint.endsWith('/') || endpoint.includes('undefined') || endpoint.includes('null')) {
        setLoading(false);
        return;
    }

    setLoading(true);
    setError(null);
    try {
      const storageKey = `clash_cache_${key}`;
      
      if (!forceUpdate) {
        const cachedRaw = localStorage.getItem(storageKey);
        if (cachedRaw) {
          try {
            const parsed = JSON.parse(cachedRaw);
            const ageMinutes = (Date.now() - parsed.timestamp) / 1000 / 60;
            if (ageMinutes < 720) {
                setData(parsed.data as T);
                setIsCached(true);
                setTimestamp(parsed.timestamp);
                setLoading(false);
                return;
            }
          } catch (e) {
            localStorage.removeItem(storageKey);
          }
        }
      }

      const proxyUrl = `/api/proxy?endpoint=${encodeURIComponent(endpoint)}`;
      const res = await fetch(proxyUrl);
      
      if (!res.ok) throw new Error("Failed to fetch data");

      const json = await res.json() as ProxyResponse<T>;

      if (json.error) throw new Error(json.error);

      const actualData = json.data;
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
