/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: {
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
          secondary: {
            50: '#f5f3ff',
            100: '#ede9fe',
            200: '#ddd6fe',
            300: '#c4b5fd',
            400: '#a78bfa',
            500: '#8b5cf6',
            600: '#7c3aed',
            700: '#6d28d9',
            800: '#5b21b6',
            900: '#4c1d95',
          },
          success: {
            50: '#f0fdf4',
            500: '#22c55e',
            700: '#15803d',
          },
          error: {
            50: '#fef2f2',
            500: '#ef4444',
            700: '#b91c1c',
          },
        },
        fontFamily: {
          sans: ['Roboto', 'sans-serif'],
          mono: ['Roboto Mono', 'monospace'],
        },
        animation: {
          'cursor-blink': 'blink 1s step-end infinite',
        },
        keyframes: {
          blink: {
            '0%, 100%': { opacity: 1 },
            '50%': { opacity: 0 },
          },
        },
      },
    },
    plugins: [],
  }