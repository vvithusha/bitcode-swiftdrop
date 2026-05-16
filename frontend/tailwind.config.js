/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef8ff',
          100: '#d9efff',
          200: '#b8e3ff',
          300: '#87d1ff',
          400: '#4bb7ff',
          500: '#1a96ff',
          600: '#0f7be0',
          700: '#0e63b4',
          800: '#105592',
          900: '#104777'
        }
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
};
