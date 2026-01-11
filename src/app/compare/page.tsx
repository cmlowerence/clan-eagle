'use client';

import { useState } from "react";
import { useClashData } from "@/hooks/useClashData";
import { Trophy, Sword, Shield } from "lucide-react";

// Local Components
import { PlayerData, WinnerData } from "./_components/types";
import CompareHeader from "./_components/CompareHeader";
import CompareInputs from "./_components/CompareInputs";
import PlayerCard from "./_components/PlayerCard";
import WinnerBanner from "./_components/WinnerBanner";
import StatBar from "./_components/StatBar";

export default function ComparePage() {
  // --- STATE ---
  const [tag1, setTag1] = useState("");
  const [tag2, setTag2] = useState("");
  const [searchTrigger1, setSearchTrigger1] = useState("");
  const [searchTrigger2, setSearchTrigger2] = useState("");

  // --- DATA FETCHING ---
  // Note: We pass raw tags. The hook middleware handles encoding.
  const { data: p1, loading: l1 } = useClashData<PlayerData>(
    `compare_${searchTrigger1}`, 
    searchTrigger1 ? `/players/${searchTrigger1}` : ''
  );
  
  const { data: p2, loading: l2 } = useClashData<PlayerData>(
    `compare_${searchTrigger2}`, 
    searchTrigger2 ? `/players/${searchTrigger2}` : ''
  );

  // --- HANDLERS ---
  const handleSearch = () => {
    // Only set trigger if input is valid
    if (tag1.length > 3) setSearchTrigger1(tag1.trim().toUpperCase());
    if (tag2.length > 3) setSearchTrigger2(tag2.trim().toUpperCase());
  };

  // --- LOGIC HELPERS ---
  const getHeroLevel = (player: PlayerData | null, heroName: string) => {
    return player?.heroes.find(h => h.name === heroName)?.level || 0;
  };

  const calculateWinner = (): WinnerData | null => {
    if (!p1 || !p2) return null;
    let s1 = 0;
    let s2 = 0;

    // Weight: Town Hall (5 pts)
    if (p1.townHallLevel > p2.townHallLevel) s1 += 5;
    else if (p2.townHallLevel > p1.townHallLevel) s2 += 5;

    // Weight: Trophies (1 pt)
    if (p1.trophies > p2.trophies) s1++;
    else if (p2.trophies > p1.trophies) s2++;

    // Weight: War Stars (2 pts)
    if (p1.warStars > p2.warStars) s1 += 2;
    else if (p2.warStars > p1.warStars) s2 += 2;

    // Weight: Heroes (1 pt each)
    ['Barbarian King', 'Archer Queen', 'Grand Warden', 'Royal Champion'].forEach(h => {
        const h1 = getHeroLevel(p1, h);
        const h2 = getHeroLevel(p2, h);
        if (h1 > h2) s1++;
        else if (h2 > h1) s2++;
    });

    if (s1 > s2) return { name: p1.name, tag: p1.tag, score: s1 };
    if (s2 > s1) return { name: p2.name, tag: p2.tag, score: s2 };
    return { name: "Draw", tag: null, score: s1 };
  };

  const winner = calculateWinner();

  return (
    <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* 1. Header */}
      <CompareHeader />

      {/* 2. Inputs */}
      <CompareInputs 
        tag1={tag1} 
        setTag1={setTag1} 
        tag2={tag2} 
        setTag2={setTag2} 
        onFight={handleSearch} 
      />

      {/* 3. Visual Arena */}
      <div className="grid grid-cols-2 gap-4 mt-8 relative">
         {/* VS Badge */}
         <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="bg-red-600 text-white font-black p-3 rounded-full border-4 border-skin-bg shadow-2xl animate-bounce text-xl">
               VS
            </div>
         </div>

         {/* Player 1 Card */}
         <PlayerCard 
           player={p1} 
           loading={l1} 
           label="Player 1" 
           colorClass="bg-skin-primary"
           borderColor="border-skin-primary/50"
         />

         {/* Player 2 Card */}
         <PlayerCard 
           player={p2} 
           loading={l2} 
           label="Player 2" 
           colorClass="bg-skin-secondary"
           borderColor="border-skin-secondary/50"
         />
      </div>

      {/* 4. Stats & Results */}
      {p1 && p2 && (
        <div className="space-y-4 animate-in slide-in-from-bottom-10 duration-700">
           
           {/* Winner Banner */}
           {winner && winner.tag && (
              <WinnerBanner winner={winner} isPlayer1={winner.tag === p1.tag} />
           )}

           {/* Comparisons */}
           <div className="bg-skin-surface p-6 rounded-xl border border-skin-primary/10">
               <StatBar label="Trophies" v1={p1.trophies} v2={p2.trophies} icon={<Trophy size={14}/>} />
               <StatBar label="War Stars" v1={p1.warStars} v2={p2.warStars} icon={<Sword size={14}/>} />
               
               <StatBar label="King Lvl" v1={getHeroLevel(p1, 'Barbarian King')} v2={getHeroLevel(p2, 'Barbarian King')} icon={<Shield size={14}/>} />
               <StatBar label="Queen Lvl" v1={getHeroLevel(p1, 'Archer Queen')} v2={getHeroLevel(p2, 'Archer Queen')} icon={<Shield size={14}/>} />
               <StatBar label="Warden Lvl" v1={getHeroLevel(p1, 'Grand Warden')} v2={getHeroLevel(p2, 'Grand Warden')} icon={<Shield size={14}/>} />
               <StatBar label="Royal Champ" v1={getHeroLevel(p1, 'Royal Champion')} v2={getHeroLevel(p2, 'Royal Champion')} icon={<Shield size={14}/>} />
           </div>
        </div>
      )}
    </div>
  );
}
