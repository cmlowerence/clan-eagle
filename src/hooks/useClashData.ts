'use client';

import { useState, useEffect, useCallback } from 'react';

export function useClashData<T>(key: string, endpoint: string) {
  const [data, setData] = useState<T | null>(null);
  
  // 1. VALIDATION: Prevent requests for invalid/empty endpoints
  const isValidEndpoint = endpoint && !endpoint.includes('undefined') && !endpoint.includes('null') && endpoint !== '';
  
  // Initialize loading to TRUE only if endpoint is valid (prevents UI flash)
  const [loading, setLoading] = useState(!!isValidEndpoint);
  
  const [isCached, setIsCached] = useState(false);
  const [timestamp, setTimestamp] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async (forceUpdate = false) => {
    // Stop immediately if endpoint is invalid
    if (!isValidEndpoint) {
        setLoading(false);
        return;
    }

    setLoading(true);
    setError(null);

    const storageKey = `clash_cache_${key}`;

    try {
      // --- STEP 1: CHECK LOCAL STORAGE (Fast Path) ---
      if (!forceUpdate) {
        const cachedRaw = localStorage.getItem(storageKey);
        if (cachedRaw) {
          try {
            const parsed = JSON.parse(cachedRaw);
            const ageMinutes = (Date.now() - parsed.timestamp) / 1000 / 60;
            
            // Cache Policy: Valid for 12 Hours (720 minutes)
            if (ageMinutes < 720) {
                // If we have cached "null" (e.g. Clan not in war), we accept it validly
                setData(parsed.data as T);
                setIsCached(true);
                setTimestamp(parsed.timestamp);
                setLoading(false);
                return; // Stop here, use cache
            }
          } catch (e) {
            // If parse fails, clear invalid cache
            localStorage.removeItem(storageKey);
          }
        }
      }

      // --- STEP 2: FETCH FROM PROXY (Network Path) ---
      // We encode the endpoint to handle '#' characters in tags safely
      const proxyUrl = `/api/proxy?endpoint=${encodeURIComponent(endpoint)}`;
      
      const res = await fetch(proxyUrl, { cache: 'no-store' });

      // Handle Specific Middleware Responses
      if (res.status === 403) {
        throw new Error("Access Denied: Private War Log");
      }

      // If 404, it means "Resource Not Found" (or Clan not in war)
      // We treat this as valid "empty" data, not a crash error.
      if (res.status === 404) {
         // We cache this "null" result to prevent spamming the API for missing resources
         const nullData = null;
         const newTimestamp = Date.now();
         
         localStorage.setItem(storageKey, JSON.stringify({
           data: nullData,
           timestamp: newTimestamp
         }));

         setData(null);
         setLoading(false);
         return;
      }

      if (!res.ok) {
        throw new Error(`API Error ${res.status}`);
      }

      // The middleware now returns the data DIRECTLY (normalized)
      const actualData = await res.json();
      const newTimestamp = Date.now();
      
      // --- STEP 3: SAVE TO LOCAL STORAGE ---
      try {
          localStorage.setItem(storageKey, JSON.stringify({
            data: actualData,
            timestamp: newTimestamp
          }));
      } catch (e) {
          console.warn('LocalStorage Full or Error:', e);
      }

      setData(actualData);
      setIsCached(false); // This was a fresh network fetch
      setTimestamp(newTimestamp);

    } catch (err: any) {
      console.error(`[useClashData] Error fetching ${endpoint}:`, err);
      setError(err.message || "Failed to fetch data");
      setData(null); 
    } finally {
      setLoading(false);
    }
  }, [key, endpoint, isValidEndpoint]);

  // Initial Fetch
  useEffect(() => {
    loadData();
  }, [loadData]);

  return { 
    data, 
    loading, 
    isCached, 
    timestamp, 
    error, 
    refresh: () => loadData(true) // Helper to force-refresh (bypass cache)
  };
}
