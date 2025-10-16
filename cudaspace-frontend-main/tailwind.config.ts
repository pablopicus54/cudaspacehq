import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        "blue-primary": "#3257D9",
        "green-primary": "#1BB68A",
        "green-light": "#E8F8F3",
        "gray-light": "#4B5563",
        primary: '#3257D9',
        'text-primary': '#101010',
      },
      backgroundImage: {
        'btn-primary':
          'linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%), #3257D9',
      },
      container: {
        screens: {
          DEFAULT: '1290px',
        },
        center: true,
        padding: '1.2rem',
      },
      screens: {
        xs: '540px',
      },
    },
  },

  plugins: [],
};

export default config;
