/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ebenezer: {
          green: '#10B981',
          neon: '#00FF66',
          lime: '#22C55E',
          dark: '#0A0C10',
          card: '#12151C',
          surface: '#181C24',
          border: '#252B37',
          muted: '#8B949E',
        }
      },
      boxShadow: {
        'glow-green': '0 0 25px -5px rgba(0, 255, 102, 0.35)',
        'glow-green-lg': '0 0 40px -5px rgba(0, 255, 102, 0.45)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
};
