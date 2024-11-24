import type { ModuleExport, VOptions } from './util/types'

export * from './util/types'

export async function load(_options: VOptions): Promise<ModuleExport> {
  return null
}
