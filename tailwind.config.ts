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
        monitor: {
          bg: '#1a1f29',
          border: '#2d3748',
          highlight: '#38b2ac',
          mood: {
            happy: '#48bb78',
            neutral: '#f6ad55',
            sad: '#f56565',
            excited: '#ed8936'
          }
        }
      },
      fontFamily: {
        mono: ['Courier New', 'monospace']
      }
    },
  },
  plugins: [],
};

export default config;
