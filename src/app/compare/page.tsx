 'use client';

import { useClashData } from "@/hooks/useClashData";
import { ArrowLeft, Search, Sword, Trophy, Shield, RefreshCw } from "lucide-react";
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

  // Hook handles data fetching
  const { data: p1, loading: l1 } = useClashData<PlayerData>(`compare_${searchTrigger1}`, searchTrigger1 ? `/players/${searchTrigger1}` : '');
  const { data: p2, loading: l2 } = useClashData<PlayerData>(`compare_${searchTrigger2}`, searchTrigger2 ? `/players/${searchTrigger2}` : '');

  const handleSearch = () => {
    // FIX: Clean the input AND add the encoded '#' (%23) back
    if (tag1) {
      const clean1 = tag1.trim().toUpperCase().replace(/#/g, '');
      setSearchTrigger1(`%23${clean1}`);
    }
    if (tag2) {
      const clean2 = tag2.trim().toUpperCase().replace(/#/g, '');
      setSearchTrigger2(`%23${clean2}`);
    }
  };

  const getHeroLevel = (player: PlayerData | null, heroName: string) => {
    return player?.heroes.find(h => h.name === heroName)?.level || 0;
  };

  // Compare Visual Component
  const StatBar = ({ label, v1, v2, icon }: { label: string, v1: number, v2: number, icon: any }) => {
    const total = v1 + v2 || 1;
    const p1Perc = (v1 / total) * 100;
    // Determine winner (1=Left, 2=Right, 0=Tie)
    const winner = v1 > v2 ? 1 : v2 > v1 ? 2 : 0;

    return (
      <div className="mb-4">
        <div className="flex justify-between text-xs font-bold uppercase mb-1">
          <span className={winner === 1 ? 'text-green-400' : 'text-skin-muted'}>{v1}</span>
          <span className="flex items-center gap-1 text-skin-text">{icon} {label}</span>
          <span className={winner === 2 ? 'text-green-400' : 'text-skin-muted'}>{v2}</span>
        </div>
        <div className="h-2 bg-skin-bg rounded-full flex overflow-hidden">
          <div style={{ width: `${p1Perc}%` }} className={`h-full transition-all duration-1000 ${winner === 1 ? 'bg-green-500' : 'bg-skin-primary'}`}></div>
          <div className="h-full w-0.5 bg-black"></div>
          <div className="flex-1 h-full bg-skin-secondary opacity-50 transition-all duration-1000"></div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-2 mb-4">
         <Link href="/" className="text-skin-muted hover:text-skin-primary flex items-center gap-1 text-sm font-bold"><ArrowLeft size={16}/> Back</Link>
         <h1 className="text-2xl font-clash text-skin-text uppercase ml-auto">Compare Players</h1>
      </div>

      {/* INPUTS */}
      <div className="grid grid-cols-2 gap-4">
         <input 
            type="text" 
            placeholder="#TAG 1" 
            value={tag1} 
            onChange={e => setTag1(e.target.value)} 
            className="bg-skin-bg p-3 rounded-lg border border-skin-primary/30 text-center font-bold uppercase text-skin-text focus:border-skin-primary outline-none"
         />
         <input 
            type="text" 
            placeholder="#TAG 2" 
            value={tag2} 
            onChange={e => setTag2(e.target.value)} 
            className="bg-skin-bg p-3 rounded-lg border border-skin-primary/30 text-center font-bold uppercase text-skin-text focus:border-skin-primary outline-none"
         />
      </div>
      <button 
        onClick={handleSearch} 
        className="w-full bg-skin-primary text-black font-clash py-3 rounded-xl uppercase text-xl hover:bg-skin-secondary transition-colors shadow-lg active:scale-95 duration-200"
      >
        Fight!
      </button>

      {/* COMPARISON ARENA */}
      <div className="grid grid-cols-2 gap-4 mt-8 relative">
         {/* VS Badge */}
         <div className="absolute left-1/2 top-10 -translate-x-1/2 bg-red-600 text-white font-black p-2 rounded-full border-4 border-skin-bg z-10 shadow-xl animate-bounce">
            VS
         </div>

         {/* Player 1 Card */}
         <div className={`p-4 rounded-xl border transition-colors ${p1 ? 'bg-skin-surface border-skin-primary/20' : 'bg-skin-bg/50 border-dashed border-skin-muted/20'} min-h-[300px] flex flex-col justify-center`}>
            {l1 ? (
               <div className="flex flex-col items-center gap-2 text-skin-muted">
                  <RefreshCw className="animate-spin" /> 
                  <span className="text-xs uppercase font-bold">Loading...</span>
               </div>
            ) : p1 ? (
              <div className="text-center animate-in zoom-in duration-300">
                 <h2 className="text-xl font-clash truncate text-skin-text">{p1.name}</h2>
                 <p className="text-xs text-skin-muted font-bold">{p1.clan?.name || "No Clan"}</p>
                 <div className="mt-6 mb-6">
                    <div className="text-5xl font-black text-skin-primary drop-shadow-md">{p1.townHallLevel}</div>
                    <span className="text-xs font-bold text-skin-muted uppercase tracking-widest">Town Hall</span>
                 </div>
              </div>
            ) : <div className="text-center opacity-30 font-clash text-2xl uppercase">Player 1</div>}
         </div>

         {/* Player 2 Card */}
         <div className={`p-4 rounded-xl border transition-colors ${p2 ? 'bg-skin-surface border-skin-secondary/20' : 'bg-skin-bg/50 border-dashed border-skin-muted/20'} min-h-[300px] flex flex-col justify-center`}>
            {l2 ? (
               <div className="flex flex-col items-center gap-2 text-skin-muted">
                  <RefreshCw className="animate-spin" /> 
                  <span className="text-xs uppercase font-bold">Loading...</span>
               </div>
            ) : p2 ? (
              <div className="text-center animate-in zoom-in duration-300">
                 <h2 className="text-xl font-clash truncate text-skin-text">{p2.name}</h2>
                 <p className="text-xs text-skin-muted font-bold">{p2.clan?.name || "No Clan"}</p>
                 <div className="mt-6 mb-6">
                    <div className="text-5xl font-black text-skin-secondary drop-shadow-md">{p2.townHallLevel}</div>
                    <span className="text-xs font-bold text-skin-muted uppercase tracking-widest">Town Hall</span>
                 </div>
              </div>
            ) : <div className="text-center opacity-30 font-clash text-2xl uppercase">Player 2</div>}
         </div>
      </div>

      {/* STAT BARS (Only show if both loaded) */}
      {p1 && p2 && (
        <div className="bg-skin-surface p-6 rounded-xl border border-skin-primary/10 animate-in slide-in-from-bottom-10 duration-700">
           <StatBar label="Trophies" v1={p1.trophies} v2={p2.trophies} icon={<Trophy size={14}/>} />
           <StatBar label="War Stars" v1={p1.warStars} v2={p2.warStars} icon={<Sword size={14}/>} />
           <StatBar label="King Level" v1={getHeroLevel(p1, 'Barbarian King')} v2={getHeroLevel(p2, 'Barbarian King')} icon={<Shield size={14}/>} />
           <StatBar label="Queen Level" v1={getHeroLevel(p1, 'Archer Queen')} v2={getHeroLevel(p2, 'Archer Queen')} icon={<Shield size={14}/>} />
           <StatBar label="Warden Level" v1={getHeroLevel(p1, 'Grand Warden')} v2={getHeroLevel(p2, 'Grand Warden')} icon={<Shield size={14}/>} />
        </div>
      )}
    </div>
  );
}
