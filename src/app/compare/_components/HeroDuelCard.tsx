'use client';

import { Crown } from "lucide-react";

interface HeroDuelCardProps {
  label: string;
  img: string;
  lvl1: number;
  lvl2: number;
}

export default function HeroDuelCard({ label, img, lvl1, lvl2 }: HeroDuelCardProps) {
  // Simple comparison for visual highlights
  const w1 = lvl1 > lvl2;
  const w2 = lvl2 > lvl1;
  
  return (
    <div className="relative bg-[#1a232e] border border-white/5 rounded-xl overflow-hidden group hover:border-white/10 transition-colors">
      {/* Dynamic Background Gradient based on winner */}
      <div className={`absolute inset-0 opacity-10 transition-colors duration-500 ${w1 ? 'bg-gradient-to-r from-skin-primary to-transparent' : w2 ? 'bg-gradient-to-l from-skin-secondary to-transparent' : 'bg-transparent'}`}></div>

      <div className="relative z-10 p-3 flex items-center justify-between">
        
        {/* Player 1 Level */}
        <div className="flex flex-col items-center gap-1 w-12">
           <span className={`font-clash text-xl ${w1 ? 'text-skin-primary scale-110' : 'text-white/50'} transition-all`}>
             {lvl1}
           </span>
           {w1 && <Crown size={10} className="text-skin-primary animate-bounce"/>}
        </div>

        {/* Hero Image (Centerpiece) */}
        <div className="flex flex-col items-center gap-2 -mt-2">
           <div className="w-16 h-16 drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)] transition-transform group-hover:scale-105">
              <img 
                src={img} 
                alt={label} 
                className="w-full h-full object-contain"
                onError={(e) => e.currentTarget.style.opacity = '0.3'} 
              />
           </div>
           <span className="text-[10px] uppercase font-bold text-skin-muted tracking-widest">{label}</span>
        </div>

        {/* Player 2 Level */}
        <div className="flex flex-col items-center gap-1 w-12">
           <span className={`font-clash text-xl ${w2 ? 'text-skin-secondary scale-110' : 'text-white/50'} transition-all`}>
             {lvl2}
           </span>
           {w2 && <Crown size={10} className="text-skin-secondary animate-bounce"/>}
        </div>
      </div>
      
      {/* Bottom Bar Indicator */}
      <div className="h-1 w-full flex bg-black/50">
         <div className={`h-full transition-all duration-700 ${w1 ? 'bg-skin-primary' : 'bg-transparent'}`} style={{ width: '50%' }}></div>
         <div className={`h-full transition-all duration-700 ${w2 ? 'bg-skin-secondary' : 'bg-transparent'}`} style={{ width: '50%' }}></div>
      </div>
    </div>
  );
}
