'use client';

import { useTheme } from "./ThemeProvider";
import { THEMES, ThemeType } from "@/lib/themes";
import { Search, Menu, ChevronDown, X } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [searchTag, setSearchTag] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTag) return;
    const tag = searchTag.trim().replace('#', '');
    router.push(`/clan/${encodeURIComponent('#' + tag)}`);
    setSearchTag("");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
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

        {/* DESKTOP SEARCH */}
        <form onSubmit={handleSearch} className="hidden md:flex relative w-80 mx-4">
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

        {/* THEME SELECTOR (DROPDOWN) */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-2 bg-skin-bg border border-skin-primary/30 rounded-full px-3 py-1.5 hover:bg-skin-primary/10 transition-colors"
          >
            <div className="w-6 h-6 rounded-full overflow-hidden border border-skin-muted/50">
               <img src={`/assets/icons/${activeTheme.icon}`} alt="Theme" className="w-full h-full object-cover" />
            </div>
            <span className="hidden md:block text-xs font-bold uppercase text-skin-text">{activeTheme.name}</span>
            <ChevronDown size={14} className={`text-skin-muted transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* DROPDOWN MENU */}
          {isMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-skin-surface border border-skin-primary/20 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2">
              <div className="p-2 grid gap-1">
                {(Object.keys(THEMES) as ThemeType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => { setTheme(t); setIsMenuOpen(false); }}
                    className={`flex items-center gap-3 p-2 rounded-lg text-left transition-colors ${
                      theme === t ? 'bg-skin-primary/20 border border-skin-primary/30' : 'hover:bg-skin-bg'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-skin-muted/30 bg-black/20 shrink-0">
                      <img src={`/assets/icons/${THEMES[t].icon}`} alt={THEMES[t].name} className="w-full h-full object-contain" />
                    </div>
                    <div>
                       <p className={`text-xs font-bold uppercase ${theme === t ? 'text-skin-primary' : 'text-skin-text'}`}>{THEMES[t].name}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

