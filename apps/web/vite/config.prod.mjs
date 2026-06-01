import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

export default defineConfig({
  plugins: [
    TanStackRouterVite({ target: 'react', autoCodeSplitting: true }),
    react(),
  ],
  resolve: {
    alias: {
      // @amowu/shared dist is CJS (built for NestJS); Vite reads source TS directly
      '@amowu/shared': fileURLToPath(
        new URL('../../../packages/shared/src/index.ts', import.meta.url),
      ),
    },
  },
  build: {
    outDir: 'dist',
  },
})
