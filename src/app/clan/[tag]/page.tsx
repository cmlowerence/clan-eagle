'use client';

import { useClashData } from "@/hooks/useClashData";
import { timeAgo, saveToHistory } from "@/lib/utils";
import { Users, Swords, Trophy, Map, RefreshCw, Clock, ShieldAlert, Globe, MapPin, Target, BookOpen, Crown } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import SkeletonLoader from "@/components/SkeletonLoader";
import WarMap, { WarData } from "@/components/WarMap";

// --- Interfaces ---
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
  badgeUrls: { large: string; medium: string; small: string };
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
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'war' | 'cwl'>('overview');

  const { data: clan, loading: clanLoading, isCached, timestamp, refresh: refreshClan } = useClashData<ClanData>(`clan_${tag}`, `/clans/${tag}`);
  const { data: cwl, loading: cwlLoading, refresh: refreshCWL } = useClashData<CWLData>(`cwl_${tag}`, `/clans/${tag}/currentwar/leaguegroup`);
  const { data: warData, loading: warLoading, refresh: refreshWar } = useClashData<WarData>(`war_${tag}`, `/clans/${tag}/currentwar`);

  // --- EAGLE EYE: Save to History ---
  useEffect(() => {
    if (clan) {
      saveToHistory(clan.tag, clan.name, 'clan', clan.badgeUrls.small);
    }
  }, [clan]);

  const handleRefresh = () => {
    refreshClan();
    if(activeTab === 'cwl') refreshCWL();
    if(activeTab === 'war') refreshWar();
  };

  if (clanLoading) return <SkeletonLoader />;
  if (!clan) return <div className="p-10 text-center font-clash text-xl text-skin-muted">Clan not found.</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      
      {/* --- HEADER --- */}
      <div className="bg-skin-surface border border-skin-primary/20 rounded-xl p-6 relative overflow-hidden shadow-lg">
        {/* Background Emblem Faded */}
        <div className="absolute right-[-20px] bottom-[-20px] opacity-5 pointer-events-none">
           <img src={clan.badgeUrls.large} className="w-64 h-64 grayscale" alt="" />
        </div>

        {/* Action Bar (Refresh/Cache) */}
        <div className="flex justify-end mb-4">
          <div className="flex flex-col items-end gap-1">
             <button onClick={handleRefresh} className="flex items-center gap-2 bg-skin-primary hover:bg-skin-secondary text-white px-3 py-1.5 rounded-full text-xs font-bold transition-colors shadow-lg">
               <RefreshCw size={14} className={clanLoading ? "animate-spin" : ""} />
               {clanLoading ? "Updating..." : "Update"}
             </button>
             {isCached && timestamp && (
               <span className="text-[10px] text-skin-muted bg-black/40 px-2 py-0.5 rounded flex items-center gap-1 backdrop-blur-sm">
                 <Clock size={10} /> {timeAgo(timestamp)}
               </span>
             )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-6 z-10 relative">
          {/* Badge */}
          <div className="relative">
             <div className="absolute inset-0 bg-skin-primary/20 blur-xl rounded-full"></div>
             <img src={clan.badgeUrls.large} alt={clan.name} className="w-24 h-24 md:w-32 md:h-32 drop-shadow-2xl relative z-10" />
          </div>

          {/* Info */}
          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl md:text-5xl font-clash text-skin-text tracking-wide uppercase drop-shadow-sm">{clan.name}</h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-2">
               <span className="bg-skin-bg px-2 py-1 rounded text-xs text-skin-muted border border-skin-primary/30 font-mono font-bold">{clan.tag}</span>
               {clan.warLeague && <span className="bg-yellow-900/40 text-yellow-200 px-2 py-1 rounded text-xs border border-yellow-700 font-bold flex items-center gap-1"><Swords size={12}/> {clan.warLeague.name}</span>}
            </div>
            <p className="text-skin-muted mt-4 text-sm max-w-2xl italic leading-relaxed whitespace-pre-line border-l-2 border-skin-primary/30 pl-3 ml-auto mr-auto md:ml-0">{clan.description}</p>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-2 text-center w-full md:w-auto mt-4 md:mt-0">
            <div className="bg-skin-bg/80 p-3 rounded-lg border border-skin-primary/10 backdrop-blur-sm">
               <div className="text-[10px] text-skin-muted uppercase font-bold">Level</div><div className="text-2xl font-clash text-skin-secondary">{clan.clanLevel}</div>
            </div>
            <div className="bg-skin-bg/80 p-3 rounded-lg border border-skin-primary/10 backdrop-blur-sm">
               <div className="text-[10px] text-skin-muted uppercase font-bold">Points</div><div className="text-xl font-clash text-skin-text">{clan.clanPoints}</div>
            </div>
            <div className="bg-skin-bg/80 p-3 rounded-lg border border-skin-primary/10 backdrop-blur-sm">
               <div className="text-[10px] text-skin-muted uppercase font-bold">Wins</div><div className="text-xl font-clash text-green-400">{clan.warWins}</div>
            </div>
            <div className="bg-skin-bg/80 p-3 rounded-lg border border-skin-primary/10 backdrop-blur-sm">
               <div className="text-[10px] text-skin-muted uppercase font-bold">Streak</div><div className="text-xl font-clash text-orange-400">{clan.warWinStreak}</div>
            </div>
          </div>
        </div>
      </div>

      {/* --- TABS --- */}
      <div className="flex gap-2 md:gap-4 border-b border-skin-primary/20 pb-1 overflow-x-auto">
        {['overview', 'members', 'war', 'cwl'].map(tab => (
           <button 
             key={tab}
             onClick={() => setActiveTab(tab as any)} 
             className={`pb-2 px-4 font-clash text-sm tracking-wide transition-colors uppercase whitespace-nowrap 
               ${activeTab === tab ? 'text-skin-secondary border-b-2 border-skin-secondary' : 'text-skin-muted hover:text-skin-text'}
               ${tab === 'war' && activeTab !== 'war' ? 'text-red-400 hover:text-red-300' : ''}
             `}
           >
             {tab === 'members' ? `Members (${clan.members})` : tab === 'war' ? 'Current War' : tab}
           </button>
        ))}
      </div>

      {/* --- OVERVIEW TAB --- */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
           {/* Settings Grid */}
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-skin-surface p-4 rounded-xl border border-skin-primary/10 flex flex-col items-center text-center gap-2">
                 <div className="w-8 h-8 rounded-full bg-skin-primary/10 flex items-center justify-center text-skin-primary"><Crown size={16}/></div>
                 <div><div className="text-[10px] text-skin-muted uppercase font-bold">Type</div><div className="font-bold text-sm text-skin-text">{clan.type}</div></div>
              </div>
              <div className="bg-skin-surface p-4 rounded-xl border border-skin-primary/10 flex flex-col items-center text-center gap-2">
                 <div className="w-8 h-8 rounded-full bg-skin-secondary/10 flex items-center justify-center text-skin-secondary"><Trophy size={16}/></div>
                 <div><div className="text-[10px] text-skin-muted uppercase font-bold">Required</div><div className="font-bold text-sm text-skin-text">{clan.requiredTrophies}</div></div>
              </div>
              <div className="bg-skin-surface p-4 rounded-xl border border-skin-primary/10 flex flex-col items-center text-center gap-2">
                 <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500"><Target size={16}/></div>
                 <div><div className="text-[10px] text-skin-muted uppercase font-bold">Frequency</div><div className="font-bold text-sm text-skin-text">{clan.warFrequency}</div></div>
              </div>
              <div className="bg-skin-surface p-4 rounded-xl border border-skin-primary/10 flex flex-col items-center text-center gap-2">
                 <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500"><MapPin size={16}/></div>
                 <div><div className="text-[10px] text-skin-muted uppercase font-bold">Location</div><div className="font-bold text-sm text-skin-text">{clan.location?.name || "Intl"}</div></div>
              </div>
           </div>

           {/* Clan Capital Banner */}
           <div className="bg-gradient-to-r from-orange-900/40 to-skin-surface rounded-xl border border-orange-500/20 p-6 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-1/2 h-full bg-[url('/assets/icons/capital_hall.png')] bg-contain bg-no-repeat bg-right opacity-20 grayscale"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                 <div className="text-center md:text-left">
                    <h3 className="flex items-center gap-2 font-clash text-2xl text-orange-400"><Map size={24}/> Clan Capital</h3>
                    <p className="text-sm text-skin-muted">Capital Hall Level <span className="text-white font-bold">{clan.clanCapital.capitalHallLevel}</span></p>
                 </div>
                 
                 <div className="bg-black/30 p-3 rounded-lg border border-orange-500/30 flex items-center gap-3">
                    <div className="text-right">
                       <div className="text-3xl font-clash text-orange-400 drop-shadow-sm leading-none">{clan.clanCapitalPoints}</div>
                       <div className="text-[10px] text-skin-muted font-bold uppercase tracking-widest">Total Points</div>
                    </div>
                 </div>

                 <div className="flex-1 flex flex-wrap justify-center md:justify-end gap-2">
                    {clan.clanCapital.districts.slice(0, 4).map(d => (
                       <div key={d.id} className="bg-skin-bg px-3 py-1.5 rounded text-xs border border-skin-primary/10 flex items-center gap-2">
                          <span className="text-skin-muted">{d.name}</span>
                          <span className="bg-orange-500/20 text-orange-400 px-1.5 rounded font-bold">{d.districtHallLevel}</span>
                       </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* War Log Public Status */}
           <div className={`p-3 rounded-lg border text-center text-sm font-bold uppercase tracking-widest ${clan.isWarLogPublic ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
              War Log {clan.isWarLogPublic ? "Public" : "Private"}
           </div>
        </div>
      )}

      {/* --- MEMBERS TAB --- */}
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
                     {member.leagueTier?.iconUrls?.small ? <img src={member.leagueTier.iconUrls.small} alt="League" className="object-contain w-full h-full" /> : <Trophy size={16} className="text-skin-muted"/>}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-skin-text group-hover:text-skin-primary flex items-center gap-2">{member.name}<span className="text-[9px] bg-skin-primary/10 text-skin-primary border border-skin-primary/20 px-1 rounded uppercase">{member.role}</span></p>
                    <p className="text-xs text-skin-muted">Lvl {member.expLevel}</p>
                  </div>
                </div>
                <div className="text-right"><p className="font-clash text-skin-text text-sm">{member.trophies} <span className="text-xs font-sans text-skin-muted">🏆</span></p></div>
              </Link>
            ))}
        </div>
      )}

      {/* --- WAR TAB --- */}
      {activeTab === 'war' && (
         <div className="min-h-[300px]">
            {warLoading && <SkeletonLoader />}
            {!warLoading && !warData && <div className="text-center py-10 opacity-50 font-clash">No active war data found.<br/><span className="text-xs font-sans text-skin-muted">(Or Clan War League is active)</span></div>}
            {!warLoading && warData && <WarMap data={warData} />}
         </div>
      )}

      {/* --- CWL TAB --- */}
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
