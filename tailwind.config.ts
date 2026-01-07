 import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        clash: ['var(--font-clash)', 'cursive'],
      },
      colors: {
        skin: {
          primary: 'var(--color-primary)',
          secondary: 'var(--color-secondary)',
          bg: 'var(--color-bg)',
          surface: 'var(--color-surface)',
          text: 'var(--color-text)',
          muted: 'var(--color-muted)',
        },
      },
      // --- NEW ANIMATIONS FOR FIRE EFFECT ---
      keyframes: {
        // Standard spin for the gradient background
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        // Rapid flicker for flame intensity
        'pulse-fast': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        }
      },
      animation: {
        'spin-slow': 'spin-slow 3s linear infinite', // Adjust time for faster/slower flames
        'pulse-fast': 'pulse-fast 0.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
export default config;
