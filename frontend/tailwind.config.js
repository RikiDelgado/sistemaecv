/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sand: "#F5E6C8",
        oasis: "#3A7D44",
        desert: "#C2A46D",
        sunset: "#D97706",
      },
    },
  },
  plugins: [],
};
