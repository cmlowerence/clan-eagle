import { ReactNode } from "react";

interface StatBarProps {
  label: string;
  v1: number;
  v2: number;
  icon: ReactNode;
}

export default function StatBar({ label, v1, v2, icon }: StatBarProps) {
  const total = v1 + v2 || 1;
  const p1Perc = (v1 / total) * 100;
  
  // Determine winner for highlighting: 1 = P1, 2 = P2, 0 = Draw
  const winState = v1 > v2 ? 1 : v2 > v1 ? 2 : 0;

  return (
    <div className="mb-4">
      <div className="flex justify-between text-xs font-bold uppercase mb-1">
        <span className={winState === 1 ? 'text-green-400 scale-110 transition-transform' : 'text-skin-muted'}>
          {v1}
        </span>
        <span className="flex items-center gap-1 text-skin-text">
          {icon} {label}
        </span>
        <span className={winState === 2 ? 'text-green-400 scale-110 transition-transform' : 'text-skin-muted'}>
          {v2}
        </span>
      </div>
      
      {/* Bar Container */}
      <div className="h-2 bg-skin-bg rounded-full flex overflow-hidden">
        {/* Player 1 Segment */}
        <div 
          style={{ width: `${p1Perc}%` }} 
          className={`h-full transition-all duration-1000 ${winState === 1 ? 'bg-green-500' : 'bg-skin-primary'}`}
        ></div>
        
        {/* Divider */}
        <div className="h-full w-0.5 bg-black"></div>
        
        {/* Player 2 Segment (Remaining Space) */}
        <div className="flex-1 h-full bg-skin-secondary opacity-50 transition-all duration-1000"></div>
      </div>
    </div>
  );
}
