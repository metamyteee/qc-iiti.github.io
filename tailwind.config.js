/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // IBM-style palette used across Hero / About / Tiles / Projects / Team / 404
        ibm: {
          blue: '#0f62fe',
          'blue-hover': '#0043ce',
          black: '#161616',
          'gray-70': '#525252',
          'gray-30': '#c6c6c6',
          'gray-20': '#e0e0e0',
          'gray-10': '#f4f4f4',
          white: '#ffffff',
          red: '#da1e28',
        },
        // Header / Footer accent palette (from _Variables.scss)
        blueLight: '#91f8ff',
        blueDark: '#20695d',
        // Footer mixin colors (_Global.scss include)
        footerBg: '#222222',
        footerFg: '#ffffff',
        footerAccentPrimary: '#8af1ff',
        footerAccentSecondary: '#156974',
      },
      fontFamily: {
        title: ['"Cascadia Code"', 'monospace'],
        body: ['"Montserrat"', 'sans-serif'],
        plexSans: ['"IBM Plex Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        plexMono: ['"IBM Plex Mono"', 'monospace'],
      },
      screens: {
        // Header's original custom mobile breakpoint (max-width based,
        // matching the old `@media (max-width: 720px)` in Header.scss)
        headernav: { max: '720px' },
      },
      keyframes: {},
    },
  },
  plugins: [],
};
