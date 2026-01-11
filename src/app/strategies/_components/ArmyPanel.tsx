import { Swords, Zap } from "lucide-react";
import { getUnitIconPath, getUnitCategory } from "@/lib/unitHelpers";
import { ArmyUnit } from "./types";

interface ArmyPanelProps {
  composition: ArmyUnit[];
  trainLink?: string;
}

export default function ArmyPanel({ composition, trainLink }: ArmyPanelProps) {
  // Logic to separate Troops from Spells based on unit category
  const getArmySplit = (comp: ArmyUnit[]) => {
    const troops: ArmyUnit[] = [];
    const spells: ArmyUnit[] = [];
    if (Array.isArray(comp)) {
      comp.forEach(item => {
        const category = getUnitCategory(item.unit, true);
        if (category.includes('Spell')) spells.push(item);
        else troops.push(item);
      });
    }
    return { troops, spells };
  };

  const { troops, spells } = getArmySplit(composition);

  return (
    <div className="bg-[#0c1015] p-6 rounded-2xl border border-white/5 w-full lg:w-80 shrink-0 flex flex-col h-fit shadow-inner">
      <div className="space-y-6">

        {/* Troops Section */}
        {troops.length > 0 && (
          <div>
            <div className="text-[10px] uppercase font-bold text-skin-muted mb-4 flex items-center gap-2 border-b border-white/5 pb-2">
              <Swords size={12} className="text-skin-primary" /> Army
            </div>
            <div className="grid grid-cols-4 gap-2">
              {troops.map((item, idx) => (
                <div key={idx} className="relative aspect-square bg-[#1a232e] rounded-xl border border-white/10 transition-all hover:border-skin-primary/50 hover:bg-[#202b38]" title={item.unit}>
                  <img
                    src={getUnitIconPath(item.unit)}
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    className="w-full h-full object-contain p-1"
                    alt={item.unit}
                  />
                  <div className="absolute -top-1.5 -right-1.5 bg-skin-primary text-black text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#0c1015] shadow-lg">
                    {item.count}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Spells Section */}
        {spells.length > 0 && (
          <div>
            <div className="text-[10px] uppercase font-bold text-skin-muted mb-4 flex items-center gap-2 border-b border-white/5 pb-2">
              <Zap size={12} className="text-blue-400" /> Spells
            </div>
            <div className="flex flex-wrap gap-2">
              {spells.map((item, idx) => (
                <div key={idx} className="relative w-10 h-10 bg-[#1a232e] rounded-lg border border-white/10 transition-all hover:border-blue-400/50 hover:bg-[#202b38]" title={item.unit}>
                  <img
                    src={getUnitIconPath(item.unit)}
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    className="w-full h-full object-contain p-1"
                    alt={item.unit}
                  />
                  <div className="absolute -top-1.5 -right-1.5 bg-blue-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-[#0c1015] shadow-lg">
                    {item.count}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Train Button */}
      <div className="mt-8 pt-4 border-t border-white/10">
        {trainLink ? (
          <a
            href={trainLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group/btn relative flex items-center justify-center gap-2 w-full bg-skin-secondary hover:bg-white text-black font-bold text-xs py-4 rounded-xl transition-all shadow-lg hover:shadow-skin-secondary/20 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
            <Swords size={16} className="relative z-10 group-hover/btn:rotate-12 transition-transform" />
            <span className="relative z-10">TRAIN ARMY</span>
          </a>
        ) : (
          <div className="flex items-center justify-center gap-2 w-full bg-white/5 text-skin-muted font-bold text-xs py-4 rounded-xl border border-white/5 cursor-not-allowed opacity-50">
            <span>Link Unavailable</span>
          </div>
        )}
      </div>
    </div>
  );
}
