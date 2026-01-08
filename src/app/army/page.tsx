 'use client';

import { UNIT_CATEGORIES, getUnitIconPath, getHousingSpace, TH_CAPS } from "@/lib/unitHelpers";
import useLongPress from "@/hooks/useLongPress";
import { ArrowLeft, Minus, Plus, Share2, Sword, Trash2, Zap, Home, ChevronDown, Lock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ArmyPlannerPage() {
  const [army, setArmy] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState<'troops' | 'spells' | 'sieges'>('troops');
  const [thLevel, setThLevel] = useState<number>(17); // Default Max TH
  const [isThMenuOpen, setIsThMenuOpen] = useState(false);

  // --- CAPS ---
  const caps = TH_CAPS[thLevel] || TH_CAPS[17];

  // --- CALCULATIONS ---
  // Helper to check if a unit is in a specific list
  const isTroop = (name: string) => UNIT_CATEGORIES.troops.includes(name);
  const isSpell = (name: string) => UNIT_CATEGORIES.spells.includes(name);
  const isSiege = (name: string) => UNIT_CATEGORIES.sieges.includes(name);

  const currentTroopSpace = Object.entries(army).reduce((acc, [name, count]) => {
    if (isTroop(name)) return acc + (getHousingSpace(name) * count);
    return acc;
  }, 0);

  const currentSpellSpace = Object.entries(army).reduce((acc, [name, count]) => {
    if (isSpell(name)) return acc + (getHousingSpace(name) * count);
    return acc;
  }, 0);

  const currentSiegeCount = Object.entries(army).reduce((acc, [name, count]) => {
    if (isSiege(name)) return acc + count;
    return acc;
  }, 0);

  // --- ACTIONS ---
  const updateUnit = (name: string, delta: number) => {
    setArmy(prev => {
      const currentCount = prev[name] || 0;
      const unitSpace = getHousingSpace(name);

      // Validation logic for Adding
      if (delta > 0) {
        if (isTroop(name) && (currentTroopSpace + unitSpace) > caps.troops) return prev;
        if (isSpell(name) && (currentSpellSpace + unitSpace) > caps.spells) return prev;
        if (isSiege(name) && (currentSiegeCount + 1) > caps.sieges) return prev;
      }

      const next = Math.max(0, currentCount + delta);
      const newArmy = { ...prev, [name]: next };
      if (next === 0) delete newArmy[name];
      return newArmy;
    });
  };

  const clearArmy = () => setArmy({});

  // --- DEEP LINK ---
  const generateLink = () => {
    // CoC Deep Link Format
    const encodedArmy = Object.entries(army)
       .map(([name, count]) => `${count}x${name.replace(/ /g, '')}`)
       .join('-');
    return `clashofclans://action=openarmy&army=${encodedArmy}`;
  };

  // --- ACTION BUTTON (With Long Press Fix) ---
  const ActionButton = ({ icon: Icon, action, disabled, colorClass }: any) => {
    // Delay: 1000ms (1s wait)
    // Speed: 200ms (Controlled pacing)
    const longPressProps = useLongPress(action, 200, 1000); 
    
    return (
      <button 
        {...longPressProps}
        disabled={disabled}
        // touch-none: Prevents scrolling/zooming while holding
        // select-none: Prevents text selection
        className={`w-8 h-8 flex items-center justify-center rounded transition-colors touch-none select-none ${disabled ? 'opacity-20 cursor-not-allowed' : 'hover:bg-black/10 active:scale-90'} ${colorClass}`}
      >
        <Icon size={14}/>
      </button>
    );
  };

  return (
    <div className="pb-40 animate-in fade-in duration-500">
       
       {/* HEADER & TH SELECTOR */}
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative z-50">
          <div className="flex items-center justify-between w-full md:w-auto">
              <Link href="/" className="flex items-center gap-2 text-skin-muted hover:text-skin-primary transition-colors">
                <ArrowLeft size={18} /> <span className="font-bold">Back</span>
              </Link>
              <h1 className="text-xl md:text-2xl font-clash text-skin-text uppercase tracking-wider ml-4">Army Planner</h1>
          </div>

          <div className="flex items-center gap-3 self-end md:self-auto">
             {/* TH DROPDOWN */}
             <div className="relative">
                <button 
                  onClick={() => setIsThMenuOpen(!isThMenuOpen)}
                  className="flex items-center gap-2 bg-skin-surface border border-skin-primary/30 pl-2 pr-3 py-1.5 rounded-lg hover:border-skin-primary transition-colors"
                >
                   <div className="w-8 h-8">
                     <img src={`/assets/icons/town_hall_${thLevel}.png`} onError={(e) => { e.currentTarget.style.display='none'; }} alt="" className="w-full h-full object-contain" />
                     {/* Fallback text if image missing */}
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
                          <button 
                            key={lvl}
                            onClick={() => { setThLevel(lvl); setIsThMenuOpen(false); }}
                            className={`flex items-center gap-3 w-full p-2 rounded hover:bg-skin-bg text-left ${thLevel === lvl ? 'bg-skin-primary/10 border border-skin-primary/30' : ''}`}
                          >
                             <img src={`/assets/icons/town_hall_${lvl}.png`} className="w-6 h-6 object-contain" alt=""/>
                             <span className="font-bold text-sm text-skin-text">TH {lvl}</span>
                          </button>
                        )
                     })}
                  </div>
                )}
             </div>

             <button onClick={clearArmy} className="p-2 text-red-400 hover:bg-red-400/10 rounded-full transition-colors" title="Clear All">
                <Trash2 size={18} />
             </button>
          </div>
       </div>

       {/* TABS (Sticky) */}
       <div className="flex gap-2 mb-6 overflow-x-auto pb-2 sticky top-[70px] z-40 bg-skin-bg/95 backdrop-blur py-2">
          <button onClick={() => setActiveTab('troops')} className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold uppercase text-xs transition-all ${activeTab === 'troops' ? 'bg-skin-primary text-black' : 'bg-skin-surface text-skin-muted border border-skin-primary/10'}`}>
             <Sword size={14} /> Troops
          </button>
          <button onClick={() => setActiveTab('spells')} className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold uppercase text-xs transition-all ${activeTab === 'spells' ? 'bg-skin-secondary text-black' : 'bg-skin-surface text-skin-muted border border-skin-primary/10'}`}>
             <Zap size={14} /> Spells
          </button>
          <button onClick={() => setActiveTab('sieges')} className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold uppercase text-xs transition-all ${activeTab === 'sieges' ? 'bg-orange-500 text-black' : 'bg-skin-surface text-skin-muted border border-skin-primary/10'}`}>
             <Home size={14} /> Machines
          </button>
       </div>

       {/* GRID */}
       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {UNIT_CATEGORIES[activeTab].map((unitName) => {
             const count = army[unitName] || 0;
             const space = getHousingSpace(unitName);
             const icon = getUnitIconPath(unitName);
             
             // Check if disabled based on cap
             let isFull = false;
             if (activeTab === 'troops' && (currentTroopSpace + space) > caps.troops) isFull = true;
             if (activeTab === 'spells' && (currentSpellSpace + space) > caps.spells) isFull = true;
             if (activeTab === 'sieges' && (currentSiegeCount + 1) > caps.sieges) isFull = true;

             // TH availability logic (Simple: Hide sieges if TH < 12)
             if (activeTab === 'sieges' && thLevel < 12) {
               return (
                 <div key={unitName} className="bg-skin-surface/50 border border-skin-muted/10 rounded-xl p-3 flex flex-col items-center justify-center gap-2 opacity-50 min-h-[120px]">
                    <Lock size={20} className="text-skin-muted"/>
                    <span className="text-[10px] uppercase font-bold text-skin-muted">Unlock at TH12</span>
                 </div>
               );
             }

             return (
               <div key={unitName} className={`bg-skin-surface border rounded-xl p-3 flex flex-col items-center gap-3 transition-colors ${count > 0 ? 'border-skin-primary shadow-[0_0_10px_-5px_var(--color-primary)]' : 'border-skin-primary/10'}`}>
                  <div className="relative w-14 h-14">
                     <img src={icon} onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden'); }} alt={unitName} className="w-full h-full object-contain drop-shadow-md" />
                     {/* Fallback Icon if image missing */}
                     <div className="hidden w-full h-full flex items-center justify-center bg-black/20 rounded-full">
                        <Sword size={20} className="text-skin-muted opacity-50"/>
                     </div>
                     
                     {count > 0 && (
                        <div className="absolute -top-2 -right-2 bg-skin-primary text-black font-black text-xs w-6 h-6 flex items-center justify-center rounded-full border-2 border-skin-bg shadow-sm animate-in zoom-in">
                           {count}
                        </div>
                     )}
                  </div>
                  
                  <div className="text-center w-full">
                     <div className="text-xs font-bold text-skin-text truncate">{unitName}</div>
                     <div className="text-[10px] text-skin-muted">{space} space</div>
                  </div>

                  <div className="flex items-center gap-1 bg-skin-bg rounded-lg p-1 w-full justify-between">
                     <ActionButton 
                       icon={Minus} 
                       action={() => updateUnit(unitName, -1)} 
                       disabled={count <= 0} 
                       colorClass="text-skin-muted hover:text-red-400"
                     />
                     <span className="font-mono font-bold text-sm w-6 text-center select-none">{count}</span>
                     <ActionButton 
                       icon={Plus} 
                       action={() => updateUnit(unitName, 1)} 
                       disabled={isFull} 
                       colorClass="text-skin-primary hover:text-white"
                     />
                  </div>
               </div>
             );
          })}
       </div>

       {/* STICKY FOOTER SUMMARY */}
       <div className="fixed bottom-0 left-0 w-full bg-skin-surface/95 backdrop-blur-md border-t border-skin-primary/20 p-4 z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.3)]">
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
             
             {/* STATS */}
             <div className="flex items-center gap-6 text-sm w-full md:w-auto justify-between md:justify-start">
                <div className="flex flex-col">
                   <span className="text-[10px] text-skin-muted uppercase font-bold">Troops</span>
                   <span className={`font-clash text-xl ${currentTroopSpace >= caps.troops ? 'text-green-400' : 'text-skin-text'}`}>
                      {currentTroopSpace}<span className="text-skin-muted text-sm">/{caps.troops}</span>
                   </span>
                </div>
                <div className="h-8 w-px bg-white/10"></div>
                <div className="flex flex-col">
                   <span className="text-[10px] text-skin-muted uppercase font-bold">Spells</span>
                   <span className={`font-clash text-xl ${currentSpellSpace >= caps.spells ? 'text-green-400' : 'text-skin-secondary'}`}>
                      {currentSpellSpace}<span className="text-skin-muted text-sm">/{caps.spells}</span>
                   </span>
                </div>
                <div className="h-8 w-px bg-white/10"></div>
                <div className="flex flex-col">
                   <span className="text-[10px] text-skin-muted uppercase font-bold">Machines</span>
                   <span className={`font-clash text-xl ${currentSiegeCount >= caps.sieges ? 'text-green-400' : 'text-orange-500'}`}>
                      {currentSiegeCount}<span className="text-skin-muted text-sm">/{caps.sieges}</span>
                   </span>
                </div>
             </div>

             {/* ACTIONS */}
             <a 
               href={generateLink()} 
               className="w-full md:w-auto bg-green-500 hover:bg-green-400 text-black font-black uppercase py-3 px-8 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-green-500/20"
             >
                <Share2 size={18} /> Train Army
             </a>
          </div>
       </div>
    </div>
  );
}
