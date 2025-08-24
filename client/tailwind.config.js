/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // all directories and extensions will correspond to your Nuxt config
    "app/components/**/*.{vue,js,jsx,mjs,ts,tsx}",
    "app/layouts/**/*.{vue,js,jsx,mjs,ts,tsx}",
    "app/pages/**/*.{vue,js,jsx,mjs,ts,tsx}",
    "app/plugins/**/*.{js,ts,mjs}",
    "app/composables/**/*.{js,ts,mjs}",
    "app/utils/**/*.{js,ts,mjs}",
    "app/assets/**/*.{js,ts,mjs,css}",
    "app/{A,a}pp.{vue,js,jsx,mjs,ts,tsx}",
    "app/{E,e}rror.{vue,js,jsx,mjs,ts,tsx}",
    "app/app.config.{js,ts,mjs}",
    "app/app/spa-loading-template.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#16A34A",     // green-600
        secondary: "#FACC15",   // yellow-400
        accent: "#3B82F6",      // blue-500
        warning: "#FFC107",     // amber
        background: "#F5F5F5",  // neutral background
        text: "#1F2937",        // gray-800
        lightText: "#FFFFFF",   // for dark backgrounds
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      screens: {
        xs: "480px",   // extra small
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "2rem",
          lg: "4rem",
        },
      },
    },
  },
  plugins: [],
};
