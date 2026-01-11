'use client';

import { ReactNode, useState } from "react";

interface StatBarProps {
  label: string;
  v1: number;
  v2: number;
  icon: ReactNode;
  imageUrl?: string; // Optional: Path to real asset (e.g., "/assets/icons/king.png")
}

export default function StatBar({ label, v1, v2, icon, imageUrl }: StatBarProps) {
  // State to track if the image failed to load
  const [imgError, setImgError] = useState(false);

  const total = v1 + v2 || 1;
  const p1Perc = Math.min((v1 / total) * 100, 100);
  
  // Determine winner: 1 = P1, 2 = P2, 0 = Draw
  const winState = v1 > v2 ? 1 : v2 > v1 ? 2 : 0;

  return (
    <div className="mb-5 last:mb-0">
      
      {/* Top Row: Values & Label */}
      <div className="flex items-end justify-between text-xs font-bold uppercase mb-2">
        
        {/* Player 1 Value */}
        <span className={`font-clash text-base transition-all ${winState === 1 ? 'text-skin-primary scale-110' : 'text-skin-muted'}`}>
          {v1}
        </span>

        {/* Center: Label & Icon */}
        <div className="flex flex-col items-center gap-1 -mb-1">
           {/* Icon Container */}
           <div className="w-8 h-8 flex items-center justify-center">
              {imageUrl && !imgError ? (
                <img 
                  src={imageUrl} 
                  alt={label}
                  className="w-full h-full object-contain drop-shadow-sm"
                  onError={() => setImgError(true)} // Revert to icon on error
                />
              ) : (
                <span className="text-skin-muted opacity-70">{icon}</span>
              )}
           </div>
           <span className="text-[10px] text-skin-muted/70 tracking-widest">{label}</span>
        </div>

        {/* Player 2 Value */}
        <span className={`font-clash text-base transition-all ${winState === 2 ? 'text-skin-secondary scale-110' : 'text-skin-muted'}`}>
          {v2}
        </span>
      </div>
      
      {/* Bar Container */}
      <div className="h-2.5 bg-[#151c24] rounded-full flex overflow-hidden border border-white/5 relative">
        
        {/* Background Marker (Center Line) */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-black/50 z-10 -translate-x-1/2"></div>

        {/* Player 1 Segment */}
        <div 
          style={{ width: `${p1Perc}%` }} 
          className={`h-full transition-all duration-1000 ease-out ${winState === 1 ? 'bg-skin-primary shadow-[0_0_10px_rgba(var(--color-primary),0.5)]' : 'bg-skin-primary/50'}`}
        ></div>
        
        {/* Player 2 Segment (Auto-fills remaining space) */}
        <div className={`flex-1 h-full transition-all duration-1000 ease-out ${winState === 2 ? 'bg-skin-secondary shadow-[0_0_10px_rgba(var(--color-secondary),0.5)]' : 'bg-skin-secondary/50'}`}></div>
      </div>
    </div>
  );
}
