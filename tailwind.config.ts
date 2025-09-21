import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          ember: '#FF6A3D',
          mint: '#27D7A1',
          charcoal: '#111214',
          mist: '#E9EEF3',
        },
      },
      borderRadius: {
        xl: '20px',
      },
      boxShadow: {
        elev1: '0 8px 24px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}
export default config