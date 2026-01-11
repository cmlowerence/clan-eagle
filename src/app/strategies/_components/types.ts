export interface ArmyUnit {
  unit: string;
  count: number;
}

export interface Strategy {
  id: string;
  title: string;
  description: string;
  town_halls: number[];
  difficulty: string;
  video_url: string;
  army_link?: string;
  army_comp: ArmyUnit[];
  created_at: string;
}
