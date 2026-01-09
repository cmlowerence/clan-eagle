'use client';

import { useClashSearch } from "@/hooks/useClashSearch";
import { Search, Users, Shield, Trophy, MapPin, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react"; // Added useEffect
import SkeletonLoader from "@/components/SkeletonLoader";

interface ClanResult {
  tag: string;
  name: string;
  clanLevel: number;
  members: number;
  clanPoints: number;
  badgeUrls: { small: string };
  location?: { name: string };
}

export default function SearchPage() {
  const [term, setTerm] = useState("");
  const { data: results, loading, error, search } = useClashSearch<any>();

  // DEBUG LOG: Print results whenever they change
  useEffect(() => {
    if (results) {
      console.log("--- FRONTEND DEBUG ---");
      console.log("Raw API Results:", results);
      console.log("Has .data property?", !!results.data);
      console.log("Has .items property?", !!results.items);
      if (results.data) console.log("Has .data.items?", !!results.data.items);
    }
  }, [results]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (term.length < 3) return;
    
    const query = `/clans?name=${encodeURIComponent(term)}&limit=20`;
    console.log("Sending Query:", query); // DEBUG
    search(query);
  };

  // ROBUST EXTRACTION
  const list: ClanResult[] = 
    (results as any)?.data?.items || 
    (results as any)?.items || 
    [];

  return (
    <div className="max-w-4xl mx-auto space-y-8 min-h-[80vh] px-4 pt-8">
      
      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-5xl font-clash text-white uppercase tracking-wide">Find a Clan</h1>
        <p className="text-skin-muted text-sm">Search by name (min 3 chars)</p>
      </div>

      <form onSubmit={handleSubmit} className="relative group max-w-lg mx-auto z-10">
          <div className="absolute -inset-1 bg-gradient-to-r from-skin-primary to-skin-secondary rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative flex bg-[#1f2937] rounded-xl overflow-hidden border border-white/10 p-1">
            <input 
              type="text" 
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="e.g. The Unbeatables" 
              className="w-full bg-transparent px-4 py-3 focus:outline-none text-white font-bold placeholder:text-skin-muted/50" 
            />
            <button type="submit" disabled={loading || term.length < 3} className="bg-skin-primary text-black px-6 rounded-lg font-clash hover:bg-skin-secondary transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
               {loading ? <Loader2 size={20} className="animate-spin"/> : <Search size={20}/>}
            </button>
          </div>
      </form>

      <div className="space-y-3">
         {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-center">
                {error}
            </div>
         )}
         
         {loading && (
            <div className="space-y-3">
                <SkeletonLoader />
                <SkeletonLoader />
            </div>
         )}

         {/* Only show if we have results but list is empty */}
         {!loading && results && list.length === 0 && (
            <div className="text-center py-16 opacity-50 flex flex-col items-center gap-2">
                <Shield size={40} className="text-skin-muted"/>
                <p className="text-skin-muted">No clans found matching "{term}"</p>
                <p className="text-xs text-skin-muted/50">(Check console for debug info)</p>
            </div>
         )}

         {!loading && list.map((clan) => (
            <Link 
              key={clan.tag} 
              href={`/clan/${encodeURIComponent(clan.tag)}`}
              className="flex items-center gap-4 bg-[#1f2937] p-4 rounded-xl border border-white/5 hover:border-skin-primary/50 hover:bg-[#253041] transition-all group shadow-md"
            >
               <div className="w-14 h-14 relative shrink-0">
                  <img src={clan.badgeUrls.small} className="w-full h-full object-contain drop-shadow-md" alt="" />
                  <div className="absolute -bottom-1 -right-1 bg-black text-white text-[10px] px-1.5 py-0.5 rounded border border-white/10 font-bold">Lvl {clan.clanLevel}</div>
               </div>
               <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-white text-lg truncate group-hover:text-skin-primary transition-colors">{clan.name}</h4>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-skin-muted mt-1">
                     <span className="flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded"><Users size={12}/> {clan.members}/50</span>
                     <span className="flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded"><Trophy size={12} className="text-yellow-500"/> {clan.clanPoints}</span>
                     {clan.location && <span className="flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded"><MapPin size={12}/> {clan.location.name}</span>}
                  </div>
               </div>
               <ArrowRight size={20} className="text-skin-muted opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all"/>
            </Link>
         ))}
      </div>
    </div>
  );
}
