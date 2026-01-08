 'use client';

import { useClashData } from "@/hooks/useClashData";
import { timeAgo, saveToHistory } from "@/lib/utils";
import { Users, Swords, Trophy, Map, RefreshCw, Clock, ShieldAlert, Globe, MapPin, Target, BookOpen, Crown, Coins, ShieldPlus, Inbox, ChevronRight, Star, Percent } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import SkeletonLoader from "@/components/SkeletonLoader";
import WarMap, { WarData } from "@/components/WarMap";
import CapitalRaidSection, { RaidSeason } from "@/components/CapitalRaidSection";

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
  clanRank: number; 
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
  clans: { tag: string; name: string; badgeUrls: { small: string }; clanLevel: number }[];
  rounds: any[];
}
interface RaidSeasonsResponse {
  items: RaidSeason[];
}

export default function ClanPage({ params }: { params: { tag: string } }) {
  const tag = decodeURIComponent(params.tag);
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'war' | 'raids' | 'cwl'>('overview');

  const { data: clan, loading: clanLoading, isCached, timestamp, refresh: refreshClan } = useClashData<ClanData>(`clan_${tag}`, `/clans/${tag}`);
  const { data: cwl, loading: cwlLoading, refresh: refreshCWL } = useClashData<CWLData>(`cwl_${tag}`, `/clans/${tag}/currentwar/leaguegroup`);
  const { data: warData, loading: warLoading, refresh: refreshWar } = useClashData<WarData>(`war_${tag}`, `/clans/${tag}/currentwar`);
  const { data: raidData, loading: raidLoading, refresh: refreshRaids } = useClashData<RaidSeasonsResponse>(`raids_${tag}`, `/clans/${tag}/capitalraidseasons?limit=10`);

  useEffect(() => {
    if (clan) {
      saveToHistory(clan.tag, clan.name, 'clan', clan.badgeUrls.small);
    }
  }, [clan]);

  const handleRefresh = () => {
    refreshClan();
    if(activeTab === 'cwl') refreshCWL();
    if(activeTab === 'war') refreshWar();
    if(activeTab === 'raids') refreshRaids();
  };

  if (clanLoading) return <SkeletonLoader />;
  if (!clan) return <div className="p-10 text-center font-clash text-xl text-skin-muted">Clan not found.</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-24">
      
      {/* --- HERO HEADER --- */}
      <div className="relative bg-[#1a232e] border border-skin-primary/30 rounded-2xl overflow-hidden shadow-2xl">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900 via-transparent to-transparent pointer-events-none"></div>
        <div className="absolute -left-10 -bottom-20 w-64 h-64 bg-skin-primary/10 rounded-full blur-3xl"></div>

        <div className="relative z-20 flex justify-between items-start p-4">
             <div className="flex gap-2">
                 {isCached && timestamp && (
                   <span className="text-[10px] text-skin-muted bg-black/40 px-2 py-1 rounded-md flex items-center gap-1 backdrop-blur-sm border border-white/5">
                     <Clock size={10} /> Data cached {timeAgo(timestamp)}
                   </span>
                 )}
             </div>
             {/* UPDATED BUTTON TEXT */}
             <button onClick={handleRefresh} className="group flex items-center gap-2 bg-skin-primary/90 hover:bg-skin-primary text-white pl-3 pr-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-lg active:scale-95">
               <RefreshCw size={14} className={`transition-transform ${clanLoading ? "animate-spin" : "group-hover:rotate-180"}`} />
               {clanLoading ? "Reloading..." : "Reload Clan Data"}
             </button>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6 p-6 pb-8">
            <div className="relative shrink-0">
                <div className="absolute inset-0 bg-white/10 blur-2xl rounded-full"></div>
                <img src={clan.badgeUrls.large} alt={clan.name} className="w-32 h-32 md:w-40 md:h-40 object-contain relative z-10 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] transform hover:scale-105 transition-transform duration-500" />
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-[10px] font-bold px-3 py-0.5 rounded-full border border-white/10 backdrop-blur-md whitespace-nowrap">
                    Lvl {clan.clanLevel}
                </div>
            </div>

            <div className="flex-1 text-center md:text-left space-y-2">
                <h1 className="text-4xl md:text-6xl font-clash text-white tracking-wide uppercase drop-shadow-md leading-none">
                    {clan.name}
                </h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-3 items-center">
                    <span className="text-skin-muted font-mono text-xs tracking-wider opacity-70">{clan.tag}</span>
                    <div className="h-4 w-px bg-white/10"></div>
                    <div className="flex items-center gap-1 text-xs font-bold text-[#ffd700]">
                        <Trophy size={14} /> {clan.clanPoints}
                    </div>
                    {clan.warLeague && (
                         <span className="bg-[#1e293b] text-blue-200 px-2 py-0.5 rounded text-[10px] border border-blue-500/30 font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                            <Swords size={10}/> {clan.warLeague.name}
                         </span>
                    )}
                </div>
                <p className="text-skin-muted text-sm max-w-xl leading-relaxed mt-3 line-clamp-3 md:line-clamp-none">
                    {clan.description}
                </p>
            </div>
        </div>

        <div className="bg-[#131b24]/80 backdrop-blur-md border-t border-white/5 p-4 grid grid-cols-4 gap-2 text-center divide-x divide-white/5">
            <div>
                <div className="text-[10px] text-skin-muted uppercase font-bold tracking-widest mb-1">Members</div>
                <div className="text-lg font-clash text-white">{clan.members}/50</div>
            </div>
            <div>
                <div className="text-[10px] text-skin-muted uppercase font-bold tracking-widest mb-1">War Wins</div>
                <div className="text-lg font-clash text-green-400">{clan.warWins}</div>
            </div>
            <div>
                <div className="text-[10px] text-skin-muted uppercase font-bold tracking-widest mb-1">Streak</div>
                <div className="text-lg font-clash text-orange-400 flex items-center justify-center gap-1">
                    {clan.warWinStreak} <span className="text-[10px] font-sans opacity-50">🔥</span>
                </div>
            </div>
            <div>
                <div className="text-[10px] text-skin-muted uppercase font-bold tracking-widest mb-1">Location</div>
                <div className="text-sm font-bold text-white truncate px-1">{clan.location?.name || "International"}</div>
            </div>
        </div>
      </div>

      {/* --- TABS --- */}
      <div className="flex gap-2 md:gap-4 border-b border-skin-primary/10 pb-1 overflow-x-auto no-scrollbar">
        {['overview', 'members', 'war', 'raids', 'cwl'].map(tab => (
           <button 
             key={tab}
             onClick={() => setActiveTab(tab as any)} 
             className={`pb-2 px-4 font-clash text-sm tracking-wide transition-all uppercase whitespace-nowrap relative
               ${activeTab === tab ? 'text-white' : 'text-skin-muted hover:text-skin-text'}
             `}
           >
             {tab === 'members' ? `Members (${clan.members})` : tab === 'war' ? 'Current War' : tab === 'raids' ? 'Raid Weekend' : tab}
             {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-skin-primary shadow-[0_0_10px_var(--color-primary)]"></div>}
           </button>
        ))}
      </div>

      {/* --- OVERVIEW TAB --- */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-skin-surface border border-skin-primary/10 rounded-xl p-5 shadow-lg relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Swords size={64}/></div>
              <h3 className="font-clash text-lg text-white mb-4 flex items-center gap-2"><Target className="text-red-400" size={20}/> War Intelligence</h3>
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
                      <span className="font-bold text-white flex items-center gap-1"><Trophy size={14} className="text-[#ffd700]"/> {clan.requiredTrophies}</span>
                  </div>
              </div>
           </div>

           <div className="bg-gradient-to-br from-[#2c1a12] to-[#1a100c] border border-orange-500/30 rounded-xl p-5 shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('/assets/icons/capital_hall.png')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
              <div className="relative z-10 flex justify-between items-start mb-4">
                 <div>
                    <h3 className="font-clash text-lg text-orange-400 flex items-center gap-2"><Map size={20}/> Capital Hall {clan.clanCapital.capitalHallLevel}</h3>
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
      )}

      {/* --- MEMBERS TAB --- */}
      {activeTab === 'members' && (
        <div className="flex flex-col gap-2">
            <div className="hidden md:flex px-4 py-2 text-[10px] uppercase font-bold text-skin-muted tracking-widest">
                <div className="w-12 text-center">Rank</div>
                <div className="flex-1">Member</div>
                <div className="w-48 text-center">Donations</div>
                <div className="w-24 text-right">Trophies</div>
            </div>

            {clan.memberList.map((member, i) => {
              const rank = i + 1;
              return (
              <Link 
                key={member.tag} 
                href={`/player/${encodeURIComponent(member.tag)}`}
                className="group relative bg-[#2a3a4b] border border-[#3a4a5b] hover:border-[#5c9dd1] rounded-lg 
                           h-auto py-2 md:py-0 md:h-[70px] 
                           flex flex-row items-center overflow-hidden transition-all hover:-translate-y-0.5 shadow-md"
              >
                <div className="flex md:contents">
                    <div className="h-full w-10 md:w-12 flex items-center justify-center shrink-0 border-r md:border-r border-[#3a4a5b]/50 md:border-[#3a4a5b] md:bg-[#202b38] md:group-hover:bg-[#253241] relative">
                        <div className="text-sm md:text-lg font-clash text-white/80 z-10">{rank}</div>
                        <div className="hidden md:block absolute top-0 left-0 w-1 h-full bg-skin-primary"></div>
                    </div>
                    <div className="w-10 md:w-16 h-full flex items-center justify-center shrink-0">
                        {member.leagueTier?.iconUrls?.small ? (
                            <img src={member.leagueTier.iconUrls.small} alt="League" className="w-8 h-8 md:w-10 md:h-10 object-contain drop-shadow-md" />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center"><Trophy size={14} className="text-skin-muted"/></div>
                        )}
                    </div>
                </div>
                <div className="flex-1 flex flex-col justify-center px-2 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm truncate">{member.name}</span>
                        <span className="hidden md:inline text-[10px] text-skin-muted opacity-60">Lvl {member.expLevel}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                        <Users size={10} className={member.role === 'leader' ? 'text-red-400' : member.role === 'coLeader' ? 'text-orange-400' : 'text-skin-muted'}/>
                        <span className={`text-[10px] uppercase font-bold ${member.role === 'leader' ? 'text-red-400' : member.role === 'coLeader' ? 'text-orange-400' : 'text-skin-muted'}`}>
                            {member.role === 'admin' ? 'Elder' : member.role === 'coLeader' ? 'Co-Leader' : member.role}
                        </span>
                    </div>
                </div>
                <div className="flex md:hidden flex-col items-end gap-1 px-3 min-w-[80px]">
                    <div className="flex items-center gap-1 bg-[#131b24] px-2 py-0.5 rounded-full border border-white/5">
                        <Trophy size={10} className="text-[#ffd700]" fill="#ffd700"/>
                        <span className="text-xs font-bold text-white">{member.trophies}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[9px] text-skin-muted">
                        <span className="flex items-center text-green-400 gap-0.5"><ShieldPlus size={10}/> {member.donations}</span>
                        <span className="flex items-center text-orange-400 gap-0.5"><Inbox size={10}/> {member.donationsReceived}</span>
                    </div>
                </div>
                <div className="hidden md:flex w-48 flex-col justify-center gap-1 px-2 border-l border-white/5 h-4/5 my-auto">
                    <div className="flex items-center justify-between text-[10px]">
                        <span className="text-[#a8c5a8] flex items-center gap-1"><ShieldPlus size={10}/> Donated:</span>
                        <span className="font-bold text-white">{member.donations}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px]">
                        <span className="text-[#c5a8a8] flex items-center gap-1"><Inbox size={10}/> Received:</span>
                        <span className="font-bold text-white">{member.donationsReceived}</span>
                    </div>
                </div>
                <div className="hidden md:flex w-24 items-center justify-end pr-4 pl-2 bg-[#202b38]/50 h-full">
                    <div className="bg-[#131b24] border border-[#3a4a5b] rounded-full px-3 py-1 flex items-center gap-1.5 min-w-[70px] justify-center">
                        <Trophy size={12} className="text-[#ffd700]" fill="#ffd700" />
                        <span className="font-bold text-white text-sm">{member.trophies}</span>
                    </div>
                </div>
              </Link>
            )})}
        </div>
      )}

      {/* --- WAR TAB --- */}
      {activeTab === 'war' && (
         <div className="min-h-[300px] space-y-4">
            {warLoading && <SkeletonLoader />}
            {!warLoading && !warData && <div className="text-center py-10 opacity-50 font-clash">No active war data found.<br/><span className="text-xs font-sans text-skin-muted">(Or Clan War League is active)</span></div>}
            
            {!warLoading && warData && (
                <>
                {/* Visual Header for War Status */}
                <div className="bg-[#1a232e] border border-skin-primary/30 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
                    {/* Clan (Us) */}
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <img src={warData.clan.badgeUrls.small} className="w-12 h-12" alt=""/>
                        <div>
                            <div className="text-lg font-clash text-white leading-none">{warData.clan.name}</div>
                            <div className="flex items-center gap-3 mt-1 text-xs">
                                <span className="flex items-center gap-1 text-[#ffd700] font-bold"><Star size={12} fill="#ffd700"/> {warData.clan.stars}</span>
                                <span className="flex items-center gap-1 text-skin-muted"><Percent size={12}/> {warData.clan.destructionPercentage.toFixed(2)}%</span>
                            </div>
                        </div>
                    </div>

                    {/* VS Badge */}
                    <div className="bg-red-500/10 px-3 py-1 rounded border border-red-500/20 text-red-400 font-clash text-xl">VS</div>

                    {/* Opponent */}
                    <div className="flex items-center gap-3 w-full md:w-auto flex-row-reverse md:flex-row text-right md:text-left">
                        <img src={warData.opponent.badgeUrls.small} className="w-12 h-12" alt=""/>
                        <div>
                            <div className="text-lg font-clash text-white leading-none">{warData.opponent.name}</div>
                            <div className="flex items-center gap-3 mt-1 text-xs justify-end md:justify-start">
                                <span className="flex items-center gap-1 text-[#ffd700] font-bold"><Star size={12} fill="#ffd700"/> {warData.opponent.stars}</span>
                                <span className="flex items-center gap-1 text-skin-muted"><Percent size={12}/> {warData.opponent.destructionPercentage.toFixed(2)}%</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <WarMap data={warData} />
                </>
            )}
         </div>
      )}

      {/* --- RAIDS TAB --- */}
      {activeTab === 'raids' && (
        <div className="min-h-[300px]">
          {raidLoading && <SkeletonLoader />}
          {!raidLoading && !raidData && <div className="text-center py-10 opacity-50 font-clash">No Raid Seasons found.</div>}
          {!raidLoading && raidData && <CapitalRaidSection seasons={raidData.items} />}
        </div>
      )}

      {/* --- CWL TAB --- */}
      {activeTab === 'cwl' && (
        <div className="bg-[#1a232e] border border-skin-secondary/20 rounded-xl overflow-hidden min-h-[200px]">
           {!cwlLoading && !cwl && <div className="text-center py-10 opacity-50"><Globe size={32} className="mx-auto mb-2"/><p>No Active CWL Group</p></div>}
           {!cwlLoading && cwl && (
             <div className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 border-b border-white/5 pb-4 gap-4">
                  <div>
                    <h3 className="text-2xl font-clash text-white flex items-center gap-2"><Swords className="text-red-500"/> {cwl.season}</h3>
                    <p className="text-sm text-skin-muted">Clan War League Group</p>
                  </div>
                  <span className="text-xs bg-yellow-600/20 text-yellow-500 px-4 py-1.5 rounded-full border border-yellow-600/50 font-bold tracking-wider animate-pulse">
                      {cwl.state.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-[10px] uppercase font-bold text-skin-muted tracking-widest">
                      <div className="col-span-6">Clan</div>
                      <div className="col-span-2 text-center">Level</div>
                      <div className="col-span-4 text-right">Details</div>
                  </div>

                  {cwl.clans.map((c, idx) => (
                    <Link 
                        href={`/clan/${encodeURIComponent(c.tag)}`} 
                        key={c.tag} 
                        className={`group grid grid-cols-12 gap-4 items-center p-3 rounded-lg border transition-all
                            ${c.tag === clan.tag 
                                ? 'bg-skin-primary/10 border-skin-primary shadow-[0_0_15px_rgba(var(--color-primary),0.2)]' 
                                : 'bg-black/20 border-white/5 hover:bg-white/5 hover:border-skin-secondary/50'
                            }`}
                    >
                       <div className="col-span-8 md:col-span-6 flex items-center gap-3">
                          <span className="text-skin-muted font-mono text-xs w-4">{idx + 1}</span>
                          <img src={c.badgeUrls.small} alt="" className="w-10 h-10 object-contain drop-shadow-md group-hover:scale-110 transition-transform"/>
                          <div>
                             <p className={`font-bold text-sm ${c.tag === clan.tag ? 'text-skin-secondary' : 'text-white group-hover:text-skin-secondary transition-colors'}`}>{c.name}</p>
                             <p className="text-[10px] text-skin-muted font-mono">{c.tag}</p>
                          </div>
                       </div>

                       <div className="col-span-2 hidden md:block text-center">
                           <span className="bg-black/40 px-2 py-1 rounded text-xs font-bold text-white border border-white/10">{c.clanLevel}</span>
                       </div>

                       <div className="col-span-4 md:col-span-4 flex items-center justify-end gap-2 text-skin-muted group-hover:text-white transition-colors">
                           <span className="text-xs hidden md:inline">View Clan</span>
                           <ChevronRight size={16} />
                       </div>
                    </Link>
                  ))}
                </div>
                <div className="mt-4 text-center text-[10px] text-skin-muted opacity-60">
                    * Rankings shown are based on list order. Live star rankings require individual war data.
                </div>
             </div>
           )}
        </div>
      )}
    </div>
  );
}
