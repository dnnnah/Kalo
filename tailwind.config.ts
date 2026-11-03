import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    screens: {
      sm: '390px',   // Mobile-first (iPhone / dispositivos en consulta)
      md: '768px',   // Tablet (iPad)
      lg: '1024px',  // Laptop / Tablet horizontal
      xl: '1280px',  // Escritorio clínico
      '2xl': '1536px',
    },
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Text"',
          '"IBM Plex Sans"',
          'system-ui',
          'sans-serif',
        ],
        mono: [
          '"IBM Plex Mono"',
          '"SF Mono"',
          '"Fira Code"',
          'monospace',
        ],
      },
      colors: {
        background: {
          DEFAULT: '#F2F2F7',
          surface: '#FFFFFF',
          elevated: '#F9F9F9',
        },
        border: {
          DEFAULT: '#E5E5EA',
          subtle: '#F2F2F7',
          strong: '#D1D1D6',
        },
        text: {
          primary: '#1C1C1E',
          secondary: '#48484A',
          tertiary: '#636366',
          disabled: '#AEAEB2',
        },
        primary: {
          DEFAULT: '#007AFF',
          hover: '#0062CC',
          active: '#004A99',
          subtle: '#EBF3FF',
          'subtle-fg': '#004A99',
          foreground: '#FFFFFF',
        },
        semaforo: {
          verde: {
            DEFAULT: '#34C759',
            bg: '#EDFBF1',
            text: '#1D7833',
            border: '#A9EBB9',
          },
          ambar: {
            DEFAULT: '#FF9500',
            bg: '#FFF8EB',
            text: '#995900',
            border: '#FFDB8A',
          },
          rojo: {
            DEFAULT: '#FF3B30',
            bg: '#FFF0EF',
            text: '#99231C',
            border: '#FFBCBA',
          },
        },
        specialty: {
          purple: {
            DEFAULT: '#7C3AED',
            bg: '#F5F0FF',
          },
          teal: {
            DEFAULT: '#1A9B8A',
            bg: '#EDFCFA',
          },
          emerald: {
            DEFAULT: '#28A046',
            bg: '#EDFBF1',
          },
          amber: {
            DEFAULT: '#FF9500',
            bg: '#FFF8EB',
          },
        },
      },
      borderRadius: {
        input: '10px',
        card: '14px',
        panel: '20px',
        pill: '9999px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0, 0, 0, 0.08)',
        elevated: '0 4px 12px rgba(0, 0, 0, 0.08)',
        float: '0 8px 24px rgba(0, 0, 0, 0.12)',
      },
      minHeight: {
        touch: '44px',
      },
      minWidth: {
        touch: '44px',
      },
    },
  },
  plugins: [],
}

export default config
