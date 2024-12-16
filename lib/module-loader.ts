import type { Module, Plugin, Result, VOptions } from './types'

export class ModuleLoader {
  private options: VOptions

  constructor(options: VOptions) {
    this.options = options
  }
}
