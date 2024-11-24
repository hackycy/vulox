import { type Transform, transform as sucraseTransform } from 'sucrase'
import type { Code, TransformOptions } from '../util/types'

export async function transform(source: string, opt: TransformOptions): Promise<Code> {
  const plugins: Transform[] = ['imports']

  if (opt.presets?.includes('typescript')) {
    plugins.push('typescript')
  }

  if (opt.presets?.includes('jsx')) {
    plugins.push('jsx')
  }

  const transformed = sucraseTransform(source, {
    filePath: opt.filename,
    transforms: plugins,
    jsxRuntime: 'preserve'
  })

  return transformed.code
}
