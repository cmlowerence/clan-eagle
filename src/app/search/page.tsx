'use client';

import { useClashSearch } from "@/hooks/useClashSearch";
import { Search, Users, Shield, Trophy, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
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
  const { data: results, loading, error, search } = useClashSearch<ClanResult>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (term.length < 3) return;
    // Call the API via Proxy: /clans?name=...
    search(`/clans?name=${encodeURIComponent(term)}&limit=20`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 min-h-[80vh]">
      
      {/* HEADER */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-5xl font-clash text-skin-text uppercase">Find a Clan</h1>
        <p className="text-skin-muted text-sm">Search by name. Minimum 3 characters.</p>
      </div>

      {/* SEARCH BAR */}
      <form onSubmit={handleSubmit} className="relative group max-w-lg mx-auto">
          <div className="absolute -inset-1 bg-gradient-to-r from-skin-primary to-skin-secondary rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative flex bg-[#1f2937] rounded-xl overflow-hidden border border-white/10 p-1">
            <input 
              type="text" 
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="e.g. The Unbeatables" 
              className="w-full bg-transparent px-4 py-3 focus:outline-none text-white font-bold placeholder:text-skin-muted/50" 
            />
            <button type="submit" disabled={loading} className="bg-skin-primary text-black px-6 rounded-lg font-clash hover:bg-skin-secondary transition-colors flex items-center gap-2 disabled:opacity-50">
               {loading ? "..." : <Search size={20}/>}
            </button>
          </div>
      </form>

      {/* RESULTS */}
      <div className="space-y-2">
         {error && <div className="text-red-400 text-center">{error}</div>}
         
         {loading && <SkeletonLoader />}

         {!loading && results && results.length === 0 && (
            <div className="text-center text-skin-muted py-10 opacity-50">No clans found with that name.</div>
         )}

         {!loading && results && results.map((clan) => (
            <Link 
              key={clan.tag} 
              href={`/clan/${encodeURIComponent(clan.tag)}`}
              className="flex items-center gap-4 bg-[#1f2937] p-3 rounded-xl border border-white/5 hover:border-skin-primary/50 hover:bg-[#253041] transition-all group"
            >
               {/* Badge */}
               <div className="w-12 h-12 relative shrink-0">
                  <img src={clan.badgeUrls.small} className="w-full h-full object-contain drop-shadow-md" alt="" />
                  <div className="absolute -bottom-1 -right-1 bg-black text-white text-[9px] px-1.5 rounded border border-white/10 font-bold">Lvl {clan.clanLevel}</div>
               </div>

               {/* Info */}
               <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-white text-lg truncate group-hover:text-skin-primary transition-colors">{clan.name}</h4>
                  <div className="flex items-center gap-3 text-xs text-skin-muted">
                     <span className="flex items-center gap-1"><Users size={12}/> {clan.members}/50</span>
                     <span className="flex items-center gap-1"><Trophy size={12} className="text-yellow-500"/> {clan.clanPoints}</span>
                     {clan.location && <span className="flex items-center gap-1"><MapPin size={12}/> {clan.location.name}</span>}
                  </div>
               </div>

               <ArrowRight size={20} className="text-skin-muted opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all"/>
            </Link>
         ))}
      </div>
    </div>
  );
}
