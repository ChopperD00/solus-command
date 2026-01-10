import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void: {
          base: '#0a0a0f',
          50: '#0f0f14',
          100: '#14141a',
          200: '#1a1a22',
          300: '#22222c',
          400: '#2c2c38',
        },
        claude: '#d97706',
        gemini: '#3b82f6',
        perplexity: '#8b5cf6',
        krea: '#ec4899',
        runway: '#10b981',
        elevenlabs: '#06b6d4',
        heygen: '#f43f5e',
        solus: '#d97706',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['Instrument Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
