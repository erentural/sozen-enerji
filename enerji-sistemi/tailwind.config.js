/** @type {import('tailwindcss').Config} */
module.exports = {
  // Karanlık modu aktif eden sihirli satır:
  darkMode: 'class', 
  
  // Tailwind'in hangi klasörlerdeki sınıfları tarayacağını söylüyoruz:
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}