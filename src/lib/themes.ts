export type ThemeType = 'classic' | 'baby' | 'pekka' | 'edrag' | 'hog' | 'lava';

export interface ThemeColors {
  name: string;
  icon: string; // Filename of the troop icon
  colors: {
    primary: string;
    secondary: string;
    bg: string;
    surface: string;
    text: string;
    muted: string;
  };
}

export const THEMES: Record<ThemeType, ThemeColors> = {
  classic: {
    name: 'Classic Barbarian',
    icon: 'barbarian.png',
    colors: {
      primary: '#FACC15',    // Gold
      secondary: '#60A5FA',  // Elixir
      bg: '#292524',         // Stone
      surface: '#44403C',    // Light Stone
      text: '#FFFFFF',
      muted: '#A8A29E',
    },
  },
  baby: {
    name: 'Baby Dragon',
    icon: 'baby_dragon.png',
    colors: {
      primary: '#22C55E',    // Green
      secondary: '#F97316',  // Orange fire
      bg: '#052e16',         // Dark Forest
      surface: '#14532d',    // Leafy green
      text: '#F0FDF4',
      muted: '#86EFAC',
    },
  },
  pekka: {
    name: 'P.E.K.K.A',
    icon: 'p_e_k_k_a.png',
    colors: {
      primary: '#A855F7',
      secondary: '#00FFFF',
      bg: '#0F172A',
      surface: '#1E293B',
      text: '#F8FAFC',
      muted: '#94A3B8',
    },
  },
  edrag: {
    name: 'Electro Dragon',
    icon: 'electro_dragon.png',
    colors: {
      primary: '#0EA5E9',
      secondary: '#FACC15',
      bg: '#334155',
      surface: '#475569',
      text: '#F0F9FF',
      muted: '#CBD5E1',
    },
  },
  hog: {
    name: 'Hog Rider',
    icon: 'hog_rider.png',
    colors: {
      primary: '#854D0E',
      secondary: '#EC4899',
      bg: '#422006',
      surface: '#713F12',
      text: '#FEFCE8',
      muted: '#D4D4D4',
    },
  },
  lava: {
    name: 'Lava Hound',
    icon: 'lava_hound.png',
    colors: {
      primary: '#DC2626',
      secondary: '#F97316',
      bg: '#0F0F0F',
      surface: '#1C1917',
      text: '#FAFAF9',
      muted: '#A8A29E',
    },
  },
};

