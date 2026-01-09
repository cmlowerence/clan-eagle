'use client';

import { useClashData } from "@/hooks/useClashData";
import SkeletonLoader from "@/components/SkeletonLoader";
import { useState } from "react";
import Link from "next/link";
import { Trophy, Globe, MapPin, Users, Crown, Shield } from "lucide-react";

// 32000006 = International, 32000113 = India
const LOCATIONS = {
  global: { id: '32000006', name: 'Global', icon: Globe },
  local: { id: '32000113', name: 'India', icon: MapPin } // You can change this ID to any country
};

export default function LeaderboardPage() {
  const [location, setLocation] = useState<'global' | 'local'>('local');
  const [type, setType] = useState<'clans' | 'players'>('clans');

  const locId = LOCATIONS[location].id;
  
  // Fetch Ranking Data
  const { data: rankingData, loading } = useClashData<any>(
    `rank_${location}_${type}`, 
    `/locations/${locId}/rankings/${type}?limit=20`
  );

  const items = rankingData?.items || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6 min-h-[80vh]">
       
       {/* HEADER & CONTROLS */}
       <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
             <h1 className="text-3xl font-clash text-white uppercase tracking-wide">Leaderboards</h1>
             <p className="text-skin-muted text-sm">Top 20 Rankings</p>
          </div>

          <div className="flex bg-[#1f2937] p-1 rounded-lg border border-white/10">
             {/* Location Toggle */}
             <button onClick={() => setLocation('global')} className={`px-4 py-2 rounded-md text-xs font-bold uppercase flex items-center gap-2 ${location === 'global' ? 'bg-skin-primary text-black' : 'text-skin-muted hover:text-white'}`}>
                <Globe size={14}/> Global
             </button>
             <button onClick={() => setLocation('local')} className={`px-4 py-2 rounded-md text-xs font-bold uppercase flex items-center gap-2 ${location === 'local' ? 'bg-skin-primary text-black' : 'text-skin-muted hover:text-white'}`}>
                <MapPin size={14}/> {LOCATIONS.local.name}
             </button>
          </div>
       </div>

       {/* TYPE TABS */}
       <div className="flex border-b border-white/10">
          <button onClick={() => setType('clans')} className={`flex-1 pb-3 text-sm font-bold uppercase tracking-widest transition-colors ${type === 'clans' ? 'text-skin-secondary border-b-2 border-skin-secondary' : 'text-skin-muted hover:text-white'}`}>
             Clans
          </button>
          <button onClick={() => setType('players')} className={`flex-1 pb-3 text-sm font-bold uppercase tracking-widest transition-colors ${type === 'players' ? 'text-skin-secondary border-b-2 border-skin-secondary' : 'text-skin-muted hover:text-white'}`}>
             Players
          </button>
       </div>

       {/* TABLE */}
       <div className="bg-[#1f2937] rounded-xl border border-white/5 overflow-hidden">
          {loading ? <SkeletonLoader /> : (
             <div className="divide-y divide-white/5">
                {items.map((item: any, idx: number) => {
                   const isClan = type === 'clans';
                   const link = isClan ? `/clan/${encodeURIComponent(item.tag)}` : `/player/${encodeURIComponent(item.tag)}`;
                   
                   return (
                     <Link key={item.tag} href={link} className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors group">
                        {/* Rank */}
                        <div className={`w-8 h-8 flex items-center justify-center rounded font-clash text-lg ${idx < 3 ? 'bg-yellow-500 text-black' : 'text-skin-muted bg-black/20'}`}>
                           {item.rank}
                        </div>

                        {/* Icon */}
                        <div className="w-10 h-10 relative shrink-0">
                           <img 
                              src={isClan ? item.badgeUrls.small : item.league?.iconUrls?.small} 
                              className="w-full h-full object-contain" 
                              alt="" 
                              onError={(e) => { e.currentTarget.style.display='none'}}
                           />
                        </div>

                        {/* Name */}
                        <div className="flex-1 min-w-0">
                           <div className="font-bold text-white truncate group-hover:text-skin-primary transition-colors">{item.name}</div>
                           <div className="text-[10px] text-skin-muted font-mono">{item.tag}</div>
                        </div>

                        {/* Stats */}
                        <div className="text-right">
                           <div className="text-white font-clash flex items-center justify-end gap-1">
                              <Trophy size={14} className="text-yellow-500"/> {isClan ? item.clanPoints : item.trophies}
                           </div>
                           {isClan && <div className="text-[10px] text-skin-muted">{item.members} members</div>}
                           {!isClan && item.clan && <div className="text-[10px] text-skin-muted flex items-center justify-end gap-1"><Shield size={10}/> {item.clan.name}</div>}
                        </div>
                     </Link>
                   )
                })}
             </div>
          )}
       </div>
    </div>
  );
}
