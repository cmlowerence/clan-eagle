'use client';

import { useState } from 'react';

interface SearchResult<T> {
  items: T[];
  paging: any;
}

export function useClashSearch<T>() {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (endpoint: string) => {
    setLoading(true);
    setError(null);
    try {
      // Use the existing proxy
      const proxyUrl = `/api/proxy?endpoint=${encodeURIComponent(endpoint)}`;
      const res = await fetch(proxyUrl);
      
      if (!res.ok) throw new Error("Search failed");

      const json = await res.json();
      
      // The API returns { items: [...] } for lists
      if (json.items) {
        setData(json.items);
      } else {
        setData([]); // No items found
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to search");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, search };
}
