import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
  resolve: {
    alias: {
      '@amowu/shared': '../../packages/shared/src/index.ts',
    },
  },
})
