/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        game: {
          bg:           '#050811',
          surface:      '#0c1020',
          elevated:     '#141c30',
          border:       '#1e2d4a',
          gold:         '#d4af37',
          'gold-dim':   '#7a6318',
          'gold-bright':'#f5d66e',
          crimson:      '#7a1515',
          'crimson-bright': '#c0392b',
          blue:         '#1a4a8b',
          'blue-bright':'#3498db',
          ice:          '#74b9ff',
          text:         '#e8d5b0',
          'text-dim':   '#7a6a52',
          'text-muted': '#4a3f30',
        },
      },
      fontFamily: {
        'cinzel':     ['"Cinzel"', 'Georgia', 'serif'],
        'noto':       ['"Noto Serif SC"', 'serif'],
        'mono':       ['"JetBrains Mono"', '"Courier New"', 'monospace'],
      },
      keyframes: {
        capture: {
          '0%':   { transform: 'scale(1.15)', filter: 'brightness(2)' },
          '100%': { transform: 'scale(1)',    filter: 'brightness(1)' },
        },
        'card-place': {
          '0%':   { transform: 'scale(0) rotate(-15deg)', opacity: '0' },
          '75%':  { transform: 'scale(1.08) rotate(3deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)',   opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-5px)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.6' },
          '50%':      { opacity: '1' },
        },
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
      animation: {
        'capture':    'capture 0.35s ease-out',
        'card-place': 'card-place 0.25s cubic-bezier(0.34,1.56,0.64,1)',
        'float':      'float 4s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'fade-up':    'fade-up 0.4s ease-out',
        'shimmer':    'shimmer 2.5s linear infinite',
      },
      backgroundImage: {
        'card-fire':  'linear-gradient(145deg, #4a1008 0%, #2a0805 100%)',
        'card-water': 'linear-gradient(145deg, #0a2a4a 0%, #051528 100%)',
        'card-wind':  'linear-gradient(145deg, #0a3a1a 0%, #052010 100%)',
        'card-earth': 'linear-gradient(145deg, #3a2005 0%, #201205 100%)',
        'card-ice':   'linear-gradient(145deg, #0a2a4a 0%, #051830 100%)',
        'card-none':  'linear-gradient(145deg, #141e35 0%, #0a1020 100%)',
      },
    },
  },
  plugins: [],
}
