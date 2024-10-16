import { type Transform, transform } from 'sucrase'
import type { ModuleExport } from '../types'
import type AbsTransfomer from './abstract-transfomer'

class SucraseTransformer implements AbsTransfomer {
  async process(source: string, filename: string): Promise<ModuleExport> {
    const plugins: Transform[] = ['imports']

    plugins.push('typescript')
    plugins.push('jsx')

    const transformed = transform(source, {
      transforms: plugins,
      jsxRuntime: filename.endsWith('.vue') ? 'preserve' : undefined
    })

    console.log(transformed.code)

    return {}
  }
}

export const transformer = new SucraseTransformer()
