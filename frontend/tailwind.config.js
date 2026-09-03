/** @type {import('tailwindcss').Config} */
// Design direction: an academic registrar's office — the navy + gold
// pairing echoes university seals and letterhead rather than reaching
// for a generic SaaS-dashboard indigo. Ink is used for structure
// (sidebar, headers, body text); gold is spent sparingly, only on
// active states and primary actions, so it stays meaningful.
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#EEF1F5',
          100: '#D7DEE7',
          200: '#AFC0D0',
          300: '#7E97B0',
          400: '#4F6C8C',
          500: '#35597F',
          600: '#274465',
          700: '#1E3A5A',
          800: '#162C46',
          900: '#0F2135',
        },
        gold: {
          50: '#FBF4E4',
          100: '#F4E2B8',
          200: '#EBCB84',
          300: '#DEB158',
          400: '#C89B3C',
          500: '#B0842E',
          600: '#8C6823',
          700: '#684D1A',
        },
        paper: '#F6F4EF',
      },
      fontFamily: {
        // A characterful serif reserved for the wordmark and page
        // titles; everything functional (forms, tables, nav) stays
        // in the sans face so data-heavy screens remain easy to scan.
        display: ['"Fraunces"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
