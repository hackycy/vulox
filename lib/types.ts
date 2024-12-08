export type Result = string | null

export interface Plugin {
  name: string
  resolveId?: (id: string) => Result
  load?: (id: string) => Result | Promise<Result>
}

export interface VOptions {
  entry: string
  moduleCache: Record<string, any>
  getFile: (id: string) => string | Promise<string>
}
