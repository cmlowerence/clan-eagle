'use client';

import Hero from "./_components/Hero";
import SearchWidget from "./_components/SearchWidget";
import ToolsGrid from "./_components/ToolsGrid";
import HistoryLog from "./_components/HistoryLog";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center relative overflow-hidden">
      
      {/* BACKGROUND FX (Static Glow) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-skin-primary/10 blur-[100px] rounded-full pointer-events-none -z-10"></div>
      
      <div className="w-full max-w-5xl px-4 pt-20 pb-24 flex flex-col items-center gap-10 z-10">
        <Hero />
        <SearchWidget />
        <ToolsGrid />
        <HistoryLog />
      </div>
    </div>
  );
}
