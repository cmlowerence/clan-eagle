'use client';

import { useClashData } from "@/hooks/useClashData";
import { Users, Swords, Trophy, Map, RefreshCw, Clock, Globe, ShieldAlert, Award } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Loading from "@/app/loading";

// --- Minimal Types based on your JSON ---
interface ClanMember {
  tag: string;
  name: string;
  role: string;
  expLevel: number;
  leagueTier?: { id: number; name: string; iconUrls: { small: string } }; // Added leagueTier
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
  warLeague?: { name: string }; // CWL League
}

// CWL Data Interface
interface CWLData {
  state: string;
  season: string;
  clans: { tag: string; name: string; badgeUrls: { small: string } }[];
  rounds: any[];
}

export default function ClanPage({ params }: { params: { tag: string } }) {
  const tag = decodeURIComponent(params.tag);
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'cwl'>('overview');

  // 1. Fetch Clan Info
  const { 
    data: clan, 
    loading: clanLoading, 
    isCached, 
    lastUpdated, 
    refresh: refreshClan 
  } = useClashData<ClanData>(`clan_${tag}`, `/clans/${tag}`);

  // 2. Fetch CWL Info (Only when tab is active to save resources, or pre-fetch)
  const {
    data: cwl,
    loading: cwlLoading,
    refresh: refreshCWL
  } = useClashData<CWLData>(`cwl_${tag}`, `/clans/${tag}/currentwar/leaguegroup`);

  if (clanLoading) return <Loading />;
  if (!clan) return <div className="p-10 text-center">Clan not found.</div>;

  const handleRefresh = () => {
    refreshClan();
    if(activeTab === 'cwl') refreshCWL();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      
      {/* --- HEADER --- */}
      <div className="bg-skin-surface border border-skin-primary/20 rounded-xl p-6 relative overflow-hidden shadow-lg">
        {/* Refresh Control */}
        <div className="absolute top-4 right-4 flex flex-col items-end z-10">
          <button 
            onClick={handleRefresh}
            className="flex items-center gap-2 bg-skin-primary hover:bg-skin-secondary text-white px-3 py-1.5 rounded-full text-xs font-bold transition-colors"
          >
            <RefreshCw size={14} className={clanLoading ? "animate-spin" : ""} />
            {clanLoading ? "Updating..." : "Update Info"}
          </button>
          {isCached && (
            <span className="text-[10px] text-skin-muted mt-1 flex items-center gap-1">
              <Clock size={10} /> Cached: {lastUpdated}
            </span>
          )}
        </div>

        <div className="flex flex-col md:flex-row items-center gap-6 z-0">
          <img src={clan.badgeUrls.large} alt={clan.name} className="w-28 h-28 drop-shadow-2xl" />
          <div className="text-center md:text-left flex-1">
            <h1 className="text-4xl font-black text-skin-text tracking-tight uppercase">{clan.name}</h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-2">
               <span className="bg-skin-bg px-2 py-1 rounded text-xs text-skin-muted border border-skin-primary/30 font-mono">{clan.tag}</span>
               {clan.warLeague && <span className="bg-yellow-900/40 text-yellow-200 px-2 py-1 rounded text-xs border border-yellow-700">{clan.warLeague.name}</span>}
               <span className="bg-blue-900/40 text-blue-200 px-2 py-1 rounded text-xs border border-blue-700">{clan.location?.name || "International"}</span>
            </div>
            <p className="text-skin-muted mt-4 text-sm max-w-2xl italic leading-relaxed whitespace-pre-line">
              {clan.description}
            </p>
          </div>
          
          {/* Stats Box */}
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="bg-skin-bg p-3 rounded border border-skin-primary/10">
               <div className="text-xs text-skin-muted uppercase font-bold">Level</div>
               <div className="text-2xl font-black text-skin-secondary">{clan.clanLevel}</div>
            </div>
            <div className="bg-skin-bg p-3 rounded border border-skin-primary/10">
               <div className="text-xs text-skin-muted uppercase font-bold">Points</div>
               <div className="text-xl font-bold text-skin-text">{clan.clanPoints}</div>
            </div>
            <div className="bg-skin-bg p-3 rounded border border-skin-primary/10">
               <div className="text-xs text-skin-muted uppercase font-bold">War Wins</div>
               <div className="text-xl font-bold text-green-400">{clan.warWins}</div>
            </div>
            <div className="bg-skin-bg p-3 rounded border border-skin-primary/10">
               <div className="text-xs text-skin-muted uppercase font-bold">Streak</div>
               <div className="text-xl font-bold text-orange-400">{clan.warWinStreak}</div>
            </div>
          </div>
        </div>

        {/* Labels Row */}
        <div className="flex justify-center md:justify-start gap-4 mt-6 pt-6 border-t border-skin-muted/10">
           {clan.labels.map((label, idx) => (
             <div key={idx} className="flex items-center gap-2 bg-skin-bg/50 px-3 py-1 rounded-full border border-skin-surface">
                <img src={label.iconUrls.small} className="w-5 h-5" alt="" />
                <span className="text-xs font-semibold text-skin-muted">{label.name}</span>
             </div>
           ))}
        </div>
      </div>

      {/* --- TABS --- */}
      <div className="flex gap-4 border-b border-skin-primary/20 pb-1 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('overview')} 
          className={`pb-2 px-4 font-bold text-sm transition-colors ${activeTab === 'overview' ? 'text-skin-secondary border-b-2 border-skin-secondary' : 'text-skin-muted hover:text-skin-text'}`}
        >
          OVERVIEW
        </button>
        <button 
          onClick={() => setActiveTab('members')} 
          className={`pb-2 px-4 font-bold text-sm transition-colors ${activeTab === 'members' ? 'text-skin-secondary border-b-2 border-skin-secondary' : 'text-skin-muted hover:text-skin-text'}`}
        >
          MEMBERS ({clan.members})
        </button>
        <button 
          onClick={() => setActiveTab('cwl')} 
          className={`pb-2 px-4 font-bold text-sm transition-colors ${activeTab === 'cwl' ? 'text-skin-secondary border-b-2 border-skin-secondary' : 'text-skin-muted hover:text-skin-text'}`}
        >
          WAR LEAGUE
        </button>
      </div>

      {/* --- CONTENT --- */}
      
      {/* 1. OVERVIEW CONTENT */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           <div className="bg-skin-surface p-6 rounded-xl border border-skin-primary/10">
              <h3 className="flex items-center gap-2 font-bold text-lg mb-4 text-skin-text"><ShieldAlert size={20} className="text-skin-primary"/> Settings</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between"><span className="text-skin-muted">Type:</span> <span>{clan.type}</span></li>
                <li className="flex justify-between"><span className="text-skin-muted">Required Trophies:</span> <span>{clan.requiredTrophies}</span></li>
                <li className="flex justify-between"><span className="text-skin-muted">Frequency:</span> <span>{clan.warFrequency}</span></li>
                <li className="flex justify-between"><span className="text-skin-muted">Log Public:</span> <span className={clan.isWarLogPublic ? "text-green-400" : "text-red-400"}>{clan.isWarLogPublic ? "Yes" : "No"}</span></li>
                <li className="flex justify-between"><span className="text-skin-muted">Language:</span> <span>{clan.chatLanguage?.name || "N/A"}</span></li>
              </ul>
           </div>

           <div className="bg-skin-surface p-6 rounded-xl border border-skin-primary/10">
              <h3 className="flex items-center gap-2 font-bold text-lg mb-4 text-skin-text"><Map size={20} className="text-skin-secondary"/> Clan Capital</h3>
              <div className="text-center mb-4">
                 <div className="text-3xl font-black text-amber-500">{clan.clanCapitalPoints}</div>
                 <div className="text-xs text-skin-muted">Capital Points</div>
              </div>
              <div className="space-y-2">
                 <div className="flex justify-between items-center text-sm bg-skin-bg p-2 rounded">
                    <span>Capital Hall</span>
                    <span className="font-bold text-skin-primary">Lvl {clan.clanCapital.capitalHallLevel}</span>
                 </div>
                 {clan.clanCapital.districts.slice(0, 3).map(d => (
                   <div key={d.id} className="flex justify-between items-center text-xs text-skin-muted px-2">
                      <span>{d.name}</span>
                      <span>Lvl {d.districtHallLevel}</span>
                   </div>
                 ))}
                 {clan.clanCapital.districts.length > 3 && <div className="text-xs text-center text-skin-muted italic">+ {clan.clanCapital.districts.length - 3} more districts</div>}
              </div>
           </div>
        </div>
      )}

      {/* 2. MEMBERS CONTENT */}
      {activeTab === 'members' && (
        <div className="grid gap-3">
            {clan.memberList.map((member, i) => (
              <Link 
                key={member.tag} 
                href={`/player/${encodeURIComponent(member.tag)}`}
                className="group flex items-center justify-between p-4 bg-skin-surface border border-skin-surface hover:border-skin-primary rounded-lg transition-all hover:bg-skin-bg"
              >
                <div className="flex items-center gap-4">
                  <span className="text-skin-muted font-mono text-xs w-6">{i + 1}.</span>
                  <div className="w-10 h-10 relative flex items-center justify-center bg-black/20 rounded-full overflow-hidden">
                     {/* Use leagueTier icon if available */}
                     {member.leagueTier?.iconUrls?.small ? (
                        <img src={member.leagueTier.iconUrls.small} alt="League" className="object-contain w-full h-full" />
                     ) : (
                        <Trophy size={16} className="text-skin-muted"/>
                     )}
                  </div>
                  <div>
                    <p className="font-bold text-skin-text group-hover:text-skin-secondary flex items-center gap-2">
                      {member.name}
                      <span className="text-[10px] bg-skin-primary/20 text-skin-primary px-1.5 rounded uppercase">{member.role}</span>
                    </p>
                    <p className="text-xs text-skin-muted">Lvl {member.expLevel}</p>
                  </div>
                </div>
                <div className="text-right hidden md:block">
                  <p className="font-mono text-skin-primary text-sm font-bold">{member.trophies} 🏆</p>
                  <p className="text-xs text-skin-muted">Donated: {member.donations}</p>
                </div>
              </Link>
            ))}
        </div>
      )}

      {/* 3. CWL TAB */}
      {activeTab === 'cwl' && (
        <div className="bg-skin-surface p-6 rounded-xl border border-skin-secondary/20 min-h-[300px]">
           {cwlLoading && <div className="text-center py-10 text-skin-muted animate-pulse">Scouting War League...</div>}
           
           {!cwlLoading && !cwl && (
             <div className="text-center py-10">
               <Globe size={48} className="mx-auto text-skin-muted mb-4 opacity-50"/>
               <h3 className="text-xl font-bold">No Active CWL</h3>
               <p className="text-skin-muted">This clan is not currently in a CWL round.</p>
             </div>
           )}

           {!cwlLoading && cwl && (
             <div>
                <div className="flex justify-between items-center mb-6 border-b border-skin-muted/20 pb-4">
                  <h3 className="text-xl font-bold flex items-center gap-2"><Swords className="text-red-500"/> {cwl.season} Season</h3>
                  <span className="text-xs bg-yellow-600/20 text-yellow-500 px-3 py-1 rounded-full border border-yellow-600/50">
                    {cwl.state.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {cwl.clans.map(c => (
                    <div key={c.tag} className={`p-4 rounded-lg border flex items-center gap-3 ${c.tag === clan.tag ? 'bg-skin-primary/10 border-skin-primary' : 'bg-skin-bg border-skin-primary/10'}`}>
                       <img src={c.badgeUrls.small} alt="" className="w-10 h-10"/>
                       <div>
                          <p className={`font-bold text-sm ${c.tag === clan.tag ? 'text-skin-secondary' : 'text-skin-text'}`}>{c.name}</p>
                          <p className="text-xs text-skin-muted">{c.tag}</p>
                       </div>
                    </div>
                  ))}
                </div>
                
                {isCached && (
                  <div className="mt-8 p-4 bg-blue-900/20 border border-blue-500/30 rounded text-xs text-blue-200 text-center">
                    Note: CWL data is cached. Click 'Update Info' above to see the latest round status.
                  </div>
                )}
             </div>
           )}
        </div>
      )}

    </div>
  );
}
