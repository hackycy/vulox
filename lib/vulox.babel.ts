import type { LoaderOptions, ModuleExport } from './util/types'
import { babelCJSPreprocessor } from './processor/babel'
import { load as _load } from './vulox'

export async function load(path: string, options: LoaderOptions): Promise<ModuleExport> {
  return _load(path, {
    ...options,
    cjsPreprocessor: babelCJSPreprocessor
  })
}
