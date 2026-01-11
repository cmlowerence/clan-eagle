'use client';

import { Crown, Sparkles, Trophy } from "lucide-react";
import { WinnerData } from "./types";

export default function WinnerBanner({ winner, isPlayer1 }: { winner: WinnerData; isPlayer1: boolean }) {
  if (!winner || !winner.tag) return null;

  // Dynamic visual styles based on who won
  const theme = isPlayer1
    ? {
        bg: 'bg-gradient-to-r from-skin-primary/20 via-skin-primary/10 to-transparent',
        border: 'border-skin-primary/50',
        text: 'text-skin-primary',
        glow: 'shadow-[0_0_30px_rgba(var(--color-primary),0.2)]',
        iconBg: 'bg-skin-primary text-black'
      }
    : {
        bg: 'bg-gradient-to-l from-skin-secondary/20 via-skin-secondary/10 to-transparent',
        border: 'border-skin-secondary/50',
        text: 'text-skin-secondary',
        glow: 'shadow-[0_0_30px_rgba(var(--color-secondary),0.2)]',
        iconBg: 'bg-skin-secondary text-white'
      };

  return (
    <div className={`relative p-1 rounded-2xl overflow-hidden animate-in zoom-in duration-500 ${theme.glow}`}>
      
      {/* Animated Border Gradient */}
      <div className={`absolute inset-0 opacity-50 ${theme.bg}`}></div>
      
      <div className={`relative z-10 bg-[#151c24] border ${theme.border} rounded-xl p-6 flex flex-col md:flex-row items-center justify-center gap-6 text-center md:text-left`}>
        
        {/* Left: Trophy Icon */}
        <div className="relative">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${theme.iconBg} animate-bounce`}>
                <Trophy size={32} fill="currentColor" />
            </div>
            <div className="absolute -top-2 -right-2 text-yellow-400 animate-pulse">
                <Sparkles size={20} />
            </div>
        </div>

        {/* Center: Text Info */}
        <div className="flex-1 space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-2 text-skin-muted uppercase text-xs font-bold tracking-[0.2em]">
                <Crown size={14} className={theme.text} />
                Statistical Winner
                <Crown size={14} className={theme.text} />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-clash text-white drop-shadow-md">
                {winner.name}
            </h2>
            
            <p className="text-sm text-skin-muted opacity-60 font-mono">
                {winner.tag}
            </p>
        </div>

        {/* Right: Score Badge */}
        <div className="text-center bg-black/30 p-3 rounded-lg border border-white/5 min-w-[100px]">
            <span className="text-[10px] text-skin-muted uppercase font-bold">Total Score</span>
            <div className={`text-3xl font-clash ${theme.text}`}>
                {winner.score}
            </div>
        </div>

      </div>
    </div>
  );
}
