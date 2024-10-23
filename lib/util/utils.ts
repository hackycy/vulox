import type { LoaderOptions } from './types'

export function createCJSModule(code: string, options: LoaderOptions) {
  const { moduleCache } = options

  const require = function (id: string) {
    if (id in moduleCache) {
      return moduleCache[id]
    }

    throw new Error(`Require module ${id} not found.`)
  }

  const module = {
    exports: {}
  }

  const fn = new Function('exports', 'require', 'module', code)
  fn.call(module.exports, module.exports, require, module)

  return module.exports
}

export function interopRequireDefault(obj: any): any {
  return obj && obj.__esModule ? obj : { default: obj }
}

export function isTSLang(lang: string | null | undefined) {
  return !!(lang && /(?:\.|\b)tsx?$/.test(lang))
}

export function isJSXLang(lang: string | null | undefined) {
  return !!(lang && /(?:\.|\b)[jt]sx$/.test(lang))
}

// eslint-disable-next-line ts/no-unsafe-function-type
export const isFunction = (val: unknown): val is Function => typeof val === 'function'
