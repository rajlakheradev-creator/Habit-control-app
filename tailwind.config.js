/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // <--- This is the magic line that fixes your UI
  ],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 10s linear infinite',
      },
      fontFamily: {
        mono: ['var(--font-roboto-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
};