/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        detective: {
          bg: '#080a0f',
          surface: '#0f141d',
          panel: '#151b26',
          border: '#202b3c',
          cyan: '#00f0ff',
          emerald: '#00ff9d',
          amber: '#ffb800',
          crimson: '#ff4757',
          muted: '#8093ad',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
