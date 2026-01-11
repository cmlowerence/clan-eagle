import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function StrategyHero() {
  return (
    <div className="pt-8 pb-4 flex flex-col items-center relative gap-6">
      {/* Back Button */}
      <div className="w-full flex justify-start md:absolute md:left-0 md:top-8 z-20">
        <Link href="/" className="flex items-center gap-2 text-skin-muted hover:text-white transition-all group bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/5 hover:border-skin-primary/50">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-widest">Home</span>
        </Link>
      </div>

      <div className="text-center space-y-4 relative z-10">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-500/10 blur-[100px] rounded-full -z-10"></div>

        <h1 className="text-5xl md:text-7xl font-clash text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 drop-shadow-xl tracking-tight">
          PRO GUIDES
        </h1>
        <p className="text-skin-muted text-sm md:text-base max-w-lg mx-auto leading-relaxed border-t border-white/5 pt-4">
          Master the Art of War. <span className="text-red-400 font-bold">3-Star Strategies</span> for every Town Hall level.
        </p>
      </div>
    </div>
  );
}
