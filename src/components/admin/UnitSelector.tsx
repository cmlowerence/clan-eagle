'use client';

import { getUnitIconPath, UNIT_CATEGORIES } from "@/lib/unitHelpers";
import { Plus, Minus, Swords, Zap } from "lucide-react";

interface UnitSelectorProps {
  army: { unit: string; count: number }[];
  setArmy: (army: { unit: string; count: number }[]) => void;
  filterTH: number; // For future expansion (restricting units by TH)
}

export default function UnitSelector({ army, setArmy, filterTH }: UnitSelectorProps) {
  
  const updateUnit = (unitName: string, delta: number) => {
    setArmy(prev => {
      const existing = prev.find(u => u.unit === unitName);
      if (existing) {
        const newCount = existing.count + delta;
        if (newCount <= 0) return prev.filter(u => u.unit !== unitName);
        return prev.map(u => u.unit === unitName ? { ...u, count: newCount } : u);
      } else {
        if (delta > 0) return [...prev, { unit: unitName, count: 1 }];
        return prev;
      }
    });
  };

  // Merge categories for simpler admin view
  const TROOPS = [...UNIT_CATEGORIES.elixirTroops, ...UNIT_CATEGORIES.darkTroops, ...UNIT_CATEGORIES.superTroops, ...UNIT_CATEGORIES.sieges, ...UNIT_CATEGORIES.pets];
  const SPELLS = [...UNIT_CATEGORIES.elixirSpells || [], ...UNIT_CATEGORIES.darkSpells];

  return (
    <div className="space-y-6 bg-black/20 p-4 rounded-xl border border-white/5">
        
        {/* SELECTED ARMY SUMMARY */}
        <div className="flex flex-wrap gap-2 min-h-[50px] bg-[#131b24] p-3 rounded-lg border border-white/5 mb-4">
            {army.length === 0 && <span className="text-xs text-skin-muted italic m-auto">No units selected</span>}
            {army.map((item) => (
                <div key={item.unit} className="relative w-10 h-10 bg-[#2a3a4b] rounded border border-white/10 group cursor-pointer" onClick={() => updateUnit(item.unit, -1)}>
                    <img src={getUnitIconPath(item.unit)} className="w-full h-full object-contain" alt=""/>
                    <div className="absolute -top-1.5 -right-1.5 bg-skin-primary text-black text-[10px] font-bold px-1.5 rounded-full border border-white/20 shadow">{item.count}</div>
                    <div className="absolute inset-0 bg-red-500/50 opacity-0 group-hover:opacity-100 rounded flex items-center justify-center transition-opacity"><Minus size={16} className="text-white"/></div>
                </div>
            ))}
        </div>

        {/* TROOP SELECTOR GRID */}
        <div>
            <div className="flex items-center gap-2 text-xs font-bold text-skin-muted uppercase mb-2"><Swords size={12}/> Select Troops</div>
            <div className="grid grid-cols-5 md:grid-cols-8 gap-2 max-h-48 overflow-y-auto custom-scrollbar p-1">
                {TROOPS.map(unit => (
                    <button key={unit} onClick={() => updateUnit(unit, 1)} className="group relative w-10 h-10 bg-[#1f2937] hover:bg-skin-primary/20 rounded border border-white/5 hover:border-skin-primary transition-all" title={unit}>
                        <img src={getUnitIconPath(unit)} className="w-full h-full object-contain p-0.5" alt={unit} onError={(e) => e.currentTarget.style.display='none'}/>
                        <div className="hidden group-hover:flex absolute inset-0 bg-black/40 items-center justify-center rounded"><Plus size={16} className="text-white"/></div>
                    </button>
                ))}
            </div>
        </div>

        {/* SPELL SELECTOR GRID */}
        <div>
            <div className="flex items-center gap-2 text-xs font-bold text-skin-muted uppercase mb-2"><Zap size={12}/> Select Spells</div>
            <div className="flex flex-wrap gap-2">
                {SPELLS.map(spell => (
                    <button key={spell} onClick={() => updateUnit(spell, 1)} className="group relative w-10 h-10 bg-[#1f2937] hover:bg-skin-secondary/20 rounded border border-white/5 hover:border-skin-secondary transition-all" title={spell}>
                         <img src={getUnitIconPath(spell)} className="w-full h-full object-contain p-1" alt={spell} onError={(e) => e.currentTarget.style.display='none'}/>
                         <div className="hidden group-hover:flex absolute inset-0 bg-black/40 items-center justify-center rounded"><Plus size={16} className="text-white"/></div>
                    </button>
                ))}
            </div>
        </div>
    </div>
  );
}
