 'use client';

import { Sword, Coins, TrendingUp, Medal, Calendar } from "lucide-react";

// --- Interfaces ---
export interface RaidMember {
  tag: string;
  name: string;
  attacks: number;
  attackLimit: number;
  bonusAttackLimit: number;
  capitalResourcesLooted: number;
}

export interface RaidSeason {
  state: string;
  startTime: string;
  endTime: string;
  capitalTotalLoot: number;
  raidsCompleted: number;
  totalAttacks: number;
  enemyDistrictsDestroyed: number;
  offensiveReward: number;
  defensiveReward: number;
  members: RaidMember[];
}

// --- HELPERS: Fix for "Invalid Date" ---
const parseClashDate = (dateStr: string) => {
  // Format: YYYYMMDDTHHmmss.000Z
  if (!dateStr) return new Date();
  const year = dateStr.substring(0, 4);
  const month = dateStr.substring(4, 6);
  const day = dateStr.substring(6, 8);
  const hour = dateStr.substring(9, 11);
  const minute = dateStr.substring(11, 13);
  return new Date(`${year}-${month}-${day}T${hour}:${minute}:00Z`);
};

const formatDate = (dateStr: string) => {
  try {
    const date = parseClashDate(dateStr);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
  } catch (e) {
    return "Unknown";
  }
};

export default function CapitalRaidSection({ seasons }: { seasons: RaidSeason[] }) {
  if (!seasons || seasons.length === 0) return <div className="text-center py-10 opacity-50 font-clash">No Raid History Found</div>;

  // 1. Process Data
  const latestSeason = seasons[0]; // Newest first
  const graphData = seasons.slice(0, 6).reverse(); // Last 6 weeks for graph
  
  // Calculate max values for graph scaling
  const maxLoot = Math.max(...graphData.map(s => s.capitalTotalLoot));
  const maxMedals = Math.max(...graphData.map(s => s.offensiveReward + s.defensiveReward));

  // Sort Top Raiders (Logic preserved from your file)
  const topRaiders = [...(latestSeason.members || [])]
    .sort((a, b) => b.capitalResourcesLooted - a.capitalResourcesLooted)
    .slice(0, 10); 

  // Calculate Total Medals for latest season
  const latestMedals = latestSeason.offensiveReward + latestSeason.defensiveReward;

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-2 fade-in duration-500">
      
      {/* --- 1. PERFORMANCE GRAPH (Dual Bar: Loot & Medals) --- */}
      <div className="bg-[#1a232e] border border-skin-primary/20 rounded-xl p-5 shadow-lg relative overflow-hidden">
         <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="text-orange-400" size={20}/>
            <h3 className="font-clash text-lg text-white">Performance History</h3>
         </div>
         
         <div className="flex items-end justify-between gap-2 h-40 w-full px-2">
            {graphData.map((season, i) => {
               const totalMedals = season.offensiveReward + season.defensiveReward;
               const lootHeight = (season.capitalTotalLoot / maxLoot) * 100;
               const medalHeight = (totalMedals / maxMedals) * 100;
               const dateLabel = formatDate(season.endTime);

               return (
                  <div key={i} className="flex-1 flex flex-col justify-end items-center gap-2 group relative h-full">
                     {/* Hover Tooltip */}
                     <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/90 text-[10px] text-white p-2 rounded border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap pointer-events-none shadow-xl">
                        <div className="text-orange-400 font-bold">{season.capitalTotalLoot.toLocaleString()} Loot</div>
                        <div className="text-skin-secondary font-bold">{totalMedals} Medals</div>
                     </div>

                     <div className="w-full flex gap-1 items-end justify-center h-full pb-1">
                        {/* Loot Bar (Orange) */}
                        <div style={{ height: `${lootHeight}%` }} className="w-2 md:w-4 bg-orange-500/80 rounded-t-sm hover:bg-orange-400 transition-all shadow-[0_0_10px_rgba(249,115,22,0.3)]"></div>
                        {/* Medal Bar (Cyan/Secondary) */}
                        <div style={{ height: `${medalHeight}%` }} className="w-2 md:w-4 bg-skin-secondary/80 rounded-t-sm hover:bg-skin-secondary transition-all shadow-[0_0_10px_rgba(56,189,248,0.3)]"></div>
                     </div>
                     <span className="text-[9px] text-skin-muted font-mono whitespace-nowrap">{dateLabel}</span>
                  </div>
               )
            })}
         </div>
         
         {/* Legend */}
         <div className="flex justify-center gap-4 mt-4 text-[10px] uppercase font-bold border-t border-white/5 pt-3">
            <div className="flex items-center gap-1 text-orange-400"><div className="w-2 h-2 bg-orange-500 rounded-full"></div> Gold Looted</div>
            <div className="flex items-center gap-1 text-skin-secondary"><div className="w-2 h-2 bg-skin-secondary rounded-full"></div> Medals Earned</div>
         </div>
      </div>

      {/* --- 2. LATEST SEASON DETAILS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         
         {/* Left Column: Summary Stats */}
         <div className="md:col-span-1 space-y-3">
             {/* Loot Card */}
             <div className="bg-gradient-to-br from-orange-900/40 to-[#1a100c] p-4 rounded-xl border border-orange-500/30 flex flex-col justify-center text-center shadow-md relative overflow-hidden">
                 <div className="absolute inset-0 bg-[url('/assets/icons/gold_storage.png')] bg-contain bg-no-repeat bg-right opacity-10"></div>
                 <div className="relative z-10">
                    <div className="text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-1 flex items-center justify-center gap-1"><Coins size={12}/> Total Loot</div>
                    <div className="text-3xl font-clash text-white drop-shadow-md">{latestSeason.capitalTotalLoot.toLocaleString()}</div>
                 </div>
             </div>

             {/* Medals Card */}
             <div className="bg-gradient-to-br from-blue-900/40 to-[#0c1a24] p-4 rounded-xl border border-skin-secondary/30 flex flex-col justify-center text-center shadow-md">
                 <div className="text-[10px] font-bold text-skin-secondary uppercase tracking-widest mb-1 flex items-center justify-center gap-1"><Medal size={12}/> Medals Earned</div>
                 <div className="text-3xl font-clash text-white drop-shadow-md">{latestMedals}</div>
             </div>

             {/* Attack Stats */}
             <div className="grid grid-cols-2 gap-3">
                <div className="bg-skin-surface p-3 rounded-xl border border-white/5 text-center">
                    <div className="text-[9px] text-skin-muted uppercase font-bold">Attacks</div>
                    <div className="text-xl font-clash text-white">{latestSeason.totalAttacks}</div>
                </div>
                <div className="bg-skin-surface p-3 rounded-xl border border-white/5 text-center">
                    <div className="text-[9px] text-skin-muted uppercase font-bold">Destroyed</div>
                    <div className="text-xl font-clash text-red-400">{latestSeason.enemyDistrictsDestroyed}</div>
                </div>
             </div>
         </div>

         {/* Right Column: Leaderboard */}
         <div className="md:col-span-2 bg-skin-surface rounded-xl border border-skin-primary/10 overflow-hidden flex flex-col h-full shadow-lg">
            <div className="p-3 bg-[#131b24] border-b border-skin-primary/10 flex justify-between items-center shrink-0">
               <h4 className="font-clash text-sm flex items-center gap-2 text-white"><Sword size={16} className="text-orange-500"/> Top Raiders</h4>
               <span className="text-[9px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded uppercase font-bold border border-green-500/20">{formatDate(latestSeason.endTime)}</span>
            </div>
            
            <div className="divide-y divide-white/5 overflow-y-auto max-h-[300px] custom-scrollbar">
               {topRaiders.map((member, idx) => (
                  <div key={member.tag} className="flex items-center justify-between p-3 hover:bg-white/5 transition-colors group">
                     <div className="flex items-center gap-3">
                        {/* Rank Badge */}
                        <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold border ${idx < 3 ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50' : 'bg-white/5 text-skin-muted border-white/10'}`}>
                           {idx + 1}
                        </div>
                        
                        <div>
                           <div className="text-sm font-bold text-skin-text leading-none group-hover:text-white transition-colors">{member.name}</div>
                           <div className="text-[10px] text-skin-muted mt-0.5 flex items-center gap-1">
                               <span className={member.attacks >= (member.attackLimit + member.bonusAttackLimit) ? "text-green-400" : ""}>{member.attacks}</span>
                               <span className="opacity-50">/</span>
                               <span>{member.attackLimit + member.bonusAttackLimit} Hits</span>
                           </div>
                        </div>
                     </div>
                     
                     <div className="text-right">
                        <div className="text-sm font-clash text-orange-400 group-hover:text-orange-300 transition-colors drop-shadow-sm">
                            {member.capitalResourcesLooted.toLocaleString()}
                        </div>
                        <div className="text-[9px] text-skin-muted uppercase">Looted</div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
