export type Preset = 'typescript' | 'jsx'

export type ModuleId = string

export type ModuleExport = object | null

export type ModuleExportFn = (id: ModuleId, options: LoaderOptions) => Promise<ModuleExport | null | undefined>

export interface Module {
  exports: ModuleExport
}

export interface Resource {
  type: string
  content: any
}

export interface CustomBlock {
  type: string
  content: string
  attrs: Record<string, string | true>
  lang?: string
  src?: string
}

export type Preprocessor = (source: string, filename: string, options: LoaderOptions, presets?: Preset[]) => Promise<ModuleExport>

export interface VueCompilerOptions {
  delimiters?: [string, string]
  whitespace?: 'preserve' | 'condense'
  isCustomElement: ((tag: string) => boolean) | undefined
  compileCustomBlock: (block: CustomBlock, filename: string, options: LoaderOptions, component: object) => Promise<void>
}

export interface LoaderOptions {
  moduleCache: Record<ModuleId, ModuleExport | ModuleExportFn>
  cjsPreprocessor: Preprocessor
  vueCompilerOptions?: VueCompilerOptions
  getResource: (path: string) => Promise<Resource>
  appendStyles?: (id: string, style: string) => void
  customModuleHandler?: (
    type: string,
    content: Resource['content'],
    path: string,
    options: LoaderOptions
  ) => Promise<ModuleExport | null | undefined>
}
