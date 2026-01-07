 'use client';

import { useClashData } from "@/hooks/useClashData";
import { getUnitIconPath, UNIT_CATEGORIES, getUnitCategory } from "@/lib/unitHelpers";
import { timeAgo, saveToHistory, toggleFavorite, isFavorite } from "@/lib/utils";
import { ArrowLeft, RefreshCw, Shield, Sword, Home, Zap, Clock, Castle, Trophy, ChevronRight, Star, Share2 } from "lucide-react"; // Added Share2
import Link from "next/link";
import { useEffect, useState } from "react";
import SkeletonLoader from "@/components/SkeletonLoader";
import TiltWrapper from "@/components/TiltWrapper";
import React from "react";
import ShareProfileModal from "@/components/ShareProfileModal"; // <--- IMPORT

// --- Interfaces (Keep existing) ---
interface Unit {
  name: string;
  level: number;
  maxLevel: number;
  village: 'home' | 'builderBase';
}
interface PlayerData {
  tag: string;
  name: string;
  townHallLevel: number;
  expLevel: number;
  trophies: number;
  bestTrophies: number;
  warStars: number;
  donations: number;
  donationsReceived: number;
  role: string;
  clan?: { tag: string; name: string; badgeUrls: { small: string; large: string; medium: string } };
  leagueTier?: { name: string; iconUrls: { small: string } };
  troops: Unit[];
  heroes: Unit[];
  spells: Unit[];
}

export default function PlayerPage({ params }: { params: { tag: string } }) {
  const tag = decodeURIComponent(params.tag);
  const [isFav, setIsFav] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false); // <--- NEW STATE
  
  const { data: player, loading, isCached, timestamp, refresh } = useClashData<PlayerData>(`player_${tag}`, `/players/${tag}`);

  useEffect(() => {
    if (player) {
      const icon = `/assets/icons/town_hall_${player.townHallLevel}.png`;
      saveToHistory(player.tag, player.name, 'player', icon);
      setIsFav(isFavorite(player.tag));
    }
  }, [player]);

  const handleFav = () => {
    if(!player) return;
    const icon = `/assets/icons/town_hall_${player.townHallLevel}.png`;
    const newState = toggleFavorite(player.tag, player.name, 'player', icon);
    setIsFav(newState);
  };

  if (loading) return <SkeletonLoader />;
  if (!player) return <div className="p-10 text-center font-clash text-xl text-skin-muted">Player not found.</div>;

  // Filters
  const homeHeroes = player.heroes.filter(h => h.village === 'home');
  const pets = player.troops.filter(t => UNIT_CATEGORIES.pets.includes(t.name));
  const allHomeTroops = player.troops.filter(t => t.village === 'home' && !UNIT_CATEGORIES.pets.includes(t.name));
  const elixirTroops = allHomeTroops.filter(t => getUnitCategory(t.name) === 'Elixir Troop');
  const darkTroops = allHomeTroops.filter(t => getUnitCategory(t.name) === 'Dark Troop');
  const siegeMachines = allHomeTroops.filter(t => getUnitCategory(t.name) === 'Siege Machine');
  const elixirSpells = player.spells.filter(s => getUnitCategory(s.name, true) === 'Elixir Spell');
  const darkSpells = player.spells.filter(s => getUnitCategory(s.name, true) === 'Dark Spell');

  // --- UNIT CARD COMPONENT ---
  const UnitCard = ({ unit, type }: { unit: Unit, type: string }) => {
    const iconPath = getUnitIconPath(unit.name);
    const isMax = unit.level === unit.maxLevel;
    const isSpecial = type === 'Hero' || type === 'Pet';
    const Wrapper = isSpecial ? TiltWrapper : React.Fragment;
    const wrapperProps = isSpecial ? { isMax } as any : {};

    const CardContentInner = (
      <>
         <div className="w-12 h-12 relative shrink-0 z-10">
            <img 
              src={iconPath} 
              onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden'); }} 
              alt={unit.name} 
              className={`object-contain w-full h-full drop-shadow-md transition-transform group-hover:scale-110 backface-hidden ${isMax ? 'brightness-110' : ''}`}
            />
            <div className="hidden absolute top-0 left-0 w-full h-full flex items-center justify-center text-skin-muted opacity-30"><Shield size={24} /></div>
            {isMax && <div className="absolute -bottom-1 -right-1 bg-skin-primary text-black text-[8px] font-black px-1 py-0.5 rounded shadow-sm border border-white/20 z-20">MAX</div>}
         </div>
         <div className="flex-1 min-w-0 flex flex-col justify-center z-10">
            <h4 className="text-xs md:text-sm font-bold text-skin-text truncate leading-tight group-hover:text-skin-primary transition-colors">{unit.name}</h4>
            <div className="flex items-center gap-2 mt-0.5"><span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${isMax ? 'bg-skin-primary text-black font-bold' : 'bg-black/30 text-skin-muted'}`}>Lvl {unit.level}</span></div>
         </div>
      </>
    );

    return (
      <Wrapper {...wrapperProps}>
        {isMax ? (
          <div className="relative h-full w-full rounded-lg overflow-hidden p-[3px] group transition-all hover:scale-[1.02]">
             <div className="absolute inset-[-50%] bg-[conic-gradient(transparent,var(--color-primary),transparent_30%)] animate-spin-slow blur-md md:blur-lg opacity-80 group-hover:opacity-100 transition-opacity"></div>
             <div className="absolute inset-[-50%] bg-[conic-gradient(transparent,var(--color-primary),transparent_10%)] animate-[spin_2s_linear_infinite_reverse] blur-md opacity-40 mix-blend-overlay animate-pulse-fast"></div>
             <div className="relative h-full w-full bg-skin-surface/90 backdrop-blur-sm rounded-lg p-2 flex items-center gap-3 z-10">
                {CardContentInner}
             </div>
          </div>
        ) : (
          <div className="relative flex items-center gap-3 p-2 rounded-lg border bg-skin-surface border-skin-primary/10 hover:border-skin-primary/30 transition-all overflow-hidden group h-full hover:scale-[1.02]">
             {CardContentInner}
          </div>
        )}
      </Wrapper>
    );
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
             <Link href="/" className="text-skin-muted text-xs flex items-center gap-1 hover:text-skin-primary"><ArrowLeft size={14}/> Home</Link>
             <div className="flex items-center gap-2">
               
               {/* SHARE BUTTON (NEW) */}
               <button onClick={() => setShowShareModal(true)} className="flex items-center justify-center w-8 h-8 rounded-full bg-skin-surface border border-skin-muted/30 text-skin-muted hover:text-skin-primary hover:border-skin-primary transition-all">
                  <Share2 size={14} />
               </button>

               <button onClick={handleFav} className={`flex items-center justify-center w-8 h-8 rounded-full border transition-all ${isFav ? 'bg-skin-primary border-skin-primary text-black shadow-[0_0_10px_var(--color-primary)]' : 'bg-skin-surface border-skin-muted/30 text-skin-muted hover:text-skin-primary'}`}>
                  <Star size={14} fill={isFav ? "currentColor" : "none"} />
               </button>

               <button onClick={() => refresh()} className="flex items-center gap-2 bg-skin-surface border border-skin-primary/30 px-3 py-1.5 rounded-full hover:bg-skin-primary hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest">
                 <RefreshCw size={10} className={loading ? "animate-spin" : ""}/> Update
               </button>
             </div>
        </div>

        {/* ... PLAYER BANNER (Same as previous) ... */}
        <div className="bg-skin-surface border border-skin-primary/20 rounded-2xl p-5 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-skin-bg via-transparent to-skin-primary/10"></div>
          <div className="relative z-10 flex flex-col md:flex-row gap-6">
             <div className="flex items-center gap-4 md:flex-col md:items-start md:gap-4 md:border-r border-skin-primary/10 md:pr-6">
                 <div className="w-20 h-20 bg-skin-bg rounded-xl border-2 border-skin-primary/30 flex items-center justify-center relative shadow-inner shrink-0">
                    <img src={`/assets/icons/town_hall_${player.townHallLevel}.png`} onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden'); }} alt={`TH ${player.townHallLevel}`} className="w-full h-full object-contain p-1 drop-shadow-xl"/>
                    <div className="absolute -bottom-2 bg-skin-primary text-black text-xs font-black px-2 py-0.5 rounded border border-white/20">{player.townHallLevel}</div>
                 </div>
                 <div className="flex-1 min-w-0 md:hidden">
                    <h1 className="text-2xl font-clash text-skin-text uppercase tracking-wide truncate">{player.name}</h1>
                    <p className="text-skin-muted font-mono text-xs opacity-80">{player.tag}</p>
                 </div>
             </div>
             <div className="flex-1 flex flex-col justify-center">
                <div className="hidden md:block mb-2">
                    <h1 className="text-4xl lg:text-5xl font-clash text-skin-text uppercase tracking-wide drop-shadow-sm">{player.name}</h1>
                    <p className="text-skin-muted font-mono text-sm opacity-80">{player.tag}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2 mb-4">
                   <span className="bg-skin-bg text-skin-text text-[10px] font-bold uppercase px-2 py-1 rounded border border-skin-primary/20">{player.role}</span>
                   <span className="bg-skin-bg text-skin-secondary text-[10px] font-bold uppercase px-2 py-1 rounded border border-skin-secondary/20">Lvl {player.expLevel}</span>
                   {player.clan && (
                     <Link href={`/clan/${encodeURIComponent(player.clan.tag)}`} className="flex items-center gap-2 bg-skin-bg border border-skin-muted/30 pl-1 pr-3 py-0.5 rounded-full hover:border-skin-primary hover:bg-skin-surface transition-all group">
                        <img src={player.clan.badgeUrls.small} className="w-5 h-5 object-contain" alt="" />
                        <span className="text-[10px] font-bold text-skin-muted group-hover:text-skin-primary uppercase tracking-wider">{player.clan.name}</span>
                        <ChevronRight size={10} className="text-skin-muted"/>
                     </Link>
                   )}
                </div>
                <div className="grid grid-cols-2 gap-3 max-w-sm">
                    <div className="bg-skin-bg/60 p-2 rounded-lg border border-skin-primary/10 flex items-center gap-3">
                        {player.leagueTier ? <img src={player.leagueTier.iconUrls.small} className="w-8 h-8 drop-shadow" alt="League" /> : <Trophy size={24} className="text-skin-muted"/>}
                        <div><div className="text-[10px] uppercase text-skin-muted font-bold leading-none mb-1">Trophies</div><div className="text-sm font-clash text-white leading-none">{player.trophies}</div></div>
                    </div>
                    <div className="bg-skin-bg/60 p-2 rounded-lg border border-skin-primary/10 flex items-center gap-3">
                        <div className="w-8 h-8 flex items-center justify-center"><Sword size={20} className="text-orange-500" /></div>
                        <div><div className="text-[10px] uppercase text-skin-muted font-bold leading-none mb-1">War Stars</div><div className="text-sm font-clash text-orange-500 leading-none">{player.warStars}</div></div>
                    </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* --- UNIT SECTIONS (Same as before) --- */}
      <section><h3 className="text-lg font-clash text-skin-text mb-3 flex items-center gap-2 uppercase tracking-wide border-b border-skin-muted/10 pb-2"><Shield size={18} className="text-skin-primary"/> Heroes & Pets</h3><div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">{homeHeroes.map(h => <UnitCard key={h.name} unit={h} type="Hero" />)}{pets.map(p => <UnitCard key={p.name} unit={p} type="Pet" />)}</div></section>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8"><section><h3 className="text-lg font-clash text-skin-text mb-3 flex items-center gap-2 uppercase tracking-wide border-b border-skin-muted/10 pb-2"><Sword size={18} className="text-pink-400"/> Elixir Troops</h3><div className="grid grid-cols-2 md:grid-cols-3 gap-2">{elixirTroops.map(t => <UnitCard key={t.name} unit={t} type="Elixir Troop" />)}</div></section><section><h3 className="text-lg font-clash text-skin-text mb-3 flex items-center gap-2 uppercase tracking-wide border-b border-skin-muted/10 pb-2"><Zap size={18} className="text-indigo-400"/> Dark Troops</h3><div className="grid grid-cols-2 md:grid-cols-3 gap-2">{darkTroops.map(t => <UnitCard key={t.name} unit={t} type="Dark Troop" />)}</div></section></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8"><section><h3 className="text-lg font-clash text-skin-text mb-3 flex items-center gap-2 uppercase tracking-wide border-b border-skin-muted/10 pb-2"><Clock size={18} className="text-blue-400"/> Spells</h3><div className="grid grid-cols-2 md:grid-cols-3 gap-2">{elixirSpells.map(s => <UnitCard key={s.name} unit={s} type="Elixir Spell" />)}{darkSpells.map(s => <UnitCard key={s.name} unit={s} type="Dark Spell" />)}</div></section>{siegeMachines.length > 0 && (<section><h3 className="text-lg font-clash text-skin-text mb-3 flex items-center gap-2 uppercase tracking-wide border-b border-skin-muted/10 pb-2"><Home size={18} className="text-yellow-600"/> Sieges</h3><div className="grid grid-cols-2 md:grid-cols-3 gap-2">{siegeMachines.map(s => <UnitCard key={s.name} unit={s} type="Siege Machine" />)}</div></section>)}</div>

      {/* --- SHARE MODAL --- */}
      {showShareModal && <ShareProfileModal player={player} onClose={() => setShowShareModal(false)} />}
    </div>
  );
}
