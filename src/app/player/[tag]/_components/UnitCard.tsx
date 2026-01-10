import React from "react";
import { Shield } from "lucide-react";
import TiltWrapper from "@/components/TiltWrapper";
import { getUnitIconPath } from "@/lib/unitHelpers";
import { Unit } from "./types";

interface UnitCardProps {
  unit: Unit;
  type?: string;
}

export default function UnitCard({ unit, type }: UnitCardProps) {
  const iconPath = getUnitIconPath(unit.name);
  const isMax = unit.level === unit.maxLevel;

  return (
    // TiltWrapper applied to all units for consistent feel
    <TiltWrapper isMax={isMax}>
      <div 
        className={`
          relative flex items-center gap-3 p-2 rounded-lg border transition-all overflow-hidden group h-full 
          hover:scale-[1.02] 
          ${isMax 
            ? 'bg-skin-surface border-skin-primary/30 shadow-[0_0_15px_-10px_var(--color-primary)]' 
            : 'bg-skin-surface border-skin-primary/10 hover:border-skin-primary/30'}
        `}
      >
        {/* Icon Container */}
        <div className="relative w-12 h-12 shrink-0">
          {isMax && (
            <div className="absolute inset-[-4px] rounded-lg overflow-hidden z-0">
              <div className="absolute inset-[-50%] bg-[conic-gradient(transparent,var(--color-primary),transparent_30%)] animate-spin-slow blur-sm opacity-100"></div>
              <div className="absolute inset-[2px] bg-skin-surface rounded-md"></div>
            </div>
          )}
          
          <div className="relative z-10 w-full h-full">
            <img 
              src={iconPath} 
              onError={(e) => { 
                e.currentTarget.style.display = 'none'; 
                e.currentTarget.nextElementSibling?.classList.remove('hidden'); 
              }} 
              alt={unit.name} 
              className={`object-contain w-full h-full drop-shadow-md transition-transform group-hover:scale-110 backface-hidden ${isMax ? 'brightness-110' : ''}`}
            />
            {/* Fallback Icon */}
            <div className="hidden absolute top-0 left-0 w-full h-full flex items-center justify-center text-skin-muted opacity-30">
              <Shield size={24} />
            </div>
            
            {/* Max Badge */}
            {isMax && (
              <div className="absolute -bottom-2 -right-2 bg-skin-primary text-black text-[7px] font-black px-1.5 py-0.5 rounded shadow-sm border border-white/20 z-20 scale-90">
                MAX
              </div>
            )}
          </div>
        </div>

        {/* Text Details */}
        <div className="flex-1 min-w-0 flex flex-col justify-center z-10">
          <h4 className="text-xs md:text-sm font-bold text-skin-text truncate leading-tight group-hover:text-skin-primary transition-colors">
            {unit.name}
          </h4>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${isMax ? 'bg-skin-primary text-black font-bold' : 'bg-black/30 text-skin-muted'}`}>
              Lvl {unit.level}
            </span>
          </div>
        </div>
      </div>
    </TiltWrapper>
  );
}