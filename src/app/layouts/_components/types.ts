export interface BaseLayout {
  id: string;
  title: string;
  town_hall: number;
  type: string;
  image_url: string;
  copy_link: string;
}

export type FilterType = 'all' | 'War' | 'Farm';
