/** @type {import("tailwindcss").Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Roboto", "Arial", "sans-serif"], 
      },
      colors: {
        "official-blue-light": "#e6f2ff", 
        "official-blue": "#0056b3", 
        "official-blue-dark": "#003366", 
      },
    },
  },
  plugins: [],
};