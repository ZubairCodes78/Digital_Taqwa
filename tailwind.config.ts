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
        ivory: {
          DEFAULT: "#F6F4ED",
          light: "#FAF9F5",
          dark: "#EDE9DE",
        },
        forest: {
          DEFAULT: "#19372D",
          deep: "#11261F",
          light: "#23493C",
          muted: "rgba(25, 55, 45, 0.08)",
        },
        charcoal: {
          DEFAULT: "#20231F",
          muted: "#555A52",
          subtle: "#858A81",
        },
        gold: {
          DEFAULT: "#B79A62",
          light: "#D8C296",
          dark: "#967A44",
          muted: "rgba(183, 154, 98, 0.15)",
        },
        sage: {
          DEFAULT: "#DDE4D9",
          light: "#EBF0E8",
          dark: "#C5D0BF",
        },
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "'Inter'", "-apple-system", "sans-serif"],
        display: ["'Outfit'", "'Plus Jakarta Sans'", "sans-serif"],
        serif: ["'Outfit'", "'Plus Jakarta Sans'", "sans-serif"], // Replaced Times New Roman / Garamond with sleek modern display sans
        mono: ["ui-monospace", "SFMono-Regular", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
