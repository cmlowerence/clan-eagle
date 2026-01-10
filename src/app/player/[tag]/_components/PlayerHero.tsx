import Link from "next/link";
import { ArrowLeft, Share2, Star, RefreshCw, Clock, ChevronRight, Trophy, Sword } from "lucide-react";
import { timeAgo } from "@/lib/utils";
import { PlayerData } from "./types";

interface PlayerHeroProps {
  player: PlayerData;
  isFav: boolean;
  onToggleFav: () => void;
  onRefresh: () => void;
  loading: boolean;
  onShare: () => void;
  isCached: boolean;
  timestamp: number | null;
}

export default function PlayerHero({ 
  player, isFav, onToggleFav, onRefresh, loading, onShare, isCached, timestamp 
}: PlayerHeroProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Action Bar */}
      <div className="flex justify-between items-center">
        <Link href="/" className="text-skin-muted text-xs flex items-center gap-1 hover:text-skin-primary">
          <ArrowLeft size={14} /> Home
        </Link>
        <div className="flex items-center gap-2">
          <button onClick={onShare} className="flex items-center justify-center w-8 h-8 rounded-full bg-skin-surface border border-skin-muted/30 text-skin-muted hover:text-skin-primary hover:border-skin-primary transition-all">
            <Share2 size={14} />
          </button>
          <button onClick={onToggleFav} className={`flex items-center justify-center w-8 h-8 rounded-full border transition-all ${isFav ? 'bg-skin-primary border-skin-primary text-black shadow-[0_0_10px_var(--color-primary)]' : 'bg-skin-surface border-skin-muted/30 text-skin-muted hover:text-skin-primary'}`}>
            <Star size={14} fill={isFav ? "currentColor" : "none"} />
          </button>
          <button onClick={onRefresh} className="flex items-center gap-2 bg-skin-surface border border-skin-primary/30 px-3 py-1.5 rounded-full hover:bg-skin-primary hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest">
            <RefreshCw size={10} className={loading ? "animate-spin" : ""} /> Update
          </button>
        </div>
      </div>

      {/* Main Banner */}
      <div className="bg-skin-surface/90 backdrop-blur-md border border-skin-primary/20 rounded-2xl p-5 relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-skin-bg via-transparent to-skin-primary/5"></div>
        <div className="relative z-10 flex flex-col md:flex-row gap-6">
          
          {/* Town Hall Image */}
          <div className="flex items-center gap-4 md:flex-col md:items-start md:gap-4 md:border-r border-skin-primary/10 md:pr-6">
            <div className="w-20 h-20 bg-skin-bg rounded-xl border-2 border-skin-primary/30 flex items-center justify-center relative shadow-inner shrink-0">
              <img 
                src={`/assets/icons/town_hall_${player.townHallLevel}.png`} 
                onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden'); }} 
                alt={`TH ${player.townHallLevel}`} 
                className="w-full h-full object-contain p-1 drop-shadow-xl" 
              />
              <div className="absolute -bottom-2 bg-skin-primary text-black text-xs font-black px-2 py-0.5 rounded border border-white/20">
                {player.townHallLevel}
              </div>
            </div>
            
            {/* Mobile Name View */}
            <div className="flex-1 min-w-0 md:hidden">
              <h1 className="text-2xl font-clash text-skin-text uppercase tracking-wide truncate">{player.name}</h1>
              <p className="text-skin-muted font-mono text-xs opacity-80">{player.tag}</p>
            </div>
          </div>

          {/* Details Column */}
          <div className="flex-1 flex flex-col justify-center">
            {/* Desktop Name View */}
            <div className="hidden md:block mb-2">
              <h1 className="text-4xl lg:text-5xl font-clash text-skin-text uppercase tracking-wide drop-shadow-sm">{player.name}</h1>
              <p className="text-skin-muted font-mono text-sm opacity-80">{player.tag}</p>
            </div>

            {/* Badges & Clan */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="bg-skin-bg text-skin-text text-[10px] font-bold uppercase px-2 py-1 rounded border border-skin-primary/20">{player.role}</span>
              <span className="bg-skin-bg text-skin-secondary text-[10px] font-bold uppercase px-2 py-1 rounded border border-skin-secondary/20">Lvl {player.expLevel}</span>

              {isCached && timestamp && (
                <span className="bg-black/20 text-skin-muted text-[10px] px-2 py-1 rounded flex items-center gap-1 border border-white/5">
                  <Clock size={10} /> {timeAgo(timestamp)}
                </span>
              )}

              {player.clan && (
                <Link href={`/clan/${encodeURIComponent(player.clan.tag)}`} className="flex items-center gap-2 bg-skin-bg border border-skin-muted/30 pl-1 pr-3 py-0.5 rounded-full hover:border-skin-primary hover:bg-skin-surface transition-all group ml-auto md:ml-0">
                  <img src={player.clan.badgeUrls.small} className="w-5 h-5 object-contain" alt="" />
                  <span className="text-[10px] font-bold text-skin-muted group-hover:text-skin-primary uppercase tracking-wider">{player.clan.name}</span>
                  <ChevronRight size={10} className="text-skin-muted" />
                </Link>
              )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 max-w-sm">
              <div className="bg-skin-bg/60 p-2 rounded-lg border border-skin-primary/10 flex items-center gap-3">
                {player.leagueTier ? <img src={player.leagueTier.iconUrls.small} className="w-8 h-8 drop-shadow" alt="League" /> : <Trophy size={24} className="text-skin-muted" />}
                <div>
                  <div className="text-[10px] uppercase text-skin-muted font-bold leading-none mb-1">Trophies</div>
                  <div className="text-sm font-clash text-white leading-none">{player.trophies}</div>
                </div>
              </div>
              <div className="bg-skin-bg/60 p-2 rounded-lg border border-skin-primary/10 flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center"><Sword size={20} className="text-orange-500" /></div>
                <div>
                  <div className="text-[10px] uppercase text-skin-muted font-bold leading-none mb-1">War Stars</div>
                  <div className="text-sm font-clash text-orange-500 leading-none">{player.warStars}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
