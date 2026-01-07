'use client';

import { useState, useEffect, useCallback } from 'react';

interface ProxyResponse<T> {
  cached: boolean;
  data: T;
  error?: string;
  debugUrl?: string; // New debug field
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
      
      // 1. Check LocalStorage (skip if forcing update)
      if (!forceUpdate) {
        const cachedRaw = localStorage.getItem(storageKey);
        if (cachedRaw) {
          try {
            const { data: cachedData, timestamp } = JSON.parse(cachedRaw);
            // Cache valid for 10 minutes
            if ((Date.now() - timestamp) / 1000 / 60 < 10) {
                setData(cachedData);
                setIsCached(true);
                setLastUpdated(new Date(timestamp).toLocaleTimeString());
                setLoading(false);
                return;
            }
          } catch (e) {
            localStorage.removeItem(storageKey);
          }
        }
      }

      // 2. Fetch from Proxy
      // Encode the endpoint to ensure special chars like # travel safely to our proxy
      const proxyUrl = `/api/proxy?endpoint=${encodeURIComponent(endpoint)}`;
      console.log(`[API] Fetching: ${proxyUrl}`);
      
      const res = await fetch(proxyUrl);
      
      // 3. Handle Errors with Debug Info
      if (!res.ok) {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
           // It's a JSON error from our Proxy (Good, we can debug)
           const errJson = await res.json();
           console.error("[Proxy Error Debug]", errJson);
           throw new Error(errJson.error + (errJson.debugUrl ? ` (Tried: ${errJson.debugUrl})` : ""));
        } else {
           // It's an HTML error (likely 404 Not Found)
           // This means src/app/api/proxy/route.ts DOES NOT EXIST or is in the wrong place.
           throw new Error("Proxy Route Not Found. Check file structure: src/app/api/proxy/route.ts");
        }
      }

      const json: ProxyResponse<T> = await res.json();

      if (json.error) {
        throw new Error(json.error);
      }

      // 4. Save Data
      // Our proxy unwraps the backend response, so json is the actual data object or { data: ... }
      // Based on your backend, it returns { cached: bool, data: ... }. We want .data
      const actualData = json.data || json; 

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

