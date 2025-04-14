/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E3A8A', // Blue
        secondary: '#FBBF24', // Yellow
        accent: '#F472B6', // Pink
        neutral: '#374151', // Gray
        'base-100': '#FFFFFF', // White
    },
  },
  plugins: [],
}

}