/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'tafach-orange': '#FF5733',
        'tafach-green': '#2ECC71',
        'tafach-dark': '#1A1A1A',
        'tafach-light': '#F9F9F9',
        'tafach-muted': '#7F8C8D',
        'tafach-border': '#E2E8F0',
        'tafach-error': '#DC2626',
      },
      spacing: {
        'grid-1': '8px',
        'grid-2': '16px',
        'grid-3': '24px',
        'grid-4': '32px',
      },
    },
  },
  plugins: [],
};
