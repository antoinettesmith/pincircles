import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        circle: {
          primary: "#C1121F",
          secondary: "#780000",
          accent: "#5C677D",
          surface: "#FFF7F1",
          border: "#E8D8C8",
          ink: "#241C15",
          warm: "#F3E9DC",
          gold: "#F4B942",
          mist: "#FAF4EE",
        },
      },
      fontFamily: {
        sans: ["Avenir Next", "Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
        display: ["ui-rounded", "Trebuchet MS", "Avenir Next", "Segoe UI", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        float: "float 8s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
