import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.OPENAI_API_KEY': JSON.stringify(process.env.OPENAI_API_KEY)
  },
  build: {
    rollupOptions: {
      external: ['pdfjs-dist/build/pdf.worker.entry'],
    },
  },
});
