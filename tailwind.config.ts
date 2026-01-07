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
        // 'sans' defaults to Inter
        sans: ['var(--font-inter)', 'sans-serif'],
        // 'clash' uses our new font
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
    },
  },
  plugins: [],
};
export default config;
