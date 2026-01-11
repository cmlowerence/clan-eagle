import Link from "next/link";
import { RefreshCw, Clock, Trophy, Swords, ArrowLeft } from "lucide-react";
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
    // Main Container: 90% Opacity with Blur for "Glass" effect over your slider
    <div className="relative bg-[#1a232e]/90 backdrop-blur-md border border-skin-primary/30 rounded-2xl overflow-hidden shadow-2xl">
      
      {/* Visual Effects: Subtle gradients to add depth without blocking readability */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900 via-transparent to-transparent pointer-events-none"></div>
      <div className="absolute -left-10 -bottom-20 w-64 h-64 bg-skin-primary/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* --- TOP BAR: Navigation & Controls --- */}
      <div className="relative z-20 flex justify-between items-start p-4 md:p-6">
        
        {/* Left Side: Home Link & Cache Badge */}
        <div className="flex flex-col gap-2 items-start">
            <Link 
              href="/" 
              className="group flex items-center gap-1.5 text-xs font-bold text-skin-muted hover:text-white transition-colors bg-black/20 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/5"
            >
                <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> 
                Home
            </Link>

            {isCached && timestamp && (
                <span className="inline-flex items-center gap-1.5 text-[10px] text-skin-muted bg-black/30 px-2 py-1 rounded-md border border-white/5 animate-in fade-in">
                    <Clock size={10} /> 
                    <span>Cached {timeAgo(timestamp)}</span>
                </span>
            )}
        </div>

        {/* Right Side: Refresh Button */}
        <button
          onClick={onRefresh}
          className="group flex items-center gap-2 bg-skin-primary hover:bg-skin-secondary text-black pl-3 pr-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-lg active:scale-95 hover:shadow-skin-primary/20"
        >
          <RefreshCw size={14} className={`transition-transform ${loading ? "animate-spin" : "group-hover:rotate-180"}`} />
          {loading ? "Reloading..." : "Refresh"}
        </button>
      </div>

      {/* --- HERO CONTENT --- */}
      <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6 p-6 pb-8">
        
        {/* Clan Badge with Level */}
        <div className="relative shrink-0 group">
          {/* Glow behind badge */}
          <div className="absolute inset-0 bg-white/5 blur-2xl rounded-full scale-110 group-hover:scale-125 transition-transform"></div>
          
          <img
            src={clan.badgeUrls.large}
            alt={clan.name}
            className="w-32 h-32 md:w-40 md:h-40 object-contain relative z-10 drop-shadow-2xl transform group-hover:scale-105 transition-transform duration-500"
          />
          
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#131b24] text-white text-[10px] font-black px-3 py-0.5 rounded-full border border-skin-primary/30 shadow-lg whitespace-nowrap z-20">
            LVL {clan.clanLevel}
          </div>
        </div>

        {/* Text Details */}
        <div className="flex-1 text-center md:text-left space-y-3">
          
          {/* Title & Tag */}
          <div>
            <h1 className="text-4xl md:text-6xl font-clash text-white tracking-wide uppercase drop-shadow-md leading-none">
              {clan.name}
            </h1>
            <p className="text-skin-muted font-mono text-xs tracking-wider opacity-60 mt-1">{clan.tag}</p>
          </div>

          {/* Key Indicators */}
          <div className="flex flex-wrap justify-center md:justify-start gap-3 items-center">
            {/* Clan Points */}
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#ffd700] bg-[#ffd700]/10 px-2 py-1 rounded border border-[#ffd700]/20">
              <Trophy size={14} /> {clan.clanPoints}
            </div>
            
            {/* War League */}
            {clan.warLeague && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-blue-200 bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20 uppercase tracking-wide">
                <Swords size={12} /> {clan.warLeague.name}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-skin-muted text-sm max-w-xl leading-relaxed opacity-90 line-clamp-3 md:line-clamp-none mx-auto md:mx-0">
            {clan.description}
          </p>
        </div>
      </div>

      {/* --- FOOTER STATS --- */}
      <div className="bg-[#131b24]/60 backdrop-blur-sm border-t border-white/5 p-4 grid grid-cols-4 gap-2 text-center divide-x divide-white/5">
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
          <div className="text-sm font-bold text-white truncate px-2">{clan.location?.name || "Global"}</div>
        </div>
      </div>

    </div>
  );
}
