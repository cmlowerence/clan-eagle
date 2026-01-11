'use client';

import { useState, useEffect } from "react";
import { useClashData } from "@/hooks/useClashData";
import { saveToHistory } from "@/lib/utils";
import SkeletonLoader from "@/components/SkeletonLoader";
import WarMap, { WarData } from "@/components/WarMap";
import CapitalRaidSection, { RaidSeason } from "@/components/CapitalRaidSection";
import WarLog from "@/components/WarLog";

// Local Component Imports
import { ClanData, CWLData, TabType } from "./_components/types";
import ClanHero from "./_components/ClanHero";
import ClanTabs from "./_components/ClanTabs";
import ClanOverview from "./_components/ClanOverview";
import ClanMembers from "./_components/ClanMembers";
import ClanCWL from "./_components/ClanCWL";
import ClanWarStatus from "./_components/ClanWarStatus";

interface RaidSeasonsResponse {
  items: RaidSeason[];
}

export default function ClanPage({ params }: { params: { tag: string } }) {
  // Ensure tag is decoded (e.g. "%23TAG" -> "#TAG")
  const tag = decodeURIComponent(params.tag);
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // --- Data Fetching ---
  // We pass the raw tag directly. The Hook & Middleware handle encoding.
  const { data: clan, loading: clanLoading, isCached, timestamp, refresh: refreshClan } = useClashData<ClanData>(`clan_${tag}`, `/clans/${tag}`);
  
  // Conditional fetches could be optimized, but keeping them here ensures data readiness when tabs switch
  const { data: cwl, loading: cwlLoading, refresh: refreshCWL } = useClashData<CWLData>(`cwl_${tag}`, `/clans/${tag}/currentwar/leaguegroup`);
  const { data: warData, loading: warLoading, refresh: refreshWar } = useClashData<WarData>(`war_${tag}`, `/clans/${tag}/currentwar`);
  const { data: raidData, loading: raidLoading, refresh: refreshRaids } = useClashData<RaidSeasonsResponse>(`raids_${tag}`, `/clans/${tag}/capitalraidseasons?limit=10`);

  // --- History & Effects ---
  useEffect(() => {
    if (clan) {
      saveToHistory(clan.tag, clan.name, 'clan', clan.badgeUrls.small);
    }
  }, [clan]);

  const handleRefresh = () => {
    refreshClan();
    if (activeTab === 'cwl') refreshCWL();
    if (activeTab === 'war') refreshWar();
    if (activeTab === 'raids') refreshRaids();
  };

  if (clanLoading) return <SkeletonLoader />;
  if (!clan) return <div className="p-10 text-center font-clash text-xl text-skin-muted">Clan not found.</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-24">
      
      {/* 1. Hero Section */}
      <ClanHero 
        clan={clan} 
        loading={clanLoading} 
        isCached={isCached} 
        timestamp={timestamp} 
        onRefresh={handleRefresh} 
      />

      {/* 2. Navigation Tabs */}
      <ClanTabs 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        memberCount={clan.members} 
      />

      {/* 3. Dynamic Content Areas */}
      
      {activeTab === 'overview' && (
        <ClanOverview clan={clan} />
      )}

      {activeTab === 'members' && (
        <ClanMembers members={clan.memberList} />
      )}

      {activeTab === 'war' && (
        <div className="min-h-[300px] space-y-6">
          {warLoading && <SkeletonLoader />}
          
          {/* Empty State for War */}
          {!warLoading && !warData && (
            <div className="text-center py-10 opacity-50 font-clash">
              No active war data found.<br />
              <span className="text-xs font-sans text-skin-muted">(Or Clan War League is active)</span>
            </div>
          )}

          {/* War Content */}
          {!warLoading && warData && (
            <>
              <ClanWarStatus warData={warData} />
              <WarMap data={warData} />
            </>
          )}

          {/* War History Log */}
          <div className="pt-6 border-t border-white/10">
            {/* FIX: Pass the full tag. Do NOT use .replace('#','') here anymore. */}
            <WarLog clanTag={clan.tag} />
          </div>
        </div>
      )}

      {activeTab === 'raids' && (
        <div className="min-h-[300px]">
          {raidLoading && <SkeletonLoader />}
          {!raidLoading && !raidData && <div className="text-center py-10 opacity-50 font-clash">No Raid Seasons found.</div>}
          {!raidLoading && raidData && <CapitalRaidSection seasons={raidData.items} />}
        </div>
      )}

      {activeTab === 'cwl' && (
        <ClanCWL 
          cwl={cwl} 
          loading={cwlLoading} 
          currentClanTag={clan.tag} 
        />
      )}
    </div>
  );
}
