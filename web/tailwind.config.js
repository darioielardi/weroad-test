const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
    },
    colors: {
      brand: {
        DEFAULT: '#FF4658',
        50: '#FFFEFE',
        100: '#FFE9EB',
        200: '#FFC0C6',
        300: '#FF98A2',
        400: '#FF6F7D',
        500: '#FF4658',
        600: '#FF0E25',
        700: '#D50015',
        800: '#9D000F',
        900: '#65000A',
      },
      ...defaultTheme.colors,
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
