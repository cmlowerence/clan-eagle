'use client';

import { useTheme } from "./ThemeProvider";
import { THEMES, ThemeType } from "@/lib/themes";
import { Search, ChevronDown, Star, Trash2, X, Sword, Menu, LayoutGrid, Crown, Globe } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getFavorites, toggleFavorite } from "@/lib/utils";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [searchTag, setSearchTag] = useState("");
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isFavOpen, setIsFavOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [favorites, setFavorites] = useState<any[]>([]);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const favRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTag) return;
    const tag = searchTag.trim().replace('#', '');
    router.push(`/clan/${encodeURIComponent('#' + tag)}`);
    setSearchTag("");
    setIsMobileMenuOpen(false); // Close mobile menu if open
  };

  const openFavs = () => {
    setFavorites(getFavorites());
    setIsFavOpen(!isFavOpen);
    setIsThemeOpen(false);
    setIsMobileMenuOpen(false);
  };

  const removeFav = (e: React.MouseEvent, tag: string) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(tag, "", "player", "");
    setFavorites(getFavorites());
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsThemeOpen(false);
      }
      if (favRef.current && !favRef.current.contains(event.target as Node)) {
        setIsFavOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeTheme = THEMES[theme];

  return (
    <nav className="border-b border-skin-primary/30 bg-skin-surface/90 backdrop-blur-md sticky top-0 z-[100] shadow-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* LEFT: LOGO */}
        <Link href="/" className="flex items-center gap-2 group z-50">
          <h1 className="text-2xl md:text-3xl font-clash text-skin-text drop-shadow-md group-hover:scale-105 transition-transform">
            CLAN <span className="text-skin-primary">EAGLE</span>
          </h1>
        </Link>

        {/* CENTER: DESKTOP NAV */}
        <div className="hidden lg:flex items-center gap-6">
            <Link href="/army" className="text-sm font-bold uppercase text-skin-muted hover:text-skin-primary transition-colors flex items-center gap-1"><Sword size={16}/> Army</Link>
            <Link href="/layouts" className="text-sm font-bold uppercase text-skin-muted hover:text-blue-400 transition-colors flex items-center gap-1"><LayoutGrid size={16}/> Layouts</Link>
            <Link href="/strategies" className="text-sm font-bold uppercase text-skin-muted hover:text-red-400 transition-colors flex items-center gap-1"><Crown size={16}/> Guides</Link>
            <Link href="/leaderboard" className="text-sm font-bold uppercase text-skin-muted hover:text-yellow-400 transition-colors flex items-center gap-1"><Globe size={16}/> Rankings</Link>
        </div>

        {/* RIGHT: ACTIONS */}
        <div className="flex items-center gap-2 md:gap-3 z-50">
            
            {/* SEARCH (Hidden on small mobile) */}
            <form onSubmit={handleSearch} className="hidden md:flex relative w-48 xl:w-64 mr-2">
              <input 
                type="text" 
                placeholder="#CLAN TAG"
                value={searchTag}
                onChange={(e) => setSearchTag(e.target.value)}
                className="w-full bg-skin-bg border-2 border-skin-primary/30 rounded-full py-1.5 px-4 text-xs font-bold focus:outline-none focus:border-skin-primary text-skin-text placeholder:font-normal uppercase"
              />
              <button type="submit" className="absolute right-2 top-1.5 text-skin-primary hover:text-skin-secondary transition-colors">
                <Search size={16} />
              </button>
            </form>

            {/* FAVORITES */}
            <div className="relative" ref={favRef}>
               <button onClick={openFavs} className={`flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full border transition-colors ${isFavOpen ? 'bg-skin-primary border-skin-primary text-black' : 'bg-skin-bg border-skin-primary/30 text-skin-primary hover:bg-skin-primary/20'}`}>
                  <Star size={18} fill={isFavOpen ? "currentColor" : "none"} />
               </button>
               
               {isFavOpen && (
                 <div className="absolute right-0 top-full mt-2 w-72 bg-skin-surface border border-skin-primary/20 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                    <div className="bg-skin-bg/50 p-2 border-b border-skin-primary/10 flex justify-between items-center">
                        <h3 className="text-xs font-bold text-skin-muted uppercase px-2">Bookmarks</h3>
                        <span className="text-[10px] text-skin-muted">{favorites.length} saved</span>
                    </div>
                    {favorites.length === 0 ? (
                      <div className="text-center py-6 text-sm text-skin-muted"><Star size={24} className="mx-auto mb-2 opacity-50"/>No favorites yet.</div>
                    ) : (
                      <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1 custom-scrollbar">
                         {favorites.map((fav) => (
                           <Link key={fav.tag} href={`/${fav.type}/${encodeURIComponent(fav.tag)}`} onClick={() => setIsFavOpen(false)} className="flex items-center gap-3 p-2 rounded-lg hover:bg-skin-bg group transition-colors relative border border-transparent hover:border-skin-primary/10">
                              <div className="w-8 h-8 rounded overflow-hidden bg-black/20 shrink-0 border border-skin-muted/20">
                                <img src={fav.icon || '/assets/icons/barbarian.png'} className="w-full h-full object-contain" alt=""/>
                              </div>
                              <div className="min-w-0 flex-1">
                                 <div className="text-sm font-bold text-skin-text truncate group-hover:text-skin-primary transition-colors">{fav.name}</div>
                                 <div className="text-[10px] text-skin-muted font-mono">{fav.tag}</div>
                              </div>
                              <button onClick={(e) => removeFav(e, fav.tag)} className="p-1.5 rounded-full hover:bg-red-500/20 text-skin-muted hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={14}/></button>
                           </Link>
                         ))}
                      </div>
                    )}
                 </div>
               )}
            </div>

            {/* THEME SWITCHER */}
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setIsThemeOpen(!isThemeOpen)} className="flex items-center gap-2 bg-skin-bg border border-skin-primary/30 rounded-full pl-1 pr-1 md:pr-3 py-1 hover:bg-skin-primary/10 transition-colors">
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-full overflow-hidden border border-skin-muted/50">
                   <img src={`/assets/icons/${activeTheme.icon}`} alt="Theme" className="w-full h-full object-cover" />
                </div>
                <span className="hidden md:block text-xs font-bold uppercase text-skin-text">{activeTheme.name}</span>
                <ChevronDown size={14} className={`text-skin-muted transition-transform hidden md:block ${isThemeOpen ? 'rotate-180' : ''}`} />
              </button>

              {isThemeOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-skin-surface border border-skin-primary/20 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                  <div className="p-2 grid gap-1">
                    {(Object.keys(THEMES) as ThemeType[]).map((t) => (
                      <button key={t} onClick={() => { setTheme(t); setIsThemeOpen(false); }} className={`flex items-center gap-3 p-2 rounded-lg text-left transition-colors ${theme === t ? 'bg-skin-primary/20 border border-skin-primary/30' : 'hover:bg-skin-bg'}`}>
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-skin-muted/30 bg-black/20 shrink-0">
                          <img src={`/assets/icons/${THEMES[t].icon}`} alt={THEMES[t].name} className="w-full h-full object-contain" />
                        </div>
                        <div><p className={`text-xs font-bold uppercase ${theme === t ? 'text-skin-primary' : 'text-skin-text'}`}>{THEMES[t].name}</p></div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* MOBILE MENU TOGGLE */}
            <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                className="lg:hidden w-9 h-9 flex items-center justify-center rounded-full bg-skin-bg border border-skin-primary/30 text-skin-primary hover:bg-skin-primary/10"
            >
                {isMobileMenuOpen ? <X size={20}/> : <Menu size={20}/>}
            </button>
        </div>

        {/* MOBILE MENU DRAWER */}
        {isMobileMenuOpen && (
            <div className="absolute top-16 left-0 w-full bg-[#131b24]/95 backdrop-blur-xl border-b border-white/10 p-4 lg:hidden flex flex-col gap-4 animate-in slide-in-from-top-5 shadow-2xl">
                <form onSubmit={handleSearch} className="relative w-full">
                  <input 
                    type="text" 
                    placeholder="#CLAN TAG"
                    value={searchTag}
                    onChange={(e) => setSearchTag(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm font-bold focus:outline-none focus:border-skin-primary text-white uppercase"
                  />
                  <button type="submit" className="absolute right-3 top-3 text-skin-muted">
                    <Search size={18} />
                  </button>
                </form>

                <div className="grid grid-cols-2 gap-2">
                    <Link href="/army" onClick={() => setIsMobileMenuOpen(false)} className="bg-white/5 p-4 rounded-xl flex flex-col items-center gap-2 active:bg-white/10">
                        <Sword size={24} className="text-skin-primary"/>
                        <span className="text-xs font-bold uppercase text-white">Army Planner</span>
                    </Link>
                    <Link href="/layouts" onClick={() => setIsMobileMenuOpen(false)} className="bg-white/5 p-4 rounded-xl flex flex-col items-center gap-2 active:bg-white/10">
                        <LayoutGrid size={24} className="text-blue-400"/>
                        <span className="text-xs font-bold uppercase text-white">Layouts</span>
                    </Link>
                    <Link href="/strategies" onClick={() => setIsMobileMenuOpen(false)} className="bg-white/5 p-4 rounded-xl flex flex-col items-center gap-2 active:bg-white/10">
                        <Crown size={24} className="text-red-400"/>
                        <span className="text-xs font-bold uppercase text-white">Guides</span>
                    </Link>
                    <Link href="/leaderboard" onClick={() => setIsMobileMenuOpen(false)} className="bg-white/5 p-4 rounded-xl flex flex-col items-center gap-2 active:bg-white/10">
                        <Globe size={24} className="text-yellow-400"/>
                        <span className="text-xs font-bold uppercase text-white">Rankings</span>
                    </Link>
                </div>
            </div>
        )}

      </div>
    </nav>
  );
}
