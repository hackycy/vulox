import { type Transform, transform } from 'sucrase'
import type { LoaderOptions, ModuleExport, Preset } from '../util/types'
import { createCJSModule } from '../util/utils'

export async function sucraseCJSPreprocessor(
  source: string,
  filename: string,
  options: LoaderOptions,
  presets?: Preset[]
): Promise<ModuleExport> {
  const plugins: Transform[] = ['imports']

  if (presets?.includes('typescript')) {
    plugins.push('typescript')
  }

  if (presets?.includes('jsx')) {
    plugins.push('jsx')
  }

  const transformed = transform(source, {
    filePath: filename,
    transforms: plugins,
    jsxRuntime: 'preserve'
  })

  return createCJSModule(transformed.code, options)
}
