export type Preset = 'js' | 'ts' | 'jsx' | 'tsx'

export type ModuleId = string

export type ModuleExport = object | null

export interface Module {
  exports: ModuleExport
}

export interface LoaderOptions {
  modules: Record<ModuleId, any>
  loadFile: (path: string) => Promise<any>
  getResource: (path: string, ref?: string) => Promise<string>
  linkStyleSheet?: (style: string, scopeId?: string) => void
}
