'use client';

import { UNIT_CATEGORIES, getUnitIconPath, getHousingSpace } from "@/lib/unitHelpers";
import { ArrowLeft, Minus, Plus, Share2, Sword, Trash2, Zap, Home } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Define the units we want to allow selecting
const AVAILABLE_UNITS = {
  troops: [
    "Barbarian", "Archer", "Giant", "Goblin", "Wall Breaker", "Balloon", "Wizard", "Healer", "Dragon", "PEKKA",
    "Baby Dragon", "Miner", "Electro Dragon", "Yeti", "Dragon Rider", "Electro Titan", "Root Rider",
    "Minion", "Hog Rider", "Valkyrie", "Golem", "Witch", "Lava Hound", "Bowler", "Ice Golem", "Headhunter", "Apprentice Warden"
  ],
  spells: [
    "Lightning Spell", "Healing Spell", "Rage Spell", "Jump Spell", "Freeze Spell", "Clone Spell", "Invisibility Spell", 
    "Recall Spell", "Poison Spell", "Earthquake Spell", "Haste Spell", "Skeleton Spell", "Bat Spell", "Overgrowth Spell"
  ],
  sieges: [
    "Wall Wrecker", "Battle Blimp", "Stone Slammer", "Siege Barracks", "Log Launcher", "Flame Flinger", "Battle Drill"
  ]
};

export default function ArmyPlannerPage() {
  const [army, setArmy] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState<'troops' | 'spells' | 'sieges'>('troops');

  // --- ACTIONS ---
  const updateUnit = (name: string, delta: number) => {
    setArmy(prev => {
      const current = prev[name] || 0;
      const next = Math.max(0, current + delta);
      const newArmy = { ...prev, [name]: next };
      if (next === 0) delete newArmy[name];
      return newArmy;
    });
  };

  const clearArmy = () => setArmy({});

  // --- CALCULATIONS ---
  const troopSpace = Object.entries(army).reduce((acc, [name, count]) => {
    if (AVAILABLE_UNITS.troops.includes(name)) return acc + (getHousingSpace(name) * count);
    return acc;
  }, 0);

  const spellSpace = Object.entries(army).reduce((acc, [name, count]) => {
    if (AVAILABLE_UNITS.spells.includes(name)) return acc + (getHousingSpace(name) * count);
    return acc;
  }, 0);

  const siegeCount = Object.entries(army).reduce((acc, [name, count]) => {
    if (AVAILABLE_UNITS.sieges.includes(name)) return acc + count;
    return acc;
  }, 0);

  // --- LINK GENERATOR ---
  const generateLink = () => {
    // Format: https://link.clashofclans.com/en?action=OpenArmy&army=10xBarbarian-5xArcher
    const armyString = Object.entries(army)
      .map(([name, count]) => `${count}x${name}`)
      .join('-');
    
    // Using encodeURIComponent is safer, but CoC expects simpler encoding usually. 
    // The game handles ' ' as '%20' or '+' sometimes. Let's strictly encode names.
    const encodedArmy = Object.entries(army)
       .map(([name, count]) => `${count}x${name.replace(/ /g, '')}`) // CoC IDs usually remove spaces (e.g. ElectroDragon)
       // NOTE: Some IDs are tricky (e.g. "Super Barbarian" -> "SuperBarbarian"). Removing spaces usually works.
       .join('-');

    return `clashofclans://action=openarmy&army=${encodedArmy}`;
  };

  return (
    <div className="pb-32 animate-in fade-in duration-500">
       
       {/* HEADER */}
       <div className="flex items-center justify-between mb-6">
          <Link href="/" className="flex items-center gap-2 text-skin-muted hover:text-skin-primary transition-colors">
             <ArrowLeft size={18} /> <span className="font-bold">Back</span>
          </Link>
          <h1 className="text-2xl font-clash text-skin-text uppercase tracking-wider">Army Planner</h1>
          <button onClick={clearArmy} className="p-2 text-red-400 hover:bg-red-400/10 rounded-full transition-colors" title="Clear All">
             <Trash2 size={18} />
          </button>
       </div>

       {/* TABS */}
       <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button 
             onClick={() => setActiveTab('troops')} 
             className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold uppercase text-xs transition-all ${activeTab === 'troops' ? 'bg-skin-primary text-black' : 'bg-skin-surface text-skin-muted border border-skin-primary/10'}`}
          >
             <Sword size={14} /> Troops
          </button>
          <button 
             onClick={() => setActiveTab('spells')} 
             className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold uppercase text-xs transition-all ${activeTab === 'spells' ? 'bg-skin-secondary text-black' : 'bg-skin-surface text-skin-muted border border-skin-primary/10'}`}
          >
             <Zap size={14} /> Spells
          </button>
          <button 
             onClick={() => setActiveTab('sieges')} 
             className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold uppercase text-xs transition-all ${activeTab === 'sieges' ? 'bg-orange-500 text-black' : 'bg-skin-surface text-skin-muted border border-skin-primary/10'}`}
          >
             <Home size={14} /> Machines
          </button>
       </div>

       {/* GRID */}
       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {AVAILABLE_UNITS[activeTab].map((unitName) => {
             const count = army[unitName] || 0;
             const space = getHousingSpace(unitName);
             const icon = getUnitIconPath(unitName);

             return (
               <div key={unitName} className={`bg-skin-surface border rounded-xl p-3 flex flex-col items-center gap-3 transition-colors ${count > 0 ? 'border-skin-primary shadow-[0_0_10px_-5px_var(--color-primary)]' : 'border-skin-primary/10'}`}>
                  <div className="relative w-14 h-14">
                     <img src={icon} alt={unitName} className="w-full h-full object-contain drop-shadow-md" />
                     {count > 0 && (
                        <div className="absolute -top-2 -right-2 bg-skin-primary text-black font-black text-xs w-6 h-6 flex items-center justify-center rounded-full border-2 border-skin-bg shadow-sm">
                           {count}
                        </div>
                     )}
                  </div>
                  
                  <div className="text-center w-full">
                     <div className="text-xs font-bold text-skin-text truncate">{unitName}</div>
                     <div className="text-[10px] text-skin-muted">{space} space</div>
                  </div>

                  <div className="flex items-center gap-3 bg-skin-bg rounded-lg p-1 w-full justify-between">
                     <button onClick={() => updateUnit(unitName, -1)} className="w-8 h-8 flex items-center justify-center text-skin-muted hover:text-red-400 hover:bg-white/5 rounded transition-colors"><Minus size={14}/></button>
                     <span className="font-mono font-bold text-sm w-4 text-center">{count}</span>
                     <button onClick={() => updateUnit(unitName, 1)} className="w-8 h-8 flex items-center justify-center text-skin-primary hover:bg-skin-primary/10 rounded transition-colors"><Plus size={14}/></button>
                  </div>
               </div>
             );
          })}
       </div>

       {/* STICKY FOOTER SUMMARY */}
       <div className="fixed bottom-0 left-0 w-full bg-skin-surface/95 backdrop-blur-md border-t border-skin-primary/20 p-4 z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.3)]">
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
             
             {/* STATS */}
             <div className="flex items-center gap-6 text-sm">
                <div className="flex flex-col">
                   <span className="text-[10px] text-skin-muted uppercase font-bold">Troops Space</span>
                   <span className={`font-clash text-xl ${troopSpace > 320 ? 'text-red-500' : 'text-skin-text'}`}>{troopSpace}<span className="text-skin-muted text-sm">/320</span></span>
                </div>
                <div className="h-8 w-px bg-white/10"></div>
                <div className="flex flex-col">
                   <span className="text-[10px] text-skin-muted uppercase font-bold">Spell Space</span>
                   <span className={`font-clash text-xl ${spellSpace > 11 ? 'text-red-500' : 'text-skin-secondary'}`}>{spellSpace}<span className="text-skin-muted text-sm">/11</span></span>
                </div>
                <div className="h-8 w-px bg-white/10"></div>
                <div className="flex flex-col">
                   <span className="text-[10px] text-skin-muted uppercase font-bold">Machines</span>
                   <span className={`font-clash text-xl ${siegeCount > 1 ? 'text-red-500' : 'text-orange-500'}`}>{siegeCount}<span className="text-skin-muted text-sm">/1</span></span>
                </div>
             </div>

             {/* ACTIONS */}
             <a 
               href={generateLink()} 
               className="w-full md:w-auto bg-green-500 hover:bg-green-400 text-black font-black uppercase py-3 px-8 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-green-500/20"
             >
                <Share2 size={18} /> Train in Game
             </a>
          </div>
       </div>
    </div>
  );
}
