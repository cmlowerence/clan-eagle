'use client';

import { useClashData } from "@/hooks/useClashData";
import { getUnitIconPath, UNIT_CATEGORIES, getUnitCategory } from "@/lib/unitHelpers";
import { timeAgo, saveToHistory, toggleFavorite, isFavorite } from "@/lib/utils";
import { ArrowLeft, RefreshCw, Shield, Sword, Home, Zap, Clock, Star, Share2, ShieldPlus, Inbox, Hammer, Map, Crown, Medal, Trophy } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import SkeletonLoader from "@/components/SkeletonLoader";
import TiltWrapper from "@/components/TiltWrapper";
import React from "react";
import ShareProfileModal from "@/components/ShareProfileModal";

// --- Interfaces ---
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
  townHallWeaponLevel?: number;
  builderHallLevel?: number;
  expLevel: number;
  trophies: number;
  bestTrophies: number;
  versusTrophies?: number; // Builder Base Trophies
  bestVersusTrophies?: number;
  warStars: number;
  donations: number;
  donationsReceived: number;
  role: string;
  clan?: { tag: string; name: string; badgeUrls: { small: string; large: string; medium: string }; clanLevel: number };
  leagueTier?: { name: string; iconUrls: { small: string; medium: string } };
  labels: { name: string; iconUrls: { small: string } }[]; // Player Labels
  legendStatistics?: { // Legend League Data
     legendTrophies: number;
     bestSeason: { id: string; rank: number; trophies: number };
     currentSeason: { rank: number; trophies: number };
  };
  troops: Unit[];
  heroes: Unit[];
  spells: Unit[];
}

export default function PlayerPage({ params }: { params: { tag: string } }) {
  const tag = decodeURIComponent(params.tag);
  const [isFav, setIsFav] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [activeVillage, setActiveVillage] = useState<'home' | 'builder'>('home');
  
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

  // --- DATA SORTING ---
  const homeHeroes = player.heroes.filter(h => h.village === 'home');
  const pets = player.troops.filter(t => UNIT_CATEGORIES.pets.includes(t.name));
  const allHomeTroops = player.troops.filter(t => t.village === 'home' && !UNIT_CATEGORIES.pets.includes(t.name));
  const elixirTroops = allHomeTroops.filter(t => getUnitCategory(t.name) === 'Elixir Troop');
  const darkTroops = allHomeTroops.filter(t => getUnitCategory(t.name) === 'Dark Troop');
  const siegeMachines = allHomeTroops.filter(t => getUnitCategory(t.name) === 'Siege Machine');
  const spells = player.spells.filter(s => s.village === 'home');

  const builderHeroes = player.heroes.filter(h => h.village === 'builderBase');
  const builderTroops = player.troops.filter(t => t.village === 'builderBase');

  const SectionHeader = ({ title, iconName, FallbackIcon, color }: any) => (
    <h3 className="text-sm font-bold text-skin-muted uppercase tracking-widest mb-3 flex items-center gap-2 border-b border-white/5 pb-2">
      <div className="w-6 h-6 relative flex items-center justify-center">
         <img 
            src={`/assets/icons/${iconName}`} 
            onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden'); }}
            alt="" 
            className="w-full h-full object-contain drop-shadow-md"
         />
         <FallbackIcon size={18} className={`hidden ${color}`}/>
      </div>
      {title}
    </h3>
  );

  const UnitCard = ({ unit, type }: { unit: Unit, type: string }) => {
    const iconPath = getUnitIconPath(unit.name);
    const isMax = unit.level === unit.maxLevel;
    const isSpecial = type === 'Hero' || type === 'Pet';
    const Wrapper = isSpecial ? TiltWrapper : React.Fragment;
    const wrapperProps = isSpecial ? { isMax } as any : {};

    return (
      <Wrapper {...wrapperProps}>
        <div className={`relative flex flex-col items-center p-2 rounded-lg border transition-all overflow-hidden group h-full aspect-[4/5] 
          ${isMax 
            ? 'bg-gradient-to-b from-[#2a3a4b] to-[#1a232e] border-skin-primary/40 shadow-[0_0_10px_-5px_var(--color-primary)]' 
            : 'bg-[#2a3a4b] border-white/5 hover:border-skin-primary/30'}`}
        >
           <div className="relative w-full flex-1 flex items-center justify-center p-1">
             {isMax && <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-primary)_0%,_transparent_70%)] opacity-20 blur-md"></div>}
             <img 
               src={iconPath} 
               onError={(e) => { e.currentTarget.style.display = 'none'; }} 
               alt={unit.name} 
               className={`w-full h-full object-contain drop-shadow-xl transition-transform group-hover:scale-110 ${isMax ? 'filter brightness-110' : ''}`}
             />
             {isMax && <div className="absolute top-0 right-0 bg-skin-primary text-black text-[8px] font-black px-1 rounded shadow-sm">MAX</div>}
           </div>
           <div className="w-full mt-1">
              <div className={`text-[10px] text-center font-bold py-0.5 rounded-sm border ${isMax ? 'bg-skin-primary text-black border-skin-primary' : 'bg-black/40 text-skin-muted border-white/5'}`}>
                 Lvl {unit.level}
              </div>
           </div>
        </div>
      </Wrapper>
    );
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-24">
      
      {/* --- TOP NAV --- */}
      <div className="flex justify-between items-center px-1">
           <Link href="/" className="text-skin-muted text-xs flex items-center gap-1 hover:text-skin-primary"><ArrowLeft size={14}/> Back</Link>
           <div className="flex items-center gap-2">
             {isCached && timestamp && (
                 <span className="text-[10px] text-skin-muted flex items-center gap-1"><Clock size={10}/> Data cached {timeAgo(timestamp)} ago</span>
             )}
           </div>
      </div>

      {/* --- MAIN PROFILE CARD --- */}
      <div className="bg-[#1f2937] border border-[#374151] rounded-xl overflow-hidden shadow-2xl relative">
        <div className="absolute inset-0 opacity-5 bg-[url('/assets/pattern.png')] pointer-events-none"></div>

        <div className="relative z-10 p-5 pb-0 flex flex-col gap-6">
            
            {/* ROW 1: Header */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 flex items-center justify-center">
                        <div className="absolute inset-0 bg-[#4299e1] rotate-45 rounded-sm shadow-lg border-2 border-white/20"></div>
                        <span className="relative z-10 font-clash text-white text-lg font-bold drop-shadow-md">{player.expLevel}</span>
                    </div>
                    <div>
                        <h1 className="text-2xl font-clash text-white leading-none tracking-wide">{player.name}</h1>
                        <p className="text-skin-muted text-xs font-mono">{player.tag}</p>
                        
                        {/* 1. UPGRADE: PLAYER LABELS */}
                        <div className="flex flex-wrap gap-1 mt-1.5">
                            <span className="text-[10px] bg-white/5 text-skin-muted px-2 py-0.5 rounded border border-white/5 font-bold uppercase">{player.role}</span>
                            {player.labels && player.labels.map((label, idx) => (
                                <div key={idx} className="flex items-center gap-1 bg-[#111827] px-2 py-0.5 rounded border border-white/10" title={label.name}>
                                    <img src={label.iconUrls.small} className="w-3 h-3" alt=""/>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button onClick={() => setShowShareModal(true)} className="w-8 h-8 rounded-lg bg-[#374151] hover:bg-[#4b5563] text-skin-muted flex items-center justify-center transition-colors"><Share2 size={16}/></button>
                    <button onClick={handleFav} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isFav ? 'bg-skin-primary text-black' : 'bg-[#374151] text-skin-muted'}`}><Star size={16} fill={isFav ? "currentColor" : "none"}/></button>
                    <button onClick={() => refresh()} className="w-8 h-8 rounded-lg bg-[#374151] hover:bg-[#4b5563] text-skin-muted flex items-center justify-center transition-colors"><RefreshCw size={16} className={loading ? 'animate-spin' : ''}/></button>
                </div>
            </div>

            {/* 2. UPGRADE: LEGEND STATISTICS (Conditional) */}
            {player.legendStatistics && (
                <div className="bg-gradient-to-r from-[#2e1a47] to-[#1f2937] rounded-lg p-3 border border-purple-500/30 flex justify-between items-center relative overflow-hidden group">
                     <div className="absolute -right-4 -top-4 text-purple-500/10 rotate-12 group-hover:rotate-0 transition-transform"><Medal size={64} /></div>
                     <div className="flex items-center gap-3 relative z-10">
                         <div className="bg-purple-500/20 p-2 rounded-full border border-purple-500/50"><Swords size={16} className="text-purple-300"/></div>
                         <div>
                             <div className="text-[10px] text-purple-300 font-bold uppercase">Legend Season</div>
                             <div className="text-white font-bold text-sm">Best: {player.legendStatistics.bestSeason.trophies} <span className="text-[10px] text-purple-400 font-normal">Rank {player.legendStatistics.bestSeason.rank}</span></div>
                         </div>
                     </div>
                     <div className="text-right relative z-10">
                         <div className="text-[10px] text-purple-300 font-bold uppercase">Current</div>
                         <div className="text-white font-bold">{player.legendStatistics.legendTrophies} <span className="text-[10px]">Trophies</span></div>
                     </div>
                </div>
            )}

            {/* ROW 3: The Triad (Context Aware) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#111827]/50 rounded-xl p-4 border border-white/5">
                
                {/* CLAN INFO */}
                {player.clan ? (
                    <Link href={`/clan/${encodeURIComponent(player.clan.tag)}`} className="md:col-start-2 md:row-start-1 flex flex-col items-center justify-center text-center group">
                        <div className="relative mb-2">
                             <img src={player.clan.badgeUrls.medium} className="w-16 h-16 drop-shadow-lg group-hover:scale-110 transition-transform" alt=""/>
                             <div className="absolute -bottom-2 -right-2 bg-black text-white text-[10px] font-bold px-1.5 py-0.5 rounded border border-white/20">Lvl {player.clan.clanLevel}</div>
                        </div>
                        <div className="text-sm font-clash text-white group-hover:text-skin-primary transition-colors">{player.clan.name}</div>
                        <div className="text-[10px] text-skin-muted">Clan Member</div>
                    </Link>
                ) : (
                    <div className="md:col-start-2 md:row-start-1 flex flex-col items-center justify-center text-center opacity-50">
                        <Shield size={48} className="text-skin-muted mb-2"/>
                        <div className="text-sm font-bold text-skin-muted">No Clan</div>
                    </div>
                )}

                {/* 3. UPGRADE: DYNAMIC STATS (Home vs Builder) */}
                <div className="md:col-start-1 md:row-start-1 flex items-center md:flex-col md:items-start gap-4 md:justify-center border-b md:border-b-0 md:border-r border-white/5 pb-4 md:pb-0">
                    <div className="relative w-14 h-14 md:w-16 md:h-16 shrink-0">
                        {/* Toggle Icon based on Village */}
                        <img 
                            src={activeVillage === 'home' ? `/assets/icons/town_hall_${player.townHallLevel}.png` : `/assets/icons/builder_hall_${player.builderHallLevel || 1}.png`} 
                            className="w-full h-full object-contain drop-shadow-md" 
                            onError={(e) => { if(activeVillage==='builder') e.currentTarget.src='/assets/icons/town_hall_1.png' }}
                            alt=""
                        />
                        {activeVillage === 'home' && player.townHallWeaponLevel && (
                            <div className="absolute bottom-0 right-0 flex">
                                {[...Array(player.townHallWeaponLevel)].map((_, i) => <Star key={i} size={8} className="text-orange-500 fill-orange-500" />)}
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="text-xs text-skin-muted uppercase font-bold">{activeVillage === 'home' ? 'Town Hall' : 'Builder Hall'}</div>
                        <div className="text-xl font-clash text-white">{activeVillage === 'home' ? player.townHallLevel : (player.builderHallLevel || 'N/A')}</div>
                    </div>
                </div>

                {/* 3. UPGRADE: DYNAMIC TROPHIES */}
                <div className="md:col-start-3 md:row-start-1 flex items-center md:flex-col md:items-end gap-4 md:justify-center border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 text-right">
                    <div className="flex-1 md:flex-none">
                        <div className="text-xs text-skin-muted uppercase font-bold">{activeVillage === 'home' ? 'Trophies' : 'Versus Trophies'}</div>
                        <div className="text-xl font-clash text-white flex items-center md:justify-end gap-2">
                             <Trophy size={16} className={activeVillage === 'home' ? "text-[#ffd700]" : "text-gray-400"}/> 
                             {activeVillage === 'home' ? player.trophies : (player.versusTrophies || 0)}
                        </div>
                        <div className="text-[10px] text-skin-muted">Best: {activeVillage === 'home' ? player.bestTrophies : (player.bestVersusTrophies || 0)}</div>
                    </div>
                    {/* Only show League badge for Home Village */}
                    {activeVillage === 'home' && player.leagueTier ? (
                         <img src={player.leagueTier.iconUrls.medium} className="w-14 h-14 md:w-16 md:h-16 object-contain drop-shadow-md" alt=""/>
                    ) : (
                        <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center"><Trophy className="text-skin-muted"/></div>
                    )}
                </div>

            </div>

            {/* Donation Bar */}
            <div className="bg-[#4c1d95] rounded-lg p-3 flex items-center justify-between text-white shadow-lg relative overflow-hidden mb-6">
                 <div className="absolute top-0 left-0 w-full h-1/2 bg-white/10 pointer-events-none"></div>
                 <div className="flex flex-col items-start relative z-10">
                    <span className="text-[10px] uppercase font-bold opacity-80 flex items-center gap-1"><ShieldPlus size={12}/> Troops Donated</span>
                    <span className="font-clash text-xl leading-none">{player.donations}</span>
                 </div>
                 <div className="h-8 w-px bg-white/20"></div>
                 <div className="flex flex-col items-end relative z-10">
                    <span className="text-[10px] uppercase font-bold opacity-80 flex items-center gap-1">Troops Received <Inbox size={12}/></span>
                    <span className="font-clash text-xl leading-none">{player.donationsReceived}</span>
                 </div>
            </div>
        </div>

        {/* --- VILLAGE TABS --- */}
        <div className="flex bg-[#111827]">
            <button 
                onClick={() => setActiveVillage('home')}
                className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${activeVillage === 'home' ? 'bg-[#374151] text-white border-t-2 border-skin-primary' : 'text-skin-muted hover:bg-[#1f2937]'}`}
            >
                <Home size={16} /> Home Village
            </button>
            <button 
                onClick={() => setActiveVillage('builder')}
                className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${activeVillage === 'builder' ? 'bg-[#374151] text-white border-t-2 border-skin-secondary' : 'text-skin-muted hover:bg-[#1f2937]'}`}
            >
                <Hammer size={16} /> Builder Base
            </button>
        </div>
      </div>

      {/* --- UNIT GRIDS --- */}
      {activeVillage === 'home' && (
        <div className="space-y-8">
            {(homeHeroes.length > 0 || pets.length > 0) && (
                <section>
                    <SectionHeader title="Heroes & Pets" iconName="hero_hall.png" FallbackIcon={Crown} color="text-skin-primary" />
                    <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                        {homeHeroes.map(h => <UnitCard key={h.name} unit={h} type="Hero" />)}
                        {pets.map(p => <UnitCard key={p.name} unit={p} type="Pet" />)}
                    </div>
                </section>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <section>
                    <SectionHeader title="Elixir Troops" iconName="elixir.png" FallbackIcon={Sword} color="text-pink-400" />
                    <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-4 gap-2">
                        {elixirTroops.map(t => <UnitCard key={t.name} unit={t} type="Troop" />)}
                    </div>
                </section>
                <section>
                    <SectionHeader title="Dark Troops" iconName="dark_elixir.png" FallbackIcon={Sword} color="text-indigo-400" />
                    <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-4 gap-2">
                        {darkTroops.map(t => <UnitCard key={t.name} unit={t} type="Troop" />)}
                    </div>
                </section>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <section>
                    <SectionHeader title="Spells" iconName="spell_factory.png" FallbackIcon={Zap} color="text-blue-400" />
                    <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-4 gap-2">
                        {spells.map(s => <UnitCard key={s.name} unit={s} type="Spell" />)}
                    </div>
                </section>
                {siegeMachines.length > 0 && (
                    <section>
                        <SectionHeader title="Siege Machines" iconName="siege_barracks.png" FallbackIcon={Home} color="text-yellow-600" />
                        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-4 gap-2">
                            {siegeMachines.map(s => <UnitCard key={s.name} unit={s} type="Siege" />)}
                        </div>
                    </section>
                )}
            </div>
        </div>
      )}

      {activeVillage === 'builder' && (
         <div className="space-y-8 min-h-[300px]">
             {builderHeroes.length > 0 && (
                <section>
                    <h3 className="text-sm font-bold text-skin-muted uppercase tracking-widest mb-3 flex items-center gap-2 border-b border-white/5 pb-2">
                        <Hammer size={18} className="text-skin-secondary"/> Builder Machines
                    </h3>
                    <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                        {builderHeroes.map(h => <UnitCard key={h.name} unit={h} type="Hero" />)}
                    </div>
                </section>
             )}
             {builderTroops.length > 0 && (
                <section>
                    <h3 className="text-sm font-bold text-skin-muted uppercase tracking-widest mb-3 flex items-center gap-2 border-b border-white/5 pb-2">
                        <Sword size={18} className="text-orange-400"/> Builder Troops
                    </h3>
                    <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                        {builderTroops.map(t => <UnitCard key={t.name} unit={t} type="Troop" />)}
                    </div>
                </section>
             )}
             {builderHeroes.length === 0 && builderTroops.length === 0 && (
                 <div className="text-center py-10 opacity-50">
                     <Map size={48} className="mx-auto mb-2 text-skin-muted"/>
                     <p className="text-skin-muted">No Builder Base data available.</p>
                 </div>
             )}
         </div>
      )}

      {showShareModal && <ShareProfileModal player={player} onClose={() => setShowShareModal(false)} />}
    </div>
  );
}
