export interface Hero {
  name: string;
  level: number;
}

export interface PlayerData {
  tag: string;
  name: string;
  townHallLevel: number;
  expLevel: number;
  trophies: number;
  warStars: number;
  heroes: Hero[];
  clan?: { name: string };
}

export interface WinnerData {
  name: string;
  tag: string | null;
  score: number;
}
