'use client';

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Crown } from "lucide-react";
import SkeletonLoader from "@/components/SkeletonLoader";

// Local Components
import { Strategy } from "./_components/types";
import StrategyHero from "./_components/StrategyHero";
import StrategyFilter from "./_components/StrategyFilter";
import StrategyCard from "./_components/StrategyCard";

export default function StrategiesPage() {
  // State
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTH, setFilterTH] = useState<number | 'all'>('all');
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  // Data Fetching
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const { data } = await supabase
          .from('strategies')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (data) setStrategies(data);
      } catch (err) {
        console.error("Error loading strategies:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Filter Logic
  const filtered = strategies.filter(strat => 
    filterTH === 'all' || strat.town_halls.includes(filterTH)
  );

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-24 px-4 min-h-[80vh]">
       
       {/* 1. Hero Header */}
       <StrategyHero />

       {/* 2. Filter Bar */}
       <StrategyFilter 
         currentFilter={filterTH} 
         setFilter={setFilterTH} 
       />

       {/* 3. Loading State */}
       {loading && (
          <div className="space-y-6">
             <SkeletonLoader />
             <SkeletonLoader />
          </div>
       )}

       {/* 4. Strategy List */}
       <div className="grid gap-8">
          {/* Empty State */}
          {!loading && filtered.length === 0 && (
             <div className="text-center py-24 opacity-60 flex flex-col items-center gap-4">
                <Crown size={48} className="text-skin-muted opacity-50"/>
                <p className="text-xl font-clash text-white">No guides found</p>
                <button 
                  onClick={() => setFilterTH('all')} 
                  className="text-skin-primary hover:underline text-sm font-bold"
                >
                  View all strategies
                </button>
             </div>
          )}

          {/* Cards */}
          {filtered.map(strat => (
             <StrategyCard 
               key={strat.id} 
               strategy={strat} 
               isPlaying={playingVideoId === strat.id}
               onPlay={() => setPlayingVideoId(strat.id)}
             />
          ))}
       </div>
    </div>
  );
}
