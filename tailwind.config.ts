import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Avenir Next", "Trebuchet MS", "Segoe UI", "sans-serif"],
        body: ["Segoe UI", "Avenir Next", "Helvetica Neue", "sans-serif"],
      },
      colors: {
        mist: "#f6f8ff",
        ink: "#1f2440",
        aurora: {
          50: "#f4f8ff",
          100: "#dce9ff",
          200: "#b8d3ff",
          300: "#89b5ff",
          400: "#6590ff",
          500: "#4f6df5",
          600: "#4353dc",
        },
      },
      boxShadow: {
        glow: "0 18px 60px rgba(79, 109, 245, 0.18)",
        soft: "0 10px 30px rgba(31, 36, 64, 0.08)",
      },
      keyframes: {
        floaty: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
        rise: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0px)", opacity: "1" },
        },
      },
      animation: {
        floaty: "floaty 4.8s ease-in-out infinite",
        shimmer: "shimmer 2.4s linear infinite",
        rise: "rise 0.45s ease-out",
      },
    },
  },
  plugins: [],
} satisfies Config;
