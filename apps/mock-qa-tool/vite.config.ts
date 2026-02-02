import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@repo/feature': path.resolve(__dirname, '../../packages/feature/src'),
      '@repo/api-client': path.resolve(__dirname, '../../packages/api-client/src'),
      '@repo/shared-ui': path.resolve(__dirname, '../../packages/shared-ui/src'),
      '@repo/design-system': path.resolve(__dirname, '../../packages/design-system/src'),
    },
  },
  server: {
    port: 4004,
  },
});
