/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0B0B0B",
        secondary: "#F5F5F0",
        accent: "#C8FF00",
        "accent-hover": "#B2E600",
        charcoal: "#171717",
        divider: "#D9D9D2",
      },
      fontFamily: {
        syne: ['Space Grotesk', 'sans-serif'],
        heading: ['Space Grotesk', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
