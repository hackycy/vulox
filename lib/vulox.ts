import type { ModuleExport, VOptions } from './util/types'

export * from './util/types'

export async function load(options: VOptions): Promise<ModuleExport> {
  const { entry, getFiles } = options

  const entryFile = await getFiles(entry)

  if (entryFile) {
    // TODO
  }

  return null
}
