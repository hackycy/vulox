import type { ModuleExport, VOptions } from './types'

export * from './types'

export async function load(options: VOptions): Promise<ModuleExport> {
  const { getFile, entry } = options

  const entryContent = await getFile({ relPath: entry })

  // eslint-disable-next-line no-console
  console.log(entryContent)

  return null
}
