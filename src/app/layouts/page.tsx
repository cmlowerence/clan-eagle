'use client';

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Copy, Map, Filter, Download, ExternalLink } from "lucide-react";
import SkeletonLoader from "@/components/SkeletonLoader";

// Define the interface matching your Supabase Table Schema
interface BaseLayout {
  id: string;
  title: string;
  town_hall: number; // Matches 'town_hall' column in DB
  type: string;      // 'War', 'Farm', etc.
  image_url: string; // Matches 'image_url' column
  copy_link: string; // Matches 'copy_link' column
  created_at: string;
}

export default function LayoutsPage() {
  const [layouts, setLayouts] = useState<BaseLayout[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [filterTH, setFilterTH] = useState<number | 'all'>('all');
  const [filterType, setFilterType] = useState<string | 'all'>('all');

  // --- 1. FETCH DATA FROM SUPABASE ---
  useEffect(() => {
    async function fetchData() {
      try {
        const { data, error } = await supabase
          .from('layouts')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data) setLayouts(data);
      } catch (err) {
        console.error("Error fetching layouts:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // --- 2. CLIENT-SIDE FILTERING ---
  const filtered = layouts.filter(base => {
    if (filterTH !== 'all' && base.town_hall !== filterTH) return false;
    if (filterType !== 'all' && base.type !== filterType) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-24 px-4 min-h-[80vh]">
       
       {/* --- HEADER --- */}
       <div className="text-center space-y-2 pt-8">
          <h1 className="text-4xl md:text-6xl font-clash text-skin-text uppercase tracking-wide drop-shadow-md">
             Base Layouts
          </h1>
          <p className="text-skin-muted text-sm md:text-base max-w-lg mx-auto">
             Curated meta bases for Clan Wars, CWL, and Trophy Pushing. Verified by experts.
          </p>
       </div>

       {/* --- FILTER BAR --- */}
       <div className="flex flex-col md:flex-row gap-4 justify-center items-center bg-[#1f2937] p-3 rounded-2xl border border-white/10 w-fit mx-auto shadow-xl">
          
          {/* TH Selector */}
          <div className="flex items-center gap-3 bg-black/20 px-4 py-2 rounded-xl border border-white/5">
             <Filter size={16} className="text-skin-muted"/>
             <span className="text-xs font-bold text-skin-muted uppercase hidden md:inline">Town Hall:</span>
             <select 
                className="bg-transparent text-white text-sm font-bold outline-none cursor-pointer"
                value={filterTH}
                onChange={(e) => setFilterTH(e.target.value === 'all' ? 'all' : Number(e.target.value))}
             >
                <option value="all" className="bg-[#1f2937]">All Levels</option>
                {[17, 16, 15, 14, 13, 12, 11, 10, 9].map(th => (
                    <option key={th} value={th} className="bg-[#1f2937]">TH {th}</option>
                ))}
             </select>
          </div>

          {/* Vertical Divider (Desktop) */}
          <div className="w-px h-8 bg-white/10 hidden md:block"></div>

          {/* Type Toggles */}
          <div className="flex gap-2">
             {['War', 'Farm', 'Troll'].map(type => (
                <button 
                   key={type}
                   onClick={() => setFilterType(filterType === type ? 'all' : type)}
                   className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all border ${
                      filterType === type 
                        ? 'bg-skin-primary text-black border-skin-primary shadow-[0_0_10px_rgba(var(--color-primary),0.3)]' 
                        : 'bg-transparent text-skin-muted border-transparent hover:bg-white/5 hover:text-white'
                   }`}
                >
                   {type}
                </button>
             ))}
          </div>
       </div>

       {/* --- LOADING STATE --- */}
       {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {[...Array(6)].map((_, i) => <SkeletonLoader key={i} />)}
          </div>
       )}

       {/* --- EMPTY STATE --- */}
       {!loading && filtered.length === 0 && (
          <div className="text-center py-20 opacity-50 flex flex-col items-center gap-4">
             <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
                <Map size={32} className="text-skin-muted"/>
             </div>
             <p className="text-skin-muted font-clash text-xl">No layouts found matching criteria.</p>
             <button onClick={() => { setFilterTH('all'); setFilterType('all'); }} className="text-xs text-skin-primary hover:underline">Clear Filters</button>
          </div>
       )}

       {/* --- LAYOUT GRID --- */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(base => (
             <div key={base.id} className="bg-skin-surface border border-skin-primary/20 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:border-skin-primary/50 transition-all group flex flex-col h-full">
                
                {/* Image Container */}
                <div className="aspect-[16/9] relative bg-[#131b24] overflow-hidden group">
                   <img 
                      src={base.image_url} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      alt={base.title} 
                      onError={(e) => { e.currentTarget.style.display='none'; e.currentTarget.nextElementSibling?.classList.remove('hidden'); }}
                   />
                   
                   {/* Fallback Icon */}
                   <div className="hidden absolute inset-0 flex flex-col items-center justify-center text-skin-muted opacity-30 gap-2">
                      <Map size={40}/>
                      <span className="text-xs font-mono">Image Unavailable</span>
                   </div>

                   {/* Overlay Badges */}
                   <div className="absolute top-2 right-2 flex gap-2">
                      <span className="bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md border border-white/10 shadow-lg">
                         TH {base.town_hall}
                      </span>
                   </div>
                   <div className="absolute bottom-2 left-2">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-md shadow-lg uppercase tracking-wider ${
                         base.type === 'War' ? 'bg-red-600 text-white' : 
                         base.type === 'Farm' ? 'bg-green-600 text-white' : 
                         'bg-gray-600 text-white'
                      }`}>
                         {base.type}
                      </span>
                   </div>
                </div>
                
                {/* Content */}
                <div className="p-5 flex flex-col flex-1 gap-4">
                   <div className="flex-1">
                      <h3 className="font-bold text-white text-lg leading-tight group-hover:text-skin-primary transition-colors line-clamp-2">
                         {base.title}
                      </h3>
                      <div className="mt-2 flex gap-2 flex-wrap">
                         {/* Static Tags based on type for UI flair */}
                         <span className="text-[10px] text-skin-muted bg-white/5 px-2 py-0.5 rounded border border-white/5">Anti-3 Star</span>
                         <span className="text-[10px] text-skin-muted bg-white/5 px-2 py-0.5 rounded border border-white/5">Meta</span>
                      </div>
                   </div>

                   {/* Action Button */}
                   <a 
                      href={base.copy_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-skin-primary/90 hover:bg-skin-primary text-black font-clash text-sm py-3 rounded-xl transition-transform active:scale-95 shadow-lg shadow-skin-primary/10"
                   >
                      <Copy size={16} /> COPY LINK
                   </a>
                </div>
             </div>
          ))}
       </div>
    </div>
  )
}
