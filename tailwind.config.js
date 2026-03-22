export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'arena-deep': '#0a0a0f',
        'arena-surface': 'rgba(255, 255, 255, 0.05)',
        'arena-accent': '#00d4ff',
        'arena-secondary': '#8b5cf6',
      },
      fontFamily: {
        'rajdhani': ['Rajdhani', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
