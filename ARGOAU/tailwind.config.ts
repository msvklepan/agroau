import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'sans-serif'],
      },
      colors: {
        'bg-app':        '#EDEDEB',
        'bg-card':       '#FFFFFF',
        'bg-card-hover': '#F7F7F5',
        'bg-surface':    '#F1F1EF',
        'accent-lime':   '#C5FF4A',
        'accent-blue':   '#6EC6FF',
        'accent-orange': '#FF8C42',
        'text-primary':  '#1A1A1A',
        'text-secondary':'#6B6B68',
        'text-hint':     '#A0A09D',
      },
      borderRadius: {
        card:   '20px',
        badge:  '20px',
        inner:  '14px',
        sm:     '10px',
      },
      boxShadow: {
        card:  '0 2px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
        hover: '0 8px 24px rgba(0,0,0,0.10)',
      },
    },
  },
  plugins: [],
}

export default config
