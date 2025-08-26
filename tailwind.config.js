/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        main: "#1F1F27",
        side: "#121217",
        side1: "#1B1B21",
        red1: "#271F1F",
        green1: "#24271F",
        purple1: "#9137FF",
      },
      fontFamily: {
        sans: ["'Space Grotesk'", "sans-serif"],
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
    require('@tailwindcss/typography') 
  ],
};