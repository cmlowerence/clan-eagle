'use client';

import { useState, useCallback } from 'react';

interface Pagination {
  cursors?: {
    after?: string;
    before?: string;
  };
}

export function useClashSearch<T extends { tag: string }>() {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  // We store the last endpoint to append the cursor to it
  const [lastEndpoint, setLastEndpoint] = useState<string>("");

  const search = useCallback(async (endpoint: string, isNewSearch = true) => {
    if (loading) return; // Prevent double fetch
    setLoading(true);
    if (isNewSearch) {
      setError(null);
      setData([]);
      setNextCursor(null);
      setLastEndpoint(endpoint);
    }

    try {
      // Construct URL: If it's a "Load More" action, append the cursor
      let url = isNewSearch ? endpoint : lastEndpoint;
      if (!isNewSearch && nextCursor) {
        // Append &after=CURSOR. Handle if URL already has query params (?)
        const separator = url.includes('?') ? '&' : '?';
        url = `${url}${separator}after=${encodeURIComponent(nextCursor)}`;
      }

      console.log(`[Hook] Fetching: ${url}`);
      const proxyUrl = `/api/proxy?endpoint=${encodeURIComponent(url)}`;
      
      const res = await fetch(proxyUrl);
      if (!res.ok) throw new Error(`API Error: ${res.status}`);

      const json = await res.json();
      
      // --- EXTRACTION LOGIC ---
      let newItems: T[] = [];
      let paging: Pagination | undefined;

      // Check for nested wrapper { data: { items: [], paging: {} } }
      if (json.data && Array.isArray(json.data.items)) {
        newItems = json.data.items;
        paging = json.data.paging;
      } 
      // Check for standard API { items: [], paging: {} }
      else if (Array.isArray(json.items)) {
        newItems = json.items;
        paging = json.paging;
      }
      // Check for direct array (unlikely for search)
      else if (Array.isArray(json)) {
        newItems = json;
      }

      // --- DUPLICATE FILTERING ---
      // We filter out items that are already in the 'data' state
      setData(prev => {
        const currentList = isNewSearch ? [] : prev;
        const uniqueNewItems = newItems.filter(
            newItem => !currentList.some(existing => existing.tag === newItem.tag)
        );
        return [...currentList, ...uniqueNewItems];
      });

      // Update Cursor
      setNextCursor(paging?.cursors?.after || null);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load results");
    } finally {
      setLoading(false);
    }
  }, [nextCursor, lastEndpoint, loading]);

  return { data, loading, error, hasMore: !!nextCursor, search };
}
