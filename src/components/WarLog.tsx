'use client';

import { useClashData } from "@/hooks/useClashData";
import { Sword, Star, Percent, Skull } from "lucide-react";

export default function WarLog({ clanTag }: { clanTag: string }) {
  // Fetch War Log
  const { data: logData, loading } = useClashData<any>(
    `warlog_${clanTag}`, 
    `/clans/${clanTag}/warlog?limit=20`
  );

  if (loading) return <div className="py-10 text-center text-skin-muted animate-pulse">Loading War History...</div>;
  
  if (!logData || logData.items?.length === 0) {
     return (
        <div className="p-8 text-center border border-white/5 rounded-xl bg-black/20">
           <div className="inline-flex p-3 rounded-full bg-red-500/10 text-red-400 mb-2"><Skull size={24}/></div>
           <p className="text-skin-muted">War Log is Private or Empty.</p>
        </div>
     );
  }

  return (
    <div className="space-y-4 animate-in slide-in-from-bottom-2">
       <h3 className="text-sm font-bold text-skin-muted uppercase tracking-widest border-b border-white/5 pb-2">Recent Wars</h3>
       
       <div className="grid gap-2">
          {logData.items.map((war: any, i: number) => {
             const isWin = war.result === 'win';
             const isTie = war.result === 'tie';
             const colorClass = isWin ? 'border-l-green-500' : isTie ? 'border-l-gray-500' : 'border-l-red-500';
             const bgClass = isWin ? 'bg-green-500/5' : 'bg-red-500/5';
             
             // Format Date (EndDate is usually YYYYMMDD...)
             const date = new Date(
                war.endTime.substring(0,4) + '-' + 
                war.endTime.substring(4,6) + '-' + 
                war.endTime.substring(6,8)
             ).toLocaleDateString();

             return (
               <div key={i} className={`relative flex items-center justify-between p-3 bg-[#1f2937] ${bgClass} border border-white/5 border-l-4 ${colorClass} rounded-r-lg`}>
                  
                  {/* Opponent */}
                  <div className="flex-1">
                     <div className="flex items-center gap-2">
                        <span className={`text-xs font-black uppercase px-1.5 py-0.5 rounded text-black ${isWin ? 'bg-green-500' : isTie ? 'bg-gray-400' : 'bg-red-500'}`}>
                           {war.result || "N/A"}
                        </span>
                        <span className="font-bold text-white truncate">{war.opponent.name}</span>
                     </div>
                     <div className="text-[10px] text-skin-muted mt-1">{date} • {war.teamSize} vs {war.teamSize}</div>
                  </div>

                  {/* Score */}
                  <div className="text-right flex items-center gap-4">
                     <div className="flex flex-col items-end">
                        <span className="text-sm font-clash text-white flex items-center gap-1">
                           <Star size={12} className="text-yellow-500 fill-yellow-500"/>
                           {war.clan.stars} - {war.opponent.stars}
                        </span>
                        <span className="text-[10px] text-skin-muted flex items-center gap-1">
                           <Percent size={10}/> {war.clan.destructionPercentage.toFixed(1)}%
                        </span>
                     </div>
                  </div>

               </div>
             );
          })}
       </div>
    </div>
  );
}
