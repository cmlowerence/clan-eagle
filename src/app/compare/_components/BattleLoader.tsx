'use client';

import { Sword } from "lucide-react";

export default function BattleLoader() {
  return (
    <div className="flex flex-col items-center justify-center animate-in zoom-in duration-300">
      
      {/* The Clashing Swords */}
      <div className="relative w-24 h-24 flex items-center justify-center">
        {/* Left Sword - Animates from left to center */}
        <div className="absolute text-red-500 animate-[pulse_0.5s_ease-in-out_infinite] [animation-direction:alternate]">
             <Sword 
               size={64} 
               className="transform -scale-x-100 rotate-45 origin-bottom-left animate-[spin_1s_ease-in-out_infinite] [animation-direction:alternate]"
               fill="currentColor"
             />
        </div>

        {/* Right Sword - Animates from right to center */}
        <div className="absolute text-orange-500 animate-[pulse_0.5s_ease-in-out_infinite] [animation-direction:alternate] delay-75">
             <Sword 
               size={64} 
               className="transform rotate-45 origin-bottom-right animate-[spin_1s_ease-in-out_infinite] [animation-direction:alternate-reverse]" 
               fill="currentColor"
             />
        </div>
        
        {/* Spark/Impact Effect Center */}
        <div className="absolute w-full h-full bg-orange-500/20 blur-xl rounded-full animate-pulse"></div>
      </div>

      <div className="mt-2 text-xs font-black uppercase tracking-[0.3em] text-orange-500 animate-pulse">
        Simulating Battle...
      </div>
    </div>
  );
}
