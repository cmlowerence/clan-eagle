import { RefreshCw, Clock, Trophy, Swords } from "lucide-react";
import { timeAgo } from "@/lib/utils";
import { ClanData } from "./types";

interface ClanHeroProps {
  clan: ClanData;
  loading: boolean;
  isCached: boolean;
  timestamp: number | null;
  onRefresh: () => void;
}

export default function ClanHero({ clan, loading, isCached, timestamp, onRefresh }: ClanHeroProps) {
  return (
    <div className="relative bg-[#1a232e] border border-skin-primary/30 rounded-2xl overflow-hidden shadow-2xl">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900 via-transparent to-transparent pointer-events-none"></div>
      <div className="absolute -left-10 -bottom-20 w-64 h-64 bg-skin-primary/10 rounded-full blur-3xl"></div>

      {/* Top Bar: Cache & Refresh */}
      <div className="relative z-20 flex justify-between items-start p-4">
        <div className="flex gap-2">
          {isCached && timestamp && (
            <span className="text-[10px] text-skin-muted bg-black/40 px-2 py-1 rounded-md flex items-center gap-1 backdrop-blur-sm border border-white/5">
              <Clock size={10} /> Data cached {timeAgo(timestamp)}
            </span>
          )}
        </div>
        <button
          onClick={onRefresh}
          className="group flex items-center gap-2 bg-skin-primary/90 hover:bg-skin-primary text-white pl-3 pr-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-lg active:scale-95"
        >
          <RefreshCw size={14} className={`transition-transform ${loading ? "animate-spin" : "group-hover:rotate-180"}`} />
          {loading ? "Reloading..." : "Reload Clan Data"}
        </button>
      </div>

      {/* Main Info */}
      <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6 p-6 pb-8">
        <div className="relative shrink-0">
          <div className="absolute inset-0 bg-white/10 blur-2xl rounded-full"></div>
          <img
            src={clan.badgeUrls.large}
            alt={clan.name}
            className="w-32 h-32 md:w-40 md:h-40 object-contain relative z-10 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] transform hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-[10px] font-bold px-3 py-0.5 rounded-full border border-white/10 backdrop-blur-md whitespace-nowrap">
            Lvl {clan.clanLevel}
          </div>
        </div>

        <div className="flex-1 text-center md:text-left space-y-2">
          <h1 className="text-4xl md:text-6xl font-clash text-white tracking-wide uppercase drop-shadow-md leading-none">
            {clan.name}
          </h1>
          <div className="flex flex-wrap justify-center md:justify-start gap-3 items-center">
            <span className="text-skin-muted font-mono text-xs tracking-wider opacity-70">{clan.tag}</span>
            <div className="h-4 w-px bg-white/10"></div>
            <div className="flex items-center gap-1 text-xs font-bold text-[#ffd700]">
              <Trophy size={14} /> {clan.clanPoints}
            </div>
            {clan.warLeague && (
              <span className="bg-[#1e293b] text-blue-200 px-2 py-0.5 rounded text-[10px] border border-blue-500/30 font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                <Swords size={10} /> {clan.warLeague.name}
              </span>
            )}
          </div>
          <p className="text-skin-muted text-sm max-w-xl leading-relaxed mt-3 line-clamp-3 md:line-clamp-none">
            {clan.description}
          </p>
        </div>
      </div>

      {/* Quick Stats Footer */}
      <div className="bg-[#131b24]/80 backdrop-blur-md border-t border-white/5 p-4 grid grid-cols-4 gap-2 text-center divide-x divide-white/5">
        <div>
          <div className="text-[10px] text-skin-muted uppercase font-bold tracking-widest mb-1">Members</div>
          <div className="text-lg font-clash text-white">{clan.members}/50</div>
        </div>
        <div>
          <div className="text-[10px] text-skin-muted uppercase font-bold tracking-widest mb-1">War Wins</div>
          <div className="text-lg font-clash text-green-400">{clan.warWins}</div>
        </div>
        <div>
          <div className="text-[10px] text-skin-muted uppercase font-bold tracking-widest mb-1">Streak</div>
          <div className="text-lg font-clash text-orange-400 flex items-center justify-center gap-1">
            {clan.warWinStreak} <span className="text-[10px] font-sans opacity-50">🔥</span>
          </div>
        </div>
        <div>
          <div className="text-[10px] text-skin-muted uppercase font-bold tracking-widest mb-1">Location</div>
          <div className="text-sm font-bold text-white truncate px-1">{clan.location?.name || "International"}</div>
        </div>
      </div>
    </div>
  );
}
