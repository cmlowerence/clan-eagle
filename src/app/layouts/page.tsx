'use client';

import { supabase } from "@/lib/supabase";
import { useEffect, useState, useRef } from "react";
import { Copy, Map, Filter, ShieldCheck, ChevronDown, ArrowLeft, Castle, Sparkles } from "lucide-react";
import SkeletonLoader from "@/components/SkeletonLoader";
import Link from "next/link";

interface BaseLayout {
  id: string;
  title: string;
  town_hall: number;
  type: string;
  image_url: string;
  copy_link: string;
}

export default function LayoutsPage() {
  const [layouts, setLayouts] = useState<BaseLayout[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const [filterTH, setFilterTH] = useState<number | 'all'>('all');
  const [filterType, setFilterType] = useState<string | 'all'>('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const TOWN_HALLS = Array.from({ length: 16 }, (_, i) => 17 - i);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const { data, error } = await supabase.from('layouts').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        if (data) setLayouts(data);
      } catch (err: any) { setErrorMsg(err.message || "Failed to load layouts."); } finally { setLoading(false); }
    }
    fetchData();

    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = layouts.filter(base => {
    if (filterTH !== 'all' && base.town_hall !== filterTH) return false;
    if (filterType !== 'all' && base.type !== filterType) return false;
    return true;
  });

  const THIcon = ({ level, className }: { level: number, className?: string }) => (
    <div className={`relative flex items-center justify-center bg-[#0c1015] rounded-lg border border-white/10 overflow-hidden shadow-inner ${className}`}>
        <Castle className="text-skin-muted opacity-20 w-3/4 h-3/4" />
        <img 
            src={`/assets/icons/town_hall_${level}.png`} 
            alt={`TH${level}`}
            className="absolute inset-0 w-full h-full object-contain drop-shadow-md"
            onError={(e) => e.currentTarget.style.display = 'none'}
        />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-24 px-4 min-h-[80vh]">
       
       {/* --- HERO HEADER --- */}
       <div className="pt-8 pb-4 flex flex-col items-center relative gap-6">
          {/* Back Button */}
          <div className="w-full flex justify-start md:absolute md:left-0 md:top-8 z-20">
              <Link href="/" className="flex items-center gap-2 text-skin-muted hover:text-white transition-all group bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/5 hover:border-skin-primary/50">
                 <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform"/>
                 <span className="text-xs font-bold uppercase tracking-widest">Home</span>
              </Link>
          </div>

          <div className="text-center space-y-4 relative z-10">
             {/* Glow Effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-skin-primary/20 blur-[100px] rounded-full -z-10"></div>
            
            <h1 className="text-5xl md:text-7xl font-clash text-transparent bg-clip-text bg-gradient-to-b from-white to-skin-muted drop-shadow-xl tracking-tight">
                BASE LAYOUTS
            </h1>
            <p className="text-skin-muted text-sm md:text-base max-w-lg mx-auto leading-relaxed border-t border-white/5 pt-4">
                Curated <span className="text-skin-primary font-bold">Meta Defenses</span> for War, CWL, and Trophy Pushing. Copied directly to your game.
            </p>
          </div>
       </div>

       {/* --- GLASS FILTER BAR --- */}
       <div className="sticky top-20 z-40 flex justify-center">
         <div className="flex flex-col md:flex-row gap-2 md:gap-4 justify-center items-stretch md:items-center w-full max-w-3xl mx-auto bg-[#131b24]/80 backdrop-blur-xl p-2 rounded-2xl border border-white/10 shadow-2xl">
            
            {/* TH DROPDOWN */}
            <div className="relative w-full md:w-72" ref={dropdownRef}>
               <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full flex items-center justify-between bg-black/40 hover:bg-black/60 px-4 py-3 rounded-xl border border-white/5 hover:border-skin-primary/30 transition-all group"
               >
                  <div className="flex items-center gap-3">
                      {filterTH === 'all' ? (
                          <div className="w-9 h-9 flex items-center justify-center bg-white/5 rounded-lg"><Filter size={16} className="text-skin-muted"/></div>
                      ) : (
                          <THIcon level={filterTH as number} className="w-9 h-9" />
                      )}
                      <span className="text-sm font-bold text-white uppercase tracking-wide group-hover:text-skin-primary transition-colors">
                          {filterTH === 'all' ? "All Town Halls" : `Town Hall ${filterTH}`}
                      </span>
                  </div>
                  <ChevronDown size={16} className={`text-skin-muted transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}/>
               </button>

               {/* Dropdown Menu */}
               {isDropdownOpen && (
                  <div className="absolute top-full mt-2 left-0 w-full max-h-80 overflow-y-auto bg-[#1a232e] border border-white/10 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] z-50 custom-scrollbar animate-in fade-in zoom-in-95 duration-200">
                      <button 
                          onClick={() => { setFilterTH('all'); setIsDropdownOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 border-b border-white/5 text-left"
                      >
                          <div className="w-9 h-9 flex items-center justify-center bg-black/20 rounded-md"><Filter size={16} className="text-skin-muted"/></div>
                          <span className="text-sm font-bold text-skin-muted uppercase">All Levels</span>
                      </button>
                      
                      {TOWN_HALLS.map(th => (
                          <button 
                              key={th} 
                              onClick={() => { setFilterTH(th); setIsDropdownOpen(false); }}
                              className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-white/5 transition-colors text-left ${filterTH === th ? 'bg-skin-primary/10 border-l-4 border-skin-primary pl-3' : ''}`}
                          >
                              <THIcon level={th} className="w-9 h-9" />
                              <span className={`text-sm font-bold uppercase ${filterTH === th ? 'text-white' : 'text-skin-muted'}`}>Town Hall {th}</span>
                          </button>
                      ))}
                  </div>
               )}
            </div>

            {/* TYPE TOGGLES */}
            <div className="flex bg-black/40 p-1.5 rounded-xl border border-white/5 flex-1">
               {['all', 'War', 'Farm'].map((type) => (
                  <button 
                     key={type}
                     onClick={() => setFilterType(type as any)}
                     className={`flex-1 relative px-4 py-2.5 rounded-lg text-xs font-bold uppercase transition-all tracking-wider overflow-hidden group ${
                        filterType === type ? 'text-black shadow-lg' : 'text-skin-muted hover:text-white'
                     }`}
                  >
                     {filterType === type && (
                        <div className="absolute inset-0 bg-skin-primary rounded-lg transition-transform duration-300"></div>
                     )}
                     <span className="relative z-10">{type}</span>
                  </button>
               ))}
            </div>
         </div>
       </div>

       {loading && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{[...Array(6)].map((_, i) => <SkeletonLoader key={i} />)}</div>}

       {!loading && !errorMsg && filtered.length === 0 && (
          <div className="text-center py-24 opacity-60 flex flex-col items-center gap-4">
             <div className="w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-full flex items-center justify-center border border-white/5 shadow-inner">
                <Map size={48} className="text-skin-muted opacity-50"/>
             </div>
             <div>
                <p className="text-white font-clash text-2xl">No layouts found</p>
                <p className="text-skin-muted text-sm">No bases uploaded for TH{filterTH} yet.</p>
             </div>
             <button onClick={() => { setFilterTH('all'); setFilterType('all'); }} className="text-xs font-bold bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors">
                Reset Filters
             </button>
          </div>
       )}

       {/* --- PREMIUM GRID --- */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map(base => (
             <div key={base.id} className="group relative bg-[#151c24] rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-500 hover:-translate-y-2">
                
                {/* Glow Border on Hover */}
                <div className="absolute -inset-[1px] bg-gradient-to-b from-white/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                <div className="absolute -inset-[1px] bg-skin-primary/50 blur-md rounded-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none"></div>

                {/* Card Content Container */}
                <div className="relative bg-[#151c24] rounded-2xl overflow-hidden flex flex-col h-full border border-white/5 group-hover:border-skin-primary/30">
                    
                    {/* Image Area */}
                    <div className="aspect-[16/9] relative bg-[#0c1219] overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-[#151c24] via-transparent to-transparent z-10 opacity-80"></div>
                        
                        <img 
                            src={base.image_url} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:brightness-110" 
                            alt={base.title} 
                            onError={(e) => { e.currentTarget.style.display='none'; e.currentTarget.nextElementSibling?.classList.remove('hidden'); }}
                        />
                        
                        {/* Fallback */}
                        <div className="hidden absolute inset-0 flex flex-col items-center justify-center text-skin-muted bg-[#0c1219] gap-3">
                            <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center border border-white/5 shadow-inner">
                                <ShieldCheck size={28} className="text-skin-muted opacity-30"/>
                            </div>
                            <span className="text-[10px] font-mono opacity-30 uppercase tracking-widest">Preview Missing</span>
                        </div>

                        {/* Floating Badges */}
                        <div className="absolute top-3 right-3 z-20 flex gap-2">
                            <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg border border-white/10 shadow-lg flex items-center gap-1">
                                <Castle size={10} className="text-skin-primary"/> TH {base.town_hall}
                            </span>
                        </div>
                        <div className="absolute bottom-3 left-3 z-20">
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-lg backdrop-blur-md border ${
                                base.type === 'War' ? 'bg-red-500/20 text-red-200 border-red-500/30' : 
                                base.type === 'Farm' ? 'bg-green-500/20 text-green-200 border-green-500/30' : 
                                'bg-gray-500/20 text-gray-200 border-white/10'
                            }`}>
                                {base.type}
                            </span>
                        </div>
                    </div>
                    
                    {/* Body */}
                    <div className="p-5 flex flex-col flex-1 gap-4 relative z-20">
                        <div className="flex-1 space-y-2">
                            <h3 className="font-clash text-white text-xl leading-tight truncate group-hover:text-skin-primary transition-colors">
                                    {base.title}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-skin-muted/70">
                                <Sparkles size={12}/> <span>Verified Strategy</span>
                            </div>
                        </div>
                        
                        {/* Action Button */}
                        <div className="mt-auto pt-2">
                            <a 
                                href={base.copy_link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="group/btn relative flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#2a3a4b] to-[#1f2937] hover:from-skin-primary hover:to-skin-secondary text-white hover:text-black border border-white/10 hover:border-transparent font-sans text-sm py-3.5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_-5px_var(--color-primary)] font-bold uppercase tracking-wide overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                                <span className="relative z-10 flex items-center gap-2">
                                    <Copy size={16} /> Copy Base Link
                                </span>
                            </a>
                        </div>
                    </div>
                </div>
             </div>
          ))}
       </div>
    </div>
  )
}
