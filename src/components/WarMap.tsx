'use client';

import { Swords, Star, Shield, Skull } from "lucide-react";

// New interfaces specific to War Data
interface WarMember {
  tag: string;
  name: string;
  mapPosition: number;
  townhallLevel: number;
  opponentAttacks: number;
  attacks?: {
    attackerTag: string;
    defenderTag: string;
    stars: number;
    destructionPercentage: number;
    order: number;
  }[];
}

interface WarData {
  state: string;
  teamSize: number;
  clan: {
    tag: string;
    name: string;
    badgeUrls: { small: string };
    members: WarMember[];
    stars: number;
    destructionPercentage: number;
  };
  opponent: {
    tag: string;
    name: string;
    badgeUrls: { small: string };
    members: WarMember[];
    stars: number;
    destructionPercentage: number;
  };
}

export default function WarMap({ data }: { data: WarData }) {
  if (data.state === 'notInWar') {
    return <div className="text-center opacity-50 py-10 font-clash">Not in War</div>;
  }

  // Sort members by map position (Top to Bottom)
  const ourMembers = [...data.clan.members].sort((a, b) => a.mapPosition - b.mapPosition);
  const enemyMembers = [...data.opponent.members].sort((a, b) => a.mapPosition - b.mapPosition);

  // Helper to find opponent name by tag
  const findEnemyName = (tag: string) => enemyMembers.find(m => m.tag === tag)?.name || "Unknown";

  const AttackLine = ({ stars, dest }: { stars: number, dest: number }) => {
    const color = stars === 3 ? 'text-green-500' : stars === 2 ? 'text-yellow-500' : 'text-red-500';
    return (
      <div className={`flex items-center gap-1 ${color} text-[10px] font-bold bg-black/30 px-2 py-0.5 rounded-full border border-white/10`}>
        <div className="flex">{[...Array(stars)].map((_,i) => <Star key={i} size={8} fill="currentColor"/>)}</div>
        <span>{dest}%</span>
        <ArrowRight size={12} />
      </div>
    );
  };

  return (
    <div className="bg-skin-surface border border-skin-primary/20 rounded-xl overflow-hidden">
       {/* WAR HEADER */}
       <div className="bg-black/20 p-4 flex justify-between items-center border-b border-skin-primary/20">
          <div className="flex items-center gap-2">
             <img src={data.clan.badgeUrls.small} alt="" className="w-8 h-8"/>
             <div>
                <h3 className="font-clash text-sm">{data.clan.name}</h3>
                <p className="text-xs text-skin-primary font-bold flex items-center gap-1"><Star size={12} fill="currentColor"/> {data.clan.stars} <span className="text-skin-muted">({data.clan.destructionPercentage.toFixed(1)}%)</span></p>
             </div>
          </div>
          <div className="text-2xl font-clash text-skin-muted"><Swords /></div>
          <div className="flex items-center gap-2 text-right">
             <div>
                <h3 className="font-clash text-sm">{data.opponent.name}</h3>
                <p className="text-xs text-red-500 font-bold flex items-center gap-1 justify-end"><Star size={12} fill="currentColor"/> {data.opponent.stars} <span className="text-skin-muted">({data.opponent.destructionPercentage.toFixed(1)}%)</span></p>
             </div>
             <img src={data.opponent.badgeUrls.small} alt="" className="w-8 h-8"/>
          </div>
       </div>

       {/* THE MAP VISUALIZATION */}
       <div className="p-4 space-y-1 bg-[url('/assets/map_bg_pattern.png')] bg-repeat bg-opacity-5 relative">
          <div className="absolute inset-0 bg-skin-bg/90 z-0"></div>
          
          {/* Legend */}
          <div className="relative z-10 flex justify-between text-[10px] text-skin-muted uppercase font-bold mb-2 px-2">
             <span>My Clan ({data.teamSize}v{data.teamSize})</span>
             <span>Enemy Clan</span>
          </div>

          {ourMembers.map((member) => {
            const myAttacks = member.attacks?.sort((a,b) => a.order - b.order);
            const isThreeStarred = member.opponentAttacks > 0 && enemyMembers.some(em => em.attacks?.some(atk => atk.defenderTag === member.tag && atk.stars === 3));

            return (
             <div key={member.tag} className="relative z-10 grid grid-cols-[1fr_auto_1fr] gap-2 items-center py-2 border-b border-skin-primary/5 last:border-0 group">
                
                {/* LEFT: Our Member Base */}
                <div className={`flex items-center gap-2 p-2 rounded-lg border transition-all ${isThreeStarred ? 'bg-red-900/20 border-red-500/30 opacity-70' : 'bg-skin-surface border-skin-primary/20 group-hover:border-skin-primary'}`}>
                   <div className="relative">
                     {/* TH Icon Placeholder - Replace with real images later if you have them */}
                     <div className="w-8 h-8 bg-skin-bg rounded flex items-center justify-center border border-skin-primary/30 font-black text-xs text-skin-primary">
                       TH{member.townhallLevel}
                     </div>
                     {isThreeStarred && <div className="absolute -top-1 -right-1 text-red-500 bg-black rounded-full"><Skull size={14} fill="currentColor"/></div>}
                   </div>
                   <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold truncate flex items-center gap-1">
                        <span className="text-skin-muted">{member.mapPosition}.</span> {member.name}
                      </p>
                   </div>
                </div>

                {/* MIDDLE: Attack Lines (Visualization) */}
                <div className="flex flex-col gap-1 justify-center px-2">
                   {myAttacks && myAttacks.length > 0 ? (
                     myAttacks.map((atk, idx) => (
                       <AttackLine key={idx} stars={atk.stars} dest={atk.destructionPercentage} />
                     ))
                   ) : (
                     <div className="h-6 w-px bg-skin-muted/20 mx-auto"></div>
                   )}
                </div>

                {/* RIGHT: Targeted Enemies (Visualization) */}
                <div className="flex flex-col gap-1 justify-center">
                   {myAttacks && myAttacks.length > 0 ? (
                      myAttacks.map((atk, idx) => {
                        const targetName = findEnemyName(atk.defenderTag);
                        return (
                           <div key={idx} className="text-xs text-skin-text truncate text-right flex items-center justify-end gap-1 bg-black/20 px-2 py-0.5 rounded">
                             <Shield size={10} className="text-red-500"/> {targetName}
                           </div>
                        );
                      })
                   ) : (
                     <div className="text-[10px] text-skin-muted italic text-right opacity-50 px-2 py-1">No attacks used</div>
                   )}
                </div>
             </div>
          )})}
       </div>
    </div>
  );
}

// Need ArrowRight icon for the attack line visualization
import { ArrowRight } from "lucide-react";
