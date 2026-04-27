/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        apuf: {
          blue:       '#1a3fa0',
          'blue-dark':'#142f7a',
          'blue-mid': '#1e50c8',
          green:      '#2e7d32',
          'green-light':'#43a047',
          orange:     '#e65100',
          'orange-light':'#ef6c00',
          cream:      '#f9f7f2',
          muted:      '#5a6a7a',
        }
      },
      fontFamily: {
        sans:    ['Nunito', 'sans-serif'],
        display: ['"Playfair Display"', 'serif'],
      },
      boxShadow: {
        card: '0 2px 12px rgba(0,0,0,0.08)',
        lift: '0 6px 24px rgba(0,0,0,0.14)',
      },
      borderRadius: {
        xl2: '16px',
      }
    },
  },
  plugins: [],
}
