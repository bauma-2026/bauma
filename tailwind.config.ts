import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bauma: {
          bg: "#080808",
          border: "#1e1e1e",
          layer1: "#0f0f0f",
          layer2: "#141414",
          layer3: "#1a1a1a",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;