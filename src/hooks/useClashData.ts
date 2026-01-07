'use client';

import { useState, useEffect, useCallback } from 'react';

// Define the expected structure from your backend
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
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async (forceUpdate = false) => {
    setLoading(true);
    setError(null);
    try {
      const storageKey = `clash_cache_${key}`;
      
      // 1. Check LocalStorage (if not forcing update)
      if (!forceUpdate) {
        const cachedRaw = localStorage.getItem(storageKey);
        if (cachedRaw) {
          try {
            const parsed = JSON.parse(cachedRaw);
            const age = (Date.now() - parsed.timestamp) / 1000 / 60; // Age in minutes
            
            // Valid for 10 minutes
            if (age < 10) {
                setData(parsed.data as T);
                setIsCached(true);
                setLastUpdated(new Date(parsed.timestamp).toLocaleTimeString());
                setLoading(false);
                return;
            }
          } catch (e) {
            localStorage.removeItem(storageKey);
          }
        }
      }

      // 2. Fetch from Proxy
      const proxyUrl = `/api/proxy?endpoint=${encodeURIComponent(endpoint)}`;
      console.log(`[API] Fetching: ${proxyUrl}`);
      
      const res = await fetch(proxyUrl);
      
      // Handle HTTP Errors
      if (!res.ok) {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
           const errJson = await res.json();
           throw new Error(errJson.error || "Proxy Error");
        } else {
           throw new Error(`API Route 404: The file src/app/api/proxy/route.ts is missing or in the wrong folder.`);
        }
      }

      // 3. Parse and Cast Type
      // We explicitly tell TS this is a ProxyResponse<T>
      const json = await res.json() as ProxyResponse<T>;

      if (json.error) {
        throw new Error(json.error);
      }

      // 4. Extract 'data' from the wrapper { cached: ..., data: ... }
      const actualData = json.data;

      // 5. Save to LocalStorage
      localStorage.setItem(storageKey, JSON.stringify({
        data: actualData,
        timestamp: Date.now()
      }));

      setData(actualData);
      setIsCached(false);
      setLastUpdated(new Date().toLocaleTimeString());

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

  return { data, loading, isCached, lastUpdated, error, refresh: () => loadData(true) };
}

