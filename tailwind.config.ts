import type { Config } from 'tailwindcss'

export default {
  content: ['./src/popup/**/*.{ts,tsx,html}'],
  theme: {
    extend: {
      colors: {
        gray: {
          750: '#1a2236',
        },
      },
      keyframes: {
        flashNew: {
          '0%': { backgroundColor: 'rgb(234 179 8 / 0.25)' },
          '100%': { backgroundColor: 'transparent' },
        },
      },
      animation: {
        flashNew: 'flashNew 3s ease-out forwards',
      },
    },
  },
  plugins: [],
} satisfies Config
