'use client';

import { useState } from "react";
import { useClashData } from "@/hooks/useClashData";
import SkeletonLoader from "@/components/SkeletonLoader";

// Local Components
import { RankingItemData, RankingType, LocationType, LOCATIONS } from "./_components/types";
import LeaderboardHeader from "./_components/LeaderboardHeader";
import LeaderboardTabs from "./_components/LeaderboardTabs";
import RankingItem from "./_components/RankingItem";

export default function LeaderboardPage() {
  const [location, setLocation] = useState<LocationType>('local');
  const [type, setType] = useState<RankingType>('clans');

  const locId = LOCATIONS[location].id;
  
  // Data Fetching
  // Note: The endpoint is clean. The middleware handles the request.
  const { data: rankingData, loading } = useClashData<{ items: RankingItemData[] }>(
    `rank_${location}_${type}`, 
    `/locations/${locId}/rankings/${type}?limit=20`
  );

  const items = rankingData?.items || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6 min-h-[80vh]">
       
       {/* 1. Header & Controls */}
       <LeaderboardHeader location={location} setLocation={setLocation} />

       {/* 2. Type Tabs */}
       <LeaderboardTabs type={type} setType={setType} />

       {/* 3. Ranking Table */}
       <div className="bg-[#1f2937] rounded-xl border border-white/5 overflow-hidden min-h-[200px]">
          {loading ? (
             <div className="p-4 space-y-4">
                <SkeletonLoader />
                <SkeletonLoader />
                <SkeletonLoader />
             </div>
          ) : (
             <div className="divide-y divide-white/5">
                {items.map((item, idx) => (
                   <RankingItem 
                     key={item.tag} 
                     item={item} 
                     type={type} 
                     rank={item.rank} 
                   />
                ))}
                
                {items.length === 0 && (
                   <div className="p-10 text-center text-skin-muted opacity-50">
                      No rankings found.
                   </div>
                )}
             </div>
          )}
       </div>
    </div>
  );
}
