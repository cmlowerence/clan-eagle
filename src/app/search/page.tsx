'use client';

import { useState } from "react";
import { useClashSearch } from "@/hooks/useClashSearch";
import { Loader2, ChevronDown, Shield } from "lucide-react";
import SkeletonLoader from "@/components/SkeletonLoader";

// Local Components
import { ClanResult } from "./_components/types";
import SearchHeader from "./_components/SearchHeader";
import SearchBar from "./_components/SearchBar";
import SearchResultItem from "./_components/SearchResultItem";

export default function SearchPage() {
  const [term, setTerm] = useState("");
  const { data: results, loading, error, hasMore, search } = useClashSearch<ClanResult>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (term.length < 3) return;
    
    // API Fix: We send the CLEAN endpoint path. 
    // encodeURIComponent is correct here because it's for a query parameter value (?name=...)
    // The middleware will handle the rest of the request logic.
    search(`/clans?name=${encodeURIComponent(term)}&limit=10`, true);
  };

  const handleLoadMore = () => {
    search("", false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 min-h-[80vh] px-4 pt-8 pb-20 relative">
      
      {/* 1. Header */}
      <SearchHeader />

      {/* 2. Search Input */}
      <SearchBar 
        term={term} 
        setTerm={setTerm} 
        onSubmit={handleSubmit} 
        loading={loading} 
        hasResults={results.length > 0} 
      />

      {/* 3. Results Section */}
      <div className="space-y-3">
         {/* Error State */}
         {error && (
           <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-center">
             {error}
           </div>
         )}
         
         {/* Loading Skeletons */}
         {results.length === 0 && loading && (
            <div className="space-y-3">
                <SkeletonLoader />
                <SkeletonLoader />
            </div>
         )}

         {/* Empty State */}
         {!loading && results.length === 0 && term.length > 2 && !error && (
            <div className="text-center py-16 opacity-50 flex flex-col items-center gap-2">
                <Shield size={40} className="text-skin-muted"/>
                <p className="text-skin-muted">No clans found matching "{term}"</p>
            </div>
         )}

         {/* Result List */}
         {results.map((clan) => (
            <SearchResultItem key={clan.tag} clan={clan} />
         ))}

         {/* Pagination */}
         {hasMore && (
            <div className="pt-4 flex justify-center">
                <button 
                    onClick={handleLoadMore} 
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-3 bg-[#1f2937] hover:bg-white/5 border border-white/10 rounded-xl text-skin-muted hover:text-white transition-all disabled:opacity-50"
                >
                    {loading ? <Loader2 size={16} className="animate-spin"/> : <ChevronDown size={16} />}
                    {loading ? "Loading..." : "Load More Clans"}
                </button>
            </div>
         )}
      </div>
    </div>
  );
}
