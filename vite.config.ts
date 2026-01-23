
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Isso evita o erro "process is not defined" em bibliotecas de terceiros
    'process.env': {}
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});
