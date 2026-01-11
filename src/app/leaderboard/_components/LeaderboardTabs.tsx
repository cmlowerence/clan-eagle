import { RankingType } from "./types";

interface LeaderboardTabsProps {
  type: RankingType;
  setType: (type: RankingType) => void;
}

export default function LeaderboardTabs({ type, setType }: LeaderboardTabsProps) {
  return (
    <div className="flex border-b border-white/10">
      <button 
        onClick={() => setType('clans')} 
        className={`flex-1 pb-3 text-sm font-bold uppercase tracking-widest transition-colors ${type === 'clans' ? 'text-skin-secondary border-b-2 border-skin-secondary' : 'text-skin-muted hover:text-white'}`}
      >
         Clans
      </button>
      <button 
        onClick={() => setType('players')} 
        className={`flex-1 pb-3 text-sm font-bold uppercase tracking-widest transition-colors ${type === 'players' ? 'text-skin-secondary border-b-2 border-skin-secondary' : 'text-skin-muted hover:text-white'}`}
      >
         Players
      </button>
   </div>
  );
}
