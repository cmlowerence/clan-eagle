export interface ClanMember {
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

export interface ClanData {
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

export interface CWLData {
  state: string;
  season: string;
  clans: { tag: string; name: string; badgeUrls: { small: string }; clanLevel: number }[];
  rounds: any[];
}

export type TabType = 'overview' | 'members' | 'war' | 'raids' | 'cwl';
