import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [react()],
    base: '/',
    define: {
      // Prioriza VITE_API_KEY para compatibilidade local e API_KEY para o Vercel
      'process.env.API_KEY': JSON.stringify(env.API_KEY || env.VITE_API_KEY || ""),
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      chunkSizeWarningLimit: 3000,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            'vendor-utils': ['framer-motion', 'lucide-react', '@google/genai']
          }
        }
      }
    }
  };
});