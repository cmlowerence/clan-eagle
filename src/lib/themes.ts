export type ThemeType = 'classic' | 'pekka' | 'edrag' | 'hog' | 'lava';

export interface ThemeColors {
  name: string;
  colors: {
    primary: string;   // Main brand color (usually Gold/Yellow)
    secondary: string; // Accents (Buttons/Elixir)
    bg: string;        // Main background
    surface: string;   // Cards/Modals
    text: string;      // Main text
    muted: string;     // Subtext
  };
}

export const THEMES: Record<ThemeType, ThemeColors> = {
  classic: {
    name: 'Clash Classic',
    colors: {
      primary: '#FACC15',    // Iconic Gold
      secondary: '#60A5FA',  // Elixir Blue
      bg: '#292524',         // Stone Dark Gray (Walls)
      surface: '#44403C',    // Lighter Stone
      text: '#FFFFFF',       // White text with shadow
      muted: '#A8A29E',      // Stone Grey Text
    },
  },
  pekka: {
    name: 'P.E.K.K.A',
    colors: {
      primary: '#A855F7',    // Purple
      secondary: '#00FFFF',  // Neon Blue
      bg: '#0F172A',         // Metallic Dark Grey
      surface: '#1E293B',    // Lighter Metallic
      text: '#F8FAFC',
      muted: '#94A3B8',
    },
  },
  edrag: {
    name: 'Electro Dragon',
    colors: {
      primary: '#0EA5E9',    // Electric Blue
      secondary: '#FACC15',  // Lightning Yellow
      bg: '#334155',         // Stormy Grey
      surface: '#475569',    // Thunderhead Grey
      text: '#F0F9FF',
      muted: '#CBD5E1',
    },
  },
  hog: {
    name: 'Hog Rider',
    colors: {
      primary: '#854D0E',    // Earthy Brown
      secondary: '#EC4899',  // Vibrant Pink
      bg: '#422006',         // Deep Mud
      surface: '#713F12',    // Leather Brown
      text: '#FEFCE8',       // Gold-ish White
      muted: '#D4D4D4',
    },
  },
  lava: {
    name: 'Lava Hound',
    colors: {
      primary: '#DC2626',    // Magma Red
      secondary: '#F97316',  // Lava Orange
      bg: '#0F0F0F',         // Obsidian Black
      surface: '#1C1917',    // Ash Grey
      text: '#FAFAF9',
      muted: '#A8A29E',
    },
  },
};

