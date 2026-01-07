'use client';

import { Sword, Coins, TrendingUp, User } from "lucide-react";

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

export default function CapitalRaidSection({ seasons }: { seasons: RaidSeason[] }) {
  if (!seasons || seasons.length === 0) return <div className="text-center py-10 opacity-50 font-clash">No Raid History Found</div>;

  // 1. Process Data
  const latestSeason = seasons[0]; // API returns newest first
  const graphData = seasons.slice(0, 5).reverse(); // Last 5 weeks, chronological order for graph
  
  // Find max loot for graph scaling
  const maxLoot = Math.max(...graphData.map(s => s.capitalTotalLoot));

  // Sort Top Raiders
  const topRaiders = [...latestSeason.members]
    .sort((a, b) => b.capitalResourcesLooted - a.capitalResourcesLooted)
    .slice(0, 10); // Top 10

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-2 fade-in duration-500">
      
      {/* --- WEEKLY PERFORMANCE GRAPH --- */}
      <div className="bg-skin-surface p-6 rounded-xl border border-skin-primary/10">
         <h3 className="flex items-center gap-2 font-clash text-lg mb-6 text-skin-text">
            <TrendingUp size={20} className="text-green-400"/> Performance (Last 5 Weeks)
         </h3>
         
         <div className="h-40 flex items-end justify-between gap-2 md:gap-4 px-2">
            {graphData.map((season, i) => {
              const heightPerc = (season.capitalTotalLoot / maxLoot) * 100;
              const date = new Date(season.endTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
              
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                   <div className="text-[10px] font-bold text-skin-muted opacity-0 group-hover:opacity-100 transition-opacity mb-auto">
                      {(season.capitalTotalLoot / 1000).toFixed(0)}k
                   </div>
                   <div 
                     style={{ height: `${heightPerc}%` }} 
                     className="w-full bg-skin-primary/20 border border-skin-primary/40 rounded-t-sm relative group-hover:bg-skin-primary/40 transition-all"
                   >
                     {/* Tooltip */}
                     <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10 font-bold">
                        {season.capitalTotalLoot.toLocaleString()} Gold
                     </div>
                   </div>
                   <div className="text-[10px] text-skin-muted uppercase font-bold">{date}</div>
                </div>
              );
            })}
         </div>
      </div>

      {/* --- LATEST SEASON STATS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         {/* Summary Card */}
         <div className="bg-gradient-to-br from-orange-900/20 to-skin-surface p-4 rounded-xl border border-orange-500/20 flex flex-col justify-center text-center md:col-span-1">
             <div className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-1">Total Loot</div>
             <div className="text-3xl font-clash text-skin-text">{latestSeason.capitalTotalLoot.toLocaleString()}</div>
             <div className="text-xs text-skin-muted mt-2 flex items-center justify-center gap-1">
                <Sword size={12}/> {latestSeason.totalAttacks} Attacks
             </div>
         </div>

         {/* Leaderboard */}
         <div className="md:col-span-2 bg-skin-surface rounded-xl border border-skin-primary/10 overflow-hidden">
            <div className="p-3 bg-black/20 border-b border-skin-primary/5 flex justify-between items-center">
               <h4 className="font-clash text-sm flex items-center gap-2 text-skin-text"><Coins size={16} className="text-yellow-500"/> Top Raiders</h4>
               <span className="text-[10px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded uppercase font-bold">Active Season</span>
            </div>
            
            <div className="divide-y divide-skin-muted/10">
               {topRaiders.map((member, idx) => (
                  <div key={member.tag} className="flex items-center justify-between p-3 hover:bg-skin-bg/50 transition-colors">
                     <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${idx < 3 ? 'bg-yellow-500 text-black' : 'bg-skin-bg text-skin-muted'}`}>
                           {idx + 1}
                        </div>
                        <div>
                           <div className="text-sm font-bold text-skin-text leading-none">{member.name}</div>
                           <div className="text-[10px] text-skin-muted mt-0.5">{member.attacks}/{member.attackLimit + member.bonusAttackLimit} Attacks</div>
                        </div>
                     </div>
                     <div className="text-right">
                        <div className="text-sm font-clash text-orange-400">{member.capitalResourcesLooted.toLocaleString()}</div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
