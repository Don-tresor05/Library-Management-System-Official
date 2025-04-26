/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4f46e5",
        secondary: "#3b82f6",
        success: "#10b981",
        danger: "#ef4444",
        warning: "#f59e0b",
        light: "#f3f4f6",
        dark: "#1f2937",
      },
    },
  },
  plugins: [],
}

