'use client';

import { useTheme } from "@/components/ThemeProvider";
import { Search, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { theme } = useTheme();
  const [tag, setTag] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if(tag) {
      const cleanTag = tag.startsWith('#') ? tag : `#${tag}`;
      router.push(`/clan/${encodeURIComponent(cleanTag)}`);
    }
  }

  // Content changes based on theme for the showcase
  const getThemeDescription = () => {
    switch(theme) {
      case 'pekka': return "Heavy armor, devastating damage. The P.E.K.K.A theme brings a futuristic, metallic aesthetic to your analytics.";
      case 'edrag': return "Chain lighting destruction. The Electro Dragon theme surges with energy and storms.";
      case 'hog': return "Did somebody say Hog Rider? Jump over walls with this earthy, vibrant, and fast-paced theme.";
      case 'lava': return "Air superiority. The Lava Hound theme burns with magma and obsidian intensity.";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center gap-12">
      
      {/* Hero Section */}
      <div className="space-y-6 max-w-2xl animate-in fade-in zoom-in duration-700">
        <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-skin-primary to-skin-secondary drop-shadow-sm">
          CLASH
        </h1>
        <h2 className="text-2xl md:text-3xl font-bold text-skin-text">
          Master Your Clan with the <span className="text-skin-secondary border-b-4 border-skin-primary">{theme.toUpperCase()}</span> Engine
        </h2>
        <p className="text-skin-muted text-lg">
          Advanced analytics, dynamic visual data, and real-time war tracking.
        </p>
      </div>

      {/* Main Search */}
      <form onSubmit={handleSearch} className="w-full max-w-md relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-skin-primary to-skin-secondary rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
        <div className="relative flex">
          <input 
            type="text" 
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="Enter Clan Tag (e.g. #2P09...)"
            className="w-full bg-skin-bg p-4 rounded-l-lg border border-r-0 border-skin-primary/30 focus:outline-none focus:border-skin-secondary text-skin-text placeholder:text-skin-muted/50"
          />
          <button type="submit" className="bg-skin-primary text-white px-8 rounded-r-lg font-bold hover:bg-skin-secondary transition-colors flex items-center gap-2">
            SEARCH <ArrowRight size={20} />
          </button>
        </div>
      </form>

      {/* Troop Showcase Card */}
      <div className="mt-12 p-8 border border-skin-primary/20 bg-skin-surface/30 rounded-2xl max-w-3xl backdrop-blur-sm">
        <h3 className="text-xl font-bold text-skin-primary mb-2">Active Theme: {theme.toUpperCase()}</h3>
        <p className="text-skin-muted">{getThemeDescription()}</p>
        <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="h-2 rounded bg-skin-primary"></div>
            <div className="h-2 rounded bg-skin-secondary"></div>
            <div className="h-2 rounded bg-skin-bg border border-skin-muted"></div>
        </div>
      </div>

    </div>
  );
}
