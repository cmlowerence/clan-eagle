'use client';

import { useState } from 'react';

export function useClashSearch<T>() {
  // State holds an array of T (e.g. ClanResult[])
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (endpoint: string) => {
    setLoading(true);
    setError(null);
    try {
      const proxyUrl = `/api/proxy?endpoint=${encodeURIComponent(endpoint)}`;
      const res = await fetch(proxyUrl);
      
      if (!res.ok) throw new Error(`Search failed: ${res.status}`);

      const json = await res.json();
      
      // --- ROBUST EXTRACTION LOGIC ---
      // Case A: Standard CoC API { items: [...] }
      if (Array.isArray(json.items)) {
        setData(json.items);
      } 
      // Case B: Your Proxy Wrapper { data: { items: [...] } }
      else if (json.data && Array.isArray(json.data.items)) {
        setData(json.data.items);
      } 
      // Case C: Direct Array [...]
      else if (Array.isArray(json)) {
        setData(json);
      } 
      // Case D: Fallback (empty)
      else {
        console.warn("Unexpected API structure:", json);
        setData([]);
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to search");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, search };
}
