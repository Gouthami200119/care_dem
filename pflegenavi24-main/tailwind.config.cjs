module.exports = {
  // Scan all files in the project root (including top-level .tsx/.ts files and components)
  content: ['./index.html', './**/*.{js,ts,jsx,tsx,html}'],
  theme: {
    extend: {
      colors: {
        lilac: {
          50: '#fbf7ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87'
        },
        sunny: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          800: '#854d0e',
          900: '#713f12'
        }
      },
      fontSize: {
        base: '1.125rem',
        lg: '1.25rem',
        xl: '1.5rem',
        '2xl': '1.875rem',
        '3xl': '2.25rem',
        '4xl': '3rem'
      }
    }
  },
  plugins: []
};