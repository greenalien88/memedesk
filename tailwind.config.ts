import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        'neon-green': '#00ff88',
        'ink-black': '#0a0a0a'
      }
    }
  }
};

export default config;
