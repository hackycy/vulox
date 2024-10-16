import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  server: {
    open: './play/index.html'
  },
  plugins: [nodePolyfills()]
})
