/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0d86f1",
        background: "#0a0e18",
        grey: "#c6c6c6",
        yellow: "#ffea00",
      },
    },
  },
  plugins: [],
};
