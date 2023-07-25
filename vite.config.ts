import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  define: {
    'import.meta.vitest': 'undefined'
  },
  build: {
    lib: {
      entry: './lib/index.ts',
      name: 'typed-selector',
      fileName: 'typed-selector'
    },
    minify: true
  },
  test: {
    includeSource: ['lib/**/*.{ts,js}'],
    include: [],
    coverage: {
      reporter: ['text', 'json-summary', 'html']
    },
    typecheck: {
      include: ['lib/**/*.{ts,js}']
    }
  },
  plugins: [
    dts({
      include: ['lib/**/*.ts'],
      staticImport: true
    })
  ]
})
