import { UNIT_CATEGORIES, getUnitIconPath } from "@/lib/unitHelpers";
import { Minus } from "lucide-react";

interface Props {
  army: Record < string,
  number > ;
  updateUnit: (name: string, delta: number) => void;
}

export default function ArmyStrip({ army, updateUnit }: Props) {
  const units = Object.entries(army);
  if (units.length === 0) return null;
  
  const sortedUnits = units.sort(([aName], [bName]) => {
    const score = (name: string) => {
      if (UNIT_CATEGORIES.troops.includes(name)) return 1;
      if (UNIT_CATEGORIES.spells.includes(name)) return 2;
      return 3;
    };
    return score(aName) - score(bName);
  });
  
  return (
    <div className="mb-6 sticky top-[120px] z-30 bg-skin-bg/95 backdrop-blur border-b border-skin-primary/5 animate-in slide-in-from-top-2">
      <div className="text-[10px] uppercase font-bold text-skin-muted mb-1 px-1 py-1">Current Army</div>
      
      <div className="flex gap-4 overflow-x-auto pb-4 pt-5 no-scrollbar px-2 min-h-[100px] items-start">
        {sortedUnits.map(([name, count]) => (
          <div key={name} className="relative group w-[64px] shrink-0">
            
            {/* Card Container */}
            <div className="w-full h-[74px] rounded-lg overflow-hidden border border-[#4a7a9b] bg-[#2a3a4b] shadow-lg relative">
              <div className="absolute top-0 inset-x-0 h-5 bg-gradient-to-b from-[#5c9dd1] to-[#3a6a8b] flex items-center justify-center text-white font-clash text-xs z-10 border-b border-[#2a4a6b]">
                <span className="drop-shadow-md">x{count}</span>
              </div>
              
              <div className="absolute inset-0 top-5 flex items-center justify-center bg-gradient-to-b from-[#2e3b4e] to-[#1a232e] p-1">
                <img src={getUnitIconPath(name)} alt={name} className="w-full h-full object-contain drop-shadow-md" />
              </div>
            </div>

            {/* Minus Button */}
            <button 
              onClick={() => updateUnit(name, -1)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-b from-[#b91c1c] to-[#7f1d1d] rounded-full border border-[#fca5a5]/50 shadow-[0_2px_5px_rgba(0,0,0,0.5)] flex items-center justify-center z-20 hover:scale-110 active:scale-90 transition-transform cursor-pointer"
            >
              <Minus size={12} className="text-white stroke-[3px]" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}