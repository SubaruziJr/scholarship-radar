import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FBF8F1",
        paper: "#FFFFFF",
        ink: {
          DEFAULT: "#15231C",
          soft: "#4A5A50",
          faint: "#8A9990",
        },
        brand: {
          DEFAULT: "#16794A", // deep emerald
          dark: "#0F5535",
          light: "#E4F2EA",
        },
        lime: {
          DEFAULT: "#C6F135", // energetic accent / match
          dark: "#A6CF1F",
          soft: "#F1FAD2",
        },
        coral: {
          DEFAULT: "#FF6B4A", // deadlines / urgency
          dark: "#E14E2E",
          soft: "#FFE6DF",
        },
        sky: {
          DEFAULT: "#3B6FE0", // info / status
          soft: "#E4ECFB",
        },
        line: "#E7E2D6", // hairline borders on cream
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(21,35,28,0.04), 0 8px 24px -12px rgba(21,35,28,0.12)",
        lift: "0 12px 40px -16px rgba(21,35,28,0.25)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        sweep: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        ping2: {
          "0%": { transform: "scale(0.6)", opacity: "0.6" },
          "100%": { transform: "scale(2.2)", opacity: "0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.22,1,0.36,1) both",
        sweep: "sweep 4s linear infinite",
        ping2: "ping2 2.4s cubic-bezier(0,0,0.2,1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
