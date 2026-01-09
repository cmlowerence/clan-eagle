 'use client';

import { useTheme } from "@/components/ThemeProvider";
import { Search, ArrowRight, Shield, Zap, Skull, User, Users, Clock, Trash2, Sword, TrendingUp, LayoutGrid, Crown, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const { theme } = useTheme();
  const [tag, setTag] = useState("");
  const [searchType, setSearchType] = useState<'clan' | 'player'>('clan');
  const [recent, setRecent] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem('clash_search_history');
    if (saved) setRecent(JSON.parse(saved));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if(tag) {
      const cleanTag = tag.trim().toUpperCase().replace('#', '');
      const path = searchType === 'clan' ? `/clan` : `/player`;
      router.push(`${path}/${encodeURIComponent('#' + cleanTag)}`);
    }
  }

  const clearHistory = () => {
    localStorage.removeItem('clash_search_history');
    setRecent([]);
  };
  
  const recentClans = recent.filter(r => r.type === 'clan').slice(0, 4);
  const recentPlayers = recent.filter(r => r.type === 'player').slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col items-center relative overflow-hidden">
      
      {/* BACKGROUND FX */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-skin-primary/10 blur-[100px] rounded-full pointer-events-none -z-10"></div>
      
      <div className="w-full max-w-5xl px-4 pt-20 pb-24 flex flex-col items-center gap-10 z-10">
        
        {/* --- HERO SECTION --- */}
        <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-skin-surface border border-skin-primary/20 text-[10px] font-bold uppercase tracking-widest text-skin-primary mb-2 shadow-[0_0_15px_-5px_var(--color-primary)]">
            <Zap size={12} fill="currentColor" /> The Ultimate Clash Companion
          </div>
          
          <h1 className="text-7xl md:text-9xl font-clash leading-[0.85] tracking-tighter drop-shadow-2xl">
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#facc15] to-[#ca8a04] stroke-black" style={{ WebkitTextStroke: '1px rgba(0,0,0,0.5)' }}>CLAN</span>
            <br />
            <span className="text-skin-text">EAGLE</span>
          </h1>
          
          <p className="text-skin-muted max-w-md mx-auto text-sm md:text-base font-medium">
            Track stats, plan armies, and dominate the war map. Your village needs a leader.
          </p>
        </div>

        {/* --- SEARCH COMPONENT --- */}
        <div className="w-full max-w-lg relative z-20 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
           {/* Glass Container */}
           <div className="bg-skin-surface/60 backdrop-blur-xl border border-white/10 p-2 rounded-2xl shadow-2xl">
              
              {/* Toggle */}
              <div className="flex bg-black/20 p-1 rounded-xl mb-2">
                <button onClick={() => setSearchType('clan')} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold uppercase transition-all ${searchType === 'clan' ? 'bg-skin-primary text-black shadow-lg' : 'text-skin-muted hover:text-white'}`}>
                    <Users size={14} /> Find Clan
                </button>
                <button onClick={() => setSearchType('player')} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold uppercase transition-all ${searchType === 'player' ? 'bg-skin-primary text-black shadow-lg' : 'text-skin-muted hover:text-white'}`}>
                    <User size={14} /> Find Player
                </button>
              </div>

              {/* Input */}
              <form onSubmit={handleSearch} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-skin-primary to-skin-secondary rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                <div className="relative flex">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-skin-muted">
                        <Search size={20} />
                    </div>
                    <input 
                        type="text" 
                        value={tag} 
                        onChange={(e) => setTag(e.target.value)} 
                        placeholder={searchType === 'clan' ? "#CLAN TAG" : "#PLAYER TAG"} 
                        className="w-full bg-[#1a232e] py-4 pl-12 pr-4 rounded-l-xl focus:outline-none text-white font-clash tracking-wider placeholder:font-sans placeholder:text-skin-muted/40 uppercase" 
                    />
                    <button type="submit" className="bg-gradient-to-br from-skin-primary to-skin-secondary text-black px-6 md:px-8 rounded-r-xl font-clash text-lg hover:brightness-110 transition-all flex items-center gap-2">
                        GO <ArrowRight size={20} strokeWidth={3} />
                    </button>
                </div>
              </form>
              
              {/* Search by Name Link */}
              <div className="text-center mt-3">
                 <Link href="/search" className="text-xs text-skin-muted hover:text-skin-primary underline decoration-dotted underline-offset-4">
                    Don't know the tag? Search by Name
                 </Link>
              </div>
           </div>
        </div>

        {/* --- TOOLS GRID (UPDATED LINKS) --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            <Link href="/army" className="bg-skin-surface border border-skin-primary/10 p-4 rounded-xl flex flex-col items-center gap-2 hover:bg-skin-primary/10 hover:border-skin-primary/30 transition-all group">
                <div className="w-10 h-10 bg-skin-primary/20 text-skin-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"><Sword size={20}/></div>
                <span className="text-xs font-bold uppercase text-skin-text">Army Planner</span>
            </Link>
            <Link href="/layouts" className="bg-skin-surface border border-skin-primary/10 p-4 rounded-xl flex flex-col items-center gap-2 hover:bg-blue-500/10 hover:border-blue-500/30 transition-all group">
                <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"><LayoutGrid size={20}/></div>
                <span className="text-xs font-bold uppercase text-skin-text">Base Layouts</span>
            </Link>
            <Link href="/strategies" className="bg-skin-surface border border-skin-primary/10 p-4 rounded-xl flex flex-col items-center gap-2 hover:bg-red-500/10 hover:border-red-500/30 transition-all group">
                <div className="w-10 h-10 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"><Crown size={20}/></div>
                <span className="text-xs font-bold uppercase text-skin-text">Pro Guides</span>
            </Link>
            <Link href="/leaderboard" className="bg-skin-surface border border-skin-primary/10 p-4 rounded-xl flex flex-col items-center gap-2 hover:bg-yellow-500/10 hover:border-yellow-500/30 transition-all group">
                <div className="w-10 h-10 bg-yellow-500/20 text-yellow-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"><Globe size={20}/></div>
                <span className="text-xs font-bold uppercase text-skin-text">Rankings</span>
            </Link>
        </div>

        {/* --- BATTLE LOG (History) --- */}
        {recent.length > 0 && (
          <div className="w-full bg-[#131b24] border border-white/5 rounded-2xl p-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
             <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
                <h3 className="text-sm font-bold text-skin-muted uppercase flex items-center gap-2 tracking-widest"><Clock size={14}/> Battle Log (History)</h3>
                <button onClick={clearHistory} className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-1 bg-red-500/10 px-2 py-1 rounded transition-colors"><Trash2 size={10}/> CLEAR</button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* CLANS */}
                {recentClans.length > 0 && (
                  <div className="space-y-3">
                     <h4 className="text-[10px] font-bold text-skin-primary uppercase tracking-widest flex items-center gap-2"><Shield size={10}/> Clans Scouted</h4>
                     <div className="grid grid-cols-1 gap-2">
                     {recentClans.map((item, idx) => (
                        <Link key={idx} href={`/clan/${encodeURIComponent(item.tag)}`} className="flex items-center gap-3 p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-transparent hover:border-skin-primary/30 transition-all group">
                           <div className="w-8 h-8 rounded bg-black/30 flex items-center justify-center shrink-0">
                              <img src={item.icon} className="w-6 h-6 object-contain" alt="" onError={(e) => { e.currentTarget.style.display='none'}}/>
                           </div>
                           <div className="min-w-0">
                              <p className="text-xs font-bold text-white truncate group-hover:text-skin-primary transition-colors">{item.name}</p>
                              <p className="text-[10px] text-skin-muted font-mono truncate">{item.tag}</p>
                           </div>
                           <ArrowRight size={14} className="ml-auto text-skin-muted opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                        </Link>
                     ))}
                     </div>
                  </div>
                )}

                {/* PLAYERS */}
                {recentPlayers.length > 0 && (
                   <div className="space-y-3">
                     <h4 className="text-[10px] font-bold text-skin-secondary uppercase tracking-widest flex items-center gap-2"><Sword size={10}/> Players Scouted</h4>
                     <div className="grid grid-cols-1 gap-2">
                     {recentPlayers.map((item, idx) => (
                        <Link key={idx} href={`/player/${encodeURIComponent(item.tag)}`} className="flex items-center gap-3 p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-transparent hover:border-skin-secondary/30 transition-all group">
                           <div className="w-8 h-8 rounded bg-black/30 flex items-center justify-center shrink-0">
                               <img src={item.icon} className="w-6 h-6 object-contain" alt="" onError={(e) => { e.currentTarget.style.display='none'}}/>
                           </div>
                           <div className="min-w-0">
                              <p className="text-xs font-bold text-white truncate group-hover:text-skin-secondary transition-colors">{item.name}</p>
                              <p className="text-[10px] text-skin-muted font-mono truncate">{item.tag}</p>
                           </div>
                           <ArrowRight size={14} className="ml-auto text-skin-muted opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                        </Link>
                     ))}
                     </div>
                   </div>
                )}
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
