import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
  },
  define: {
    global: 'window',
    // 'process.env': {},
    'process.env': process.env,
  },
});
