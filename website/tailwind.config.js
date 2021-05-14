const colors = require('tailwindcss/colors');

module.exports = {
  purge: ['./src/**/*.html', './src/**/*.js', './src/**/*.tsx'],
  darkMode: false, // or 'media' or 'class'
  prefix: 'tw-',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
      },
    },
    extend: {
      colors: {
        'light-blue': colors.lightBlue,
      },
      lineHeight: {
        '12/10': '1.2',
        '14/10': '1.4',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
