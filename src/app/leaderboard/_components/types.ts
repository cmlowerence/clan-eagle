import { Globe, MapPin, LucideIcon } from "lucide-react";

export type RankingType = 'clans' | 'players';
export type LocationType = 'global' | 'local';

export interface LocationConfig {
  id: string;
  name: string;
  icon: LucideIcon;
}

export const LOCATIONS: Record<LocationType, LocationConfig> = {
  global: { id: '32000006', name: 'Global', icon: Globe },
  local: { id: '32000113', name: 'India', icon: MapPin } // ID 32000113 is India
};

export interface RankingItemData {
  tag: string;
  name: string;
  rank: number;
  previousRank: number;
  // Clan Specific
  clanPoints?: number;
  badgeUrls?: { small: string };
  members?: number;
  // Player Specific
  trophies?: number;
  league?: { iconUrls: { small: string } };
  clan?: { name: string; badgeUrls: { small: string } };
}
