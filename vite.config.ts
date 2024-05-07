/// <reference types="vitest" />
// import legacy from '@vitejs/plugin-legacy';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { defineConfig } from 'vite';

import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { IonicResolver, VarletUIResolver } from 'unplugin-vue-components/resolvers';

import { visualizer } from 'rollup-plugin-visualizer';
import analyze from 'rollup-plugin-analyzer';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true,
    proxy: {
      '^/.*.php': {
        target: 'https://www.tsdm39.com',
        changeOrigin: true,
      },
    },
  },
  plugins: [
    vue(),
    // legacy(),
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      eslintrc: {
        enabled: true,
      },
      resolvers: [VarletUIResolver({ autoImport: true })],
    }),
    Components({
      resolvers: [IonicResolver(), VarletUIResolver()],
    }),
    analyze(),
    visualizer(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '#': path.resolve(__dirname, './types'),
    },
  },
  build: {
    chunkSizeWarningLimit: 1024,
    target: 'esnext',
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
});
