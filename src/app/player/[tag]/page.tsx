'use client';

import { useClashData } from "@/hooks/useClashData";
import { getCategoryIcon, getUnitCategory, getUnitIconPath, UNIT_CATEGORIES } from "@/lib/unitHelpers";
import { ArrowLeft, RefreshCw, Shield, Sword, Home, Zap, Clock, Castle, Trophy } from "lucide-react";
import Link from "next/link";
import Loading from "@/app/loading";

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
  clan?: { tag: string; name: string; badgeUrls: { small: string } };
  leagueTier?: { name: string; iconUrls: { small: string } };
  troops: Unit[];
  heroes: Unit[];
  spells: Unit[];
}

export default function PlayerPage({ params }: { params: { tag: string } }) {
  const tag = decodeURIComponent(params.tag);
  
  const { 
    data: player, 
    loading, 
    isCached, 
    refresh 
  } = useClashData<PlayerData>(`player_${tag}`, `/players/${tag}`);

  if (loading) return <Loading />;
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

  // --- RECTANGULAR UNIT CARD ---
  const UnitCard = ({ unit, type }: { unit: Unit, type: string }) => {
    const iconPath = getUnitIconPath(unit.name);
    const isMax = unit.level === unit.maxLevel;
    
    return (
      <div className={`
        relative flex items-center gap-3 p-2 rounded-lg border transition-all overflow-hidden group
        ${isMax 
          ? 'bg-gradient-to-r from-skin-primary/10 to-transparent border-skin-primary shadow-[0_0_15px_-5px_var(--color-primary)]' 
          : 'bg-skin-surface border-skin-primary/10 hover:border-skin-primary/30'}
      `}>
         {/* MAX GLOW EFFECT */}
         {isMax && <div className="absolute inset-0 bg-skin-primary/5 animate-pulse pointer-events-none"></div>}

         {/* IMAGE */}
         <div className="w-12 h-12 relative shrink-0">
            <img 
              src={iconPath} 
              onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden'); }}
              alt={unit.name}
              className={`object-contain w-full h-full drop-shadow-md transition-transform group-hover:scale-110 ${isMax ? 'brightness-110' : ''}`}
            />
            {/* Fallback Icon */}
            <div className="hidden absolute top-0 left-0 w-full h-full flex items-center justify-center text-skin-muted opacity-30">
               <Shield size={24} />
            </div>
            {/* Mini Max Badge */}
            {isMax && (
              <div className="absolute -bottom-1 -right-1 bg-skin-primary text-black text-[8px] font-black px-1 py-0.5 rounded shadow-sm border border-white/20 z-10">
                MAX
              </div>
            )}
         </div>
         
         {/* TEXT INFO */}
         <div className="flex-1 min-w-0 flex flex-col justify-center">
            <h4 className="text-xs md:text-sm font-bold text-skin-text truncate leading-tight group-hover:text-skin-primary transition-colors">
              {unit.name}
            </h4>
            <div className="flex items-center gap-2 mt-0.5">
               <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${isMax ? 'bg-skin-primary text-black font-bold' : 'bg-black/30 text-skin-muted'}`}>
                 Lvl {unit.level}
               </span>
            </div>
         </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
            {player.clan ? (
              <Link href={`/clan/${encodeURIComponent(player.clan.tag)}`} className="flex items-center gap-1 text-skin-muted hover:text-skin-primary transition-colors text-xs font-bold uppercase tracking-wider">
                <ArrowLeft size={14} /> Back to Clan
              </Link>
            ) : <Link href="/" className="text-skin-muted text-xs"><ArrowLeft size={14}/> Home</Link>}

            <button onClick={() => refresh()} className="flex items-center gap-2 bg-skin-surface border border-skin-primary/30 px-3 py-1.5 rounded-full hover:bg-skin-primary hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest">
              <RefreshCw size={10} className={loading ? "animate-spin" : ""}/> Update
            </button>
        </div>

        {/* PLAYER BANNER */}
        <div className="bg-skin-surface border border-skin-primary/20 rounded-2xl p-4 relative overflow-hidden shadow-2xl">
          {/* Background FX */}
          <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-skin-primary/10 to-transparent"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-4 text-center md:text-left">
             
             {/* TOWN HALL ICON (Replacing League) */}
             <div className="w-20 h-20 md:w-24 md:h-24 bg-skin-bg rounded-xl border-2 border-skin-primary/30 flex items-center justify-center relative shadow-inner shrink-0">
                {/* Try to load specific TH image if you have them, else fallback */}
                <img 
                   src={`/assets/icons/town_hall_${player.townHallLevel}.png`} 
                   onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden'); }}
                   alt={`TH ${player.townHallLevel}`}
                   className="w-full h-full object-contain p-1 drop-shadow-xl"
                />
                <div className="hidden flex flex-col items-center justify-center text-skin-muted">
                   <Castle size={32} />
                   <span className="text-xs font-black mt-1">TH {player.townHallLevel}</span>
                </div>
                <div className="absolute -bottom-2 bg-skin-primary text-black text-xs font-black px-2 py-0.5 rounded border border-white/20">
                  {player.townHallLevel}
                </div>
             </div>

             <div className="flex-1 min-w-0">
                <h1 className="text-3xl md:text-5xl font-clash text-skin-text uppercase tracking-wide drop-shadow-sm truncate">
                  {player.name}
                </h1>
                <p className="text-skin-muted font-mono text-xs md:text-sm opacity-80">{player.tag}</p>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-3">
                   <span className="bg-black/20 text-skin-text text-[10px] font-bold uppercase px-2 py-1 rounded border border-white/5">
                     {player.role}
                   </span>
                   <span className="bg-black/20 text-skin-secondary text-[10px] font-bold uppercase px-2 py-1 rounded border border-white/5">
                     Lvl {player.expLevel}
                   </span>
                </div>
             </div>

             {/* STATS GRID with LEAGUE ICON moved here */}
             <div className="grid grid-cols-2 gap-2 w-full md:w-auto">
                <div className="bg-skin-bg/50 p-2 rounded-lg border border-skin-primary/10 flex items-center gap-2">
                   {player.leagueTier ? (
                     <img src={player.leagueTier.iconUrls.small} className="w-8 h-8" alt="League" />
                   ) : <Trophy size={24} className="text-skin-muted"/>}
                   <div className="text-left">
                      <div className="text-[10px] uppercase text-skin-muted font-bold">Trophies</div>
                      <div className="text-sm font-clash text-white">{player.trophies}</div>
                   </div>
                </div>
                <div className="bg-skin-bg/50 p-2 rounded-lg border border-skin-primary/10 text-left pl-3">
                   <div className="text-[10px] uppercase text-skin-muted font-bold">War Stars</div>
                   <div className="text-sm font-clash text-orange-500">{player.warStars}</div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* --- UNIT SECTIONS (New Grid Layout) --- */}
      
      {/* HEROES */}
      <section>
        <h3 className="text-lg font-clash text-skin-text mb-3 flex items-center gap-2 uppercase tracking-wide border-b border-skin-muted/10 pb-2">
           <Shield size={18} className="text-skin-primary"/> Heroes & Pets
        </h3>
        {/* Changed grid to responsive columns for rectangular cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
           {homeHeroes.map(h => <UnitCard key={h.name} unit={h} type="Hero" />)}
           {pets.map(p => <UnitCard key={p.name} unit={p} type="Pet" />)}
        </div>
      </section>

      {/* TROOPS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <section>
            <h3 className="text-lg font-clash text-skin-text mb-3 flex items-center gap-2 uppercase tracking-wide border-b border-skin-muted/10 pb-2">
               <Sword size={18} className="text-pink-400"/> Elixir Troops
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
               {elixirTroops.map(t => <UnitCard key={t.name} unit={t} type="Elixir Troop" />)}
            </div>
         </section>
         
         <section>
            <h3 className="text-lg font-clash text-skin-text mb-3 flex items-center gap-2 uppercase tracking-wide border-b border-skin-muted/10 pb-2">
               <Zap size={18} className="text-indigo-400"/> Dark Troops
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
               {darkTroops.map(t => <UnitCard key={t.name} unit={t} type="Dark Troop" />)}
            </div>
         </section>
      </div>

      {/* SPELLS & SIEGES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <section>
            <h3 className="text-lg font-clash text-skin-text mb-3 flex items-center gap-2 uppercase tracking-wide border-b border-skin-muted/10 pb-2">
               <Clock size={18} className="text-blue-400"/> Spells
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
               {elixirSpells.map(s => <UnitCard key={s.name} unit={s} type="Elixir Spell" />)}
               {darkSpells.map(s => <UnitCard key={s.name} unit={s} type="Dark Spell" />)}
            </div>
         </section>

         {siegeMachines.length > 0 && (
           <section>
              <h3 className="text-lg font-clash text-skin-text mb-3 flex items-center gap-2 uppercase tracking-wide border-b border-skin-muted/10 pb-2">
                 <Home size={18} className="text-yellow-600"/> Sieges
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                 {siegeMachines.map(s => <UnitCard key={s.name} unit={s} type="Siege Machine" />)}
              </div>
           </section>
         )}
      </div>
    </div>
  );
}

