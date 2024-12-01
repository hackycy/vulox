export type Preset = 'typescript' | 'jsx'

export type Rule = string | RegExp

export type ModuleId = string

export type ModuleExport = object | null

export interface Module {
  exports: ModuleExport
}

export interface TransformOptions {
  filename?: string
  presets?: Preset[]
}

export interface PathContext {
  /** reference path */
  refPath?: string
  /** relative to @refPath */
  relPath: string
}

export interface VOptions {
  entry: string
  modules: Record<string, ModuleExport>
  getFile: (pathCtx: PathContext) => string | Promise<string>
}
