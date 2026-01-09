'use client';

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { getUnitIconPath, getUnitCategory } from "@/lib/unitHelpers";
import { Play, Swords, Zap, Filter, Youtube, Copy, ExternalLink, ShieldAlert } from "lucide-react";
import SkeletonLoader from "@/components/SkeletonLoader";

interface Strategy {
   id: string;
   title: string;
   description: string;
   town_halls: number[];
   difficulty: string;
   video_url: string;
   army_link ? : string;
   army_comp: { unit: string;count: number } [];
   created_at: string;
}

export default function StrategiesPage() {
   const [strategies, setStrategies] = useState < Strategy[] > ([]);
   const [loading, setLoading] = useState(true);
   const [filterTH, setFilterTH] = useState < number | 'all' > ('all');
   const [playingVideo, setPlayingVideo] = useState < string | null > (null);
   
   const TOWN_HALLS = Array.from({ length: 16 }, (_, i) => 17 - i);
   
   useEffect(() => {
      async function fetchData() {
         try {
            const { data } = await supabase.from('strategies').select('*').order('created_at', { ascending: false });
            if (data) setStrategies(data);
         } catch (err) { console.error(err); } finally { setLoading(false); }
      }
      fetchData();
   }, []);
   
   const filtered = strategies.filter(strat => filterTH === 'all' || strat.town_halls.includes(filterTH));
   
   const getArmySplit = (comp: any[]) => {
      const troops: any[] = [];
      const spells: any[] = [];
      if (Array.isArray(comp)) {
         comp.forEach(item => {
            const category = getUnitCategory(item.unit, true);
            if (category.includes('Spell')) spells.push(item);
            else troops.push(item);
         });
      }
      return { troops, spells };
   };
   
   const getYoutubeId = (url: string) => {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11) ? match[2] : null;
   };
   
   return (
      <div className="max-w-5xl mx-auto space-y-8 pb-24 px-4 min-h-[80vh]">
       
       <div className="text-center space-y-3 pt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl md:text-6xl font-clash text-skin-text uppercase tracking-wide drop-shadow-xl">
             Pro Guides
          </h1>
          <p className="text-skin-muted text-sm md:text-base max-w-lg mx-auto">
             Master the meta with expert attack strategies. Learn to 3-Star any base.
          </p>
       </div>

       {/* FULL FILTER */}
       <div className="flex justify-center sticky top-20 z-40">
          <div className="flex items-center gap-3 bg-[#1f2937]/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 shadow-2xl overflow-x-auto max-w-full no-scrollbar">
             <Filter size={16} className="text-skin-muted shrink-0"/>
             <span className="text-xs font-bold text-skin-muted uppercase shrink-0">Town Hall:</span>
             <div className="flex gap-1">
                <button onClick={() => setFilterTH('all')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filterTH === 'all' ? 'bg-skin-primary text-black shadow-md' : 'bg-white/5 text-skin-muted hover:text-white'}`}>ALL</button>
                {TOWN_HALLS.map(th => (
                   <button key={th} onClick={() => setFilterTH(th)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${filterTH === th ? 'bg-skin-primary text-black shadow-md' : 'bg-white/5 text-skin-muted hover:text-white'}`}>{th}</button>
                ))}
             </div>
          </div>
       </div>

       {loading && <div className="space-y-6"><SkeletonLoader /><SkeletonLoader /></div>}

       <div className="grid gap-8">
          {!loading && filtered.length === 0 && (
             <div className="text-center py-24 opacity-60 flex flex-col items-center gap-4">
                <ShieldAlert size={48} className="text-skin-muted"/>
                <p className="text-xl font-clash text-skin-muted">No guides found for TH{filterTH}</p>
                <button onClick={() => setFilterTH('all')} className="text-skin-primary hover:underline text-sm">View all guides</button>
             </div>
          )}

          {filtered.map(strat => {
             const { troops, spells } = getArmySplit(strat.army_comp);
             const videoId = getYoutubeId(strat.video_url);
             const isPlaying = playingVideo === strat.id;
             
             return (
                <div key={strat.id} className="bg-[#1a232e] border border-white/5 rounded-2xl p-5 md:p-6 flex flex-col lg:flex-row gap-8 hover:border-skin-primary/20 transition-all shadow-xl group animate-in fade-in slide-in-from-bottom-4">
                   
                   {/* LEFT: Video & Info */}
                   <div className="flex-1 space-y-5">
                      <div className="flex items-start justify-between gap-4">
                         <div>
                            <h3 className="text-2xl font-bold text-white leading-tight group-hover:text-skin-primary transition-colors">
                               {strat.title}
                            </h3>
                            <div className="flex flex-wrap gap-2 mt-3">
                               {strat.town_halls.map(th => (<span key={th} className="text-[10px] font-bold text-black bg-skin-primary px-2 py-0.5 rounded shadow-sm">TH{th}</span>))}
                               <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${strat.difficulty === 'Pro' ? 'text-red-400 border-red-500/30 bg-red-500/10' : 'text-green-400 border-green-500/30 bg-green-500/10'}`}>{strat.difficulty}</span>
                            </div>
                         </div>
                      </div>
                      
                      <p className="text-sm text-skin-muted leading-relaxed border-l-2 border-skin-primary/20 pl-4">
                         {strat.description}
                      </p>
                      
                      {/* YOUTUBE STYLE PLAYER */}
                      {videoId && (
                        <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-white/10 shadow-2xl group-hover:border-skin-primary/30 transition-colors">
                            {isPlaying ? (
                                <iframe src={`https://www.youtube.com/embed/${videoId}?autoplay=1`} className="w-full h-full" allow="autoplay; encrypted-media" allowFullScreen></iframe>
                            ) : (
                                <button onClick={() => setPlayingVideo(strat.id)} className="group/video w-full h-full relative flex items-center justify-center">
                                    <img src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover/video:opacity-100 transition-opacity" alt="Video Thumbnail"/>
                                    <div className="absolute inset-0 bg-black/20 group-hover/video:bg-black/0 transition-colors"></div>
                                    
                                    {/* YouTube Style Button */}
                                    <div className="relative w-16 h-12 bg-[#FF0000] rounded-xl flex items-center justify-center shadow-2xl group-hover/video:scale-110 transition-transform duration-300">
                                        <Play size={24} className="text-white fill-white ml-1"/>
                                    </div>
                                </button>
                            )}
                        </div>
                      )}
                   </div>

                   {/* RIGHT: Army Preview Card */}
                   <div className="bg-[#131b24] p-5 rounded-xl border border-white/5 w-full lg:w-80 shrink-0 flex flex-col h-fit sticky top-24">
                      <div className="space-y-6">
                          
                          {/* VISUAL TROOPS PREVIEW */}
                          {troops.length > 0 && (
                             <div>
                                <div className="text-[10px] uppercase font-bold text-skin-muted mb-3 flex items-center gap-1 border-b border-white/5 pb-1">
                                   <Swords size={12}/> Army Composition
                                </div>
                                <div className="flex flex-wrap gap-2.5">
                                   {troops.map((item: any, idx: number) => (
                                      <div key={idx} className="relative w-11 h-11 bg-[#2a3a4b] rounded-lg border border-white/10 shadow-sm transition-transform hover:scale-110" title={item.unit}>
                                         <img src={getUnitIconPath(item.unit)} onError={(e) => { e.currentTarget.style.display='none'; }} className="w-full h-full object-contain p-0.5" alt={item.unit}/>
                                         <div className="absolute -top-1.5 -right-1.5 bg-black text-white text-[10px] font-bold px-1.5 rounded border border-white/20 shadow-md">
                                            {item.count}
                                         </div>
                                      </div>
                                   ))}
                                </div>
                             </div>
                          )}

                          {/* VISUAL SPELLS PREVIEW */}
                          {spells.length > 0 && (
                             <div>
                                <div className="text-[10px] uppercase font-bold text-skin-muted mb-3 flex items-center gap-1 border-b border-white/5 pb-1">
                                   <Zap size={12}/> Spells
                                </div>
                                <div className="flex flex-wrap gap-2.5">
                                   {spells.map((item: any, idx: number) => (
                                      <div key={idx} className="relative w-9 h-9 bg-[#2a3a4b] rounded-lg border border-white/10 shadow-sm transition-transform hover:scale-110" title={item.unit}>
                                         <img src={getUnitIconPath(item.unit)} onError={(e) => { e.currentTarget.style.display='none'; }} className="w-full h-full object-contain p-1" alt={item.unit}/>
                                         <div className="absolute -top-1.5 -right-1.5 bg-black text-white text-[9px] font-bold px-1 rounded border border-white/20 shadow-md">
                                            {item.count}
                                         </div>
                                      </div>
                                   ))}
                                </div>
                             </div>
                          )}
                      </div>
                      
                      {/* ACTION BUTTON */}
                      <div className="mt-8 pt-4 border-t border-white/10">
                          {strat.army_link ? (
                              <a 
                                href={strat.army_link} 
                                target="_blank" 
                                className="group/btn flex items-center justify-center gap-2 w-full bg-skin-secondary hover:bg-white text-black font-bold text-sm py-3.5 rounded-xl transition-all shadow-[0_0_15px_-5px_var(--color-secondary)] hover:shadow-white/20 active:scale-95"
                              >
                                  <Swords size={18} className="group-hover/btn:rotate-12 transition-transform"/> 
                                  <span>Train This Army</span>
                              </a>
                          ) : (
                              <div className="flex items-center justify-center gap-2 w-full bg-white/5 text-skin-muted font-bold text-xs py-3 rounded-xl border border-white/5 cursor-not-allowed opacity-60">
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
   )
}