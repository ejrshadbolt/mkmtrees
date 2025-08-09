/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': 'var(--brand-blue)',
        'brand-dark-blue': 'var(--brand-dark-blue)',
        'brand-orange': 'var(--brand-orange)',
      },
    },
  },
  plugins: [],
} 