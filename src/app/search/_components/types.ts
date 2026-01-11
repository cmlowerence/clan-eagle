export interface ClanResult {
  tag: string;
  name: string;
  clanLevel: number;
  members: number;
  clanPoints: number;
  badgeUrls: { small: string };
  location?: { name: string };
}
