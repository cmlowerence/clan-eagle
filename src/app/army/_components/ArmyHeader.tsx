import Link from "next/link";
import { ArrowLeft, ChevronDown, Trash2, AlertTriangle } from "lucide-react";
import { useState } from "react";

interface Props {
  thLevel: number;
  setThLevel: (level: number) => void;
  clearArmy: () => void;
  hasUnits: boolean;
  superCount: number;
}

export default function ArmyHeader({ thLevel, setThLevel, clearArmy, hasUnits, superCount }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 relative z-50">
      <div className="flex items-center justify-between w-full md:w-auto">
        <Link href="/" className="flex items-center gap-2 text-skin-muted hover:text-skin-primary transition-colors">
          <ArrowLeft size={18} /> <span className="font-bold">Back</span>
        </Link>
        <h1 className="text-xl md:text-2xl font-clash text-skin-text uppercase tracking-wider ml-4">Army Planner</h1>
      </div>

      <div className="flex items-center gap-3 self-end md:self-auto">
        {superCount >= 2 && (
          <div className="flex items-center gap-1 text-[10px] text-orange-500 bg-orange-500/10 px-2 py-1 rounded border border-orange-500/20 font-bold animate-pulse whitespace-nowrap">
            <AlertTriangle size={12} /> Super Limit (2/2)
          </div>
        )}
        
        {/* TH Selector */}
        <div className="relative">
          <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 bg-skin-surface border border-skin-primary/30 pl-2 pr-3 py-1.5 rounded-lg hover:border-skin-primary transition-colors">
            <img src={`/assets/icons/town_hall_${thLevel}.png`} alt={`TH${thLevel}`} className="w-8 h-8 object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
            <div className="text-left">
              <div className="text-[9px] text-skin-muted font-bold uppercase">Town Hall</div>
              <div className="text-sm font-clash text-skin-text leading-none">{thLevel}</div>
            </div>
            <ChevronDown size={14} className="text-skin-muted" />
          </button>
          
          {isOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 max-h-60 overflow-y-auto bg-skin-surface border border-skin-primary/20 rounded-xl shadow-xl z-50 p-2 custom-scrollbar">
              {[...Array(17)].map((_, i) => {
                const lvl = 17 - i;
                return (
                  <button key={lvl} onClick={() => { setThLevel(lvl); setIsOpen(false); }} className={`flex items-center gap-3 w-full p-2 rounded hover:bg-skin-bg text-left ${thLevel === lvl ? 'bg-skin-primary/10 border border-skin-primary/30' : ''}`}>
                    <img src={`/assets/icons/town_hall_${lvl}.png`} className="w-6 h-6 object-contain" alt="" />
                    <span className="font-bold text-sm text-skin-text">TH {lvl}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <button onClick={clearArmy} disabled={!hasUnits} className="p-2 text-red-400 hover:bg-red-400/10 rounded-full transition-colors disabled:opacity-30">
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
