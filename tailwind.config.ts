import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";
import cfg from "./config";

const color2dark = (color: string) => {
  const amount = -50
  const bigint = parseInt(color.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  const newR = Math.max(Math.min(r + amount, 255), 0);
  const newG = Math.max(Math.min(g + amount, 255), 0);
  const newB = Math.max(Math.min(b + amount, 255), 0);

  return `#${((1 << 24) + (newR << 16) + (newG << 8) + newB).toString(16).slice(1)}`
}

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  darkMode: "class",
  plugins: [nextui({
    themes: {
      light: {
        colors: {
          primary: {
            DEFAULT: cfg.color != '' ? cfg.color : '#006FEE',
          },
        }
      },
      dark: {
        colors: {
          background: '#2b2b2b',
          primary: {
            DEFAULT: cfg.color != '' ? color2dark(cfg.color) : '#006FEE'
          },
        }
      }
    }
  }),]
};
export default config;
