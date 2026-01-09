'use client';

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Copy, Map, Filter, ShieldCheck, ExternalLink } from "lucide-react";
import SkeletonLoader from "@/components/SkeletonLoader";

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

  // Full list of Town Halls
  const TOWN_HALLS = Array.from({ length: 16 }, (_, i) => 17 - i); // [17, 16, ... 2]

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
  }, []);

  const filtered = layouts.filter(base => {
    if (filterTH !== 'all' && base.town_hall !== filterTH) return false;
    if (filterType !== 'all' && base.type !== filterType) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-24 px-4 min-h-[80vh]">
       
       <div className="text-center space-y-3 pt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl md:text-6xl font-clash text-skin-text uppercase tracking-wide drop-shadow-xl">
             Base Layouts
          </h1>
          <p className="text-skin-muted text-sm md:text-base max-w-lg mx-auto">
             Curated meta bases for War, Farming, and Trophy Pushing. Verified by pros.
          </p>
       </div>

       {/* FILTER BAR */}
       <div className="flex flex-col md:flex-row gap-4 justify-center items-center bg-[#1f2937]/80 backdrop-blur-md p-2 rounded-2xl border border-white/10 w-fit mx-auto shadow-2xl z-10 relative">
          
          {/* TH Selector */}
          <div className="relative group">
             <div className="absolute -inset-0.5 bg-gradient-to-r from-skin-primary to-skin-secondary rounded-xl blur opacity-20 group-hover:opacity-50 transition duration-500"></div>
             <div className="relative flex items-center gap-3 bg-[#131b24] px-4 py-2.5 rounded-xl border border-white/10">
                <Filter size={16} className="text-skin-muted"/>
                <span className="text-xs font-bold text-skin-muted uppercase hidden md:inline">Town Hall:</span>
                <select 
                   className="bg-transparent text-white text-sm font-bold outline-none cursor-pointer appearance-none pr-4"
                   value={filterTH}
                   onChange={(e) => setFilterTH(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                >
                   <option value="all" className="bg-[#1f2937]">All Levels</option>
                   {TOWN_HALLS.map(th => (<option key={th} value={th} className="bg-[#1f2937]">Town Hall {th}</option>))}
                </select>
             </div>
          </div>

          <div className="w-px h-8 bg-white/10 hidden md:block"></div>

          {/* Type Toggles */}
          <div className="flex gap-1 bg-black/20 p-1 rounded-lg border border-white/5">
             {['War', 'Farm', 'Troll'].map(type => (
                <button 
                   key={type}
                   onClick={() => setFilterType(filterType === type ? 'all' : type)}
                   className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all tracking-wider ${
                      filterType === type 
                        ? 'bg-skin-primary text-black shadow-lg' 
                        : 'text-skin-muted hover:text-white hover:bg-white/5'
                   }`}
                >
                   {type}
                </button>
             ))}
          </div>
       </div>

       {loading && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{[...Array(6)].map((_, i) => <SkeletonLoader key={i} />)}</div>}

       {/* EMPTY STATE */}
       {!loading && !errorMsg && filtered.length === 0 && (
          <div className="text-center py-24 opacity-60 flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-500">
             <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/5">
                <Map size={40} className="text-skin-muted"/>
             </div>
             <div>
                <p className="text-white font-clash text-xl">No layouts found</p>
                <p className="text-skin-muted text-sm">Try adjusting your filters for TH{filterTH}</p>
             </div>
             <button onClick={() => { setFilterTH('all'); setFilterType('all'); }} className="text-xs text-skin-primary hover:text-skin-secondary underline decoration-dotted underline-offset-4 transition-colors">
                Clear all filters
             </button>
          </div>
       )}

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(base => (
             <div key={base.id} className="group relative bg-[#1a232e] border border-white/5 rounded-2xl overflow-hidden hover:border-skin-primary/30 transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(var(--color-primary),0.15)] flex flex-col h-full">
                
                {/* Image Area */}
                <div className="aspect-[16/9] relative bg-[#0c1219] overflow-hidden border-b border-white/5">
                   <img 
                      src={base.image_url} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      alt={base.title} 
                      onError={(e) => { e.currentTarget.style.display='none'; e.currentTarget.nextElementSibling?.classList.remove('hidden'); }}
                   />
                   
                   {/* Fallback */}
                   <div className="hidden absolute inset-0 flex flex-col items-center justify-center text-skin-muted bg-[#0c1219] gap-3">
                      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                         <ShieldCheck size={24} className="text-skin-primary opacity-40"/>
                      </div>
                      <span className="text-[10px] font-mono opacity-40 uppercase tracking-widest">Preview Missing</span>
                   </div>

                   {/* Badges */}
                   <div className="absolute top-2 right-2">
                      <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md border border-white/10 shadow-lg">
                         TH {base.town_hall}
                      </span>
                   </div>
                   <div className="absolute bottom-2 left-2">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider shadow-lg ${
                         base.type === 'War' ? 'bg-red-500/90 text-white' : 
                         base.type === 'Farm' ? 'bg-green-500/90 text-white' : 
                         'bg-gray-500/90 text-white'
                      }`}>
                         {base.type}
                      </span>
                   </div>
                </div>
                
                <div className="p-5 flex flex-col flex-1 gap-4">
                   <div className="flex-1">
                      <h3 className="font-bold text-white text-lg leading-tight group-hover:text-skin-primary transition-colors line-clamp-1 mb-1">
                         {base.title}
                      </h3>
                      <p className="text-xs text-skin-muted line-clamp-2 opacity-70">
                         Optimized for {base.type === 'War' ? 'defense against current meta.' : 'protecting resources.'}
                      </p>
                   </div>
                   
                   {/* REFINED BUTTON */}
                   <a 
                      href={base.copy_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-[#2a3a4b] hover:bg-skin-primary text-white hover:text-black border border-white/5 hover:border-skin-primary font-sans text-sm py-3 rounded-xl transition-all duration-300 active:scale-95 shadow-lg group-hover:shadow-skin-primary/20 font-semibold tracking-wide"
                   >
                      <Copy size={16} /> <span>Copy Base Link</span> <ExternalLink size={12} className="opacity-50"/>
                   </a>
                </div>
             </div>
          ))}
       </div>
    </div>
  )
}
