import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        beam: {
          white: "#f5f5f5",
          gray: "#d4d4d8",
          ink: "#08090b",
          panel: "#101216",
          border: "#242832",
        },
      },
      fontFamily: {
        sans: ["Inter", "Arial", "sans-serif"],
      },
    },
  },
};

export default config;
