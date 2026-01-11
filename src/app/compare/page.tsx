'use client';

import { useState } from "react";
import { useClashData } from "@/hooks/useClashData";
import { Trophy, Sword, Shield, Crown } from "lucide-react";

// Local Components
import { PlayerData, WinnerData } from "./_components/types";
import CompareHeader from "./_components/CompareHeader";
import CompareInputs from "./_components/CompareInputs";
import PlayerCard from "./_components/PlayerCard";
import WinnerBanner from "./_components/WinnerBanner";
import StatBar from "./_components/StatBar";
import HeroDuelCard from "./_components/HeroDuelCard";
import BattleLoader from "./_components/BattleLoader";

export default function ComparePage() {
  const [tag1, setTag1] = useState("");
  const [tag2, setTag2] = useState("");
  const [searchTrigger1, setSearchTrigger1] = useState("");
  const [searchTrigger2, setSearchTrigger2] = useState("");
  
  const { data: p1, loading: l1 } = useClashData < PlayerData > (
    `compare_${searchTrigger1}`,
    searchTrigger1 ? `/players/${searchTrigger1}` : ''
  );
  
  const { data: p2, loading: l2 } = useClashData < PlayerData > (
    `compare_${searchTrigger2}`,
    searchTrigger2 ? `/players/${searchTrigger2}` : ''
  );
  
  const handleSearch = () => {
    if (tag1.length > 3) setSearchTrigger1(tag1.trim().toUpperCase());
    if (tag2.length > 3) setSearchTrigger2(tag2.trim().toUpperCase());
  };
  
  const getHeroLevel = (player: PlayerData | null, heroName: string) => {
    return player?.heroes.find(h => h.name === heroName)?.level || 0;
  };
  
  const calculateWinner = (): WinnerData | null => {
    if (!p1 || !p2) return null;
    let s1 = 0,
      s2 = 0;
    
    // 1. Town Hall Weight (Significant Advantage)
    if (p1.townHallLevel > p2.townHallLevel) s1 += 5;
    else if (p2.townHallLevel > p1.townHallLevel) s2 += 5;
    
    // 2. Trophy Weight
    if (p1.trophies > p2.trophies) s1++;
    else if (p2.trophies > p1.trophies) s2++;
    
    // 3. War Stars Weight
    if (p1.warStars > p2.warStars) s1 += 2;
    else if (p2.warStars > p1.warStars) s2 += 2;
    
    // 4. Attack Wins
    if (p1.attackWins > p2.attackWins) s1++;
    else if (p2.attackWins > p1.attackWins) s2++;
    
    // 5. Hero Levels (Individual comparison)
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
  const isBattling = l1 || l2;
  
  return (
    <div className="space-y-8 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <CompareHeader />
      
      <CompareInputs 
        tag1={tag1} setTag1={setTag1} 
        tag2={tag2} setTag2={setTag2} 
        onFight={handleSearch} 
      />

      {/* THE ARENA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 relative min-h-[400px]">
         
         {/* Center Badge / Battle Loader */}
         <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none w-full flex justify-center">
            {isBattling ? (
               <BattleLoader />
            ) : (
               <div className="bg-red-600 text-white font-black p-4 rounded-full border-[6px] border-[#0d1218] shadow-2xl text-xl animate-in zoom-in duration-300">
                  VS
               </div>
            )}
         </div>

         <PlayerCard player={p1} loading={l1} label="Player 1" colorClass="bg-skin-primary" borderColor="border-skin-primary/50" />
         <PlayerCard player={p2} loading={l2} label="Player 2" colorClass="bg-skin-secondary" borderColor="border-skin-secondary/50" />
      </div>

      {/* RESULTS SECTION */}
      {p1 && p2 && (
        <div className="space-y-8 animate-in slide-in-from-bottom-10 duration-700">
           
           {winner && winner.tag && (
              <WinnerBanner winner={winner} isPlayer1={winner.tag === p1.tag} />
           )}

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               
               {/* Left Column: Metrics */}
               <div className="bg-skin-surface p-6 rounded-xl border border-white/5 space-y-6">
                   <h3 className="font-clash text-lg text-white flex items-center gap-2 border-b border-white/5 pb-2">
                       <Sword size={18} className="text-red-400"/> Combat Metrics
                   </h3>
                   <div className="space-y-1">
                       <StatBar label="Trophies" v1={p1.trophies} v2={p2.trophies} icon={<Trophy size={14}/>} imageUrl="/assets/icons/trophy_icon.png" />
                       <StatBar label="War Stars" v1={p1.warStars} v2={p2.warStars} icon={<Sword size={14}/>} imageUrl="/assets/icons/star_icon.png" />
                       <StatBar label="Attacks Won" v1={p1.attackWins} v2={p2.attackWins} icon={<Sword size={14}/>} />
                       <StatBar label="Defenses Won" v1={p1.defenseWins} v2={p2.defenseWins} icon={<Shield size={14}/>} />
                   </div>
               </div>

               {/* Right Column: Hero Duel */}
               <div className="bg-skin-surface p-6 rounded-xl border border-white/5 space-y-4">
                   <h3 className="font-clash text-lg text-white flex items-center gap-2 border-b border-white/5 pb-2">
                       <Crown size={18} className="text-[#ffd700]"/> Hero Duel
                   </h3>
                   <div className="grid grid-cols-2 gap-3">
                       <HeroDuelCard label="King" img="/assets/icons/barbarian_king.png" lvl1={getHeroLevel(p1, 'Barbarian King')} lvl2={getHeroLevel(p2, 'Barbarian King')} />
                       <HeroDuelCard label="Queen" img="/assets/icons/archer_queen.png" lvl1={getHeroLevel(p1, 'Archer Queen')} lvl2={getHeroLevel(p2, 'Archer Queen')} />
                       <HeroDuelCard label="Warden" img="/assets/icons/grand_warden.png" lvl1={getHeroLevel(p1, 'Grand Warden')} lvl2={getHeroLevel(p2, 'Grand Warden')} />
                       <HeroDuelCard label="Champion" img="/assets/icons/royal_champion.png" lvl1={getHeroLevel(p1, 'Royal Champion')} lvl2={getHeroLevel(p2, 'Royal Champion')} />
                   </div>
               </div>

           </div>
        </div>
      )}
    </div>
  );
}