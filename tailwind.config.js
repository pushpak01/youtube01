/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        sonic: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        neon: {
          blue: '#00f3ff',
          purple: '#b967ff',
          pink: '#ff2d95',
          green: '#00ff88',
          yellow: '#ffd700',
        },
        dark: {
          950: '#0a0a0f',
          900: '#0f0f23',
          800: '#1a1a2e',
          700: '#16213e',
          600: '#1e293b',
        }
      },
      animation: {
        'gradient-flow': 'gradientFlow 8s ease infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float-3d': 'float3d 6s ease-in-out infinite',
        'spin-3d': 'spin3d 4s linear infinite',
        'bounce-soft': 'bounceSoft 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      backdropBlur: {
        xs: '2px',
        '4xl': '40px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'sonic-rainbow': 'linear-gradient(45deg, #ff0080, #ff8c00, #40e0d0, #20b2aa, #9370db, #ff0080)',
        'neon-gradient': 'linear-gradient(135deg, #00f3ff 0%, #b967ff 50%, #ff2d95 100%)',
        'cyber-gradient': 'linear-gradient(135deg, #00ff88 0%, #00f5ff 50%, #ffd700 100%)',
        'galaxy': 'radial-gradient(circle at 50% 50%, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
        'glass-morphism': 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
        'hologram-grid': 'linear-gradient(rgba(14, 165, 233, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(14, 165, 233, 0.1) 1px, transparent 1px)',
      },
      boxShadow: {
        'neon-blue': '0 0 5px #00f3ff, 0 0 10px #00f3ff, 0 0 15px #00f3ff, 0 0 20px #00f3ff',
        'neon-purple': '0 0 5px #b967ff, 0 0 10px #b967ff, 0 0 15px #b967ff, 0 0 20px #b967ff',
        'neon-pink': '0 0 5px #ff2d95, 0 0 10px #ff2d95, 0 0 15px #ff2d95, 0 0 20px #ff2d95',
        'neon-green': '0 0 5px #00ff88, 0 0 10px #00ff88, 0 0 15px #00ff88, 0 0 20px #00ff88',
        'glow-multicolor': '0 0 10px #00f3ff, 0 0 20px #b967ff, 0 0 30px #ff2d95',
        'inner-neon': 'inset 0 0 20px rgba(0, 243, 255, 0.3), inset 0 0 40px rgba(185, 103, 255, 0.2)',
        'floating': '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 80px rgba(14, 165, 233, 0.2)',
      },
      keyframes: {
        gradientFlow: {
          '0%, 100%': {
            'background-position': '0% 50%',
            'background-size': '200% 200%'
          },
          '50%': {
            'background-position': '100% 50%',
            'background-size': '200% 200%'
          },
        },
        pulseGlow: {
          '0%, 100%': {
            'box-shadow': '0 0 5px theme(colors.neon.blue), 0 0 10px theme(colors.neon.blue)'
          },
          '50%': {
            'box-shadow': '0 0 20px theme(colors.neon.blue), 0 0 40px theme(colors.neon.blue), 0 0 60px theme(colors.neon.purple)'
          },
        },
        float3d: {
          '0%, 100%': {
            'transform': 'translate3d(0, 0, 0) rotateX(0) rotateY(0)',
            'filter': 'drop-shadow(0 5px 15px rgba(0, 243, 255, 0.3))'
          },
          '33%': {
            'transform': 'translate3d(10px, -15px, 20px) rotateX(5deg) rotateY(5deg)',
            'filter': 'drop-shadow(0 15px 25px rgba(185, 103, 255, 0.4))'
          },
          '66%': {
            'transform': 'translate3d(-5px, 10px, 30px) rotateX(-3deg) rotateY(-3deg)',
            'filter': 'drop-shadow(0 10px 20px rgba(255, 45, 149, 0.3))'
          },
        },
        spin3d: {
          '0%': { 'transform': 'rotate3d(1, 1, 1, 0deg)' },
          '100%': { 'transform': 'rotate3d(1, 1, 1, 360deg)' },
        },
        bounceSoft: {
          '0%, 100%': {
            'transform': 'translateY(0)',
            'animation-timing-function': 'cubic-bezier(0.8, 0, 1, 1)'
          },
          '50%': {
            'transform': 'translateY(-15%)',
            'animation-timing-function': 'cubic-bezier(0, 0, 0.2, 1)'
          },
        },
        float: {
          '0%, 100%': {
            'transform': 'translateY(0px)'
          },
          '50%': {
            'transform': 'translateY(-10px)'
          },
        },
      },
      blur: {
        xs: '2px',
        '4xl': '40px',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      fontFamily: {
        'sonic': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
        'cyber': ['Orbitron', 'monospace'],
      },
      screens: {
        'xs': '475px',
        '3xl': '1600px',
      },
      dropShadow: {
        'neon': '0 0 5px currentColor, 0 0 10px currentColor',
        'glow': '0 0 10px rgba(14, 165, 233, 0.5)',
      },
    },
  },
  plugins: [
    function({ addUtilities, addComponents, theme }) {
      const newUtilities = {
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': { display: 'none' }
        },
        '.scrollbar-glow': {
          'scrollbar-width': 'thin',
          'scrollbar-color': theme('colors.neon.blue') + ' transparent',
          '&::-webkit-scrollbar': { width: '8px' },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme('colors.neon.blue'),
            borderRadius: '20px',
            boxShadow: '0 0 10px ' + theme('colors.neon.blue')
          }
        },
        '.text-neon': {
          'color': theme('colors.neon.blue'),
          'text-shadow': '0 0 5px currentColor, 0 0 10px currentColor',
        },
        '.text-gradient-rainbow': {
          'background': 'linear-gradient(45deg, #ff0080, #ff8c00, #40e0d0, #20b2aa, #9370db, #ff0080)',
          'background-size': '400% 400%',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
          'animation': 'gradientFlow 8s ease infinite',
        },
        '.glass-morphism': {
          'background': 'rgba(255, 255, 255, 0.1)',
          'backdrop-filter': 'blur(20px) saturate(180%)',
          'border': '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.neon-border': {
          'border': '2px solid ' + theme('colors.neon.blue'),
          'box-shadow': '0 0 10px ' + theme('colors.neon.blue') + ', inset 0 0 10px ' + theme('colors.neon.blue'),
        },
        '.particle-bg': {
          'position': 'relative',
          'overflow': 'hidden',
          '&::before': {
            'content': '""',
            'position': 'absolute',
            'top': '0',
            'left': '0',
            'width': '100%',
            'height': '100%',
            'background-image': 'radial-gradient(circle at 20% 50%, rgba(0, 243, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(185, 103, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(255, 45, 149, 0.1) 0%, transparent 50%)',
          }
        },
        '.cyber-grid': {
          'background-image': 'linear-gradient(rgba(0, 243, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 243, 255, 0.1) 1px, transparent 1px)',
          'background-size': '50px 50px',
        },
      }

      const components = {
        '.card-holographic': {
          'background': 'linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, rgba(139, 92, 246, 0.1) 50%, rgba(236, 72, 153, 0.1) 100%)',
          'backdropFilter': 'blur(20px)',
          'border': '1px solid rgba(255, 255, 255, 0.1)',
          'borderRadius': theme('borderRadius.2xl'),
          'boxShadow': '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 50px rgba(14, 165, 233, 0.2)',
          'position': 'relative',
          'overflow': 'hidden',
          'transition': 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            'transform': 'translateY(-10px) scale(1.02)',
            'boxShadow': '0 35px 60px -12px rgba(0, 0, 0, 0.3), 0 0 80px rgba(139, 92, 246, 0.3)',
          },
        },
      }

      addUtilities(newUtilities, ['responsive', 'hover'])
      addComponents(components)
    }
  ],
}