import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0c0c0c',
        coal: '#141414',
        bone: '#f4f2ee',
        fog: '#e8e6e1',
        warmgray: '#a8a29c',
        silver: '#c9c7c2',
        beige: '#d8cfc0',
        accent: '#b8552f',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      letterSpacing: {
        wider2: '0.25em',
        wider3: '0.4em',
      },
      transitionTimingFunction: {
        luxe: 'cubic-bezier(0.16, 1, 0.3, 1)',
        cinema: 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
