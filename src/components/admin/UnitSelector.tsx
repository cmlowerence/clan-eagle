'use client';

import { getUnitIconPath, UNIT_CATEGORIES, HOUSING_SPACE, TH_CAPS, UNIT_UNLOCKS } from "@/lib/unitHelpers";
import { Plus, Minus, Swords, Zap, AlertTriangle, Hexagon } from "lucide-react";
import { useMemo } from "react";

interface UnitSelectorProps {
  army: { unit: string; count: number }[];
  setArmy: (army: { unit: string; count: number }[]) => void;
  filterTH: number;
}

export default function UnitSelector({ army, setArmy, filterTH }: UnitSelectorProps) {
  
  // 1. Calculate Current Stats
  const stats = useMemo(() => {
    let troopsUsed = 0;
    let spellsUsed = 0;
    let siegesUsed = 0;

    army.forEach(u => {
      const space = HOUSING_SPACE[u.unit] || 0;
      const cat = UNIT_CATEGORIES.elixirSpells.includes(u.unit) || UNIT_CATEGORIES.darkSpells.includes(u.unit);
      const isSiege = UNIT_CATEGORIES.sieges.includes(u.unit);

      if (isSiege) siegesUsed += u.count; // Sieges count by quantity (1 slot)
      else if (cat) spellsUsed += (u.count * space);
      else troopsUsed += (u.count * space);
    });

    return { troopsUsed, spellsUsed, siegesUsed };
  }, [army]);

  // 2. Get Caps for Selected TH
  const caps = TH_CAPS[filterTH] || TH_CAPS[16];

  const updateUnit = (unitName: string, delta: number) => {
    const existing = army.find(u => u.unit === unitName);
    const space = HOUSING_SPACE[unitName] || 0;
    
    // Check Caps before adding
    if (delta > 0) {
        const isSpell = UNIT_CATEGORIES.elixirSpells.includes(unitName) || UNIT_CATEGORIES.darkSpells.includes(unitName);
        const isSiege = UNIT_CATEGORIES.sieges.includes(unitName);

        if (isSiege && stats.siegesUsed + delta > caps.sieges) return; // Siege Cap Hit
        if (isSpell && stats.spellsUsed + space > caps.spells) return; // Spell Cap Hit
        if (!isSpell && !isSiege && stats.troopsUsed + space > caps.troops) return; // Troop Cap Hit
    }

    let newArmy = [...army];
    if (existing) {
      const newCount = existing.count + delta;
      if (newCount <= 0) newArmy = army.filter(u => u.unit !== unitName);
      else newArmy = army.map(u => u.unit === unitName ? { ...u, count: newCount } : u);
    } else if (delta > 0) {
      newArmy = [...army, { unit: unitName, count: 1 }];
    }
    setArmy(newArmy);
  };

  // 3. Filter Troops by TH Unlock Level
  const visibleTroops = UNIT_CATEGORIES.troops.filter(u => (UNIT_UNLOCKS[u] || 1) <= filterTH);
  const visibleSpells = UNIT_CATEGORIES.spells.filter(u => (UNIT_UNLOCKS[u] || 1) <= filterTH);
  const visibleSieges = UNIT_CATEGORIES.sieges.filter(u => (UNIT_UNLOCKS[u] || 1) <= filterTH);

  return (
    <div className="space-y-6 bg-black/20 p-4 rounded-xl border border-white/5">
        
        {/* CAPACITY BARS */}
        <div className="grid grid-cols-3 gap-2 mb-4">
            <div className={`p-2 rounded border text-center ${stats.troopsUsed > caps.troops ? 'bg-red-900/50 border-red-500' : 'bg-[#131b24] border-white/5'}`}>
                <div className="text-[10px] text-skin-muted uppercase">Troops</div>
                <div className={`font-bold ${stats.troopsUsed >= caps.troops ? 'text-red-400' : 'text-white'}`}>{stats.troopsUsed}/{caps.troops}</div>
            </div>
            <div className={`p-2 rounded border text-center ${stats.spellsUsed > caps.spells ? 'bg-red-900/50 border-red-500' : 'bg-[#131b24] border-white/5'}`}>
                <div className="text-[10px] text-skin-muted uppercase">Spells</div>
                <div className={`font-bold ${stats.spellsUsed >= caps.spells ? 'text-blue-400' : 'text-white'}`}>{stats.spellsUsed}/{caps.spells}</div>
            </div>
            <div className={`p-2 rounded border text-center ${stats.siegesUsed > caps.sieges ? 'bg-red-900/50 border-red-500' : 'bg-[#131b24] border-white/5'}`}>
                <div className="text-[10px] text-skin-muted uppercase">Sieges</div>
                <div className={`font-bold ${stats.siegesUsed >= caps.sieges ? 'text-yellow-400' : 'text-white'}`}>{stats.siegesUsed}/{caps.sieges}</div>
            </div>
        </div>

        {/* SELECTED SUMMARY */}
        <div className="flex flex-wrap gap-2 min-h-[50px] bg-[#131b24] p-3 rounded-lg border border-white/5">
            {army.length === 0 && <span className="text-xs text-skin-muted italic m-auto">No units selected</span>}
            {army.map((item) => (
                <div key={item.unit} className="relative w-10 h-10 bg-[#2a3a4b] rounded border border-white/10 group cursor-pointer hover:border-red-500/50" onClick={() => updateUnit(item.unit, -1)}>
                    <img src={getUnitIconPath(item.unit)} className="w-full h-full object-contain" alt={item.unit} />
                    <div className="absolute -top-1.5 -right-1.5 bg-skin-primary text-black text-[10px] font-bold px-1.5 rounded-full border border-white/20 shadow">{item.count}</div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-red-900/80 rounded transition-opacity"><Minus size={16} className="text-white"/></div>
                </div>
            ))}
        </div>

        {/* TROOPS */}
        <div>
            <div className="flex items-center gap-2 text-xs font-bold text-skin-muted uppercase mb-2"><Swords size={12}/> Select Troops (Unlocked at TH{filterTH})</div>
            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-48 overflow-y-auto custom-scrollbar p-1">
                {visibleTroops.map(unit => (
                    <button key={unit} onClick={() => updateUnit(unit, 1)} className="group relative w-10 h-10 bg-[#1f2937] hover:bg-skin-primary/20 rounded border border-white/5 hover:border-skin-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed" title={unit} disabled={stats.troopsUsed + (HOUSING_SPACE[unit]||0) > caps.troops}>
                        <img src={getUnitIconPath(unit)} className="w-full h-full object-contain p-0.5" alt={unit} onError={(e) => e.currentTarget.style.display='none'}/>
                    </button>
                ))}
            </div>
        </div>

        {/* SPELLS */}
        <div>
            <div className="flex items-center gap-2 text-xs font-bold text-skin-muted uppercase mb-2"><Zap size={12}/> Select Spells</div>
            <div className="flex flex-wrap gap-2">
                {visibleSpells.map(spell => (
                    <button key={spell} onClick={() => updateUnit(spell, 1)} className="group relative w-10 h-10 bg-[#1f2937] hover:bg-blue-500/20 rounded border border-white/5 hover:border-blue-500 transition-all disabled:opacity-30" title={spell} disabled={stats.spellsUsed + (HOUSING_SPACE[spell]||0) > caps.spells}>
                         <img src={getUnitIconPath(spell)} className="w-full h-full object-contain p-1" alt={spell} onError={(e) => e.currentTarget.style.display='none'}/>
                    </button>
                ))}
            </div>
        </div>

        {/* SIEGES */}
        {visibleSieges.length > 0 && (
            <div>
                <div className="flex items-center gap-2 text-xs font-bold text-skin-muted uppercase mb-2"><Hexagon size={12}/> Select Siege Machines</div>
                <div className="flex flex-wrap gap-2">
                    {visibleSieges.map(siege => (
                        <button key={siege} onClick={() => updateUnit(siege, 1)} className="group relative w-10 h-10 bg-[#1f2937] hover:bg-yellow-500/20 rounded border border-white/5 hover:border-yellow-500 transition-all disabled:opacity-30" title={siege} disabled={stats.siegesUsed + 1 > caps.sieges}>
                            <img src={getUnitIconPath(siege)} className="w-full h-full object-contain p-1" alt={siege} onError={(e) => e.currentTarget.style.display='none'}/>
                        </button>
                    ))}
                </div>
            </div>
        )}
    </div>
  );
}
