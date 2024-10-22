import type { LoaderOptions, ModuleExport } from './types'
import { babelCJSPreprocessor } from './processor/babel'
import { load as _load } from './vulox-core'

export async function load(path: string, options: LoaderOptions): Promise<ModuleExport> {
  return _load(path, {
    ...options,
    cjsPreprocessor: babelCJSPreprocessor
  })
}
