/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Professional Deep Navy (primary brand color)
        primary: {
          DEFAULT: '#1e3a5f',
          hover: '#16304f',
          pressed: '#0f2540',
          light: '#e8edf5',
          dark: '#0f2540',
          50: '#e8edf5',
          100: '#c5d3e8',
          200: '#9fb8d9',
          300: '#789cca',
          400: '#5a86be',
          500: '#1e3a5f',
          600: '#16304f',
          700: '#0f2540',
          800: '#091a30',
          900: '#040e1f',
        },
        // Classic Academic Gold (secondary accent — Ivy League)
        secondary: {
          DEFAULT: '#c9a227',
          hover: '#a88520',
          light: '#fdf6dc',
          dark: '#7a5f0f',
          50: '#fefce8',
          100: '#fdf6dc',
          200: '#faedb0',
          300: '#f5df78',
          400: '#eecb40',
          500: '#c9a227',
          600: '#a88520',
          700: '#7a5f0f',
          800: '#5a4408',
          900: '#3d2e04',
        },
        // Warm Amber (premium accent — keep gold feel)
        accent: {
          DEFAULT: '#f59e0b',
          hover: '#d97706',
          light: '#fef3c7',
          dark: '#92400e',
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        // Success (professional green)
        success: {
          DEFAULT: '#10B981',
          hover: '#059669',
          light: '#D1FAE5'
        },
        // Warning (amber)
        warning: {
          DEFAULT: '#F59E0B',
          hover: '#D97706',
          light: '#FEF3C7'
        },
        // Error (red)
        error: {
          DEFAULT: '#EF4444',
          hover: '#DC2626',
          light: '#FEE2E2'
        },
        // Cyan (supporting accent)
        cyan: {
          DEFAULT: '#06b6d4',
          hover: '#0891b2',
          light: '#cffafe'
        },
        // Academic highlights
        magic: {
          blue: '#1e3a5f',
          purple: '#c9a227',
          pink: '#eecb40'
        },
        // Neutral grays
        gray: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.5' }],
        'sm': ['0.875rem', { lineHeight: '1.5' }],
        'base': ['1rem', { lineHeight: '1.6' }],
        'lg': ['1.125rem', { lineHeight: '1.6' }],
        'xl': ['1.25rem', { lineHeight: '1.6' }],
        '2xl': ['1.5rem', { lineHeight: '1.4' }],
        '3xl': ['1.875rem', { lineHeight: '1.3' }],
        '4xl': ['2.25rem', { lineHeight: '1.2' }],
        '5xl': ['3rem', { lineHeight: '1.1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        '4xl': '2.5rem'
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'medium': '0 8px 30px rgba(0, 0, 0, 0.12)',
        'strong': '0 20px 60px rgba(0, 0, 0, 0.15)',
        'glow': '0 0 20px rgba(255, 215, 0, 0.5)',
        'glow-lg': '0 0 40px rgba(255, 215, 0, 0.6)',
        'magic': '0 10px 40px -10px rgba(79, 70, 229, 0.3)',
        'magic-lg': '0 20px 60px -15px rgba(79, 70, 229, 0.4)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 30px rgba(0, 0, 0, 0.12)'
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-left': 'slideLeft 0.3s ease-out',
        'slide-right': 'slideRight 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'bounce-in': 'bounceIn 0.6s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'gradient': 'gradient 3s ease infinite',
        'blob': 'blob 7s infinite',
        'sparkle': 'sparkle 2s ease-in-out infinite',
        'bounce-slow': 'bounce 3s infinite',
        'scroll': 'scroll 30s linear infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        sparkle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(1.1)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' }
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        blob: {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
        },
        scroll: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-50%)' }
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.1))',
        'glass-dark': 'linear-gradient(135deg, rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.1))',
        'gradient-magic': 'linear-gradient(135deg, #1e3a5f 0%, #c9a227 100%)',
        'gradient-disney': 'linear-gradient(135deg, #1e3a5f 0%, #c9a227 100%)',
        'gradient-gold': 'linear-gradient(135deg, #c9a227 0%, #a88520 100%)',
        'gradient-rainbow': 'linear-gradient(90deg, #1e3a5f, #c9a227, #eecb40, #f5df78, #faedb0)',
        'shimmer': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)'
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
