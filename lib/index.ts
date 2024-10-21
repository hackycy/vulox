import { handleVueModule } from './handler/vue'
import { handleStandardModule } from './handler/standard'
import { handleCSSModule } from './handler/css'
import type { LoaderOptions, ModuleExport, ModuleExportFn } from './types'
import { isFunction } from './utils'

export * from './types'

export async function load(path: string, options: LoaderOptions): Promise<ModuleExport> {
  const { moduleProvider, getResource, customModuleProvider } = options

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
    let module: ModuleExport | undefined

    const { content, type } = await getResource(path)
    if (customModuleProvider && isFunction(customModuleProvider)) {
      module = await customModuleProvider(type, content, path, options)
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

    if (module === undefined) {
      throw new TypeError(`Unable to load ${type} files in ${path}`)
    }

    return (moduleProvider[path] = module!)
  }

  return (await loader(path, options))!
}
