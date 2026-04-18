/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Tailwind's built-in teal palette is used as-is via `teal-*` utilities.
        // Sage: a muted gray-green for backgrounds, borders, and secondary UI.
        sage: {
          50:  '#f4f8f2',
          100: '#e6ede3',
          200: '#cddaca',
          300: '#a8bfa4',
          400: '#7e9c79',
          500: '#637d5e',
          600: '#4e634a',
          700: '#3d4f3a',
          800: '#2a3328',
          900: '#191e18',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
