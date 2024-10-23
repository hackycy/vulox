import { handleVueModule } from './handler/vue'
import { handleStandardModule } from './handler/standard'
import { handleCSSModule } from './handler/css'
import type { LoaderOptions, ModuleExport, ModuleExportFn } from './util/types'
import { isFunction } from './util/utils'

export * from './util/types'

export async function load(path: string, options: LoaderOptions): Promise<ModuleExport> {
  const { moduleCache, getResource, customModuleHandler } = options

  // moduleProvider should be defined with Object.create(null)
  if (moduleCache instanceof Object) {
    Object.setPrototypeOf(moduleCache, null)
  }

  if (path in moduleCache) {
    if (isFunction(moduleCache[path])) {
      return await moduleCache[path](path, options)
    } else {
      return moduleCache[path]
    }
  }

  const loader: ModuleExportFn = async () => {
    let module: ModuleExport | undefined

    const { content, type } = await getResource(path)
    if (customModuleHandler && isFunction(customModuleHandler)) {
      module = await customModuleHandler(type, content, path, options)
    }

    // internal module handle
    if (module === undefined) {
      switch (type) {
        case '.json':
          module = JSON.parse(content)
          break
        case '.vue':
          module = await handleVueModule(type, content, path, options)
          break
        case '.js':
        case '.ts':
        case '.jsx':
        case '.tsx':
          module = await handleStandardModule(type, content, path, options)
          break
        case '.css':
          module = await handleCSSModule(type, content, path, options)
          break
      }
    }

    // undefined will be unhandleable type
    if (module === undefined) {
      throw new TypeError(`Unable to load ${type} files in ${path}`)
    }

    return (moduleCache[path] = module!)
  }

  return (await loader(path, options))!
}
