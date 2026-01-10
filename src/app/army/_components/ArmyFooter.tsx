import { Share2 } from "lucide-react";

interface Props {
  stats: { troopSpace: number; spellSpace: number; siegeCount: number };
  caps: { troops: number; spells: number; sieges: number };
  generateLink: () => string;
  hasUnits: boolean;
}

export default function ArmyFooter({ stats, caps, generateLink, hasUnits }: Props) {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-skin-surface/95 backdrop-blur-md border-t border-skin-primary/20 p-3 z-[60] pb-6 md:pb-4 shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Stats Container */}
        <div className="flex items-center justify-around md:justify-start gap-6 text-sm w-full md:w-auto px-2">
          
          <StatItem label="Troops" current={stats.troopSpace} max={caps.troops} colorClass={stats.troopSpace > caps.troops ? 'text-red-500' : stats.troopSpace === caps.troops ? 'text-green-400' : 'text-skin-text'} />
          
          <div className="h-6 w-px bg-white/10 hidden md:block"></div>
          
          <StatItem label="Spells" current={stats.spellSpace} max={caps.spells} colorClass={stats.spellSpace > caps.spells ? 'text-red-500' : stats.spellSpace === caps.spells ? 'text-green-400' : 'text-skin-secondary'} />
          
          <div className="h-6 w-px bg-white/10 hidden md:block"></div>
          
          <StatItem label="Sieges" current={stats.siegeCount} max={caps.sieges} colorClass={stats.siegeCount > caps.siegeCount ? 'text-red-500' : stats.siegeCount === caps.sieges ? 'text-green-400' : 'text-orange-500'} />
        
        </div>

        {/* Action Button */}
        <a href={generateLink()} className={`w-full md:w-auto bg-green-600 hover:bg-green-500 text-white font-black uppercase py-3 px-8 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-green-900/40 border-b-4 border-green-800 active:border-b-0 active:translate-y-1 ${!hasUnits ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
          <Share2 size={18} /> Train Army
        </a>
      </div>
    </div>
  );
}

function StatItem({ label, current, max, colorClass }: any) {
  return (
    <div className="flex flex-col items-center md:items-start">
      <span className="text-[9px] text-skin-muted uppercase font-bold tracking-wider">{label}</span>
      <span className={`font-clash text-xl leading-none ${colorClass}`}>
        {current}<span className="text-skin-muted text-sm">/{max}</span>
      </span>
    </div>
  );
}
