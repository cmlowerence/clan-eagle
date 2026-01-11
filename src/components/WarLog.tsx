'use client';

import { useClashData } from "@/hooks/useClashData";
import { Sword, Star, Percent, Skull, Lock } from "lucide-react";

// --- SUB-COMPONENT: Individual War Row ---
const WarLogItem = ({ war }: { war: any }) => {
  const isWin = war.result === 'win';
  const isTie = war.result === 'tie';
  
  // Dynamic Styles based on result
  const styles = {
    border: isWin ? 'border-l-green-500' : isTie ? 'border-l-gray-500' : 'border-l-red-500',
    bg: isWin ? 'bg-green-500/5' : 'bg-red-500/5',
    badge: isWin ? 'bg-green-500 text-black' : isTie ? 'bg-gray-400 text-black' : 'bg-red-500 text-white'
  };

  // Safe Date Formatter (Handle YYYYMMDDTHH...)
  const formatDate = (dateStr: string) => {
    try {
      const year = dateStr.substring(0,4);
      const month = dateStr.substring(4,6);
      const day = dateStr.substring(6,8);
      return new Date(`${year}-${month}-${day}`).toLocaleDateString();
    } catch { return "Unknown Date"; }
  };

  return (
    <div className={`relative flex items-center justify-between p-3 bg-[#1f2937] ${styles.bg} border border-white/5 border-l-4 ${styles.border} rounded-r-lg`}>
       
       {/* Opponent Details */}
       <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-center gap-2 mb-1">
             <span className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded ${styles.badge}`}>
                {war.result ? war.result : "N/A"}
             </span>
             <span className="font-bold text-white truncate text-sm">{war.opponent.name}</span>
          </div>
          <div className="text-[10px] text-skin-muted flex items-center gap-2">
             <span>{formatDate(war.endTime)}</span>
             <span className="opacity-50">•</span>
             <span>{war.teamSize} vs {war.teamSize}</span>
          </div>
       </div>

       {/* Score Stats */}
       <div className="text-right shrink-0 flex flex-col items-end gap-0.5">
          <span className="text-sm font-clash text-white flex items-center gap-1">
             <Star size={12} className="text-yellow-500 fill-yellow-500"/>
             {war.clan.stars} - {war.opponent.stars}
          </span>
          <span className="text-[10px] text-skin-muted flex items-center gap-1">
             <Percent size={10}/> {war.clan.destructionPercentage.toFixed(1)}%
          </span>
       </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function WarLog({ clanTag }: { clanTag: string }) {
  // Pass raw tag. The hook + middleware handles the '#' encoding safely.
  const { data: logData, loading, error } = useClashData<any>(
    `warlog_${clanTag}`, 
    `/clans/${clanTag}/warlog?limit=20`
  );

  // 1. Loading State
  if (loading) return <div className="py-10 text-center text-skin-muted animate-pulse text-xs uppercase tracking-widest">Loading War History...</div>;
  
  // 2. Private Log State (403 Error)
  if (error && error.includes("Access Denied")) {
     return (
        <div className="p-8 text-center border border-white/5 rounded-xl bg-black/20 flex flex-col items-center gap-3">
           <div className="p-3 rounded-full bg-red-500/10 text-red-400"><Lock size={20}/></div>
           <p className="text-skin-muted text-sm">Clan War Log is Private.</p>
        </div>
     );
  }

  // 3. Empty State
  if (!logData || !logData.items || logData.items.length === 0) {
     return (
        <div className="p-8 text-center border border-white/5 rounded-xl bg-black/20 flex flex-col items-center gap-3">
           <div className="p-3 rounded-full bg-white/5 text-skin-muted"><Skull size={20}/></div>
           <p className="text-skin-muted text-sm">No recent wars found.</p>
        </div>
     );
  }

  // 4. Data View
  return (
    <div className="space-y-4 animate-in slide-in-from-bottom-2">
       <div className="flex items-center gap-2 border-b border-white/5 pb-2">
          <Sword size={14} className="text-skin-primary"/>
          <h3 className="text-xs font-bold text-skin-muted uppercase tracking-widest">Recent Wars</h3>
       </div>
       
       <div className="grid gap-2">
          {logData.items.map((war: any, i: number) => (
             <WarLogItem key={i} war={war} />
          ))}
       </div>
    </div>
  );
}
