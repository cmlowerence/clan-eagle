'use client';

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Map } from "lucide-react";
import SkeletonLoader from "@/components/SkeletonLoader";

// Local Component Imports
import { BaseLayout, FilterType } from "./_components/types";
import LayoutHero from "./_components/LayoutHero";
import LayoutFilter from "./_components/LayoutFilter";
import LayoutCard from "./_components/LayoutCard";

export default function LayoutsPage() {
  // State Management
  const [layouts, setLayouts] = useState<BaseLayout[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Filter State
  const [filterTH, setFilterTH] = useState<number | 'all'>('all');
  const [filterType, setFilterType] = useState<FilterType | 'all'>('all');

  // Fetch Data from Supabase
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('layouts')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        if (data) setLayouts(data);
      } catch (err: any) { 
        setErrorMsg(err.message || "Failed to load layouts."); 
        console.error("Layout Fetch Error:", err);
      } finally { 
        setLoading(false); 
      }
    }
    fetchData();
  }, []);

  // Filter Logic
  const filtered = layouts.filter(base => {
    if (filterTH !== 'all' && base.town_hall !== filterTH) return false;
    if (filterType !== 'all' && base.type !== filterType) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-24 px-4 min-h-[80vh]">
       
       {/* 1. Header Section */}
       <LayoutHero />

       {/* 2. Sticky Filter Bar */}
       <LayoutFilter 
         currentTH={filterTH} 
         setTH={setFilterTH} 
         currentType={filterType} 
         setType={setFilterType} 
       />

       {/* 3. Loading State */}
       {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <SkeletonLoader key={i} />)}
          </div>
       )}

       {/* 4. Empty State */}
       {!loading && !errorMsg && filtered.length === 0 && (
          <div className="text-center py-24 opacity-60 flex flex-col items-center gap-4">
             <div className="w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-full flex items-center justify-center border border-white/5 shadow-inner">
                <Map size={48} className="text-skin-muted opacity-50"/>
             </div>
             <div>
                <p className="text-white font-clash text-2xl">No layouts found</p>
                <p className="text-skin-muted text-sm">No bases uploaded for TH{filterTH} yet.</p>
             </div>
             <button 
               onClick={() => { setFilterTH('all'); setFilterType('all'); }} 
               className="text-xs font-bold bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
             >
                Reset Filters
             </button>
          </div>
       )}

       {/* 5. Main Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map(base => (
             <LayoutCard key={base.id} layout={base} />
          ))}
       </div>
    </div>
  );
}
