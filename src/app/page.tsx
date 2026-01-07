'use client';

import { useTheme } from "@/components/ThemeProvider";
import { Search, ArrowRight, Shield, Zap, Skull, Flame } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { theme } = useTheme();
  const [tag, setTag] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if(tag) {
      const cleanTag = tag.trim().toUpperCase().replace('#', '');
      router.push(`/clan/${encodeURIComponent('#' + cleanTag)}`);
    }
  }

  const getThemeContent = () => {
    switch(theme) {
      case 'classic': return { desc: "The legendary look. Gold & Stone.", icon: <Shield size={32} /> };
      case 'baby': return { desc: "Tantrums included. Green & Orange.", icon: <Shield size={32} /> };
      case 'pekka': return { desc: "Futuristic armor and neon energy.", icon: <Shield size={32} /> };
      case 'edrag': return { desc: "Chain lightning destruction.", icon: <Zap size={32} /> };
      case 'hog': return { desc: "Fast-paced action and hammers.", icon: <Skull size={32} /> };
      case 'lava': return { desc: "Air superiority and molten rock.", icon: <Flame size={32} /> };
      default: return { desc: "Select a theme to begin.", icon: <Shield size={32} /> };
    }
  };

  const themeData = getThemeContent();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center gap-8 md:gap-12 px-4">
      <div className="space-y-4 max-w-2xl animate-in fade-in zoom-in duration-700 mt-10 md:mt-0">
        <h1 className="text-6xl md:text-9xl font-clash text-transparent bg-clip-text bg-gradient-to-b from-skin-primary to-skin-secondary drop-shadow-lg stroke-black" style={{ WebkitTextStroke: '2px black' }}>
          CLAN
          <br className="md:hidden" />
          <span className="text-skin-text">EAGLE</span>
        </h1>
        <h2 className="text-lg md:text-2xl font-bold text-skin-text font-clash tracking-wider uppercase">
          Profile & Clan Tracker
        </h2>
        <p className="text-skin-muted text-sm md:text-lg max-w-md mx-auto font-mono">
          Enter a Clan Tag to view advanced analytics.
        </p>
      </div>

      <form onSubmit={handleSearch} className="w-full max-w-md relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-skin-primary to-skin-secondary rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
        <div className="relative flex shadow-2xl">
          <input 
            type="text" 
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="#CLAN TAG"
            className="w-full bg-skin-bg p-4 rounded-l-xl border-2 border-r-0 border-skin-primary/30 focus:outline-none focus:border-skin-primary text-skin-text placeholder:text-skin-muted/50 font-black uppercase tracking-widest"
          />
          <button type="submit" className="bg-skin-primary text-white px-6 md:px-8 rounded-r-xl font-clash text-xl hover:bg-skin-secondary transition-colors flex items-center gap-2 border-2 border-l-0 border-skin-primary">
            GO <ArrowRight size={24} />
          </button>
        </div>
      </form>

      <div className="mt-8 p-6 border border-skin-primary/20 bg-skin-surface/30 rounded-2xl max-w-lg backdrop-blur-sm relative overflow-hidden group hover:border-skin-primary/50 transition-colors">
        <div className="relative z-10 text-left flex items-center gap-4">
           <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-skin-primary/50 shadow-lg">
             {/* Uses the hook to get current theme icon path */}
             <img src={`/assets/icons/${theme === 'classic' ? 'barbarian.png' : theme === 'baby' ? 'baby_dragon.png' : theme === 'pekka' ? 'p_e_k_k_a.png' : theme === 'edrag' ? 'electro_dragon.png' : theme === 'hog' ? 'hog_rider.png' : 'lava_hound.png'}`} alt="" className="w-full h-full object-cover"/>
           </div>
           <div>
             <h3 className="text-xl font-clash text-skin-primary mb-0 uppercase tracking-wide">{theme} Mode</h3>
             <p className="text-skin-muted text-xs">{themeData.desc}</p>
           </div>
        </div>
      </div>
    </div>
  );
}

