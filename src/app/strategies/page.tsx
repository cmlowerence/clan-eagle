'use client';

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { getUnitIconPath, getUnitCategory } from "@/lib/unitHelpers";
import { Play, Swords, Zap, Filter, ShieldAlert, ArrowLeft } from "lucide-react";
import SkeletonLoader from "@/components/SkeletonLoader";
import Link from "next/link";

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
       
       {/* --- HEADER --- */}
       <div className="pt-6 flex flex-col items-center relative">
          <Link href="/" className="absolute left-0 top-6 flex items-center gap-2 text-skin-muted hover:text-skin-primary transition-colors group">
             <div className="p-2 bg-[#1f2937] rounded-full border border-white/5 group-hover:border-skin-primary/30">
                <ArrowLeft size={18} />
             </div>
             <span className="hidden md:inline text-sm font-bold uppercase tracking-widest">Home</span>
          </Link>

          <div className="text-center space-y-2 mt-2">
            <h1 className="text-4xl md:text-5xl font-clash text-white uppercase tracking-wide">
                Pro Guides
            </h1>
            <p className="text-skin-muted text-sm max-w-md mx-auto">
                Attack strategies for every Town Hall level.
            </p>
          </div>
       </div>

       {/* --- FILTER --- */}
       <div className="flex justify-center sticky top-20 z-40">
          <div className="flex items-center gap-3 bg-[#1f2937]/95 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 shadow-lg overflow-x-auto max-w-full no-scrollbar">
             <Filter size={16} className="text-skin-muted shrink-0"/>
             <span className="text-xs font-bold text-skin-muted uppercase shrink-0">Town Hall:</span>
             <div className="flex gap-1">
                <button onClick={() => setFilterTH('all')} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${filterTH === 'all' ? 'bg-skin-primary text-black' : 'bg-white/5 text-skin-muted hover:text-white'}`}>ALL</button>
                {TOWN_HALLS.map(th => (
                   <button key={th} onClick={() => setFilterTH(th)} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap ${filterTH === th ? 'bg-skin-primary text-black' : 'bg-white/5 text-skin-muted hover:text-white'}`}>{th}</button>
                ))}
             </div>
          </div>
       </div>

       {loading && <div className="space-y-6"><SkeletonLoader /><SkeletonLoader /></div>}

       <div className="grid gap-6">
          {!loading && filtered.length === 0 && (
             <div className="text-center py-24 opacity-60 flex flex-col items-center gap-4">
                <ShieldAlert size={40} className="text-skin-muted"/>
                <p className="text-xl font-clash text-white">No guides found</p>
                <button onClick={() => setFilterTH('all')} className="text-skin-primary hover:underline text-sm">View all strategies</button>
             </div>
          )}

          {filtered.map(strat => {
             const { troops, spells } = getArmySplit(strat.army_comp);
             const videoId = getYoutubeId(strat.video_url);
             const isPlaying = playingVideo === strat.id;
             
             return (
                <div key={strat.id} className="bg-[#1a232e] border border-white/5 rounded-xl p-5 md:p-6 flex flex-col lg:flex-row gap-8 hover:border-skin-primary/20 transition-all shadow-lg group">
                   
                   {/* Info & Video */}
                   <div className="flex-1 space-y-5">
                      <div className="flex items-start justify-between gap-4">
                         <div>
                            <h3 className="text-2xl font-bold text-white leading-tight group-hover:text-skin-primary transition-colors">
                               {strat.title}
                            </h3>
                            <div className="flex flex-wrap gap-2 mt-3">
                               {strat.town_halls.map(th => (<span key={th} className="text-[10px] font-bold text-skin-muted bg-black/40 border border-white/10 px-2 py-0.5 rounded">TH{th}</span>))}
                               <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${strat.difficulty === 'Pro' ? 'text-red-400 border-red-500/30' : 'text-green-400 border-green-500/30'}`}>{strat.difficulty}</span>
                            </div>
                         </div>
                      </div>
                      
                      <p className="text-sm text-skin-muted leading-relaxed border-l-2 border-white/10 pl-4">
                         {strat.description}
                      </p>
                      
                      {/* Video Player */}
                      {videoId && (
                        <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black border border-white/10 mt-2">
                            {isPlaying ? (
                                <iframe src={`https://www.youtube.com/embed/${videoId}?autoplay=1`} className="w-full h-full" allow="autoplay; encrypted-media" allowFullScreen></iframe>
                            ) : (
                                <button onClick={() => setPlayingVideo(strat.id)} className="group/video w-full h-full relative flex items-center justify-center">
                                    <img src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover/video:opacity-100 transition-opacity" alt="Video Thumbnail"/>
                                    <div className="absolute inset-0 bg-black/40 group-hover/video:bg-black/10 transition-colors"></div>
                                    <div className="relative w-14 h-10 bg-[#FF0000] rounded-lg flex items-center justify-center shadow-2xl group-hover/video:scale-110 transition-transform duration-300">
                                        <Play size={20} className="text-white fill-white ml-0.5"/>
                                    </div>
                                </button>
                            )}
                        </div>
                      )}
                   </div>

                   {/* Army Preview */}
                   <div className="bg-[#131b24] p-5 rounded-lg border border-white/5 w-full lg:w-80 shrink-0 flex flex-col h-fit">
                      <div className="space-y-6">
                          {troops.length > 0 && (
                             <div>
                                <div className="text-[10px] uppercase font-bold text-skin-muted mb-3 flex items-center gap-1 border-b border-white/5 pb-1">
                                   <Swords size={12}/> Army Composition
                                </div>
                                <div className="flex flex-wrap gap-2">
                                   {troops.map((item: any, idx: number) => (
                                      <div key={idx} className="relative w-10 h-10 bg-[#2a3a4b] rounded border border-white/10" title={item.unit}>
                                         <img src={getUnitIconPath(item.unit)} onError={(e) => { e.currentTarget.style.display='none'; }} className="w-full h-full object-contain p-0.5" alt={item.unit}/>
                                         <div className="absolute -top-1.5 -right-1.5 bg-black text-white text-[9px] font-bold px-1 rounded border border-white/20">{item.count}</div>
                                      </div>
                                   ))}
                                </div>
                             </div>
                          )}

                          {spells.length > 0 && (
                             <div>
                                <div className="text-[10px] uppercase font-bold text-skin-muted mb-3 flex items-center gap-1 border-b border-white/5 pb-1">
                                   <Zap size={12}/> Spells
                                </div>
                                <div className="flex flex-wrap gap-2">
                                   {spells.map((item: any, idx: number) => (
                                      <div key={idx} className="relative w-9 h-9 bg-[#2a3a4b] rounded border border-white/10" title={item.unit}>
                                         <img src={getUnitIconPath(item.unit)} onError={(e) => { e.currentTarget.style.display='none'; }} className="w-full h-full object-contain p-1" alt={item.unit}/>
                                         <div className="absolute -top-1.5 -right-1.5 bg-black text-white text-[9px] font-bold px-1 rounded border border-white/20">{item.count}</div>
                                      </div>
                                   ))}
                                </div>
                             </div>
                          )}
                      </div>
                      
                      <div className="mt-8 pt-4 border-t border-white/10">
                          {strat.army_link ? (
                              <a href={strat.army_link} target="_blank" className="flex items-center justify-center gap-2 w-full bg-skin-secondary hover:bg-white text-black font-bold text-xs py-3 rounded-lg transition-colors">
                                  <Swords size={14} /> <span>Train Army</span>
                              </a>
                          ) : (
                              <div className="flex items-center justify-center gap-2 w-full bg-white/5 text-skin-muted font-bold text-xs py-3 rounded-lg border border-white/5 cursor-not-allowed opacity-60">
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