export type Preset = 'typescript' | 'jsx'

export type ModuleId = string

export type ModuleExport = object | null

export type ModuleExportFn = (id: ModuleId, options: LoaderOptions) => Promise<ModuleExport | null | undefined>

export interface Module {
  exports: ModuleExport
}

export interface Resource {
  type: string
  content: () => Promise<any>
}

export type Processor = (source: string, filename: string, options: LoaderOptions, presets?: Preset[]) => Promise<ModuleExport>

export interface VueCompilerOptions {
  delimiters?: [string, string]
  whitespace?: 'preserve' | 'condense'
  isCustomElement: ((tag: string) => boolean) | undefined
}

export interface LoaderOptions {
  moduleProvider: Record<ModuleId, ModuleExport | ModuleExportFn>
  cjsProcessor: Processor
  vueCompilerOptions?: VueCompilerOptions
  onResourceLoad: (path: string) => Promise<Resource>
  onStyleLoad: (id: string, style: string) => void
  onModuleLoad?: (
    type: string,
    content: Resource['content'],
    path: string,
    options: LoaderOptions
  ) => Promise<ModuleExport | null | undefined>
}
