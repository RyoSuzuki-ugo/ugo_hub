import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@repo/shared-ui': path.resolve(__dirname, '../../packages/shared-ui/src'),
      '@repo/websocket-client': path.resolve(__dirname, '../../packages/websocket-client/src'),
    },
  },
  server: {
    port: 4003,
  },
});
