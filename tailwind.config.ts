import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-body)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-heading)", "Space Grotesk", "sans-serif"],
      },
      colors: {
        brand: {
          sky: "var(--color-sky)",
          rose: "var(--color-rose)",
          lime: "var(--color-lime)",
          lavender: "var(--color-lavender)",
          ink: "var(--color-ink)",
          paper: "var(--color-paper)",
        },
      },
    },
  },
  plugins: [],
};
export default config;
