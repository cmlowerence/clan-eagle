import { Globe, MapPin } from "lucide-react";
import { LocationType, LOCATIONS } from "./types";

interface LeaderboardHeaderProps {
  location: LocationType;
  setLocation: (loc: LocationType) => void;
}

export default function LeaderboardHeader({ location, setLocation }: LeaderboardHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
      <div>
         <h1 className="text-3xl font-clash text-white uppercase tracking-wide">Leaderboards</h1>
         <p className="text-skin-muted text-sm">Top 20 Rankings</p>
      </div>

      <div className="flex bg-[#1f2937] p-1 rounded-lg border border-white/10">
         {/* Global Button */}
         <button 
            onClick={() => setLocation('global')} 
            className={`px-4 py-2 rounded-md text-xs font-bold uppercase flex items-center gap-2 transition-all ${location === 'global' ? 'bg-skin-primary text-black' : 'text-skin-muted hover:text-white'}`}
         >
            <Globe size={14}/> Global
         </button>
         
         {/* Local Button */}
         <button 
            onClick={() => setLocation('local')} 
            className={`px-4 py-2 rounded-md text-xs font-bold uppercase flex items-center gap-2 transition-all ${location === 'local' ? 'bg-skin-primary text-black' : 'text-skin-muted hover:text-white'}`}
         >
            <MapPin size={14}/> {LOCATIONS.local.name}
         </button>
      </div>
   </div>
  );
}
