export type Preset = 'typescript' | 'jsx'

export type ModuleId = string

export type ModuleExport = object | null

export interface Module {
  exports: ModuleExport
}

export interface TransformOptions {
  filename?: string
  presets?: Preset[]
}

export type Code = string | undefined | null

export interface VOptions {
  entry: string
  importMap: Record<string, ModuleExport>
  getFiles: (path: string) => string | Promise<string>
}
