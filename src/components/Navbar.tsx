'use client';

import { useTheme } from "./ThemeProvider";
import { THEMES, ThemeType } from "@/lib/themes";
import { Search, Zap, Skull, Flame, Shield } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [searchTag, setSearchTag] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTag) return;
    // Basic validation: add # if missing
    const tag = searchTag.startsWith('#') ? searchTag : `#${searchTag}`;
    // Assume user is searching for a clan for now
    router.push(`/clan/${encodeURIComponent(tag)}`);
  };

  const getIcon = (t: ThemeType) => {
    switch (t) {
      case 'pekka': return <Shield size={18} />;
      case 'edrag': return <Zap size={18} />;
      case 'hog': return <Skull size={18} />; // Best approximation for Hog
      case 'lava': return <Flame size={18} />;
    }
  };

  return (
    <nav className="border-b border-skin-primary/20 bg-skin-surface/50 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="text-2xl font-black tracking-tighter text-skin-primary hover:text-skin-secondary transition-colors">
          CLASH<span className="text-skin-secondary">THEME</span>
        </Link>

        {/* Search Bar - Hidden on mobile, visible on md+ */}
        <form onSubmit={handleSearch} className="hidden md:flex relative w-64">
          <input 
            type="text" 
            placeholder="#CLANTAG"
            value={searchTag}
            onChange={(e) => setSearchTag(e.target.value)}
            className="w-full bg-skin-bg border border-skin-primary/30 rounded-full py-1 px-4 text-sm focus:outline-none focus:border-skin-secondary text-skin-text"
          />
          <button type="submit" className="absolute right-3 top-1.5 text-skin-muted hover:text-skin-secondary">
            <Search size={16} />
          </button>
        </form>

        {/* Theme Switcher */}
        <div className="flex gap-2">
          {(Object.keys(THEMES) as ThemeType[]).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`p-2 rounded-full transition-all duration-300 ${
                theme === t 
                  ? 'bg-skin-primary text-white scale-110 shadow-[0_0_15px_rgba(0,0,0,0.3)] shadow-skin-primary' 
                  : 'bg-skin-bg text-skin-muted hover:text-skin-text'
              }`}
              title={THEMES[t].name}
            >
              {getIcon(t)}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
