'use client';

import { useState } from 'react';

export function useClashSearch<T>() {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (endpoint: string) => {
    setLoading(true);
    setError(null);
    try {
      const proxyUrl = `/api/proxy?endpoint=${encodeURIComponent(endpoint)}`;
      console.log(`[Hook] Requesting: ${proxyUrl}`); // DEBUG LOG

      const res = await fetch(proxyUrl);
      
      if (!res.ok) {
        throw new Error(`Search failed: ${res.status}`);
      }

      const json = await res.json();
      
      // --- DEBUGGING: PRINT EXACT STRUCTURE ---
      console.log("[Hook] Raw JSON from Server:", json);
      // ----------------------------------------

      // ROBUST EXTRACTION: Check all possible locations for the array
      let extractedList: T[] = [];

      if (Array.isArray(json)) {
        // Case 1: It's already an array
        console.log("[Hook] Detected direct Array");
        extractedList = json;
      } 
      else if (Array.isArray(json.items)) {
        // Case 2: Standard API { items: [...] }
        console.log("[Hook] Detected 'items' property");
        extractedList = json.items;
      } 
      else if (json.data && Array.isArray(json.data.items)) {
        // Case 3: Wrapper { data: { items: [...] } }
        console.log("[Hook] Detected 'data.items' nested property");
        extractedList = json.data.items;
      } 
      else {
        console.warn("[Hook] Could not find array in response. Defaulting to empty.");
      }

      setData(extractedList);

    } catch (err: any) {
      console.error("[Hook] Error:", err);
      setError(err.message || "Failed to search");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, search };
}
