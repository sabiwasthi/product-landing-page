import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        leaf: {
          50: "#f3fbf3",
          100: "#e1f5df",
          200: "#c5e9c1",
          300: "#98d48f",
          400: "#68b75e",
          500: "#43963a",
          600: "#31782a",
          700: "#285f25",
          800: "#234c21",
          900: "#1d3f1d"
        },
        cream: "#fffaf0",
        oat: "#e8d9bd"
      },
      boxShadow: {
        glow: "0 24px 80px rgba(49, 120, 42, 0.18)"
      },
      fontFamily: {
        display: ["Georgia", "Cambria", "Times New Roman", "serif"],
        body: ["Aptos", "Segoe UI", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
