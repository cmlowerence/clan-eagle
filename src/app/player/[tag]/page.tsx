'use client';

import { useClashData } from "@/hooks/useClashData";
import { getCategoryIcon, getUnitCategory, getUnitIconPath, UNIT_CATEGORIES } from "@/lib/unitHelpers";
import { ArrowLeft, RefreshCw, Clock, Shield, Sword, Home, Zap } from "lucide-react";
import Link from "next/link";
import Loading from "@/app/loading";

// --- Types ---
interface Unit {
  name: string;
  level: number;
  maxLevel: number;
  village: 'home' | 'builderBase';
  equipment?: { name: string; level: number }[]; // For Heroes
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
  heroEquipment?: { name: string; level: number }[];
}

export default function PlayerPage({ params }: { params: { tag: string } }) {
  const tag = decodeURIComponent(params.tag);
  
  const { 
    data: player, 
    loading, 
    isCached, 
    lastUpdated, 
    refresh 
  } = useClashData<PlayerData>(`player_${tag}`, `/players/${tag}`);

  if (loading) return <Loading />;
  if (!player) return <div className="p-10 text-center">Player not found.</div>;

  // --- Filtering & Categorization Logic ---
  const homeHeroes = player.heroes.filter(h => h.village === 'home');
  const pets = player.troops.filter(t => UNIT_CATEGORIES.pets.includes(t.name));
  
  // Filter Troops (Excluding Pets and Builder Base)
  const allHomeTroops = player.troops.filter(t => t.village === 'home' && !UNIT_CATEGORIES.pets.includes(t.name));
  
  const elixirTroops = allHomeTroops.filter(t => getUnitCategory(t.name) === 'Elixir Troop');
  const darkTroops = allHomeTroops.filter(t => getUnitCategory(t.name) === 'Dark Troop');
  const siegeMachines = allHomeTroops.filter(t => getUnitCategory(t.name) === 'Siege Machine');
  
  const elixirSpells = player.spells.filter(s => getUnitCategory(s.name, true) === 'Elixir Spell');
  const darkSpells = player.spells.filter(s => getUnitCategory(s.name, true) === 'Dark Spell');

  // --- Helper Component for Grid Items ---
  const UnitCard = ({ unit, type }: { unit: Unit, type: string }) => {
    const Icon = getCategoryIcon(type);
    const iconPath = getUnitIconPath(unit.name);
    
    return (
      <div className={`relative p-3 rounded-lg border transition-all group ${
        unit.level === unit.maxLevel 
          ? 'bg-skin-primary/10 border-skin-secondary/50 shadow-[0_0_10px_rgba(var(--color-secondary),0.1)]' 
          : 'bg-skin-bg border-skin-primary/10'
      }`}>
         <div className="flex justify-between items-start mb-2">
            {/* Image with fallback */}
            <div className="w-8 h-8 md:w-10 md:h-10 relative">
               <img 
                 src={iconPath} 
                 onError={(e) => {
                   e.currentTarget.style.display = 'none';
                   e.currentTarget.nextElementSibling?.classList.remove('hidden');
                 }}
                 alt={unit.name}
                 className="object-contain w-full h-full"
               />
               <div className="hidden absolute top-0 left-0 w-full h-full flex items-center justify-center text-skin-muted opacity-50">
                  <Icon size={24} />
               </div>
            </div>
            {unit.level === unit.maxLevel && <div className="text-[10px] font-bold text-yellow-500 border border-yellow-500/50 px-1 rounded">MAX</div>}
         </div>
         
         <div className="truncate text-xs md:text-sm font-bold text-skin-text" title={unit.name}>{unit.name}</div>
         <div className="text-[10px] text-skin-muted mt-1">Lvl <span className="text-skin-secondary">{unit.level}</span></div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-12">
      
      {/* 1. Header & Navigation */}
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-start">
            {player.clan ? (
              <Link href={`/clan/${encodeURIComponent(player.clan.tag)}`} className="flex items-center gap-2 text-skin-muted hover:text-skin-primary transition-colors text-sm">
                <ArrowLeft size={16} /> Back to {player.clan.name}
              </Link>
            ) : <Link href="/" className="text-skin-muted"><ArrowLeft/> Home</Link>}

            {/* Refresh Button */}
            <div className="flex flex-col items-end">
              <button onClick={() => refresh()} className="flex items-center gap-2 bg-skin-surface border border-skin-primary/30 px-3 py-1 rounded hover:bg-skin-primary hover:text-white transition-colors text-xs font-bold">
                <RefreshCw size={12} className={loading ? "animate-spin" : ""}/> {loading ? "Updating..." : "Refresh Stats"}
              </button>
              {isCached && <span className="text-[10px] text-skin-muted mt-1">Last: {lastUpdated}</span>}
            </div>
        </div>

        <div className="bg-skin-surface border-l-4 border-skin-secondary p-6 md:p-8 rounded-r-xl shadow-lg relative overflow-hidden">
          {/* Background Decoration */}
          <Shield className="absolute right-0 top-0 text-skin-primary opacity-5 rotate-12 w-64 h-64" />

          <div className="relative z-10 flex flex-col md:flex-row gap-8">
             <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                   <h1 className="text-4xl md:text-5xl font-black text-skin-text uppercase tracking-tight">{player.name}</h1>
                   {player.leagueTier && <img src={player.leagueTier.iconUrls.small} className="w-12 h-12" alt="League" />}
                </div>
                <p className="text-skin-secondary font-mono text-lg">{player.tag}</p>
                <div className="flex gap-4 mt-4 text-sm text-skin-muted">
                   <span>Role: <b className="text-skin-text capitalize">{player.role}</b></span>
                   <span>Level: <b className="text-skin-text">{player.expLevel}</b></span>
                </div>
             </div>

             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-skin-bg p-3 rounded border border-skin-primary/20">
                   <p className="text-[10px] uppercase text-skin-muted font-bold">Town Hall</p>
                   <p className="text-2xl font-black text-skin-secondary">{player.townHallLevel}</p>
                </div>
                <div className="bg-skin-bg p-3 rounded border border-skin-primary/20">
                   <p className="text-[10px] uppercase text-skin-muted font-bold">Trophies</p>
                   <p className="text-2xl font-black text-skin-text">{player.trophies}</p>
                   <p className="text-[10px] text-skin-muted">Best: {player.bestTrophies}</p>
                </div>
                <div className="bg-skin-bg p-3 rounded border border-skin-primary/20">
                   <p className="text-[10px] uppercase text-skin-muted font-bold">War Stars</p>
                   <p className="text-2xl font-black text-orange-500">{player.warStars}</p>
                </div>
                <div className="bg-skin-bg p-3 rounded border border-skin-primary/20">
                   <p className="text-[10px] uppercase text-skin-muted font-bold">Donations</p>
                   <p className="text-2xl font-black text-green-400">{player.donations}</p>
                   <p className="text-[10px] text-skin-muted">Rec: {player.donationsReceived}</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* 2. HEROES & PETS */}
      <section>
        <h3 className="text-xl font-bold text-skin-text mb-4 border-b border-skin-muted/20 pb-2 flex items-center gap-2">
           <Shield size={20} className="text-skin-primary"/> Heroes & Pets
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
           {homeHeroes.map(h => <UnitCard key={h.name} unit={h} type="Hero" />)}
           {pets.map(p => <UnitCard key={p.name} unit={p} type="Pet" />)}
        </div>
      </section>

      {/* 3. TROOPS (Categorized) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <section>
            <h3 className="text-xl font-bold text-skin-text mb-4 border-b border-skin-muted/20 pb-2 flex items-center gap-2">
               <Sword size={20} className="text-pink-400"/> Elixir Troops
            </h3>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
               {elixirTroops.map(t => <UnitCard key={t.name} unit={t} type="Elixir Troop" />)}
            </div>
         </section>
         
         <section>
            <h3 className="text-xl font-bold text-skin-text mb-4 border-b border-skin-muted/20 pb-2 flex items-center gap-2">
               <Zap size={20} className="text-indigo-400"/> Dark Troops
            </h3>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
               {darkTroops.map(t => <UnitCard key={t.name} unit={t} type="Dark Troop" />)}
            </div>
         </section>
      </div>

      {/* 4. SPELLS & SIEGES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <section>
            <h3 className="text-xl font-bold text-skin-text mb-4 border-b border-skin-muted/20 pb-2 flex items-center gap-2">
               <Clock size={20} className="text-blue-400"/> Spells
            </h3>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
               {elixirSpells.map(s => <UnitCard key={s.name} unit={s} type="Elixir Spell" />)}
               {darkSpells.map(s => <UnitCard key={s.name} unit={s} type="Dark Spell" />)}
            </div>
         </section>

         {siegeMachines.length > 0 && (
           <section>
              <h3 className="text-xl font-bold text-skin-text mb-4 border-b border-skin-muted/20 pb-2 flex items-center gap-2">
                 <Home size={20} className="text-yellow-600"/> Siege Machines
              </h3>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                 {siegeMachines.map(s => <UnitCard key={s.name} unit={s} type="Siege Machine" />)}
              </div>
           </section>
         )}
      </div>

    </div>
  );
}

