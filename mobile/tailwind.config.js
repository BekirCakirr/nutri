/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E8F5EC',
          100: '#C8E6CF',
          500: '#2D8C4E',
          700: '#1A5C37',
          900: '#0F3D23',
          main: '#1A5C37',
        },
        secondary: {
          50: '#E0F7F5',
          200: '#80E3D9',
          500: '#26AFA5',
          main: '#4ECDC4',
        },
      }
    },
  },
  plugins: [],
}
