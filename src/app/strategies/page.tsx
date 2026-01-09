'use client';

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { getUnitIconPath, getUnitCategory } from "@/lib/unitHelpers";
import { Play, Swords, Zap, Filter, ArrowLeft, Crown, Video } from "lucide-react";
import SkeletonLoader from "@/components/SkeletonLoader";
import Link from "next/link";

interface Strategy {
  id: string;
  title: string;
  description: string;
  town_halls: number[];
  difficulty: string;
  video_url: string;
  army_link?: string;
  army_comp: { unit: string; count: number }[];
  created_at: string;
}

export default function StrategiesPage() {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTH, setFilterTH] = useState<number | 'all'>('all');
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  // Town Hall range 17-2
  const TOWN_HALLS = Array.from({ length: 16 }, (_, i) => 17 - i);

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

  const filtered = strategies.filter(strat => 
    filterTH === 'all' || strat.town_halls.includes(filterTH)
  );

  // Helper to separate Troops from Spells
  const getArmySplit = (comp: any[]) => {
    const troops: any[] = [];
    const spells: any[] = [];
    if (Array.isArray(comp)) {
        comp.forEach(item => {
          const category = getUnitCategory(item.unit, true);
          // Check if category name contains "Spell"
          if (category.includes('Spell')) spells.push(item); 
          else troops.push(item);
        });
    }
    return { troops, spells };
  };

  // Extract YouTube Video ID
  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-24 px-4 min-h-[80vh]">
       
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
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-500/10 blur-[100px] rounded-full -z-10"></div>
            
            <h1 className="text-5xl md:text-7xl font-clash text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 drop-shadow-xl tracking-tight">
                PRO GUIDES
            </h1>
            <p className="text-skin-muted text-sm md:text-base max-w-lg mx-auto leading-relaxed border-t border-white/5 pt-4">
                Master the Art of War. <span className="text-red-400 font-bold">3-Star Strategies</span> for every Town Hall level.
            </p>
          </div>
       </div>

       {/* --- FILTER SCROLL --- */}
       <div className="flex justify-center sticky top-20 z-40">
          <div className="flex items-center gap-3 bg-[#131b24]/90 backdrop-blur-xl px-2 py-2 rounded-2xl border border-white/10 shadow-2xl overflow-x-auto max-w-full no-scrollbar">
             <div className="pl-4 pr-2 flex items-center gap-2 text-skin-muted">
                <Filter size={16} className="shrink-0"/>
                <span className="text-xs font-bold uppercase shrink-0">Filter:</span>
             </div>
             <div className="flex gap-1 pr-2">
                <button onClick={() => setFilterTH('all')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filterTH === 'all' ? 'bg-skin-primary text-black shadow-lg scale-105' : 'bg-white/5 text-skin-muted hover:text-white hover:bg-white/10'}`}>ALL</button>
                {TOWN_HALLS.map(th => (
                   <button key={th} onClick={() => setFilterTH(th)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${filterTH === th ? 'bg-skin-primary text-black shadow-lg scale-105' : 'bg-white/5 text-skin-muted hover:text-white hover:bg-white/10'}`}>{th}</button>
                ))}
             </div>
          </div>
       </div>

       {/* --- LOADING STATE --- */}
       {loading && (
          <div className="space-y-6">
             <SkeletonLoader />
             <SkeletonLoader />
          </div>
       )}

       {/* --- STRATEGY GRID --- */}
       <div className="grid gap-8">
          {!loading && filtered.length === 0 && (
             <div className="text-center py-24 opacity-60 flex flex-col items-center gap-4">
                <Crown size={48} className="text-skin-muted opacity-50"/>
                <p className="text-xl font-clash text-white">No guides found</p>
                <button onClick={() => setFilterTH('all')} className="text-skin-primary hover:underline text-sm font-bold">View all strategies</button>
             </div>
          )}

          {filtered.map(strat => {
             const { troops, spells } = getArmySplit(strat.army_comp);
             const videoId = getYoutubeId(strat.video_url);
             const isPlaying = playingVideo === strat.id;
             
             return (
                <div key={strat.id} className="bg-[#151c24] border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col lg:flex-row gap-8 hover:border-skin-primary/30 transition-all shadow-xl hover:shadow-2xl group relative overflow-hidden">
                   
                   {/* Background Gradient */}
                   <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-skin-primary/5 to-transparent rounded-full blur-3xl -z-10 pointer-events-none"></div>

                   {/* LEFT: Content & Video */}
                   <div className="flex-1 space-y-6">
                      <div className="flex flex-col gap-4">
                         <div>
                            <div className="flex items-center gap-3 mb-2">
                                {/* TH Badges */}
                                {strat.town_halls.map(th => (
                                   <span key={th} className="text-[10px] font-bold text-black bg-skin-primary px-2 py-0.5 rounded shadow-sm shadow-skin-primary/20">TH{th}</span>
                                ))}
                                {/* Difficulty Badge */}
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                                   strat.difficulty === 'Pro' ? 'text-red-400 border-red-500/30 bg-red-500/10' : 
                                   strat.difficulty === 'Medium' ? 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10' :
                                   'text-green-400 border-green-500/30 bg-green-500/10'
                                }`}>
                                   {strat.difficulty}
                                </span>
                            </div>
                            <h3 className="text-3xl font-clash text-white leading-tight group-hover:text-skin-primary transition-colors drop-shadow-md">
                               {strat.title}
                            </h3>
                         </div>
                      </div>
                      
                      <div className="relative pl-6 border-l-2 border-white/10">
                         <p className="text-sm text-skin-muted leading-relaxed">
                            {strat.description}
                         </p>
                      </div>
                      
                      {/* Video Player */}
                      {videoId && (
                        <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl group-hover:border-white/20 transition-all mt-4">
                            {isPlaying ? (
                                <iframe 
                                   src={`https://www.youtube.com/embed/${videoId}?autoplay=1`} 
                                   className="w-full h-full" 
                                   allow="autoplay; encrypted-media" 
                                   allowFullScreen
                                ></iframe>
                            ) : (
                                <button onClick={() => setPlayingVideo(strat.id)} className="group/video w-full h-full relative flex items-center justify-center">
                                    <img 
                                       src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`} 
                                       className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover/video:opacity-100 transition-opacity duration-500" 
                                       alt="Video Thumbnail"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                    
                                    <div className="relative flex flex-col items-center gap-3 transition-transform duration-300 group-hover/video:scale-105">
                                        {/* YouTube Style Play Button */}
                                        <div className="w-16 h-11 bg-[#FF0000] rounded-xl flex items-center justify-center shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
                                            <Play size={24} className="text-white fill-white ml-0.5"/>
                                        </div>
                                        <span className="text-xs font-bold text-white uppercase tracking-widest drop-shadow-md flex items-center gap-2">
                                            <Video size={12}/> Watch Guide
                                        </span>
                                    </div>
                                </button>
                            )}
                        </div>
                      )}
                   </div>

                   {/* RIGHT: Army Panel */}
                   <div className="bg-[#0c1015] p-6 rounded-2xl border border-white/5 w-full lg:w-80 shrink-0 flex flex-col h-fit shadow-inner">
                      <div className="space-y-6">
                          
                          {/* Troops */}
                          {troops.length > 0 && (
                             <div>
                                <div className="text-[10px] uppercase font-bold text-skin-muted mb-4 flex items-center gap-2 border-b border-white/5 pb-2">
                                   <Swords size={12} className="text-skin-primary"/> Army
                                </div>
                                <div className="grid grid-cols-4 gap-2">
                                   {troops.map((item: any, idx: number) => (
                                      <div key={idx} className="relative aspect-square bg-[#1a232e] rounded-xl border border-white/10 transition-all hover:border-skin-primary/50 hover:bg-[#202b38] group/item" title={item.unit}>
                                         <img 
                                            src={getUnitIconPath(item.unit)} 
                                            onError={(e) => { e.currentTarget.style.display='none'; }} 
                                            className="w-full h-full object-contain p-1" 
                                            alt={item.unit}
                                         />
                                         <div className="absolute -top-1.5 -right-1.5 bg-skin-primary text-black text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#0c1015] shadow-lg">
                                            {item.count}
                                         </div>
                                      </div>
                                   ))}
                                </div>
                             </div>
                          )}

                          {/* Spells */}
                          {spells.length > 0 && (
                             <div>
                                <div className="text-[10px] uppercase font-bold text-skin-muted mb-4 flex items-center gap-2 border-b border-white/5 pb-2">
                                   <Zap size={12} className="text-blue-400"/> Spells
                                </div>
                                <div className="flex flex-wrap gap-2">
                                   {spells.map((item: any, idx: number) => (
                                      <div key={idx} className="relative w-10 h-10 bg-[#1a232e] rounded-lg border border-white/10 transition-all hover:border-blue-400/50 hover:bg-[#202b38]" title={item.unit}>
                                         <img 
                                            src={getUnitIconPath(item.unit)} 
                                            onError={(e) => { e.currentTarget.style.display='none'; }} 
                                            className="w-full h-full object-contain p-1" 
                                            alt={item.unit}
                                         />
                                         <div className="absolute -top-1.5 -right-1.5 bg-blue-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-[#0c1015] shadow-lg">
                                            {item.count}
                                         </div>
                                      </div>
                                   ))}
                                </div>
                             </div>
                          )}
                      </div>
                      
                      {/* Train Button */}
                      <div className="mt-8 pt-4 border-t border-white/10">
                          {strat.army_link ? (
                              <a 
                                href={strat.army_link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="group/btn relative flex items-center justify-center gap-2 w-full bg-skin-secondary hover:bg-white text-black font-bold text-xs py-4 rounded-xl transition-all shadow-lg hover:shadow-skin-secondary/20 overflow-hidden"
                              >
                                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                                  <Swords size={16} className="relative z-10 group-hover/btn:rotate-12 transition-transform"/> 
                                  <span className="relative z-10">TRAIN ARMY</span>
                              </a>
                          ) : (
                              <div className="flex items-center justify-center gap-2 w-full bg-white/5 text-skin-muted font-bold text-xs py-4 rounded-xl border border-white/5 cursor-not-allowed opacity-50">
                                  <span>Link Unavailable</span>
                              </div>
                          )}
                      </div>
                   </div>

                </div>
             );
          })}
       </div>
    </div>
  );
}
