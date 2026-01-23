
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Fix: Removed 'process.env': {} to prevent overwriting injected environment variables like API_KEY.
    // Polyfill for process is handled in index.tsx to maintain compatibility.
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});
