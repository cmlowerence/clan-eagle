import { Castle } from "lucide-react";

interface TownHallIconProps {
  level: number;
  className?: string;
}

export default function TownHallIcon({ level, className = "" }: TownHallIconProps) {
  return (
    <div className={`relative flex items-center justify-center bg-[#0c1015] rounded-lg border border-white/10 overflow-hidden shadow-inner ${className}`}>
        {/* Background Icon (Fallback visual) */}
        <Castle className="text-skin-muted opacity-20 w-3/4 h-3/4" />
        
        {/* Actual Image */}
        <img 
            src={`/assets/icons/town_hall_${level}.png`} 
            alt={`TH${level}`}
            className="absolute inset-0 w-full h-full object-contain drop-shadow-md"
            onError={(e) => e.currentTarget.style.display = 'none'}
        />
    </div>
  );
}
