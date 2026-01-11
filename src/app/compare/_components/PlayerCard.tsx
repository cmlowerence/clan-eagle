import { RefreshCw } from "lucide-react";
import { PlayerData } from "./types";

interface PlayerCardProps {
  player: PlayerData | null;
  loading: boolean;
  label: string; // "Player 1" or "Player 2"
  colorClass: string; // 'bg-skin-primary' etc. for dynamic styling
  borderColor: string;
}

export default function PlayerCard({ player, loading, label, colorClass, borderColor }: PlayerCardProps) {
  // Determine card styling based on state
  const containerStyle = player
    ? `bg-skin-surface ${borderColor} shadow-[0_0_20px_rgba(var(--color-primary),0.1)]`
    : 'bg-skin-bg/50 border-dashed border-skin-muted/20';

  return (
    <div className={`relative p-4 rounded-xl border transition-colors overflow-hidden ${containerStyle} min-h-[350px] flex flex-col justify-center`}>
      {loading ? (
        <div className="flex flex-col items-center gap-2 text-skin-muted">
          <RefreshCw className="animate-spin" />
          <span className="text-xs uppercase font-bold">Loading...</span>
        </div>
      ) : player ? (
        <div className="text-center animate-in zoom-in duration-300 relative z-10">
          <h2 className="text-xl font-clash truncate text-skin-text">{player.name}</h2>
          <p className="text-xs text-skin-muted font-bold mb-4">{player.clan?.name || "No Clan"}</p>

          {/* Town Hall Visual */}
          <div className="relative w-24 h-24 mx-auto mb-2">
            <img
              src={`/assets/icons/town_hall_${player.townHallLevel}.png`}
              alt="TH"
              className="w-full h-full object-contain drop-shadow-2xl"
              onError={(e) => e.currentTarget.style.display = 'none'}
            />
            <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 ${colorClass} text-black text-xs font-black px-2 py-0.5 rounded border border-white/20 shadow-lg whitespace-nowrap`}>
              TH {player.townHallLevel}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center opacity-30 font-clash text-2xl uppercase">{label}</div>
      )}
    </div>
  );
}
