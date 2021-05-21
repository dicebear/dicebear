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
      backgroundImage: (theme) => ({
        'transparent-pattern':
          'url(data:image/svg+xml;utf8,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20fill%3D%22%23E5E5E5%22%20d%3D%22M0%200h10v10H0zM10%2010h10v10H10z%22%2F%3E%3C%2Fsvg%3E)',
      }),
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
