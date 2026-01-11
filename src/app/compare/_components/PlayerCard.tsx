'use client';

import { PlayerData } from "./types";
import { User, Shield } from "lucide-react";

interface PlayerCardProps {
  player: PlayerData | null;
  loading: boolean;
  label: string;
  colorClass: string; 
  borderColor: string;
}

export default function PlayerCard({ player, loading, label, colorClass, borderColor }: PlayerCardProps) {
  
  // Dynamic Background: Show a faint TH image if player exists, otherwise plain
  const bgImage = player ? `/assets/icons/town_hall_${player.townHallLevel}.png` : '';

  // Container Styles
  const baseClasses = "relative rounded-2xl overflow-hidden min-h-[400px] flex flex-col transition-all duration-500 border";
  const activeClasses = `bg-[#151c24] ${borderColor} shadow-2xl`;
  const emptyClasses = "bg-[#0d1218] border-white/5 border-dashed";

  // --- 1. SKELETON LOADER STATE (Replaces Loading Text) ---
  if (loading) {
    return (
      <div className={`${baseClasses} ${activeClasses} animate-pulse`}>
         {/* Fake Header */}
         <div className="h-32 bg-white/5 w-full"></div>
         {/* Fake Avatar Circle */}
         <div className="mx-auto -mt-12 w-24 h-24 bg-white/10 rounded-full border-4 border-[#151c24]"></div>
         {/* Fake Text Lines */}
         <div className="mt-4 px-8 space-y-3 flex flex-col items-center">
            <div className="h-6 bg-white/10 w-3/4 rounded"></div>
            <div className="h-4 bg-white/5 w-1/2 rounded"></div>
         </div>
      </div>
    );
  }

  // --- 2. DATA DISPLAY STATE ---
  return (
    <div className={`${baseClasses} ${player ? activeClasses : emptyClasses}`}>
      
      {player ? (
        <>
          {/* BACKGROUND FX */}
          <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
             {/* Gradient Overlay */}
             <div className={`absolute inset-0 bg-gradient-to-b from-${colorClass.replace('bg-','')} to-[#151c24]`}></div>
             {/* Giant Faded Icon */}
             <img src={bgImage} className="w-full h-full object-cover blur-sm scale-150 grayscale" alt="" />
          </div>

          {/* CARD HEADER (Town Hall Showcase) */}
          <div className="relative z-10 pt-10 pb-6 flex flex-col items-center">
             
             {/* Town Hall Image with Glow */}
             <div className="relative group">
                <div className={`absolute inset-0 ${colorClass} blur-2xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full`}></div>
                <img
                  src={`/assets/icons/town_hall_${player.townHallLevel}.png`}
                  alt={`TH ${player.townHallLevel}`}
                  className="relative w-32 h-32 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] z-10 transition-transform group-hover:scale-110 duration-500"
                  onError={(e) => e.currentTarget.style.display = 'none'}
                />
                
                {/* Level Badge */}
                <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 ${colorClass} text-black text-[10px] font-black px-3 py-1 rounded-full border border-white/20 shadow-lg whitespace-nowrap z-20`}>
                  TH {player.townHallLevel}
                </div>
             </div>

             {/* Player Name & Clan */}
             <div className="mt-6 text-center space-y-1 px-4">
                <h2 className="text-2xl md:text-3xl font-clash text-white tracking-wide truncate drop-shadow-md">
                  {player.name}
                </h2>
                <div className="flex items-center justify-center gap-2 text-skin-muted text-xs font-bold uppercase tracking-wider opacity-80">
                   <Shield size={12} />
                   {player.clan?.name || "No Clan"}
                </div>
                <p className="text-[10px] font-mono text-white/30">{player.tag}</p>
             </div>
          </div>

          {/* DECORATIVE BOTTOM (Gradient Fade) */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#151c24] to-transparent z-0"></div>
        </>
      ) : (
        /* --- 3. EMPTY STATE --- */
        <div className="flex flex-col items-center justify-center h-full opacity-30 gap-4">
           <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border-2 border-dashed border-white/20">
              <User size={32} />
           </div>
           <span className="font-clash text-2xl uppercase tracking-widest">{label}</span>
        </div>
      )}
    </div>
  );
}
