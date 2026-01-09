'use client';

import { supabase } from "@/lib/supabase";
import { useEffect, useState, useRef } from "react";
import { Copy, Map, Filter, ShieldCheck, ExternalLink, ChevronDown, ArrowLeft, Castle } from "lucide-react";
import SkeletonLoader from "@/components/SkeletonLoader";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  
  // Filter States
  const [filterTH, setFilterTH] = useState<number | 'all'>('all');
  const [filterType, setFilterType] = useState<string | 'all'>('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Town Hall List (17 down to 2)
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

    // Click outside handler for dropdown
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

  // Helper to render TH Icon with Fallback
  const THIcon = ({ level, className }: { level: number, className?: string }) => (
    <div className={`relative flex items-center justify-center bg-black/20 rounded-md overflow-hidden ${className}`}>
        {/* Placeholder Icon (Generic Castle) */}
        <Castle className="text-skin-muted opacity-50 w-full h-full p-1" />
        
        {/* Real Image (Overlays placeholder if loads) */}
        <img 
            src={`/assets/icons/town_hall_${level}.png`} 
            alt={`TH${level}`}
            className="absolute inset-0 w-full h-full object-contain"
            onError={(e) => e.currentTarget.style.display = 'none'}
        />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-24 px-4 min-h-[80vh]">
       
       {/* --- HEADER --- */}
       <div className="pt-6 flex flex-col items-center relative">
          {/* Back Button */}
          <Link href="/" className="absolute left-0 top-6 flex items-center gap-2 text-skin-muted hover:text-skin-primary transition-colors group">
             <div className="p-2 bg-[#1f2937] rounded-full border border-white/5 group-hover:border-skin-primary/30">
                <ArrowLeft size={18} />
             </div>
             <span className="hidden md:inline text-sm font-bold uppercase tracking-widest">Home</span>
          </Link>

          <div className="text-center space-y-2 mt-2">
            <h1 className="text-4xl md:text-5xl font-clash text-white uppercase tracking-wide">
                Base Layouts
            </h1>
            <p className="text-skin-muted text-sm max-w-md mx-auto">
                Find the perfect defense. Copied straight to your game.
            </p>
          </div>
       </div>

       {/* --- CONTROLS --- */}
       <div className="flex flex-col md:flex-row gap-4 justify-center items-stretch md:items-center w-full max-w-2xl mx-auto z-20 relative">
          
          {/* CUSTOM TH DROPDOWN */}
          <div className="relative w-full md:w-64" ref={dropdownRef}>
             <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex items-center justify-between bg-[#1f2937] hover:bg-[#253041] px-4 py-3 rounded-xl border border-white/10 transition-colors"
             >
                <div className="flex items-center gap-3">
                    {filterTH === 'all' ? (
                        <div className="w-8 h-8 flex items-center justify-center bg-black/20 rounded-md"><Filter size={16} className="text-skin-muted"/></div>
                    ) : (
                        <THIcon level={filterTH as number} className="w-8 h-8" />
                    )}
                    <span className="text-sm font-bold text-white uppercase">
                        {filterTH === 'all' ? "All Town Halls" : `Town Hall ${filterTH}`}
                    </span>
                </div>
                <ChevronDown size={16} className={`text-skin-muted transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}/>
             </button>

             {/* Dropdown Menu */}
             {isDropdownOpen && (
                <div className="absolute top-full mt-2 left-0 w-full max-h-80 overflow-y-auto bg-[#1f2937] border border-white/10 rounded-xl shadow-2xl z-50 custom-scrollbar animate-in fade-in slide-in-from-top-2">
                    <button 
                        onClick={() => { setFilterTH('all'); setIsDropdownOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 border-b border-white/5 text-left"
                    >
                        <div className="w-8 h-8 flex items-center justify-center bg-black/20 rounded-md"><Filter size={16} className="text-skin-muted"/></div>
                        <span className="text-sm font-bold text-skin-muted uppercase">All Levels</span>
                    </button>
                    
                    {TOWN_HALLS.map(th => (
                        <button 
                            key={th} 
                            onClick={() => { setFilterTH(th); setIsDropdownOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-white/5 transition-colors text-left ${filterTH === th ? 'bg-skin-primary/10 border-l-2 border-skin-primary' : ''}`}
                        >
                            <THIcon level={th} className="w-8 h-8" />
                            <span className={`text-sm font-bold uppercase ${filterTH === th ? 'text-white' : 'text-skin-muted'}`}>Town Hall {th}</span>
                        </button>
                    ))}
                </div>
             )}
          </div>

          {/* Type Toggles (Plain Buttons) */}
          <div className="flex bg-[#1f2937] p-1 rounded-xl border border-white/10">
             {['all', 'War', 'Farm'].map((type) => (
                <button 
                   key={type}
                   onClick={() => setFilterType(type as any)}
                   className={`flex-1 px-4 py-2.5 rounded-lg text-xs font-bold uppercase transition-all tracking-wider ${
                      filterType === type 
                        ? 'bg-skin-primary text-black shadow-md' 
                        : 'text-skin-muted hover:text-white hover:bg-white/5'
                   }`}
                >
                   {type}
                </button>
             ))}
          </div>
       </div>

       {/* --- LOADING --- */}
       {loading && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{[...Array(6)].map((_, i) => <SkeletonLoader key={i} />)}</div>}

       {/* --- EMPTY STATE --- */}
       {!loading && !errorMsg && filtered.length === 0 && (
          <div className="text-center py-24 opacity-60 flex flex-col items-center gap-4">
             <div className="w-20 h-20 bg-[#1f2937] rounded-full flex items-center justify-center border border-white/5">
                <Map size={40} className="text-skin-muted"/>
             </div>
             <div>
                <p className="text-white font-clash text-xl">No layouts found</p>
                <p className="text-skin-muted text-sm">No bases uploaded for TH{filterTH} yet.</p>
             </div>
             <button onClick={() => { setFilterTH('all'); setFilterType('all'); }} className="text-xs text-skin-primary hover:text-skin-secondary underline decoration-dotted underline-offset-4 transition-colors">
                Reset Filters
             </button>
          </div>
       )}

       {/* --- GRID --- */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(base => (
             <div key={base.id} className="group bg-[#1a232e] border border-white/5 rounded-xl overflow-hidden hover:border-skin-primary/30 transition-all flex flex-col h-full shadow-lg">
                
                {/* Image Area */}
                <div className="aspect-[16/9] relative bg-[#0c1219] overflow-hidden border-b border-white/5">
                   <img 
                      src={base.image_url} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      alt={base.title} 
                      onError={(e) => { e.currentTarget.style.display='none'; e.currentTarget.nextElementSibling?.classList.remove('hidden'); }}
                   />
                   
                   {/* Fallback */}
                   <div className="hidden absolute inset-0 flex flex-col items-center justify-center text-skin-muted bg-[#0c1219] gap-2">
                      <ShieldCheck size={32} className="text-skin-muted opacity-20"/>
                      <span className="text-[10px] font-mono opacity-30 uppercase tracking-widest">No Preview</span>
                   </div>

                   {/* Plain Badges */}
                   <div className="absolute top-2 right-2">
                      <span className="bg-black/80 text-white text-[10px] font-bold px-2 py-1 rounded border border-white/10">TH {base.town_hall}</span>
                   </div>
                   <div className="absolute bottom-2 left-2">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${
                         base.type === 'War' ? 'bg-red-900/80 text-red-200 border border-red-500/20' : 
                         base.type === 'Farm' ? 'bg-green-900/80 text-green-200 border border-green-500/20' : 
                         'bg-gray-800 text-gray-300 border border-white/10'
                      }`}>
                         {base.type}
                      </span>
                   </div>
                </div>
                
                <div className="p-4 flex flex-col flex-1 gap-3">
                   <h3 className="font-bold text-white text-lg leading-tight truncate">
                         {base.title}
                   </h3>
                   
                   <div className="mt-auto pt-2">
                     <a 
                        href={base.copy_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full bg-[#2a3a4b] hover:bg-skin-primary text-white hover:text-black border border-white/5 hover:border-skin-primary font-sans text-xs py-3 rounded-lg transition-all active:scale-95 font-bold uppercase tracking-wide"
                     >
                        <Copy size={14} /> Copy Link
                     </a>
                   </div>
                </div>
             </div>
          ))}
       </div>
    </div>
  )
}
