import Link from "next/link";
import { Globe, Swords, ChevronRight } from "lucide-react";
import { CWLData } from "./types";

interface ClanCWLProps {
  cwl: CWLData | null;
  loading: boolean;
  currentClanTag: string;
}

export default function ClanCWL({ cwl, loading, currentClanTag }: ClanCWLProps) {
  if (!loading && !cwl) {
    return (
      <div className="bg-[#1a232e] border border-skin-secondary/20 rounded-xl overflow-hidden min-h-[200px] flex flex-col items-center justify-center opacity-50">
        <Globe size={32} className="mb-2" />
        <p>No Active CWL Group</p>
      </div>
    );
  }

  if (!cwl) return null;

  return (
    <div className="bg-[#1a232e] border border-skin-secondary/20 rounded-xl overflow-hidden min-h-[200px] p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 border-b border-white/5 pb-4 gap-4">
        <div>
          <h3 className="text-2xl font-clash text-white flex items-center gap-2">
            <Swords className="text-red-500" /> {cwl.season}
          </h3>
          <p className="text-sm text-skin-muted">Clan War League Group</p>
        </div>
        <span className="text-xs bg-yellow-600/20 text-yellow-500 px-4 py-1.5 rounded-full border border-yellow-600/50 font-bold tracking-wider animate-pulse">
          {cwl.state.toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2">
        <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-[10px] uppercase font-bold text-skin-muted tracking-widest">
          <div className="col-span-6">Clan</div>
          <div className="col-span-2 text-center">Level</div>
          <div className="col-span-4 text-right">Details</div>
        </div>

        {cwl.clans.map((c, idx) => (
          <Link
            href={`/clan/${encodeURIComponent(c.tag)}`}
            key={c.tag}
            className={`group grid grid-cols-12 gap-4 items-center p-3 rounded-lg border transition-all
              ${c.tag === currentClanTag
                ? 'bg-skin-primary/10 border-skin-primary shadow-[0_0_15px_rgba(var(--color-primary),0.2)]'
                : 'bg-black/20 border-white/5 hover:bg-white/5 hover:border-skin-secondary/50'
              }`}
          >
            <div className="col-span-8 md:col-span-6 flex items-center gap-3">
              <span className="text-skin-muted font-mono text-xs w-4">{idx + 1}</span>
              <img src={c.badgeUrls.small} alt="" className="w-10 h-10 object-contain drop-shadow-md group-hover:scale-110 transition-transform" />
              <div>
                <p className={`font-bold text-sm ${c.tag === currentClanTag ? 'text-skin-secondary' : 'text-white group-hover:text-skin-secondary transition-colors'}`}>{c.name}</p>
                <p className="text-[10px] text-skin-muted font-mono">{c.tag}</p>
              </div>
            </div>

            <div className="col-span-2 hidden md:block text-center">
              <span className="bg-black/40 px-2 py-1 rounded text-xs font-bold text-white border border-white/10">{c.clanLevel}</span>
            </div>

            <div className="col-span-4 md:col-span-4 flex items-center justify-end gap-2 text-skin-muted group-hover:text-white transition-colors">
              <span className="text-xs hidden md:inline">View Clan</span>
              <ChevronRight size={16} />
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-4 text-center text-[10px] text-skin-muted opacity-60">
        * Rankings shown are based on list order. Live star rankings require individual war data.
      </div>
    </div>
  );
}
