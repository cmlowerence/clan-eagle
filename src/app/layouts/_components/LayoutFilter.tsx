import { useState, useRef, useEffect } from "react";
import { Filter, ChevronDown } from "lucide-react";
import TownHallIcon from "./TownHallIcon";
import { FilterType } from "./types";

interface LayoutFilterProps {
  currentTH: number | 'all';
  setTH: (th: number | 'all') => void;
  currentType: FilterType | 'all';
  setType: (type: FilterType | 'all') => void;
}

export default function LayoutFilter({ currentTH, setTH, currentType, setType }: LayoutFilterProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Generate TH levels 17 down to 2
  const TOWN_HALLS = Array.from({ length: 16 }, (_, i) => 17 - i);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="sticky top-20 z-40 flex justify-center">
      <div className="flex flex-col md:flex-row gap-2 md:gap-4 justify-center items-stretch md:items-center w-full max-w-3xl mx-auto bg-[#131b24]/80 backdrop-blur-xl p-2 rounded-2xl border border-white/10 shadow-2xl">
         
         {/* --- Town Hall Dropdown --- */}
         <div className="relative w-full md:w-72" ref={dropdownRef}>
            <button 
               onClick={() => setIsDropdownOpen(!isDropdownOpen)}
               className="w-full flex items-center justify-between bg-black/40 hover:bg-black/60 px-4 py-3 rounded-xl border border-white/5 hover:border-skin-primary/30 transition-all group"
            >
               <div className="flex items-center gap-3">
                   {currentTH === 'all' ? (
                       <div className="w-9 h-9 flex items-center justify-center bg-white/5 rounded-lg"><Filter size={16} className="text-skin-muted"/></div>
                   ) : (
                       <TownHallIcon level={currentTH} className="w-9 h-9" />
                   )}
                   <span className="text-sm font-bold text-white uppercase tracking-wide group-hover:text-skin-primary transition-colors">
                       {currentTH === 'all' ? "All Town Halls" : `Town Hall ${currentTH}`}
                   </span>
               </div>
               <ChevronDown size={16} className={`text-skin-muted transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}/>
            </button>

            {/* Dropdown Options */}
            {isDropdownOpen && (
               <div className="absolute top-full mt-2 left-0 w-full max-h-80 overflow-y-auto bg-[#1a232e] border border-white/10 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] z-50 custom-scrollbar animate-in fade-in zoom-in-95 duration-200">
                   <button 
                       onClick={() => { setTH('all'); setIsDropdownOpen(false); }}
                       className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 border-b border-white/5 text-left"
                   >
                       <div className="w-9 h-9 flex items-center justify-center bg-black/20 rounded-md"><Filter size={16} className="text-skin-muted"/></div>
                       <span className="text-sm font-bold text-skin-muted uppercase">All Levels</span>
                   </button>
                   
                   {TOWN_HALLS.map(th => (
                       <button 
                           key={th} 
                           onClick={() => { setTH(th); setIsDropdownOpen(false); }}
                           className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-white/5 transition-colors text-left ${currentTH === th ? 'bg-skin-primary/10 border-l-4 border-skin-primary pl-3' : ''}`}
                       >
                           <TownHallIcon level={th} className="w-9 h-9" />
                           <span className={`text-sm font-bold uppercase ${currentTH === th ? 'text-white' : 'text-skin-muted'}`}>Town Hall {th}</span>
                       </button>
                   ))}
               </div>
            )}
         </div>

         {/* --- Type Toggles (War/Farm) --- */}
         <div className="flex bg-black/40 p-1.5 rounded-xl border border-white/5 flex-1">
            {['all', 'War', 'Farm'].map((type) => (
               <button 
                  key={type}
                  onClick={() => setType(type as any)}
                  className={`flex-1 relative px-4 py-2.5 rounded-lg text-xs font-bold uppercase transition-all tracking-wider overflow-hidden group ${
                     currentType === type ? 'text-black shadow-lg' : 'text-skin-muted hover:text-white'
                  }`}
               >
                  {currentType === type && (
                     <div className="absolute inset-0 bg-skin-primary rounded-lg transition-transform duration-300"></div>
                  )}
                  <span className="relative z-10">{type}</span>
               </button>
            ))}
         </div>
      </div>
    </div>
  );
}
