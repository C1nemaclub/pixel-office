import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
    host: true,
  },
  resolve: {
    alias: {
      'readable-stream': 'vite-compatible-readable-stream',
    },
  },
  // define: {
  //   global: 'window',
  //   // 'process.env': {},
  //   'process.env': process.env,
  // },
  // build: {
  //   rollupOptions: {
  //     external: ['window'],
  //   },
  // },
});
