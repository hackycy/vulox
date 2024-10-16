import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import dts from 'vite-plugin-dts'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const libMap = [
  {
    entry: resolve(__dirname, '../lib/unw-loader.babel.ts'),
    name: 'babel'
  },
  {
    entry: resolve(__dirname, '../lib/unw-loader.sucrase.ts'),
    name: 'sucrase'
  }
]

async function startBuild() {
  for (let i = 0; i < libMap.length; i++) {
    const lib = libMap[i]

    await build({
      configFile: false,
      plugins: [
        dts({
          rollupTypes: true,
          tsconfigPath: resolve(__dirname, '../tsconfig.lib.json')
        }),
        // nodePolyfills() is only needed for babel
        ...[lib.name === 'babel' ? nodePolyfills() : undefined]
      ],
      build: {
        minify: 'esbuild',
        outDir: `dist/${lib.name}`,
        lib: {
          entry: lib.entry,
          name: 'NnLoader',
          formats: ['es', 'umd', 'iife'],
          fileName: (format) => {
            if (format === 'es') {
              return 'unw-loader.js'
            } else if (format === 'umd') {
              return 'unw-loader.umd.cjs'
            } else if (format === 'iife') {
              return 'unw-loader.global.js'
            } else {
              return `unw-loader.${format}.js`
            }
          }
        }
      }
    })
  }
}

startBuild()
