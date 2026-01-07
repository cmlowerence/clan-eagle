'use client';

import { useClashData } from "@/hooks/useClashData";
import { getCategoryIcon, getUnitCategory, getUnitIconPath, UNIT_CATEGORIES } from "@/lib/unitHelpers";
import { ArrowLeft, RefreshCw, Shield, Sword, Home, Zap, Clock } from "lucide-react";
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
    lastUpdated, 
    refresh 
  } = useClashData<PlayerData>(`player_${tag}`, `/players/${tag}`);

  if (loading) return <Loading />;
  if (!player) return <div className="p-10 text-center font-clash text-xl">Player not found.</div>;

  // Filters
  const homeHeroes = player.heroes.filter(h => h.village === 'home');
  const pets = player.troops.filter(t => UNIT_CATEGORIES.pets.includes(t.name));
  const allHomeTroops = player.troops.filter(t => t.village === 'home' && !UNIT_CATEGORIES.pets.includes(t.name));
  
  const elixirTroops = allHomeTroops.filter(t => getUnitCategory(t.name) === 'Elixir Troop');
  const darkTroops = allHomeTroops.filter(t => getUnitCategory(t.name) === 'Dark Troop');
  const siegeMachines = allHomeTroops.filter(t => getUnitCategory(t.name) === 'Siege Machine');
  const elixirSpells = player.spells.filter(s => getUnitCategory(s.name, true) === 'Elixir Spell');
  const darkSpells = player.spells.filter(s => getUnitCategory(s.name, true) === 'Dark Spell');

  // --- Helper Card ---
  const UnitCard = ({ unit, type }: { unit: Unit, type: string }) => {
    const Icon = getCategoryIcon(type);
    const iconPath = getUnitIconPath(unit.name);
    
    return (
      <div className={`relative p-2 rounded-lg border transition-all ${
        unit.level === unit.maxLevel 
          ? 'bg-skin-primary/20 border-skin-primary shadow-[0_0_10px_rgba(var(--color-primary),0.2)]' 
          : 'bg-skin-bg border-skin-primary/10'
      }`}>
         <div className="flex justify-between items-start mb-1">
            <div className="w-8 h-8 md:w-10 md:h-10 relative">
               <img 
                 src={iconPath} 
                 onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden'); }}
                 alt={unit.name}
                 className="object-contain w-full h-full drop-shadow-md"
               />
               <div className="hidden absolute top-0 left-0 w-full h-full flex items-center justify-center text-skin-muted opacity-50">
                  <Icon size={20} />
               </div>
            </div>
            {unit.level === unit.maxLevel && <div className="text-[8px] font-black text-skin-primary border border-skin-primary px-1 rounded bg-black/50">MAX</div>}
         </div>
         
         <div className="truncate text-[10px] md:text-xs font-bold text-skin-text leading-tight" title={unit.name}>{unit.name}</div>
         <div className="text-[10px] text-skin-muted mt-0.5">Lvl <span className="text-skin-secondary font-bold">{unit.level}</span></div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500 pb-12">
      
      {/* 1. Header & Navigation */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
            {player.clan ? (
              <Link href={`/clan/${encodeURIComponent(player.clan.tag)}`} className="flex items-center gap-1 text-skin-muted hover:text-skin-primary transition-colors text-xs font-bold uppercase tracking-wider">
                <ArrowLeft size={14} /> Back to Clan
              </Link>
            ) : <Link href="/" className="text-skin-muted text-xs"><ArrowLeft size={14}/> Home</Link>}

            <button onClick={() => refresh()} className="flex items-center gap-2 bg-skin-surface border border-skin-primary/30 px-3 py-1.5 rounded-full hover:bg-skin-primary hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest">
              <RefreshCw size={10} className={loading ? "animate-spin" : ""}/> {loading ? "Updating" : "Refresh"}
            </button>
        </div>

        <div className="bg-skin-surface border border-skin-primary/20 p-4 md:p-8 rounded-2xl shadow-xl relative overflow-hidden">
          {/* Subtle Background Art */}
          <div className="absolute right-[-20px] top-[-20px] opacity-5 rotate-12 text-skin-primary">
             <Shield size={200} />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row gap-6">
             <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center gap-3 mb-2 justify-center md:justify-start">
                   <h1 className="text-4xl md:text-5xl font-clash text-skin-text uppercase tracking-wider drop-shadow-lg stroke-black">{player.name}</h1>
                   {player.leagueTier && <img src={player.leagueTier.iconUrls.small} className="w-10 h-10 md:w-12 md:h-12 drop-shadow-md" alt="League" />}
                </div>
                <p className="text-skin-primary font-mono text-sm md:text-lg opacity-80">{player.tag}</p>
                <div className="flex justify-center md:justify-start gap-4 mt-3 text-xs md:text-sm text-skin-muted font-bold uppercase tracking-widest">
                   <span className="bg-black/20 px-2 py-1 rounded">Role: <span className="text-skin-secondary">{player.role}</span></span>
                   <span className="bg-black/20 px-2 py-1 rounded">Exp: <span className="text-white">{player.expLevel}</span></span>
                </div>
             </div>

             {/* Stats Grid - Adjusted for Mobile to prevent distortion */}
             <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
                <div className="bg-skin-bg/50 p-3 rounded-xl border border-skin-primary/10 text-center backdrop-blur-sm">
                   <p className="text-[10px] uppercase text-skin-muted font-black tracking-widest">Town Hall</p>
                   <p className="text-2xl md:text-3xl font-clash text-skin-primary drop-shadow-md">{player.townHallLevel}</p>
                </div>
                <div className="bg-skin-bg/50 p-3 rounded-xl border border-skin-primary/10 text-center backdrop-blur-sm">
                   <p className="text-[10px] uppercase text-skin-muted font-black tracking-widest">Trophies</p>
                   <p className="text-2xl md:text-3xl font-clash text-white drop-shadow-md">{player.trophies}</p>
                </div>
                <div className="bg-skin-bg/50 p-3 rounded-xl border border-skin-primary/10 text-center backdrop-blur-sm">
                   <p className="text-[10px] uppercase text-skin-muted font-black tracking-widest">War Stars</p>
                   <p className="text-2xl md:text-3xl font-clash text-orange-500 drop-shadow-md">{player.warStars}</p>
                </div>
                <div className="bg-skin-bg/50 p-3 rounded-xl border border-skin-primary/10 text-center backdrop-blur-sm">
                   <p className="text-[10px] uppercase text-skin-muted font-black tracking-widest">Donations</p>
                   <p className="text-2xl md:text-3xl font-clash text-green-400 drop-shadow-md">{player.donations}</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* 2. HEROES & PETS */}
      <section>
        <h3 className="text-lg md:text-xl font-clash text-skin-text mb-3 flex items-center gap-2 uppercase tracking-wider">
           <Shield size={18} className="text-skin-primary"/> Heroes & Pets
        </h3>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
           {homeHeroes.map(h => <UnitCard key={h.name} unit={h} type="Hero" />)}
           {pets.map(p => <UnitCard key={p.name} unit={p} type="Pet" />)}
        </div>
      </section>

      {/* 3. TROOPS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
         <section>
            <h3 className="text-lg md:text-xl font-clash text-skin-text mb-3 flex items-center gap-2 uppercase tracking-wider">
               <Sword size={18} className="text-pink-400"/> Elixir Troops
            </h3>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
               {elixirTroops.map(t => <UnitCard key={t.name} unit={t} type="Elixir Troop" />)}
            </div>
         </section>
         
         <section>
            <h3 className="text-lg md:text-xl font-clash text-skin-text mb-3 flex items-center gap-2 uppercase tracking-wider">
               <Zap size={18} className="text-indigo-400"/> Dark Troops
            </h3>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
               {darkTroops.map(t => <UnitCard key={t.name} unit={t} type="Dark Troop" />)}
            </div>
         </section>
      </div>

      {/* 4. SPELLS & SIEGES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
         <section>
            <h3 className="text-lg md:text-xl font-clash text-skin-text mb-3 flex items-center gap-2 uppercase tracking-wider">
               <Clock size={18} className="text-blue-400"/> Spells
            </h3>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
               {elixirSpells.map(s => <UnitCard key={s.name} unit={s} type="Elixir Spell" />)}
               {darkSpells.map(s => <UnitCard key={s.name} unit={s} type="Dark Spell" />)}
            </div>
         </section>

         {siegeMachines.length > 0 && (
           <section>
              <h3 className="text-lg md:text-xl font-clash text-skin-text mb-3 flex items-center gap-2 uppercase tracking-wider">
                 <Home size={18} className="text-yellow-600"/> Sieges
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

