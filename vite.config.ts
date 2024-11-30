import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import dts from 'vite-plugin-dts'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  server: {
    open: './play/index.html'
  },
  plugins: [
    nodePolyfills(),
    dts({
      rollupTypes: true,
      tsconfigPath: resolve(__dirname, './tsconfig.lib.json')
    })
  ],
  build: {
    lib: {
      entry: './lib/vulox.ts',
      name: 'Vulox',
      formats: ['es', 'umd', 'iife'],
      fileName: 'vulox'
    }
  }
})
