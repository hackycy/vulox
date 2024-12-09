import type { Module, Plugin, Result, VOptions } from './types'
import { isString } from './utils'

export class ModuleLoader {
  private modules: Map<string, Module> = new Map()
  private resolvedModules: Set<string> = new Set()
  private plugins: Plugin[]
  private readFile: (id: string) => string | Promise<string>

  constructor(options: VOptions) {
    this.plugins = options.plugins || []
    this.readFile = options.readFile
  }

  // 从入口开始查找所有模块
  async findAllModules(entryId: string): Promise<Map<string, Module>> {
    await this.resolveModule(entryId)
    return this.modules
  }

  // 解析单个模块及其依赖
  private async resolveModule(id: string, importer?: string): Promise<void> {
    // 避免重复解析
    if (this.resolvedModules.has(id)) {
      return
    }

    // 1. 解析模块ID
    const resolvedId = await this.resolveModuleId(id, importer)
    if (!resolvedId) {
      throw new Error(`Cannot resolve module: ${id}`)
    }

    // 2. 加载模块内容
    const code = await this.loadModuleContent(resolvedId)
    if (!isString(code)) {
      throw new Error(`Failed to load module: ${resolvedId}`)
    }

    // 3. 转换模块代码
    const transformed = await this.transformModule(code!, resolvedId)

    // 4. 解析依赖
    const dependencies = this.parseDependencies(transformed)

    // 5. 注册模块
    this.modules.set(resolvedId, {
      id: resolvedId,
      code: transformed,
      dependencies
    })

    this.resolvedModules.add(resolvedId)

    // 6. 递归解析依赖
    for (const dep of dependencies) {
      await this.resolveModule(dep, resolvedId)
    }
  }

  // 解析模块ID - 调用插件的 resolveId 钩子
  private async resolveModuleId(source: string, importer?: string): Promise<string | null> {
    for (const plugin of this.plugins) {
      if (plugin.resolveId) {
        const resolved = await plugin.resolveId(source, importer)
        if (resolved) {
          return resolved
        }
      }
    }
    return source
  }

  // 加载模块内容 - 调用插件的 load 钩子
  private async loadModuleContent(id: string): Promise<string | null> {
    // 先尝试使用插件加载
    for (const plugin of this.plugins) {
      if (plugin.load) {
        const result = await plugin.load(id)
        if (result) {
          return result
        }
      }
    }

    // 如果没有插件处理，使用默认的文件读取
    return this.readFile(id)
  }

  // 转换模块代码 - 调用插件的 transform 钩子
  private async transformModule(code: string, id: string): Promise<string> {
    let transformed = code

    for (const plugin of this.plugins) {
      if (plugin.transform) {
        const result = await plugin.transform(transformed, id)
        if (result) {
          transformed = result
        }
      }
    }

    return transformed
  }

  // 简单的依赖解析（实际中会更复杂）
  private parseDependencies(code: string): string[] {
    const dependencies: string[] = []

    // 简单的 import 语句匹配
    const importRegex = /import\s+.*?from\s+['"]([^'"]+)['"]/g
    let match

    // eslint-disable-next-line no-cond-assign
    while ((match = importRegex.exec(code)) !== null) {
      dependencies.push(match[1])
    }

    // 简单的 require 语句匹配
    const requireRegex = /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g
    // eslint-disable-next-line no-cond-assign
    while ((match = requireRegex.exec(code)) !== null) {
      dependencies.push(match[1])
    }

    return dependencies
  }
}

// 使用示例
export async function example() {
  // 创建插件
  const testPlugin: Plugin = {
    name: 'test-plugin',
    resolveId: (source) => {
      // 简单的路径解析
      if (source.startsWith('./')) {
        return source.slice(2)
      }
      return source
    },
    transform: async (code) => {
      // 简单的代码转换
      return code.replace('//# sourceMappingURL', '')
    }
  }

  // 创建加载器实例
  const loader = new ModuleLoader({
    entry: 'index.js',
    plugins: [testPlugin],
    moduleCache: {},
    readFile: async (id) => {
      // 模拟文件读取
      const files: Record<string, string> = {
        'index.js': `
            import { helper } from './helper';
            import { utils } from './utils';
            console.log(helper, utils);
          `,
        'helper.js': `
            import { utils } from './utils';
            export const helper = { utils };
          `,
        'utils.js': `
            export const utils = {};
          `
      }
      return files[id] || ''
    }
  })

  try {
    // 从入口文件开始查找所有模块
    const modules = await loader.findAllModules('index.js')
    // eslint-disable-next-line no-console
    console.log('Found modules:', Array.from(modules.keys()))
  } catch (error) {
    console.error('Error:', error)
  }
}
