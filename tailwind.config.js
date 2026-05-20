/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Source Han Serif CN"', '"Noto Serif SC"', 'serif'],
      },
      colors: {
        'traditional-bg': '#f5f5f5',
      },
    },
  },
  plugins: [],
}
