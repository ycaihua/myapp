/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        accent: '#B8492C',
        wood: {
          50:  '#fdf8f3',
          100: '#f5ede0',
          200: '#e8d5bc',
          700: '#8b6245',
        },
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
