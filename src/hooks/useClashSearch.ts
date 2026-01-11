'use client';

import { useState, useCallback } from 'react';

// Shared Interface for API Responses
interface Pagination {
  cursors?: {
    after?: string;
    before?: string;
  };
}

interface SearchResponse<T> {
  items: T[];
  paging?: Pagination;
}

export function useClashSearch<T extends { tag: string }>() {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination State
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [lastEndpoint, setLastEndpoint] = useState<string>("");

  const search = useCallback(async (endpoint: string, isNewSearch = true) => {
    if (loading) return; 
    
    setLoading(true);
    
    if (isNewSearch) {
      setError(null);
      // Don't clear data immediately if you want to keep the old list visible while loading
      // But for a new search term, usually we clear it:
      setData([]); 
      setNextCursor(null);
      setLastEndpoint(endpoint);
    }

    try {
      // 1. Construct URL for Pagination
      // If loading more, we append the cursor to the *original* endpoint
      let targetUrl = isNewSearch ? endpoint : lastEndpoint;
      
      if (!isNewSearch && nextCursor) {
        // Append &after=CURSOR or ?after=CURSOR safely
        const separator = targetUrl.includes('?') ? '&' : '?';
        targetUrl = `${targetUrl}${separator}after=${encodeURIComponent(nextCursor)}`;
      }

      console.log(`[useClashSearch] Fetching: ${targetUrl}`);

      // 2. Fetch via Smart Proxy
      // The proxy expects the full endpoint path as a parameter
      const proxyUrl = `/api/proxy?endpoint=${encodeURIComponent(targetUrl)}`;
      
      const res = await fetch(proxyUrl);
      if (!res.ok) throw new Error(`API Error: ${res.status}`);

      // 3. Handle Response
      // Our Proxy now guarantees a normalized structure: { items: [...], paging: {...} }
      const json = await res.json() as SearchResponse<T>;
      
      const newItems = json.items || [];
      const paging = json.paging;

      // 4. Update State (with Duplicate Filtering)
      setData(prev => {
        // If new search, start fresh. If load more, append.
        const currentList = isNewSearch ? [] : prev;
        
        // Filter out duplicates just in case the API overlaps
        const uniqueNewItems = newItems.filter(
            newItem => !currentList.some(existing => existing.tag === newItem.tag)
        );
        
        return [...currentList, ...uniqueNewItems];
      });

      // 5. Update Cursor for next load
      setNextCursor(paging?.cursors?.after || null);

    } catch (err: any) {
      console.error("[useClashSearch] Error:", err);
      setError(err.message || "Failed to load results");
    } finally {
      setLoading(false);
    }
  }, [loading, nextCursor, lastEndpoint]);

  return { 
    data, 
    loading, 
    error, 
    hasMore: !!nextCursor, 
    search 
  };
}
