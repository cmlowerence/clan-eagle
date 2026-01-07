'use client';

import { ArrowLeft, Home, Map } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-4 space-y-6">
      
      {/* 404 Visual */}
      <div className="relative w-40 h-40">
         <div className="absolute inset-0 bg-red-500/20 rounded-full blur-3xl animate-pulse"></div>
         <img src="/assets/icons/barbarian.png" alt="Lost Barbarian" className="w-full h-full object-contain grayscale opacity-80" />
         <div className="absolute -bottom-2 -right-2 bg-skin-primary text-black font-black text-xl px-3 py-1 rounded-lg border-2 border-skin-bg rotate-12">
            ???
         </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-6xl font-clash text-skin-text">404</h1>
        <h2 className="text-2xl font-bold text-skin-muted uppercase tracking-widest">Village Not Found</h2>
        <p className="text-skin-muted max-w-xs mx-auto">
          The goblins might have looted this page, or you took a wrong turn in the dark elixir forest.
        </p>
      </div>

      <div className="flex gap-4">
        <Link href="/" className="flex items-center gap-2 bg-skin-surface border border-skin-primary/30 px-6 py-3 rounded-xl font-clash uppercase hover:bg-skin-primary hover:text-black transition-all">
           <Home size={18} /> Return Home
        </Link>
      </div>
    </div>
  );
}
