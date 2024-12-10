export type Result = string | null | undefined

export interface Plugin {
  name: string
  resolveId?: (source: string, importer: string | undefined) => Result
  load?: (id: string) => Result | Promise<Result>
  transform?: (code: string, id: string) => Result | Promise<Result>
}

export interface Module {
  id: string
  code: string
  dependencies: string[]
}

export interface VOptions {
  entry: string
  moduleCache: Record<string, any>
  plugins?: Plugin[]
  readFile: (id: string) => string | Promise<string>
  pathResolve?: (source: string, importer?: string) => string
}
