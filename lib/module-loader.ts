import type { Module, Plugin, Result, VOptions } from './types'

export class ModuleLoader {
  private modules: Map<string, Module> = new Map()
  private options: VOptions

  constructor(options: VOptions) {
    this.options = options
  }

  public async load(_id: string = this.options.entry): Promise<void> {
    await this.resolveModule(_id, true)
  }

  private async resolveModule(id: string, _isEntry = false, _importer?: string): Promise<void> {}
}
