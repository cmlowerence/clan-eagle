 'use client';

import { useTheme } from "./ThemeProvider";
import { THEMES, ThemeType } from "@/lib/themes";
import { Search, ChevronDown, Star, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getFavorites, toggleFavorite } from "@/lib/utils"; // Import utils

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [searchTag, setSearchTag] = useState("");
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isFavOpen, setIsFavOpen] = useState(false);
  const [favorites, setFavorites] = useState<any[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const favRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTag) return;
    const tag = searchTag.trim().replace('#', '');
    router.push(`/clan/${encodeURIComponent('#' + tag)}`); // Default to clan search from nav
    setSearchTag("");
  };

  // Load Favorites when menu opens
  const openFavs = () => {
    setFavorites(getFavorites());
    setIsFavOpen(!isFavOpen);
    setIsThemeOpen(false);
  };

  const removeFav = (e: React.MouseEvent, tag: string) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(tag, "", "player", ""); // params don't matter for removal
    setFavorites(getFavorites());
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsThemeOpen(false);
      if (favRef.current && !favRef.current.contains(event.target as Node)) setIsFavOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeTheme = THEMES[theme];

  return (
    <nav className="border-b border-skin-primary/30 bg-skin-surface/90 backdrop-blur-md sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 group">
          <h1 className="text-2xl md:text-3xl font-clash text-skin-text drop-shadow-md group-hover:scale-105 transition-transform">
            CLAN <span className="text-skin-primary">EAGLE</span>
          </h1>
        </Link>

        {/* ACTIONS */}
        <div className="flex items-center gap-3">
            
            {/* DESKTOP SEARCH */}
            <form onSubmit={handleSearch} className="hidden md:flex relative w-64">
              <input 
                type="text" 
                placeholder="#CLAN TAG"
                value={searchTag}
                onChange={(e) => setSearchTag(e.target.value)}
                className="w-full bg-skin-bg border-2 border-skin-primary/30 rounded-full py-1.5 px-4 text-sm focus:outline-none focus:border-skin-primary text-skin-text font-bold placeholder:font-normal"
              />
              <button type="submit" className="absolute right-2 top-1.5 text-skin-primary hover:text-skin-secondary">
                <Search size={20} />
              </button>
            </form>

            {/* FAVORITES DROPDOWN (NEW) */}
            <div className="relative" ref={favRef}>
               <button onClick={openFavs} className="flex items-center justify-center w-10 h-10 rounded-full bg-skin-bg border border-skin-primary/30 hover:bg-skin-primary/20 text-skin-primary transition-colors">
                  <Star size={20} fill={isFavOpen ? "currentColor" : "none"} />
               </button>
               
               {isFavOpen && (
                 <div className="absolute right-0 top-full mt-2 w-64 bg-skin-surface border border-skin-primary/20 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 p-2">
                    <h3 className="text-xs font-bold text-skin-muted uppercase mb-2 px-2">Bookmarked</h3>
                    {favorites.length === 0 ? (
                      <div className="text-center py-4 text-sm text-skin-muted">No favorites yet.<br/><span className="text-xs">Click the Star on profiles!</span></div>
                    ) : (
                      <div className="max-h-60 overflow-y-auto space-y-1">
                         {favorites.map((fav) => (
                           <Link key={fav.tag} href={`/${fav.type}/${encodeURIComponent(fav.tag)}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-skin-bg group transition-colors relative">
                              <img src={fav.icon || '/assets/icons/barbarian.png'} className="w-8 h-8 object-contain" alt=""/>
                              <div className="min-w-0">
                                 <div className="text-xs font-bold text-skin-text truncate">{fav.name}</div>
                                 <div className="text-[10px] text-skin-muted">{fav.tag}</div>
                              </div>
                              <button onClick={(e) => removeFav(e, fav.tag)} className="absolute right-2 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500"><X size={14}/></button>
                           </Link>
                         ))}
                      </div>
                    )}
                 </div>
               )}
            </div>

            {/* THEME SELECTOR */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsThemeOpen(!isThemeOpen)}
                className="flex items-center gap-2 bg-skin-bg border border-skin-primary/30 rounded-full pl-1 pr-3 py-1 hover:bg-skin-primary/10 transition-colors"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border border-skin-muted/50">
                   <img src={`/assets/icons/${activeTheme.icon}`} alt="Theme" className="w-full h-full object-cover" />
                </div>
                <ChevronDown size={14} className={`text-skin-muted transition-transform ${isThemeOpen ? 'rotate-180' : ''}`} />
              </button>

              {isThemeOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-skin-surface border border-skin-primary/20 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                  <div className="p-2 grid gap-1">
                    {(Object.keys(THEMES) as ThemeType[]).map((t) => (
                      <button
                        key={t}
                        onClick={() => { setTheme(t); setIsThemeOpen(false); }}
                        className={`flex items-center gap-3 p-2 rounded-lg text-left transition-colors ${
                          theme === t ? 'bg-skin-primary/20 border border-skin-primary/30' : 'hover:bg-skin-bg'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-skin-muted/30 bg-black/20 shrink-0">
                          <img src={`/assets/icons/${THEMES[t].icon}`} alt={THEMES[t].name} className="w-full h-full object-contain" />
                        </div>
                        <p className={`text-xs font-bold uppercase ${theme === t ? 'text-skin-primary' : 'text-skin-text'}`}>{THEMES[t].name}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
        </div>
      </div>
    </nav>
  );
}
