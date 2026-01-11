import { Filter } from "lucide-react";

interface StrategyFilterProps {
  currentFilter: number | 'all';
  setFilter: (val: number | 'all') => void;
}

export default function StrategyFilter({ currentFilter, setFilter }: StrategyFilterProps) {
  // Town Hall range 17-2
  const TOWN_HALLS = Array.from({ length: 16 }, (_, i) => 17 - i);

  return (
    <div className="flex justify-center sticky top-20 z-40">
      <div className="flex items-center gap-3 bg-[#131b24]/90 backdrop-blur-xl px-2 py-2 rounded-2xl border border-white/10 shadow-2xl overflow-x-auto max-w-full no-scrollbar">
        <div className="pl-4 pr-2 flex items-center gap-2 text-skin-muted">
          <Filter size={16} className="shrink-0" />
          <span className="text-xs font-bold uppercase shrink-0">Filter:</span>
        </div>
        <div className="flex gap-1 pr-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${currentFilter === 'all' ? 'bg-skin-primary text-black shadow-lg scale-105' : 'bg-white/5 text-skin-muted hover:text-white hover:bg-white/10'}`}
          >
            ALL
          </button>
          {TOWN_HALLS.map(th => (
            <button
              key={th}
              onClick={() => setFilter(th)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${currentFilter === th ? 'bg-skin-primary text-black shadow-lg scale-105' : 'bg-white/5 text-skin-muted hover:text-white hover:bg-white/10'}`}
            >
              {th}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
