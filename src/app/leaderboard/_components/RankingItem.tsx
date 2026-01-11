import Link from "next/link";
import { Trophy, Shield } from "lucide-react";
import { RankingItemData, RankingType } from "./types";

interface RankingItemProps {
  item: RankingItemData;
  type: RankingType;
  rank: number;
}

export default function RankingItem({ item, type, rank }: RankingItemProps) {
  const isClan = type === 'clans';
  
  // URL Logic: We encode the tag for the browser router (Link), 
  // ensuring '#' doesn't break the URL bar navigation.
  const hrefLink = isClan 
    ? `/clan/${encodeURIComponent(item.tag)}` 
    : `/player/${encodeURIComponent(item.tag)}`;

  // Display Logic
  const imageUrl = isClan ? item.badgeUrls?.small : item.league?.iconUrls?.small;
  const mainStat = isClan ? item.clanPoints : item.trophies;

  return (
    <Link 
      href={hrefLink} 
      className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors group animate-in fade-in slide-in-from-bottom-1"
    >
       {/* Rank Badge */}
       <div className={`w-8 h-8 flex items-center justify-center rounded font-clash text-lg shrink-0 ${rank <= 3 ? 'bg-yellow-500 text-black' : 'text-skin-muted bg-black/20'}`}>
          {rank}
       </div>

       {/* Icon (Clan Badge or League Icon) */}
       <div className="w-10 h-10 relative shrink-0">
          <img 
             src={imageUrl} 
             className="w-full h-full object-contain" 
             alt="" 
             onError={(e) => { e.currentTarget.style.display='none'}}
          />
       </div>

       {/* Name & Tag */}
       <div className="flex-1 min-w-0">
          <div className="font-bold text-white truncate group-hover:text-skin-primary transition-colors">
            {item.name}
          </div>
          <div className="text-[10px] text-skin-muted font-mono opacity-70">
            {item.tag}
          </div>
       </div>

       {/* Statistics Right Side */}
       <div className="text-right shrink-0">
          <div className="text-white font-clash flex items-center justify-end gap-1">
             <Trophy size={14} className="text-yellow-500"/> {mainStat}
          </div>
          
          {isClan ? (
             <div className="text-[10px] text-skin-muted">{item.members} members</div>
          ) : (
             item.clan && (
                <div className="text-[10px] text-skin-muted flex items-center justify-end gap-1">
                    <Shield size={10}/> {item.clan.name}
                </div>
             )
          )}
       </div>
    </Link>
  );
}
