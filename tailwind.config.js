/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  future: {
    hoverOnlyWhenSupported: true,
  },
  // パフォーマンス最適化
  purge: {
    enabled: true,
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    options: {
      safelist: [],
      blocklist: [],
      keyframes: true,
      fontFace: true
    },
  }
}