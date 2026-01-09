'use client';

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { getUnitIconPath, getUnitCategory } from "@/lib/unitHelpers";
import { PlayCircle, Swords, Zap, Filter, Copy, ExternalLink, Youtube } from "lucide-react";
import SkeletonLoader from "@/components/SkeletonLoader";

interface Strategy {
   id: string;
   title: string;
   description: string;
   town_halls: number[];
   difficulty: string;
   video_url: string;
   army_link ? : string; // NEW FIELD
   army_comp: { unit: string;count: number } [];
   created_at: string;
}

export default function StrategiesPage() {
   const [strategies, setStrategies] = useState < Strategy[] > ([]);
   const [loading, setLoading] = useState(true);
   const [filterTH, setFilterTH] = useState < number | 'all' > ('all');
   const [playingVideo, setPlayingVideo] = useState < string | null > (null); // Track which video is playing
   
   useEffect(() => {
      async function fetchData() {
         try {
            const { data, error } = await supabase.from('strategies').select('*').order('created_at', { ascending: false });
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
   
   // Helper to extract YouTube ID
   const getYoutubeId = (url: string) => {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11) ? match[2] : null;
   };
   
   return (
      <div className="max-w-5xl mx-auto space-y-8 pb-24 px-4 min-h-[80vh]">
       <div className="text-center space-y-2 pt-8">
          <h1 className="text-4xl md:text-6xl font-clash text-skin-text uppercase tracking-wide">Pro Guides</h1>
          <p className="text-skin-muted text-sm max-w-lg mx-auto">Master the meta with expert attack strategies.</p>
       </div>

       {/* FILTER */}
       <div className="flex justify-center">
          <div className="flex items-center gap-3 bg-[#1f2937] px-4 py-2 rounded-xl border border-white/10 shadow-xl overflow-x-auto max-w-full">
             <Filter size={16} className="text-skin-muted shrink-0"/>
             <span className="text-xs font-bold text-skin-muted uppercase shrink-0">Filter Town Hall:</span>
             <div className="flex gap-1">
                <button onClick={() => setFilterTH('all')} className={`px-3 py-1 rounded text-xs font-bold ${filterTH === 'all' ? 'bg-skin-primary text-black' : 'bg-black/20 text-skin-muted hover:text-white'}`}>ALL</button>
                {[16, 15, 14, 13, 12, 11].map(th => (
                   <button key={th} onClick={() => setFilterTH(th)} className={`px-3 py-1 rounded text-xs font-bold transition-colors ${filterTH === th ? 'bg-skin-primary text-black' : 'bg-black/20 text-skin-muted hover:text-white'}`}>{th}</button>
                ))}
             </div>
          </div>
       </div>

       {loading && <div className="space-y-4"><SkeletonLoader /><SkeletonLoader /></div>}

       <div className="grid gap-8">
          {!loading && filtered.length === 0 && <div className="text-center py-20 opacity-50 font-clash text-xl text-skin-muted">No guides found for TH{filterTH}.</div>}

          {filtered.map(strat => {
             const { troops, spells } = getArmySplit(strat.army_comp);
             const videoId = getYoutubeId(strat.video_url);
             const isPlaying = playingVideo === strat.id;
             
             return (
                <div key={strat.id} className="bg-skin-surface border border-skin-primary/10 rounded-2xl p-5 md:p-6 flex flex-col lg:flex-row gap-6 hover:border-skin-primary/30 transition-all shadow-lg group">
                   
                   {/* LEFT: Info & Video */}
                   <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between">
                         <div>
                            <h3 className="text-2xl font-bold text-white leading-none group-hover:text-skin-primary transition-colors">{strat.title}</h3>
                            <div className="flex flex-wrap gap-2 mt-2">
                               {strat.town_halls.map(th => (<span key={th} className="text-[10px] font-bold text-black bg-skin-primary px-1.5 py-0.5 rounded shadow-sm">TH{th}</span>))}
                               <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase ${strat.difficulty === 'Pro' ? 'text-red-400 border-red-500/50' : 'text-green-400 border-green-500/50'}`}>{strat.difficulty}</span>
                            </div>
                         </div>
                      </div>
                      
                      <p className="text-sm text-skin-muted leading-relaxed border-l-2 border-skin-primary/20 pl-3">{strat.description}</p>
                      
                      {/* VIDEO PLAYER */}
                      {videoId && (
                        <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-white/10 mt-4 shadow-xl">
                            {isPlaying ? (
                                <iframe 
                                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1`} 
                                    className="w-full h-full" 
                                    allow="autoplay; encrypted-media" 
                                    allowFullScreen
                                ></iframe>
                            ) : (
                                <button onClick={() => setPlayingVideo(strat.id)} className="group/video w-full h-full relative flex items-center justify-center">
                                    <img src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover/video:opacity-100 transition-opacity" alt="Video Thumbnail"/>
                                    <div className="absolute inset-0 bg-black/40 group-hover/video:bg-black/20 transition-colors"></div>
                                    <div className="relative w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-2xl group-hover/video:scale-110 transition-transform">
                                        <PlayCircle size={32} className="text-white fill-white"/>
                                    </div>
                                </button>
                            )}
                        </div>
                      )}
                   </div>

                   {/* RIGHT: Army Card */}
                   <div className="bg-[#131b24] p-4 rounded-xl border border-white/5 w-full lg:w-72 shrink-0 flex flex-col justify-center">
                      {troops.length > 0 && (
                         <div className="mb-4">
                            <div className="text-[10px] uppercase font-bold text-skin-muted mb-2 flex items-center gap-1"><Swords size={12}/> Army Composition</div>
                            <div className="flex flex-wrap gap-2">
                               {troops.map((item: any, idx: number) => (
                                  <div key={idx} className="relative w-10 h-10 bg-[#2a3a4b] rounded-lg border border-white/10 shadow-sm" title={item.unit}>
                                     <img src={getUnitIconPath(item.unit)} onError={(e) => { e.currentTarget.style.display='none'; }} className="w-full h-full object-contain p-0.5" alt={item.unit}/>
                                     <div className="absolute -top-1.5 -right-1.5 bg-black text-white text-[9px] font-bold px-1 rounded border border-white/20">{item.count}</div>
                                  </div>
                               ))}
                            </div>
                         </div>
                      )}
                      
                      {/* COPY ARMY BUTTON */}
                      {strat.army_link && (
                          <a href={strat.army_link} target="_blank" className="mt-4 flex items-center justify-center gap-2 w-full bg-skin-secondary hover:bg-white text-black font-bold text-xs py-3 rounded-lg transition-colors shadow-lg">
                              <Copy size={14}/> Copy Army Link
                          </a>
                      )}
                      {!strat.army_link && (
                          <div className="mt-4 text-center text-[10px] text-skin-muted opacity-50 italic">Army link not available</div>
                      )}
                   </div>
                </div>
             );
          })}
       </div>
    </div>
   )
}