'use client';

import { UNIT_CATEGORIES, getUnitIconPath, getHousingSpace, TH_CAPS, getUnlockLevel, getCategoryIcon, getUnitCategory } from "@/lib/unitHelpers";
import { ArrowLeft, Minus, Plus, Share2, Sword, Trash2, Zap, Home, ChevronDown, Lock, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ArmyPlannerPage() {
  const [army, setArmy] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState<'troops' | 'spells' | 'sieges'>('troops');
  const [thLevel, setThLevel] = useState<number>(17);
  const [isThMenuOpen, setIsThMenuOpen] = useState(false);

  // --- CAPS ---
  const caps = TH_CAPS[thLevel] || TH_CAPS[17];

  // --- HELPERS ---
  const isTroop = (name: string) => UNIT_CATEGORIES.troops.includes(name);
  const isSpell = (name: string) => UNIT_CATEGORIES.spells.includes(name);
  const isSiege = (name: string) => UNIT_CATEGORIES.sieges.includes(name);
  const isSuper = (name: string) => UNIT_CATEGORIES.superTroops.includes(name);

  // --- LIVE CALCULATIONS ---
  const currentTroopSpace = Object.entries(army).reduce((acc, [name, count]) => {
    return isTroop(name) ? acc + (getHousingSpace(name) * count) : acc;
  }, 0);

  const currentSpellSpace = Object.entries(army).reduce((acc, [name, count]) => {
    return isSpell(name) ? acc + (getHousingSpace(name) * count) : acc;
  }, 0);

  const currentSiegeCount = Object.entries(army).reduce((acc, [name, count]) => {
    return isSiege(name) ? acc + count : acc;
  }, 0);

  const activeSuperTypes = Object.keys(army).filter(name => isSuper(name)).length;

  // --- UPDATE LOGIC ---
  const updateUnit = (name: string, delta: number) => {
    setArmy(prev => {
      const currentCount = prev[name] || 0;
      const unitSpace = getHousingSpace(name);

      if (delta < 0) {
        const next = Math.max(0, currentCount + delta);
        const newArmy = { ...prev, [name]: next };
        if (next === 0) delete newArmy[name];
        return newArmy;
      }

      // Add Validation
      let prevTroopSpace = 0;
      let prevSpellSpace = 0;
      let prevSiegeCount = 0;
      let prevSuperTypes = 0;

      Object.entries(prev).forEach(([n, c]) => {
        if (isTroop(n)) prevTroopSpace += getHousingSpace(n) * c;
        if (isSpell(n)) prevSpellSpace += getHousingSpace(n) * c;
        if (isSiege(n)) prevSiegeCount += c;
        if (isSuper(n)) prevSuperTypes++;
      });

      if (isTroop(name) && (prevTroopSpace + unitSpace) > caps.troops) return prev;
      if (isSpell(name) && (prevSpellSpace + unitSpace) > caps.spells) return prev;
      if (isSiege(name) && (prevSiegeCount + 1) > caps.sieges) return prev;
      if (isSuper(name) && currentCount === 0 && prevSuperTypes >= 2) return prev;

      const next = currentCount + delta;
      return { ...prev, [name]: next };
    });
  };

  const clearArmy = () => setArmy({});

  const generateLink = () => {
    const encodedArmy = Object.entries(army)
       .map(([name, count]) => `${count}x${name.replace(/ /g, '')}`)
       .join('-');
    return `clashofclans://action=openarmy&army=${encodedArmy}`;
  };

  return (
    <div className="pb-40 animate-in fade-in duration-500">
       
       {/* HEADER - FIX: Increased Z-Index to 50 so dropdown floats OVER tabs (z-40) */}
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative z-50">
          <div className="flex items-center justify-between w-full md:w-auto">
              <Link href="/" className="flex items-center gap-2 text-skin-muted hover:text-skin-primary transition-colors">
                <ArrowLeft size={18} /> <span className="font-bold">Back</span>
              </Link>
              <h1 className="text-xl md:text-2xl font-clash text-skin-text uppercase tracking-wider ml-4">Army Planner</h1>
          </div>

          <div className="flex items-center gap-3 self-end md:self-auto">
             {/* Super Troop Indicator */}
             {activeSuperTypes >= 2 && activeTab === 'troops' && (
                <div className="flex items-center gap-1 text-[10px] text-orange-500 bg-orange-500/10 px-2 py-1 rounded border border-orange-500/20 font-bold animate-pulse">
                  <AlertTriangle size={12}/> Super Limit (2/2)
                </div>
             )}

             {/* TH Selector */}
             <div className="relative">
                <button onClick={() => setIsThMenuOpen(!isThMenuOpen)} className="flex items-center gap-2 bg-skin-surface border border-skin-primary/30 pl-2 pr-3 py-1.5 rounded-lg hover:border-skin-primary transition-colors">
                   <div className="w-8 h-8">
                     <img src={`/assets/icons/town_hall_${thLevel}.png`} onError={(e) => { e.currentTarget.style.display='none'; }} alt="" className="w-full h-full object-contain" />
                     <span className="hidden">TH</span>
                   </div>
                   <div className="text-left">
                      <div className="text-[9px] text-skin-muted font-bold uppercase">Town Hall</div>
                      <div className="text-sm font-clash text-skin-text leading-none">{thLevel}</div>
                   </div>
                   <ChevronDown size={14} className="text-skin-muted"/>
                </button>
                {isThMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 max-h-60 overflow-y-auto bg-skin-surface border border-skin-primary/20 rounded-xl shadow-xl z-50 p-2 custom-scrollbar">
                     {[...Array(17)].map((_, i) => {
                        const lvl = 17 - i;
                        return (
                          <button key={lvl} onClick={() => { setThLevel(lvl); setArmy({}); setIsThMenuOpen(false); }} className={`flex items-center gap-3 w-full p-2 rounded hover:bg-skin-bg text-left ${thLevel === lvl ? 'bg-skin-primary/10 border border-skin-primary/30' : ''}`}>
                             <img src={`/assets/icons/town_hall_${lvl}.png`} className="w-6 h-6 object-contain" alt=""/>
                             <span className="font-bold text-sm text-skin-text">TH {lvl}</span>
                          </button>
                        )
                     })}
                  </div>
                )}
             </div>
             <button onClick={clearArmy} className="p-2 text-red-400 hover:bg-red-400/10 rounded-full transition-colors"><Trash2 size={18} /></button>
          </div>
       </div>

       {/* TABS (Z-Index 40) - Header is now Z-50, so it wins */}
       <div className="flex gap-2 mb-6 overflow-x-auto pb-2 sticky top-[64px] z-40 bg-skin-bg/95 backdrop-blur py-2 no-scrollbar border-b border-skin-primary/5">
          <button onClick={() => setActiveTab('troops')} className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold uppercase text-xs whitespace-nowrap transition-all ${activeTab === 'troops' ? 'bg-skin-primary text-black' : 'bg-skin-surface text-skin-muted border border-skin-primary/10'}`}><Sword size={14} /> Troops</button>
          <button onClick={() => setActiveTab('spells')} className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold uppercase text-xs whitespace-nowrap transition-all ${activeTab === 'spells' ? 'bg-skin-secondary text-black' : 'bg-skin-surface text-skin-muted border border-skin-primary/10'}`}><Zap size={14} /> Spells</button>
          <button onClick={() => setActiveTab('sieges')} className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold uppercase text-xs whitespace-nowrap transition-all ${activeTab === 'sieges' ? 'bg-orange-500 text-black' : 'bg-skin-surface text-skin-muted border border-skin-primary/10'}`}><Home size={14} /> Machines</button>
       </div>

       {/* UNIT GRID */}
       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {UNIT_CATEGORIES[activeTab].map((unitName) => {
             const count = army[unitName] || 0;
             const space = getHousingSpace(unitName);
             const iconPath = getUnitIconPath(unitName);
             const unlockLevel = getUnlockLevel(unitName);
             const isLocked = thLevel < unlockLevel;
             
             let isFull = false;
             if (activeTab === 'troops' && (currentTroopSpace + space) > caps.troops) isFull = true;
             if (activeTab === 'spells' && (currentSpellSpace + space) > caps.spells) isFull = true;
             if (activeTab === 'sieges' && (currentSiegeCount + 1) > caps.sieges) isFull = true;
             if (isSuper(unitName) && count === 0 && activeSuperTypes >= 2) isFull = true;

             const CatIcon = getCategoryIcon(getUnitCategory(unitName, activeTab === 'spells'));

             if (isLocked) {
               return (
                 <div key={unitName} className="bg-skin-surface/30 border border-skin-muted/5 rounded-xl p-3 flex flex-col items-center justify-center gap-2 opacity-60 min-h-[120px] select-none grayscale relative overflow-hidden">
                    <div className="relative z-10 opacity-50">
                       <img src={iconPath} onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden'); }} alt="" className="w-10 h-10 object-contain" />
                       <div className="hidden w-10 h-10 flex items-center justify-center"><CatIcon size={24} className="text-skin-muted"/></div>
                       <div className="absolute inset-0 flex items-center justify-center text-skin-muted"><Lock size={16}/></div>
                    </div>
                    <div className="text-center z-10">
                       <div className="text-[10px] font-bold text-skin-muted truncate max-w-[80px]">{unitName}</div>
                       <div className="text-[9px] text-red-400 font-bold uppercase">Unlock TH{unlockLevel}</div>
                    </div>
                 </div>
               );
             }

             return (
               <div key={unitName} className={`bg-skin-surface border rounded-xl p-3 flex flex-col items-center gap-3 transition-colors ${count > 0 ? 'border-skin-primary shadow-[0_0_10px_-5px_var(--color-primary)]' : 'border-skin-primary/10'}`}>
                  {/* Icon */}
                  <div className="relative w-14 h-14 shrink-0">
                     <img 
                        src={iconPath} 
                        onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden'); }} 
                        alt={unitName} 
                        className="w-full h-full object-contain drop-shadow-md" 
                     />
                     <div className="hidden w-full h-full flex items-center justify-center bg-black/20 rounded-full border border-white/5">
                        <CatIcon size={24} className="text-skin-muted opacity-50"/>
                     </div>
                     {count > 0 && <div className="absolute -top-2 -right-2 bg-skin-primary text-black font-black text-xs w-6 h-6 flex items-center justify-center rounded-full border-2 border-skin-bg shadow-sm animate-in zoom-in">{count}</div>}
                  </div>
                  
                  {/* Text */}
                  <div className="text-center w-full min-h-[30px]">
                     <div className="text-xs font-bold text-skin-text truncate leading-tight">{unitName}</div>
                     <div className="text-[10px] text-skin-muted">{space} space</div>
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center gap-1 bg-skin-bg rounded-lg p-1 w-full justify-between">
                     <button onClick={() => updateUnit(unitName, -1)} disabled={count <= 0} className="w-8 h-8 flex items-center justify-center rounded text-skin-muted hover:text-red-400 hover:bg-black/10 transition-colors disabled:opacity-20 touch-none"><Minus size={14}/></button>
                     <span className="font-mono font-bold text-sm w-6 text-center select-none">{count}</span>
                     <button onClick={() => updateUnit(unitName, 1)} disabled={isFull} className="w-8 h-8 flex items-center justify-center rounded text-skin-primary hover:text-white hover:bg-black/10 transition-colors disabled:opacity-20 touch-none"><Plus size={14}/></button>
                  </div>
               </div>
             );
          })}
       </div>

       {/* FOOTER STATS */}
       <div className="fixed bottom-0 left-0 w-full bg-skin-surface/95 backdrop-blur-md border-t border-skin-primary/20 p-4 z-50 pb-6 md:pb-4 shadow-[0_-5px_20px_rgba(0,0,0,0.3)]">
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
             <div className="flex items-center gap-4 text-sm w-full md:w-auto justify-between md:justify-start px-2">
                
                {/* Troop Stat */}
                <div className="flex flex-col items-center md:items-start">
                  <span className="text-[10px] text-skin-muted uppercase font-bold">Troops</span>
                  <span className={`font-clash text-lg ${currentTroopSpace >= caps.troops ? 'text-green-400' : 'text-skin-text'}`}>
                    {currentTroopSpace}<span className="text-skin-muted text-xs">/{caps.troops}</span>
                  </span>
                </div>
                <div className="h-8 w-px bg-white/10"></div>
                
                {/* Spell Stat */}
                <div className="flex flex-col items-center md:items-start">
                  <span className="text-[10px] text-skin-muted uppercase font-bold">Spells</span>
                  <span className={`font-clash text-lg ${currentSpellSpace >= caps.spells ? 'text-green-400' : 'text-skin-secondary'}`}>
                    {currentSpellSpace}<span className="text-skin-muted text-xs">/{caps.spells}</span>
                  </span>
                </div>
                <div className="h-8 w-px bg-white/10"></div>
                
                {/* Siege Stat */}
                <div className="flex flex-col items-center md:items-start">
                  <span className="text-[10px] text-skin-muted uppercase font-bold">Sieges</span>
                  <span className={`font-clash text-lg ${currentSiegeCount >= caps.sieges ? 'text-green-400' : 'text-orange-500'}`}>
                    {currentSiegeCount}<span className="text-skin-muted text-xs">/{caps.sieges}</span>
                  </span>
                </div>

             </div>
             <a href={generateLink()} className="w-full md:w-auto bg-green-500 hover:bg-green-400 text-black font-black uppercase py-3 px-8 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-green-500/20">
                <Share2 size={18} /> Train Army
             </a>
          </div>
       </div>
    </div>
  );
}
