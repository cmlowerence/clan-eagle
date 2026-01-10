import { UNIT_CATEGORIES, getUnitIconPath, getHousingSpace, getUnlockLevel, getCategoryIcon, getUnitCategory } from "@/lib/unitHelpers";
import { Lock } from "lucide-react";

interface Props {
  activeTab: 'troops' | 'spells' | 'sieges';
  army: Record<string, number>;
  thLevel: number;
  stats: { troopSpace: number; spellSpace: number; siegeCount: number; superCount: number };
  caps: { troops: number; spells: number; sieges: number };
  updateUnit: (name: string, delta: number) => void;
  isSuper: (name: string) => boolean;
}

export default function UnitGrid({ activeTab, army, thLevel, stats, caps, updateUnit, isSuper }: Props) {
  return (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pb-8">
      {UNIT_CATEGORIES[activeTab].map((unitName) => {
        const count = army[unitName] || 0;
        const space = getHousingSpace(unitName);
        const iconPath = getUnitIconPath(unitName);
        const unlockLevel = getUnlockLevel(unitName);
        const isLocked = thLevel < unlockLevel;

        // Calculate if army is full for this unit type
        let isFull = false;
        if (activeTab === 'troops' && (stats.troopSpace + space) > caps.troops) isFull = true;
        if (activeTab === 'spells' && (stats.spellSpace + space) > caps.spells) isFull = true;
        if (activeTab === 'sieges' && (stats.siegeCount + 1) > caps.sieges) isFull = true;
        if (isSuper(unitName) && count === 0 && stats.superCount >= 2) isFull = true;

        const CatIcon = getCategoryIcon(getUnitCategory(unitName, activeTab === 'spells'));

        if (isLocked) {
          return (
            <div key={unitName} className="bg-skin-surface/30 border border-skin-muted/5 rounded-xl p-2 flex flex-col items-center justify-center gap-1 opacity-40 h-[110px] select-none grayscale relative overflow-hidden cursor-not-allowed">
              <div className="relative z-10 opacity-50">
                <img src={iconPath} onError={(e) => { e.currentTarget.style.display = 'none'; }} alt="" className="w-10 h-10 object-contain" />
                <div className="absolute inset-0 flex items-center justify-center text-skin-muted"><Lock size={16} /></div>
              </div>
              <div className="text-center z-10 leading-tight">
                <div className="text-[10px] font-bold text-skin-muted truncate max-w-[80px]">{unitName}</div>
                <div className="text-[8px] text-red-400 font-bold uppercase">TH{unlockLevel}</div>
              </div>
            </div>
          );
        }

        return (
          <button
            key={unitName}
            onClick={() => updateUnit(unitName, 1)}
            disabled={isFull}
            className={`bg-skin-surface border rounded-xl p-2 relative flex flex-col items-center justify-between h-[110px] gap-1 transition-all touch-none select-none
               ${count > 0 ? 'border-skin-primary bg-skin-primary/5' : 'border-skin-primary/10 hover:border-skin-primary/30 hover:bg-skin-surface/80'}
               ${isFull ? 'opacity-50 cursor-not-allowed grayscale-[0.3]' : 'active:scale-95'}
            `}
          >
            {/* Housing Space Badge */}
            <div className="absolute top-1 right-1 text-[9px] font-bold text-skin-muted bg-skin-bg/80 px-1 rounded-sm z-10 border border-white/5 shadow-sm">
              {space}
            </div>

            {/* Icon */}
            <div className="relative w-full flex-1 flex items-center justify-center mt-2">
              <img
                src={iconPath}
                onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden'); }}
                alt={unitName}
                className={`max-w-full max-h-[55px] object-contain drop-shadow-lg transition-transform ${isFull ? '' : 'group-hover:scale-105'}`}
              />
              <div className="hidden w-full h-full flex items-center justify-center bg-black/20 rounded-full border border-white/5">
                <CatIcon size={24} className="text-skin-muted opacity-50" />
              </div>
              
              {/* Selected Count Badge */}
              {count > 0 && !isFull && (
                <div className="absolute -bottom-1 -right-1 bg-skin-primary text-black font-black text-[10px] w-5 h-5 flex items-center justify-center rounded-full border border-skin-bg shadow-sm animate-in zoom-in">
                  {count}
                </div>
              )}
            </div>

            {/* Name */}
            <div className="text-center w-full mt-1 mb-1">
              <div className="text-[10px] font-bold text-skin-text truncate leading-tight px-1">{unitName}</div>
            </div>

            {/* Full Overlay */}
            {isFull && (
              <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center backdrop-blur-[1px] z-20">
                <span className="text-xs font-bold text-red-200 uppercase drop-shadow-md border border-red-500/30 px-2 py-0.5 rounded bg-black/40">Full</span>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
