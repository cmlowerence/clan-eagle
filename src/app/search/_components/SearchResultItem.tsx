import Link from "next/link";
import { Users, Trophy, MapPin, ArrowRight } from "lucide-react";
import ClanBadge from "./ClanBadge";
import { ClanResult } from "./types";

export default function SearchResultItem({ clan }: { clan: ClanResult }) {
  // NOTE: For Next.js client-side routing (Link), we MUST encode the tag 
  // so the '#' is treated as a path segment, not a URL fragment anchor.
  const profileLink = `/clan/${encodeURIComponent(clan.tag)}`;

  return (
    <Link 
      href={profileLink}
      className="flex items-center gap-4 bg-[#1f2937] p-4 rounded-xl border border-white/5 hover:border-skin-primary/50 hover:bg-[#253041] transition-all group shadow-md animate-in fade-in slide-in-from-bottom-2"
    >
       <ClanBadge url={clan.badgeUrls?.small} level={clan.clanLevel} />

       <div className="flex-1 min-w-0">
          <h4 className="font-bold text-white text-lg truncate group-hover:text-skin-primary transition-colors">
            {clan.name}
          </h4>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-skin-muted mt-1">
             <span className="flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded">
                <Users size={12}/> {clan.members}/50
             </span>
             <span className="flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded">
                <Trophy size={12} className="text-yellow-500"/> {clan.clanPoints}
             </span>
             {clan.location && (
               <span className="flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded">
                  <MapPin size={12}/> {clan.location.name}
               </span>
             )}
          </div>
       </div>

       <ArrowRight size={20} className="text-skin-muted opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all"/>
    </Link>
  );
}
