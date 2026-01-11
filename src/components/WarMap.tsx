'use client';

import { Swords, Star, Shield, Skull, ArrowRight } from "lucide-react";

// --- TYPES ---
export interface WarAttack {
  attackerTag: string;
  defenderTag: string;
  stars: number;
  destructionPercentage: number;
  order: number;
}

export interface WarMember {
  tag: string;
  name: string;
  mapPosition: number;
  townhallLevel: number;
  opponentAttacks: number;
  attacks?: WarAttack[];
}

export interface WarClan {
  tag: string;
  name: string;
  badgeUrls: { small: string };
  members: WarMember[];
  stars: number;
  destructionPercentage: number;
}

export interface WarData {
  state: string;
  teamSize: number;
  clan: WarClan;
  opponent: WarClan;
}

// --- SUB-COMPONENT: HEADER ---
const WarHeader = ({ clan, opponent }: { clan: WarClan; opponent: WarClan }) => (
  <div className="bg-black/20 p-4 flex justify-between items-center border-b border-skin-primary/20">
    {/* My Clan */}
    <div className="flex items-center gap-2">
      <img src={clan.badgeUrls.small} alt="Badge" className="w-8 h-8" />
      <div>
        <h3 className="font-clash text-sm">{clan.name}</h3>
        <p className="text-xs text-skin-primary font-bold flex items-center gap-1">
          <Star size={12} fill="currentColor" /> {clan.stars}
          <span className="text-skin-muted">({clan.destructionPercentage.toFixed(1)}%)</span>
        </p>
      </div>
    </div>

    {/* VS Separator */}
    <div className="text-2xl font-clash text-skin-muted opacity-50">
      <Swords />
    </div>

    {/* Enemy Clan */}
    <div className="flex items-center gap-2 text-right">
      <div>
        <h3 className="font-clash text-sm">{opponent.name}</h3>
        <p className="text-xs text-red-500 font-bold flex items-center gap-1 justify-end">
          <Star size={12} fill="currentColor" /> {opponent.stars}
          <span className="text-skin-muted">({opponent.destructionPercentage.toFixed(1)}%)</span>
        </p>
      </div>
      <img src={opponent.badgeUrls.small} alt="Badge" className="w-8 h-8" />
    </div>
  </div>
);

// --- SUB-COMPONENT: ATTACK LINE ---
const AttackLine = ({ stars, dest }: { stars: number; dest: number }) => {
  const color = stars === 3 ? 'text-green-500' : stars === 2 ? 'text-yellow-500' : 'text-red-500';
  return (
    <div className={`flex items-center gap-1 ${color} text-[10px] font-bold bg-black/30 px-2 py-0.5 rounded-full border border-white/10`}>
      <div className="flex">
        {[...Array(stars)].map((_, i) => <Star key={i} size={8} fill="currentColor" />)}
      </div>
      <span>{dest}%</span>
      <ArrowRight size={12} />
    </div>
  );
};

// --- SUB-COMPONENT: WAR ROW ---
interface WarRowProps {
  member: WarMember;
  enemyMembers: WarMember[];
}

const WarRow = ({ member, enemyMembers }: WarRowProps) => {
  // Sort attacks by order to show sequence
  const myAttacks = member.attacks?.sort((a, b) => a.order - b.order) || [];

  // Logic: Check if *this* member has been 3-starred by any enemy
  const isThreeStarred = enemyMembers.some(enemy => 
    enemy.attacks?.some(atk => atk.defenderTag === member.tag && atk.stars === 3)
  );

  // Helper to resolve enemy name from tag
  const getEnemyName = (tag: string) => enemyMembers.find(m => m.tag === tag)?.name || "Unknown";

  return (
    <div className="relative z-10 grid grid-cols-[1fr_auto_1fr] gap-2 items-center py-2 border-b border-skin-primary/5 last:border-0 group">
      
      {/* 1. Member Base Status */}
      <div className={`flex items-center gap-2 p-2 rounded-lg border transition-all ${isThreeStarred ? 'bg-red-900/20 border-red-500/30 opacity-70' : 'bg-skin-surface border-skin-primary/20 group-hover:border-skin-primary'}`}>
        <div className="relative">
          <div className="w-8 h-8 bg-skin-bg rounded flex items-center justify-center border border-skin-primary/30 font-black text-xs text-skin-primary">
            TH{member.townhallLevel}
          </div>
          {isThreeStarred && (
            <div className="absolute -top-1 -right-1 text-red-500 bg-black rounded-full border border-red-500/50">
              <Skull size={12} fill="currentColor" />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold truncate flex items-center gap-1">
            <span className="text-skin-muted">{member.mapPosition}.</span> {member.name}
          </p>
        </div>
      </div>

      {/* 2. Attack Performance */}
      <div className="flex flex-col gap-1 justify-center px-2">
        {myAttacks.length > 0 ? (
          myAttacks.map((atk, idx) => (
            <AttackLine key={idx} stars={atk.stars} dest={atk.destructionPercentage} />
          ))
        ) : (
          <div className="h-6 w-px bg-skin-muted/20 mx-auto"></div>
        )}
      </div>

      {/* 3. Attack Targets */}
      <div className="flex flex-col gap-1 justify-center">
        {myAttacks.length > 0 ? (
          myAttacks.map((atk, idx) => (
            <div key={idx} className="text-xs text-skin-text truncate text-right flex items-center justify-end gap-1 bg-black/20 px-2 py-0.5 rounded">
              <Shield size={10} className="text-red-500" /> {getEnemyName(atk.defenderTag)}
            </div>
          ))
        ) : (
          <div className="text-[10px] text-skin-muted italic text-right opacity-50 px-2 py-1">
            No attacks
          </div>
        )}
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function WarMap({ data }: { data: WarData }) {
  if (!data || data.state === 'notInWar') {
    return <div className="text-center opacity-50 py-10 font-clash">Not in War</div>;
  }

  // Prepare sorted lists
  const ourMembers = [...data.clan.members].sort((a, b) => a.mapPosition - b.mapPosition);
  const enemyMembers = [...data.opponent.members].sort((a, b) => a.mapPosition - b.mapPosition);

  return (
    <div className="bg-skin-surface border border-skin-primary/20 rounded-xl overflow-hidden shadow-lg animate-in fade-in duration-500">
      
      {/* Header Stats */}
      <WarHeader clan={data.clan} opponent={data.opponent} />

      {/* Map Content */}
      <div className="p-4 space-y-1 bg-[url('/assets/map_bg_pattern.png')] bg-repeat bg-opacity-5 relative min-h-[300px]">
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-skin-bg/95 z-0"></div>

        {/* Legend */}
        <div className="relative z-10 flex justify-between text-[10px] text-skin-muted uppercase font-bold mb-3 px-2 border-b border-white/5 pb-2">
          <span>My Clan ({data.teamSize}v{data.teamSize})</span>
          <span>Targets Hit</span>
        </div>

        {/* Rows */}
        {ourMembers.map((member) => (
          <WarRow key={member.tag} member={member} enemyMembers={enemyMembers} />
        ))}
      </div>
    </div>
  );
}
