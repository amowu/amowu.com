import { defineConfig } from 'vitest/config'
import { resolve } from 'node:path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
  resolve: {
    alias: {
      '@amowu/shared': resolve(__dirname, '../../packages/shared/src/index.ts'),
    },
  },
})
