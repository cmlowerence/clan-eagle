import { Swords, Target, Map, Trophy } from "lucide-react";
import { ClanData } from "./types";

export default function ClanOverview({ clan }: { clan: ClanData }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* War Intelligence Card */}
      <div className="bg-skin-surface border border-skin-primary/10 rounded-xl p-5 shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Swords size={64} />
        </div>
        <h3 className="font-clash text-lg text-white mb-4 flex items-center gap-2">
          <Target className="text-red-400" size={20} /> War Intelligence
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span className="text-sm text-skin-muted">Frequency</span>
            <span className="font-bold text-white uppercase">{clan.warFrequency}</span>
          </div>
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span className="text-sm text-skin-muted">War Log</span>
            <span className={`font-bold uppercase text-xs px-2 py-0.5 rounded ${clan.isWarLogPublic ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {clan.isWarLogPublic ? "Public" : "Private"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-skin-muted">Required Trophies</span>
            <span className="font-bold text-white flex items-center gap-1">
              <Trophy size={14} className="text-[#ffd700]" /> {clan.requiredTrophies}
            </span>
          </div>
        </div>
      </div>

      {/* Capital Hall Card */}
      <div className="bg-gradient-to-br from-[#2c1a12] to-[#1a100c] border border-orange-500/30 rounded-xl p-5 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/icons/capital_hall.png')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="relative z-10 flex justify-between items-start mb-4">
          <div>
            <h3 className="font-clash text-lg text-orange-400 flex items-center gap-2">
              <Map size={20} /> Capital Hall {clan.clanCapital.capitalHallLevel}
            </h3>
            <p className="text-xs text-orange-200/60 mt-1">Mountain Destination</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-clash text-white">{clan.clanCapitalPoints}</div>
            <div className="text-[10px] text-orange-400 uppercase font-bold">Total Points</div>
          </div>
        </div>
        <div className="relative z-10 grid grid-cols-2 gap-2 mt-4">
          {clan.clanCapital.districts.slice(0, 6).map(d => (
            <div key={d.id} className="bg-black/40 px-3 py-2 rounded border border-orange-500/10 flex justify-between items-center">
              <span className="text-xs text-orange-100/80 truncate pr-2">{d.name}</span>
              <span className="bg-orange-500 text-black text-[10px] font-bold px-1.5 rounded-sm">{d.districtHallLevel}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
