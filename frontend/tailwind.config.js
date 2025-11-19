/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors - Orange to Yellow gradient
        orange: {
          primary: '#FF6B35',
          light: '#FF8C5A',
          DEFAULT: '#FF6B35',
        },
        yellow: {
          primary: '#FFD23F',
          light: '#FFE066',
          DEFAULT: '#FFD23F',
        },
        // Dark theme
        dark: {
          bg: '#0F0F0F',
          card: '#1A1A1A',
          border: '#2D2D2D',
        },
        // Purple accents
        purple: {
          primary: '#8B5CF6',
          light: '#A78BFA',
          DEFAULT: '#8B5CF6',
        },
        // Green accents
        green: {
          primary: '#10B981',
          light: '#34D399',
          DEFAULT: '#10B981',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #FF6B35 0%, #FFD23F 100%)',
        'gradient-purple': 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
        'gradient-green': 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
        'gradient-orange-yellow': 'linear-gradient(135deg, #FF6B35 0%, #FFD23F 100%)',
      },
      borderRadius: {
        'card': '12px',
        'button': '8px',
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'elevated': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}

