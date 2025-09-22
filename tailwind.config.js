/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // 👈 enables class-based dark mode
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          light: "#e0f2fe",  // light sky blue
          DEFAULT: "#2563eb", // primary blue
          dark: "#1e40af",    // deep navy blue
        },
      },
    },
  },
  plugins: [],
};
