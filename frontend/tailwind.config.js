/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // New color palette
        'indigo-dye': {
          50: '#e6f0f7',
          100: '#cce1ef',
          200: '#99c3df',
          300: '#66a5cf',
          400: '#3387bf',
          500: '#004777',
          600: '#003a5f',
          700: '#002d47',
          800: '#00202f',
          900: '#001318',
        },
        'turkey-red': {
          50: '#ffe6e6',
          100: '#ffcccc',
          200: '#ff9999',
          300: '#ff6666',
          400: '#ff3333',
          500: '#a30000',
          600: '#820000',
          700: '#610000',
          800: '#410000',
          900: '#200000',
        },
        'safety-orange': {
          50: '#fff2e6',
          100: '#ffe5cc',
          200: '#ffcb99',
          300: '#ffb166',
          400: '#ff9733',
          500: '#ff7700',
          600: '#cc5f00',
          700: '#994700',
          800: '#662f00',
          900: '#331800',
        },
        'peach-yellow': {
          50: '#fdf9f0',
          100: '#fbf3e1',
          200: '#f7e7c3',
          300: '#f3dba5',
          400: '#efd28d',
          500: '#e6c77a',
          600: '#d4b56a',
          700: '#c2a35a',
          800: '#b0914a',
          900: '#9e7f3a',
        },
        'verdigris': {
          50: '#e6f9fa',
          100: '#ccf3f5',
          200: '#99e7eb',
          300: '#66dbe1',
          400: '#33cfd7',
          500: '#00afb5',
          600: '#008c91',
          700: '#00696d',
          800: '#004649',
          900: '#002324',
        },
        // Updated primary and accent colors using the new palette
        primary: {
          50: '#e6f0f7',
          100: '#cce1ef',
          200: '#99c3df',
          300: '#66a5cf',
          400: '#3387bf',
          500: '#004777',
          600: '#003a5f',
          700: '#002d47',
          800: '#00202f',
          900: '#001318',
        },
        accent: {
          50: '#fff2e6',
          100: '#ffe5cc',
          200: '#ffcb99',
          300: '#ffb166',
          400: '#ff9733',
          500: '#ff7700',
          600: '#cc5f00',
          700: '#994700',
          800: '#662f00',
          900: '#331800',
        },
        gray: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#EEEEEE',
          300: '#E0E0E0',
          400: '#BDBDBD',
          500: '#9E9E9E',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#212121',
        },
        success: '#00afb5',
        warning: '#ff7700',
        error: '#a30000',
        info: '#004777',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'h1': ['3rem', { lineHeight: '1.2', fontWeight: '800' }],
        'h2': ['2.25rem', { lineHeight: '1.2', fontWeight: '700' }],
        'h3': ['1.875rem', { lineHeight: '1.2', fontWeight: '700' }],
        'h4': ['1.5rem', { lineHeight: '1.2', fontWeight: '600' }],
        'h5': ['1.25rem', { lineHeight: '1.2', fontWeight: '600' }],
        'h6': ['1.125rem', { lineHeight: '1.2', fontWeight: '500' }],
        'body-lg': ['1.125rem', { lineHeight: '1.75', fontWeight: '400' }],
        'body-base': ['1rem', { lineHeight: '1.5', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
      },
      spacing: {
        'xs': '0.25rem',    // 4px
        'sm': '0.5rem',     // 8px
        'md': '1rem',       // 16px
        'lg': '1.5rem',     // 24px
        'xl': '2rem',       // 32px
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        'sm': '0.375rem',   // 6px
        'md': '0.5rem',     // 8px
        'lg': '0.75rem',    // 12px
      },
      ringOffsetWidth: {
        '2': '2px',
      },
      ringOffsetColor: {
        'primary': '#004777',
      },
    },
  },
  plugins: [],
}; 