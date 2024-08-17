import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";
import cfg from "./config";

const hex2rgb = (hex: string) => {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
}

const rgb2hex = (r: number, g: number, b: number) => {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

const adjustColorBrightness = (color: string, amount: number) => {
  const { r, g, b } = hex2rgb(color);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  if (brightness < 50 || brightness > 200) {
    // 颜色过于黑暗或过于明亮，返回反色
    return rgb2hex(255 - r, 255 - g, 255 - b);
  } else {
    const adjustedR = Math.min(255, Math.max(0, r + amount));
    const adjustedG = Math.min(255, Math.max(0, g + amount));
    const adjustedB = Math.min(255, Math.max(0, b + amount));
    return rgb2hex(adjustedR, adjustedG, adjustedB);
  }
}

const color2dark = (color: string) => {
  return adjustColorBrightness(color, -30); // Adjust the amount as needed
}

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {},
  darkMode: "class",
  plugins: [nextui({
    themes: {
      light: {
        colors: {
          primary: {
            DEFAULT: cfg.appColor != '' ? cfg.appColor : '#006FEE',
          },
        }
      },
      dark: {
        colors: {
          background: '#2b2b2b',
          primary: {
            DEFAULT: cfg.appColor != '' ? color2dark(cfg.appColor) : '#006FEE'
          },
        }
      }
    }
  }),]
};
export default config;
