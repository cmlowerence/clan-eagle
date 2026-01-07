'use client';

import { useClashData } from "@/hooks/useClashData";
import { Users, Swords, Trophy, Map, RefreshCw, Clock, ShieldAlert, Globe } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Loading from "@/app/loading";

// ... [Keep Interfaces the same, omitting here for brevity but include them in your file] ...
// Re-adding minimal interfaces so the code is copy-pasteable without errors
interface ClanMember {
  tag: string;
  name: string;
  role: string;
  expLevel: number;
  leagueTier?: { id: number; name: string; iconUrls: { small: string } };
  trophies: number;
  donations: number;
  donationsReceived: number;
}
interface ClanData {
  tag: string;
  name: string;
  description: string;
  clanLevel: number;
  clanPoints: number;
  clanCapitalPoints: number;
  warWins: number;
  warWinStreak: number;
  members: number;
  type: string;
  requiredTrophies: number;
  warFrequency: string;
  isWarLogPublic: boolean;
  location?: { name: string };
  chatLanguage?: { name: string };
  badgeUrls: { large: string };
  memberList: ClanMember[];
  labels: { name: string; iconUrls: { small: string } }[];
  clanCapital: { capitalHallLevel: number; districts: any[] };
  warLeague?: { name: string };
}
interface CWLData {
  state: string;
  season: string;
  clans: { tag: string; name: string; badgeUrls: { small: string } }[];
  rounds: any[];
}

export default function ClanPage({ params }: { params: { tag: string } }) {
  const tag = decodeURIComponent(params.tag);
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'cwl'>('overview');

  const { data: clan, loading: clanLoading, isCached, lastUpdated, refresh: refreshClan } = useClashData<ClanData>(`clan_${tag}`, `/clans/${tag}`);
  const { data: cwl, loading: cwlLoading, refresh: refreshCWL } = useClashData<CWLData>(`cwl_${tag}`, `/clans/${tag}/currentwar/leaguegroup`);

  if (clanLoading) return <Loading />;
  if (!clan) return <div className="p-10 text-center font-clash text-xl text-skin-muted">Clan not found.</div>;

  const handleRefresh = () => {
    refreshClan();
    if(activeTab === 'cwl') refreshCWL();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      
      {/* --- HEADER --- */}
      <div className="bg-skin-surface border border-skin-primary/20 rounded-xl p-6 relative overflow-hidden shadow-lg">
        <div className="absolute top-4 right-4 flex flex-col items-end z-10">
          <button onClick={handleRefresh} className="flex items-center gap-2 bg-skin-primary hover:bg-skin-secondary text-white px-3 py-1.5 rounded-full text-xs font-bold transition-colors">
            <RefreshCw size={14} className={clanLoading ? "animate-spin" : ""} />
            {clanLoading ? "Updating..." : "Update"}
          </button>
          {isCached && <span className="text-[10px] text-skin-muted mt-1 flex items-center gap-1"><Clock size={10} /> Cached</span>}
        </div>

        <div className="flex flex-col md:flex-row items-center gap-6 z-0">
          <img src={clan.badgeUrls.large} alt={clan.name} className="w-24 h-24 md:w-28 md:h-28 drop-shadow-2xl" />
          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl md:text-5xl font-clash text-skin-text tracking-wide uppercase drop-shadow-sm">{clan.name}</h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-2">
               <span className="bg-skin-bg px-2 py-1 rounded text-xs text-skin-muted border border-skin-primary/30 font-mono font-bold">{clan.tag}</span>
               {clan.warLeague && <span className="bg-yellow-900/40 text-yellow-200 px-2 py-1 rounded text-xs border border-yellow-700 font-bold">{clan.warLeague.name}</span>}
            </div>
            <p className="text-skin-muted mt-4 text-sm max-w-2xl italic leading-relaxed whitespace-pre-line">{clan.description}</p>
          </div>
          
          {/* Stats Box */}
          <div className="grid grid-cols-2 gap-2 text-center w-full md:w-auto mt-4 md:mt-0">
            <div className="bg-skin-bg p-3 rounded border border-skin-primary/10">
               <div className="text-[10px] text-skin-muted uppercase font-bold">Level</div>
               <div className="text-2xl font-clash text-skin-secondary">{clan.clanLevel}</div>
            </div>
            <div className="bg-skin-bg p-3 rounded border border-skin-primary/10">
               <div className="text-[10px] text-skin-muted uppercase font-bold">Points</div>
               <div className="text-xl font-clash text-skin-text">{clan.clanPoints}</div>
            </div>
            <div className="bg-skin-bg p-3 rounded border border-skin-primary/10">
               <div className="text-[10px] text-skin-muted uppercase font-bold">Wins</div>
               <div className="text-xl font-clash text-green-400">{clan.warWins}</div>
            </div>
            <div className="bg-skin-bg p-3 rounded border border-skin-primary/10">
               <div className="text-[10px] text-skin-muted uppercase font-bold">Streak</div>
               <div className="text-xl font-clash text-orange-400">{clan.warWinStreak}</div>
            </div>
          </div>
        </div>
      </div>

      {/* --- TABS --- */}
      <div className="flex gap-2 md:gap-4 border-b border-skin-primary/20 pb-1 overflow-x-auto">
        {['overview', 'members', 'cwl'].map(tab => (
           <button 
             key={tab}
             onClick={() => setActiveTab(tab as any)} 
             className={`pb-2 px-4 font-clash text-sm tracking-wide transition-colors uppercase whitespace-nowrap ${activeTab === tab ? 'text-skin-secondary border-b-2 border-skin-secondary' : 'text-skin-muted hover:text-skin-text'}`}
           >
             {tab === 'members' ? `Members (${clan.members})` : tab}
           </button>
        ))}
      </div>

      {/* --- CONTENT --- */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-skin-surface p-6 rounded-xl border border-skin-primary/10">
              <h3 className="flex items-center gap-2 font-clash text-lg mb-4 text-skin-text"><ShieldAlert size={20} className="text-skin-primary"/> Settings</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between"><span className="text-skin-muted">Type</span> <span className="font-bold">{clan.type}</span></li>
                <li className="flex justify-between"><span className="text-skin-muted">Req. Trophies</span> <span className="font-bold">{clan.requiredTrophies}</span></li>
                <li className="flex justify-between"><span className="text-skin-muted">War Frequency</span> <span className="font-bold">{clan.warFrequency}</span></li>
                <li className="flex justify-between"><span className="text-skin-muted">War Log</span> <span className={`font-bold ${clan.isWarLogPublic ? "text-green-400" : "text-red-400"}`}>{clan.isWarLogPublic ? "Public" : "Hidden"}</span></li>
                <li className="flex justify-between"><span className="text-skin-muted">Location</span> <span className="font-bold">{clan.location?.name || "Intl"}</span></li>
              </ul>
           </div>
           <div className="bg-skin-surface p-6 rounded-xl border border-skin-primary/10">
              <h3 className="flex items-center gap-2 font-clash text-lg mb-4 text-skin-text"><Map size={20} className="text-skin-secondary"/> Capital</h3>
              <div className="text-center mb-4">
                 <div className="text-3xl font-clash text-amber-500 drop-shadow-sm">{clan.clanCapitalPoints}</div>
                 <div className="text-xs text-skin-muted font-bold uppercase">Capital Points</div>
              </div>
              <div className="space-y-2">
                 <div className="flex justify-between items-center text-sm bg-skin-bg p-2 rounded">
                    <span className="font-bold">Capital Hall</span>
                    <span className="font-clash text-skin-primary">Lvl {clan.clanCapital.capitalHallLevel}</span>
                 </div>
                 {clan.clanCapital.districts.slice(0, 3).map(d => (
                   <div key={d.id} className="flex justify-between items-center text-xs text-skin-muted px-2">
                      <span>{d.name}</span>
                      <span className="font-bold">Lvl {d.districtHallLevel}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      )}

      {activeTab === 'members' && (
        <div className="grid gap-2">
            {clan.memberList.map((member, i) => (
              <Link 
                key={member.tag} 
                href={`/player/${encodeURIComponent(member.tag)}`}
                className="group flex items-center justify-between p-3 bg-skin-surface border border-skin-surface hover:border-skin-primary rounded-lg transition-all hover:bg-skin-bg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-skin-muted font-mono text-xs w-5">{i + 1}</span>
                  <div className="w-8 h-8 md:w-10 md:h-10 relative flex items-center justify-center bg-black/20 rounded-lg p-1">
                     {member.leagueTier?.iconUrls?.small ? (
                        <img src={member.leagueTier.iconUrls.small} alt="League" className="object-contain w-full h-full" />
                     ) : <Trophy size={16} className="text-skin-muted"/>}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-skin-text group-hover:text-skin-primary flex items-center gap-2">
                      {member.name}
                      <span className="text-[9px] bg-skin-primary/10 text-skin-primary border border-skin-primary/20 px-1 rounded uppercase">{member.role}</span>
                    </p>
                    <p className="text-xs text-skin-muted">Lvl {member.expLevel}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-clash text-skin-text text-sm">{member.trophies} <span className="text-xs font-sans text-skin-muted">🏆</span></p>
                  <p className="text-[10px] text-skin-muted">Don: {member.donations}</p>
                </div>
              </Link>
            ))}
        </div>
      )}

      {activeTab === 'cwl' && (
        <div className="bg-skin-surface p-6 rounded-xl border border-skin-secondary/20 min-h-[200px]">
           {!cwlLoading && !cwl && <div className="text-center py-8 opacity-50"><Globe size={32} className="mx-auto mb-2"/><p>No Active CWL</p></div>}
           {!cwlLoading && cwl && (
             <div>
                <div className="flex justify-between items-center mb-6 border-b border-skin-muted/20 pb-4">
                  <h3 className="text-lg font-clash flex items-center gap-2"><Swords className="text-red-500"/> {cwl.season}</h3>
                  <span className="text-xs bg-yellow-600/20 text-yellow-500 px-3 py-1 rounded-full border border-yellow-600/50 font-bold">{cwl.state.toUpperCase()}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {cwl.clans.map(c => (
                    <div key={c.tag} className={`p-3 rounded-lg border flex items-center gap-3 ${c.tag === clan.tag ? 'bg-skin-primary/10 border-skin-primary' : 'bg-skin-bg border-skin-primary/10'}`}>
                       <img src={c.badgeUrls.small} alt="" className="w-8 h-8"/>
                       <div>
                          <p className={`font-bold text-xs ${c.tag === clan.tag ? 'text-skin-secondary' : 'text-skin-text'}`}>{c.name}</p>
                          <p className="text-[10px] text-skin-muted font-mono">{c.tag}</p>
                       </div>
                    </div>
                  ))}
                </div>
             </div>
           )}
        </div>
      )}
    </div>
  );
}

