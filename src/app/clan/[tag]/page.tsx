'use client';

import { useClashData } from "@/hooks/useClashData";
import { timeAgo, saveToHistory } from "@/lib/utils";
import { Users, Swords, Trophy, Map, RefreshCw, Clock, ShieldAlert, Globe, MapPin, Target, BookOpen, Crown, Coins, ArrowUp, ArrowDown } from "lucide-react";
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
  clanRank: number; // Added rank since API provides order, we can map index to rank
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
      
      {/* --- 1. UPGRADED HERO HEADER --- */}
      <div className="relative bg-[#1a232e] border border-skin-primary/30 rounded-2xl overflow-hidden shadow-2xl">
        {/* Decorative Background Pattern */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900 via-transparent to-transparent pointer-events-none"></div>
        <div className="absolute -left-10 -bottom-20 w-64 h-64 bg-skin-primary/10 rounded-full blur-3xl"></div>

        {/* Top Bar: Refresh & Status */}
        <div className="relative z-20 flex justify-between items-start p-4">
             <div className="flex gap-2">
                 {/* Cached Indicator */}
                 {isCached && timestamp && (
                   <span className="text-[10px] text-skin-muted bg-black/40 px-2 py-1 rounded-md flex items-center gap-1 backdrop-blur-sm border border-white/5">
                     <Clock size={10} /> {timeAgo(timestamp)}
                   </span>
                 )}
             </div>
             <button onClick={handleRefresh} className="group flex items-center gap-2 bg-skin-primary/90 hover:bg-skin-primary text-white pl-3 pr-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-lg active:scale-95">
               <RefreshCw size={14} className={`transition-transform ${clanLoading ? "animate-spin" : "group-hover:rotate-180"}`} />
               {clanLoading ? "Updating..." : "Update"}
             </button>
        </div>

        {/* Main Content Area */}
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6 p-6 pb-8">
            
            {/* Badge Container with Glow */}
            <div className="relative shrink-0">
                <div className="absolute inset-0 bg-white/10 blur-2xl rounded-full"></div>
                <img src={clan.badgeUrls.large} alt={clan.name} className="w-32 h-32 md:w-40 md:h-40 object-contain relative z-10 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] transform hover:scale-105 transition-transform duration-500" />
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-[10px] font-bold px-3 py-0.5 rounded-full border border-white/10 backdrop-blur-md whitespace-nowrap">
                    Lvl {clan.clanLevel}
                </div>
            </div>

            {/* Text Info */}
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

        {/* Stats Footer Bar */}
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

      {/* --- 2. UPGRADED OVERVIEW TAB --- */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           
           {/* Card 1: War Intelligence */}
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

           {/* Card 2: Clan Capital Highlight */}
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

      {/* --- 3. UPGRADED MEMBERS TAB (Game-Like List) --- */}
      {activeTab === 'members' && (
        <div className="flex flex-col gap-2">
            {/* Header for list (Desktop only) */}
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
                className="group relative bg-[#2a3a4b] border border-[#3a4a5b] hover:border-[#5c9dd1] rounded-lg h-[70px] flex items-center overflow-hidden transition-all hover:-translate-y-0.5 shadow-md"
              >
                {/* 1. RANK (Left Banner) */}
                <div className="h-full w-12 bg-[#202b38] flex items-center justify-center border-r border-[#3a4a5b] group-hover:bg-[#253241] transition-colors relative">
                    <div className="text-lg font-clash text-white/80 z-10">{rank}</div>
                    {/* Visual Rank Tag Effect */}
                    <div className="absolute top-0 left-0 w-1 h-full bg-skin-primary"></div>
                </div>

                {/* 2. LEAGUE ICON (Visual) */}
                <div className="w-16 h-full flex items-center justify-center shrink-0">
                    {member.leagueTier?.iconUrls?.small ? (
                        <img src={member.leagueTier.iconUrls.small} alt="League" className="w-10 h-10 object-contain drop-shadow-md" />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center"><Trophy size={14} className="text-skin-muted"/></div>
                    )}
                </div>

                {/* 3. NAME & ROLE (Center) */}
                <div className="flex-1 flex flex-col justify-center px-2 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm truncate">{member.name}</span>
                        <span className="text-[10px] text-skin-muted opacity-60">Lvl {member.expLevel}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                        <Users size={10} className={member.role === 'leader' ? 'text-red-400' : member.role === 'coLeader' ? 'text-orange-400' : 'text-skin-muted'}/>
                        <span className={`text-[10px] uppercase font-bold ${member.role === 'leader' ? 'text-red-400' : member.role === 'coLeader' ? 'text-orange-400' : 'text-skin-muted'}`}>
                            {member.role === 'admin' ? 'Elder' : member.role === 'coLeader' ? 'Co-Leader' : member.role}
                        </span>
                    </div>
                </div>

                {/* 4. DONATIONS (Right Center) */}
                <div className="w-32 md:w-48 flex flex-col justify-center gap-1 px-2 border-l border-white/5 h-4/5 my-auto">
                    <div className="flex items-center justify-between text-[10px]">
                        <span className="text-[#a8c5a8]">Donated:</span>
                        <span className="font-bold text-white">{member.donations}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px]">
                        <span className="text-[#c5a8a8]">Received:</span>
                        <span className="font-bold text-white">{member.donationsReceived}</span>
                    </div>
                </div>

                {/* 5. TROPHIES (Far Right) */}
                <div className="w-24 flex items-center justify-end pr-4 pl-2 bg-[#202b38]/50 h-full">
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
         <div className="min-h-[300px]">
            {warLoading && <SkeletonLoader />}
            {!warLoading && !warData && <div className="text-center py-10 opacity-50 font-clash">No active war data found.<br/><span className="text-xs font-sans text-skin-muted">(Or Clan War League is active)</span></div>}
            {!warLoading && warData && <WarMap data={warData} />}
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
