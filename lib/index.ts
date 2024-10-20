import { loadVueModule } from './loader/vue'
import type { LoaderOptions, ModuleExport, ModuleExportFn } from './types'
import { isFunction } from './utils'

export * from './types'

export async function load(path: string, options: LoaderOptions): Promise<ModuleExport> {
  const { moduleProvider, onResourceLoad, onModuleLoad } = options

  // moduleProvider should be defined with Object.create(null)
  if (moduleProvider instanceof Object) {
    Object.setPrototypeOf(moduleProvider, null)
  }

  if (path in moduleProvider) {
    if (isFunction(moduleProvider[path])) {
      return await moduleProvider[path](path, options)
    } else {
      return moduleProvider[path]
    }
  }

  const loader: ModuleExportFn = async () => {
    let module: ModuleExport | null | undefined

    const { content, type } = await onResourceLoad(path)
    if (onModuleLoad && isFunction(onModuleLoad)) {
      module = await onModuleLoad(type, content, path, options)
    }

    // internal module handle
    if (module === undefined) {
      switch (type) {
        case '.json':
          module = JSON.parse(await content())
          break
        case '.vue':
          module = await loadVueModule(await content(), path, options)
          break
        case '.js':
        case '.ts':
          // TODO
          break
      }
    }

    if (module === undefined) {
      throw new TypeError(`Unable to load ${type} files in ${path}`)
    }

    return (moduleProvider[path] = module!)
  }

  return (await loader(path, options))!
}
