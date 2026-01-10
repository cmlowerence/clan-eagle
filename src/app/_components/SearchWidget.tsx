'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, ArrowRight, User, Users } from "lucide-react";

export default function SearchWidget() {
  const [tag, setTag] = useState("");
  const [searchType, setSearchType] = useState<'clan' | 'player'>('clan');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (tag) {
      const cleanTag = tag.trim().toUpperCase().replace('#', '');
      const path = searchType === 'clan' ? `/clan` : `/player`;
      router.push(`${path}/${encodeURIComponent('#' + cleanTag)}`);
    }
  };

  return (
    <div className="w-full max-w-lg relative z-20 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
      <div className="bg-skin-surface/60 backdrop-blur-xl border border-white/10 p-2 rounded-2xl shadow-2xl">
        
        {/* Toggle Switch */}
        <div className="flex bg-black/20 p-1 rounded-xl mb-2">
          <button
            onClick={() => setSearchType('clan')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold uppercase transition-all ${searchType === 'clan' ? 'bg-skin-primary text-black shadow-lg' : 'text-skin-muted hover:text-white'}`}
          >
            <Users size={14} /> Find Clan
          </button>
          <button
            onClick={() => setSearchType('player')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold uppercase transition-all ${searchType === 'player' ? 'bg-skin-primary text-black shadow-lg' : 'text-skin-muted hover:text-white'}`}
          >
            <User size={14} /> Find Player
          </button>
        </div>

        {/* Input Form */}
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

        {/* Helper Link */}
        <div className="text-center mt-3">
          <Link href="/search" className="text-xs text-skin-muted hover:text-skin-primary underline decoration-dotted underline-offset-4">
            Don't know the tag? Search by Name
          </Link>
        </div>
      </div>
    </div>
  );
}
