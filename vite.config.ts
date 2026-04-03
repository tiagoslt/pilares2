import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    __APP_TITLE__: JSON.stringify(process.env.VITE_APP_TITLE || 'Chat com IA'),
    __APP_SUBTITLE__: JSON.stringify(process.env.VITE_APP_SUBTITLE || 'Assistente inteligente do Projeto Pilares 2'),
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
