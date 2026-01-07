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
  const [recentSearches, setRecentSearches] = useState<any[]>([]);
  const router = useRouter();

  // Load History on Mount
  useEffect(() => {
    const saved = localStorage.getItem('clash_search_history');
    if (saved) setRecentSearches(JSON.parse(saved));
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
    setRecentSearches([]);
  };

  const getThemeContent = () => {
    switch(theme) {
      case 'classic': return { desc: "Gold & Stone.", icon: <Shield size={32} /> };
      case 'baby': return { desc: "Green & Orange.", icon: <Shield size={32} /> };
      case 'pekka': return { desc: "Neon Energy.", icon: <Shield size={32} /> };
      case 'edrag': return { desc: "Electric Storm.", icon: <Zap size={32} /> };
      case 'hog': return { desc: "Hammers & Mud.", icon: <Skull size={32} /> };
      case 'lava': return { desc: "Molten Rock.", icon: <Flame size={32} /> };
      default: return { desc: "Select a theme.", icon: <Shield size={32} /> };
    }
  };

  const themeData = getThemeContent();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center gap-8 px-4">
      <div className="space-y-4 max-w-2xl animate-in fade-in zoom-in duration-700 mt-10 md:mt-0">
        <h1 className="text-6xl md:text-9xl font-clash text-transparent bg-clip-text bg-gradient-to-b from-skin-primary to-skin-secondary drop-shadow-lg stroke-black" style={{ WebkitTextStroke: '2px black' }}>
          CLAN<br className="md:hidden" /><span className="text-skin-text">EAGLE</span>
        </h1>
        <h2 className="text-lg md:text-2xl font-bold text-skin-text font-clash tracking-wider uppercase">
          Stats & Analytics
        </h2>
      </div>

      {/* SEARCH CONTAINER */}
      <div className="w-full max-w-md space-y-4">
        
        {/* Type Toggle */}
        <div className="flex bg-skin-surface p-1 rounded-full border border-skin-primary/20 w-fit mx-auto">
          <button 
            onClick={() => setSearchType('clan')}
            className={`flex items-center gap-2 px-6 py-1.5 rounded-full text-xs font-bold uppercase transition-all ${searchType === 'clan' ? 'bg-skin-primary text-black shadow-md' : 'text-skin-muted hover:text-skin-text'}`}
          >
            <Users size={14} /> Clan
          </button>
          <button 
            onClick={() => setSearchType('player')}
            className={`flex items-center gap-2 px-6 py-1.5 rounded-full text-xs font-bold uppercase transition-all ${searchType === 'player' ? 'bg-skin-primary text-black shadow-md' : 'text-skin-muted hover:text-skin-text'}`}
          >
            <User size={14} /> Player
          </button>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative group shadow-2xl">
          <div className="absolute -inset-1 bg-gradient-to-r from-skin-primary to-skin-secondary rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
          <div className="relative flex">
            <input 
              type="text" 
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder={`#${searchType.toUpperCase()} TAG`}
              className="w-full bg-skin-bg p-4 rounded-l-xl border-2 border-r-0 border-skin-primary/30 focus:outline-none focus:border-skin-primary text-skin-text placeholder:text-skin-muted/50 font-black uppercase tracking-widest"
            />
            <button type="submit" className="bg-skin-primary text-white px-6 md:px-8 rounded-r-xl font-clash text-xl hover:bg-skin-secondary transition-colors flex items-center gap-2 border-2 border-l-0 border-skin-primary">
              GO <ArrowRight size={24} />
            </button>
          </div>
        </form>

        {/* COMPARISON LINK */}
        <div className="pt-2">
           <Link href="/compare" className="text-xs font-bold text-skin-secondary hover:text-skin-primary border-b border-transparent hover:border-skin-primary transition-colors pb-0.5">
             ⚔️ Go to Comparison Tool
           </Link>
        </div>

        {/* RECENT SEARCHES (Eagle Eye) */}
        {recentSearches.length > 0 && (
          <div className="bg-skin-surface/40 border border-skin-primary/10 rounded-xl p-4 mt-6 backdrop-blur-sm text-left animate-in slide-in-from-bottom-2">
             <div className="flex justify-between items-center mb-3">
                <h3 className="text-xs font-bold text-skin-muted uppercase flex items-center gap-1"><Clock size={12}/> Recent Searches</h3>
                <button onClick={clearHistory} className="text-skin-muted hover:text-red-400 transition-colors"><Trash2 size={12}/></button>
             </div>
             <div className="grid gap-2">
                {recentSearches.map((item, idx) => (
                   <Link key={idx} href={`/${item.type}/${encodeURIComponent(item.tag)}`} className="flex items-center gap-3 p-2 hover:bg-skin-bg/50 rounded-lg transition-colors group">
                      <div className="w-8 h-8 rounded-lg overflow-hidden border border-skin-muted/20 bg-black/20">
                         {item.icon ? (
                           <img src={item.icon} className="w-full h-full object-contain" alt="" />
                         ) : <div className="w-full h-full flex items-center justify-center text-skin-muted">?</div>}
                      </div>
                      <div>
                         <p className="text-sm font-bold text-skin-text group-hover:text-skin-primary leading-none">{item.name || item.tag}</p>
                         <p className="text-[10px] text-skin-muted font-mono">{item.tag}</p>
                      </div>
                      <div className="ml-auto text-[10px] bg-black/20 px-2 py-0.5 rounded text-skin-muted uppercase">{item.type}</div>
                   </Link>
                ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
}

