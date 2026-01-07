'use client';

import { useClashData } from "@/hooks/useClashData";
import { ArrowLeft, Search, Sword, Trophy, Shield } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Minimal Player Data for Comparison
interface PlayerData {
  tag: string;
  name: string;
  townHallLevel: number;
  expLevel: number;
  trophies: number;
  warStars: number;
  heroes: { name: string; level: number }[];
  clan?: { name: string };
}

export default function ComparePage() {
  const [tag1, setTag1] = useState("");
  const [tag2, setTag2] = useState("");
  const [searchTrigger1, setSearchTrigger1] = useState("");
  const [searchTrigger2, setSearchTrigger2] = useState("");

  const { data: p1, loading: l1 } = useClashData<PlayerData>(`compare_${searchTrigger1}`, `/players/${searchTrigger1}`);
  const { data: p2, loading: l2 } = useClashData<PlayerData>(`compare_${searchTrigger2}`, `/players/${searchTrigger2}`);

  const handleSearch = () => {
    if (tag1) setSearchTrigger1(tag1.trim().replace('#', ''));
    if (tag2) setSearchTrigger2(tag2.trim().replace('#', ''));
  };

  const getHeroLevel = (player: PlayerData | null, heroName: string) => {
    return player?.heroes.find(h => h.name === heroName)?.level || 0;
  };

  // Compare Visual
  const StatBar = ({ label, v1, v2, icon }: { label: string, v1: number, v2: number, icon: any }) => {
    const total = v1 + v2 || 1;
    const p1Perc = (v1 / total) * 100;
    const winner = v1 > v2 ? 1 : v2 > v1 ? 2 : 0;

    return (
      <div className="mb-4">
        <div className="flex justify-between text-xs font-bold uppercase mb-1">
          <span className={winner === 1 ? 'text-green-400' : 'text-skin-muted'}>{v1}</span>
          <span className="flex items-center gap-1 text-skin-text">{icon} {label}</span>
          <span className={winner === 2 ? 'text-green-400' : 'text-skin-muted'}>{v2}</span>
        </div>
        <div className="h-2 bg-skin-bg rounded-full flex overflow-hidden">
          <div style={{ width: `${p1Perc}%` }} className={`h-full ${winner === 1 ? 'bg-green-500' : 'bg-skin-primary'}`}></div>
          <div className="h-full w-0.5 bg-black"></div>
          <div className="flex-1 h-full bg-skin-secondary opacity-50"></div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center gap-2 mb-4">
         <Link href="/" className="text-skin-muted hover:text-skin-primary"><ArrowLeft /></Link>
         <h1 className="text-2xl font-clash text-skin-text uppercase">Compare Players</h1>
      </div>

      {/* INPUTS */}
      <div className="grid grid-cols-2 gap-4">
         <input type="text" placeholder="#Tag 1" value={tag1} onChange={e => setTag1(e.target.value)} className="bg-skin-bg p-3 rounded-lg border border-skin-primary/30 text-center font-bold uppercase text-skin-text"/>
         <input type="text" placeholder="#Tag 2" value={tag2} onChange={e => setTag2(e.target.value)} className="bg-skin-bg p-3 rounded-lg border border-skin-primary/30 text-center font-bold uppercase text-skin-text"/>
      </div>
      <button onClick={handleSearch} className="w-full bg-skin-primary text-black font-clash py-3 rounded-xl uppercase text-xl hover:bg-skin-secondary transition-colors">Fight!</button>

      {/* COMPARISON ARENA */}
      <div className="grid grid-cols-2 gap-4 mt-8 relative">
         {/* VS Badge */}
         <div className="absolute left-1/2 top-10 -translate-x-1/2 bg-red-600 text-white font-black p-2 rounded-full border-4 border-skin-bg z-10 shadow-xl">VS</div>

         {/* Player 1 Card */}
         <div className={`p-4 rounded-xl border ${p1 ? 'bg-skin-surface border-skin-primary/20' : 'bg-skin-bg/50 border-dashed border-skin-muted/20'} min-h-[300px]`}>
            {l1 ? <div className="animate-pulse text-center pt-10">Loading...</div> : p1 ? (
              <div className="text-center">
                 <h2 className="text-xl font-clash truncate">{p1.name}</h2>
                 <p className="text-xs text-skin-muted">{p1.clan?.name || "No Clan"}</p>
                 <div className="mt-4 text-4xl font-black text-skin-primary">{p1.townHallLevel} <span className="text-xs font-normal text-skin-muted block">Town Hall</span></div>
              </div>
            ) : <div className="text-center pt-10 opacity-50">Player 1</div>}
         </div>

         {/* Player 2 Card */}
         <div className={`p-4 rounded-xl border ${p2 ? 'bg-skin-surface border-skin-secondary/20' : 'bg-skin-bg/50 border-dashed border-skin-muted/20'} min-h-[300px]`}>
            {l2 ? <div className="animate-pulse text-center pt-10">Loading...</div> : p2 ? (
              <div className="text-center">
                 <h2 className="text-xl font-clash truncate">{p2.name}</h2>
                 <p className="text-xs text-skin-muted">{p2.clan?.name || "No Clan"}</p>
                 <div className="mt-4 text-4xl font-black text-skin-secondary">{p2.townHallLevel} <span className="text-xs font-normal text-skin-muted block">Town Hall</span></div>
              </div>
            ) : <div className="text-center pt-10 opacity-50">Player 2</div>}
         </div>
      </div>

      {/* STAT BARS */}
      {p1 && p2 && (
        <div className="bg-skin-surface p-6 rounded-xl border border-skin-primary/10">
           <StatBar label="Trophies" v1={p1.trophies} v2={p2.trophies} icon={<Trophy size={14}/>} />
           <StatBar label="War Stars" v1={p1.warStars} v2={p2.warStars} icon={<Sword size={14}/>} />
           <StatBar label="King Lvl" v1={getHeroLevel(p1, 'Barbarian King')} v2={getHeroLevel(p2, 'Barbarian King')} icon={<Shield size={14}/>} />
           <StatBar label="Queen Lvl" v1={getHeroLevel(p1, 'Archer Queen')} v2={getHeroLevel(p2, 'Archer Queen')} icon={<Shield size={14}/>} />
        </div>
      )}
    </div>
  );
}
