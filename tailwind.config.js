/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Paleta de identidad Las Bestias
        night: {
          950: "#05070d",
          900: "#0a0f1c",
          800: "#111829",
          700: "#1a2338",
          600: "#26314b",
        },
        ash: {
          900: "#0e0e10",
          800: "#161618",
          700: "#222226",
          600: "#2e2e33",
        },
        bestia: {
          DEFAULT: "#facc15",
          light: "#fde047",
          dark: "#eab308",
        },
      },
      fontFamily: {
        display: ['"Bebas Neue"', "Impact", "Haettenschweiler", "sans-serif"],
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        metal: ['"Metal Mania"', "cursive"],
      },
      letterSpacing: {
        widest2: "0.3em",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(250,204,21,0.25), 0 20px 60px -20px rgba(250,204,21,0.25)",
        card: "0 20px 40px -24px rgba(0,0,0,0.9)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "scroll-cue": {
          "0%, 100%": { transform: "translateY(0)", opacity: "0.4" },
          "50%": { transform: "translateY(6px)", opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s ease-out both",
        shimmer: "shimmer 1.6s infinite",
        "scroll-cue": "scroll-cue 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
