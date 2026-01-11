'use client';

import { useState, useEffect, useCallback } from 'react';

export function useClashData<T>(key: string, endpoint: string) {
  const [data, setData] = useState<T | null>(null);
  
  // Validation
  const isValidEndpoint = endpoint && !endpoint.includes('undefined') && !endpoint.includes('null') && endpoint !== '';
  
  const [loading, setLoading] = useState(!!isValidEndpoint);
  const [isCached, setIsCached] = useState(false);
  const [timestamp, setTimestamp] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async (forceUpdate = false) => {
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
            
            // Cache Policy: Valid for 12 Hours
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

      // --- STEP 2: FETCH FROM PROXY (Network Path) ---
      const proxyUrl = `/api/proxy?endpoint=${encodeURIComponent(endpoint)}`;
      const res = await fetch(proxyUrl, { cache: 'no-store' });

      if (res.status === 403) throw new Error("Access Denied: Private War Log");
      if (res.status === 404) {
         // Cache "null" for 404s to prevent spamming
         const nullData = null;
         const newTimestamp = Date.now();
         localStorage.setItem(storageKey, JSON.stringify({ data: nullData, timestamp: newTimestamp }));
         setData(null);
         setLoading(false);
         return;
      }
      if (!res.ok) throw new Error(`API Error ${res.status}`);

      const rawJson = await res.json();

      // --- CRITICAL FIX: UNWRAP DATA ---
      // If API returns { cached: boolean, data: {...} }, we extract just the inner 'data'
      let cleanData = rawJson;
      if (rawJson && typeof rawJson === 'object' && 'data' in rawJson) {
         cleanData = rawJson.data;
      }

      const newTimestamp = Date.now();
      
      // --- STEP 3: SAVE TO LOCAL STORAGE ---
      try {
          localStorage.setItem(storageKey, JSON.stringify({
            data: cleanData,
            timestamp: newTimestamp
          }));
      } catch (e) {
          console.warn('LocalStorage Full or Error:', e);
      }

      setData(cleanData);
      setIsCached(false); 
      setTimestamp(newTimestamp);

    } catch (err: any) {
      console.error(`[useClashData] Error fetching ${endpoint}:`, err);
      // Don't set error state for 404s (handled above), but do for others
      if (err.message !== "Not Found" && err.message !== "Access Denied: Private War Log") {
          setError(err.message || "Failed to fetch data");
      }
      // If access denied, we still want the component to know about the specific error
      if (err.message === "Access Denied: Private War Log") {
          setError(err.message);
      }
      
      setData(null); 
    } finally {
      setLoading(false);
    }
  }, [key, endpoint, isValidEndpoint]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { 
    data, 
    loading, 
    isCached, 
    timestamp, 
    error, 
    refresh: () => loadData(true) 
  };
}
