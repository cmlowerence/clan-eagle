'use client';

import { useTheme } from "@/components/ThemeProvider";
import { Search, ArrowRight, Shield, Zap, Skull, Flame, User, Users, Clock, Trash2 } from "lucide-react";
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
  
  // Categorize History
  const recentClans = recent.filter(r => r.type === 'clan');
  const recentPlayers = recent.filter(r => r.type === 'player');

  return (
    // FIX: Changed justify-center to justify-start on mobile + added pt-24
    <div className="flex flex-col items-center justify-start md:justify-center min-h-[80vh] text-center gap-8 px-4 pb-12 pt-24 md:pt-0">
      
      <div className="space-y-4 max-w-2xl animate-in fade-in zoom-in duration-700 mt-4 md:mt-0">
        <h1 className="text-6xl md:text-9xl font-clash text-transparent bg-clip-text bg-gradient-to-b from-skin-primary to-skin-secondary drop-shadow-lg stroke-black" style={{ WebkitTextStroke: '2px black' }}>
          CLAN<br className="md:hidden" /><span className="text-skin-text">EAGLE</span>
        </h1>
        <h2 className="text-lg md:text-2xl font-bold text-skin-text font-clash tracking-wider uppercase">Stats & Analytics</h2>
      </div>

      {/* SEARCH */}
      <div className="w-full max-w-md space-y-4">
        <div className="flex bg-skin-surface p-1 rounded-full border border-skin-primary/20 w-fit mx-auto">
          <button onClick={() => setSearchType('clan')} className={`flex items-center gap-2 px-6 py-1.5 rounded-full text-xs font-bold uppercase transition-all ${searchType === 'clan' ? 'bg-skin-primary text-black shadow-md' : 'text-skin-muted hover:text-skin-text'}`}><Users size={14} /> Clan</button>
          <button onClick={() => setSearchType('player')} className={`flex items-center gap-2 px-6 py-1.5 rounded-full text-xs font-bold uppercase transition-all ${searchType === 'player' ? 'bg-skin-primary text-black shadow-md' : 'text-skin-muted hover:text-skin-text'}`}><User size={14} /> Player</button>
        </div>

        <form onSubmit={handleSearch} className="relative group shadow-2xl">
          <div className="absolute -inset-1 bg-gradient-to-r from-skin-primary to-skin-secondary rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
          <div className="relative flex">
            <input type="text" value={tag} onChange={(e) => setTag(e.target.value)} placeholder={`#${searchType.toUpperCase()} TAG`} className="w-full bg-skin-bg p-4 rounded-l-xl border-2 border-r-0 border-skin-primary/30 focus:outline-none focus:border-skin-primary text-skin-text placeholder:text-skin-muted/50 font-black uppercase tracking-widest" />
            <button type="submit" className="bg-skin-primary text-white px-6 md:px-8 rounded-r-xl font-clash text-xl hover:bg-skin-secondary transition-colors flex items-center gap-2 border-2 border-l-0 border-skin-primary">GO <ArrowRight size={24} /></button>
          </div>
        </form>

        <div className="pt-2">
           <Link href="/compare" className="text-xs font-bold text-skin-secondary hover:text-skin-primary border-b border-transparent hover:border-skin-primary transition-colors pb-0.5">⚔️ Go to Comparison Tool</Link>
        </div>

        {/* CATEGORIZED RECENT HISTORY */}
        {recent.length > 0 && (
          <div className="bg-skin-surface/40 border border-skin-primary/10 rounded-xl p-4 mt-6 backdrop-blur-sm text-left animate-in slide-in-from-bottom-2">
             <div className="flex justify-between items-center mb-3">
                <h3 className="text-xs font-bold text-skin-muted uppercase flex items-center gap-1"><Clock size={12}/> Recent History</h3>
                <button onClick={clearHistory} className="text-skin-muted hover:text-red-400 transition-colors"><Trash2 size={12}/></button>
             </div>

             <div className="grid grid-cols-2 gap-4">
                {/* CLANS COLUMN */}
                {recentClans.length > 0 && (
                  <div className="space-y-2">
                     <h4 className="text-[10px] font-bold text-skin-primary uppercase tracking-widest mb-1 border-b border-skin-primary/10 pb-1">Clans</h4>
                     {recentClans.map((item, idx) => (
                        <Link key={idx} href={`/clan/${encodeURIComponent(item.tag)}`} className="flex items-center gap-2 p-2 hover:bg-skin-bg/50 rounded-lg transition-colors group border border-transparent hover:border-skin-primary/10">
                           <div className="w-6 h-6 rounded overflow-hidden bg-black/20 shrink-0">
                              <img src={item.icon} className="w-full h-full object-contain" alt="" onError={(e) => { e.currentTarget.style.display='none'}}/>
                           </div>
                           <div className="min-w-0">
                              <p className="text-xs font-bold text-skin-text truncate">{item.name}</p>
                              <p className="text-[9px] text-skin-muted font-mono truncate">{item.tag}</p>
                           </div>
                        </Link>
                     ))}
                  </div>
                )}

                {/* PLAYERS COLUMN */}
                {recentPlayers.length > 0 && (
                   <div className="space-y-2">
                     <h4 className="text-[10px] font-bold text-skin-secondary uppercase tracking-widest mb-1 border-b border-skin-secondary/10 pb-1">Players</h4>
                     {recentPlayers.map((item, idx) => (
                        <Link key={idx} href={`/player/${encodeURIComponent(item.tag)}`} className="flex items-center gap-2 p-2 hover:bg-skin-bg/50 rounded-lg transition-colors group border border-transparent hover:border-skin-secondary/10">
                           <div className="w-6 h-6 rounded overflow-hidden bg-black/20 shrink-0">
                               <img src={item.icon} className="w-full h-full object-contain" alt="" onError={(e) => { e.currentTarget.style.display='none'}}/>
                           </div>
                           <div className="min-w-0">
                              <p className="text-xs font-bold text-skin-text truncate">{item.name}</p>
                              <p className="text-[9px] text-skin-muted font-mono truncate">{item.tag}</p>
                           </div>
                        </Link>
                     ))}
                   </div>
                )}
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
