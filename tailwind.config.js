/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores modernos 2026 para Cuida Tu Niño
        vikingo: {
          dark: '#0F172A',
          blue: '#3B82F6',
          red: '#EF4444',
          green: '#10B981',
        }
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
}