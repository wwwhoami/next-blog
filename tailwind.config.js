const colors = require('tailwindcss/colors')

const round = (num) =>
  num
    .toFixed(7)
    .replace(/(\.[0-9]+?)0+$/, '$1')
    .replace(/\.0$/, '')
const rem = (px) => `${round(px / 16)}rem`
const em = (px, base) => `${round(px / base)}em`


module.exports = {
  content: [
    // "./pages/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            'h1 a, h2 a, h3 a, h4 a, h5 a, h6 a': {
              textDecoration: 'none !important',
              color: 'var(--tw-prose-headings) !important',
              fontWeight: 700,
              '&:hover': {
                '&::before': {
                  content: 'url(/link.svg)',
                  width: '24px',
                  height: '24px',
                  backgroundSize: 'cover',
                  display: 'block',
                  position: 'absolute',
                  marginLeft: '-1.75ch',
                  paddingRight: '0.2ch',
                },
              },
            },
          },
        }
      })
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}