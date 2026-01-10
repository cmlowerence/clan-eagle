import { Zap } from "lucide-react";

export default function Hero() {
  return (
    <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-skin-surface border border-skin-primary/20 text-[10px] font-bold uppercase tracking-widest text-skin-primary mb-2 shadow-[0_0_15px_-5px_var(--color-primary)]">
        <Zap size={12} fill="currentColor" /> The Ultimate Clash Companion
      </div>

      {/* Main Title */}
      <h1 className="text-7xl md:text-9xl font-clash leading-[0.85] tracking-tighter drop-shadow-2xl">
        <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#facc15] to-[#ca8a04] stroke-black" style={{ WebkitTextStroke: '1px rgba(0,0,0,0.5)' }}>
          CLAN
        </span>
        <br />
        <span className="text-skin-text">EAGLE</span>
      </h1>

      {/* Tagline */}
      <p className="text-skin-muted max-w-md mx-auto text-sm md:text-base font-medium">
        Track stats, plan armies, and dominate the war map. Your village needs a leader.
      </p>
    </div>
  );
}
