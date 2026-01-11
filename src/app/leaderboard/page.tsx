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
  
  // 1. Fetch Data
  const { data: rankingData, loading, error } = useClashData<{ items: RankingItemData[] }>(
    `rank_${location}_${type}`, 
    `/locations/${locId}/rankings/${type}?limit=20`
  );

  // 2. CRITICAL SAFETY CHECK: Ensure 'items' is always an array
  // If rankingData is null, default to empty array []
  const items = rankingData?.items || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6 min-h-[80vh]">
       
       <LeaderboardHeader location={location} setLocation={setLocation} />
       <LeaderboardTabs type={type} setType={setType} />

       <div className="bg-[#1f2937] rounded-xl border border-white/5 overflow-hidden min-h-[200px]">
          {loading ? (
             <div className="p-4 space-y-4">
                <SkeletonLoader />
                <SkeletonLoader />
             </div>
          ) : error ? (
             // 3. Error State (Prevent crash if API fails)
             <div className="p-10 text-center text-red-400">
                Failed to load rankings. <br/>
                <span className="text-xs opacity-70">{error}</span>
             </div>
          ) : (
             <div className="divide-y divide-white/5">
                {items.length > 0 ? (
                   items.map((item, idx) => (
                      <RankingItem 
                        // Use tag + idx as key to prevent duplicates crashing React
                        key={`${item.tag}-${idx}`} 
                        item={item} 
                        type={type} 
                        rank={item.rank} 
                      />
                   ))
                ) : (
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
