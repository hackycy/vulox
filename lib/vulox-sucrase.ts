import type { LoaderOptions, ModuleExport } from './types'
import { sucraseCJSPreprocessor } from './processor/sucrase'
import { load as _load } from './vulox-core'

export async function load(path: string, options: LoaderOptions): Promise<ModuleExport> {
  return _load(path, {
    ...options,
    cjsPreprocessor: sucraseCJSPreprocessor
  })
}
